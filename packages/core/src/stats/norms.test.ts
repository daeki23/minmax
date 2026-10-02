import { describe, expect, it } from "vitest";
import { PROFILE } from "../__fixtures__/measurements.js";
import { SYNTHETIC_TABLES, syntheticNorms } from "../__fixtures__/norms.js";
import type { NormTable } from "./norms.js";
import { percentileFor } from "./norms.js";

const vo2 = SYNTHETIC_TABLES.find((t) => t.metric === "vo2max") as NormTable;
const rhr = SYNTHETIC_TABLES.find((t) => t.metric === "resting_hr") as NormTable;

describe("percentileFor", () => {
  it("maps the median value to the 50th percentile", () => {
    expect(percentileFor(vo2, 42, 30)).toBeCloseTo(50, 5);
  });

  it("interpolates between knots monotonically for higher-is-better", () => {
    const a = percentileFor(vo2, 44, 30) as number;
    const b = percentileFor(vo2, 46, 30) as number;
    const c = percentileFor(vo2, 48, 30) as number;
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });

  it("never returns 100 or 0: tails are capped at 99 / 1", () => {
    expect(percentileFor(vo2, 90, 30)).toBeLessThanOrEqual(99);
    expect(percentileFor(vo2, 90, 30)).toBeGreaterThan(95);
    expect(percentileFor(vo2, 10, 30)).toBeGreaterThanOrEqual(1);
    expect(percentileFor(vo2, 10, 30)).toBeLessThan(5);
  });

  it("inverts for lower-is-better metrics: lower resting HR → higher percentile", () => {
    const low = percentileFor(rhr, 50, 30) as number;
    const mid = percentileFor(rhr, 65, 30) as number;
    const high = percentileFor(rhr, 80, 30) as number;
    expect(low).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(high);
    expect(mid).toBeCloseTo(50, 5);
  });

  it("scores healthy bands high for band tables (sleep 7–9 h)", () => {
    const sleep = SYNTHETIC_TABLES.find((t) => t.metric === "sleep_duration_h");
    if (!sleep) throw new Error("fixture missing");
    expect(percentileFor(sleep, 8, 30)).toBeGreaterThanOrEqual(90);
    expect(percentileFor(sleep, 5, 30)).toBeLessThan(30);
    expect(percentileFor(sleep, 11, 30)).toBeLessThan(30);
  });

  it("returns null when no age band covers the user", () => {
    const young: NormTable = {
      ...vo2,
      bands: [{ ...(vo2.bands[0] as NormTable["bands"][number]), minAge: 40, maxAge: 49 }],
    };
    expect(percentileFor(young, 42, 30)).toBeNull();
  });

  it("registry falls back to pooled tables when no sex-specific table exists", () => {
    expect(syntheticNorms.find("vo2max", PROFILE)?.sex).toBe("pooled");
    expect(syntheticNorms.find("vo2max", { ...PROFILE, sex: "unspecified" })?.sex).toBe("pooled");
  });
});
