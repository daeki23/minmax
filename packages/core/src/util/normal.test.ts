import { describe, expect, it } from "vitest";
import { normalCdf, percentileToZ, probit, zToPercentile } from "./normal.js";

describe("normal", () => {
  it("Φ matches tabulated values", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 4);
    expect(normalCdf(-1.645)).toBeCloseTo(0.05, 3);
  });

  it("probit inverts Φ across the range", () => {
    for (const p of [0.001, 0.01, 0.05, 0.25, 0.5, 0.75, 0.95, 0.99, 0.999]) {
      expect(normalCdf(probit(p))).toBeCloseTo(p, 7);
    }
    expect(probit(0.975)).toBeCloseTo(1.959964, 5);
  });

  it("rejects p outside (0,1)", () => {
    expect(() => probit(0)).toThrow(RangeError);
    expect(() => probit(1)).toThrow(RangeError);
  });

  it("percentile helpers round-trip", () => {
    expect(zToPercentile(percentileToZ(84.13))).toBeCloseTo(84.13, 6);
  });
});
