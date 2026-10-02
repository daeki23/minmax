import { describe, expect, it } from "vitest";
import { NOW } from "../__fixtures__/measurements.js";
import type { StatId, StatValue } from "../types/stat.js";
import { STATS } from "../types/stat.js";
import { BOTTLENECK_SWITCH_DAYS, INITIAL_BOTTLENECK, updateBottleneck } from "./bottleneck.js";
import { buildWeights, classForAnswer, proposeBuild } from "./class.js";
import { characterLevel } from "./level.js";
import { deriveOrigin } from "./origin.js";
import { homeRegion, regionStatus, unlockedRegions } from "./regions.js";

function point(stat: StatId, value: number, confidence = 0.8): StatValue {
  return {
    stat,
    kind: "point",
    value,
    confidence,
    trustLevel: 2,
    normStatus: "synthetic",
    contributions: [],
    computedAt: NOW,
  };
}
function unmeasured(stat: StatId): StatValue {
  return { stat, kind: "unmeasured", missing: [], contributions: [], computedAt: NOW };
}
function sheet(values: Partial<Record<StatId, number>>, confidence = 0.8): Record<StatId, StatValue> {
  const out = {} as Record<StatId, StatValue>;
  for (const s of STATS)
    out[s] = values[s] === undefined ? unmeasured(s) : point(s, values[s] as number, confidence);
  return out;
}

describe("deriveOrigin", () => {
  it("is shape, not height: a low profile with a strength edge is Ironblood", () => {
    const low = sheet({ strength: 35, aerobic: 20, mobility: 18, movement: 22, recovery: 21 });
    const r = deriveOrigin(low, NOW);
    expect(r.ok && r.origin.id).toBe("ironblood");
  });

  it("the same shape at elite height is also Ironblood", () => {
    const high = sheet({ strength: 95, aerobic: 80, mobility: 78, movement: 82, recovery: 81 });
    const r = deriveOrigin(high, NOW);
    expect(r.ok && r.origin.id).toBe("ironblood");
  });

  it("a flat profile is Evenkin", () => {
    const flat = sheet({
      strength: 52,
      aerobic: 50,
      mobility: 49,
      movement: 54,
      recovery: 51,
      nutrition: 50,
    });
    const r = deriveOrigin(flat, NOW);
    expect(r.ok && r.origin.id).toBe("evenkin");
  });

  it("needs at least four measured stats and names what is missing", () => {
    const r = deriveOrigin(sheet({ strength: 60, aerobic: 40 }), NOW);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.measured).toBe(2);
    expect(r.missing).toContain("mobility");
  });

  it("ignores low-confidence stats", () => {
    const r = deriveOrigin(sheet({ strength: 60, aerobic: 40, mobility: 50, movement: 45 }, 0.3), NOW);
    expect(r.ok).toBe(false);
  });

  it("tags a secondary when two stats stand out together", () => {
    const r = deriveOrigin(sheet({ strength: 80, power: 79, aerobic: 40, mobility: 42, movement: 41 }), NOW);
    expect(r.ok && r.origin.dominant).toBe("strength");
    expect(r.ok && r.origin.secondary).toBe("power");
  });
});

describe("characterLevel", () => {
  it("median person with everything measured is about level 25", () => {
    const l = characterLevel(
      sheet({
        strength: 50,
        aerobic: 50,
        mobility: 50,
        power: 50,
        movement: 50,
        recovery: 50,
        nutrition: 50,
      }),
    );
    expect(l).toBeGreaterThanOrEqual(24);
    expect(l).toBeLessThanOrEqual(26);
  });

  it("measuring more raises the level for the same mean", () => {
    const four = characterLevel(sheet({ strength: 64, aerobic: 64, mobility: 64, movement: 64 }));
    const seven = characterLevel(
      sheet({
        strength: 64,
        aerobic: 64,
        mobility: 64,
        power: 64,
        movement: 64,
        recovery: 64,
        nutrition: 64,
      }),
    );
    expect(seven).toBeGreaterThan(four);
  });

  it("is 1 with nothing measured and never exceeds the cap", () => {
    expect(characterLevel(sheet({}))).toBe(1);
    expect(
      characterLevel(
        sheet({
          strength: 99,
          aerobic: 99,
          mobility: 99,
          power: 99,
          movement: 99,
          recovery: 99,
          nutrition: 99,
        }),
      ),
    ).toBeLessThanOrEqual(50);
  });
});

describe("updateBottleneck", () => {
  const day = (n: number) => new Date(Date.parse(NOW) + n * 86_400_000).toISOString();

  it("takes the lowest measured stat immediately when there is none", () => {
    const s = updateBottleneck(INITIAL_BOTTLENECK, sheet({ strength: 70, aerobic: 40, mobility: 55 }), NOW);
    expect(s.current).toBe("aerobic");
  });

  it("does not flip for a challenger inside the margin", () => {
    let s = updateBottleneck(INITIAL_BOTTLENECK, sheet({ strength: 70, aerobic: 40, mobility: 55 }), day(0));
    s = updateBottleneck(s, sheet({ strength: 70, aerobic: 40, mobility: 37 }), day(1));
    expect(s.current).toBe("aerobic");
    expect(s.challenger).toBeNull();
  });

  it("flips only after the challenger has been lower by the margin for the required days", () => {
    let s = updateBottleneck(INITIAL_BOTTLENECK, sheet({ strength: 70, aerobic: 40, mobility: 55 }), day(0));
    for (let d = 1; d <= BOTTLENECK_SWITCH_DAYS; d++) {
      s = updateBottleneck(s, sheet({ strength: 70, aerobic: 40, mobility: 30 }), day(d));
      if (d < BOTTLENECK_SWITCH_DAYS) expect(s.current).toBe("aerobic");
    }
    expect(s.current).toBe("mobility");
  });

  it("resets the challenge if the challenger recovers for a day", () => {
    let s = updateBottleneck(INITIAL_BOTTLENECK, sheet({ strength: 70, aerobic: 40, mobility: 55 }), day(0));
    s = updateBottleneck(s, sheet({ strength: 70, aerobic: 40, mobility: 30 }), day(1));
    expect(s.challenger?.stat).toBe("mobility");
    s = updateBottleneck(s, sheet({ strength: 70, aerobic: 40, mobility: 45 }), day(2));
    expect(s.challenger).toBeNull();
  });

  it("switches immediately if the current bottleneck becomes unmeasured", () => {
    let s = updateBottleneck(INITIAL_BOTTLENECK, sheet({ strength: 70, aerobic: 40, mobility: 55 }), day(0));
    s = updateBottleneck(s, sheet({ strength: 70, mobility: 55 }), day(1));
    expect(s.current).toBe("mobility");
  });
});

describe("class, build and regions", () => {
  it("maps plain-language answers to classes", () => {
    expect(classForAnswer("stronger")).toBe("muscle");
    expect(classForAnswer("all_rounder")).toBe("hybrid");
  });

  it("build weights sum to 1 and hybrid favours the two lowest stats", () => {
    const w = buildWeights("hybrid", { strength: 80, aerobic: 30, mobility: 35, movement: 70 });
    const total = STATS.reduce((s, k) => s + w[k], 0);
    expect(total).toBeCloseTo(1, 6);
    expect(w.aerobic).toBeGreaterThan(w.strength);
    expect(w.mobility).toBeGreaterThan(w.strength);
  });

  it("proposes a build name from class and origin", () => {
    const b = proposeBuild("hybrid", "ironblood", {});
    expect(b.name).toBe("Iron Alpine");
    expect(b.userNamed).toBe(false);
  });

  it("class picks the home region; All falls back to the Wilds until the Summit gate opens", () => {
    const base = {
      stats: sheet({ strength: 60, aerobic: 55 }),
      bottleneck: "aerobic" as StatId,
      earned: [] as const,
    };
    expect(homeRegion({ ...base, classId: "muscle", level: 10 })).toBe("forge");
    expect(homeRegion({ ...base, classId: "all", level: 10 })).toBe("wilds");
    const strong = sheet({
      strength: 70,
      aerobic: 65,
      mobility: 60,
      power: 60,
      movement: 70,
      recovery: 65,
      nutrition: 60,
    });
    expect(homeRegion({ classId: "all", level: 30, stats: strong, bottleneck: null, earned: [] })).toBe(
      "summit",
    );
  });

  it("the Arena is gated on strength and mobility for safety, even for a Muscle class", () => {
    const weak = {
      classId: "muscle" as const,
      level: 10,
      stats: sheet({ strength: 60, mobility: 30 }),
      bottleneck: null,
      earned: ["arena"] as const,
    };
    expect(regionStatus("arena", weak).unlocked).toBe(false);
    expect(regionStatus("arena", weak).requirement).toMatch(/Mobility/);
    const ok = { ...weak, stats: sheet({ strength: 60, mobility: 45 }) };
    expect(regionStatus("arena", ok).unlocked).toBe(true);
  });

  it("the bottleneck opens a Rift into its region; the Wilds are always open; the Sanctum opens with sleep data", () => {
    const ctx = {
      classId: "muscle" as const,
      level: 10,
      stats: sheet({ strength: 60, aerobic: 30, recovery: 55 }),
      bottleneck: "aerobic" as StatId,
      earned: [] as const,
    };
    const open = unlockedRegions(ctx);
    expect(open).toEqual(expect.arrayContaining(["wilds", "forge", "engine", "sanctum"]));
    expect(open).not.toContain("temple");
    expect(regionStatus("engine", ctx).reasons).toContain("rift");
  });
});
