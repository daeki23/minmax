import { describe, expect, it } from "vitest";
import { fitUserMeasurements, m, NOW, PROFILE } from "../__fixtures__/measurements.js";
import { syntheticNorms } from "../__fixtures__/norms.js";
import { resolveAll } from "../provenance/resolve.js";
import { STATS } from "../types/stat.js";
import { computeAllStats, computeStat } from "./compute.js";

function ctxFor(measurements = fitUserMeasurements()) {
  return {
    profile: PROFILE,
    norms: syntheticNorms,
    estimates: resolveAll(measurements, { now: NOW }),
    now: NOW,
  };
}

describe("computeStat", () => {
  it("produces a point value with full coverage and device/app confidence", () => {
    const s = computeStat("aerobic", ctxFor());
    expect(s.kind).toBe("point");
    if (s.kind !== "point") return;
    expect(s.value).toBeGreaterThan(70); // VO2max 52 on a p50=42/σ=7 table is well above median
    expect(s.normStatus).toBe("synthetic"); // fixtures must be labelled as such
    expect(s.contributions.map((c) => c.metric)).toEqual(["vo2max", "resting_hr", "aerobic_minutes_week"]);
  });

  it("is unmeasured when nothing is known", () => {
    const s = computeStat("power", ctxFor([]));
    expect(s.kind).toBe("unmeasured");
    if (s.kind !== "unmeasured") return;
    expect(s.missing).toEqual(["vertical_jump_cm", "broad_jump_cm", "sprint_10m_s"]);
  });

  it("falls back to a range when coverage is partial", () => {
    // Only grip (weight 0.25 of 1.0) → coverage 25 % → below point threshold, above unmeasured threshold.
    const s = computeStat("strength", ctxFor([m("grip_kg", 52)]));
    expect(s.kind).toBe("range");
    if (s.kind !== "range") return;
    expect(s.low).toBeLessThan(s.mid);
    expect(s.high).toBeGreaterThan(s.mid);
    expect(s.high - s.low).toBeGreaterThanOrEqual(10);
  });

  it("falls back to a range when the only data is low-confidence self-report", () => {
    const s = computeStat(
      "nutrition",
      ctxFor([
        m("protein_g_per_kg_day", 1.8, { source: "self" }),
        m("fiber_g_day", 30, { source: "self" }),
        m("plant_servings_day", 5, { source: "self" }),
        m("waist_to_height", 0.45, { source: "self" }),
        m("body_fat_pct", 15, { source: "self" }),
      ]),
    );
    expect(s.kind).toBe("range");
  });

  it("trust level of a stat is the weakest contributing measurement", () => {
    const s = computeStat("nutrition", ctxFor());
    if (s.kind === "unmeasured") throw new Error("expected measured");
    expect(s.trustLevel).toBe(0); // protein/fiber/plants are self-reported
  });

  it("computes all seven stats and keeps values inside 1..99", () => {
    const all = computeAllStats(ctxFor());
    for (const id of STATS) {
      const s = all[id];
      if (s.kind === "point") {
        expect(s.value).toBeGreaterThanOrEqual(1);
        expect(s.value).toBeLessThanOrEqual(99);
      }
    }
  });
});
