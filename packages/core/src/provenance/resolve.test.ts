import { describe, expect, it } from "vitest";
import { m, NOW } from "../__fixtures__/measurements.js";
import { priorConfidence, recencyFactor, withProvenance } from "./confidence.js";
import { aggregateDaily, resolveMetric } from "./resolve.js";

describe("provenance priors", () => {
  it("orders confidence by trust level", () => {
    const self = priorConfidence("vo2max", "self", 0);
    const app = priorConfidence("vo2max", "minmax_app", 1);
    const device = priorConfidence("vo2max", "garmin", 2);
    const lab = priorConfidence("vo2max", "lab", 3, "cpet");
    expect(self).toBeLessThan(app);
    expect(app).toBeLessThan(device);
    expect(device).toBeLessThan(lab);
  });

  it("a self-typed value never earns more than self-report confidence, whatever trust is requested", () => {
    const typed = withProvenance({
      id: "x",
      userId: "u",
      metric: "ldl_mg_dl",
      value: 90,
      unit: "mg/dL",
      measuredAt: NOW,
      recordedAt: NOW,
      source: "self",
      trustLevel: 3,
    });
    expect(typed.trustLevel).toBe(0);
    expect(typed.confidence).toBe(priorConfidence("ldl_mg_dl", "self", 0));
  });

  it("recency is flat inside the window and never decays below 25 %", () => {
    expect(recencyFactor(10, 30)).toBe(1);
    expect(recencyFactor(60, 30)).toBeLessThan(1);
    expect(recencyFactor(1000, 30)).toBe(0.25);
  });
});

describe("resolveMetric", () => {
  it("prefers the highest trust level even if older", () => {
    const lab = m("vo2max", 55, { source: "lab", method: "cpet", daysAgo: 20 });
    const garmin = m("vo2max", 50, { source: "garmin", daysAgo: 1 });
    const e = resolveMetric("vo2max", [lab, garmin], { now: NOW });
    expect(e?.value).toBe(55);
    expect(e?.trustLevel).toBe(3);
    expect(e?.rule).toBe("highest_trust");
  });

  it("within one trust level prefers the most recent", () => {
    const old = m("vo2max", 48, { source: "garmin", daysAgo: 20 });
    const fresh = m("vo2max", 51, { source: "garmin", daysAgo: 2 });
    const e = resolveMetric("vo2max", [old, fresh], { now: NOW });
    expect(e?.value).toBe(51);
    expect(e?.rule).toBe("most_recent");
  });

  it("raises confidence when two same-trust sources agree within tolerance", () => {
    const g = m("vo2max", 52, { source: "garmin", daysAgo: 1 });
    const a = m("vo2max", 50.5, { source: "apple_health", daysAgo: 3 });
    const e = resolveMetric("vo2max", [g, a], { now: NOW });
    expect(e?.rule).toBe("corroborated");
    expect(e?.confidence).toBeGreaterThan(g.confidence);
    expect(e?.sources).toEqual(expect.arrayContaining(["garmin", "apple_health"]));
  });

  it("flags and penalises disagreement beyond tolerance, keeping the preferred value", () => {
    const g = m("vo2max", 52, { source: "garmin", daysAgo: 1 });
    const a = m("vo2max", 46, { source: "apple_health", daysAgo: 2 });
    const e = resolveMetric("vo2max", [g, a], { now: NOW });
    expect(e?.value).toBe(52);
    expect(e?.rule).toBe("disagreement");
    expect(e?.disagreement?.withSource).toBe("apple_health");
    expect(e?.confidence).toBeLessThan(g.confidence);
  });

  it("never averages across trust levels", () => {
    const lab = m("vo2max", 60, { source: "lab", method: "cpet", daysAgo: 5 });
    const self = m("vo2max", 40, { source: "self", daysAgo: 0 });
    const e = resolveMetric("vo2max", [lab, self], { now: NOW });
    expect(e?.value).toBe(60);
    expect(e?.sources).toEqual(["lab"]);
  });

  it("rejects implausible values and ignores stale data", () => {
    const bogus = m("vo2max", 250, { source: "self" });
    const stale = m("vo2max", 50, { source: "garmin", daysAgo: 400 });
    expect(resolveMetric("vo2max", [bogus, stale], { now: NOW })).toBeNull();
  });

  it("ignores measurements from the future", () => {
    const future = m("vo2max", 50, { source: "garmin", daysAgo: -2 });
    expect(resolveMetric("vo2max", [future], { now: NOW })).toBeNull();
  });
});

describe("aggregateDaily", () => {
  it("sums step samples per source per day and keeps the best trust / lowest confidence", () => {
    const a = m("steps_day", 3000, { source: "garmin", daysAgo: 0 });
    const b = m("steps_day", 4500, { source: "garmin", daysAgo: 0 });
    const other = m("steps_day", 7000, { source: "apple_health", daysAgo: 0 });
    const out = aggregateDaily("steps_day", [a, b, other], "sum");
    expect(out).toHaveLength(2);
    const garmin = out.find((x) => x.source === "garmin");
    expect(garmin?.value).toBe(7500);
  });
});
