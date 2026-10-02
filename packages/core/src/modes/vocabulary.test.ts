import { describe, expect, it } from "vitest";
import { NOW } from "../__fixtures__/measurements.js";
import type { StatValue } from "../types/stat.js";
import { bottleneckLine, levelLine, ordinal, statLine, xpLine } from "./vocabulary.js";

const point: StatValue = {
  stat: "aerobic",
  kind: "point",
  value: 72,
  confidence: 0.8,
  trustLevel: 2,
  normStatus: "verified",
  basis: "population",
  contributions: [],
  computedAt: NOW,
  engineVersion: "test",
};
const range: StatValue = {
  stat: "mobility",
  kind: "range",
  low: 40,
  high: 60,
  mid: 50,
  confidence: 0.5,
  trustLevel: 1,
  normStatus: "verified",
  basis: "population",
  contributions: [],
  computedAt: NOW,
  engineVersion: "test",
};
const none: StatValue = {
  stat: "power",
  kind: "unmeasured",
  missing: [],
  contributions: [],
  computedAt: NOW,
  engineVersion: "test",
};

describe("vocabulary", () => {
  it("renders the same stat in both modes", () => {
    expect(statLine("game", point)).toBe("Aerobic 72");
    expect(statLine("simple", point)).toBe("Aerobic: 72nd percentile for your age");
    expect(statLine("game", range)).toBe("Mobility 40–60");
    expect(statLine("simple", none)).toBe("Power: not measured yet");
  });

  it("never says 'percentile' for criterion or mixed-basis stats", () => {
    const criterion: StatValue = { ...point, stat: "movement", value: 95, basis: "criterion" };
    expect(statLine("simple", criterion)).toBe("Movement: score 95 of 100 against health guidelines");
    const mixed: StatValue = { ...range, basis: "mixed" };
    expect(statLine("simple", mixed)).not.toMatch(/percentile/);
    expect(statLine("game", criterion)).toBe("Movement 95");
  });

  it("ordinals", () => {
    expect(ordinal(1)).toBe("1st");
    expect(ordinal(2)).toBe("2nd");
    expect(ordinal(3)).toBe("3rd");
    expect(ordinal(11)).toBe("11th");
    expect(ordinal(12)).toBe("12th");
    expect(ordinal(13)).toBe("13th");
    expect(ordinal(21)).toBe("21st");
    expect(ordinal(72)).toBe("72nd");
    expect(ordinal(99)).toBe("99th");
  });

  it("bottleneck, level and xp lines", () => {
    expect(bottleneckLine("game", "mobility")).toBe("Mobility is holding your build back.");
    expect(bottleneckLine("simple", null)).toMatch(/Measure a few more/);
    expect(levelLine("game", 12, 11)).toBe("LEVEL 12 — level up");
    expect(levelLine("simple", 11, 12)).toMatch(/slipped/);
    expect(xpLine("game", 8420, 10000)).toBe("XP 8,420 / 10,000");
    expect(xpLine("simple", 8420, 10000)).toBe("84 % of this chapter's plan done");
  });
});
