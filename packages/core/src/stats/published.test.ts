import { describe, expect, it } from "vitest";
import { fitUserMeasurements, NOW, PROFILE } from "../__fixtures__/measurements.js";
import { resolveAll } from "../provenance/resolve.js";
import type { Metric } from "../types/metric.js";
import { METRIC_SPECS, METRICS } from "../types/metric.js";
import { computeAllStats } from "./compute.js";
import type { NormTable } from "./norms.js";
import { deepestPublishedPercentile, isBandTable, percentileFor } from "./norms.js";
import { metricsWithoutPublishedTable, PUBLISHED_TABLES, publishedNorms } from "./published.js";

function table(metric: Metric, sex: "male" | "female" | "pooled"): NormTable {
  const t = PUBLISHED_TABLES.find((x) => x.metric === metric && x.sex === sex);
  if (!t || isBandTable(t)) throw new Error(`no percentile table for ${metric}/${sex}`);
  return t;
}

describe("published tables: integrity", () => {
  it("every table is cited, versioned and labelled provisional or verified, never synthetic", () => {
    for (const t of PUBLISHED_TABLES) {
      expect(t.source.length).toBeGreaterThan(20);
      expect(t.version).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
      expect(t.status).not.toBe("synthetic");
      expect(t.bands.length).toBeGreaterThan(0);
    }
  });

  it("percentile anchors are monotone in the metric's direction and have at least two points", () => {
    for (const t of PUBLISHED_TABLES) {
      if (isBandTable(t)) continue;
      expect(t.basis).toBe("population");
      const higher = METRIC_SPECS[t.metric].direction !== "lower";
      for (const b of t.bands) {
        expect(b.anchors.length).toBeGreaterThanOrEqual(2);
        for (let i = 1; i < b.anchors.length; i++) {
          const [p0, v0] = b.anchors[i - 1] as readonly [number, number];
          const [p1, v1] = b.anchors[i] as readonly [number, number];
          expect(p1).toBeGreaterThan(p0);
          if (higher) expect(v1).toBeGreaterThan(v0);
          else expect(v1).toBeLessThan(v0);
        }
      }
    }
  });

  it("criterion tables say so and keep scores inside 1..99", () => {
    for (const t of PUBLISHED_TABLES) {
      if (!isBandTable(t)) continue;
      expect(t.basis).toBe("criterion");
      for (const b of t.bands)
        for (const [, score] of b.knots) {
          expect(score).toBeGreaterThanOrEqual(1);
          expect(score).toBeLessThanOrEqual(99);
        }
    }
  });

  it("age bands of each (metric, sex) table are contiguous and non-overlapping", () => {
    for (const t of PUBLISHED_TABLES) {
      const bands = [...t.bands].sort((a, b) => a.minAge - b.minAge);
      for (let i = 1; i < bands.length; i++) {
        const prev = bands[i - 1] as { maxAge: number };
        const cur = bands[i] as { minAge: number };
        expect(cur.minAge).toBe(prev.maxAge + 1);
      }
    }
  });

  it("lists the metrics that honestly have no reference yet", () => {
    const missing = metricsWithoutPublishedTable(METRICS);
    expect(missing).toEqual(
      expect.arrayContaining([
        "pullups_max",
        "squat_1rm_ratio",
        "sprint_10m_s",
        "broad_jump_cm",
        "shoulder_flexion_deg",
        "plant_servings_day",
        "sedentary_break_count_day",
      ]),
    );
    expect(missing).not.toContain("vo2max");
    expect(missing).not.toContain("grip_kg");
  });
});

describe("published tables: values", () => {
  it("FRIEND: a 32-year-old man with VO2max 52 sits between the 75th and 95th percentile", () => {
    const p = percentileFor(table("vo2max", "male"), 52, 32) as number;
    expect(p).toBeGreaterThan(75);
    expect(p).toBeLessThan(95);
    // Age 35 sits just past the 30-39 midpoint, so the value blends slightly toward the 40-49 band.
    expect(Math.abs((percentileFor(table("vo2max", "male"), 38.6, 35) as number) - 50)).toBeLessThan(1.5);
  });

  it("FRIEND: the same VO2max ranks higher for women and for older adults", () => {
    const men = percentileFor(table("vo2max", "male"), 40, 45) as number;
    const women = percentileFor(table("vo2max", "female"), 40, 45) as number;
    const older = percentileFor(table("vo2max", "male"), 40, 65) as number;
    expect(women).toBeGreaterThan(men);
    expect(older).toBeGreaterThan(men);
  });

  it("Dodds: exact-age medians are reproduced and ages between them are blended", () => {
    const men = table("grip_kg", "male");
    expect(percentileFor(men, 51, 30)).toBeCloseTo(50, 0);
    expect(percentileFor(men, 40, 20)).toBeCloseTo(50, 0);
    const at72 = percentileFor(men, 37, 72) as number;
    const at70 = percentileFor(men, 37, 70) as number;
    const at75 = percentileFor(men, 37, 75) as number;
    expect(at72).toBeGreaterThan(at70);
    expect(at72).toBeLessThan(at75);
  });

  it("Dodds: the deepest published percentile is 90, so anything above is a modelled tail", () => {
    expect(deepestPublishedPercentile(table("grip_kg", "female"))).toBe(90);
    expect(deepestPublishedPercentile(table("vo2max", "male"))).toBe(95);
    const p = percentileFor(table("grip_kg", "male"), 75, 30) as number;
    expect(p).toBeGreaterThan(90);
    expect(p).toBeLessThanOrEqual(99);
  });

  it("NHANES: lower LDL-C is a higher fitness percentile and the median is 112 mg/dL", () => {
    const ldl = table("ldl_mg_dl", "pooled");
    expect(percentileFor(ldl, 112, 40)).toBeCloseTo(50, 0);
    expect(percentileFor(ldl, 72, 40)).toBeCloseTo(90, 0);
    expect(percentileFor(ldl, 176, 40)).toBeCloseTo(5, 0);
  });

  it("resting HR is inverted: 50 bpm ranks far above 80 bpm", () => {
    const rhr = table("resting_hr", "male");
    expect(percentileFor(rhr, 50, 30) as number).toBeGreaterThan(90);
    expect(percentileFor(rhr, 80, 30) as number).toBeLessThan(10);
  });

  it("steps are a dose-response score: the plateau comes earlier at 60+", () => {
    const steps = PUBLISHED_TABLES.find((t) => t.metric === "steps_day");
    if (!steps) throw new Error("missing");
    expect(percentileFor(steps, 7000, 30) as number).toBeLessThan(percentileFor(steps, 7000, 65) as number);
    expect(percentileFor(steps, 2000, 30)).toBe(5);
  });

  it("chair stand applies only from age 60; younger users fall back to nothing", () => {
    expect(publishedNorms.find("sit_to_stand_30s", PROFILE)).toBeNull();
    expect(publishedNorms.find("sit_to_stand_30s", { ...PROFILE, age: 66 })?.sex).toBe("male");
  });

  it("the fixture user gets population-based Aerobic and mixed-basis Strength on real tables", () => {
    const estimates = resolveAll(fitUserMeasurements(), { now: NOW });
    const stats = computeAllStats({ profile: PROFILE, norms: publishedNorms, estimates, now: NOW });
    expect(stats.aerobic.kind).toBe("point");
    if (stats.aerobic.kind !== "point") return;
    expect(stats.aerobic.basis).toBe("mixed"); // VO2max/RHR population, WHO minutes criterion
    expect(stats.aerobic.normStatus).toBe("provisional");
    expect(stats.aerobic.value).toBeGreaterThan(75);
    expect(stats.mobility.kind).not.toBe("unmeasured");
    if (stats.mobility.kind === "unmeasured") return;
    expect(stats.mobility.basis).toBe("criterion");
  });
});
