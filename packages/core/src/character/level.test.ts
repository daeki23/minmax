import { describe, expect, it } from "vitest";
import { NOW } from "../__fixtures__/measurements.js";
import { COHORTS, type CohortResult, sheetFrom, simulateCohort } from "../demo/level-cohorts.js";
import { STATS } from "../types/stat.js";
import { characterLevel, LEVEL_CAP, LEVELS_PER_STAT } from "./level.js";
import { regionStatus, SUMMIT_MIN_LEVEL } from "./regions.js";

/**
 * The game design in docs/02 relies on where typical users land. These assertions pin the cohort
 * simulation (demo/level-cohorts.ts) so a change to the formula, the stat model or a gate shows up
 * here first. Ranges are deliberately wide: they describe the design, not the PRNG.
 */
const results = new Map<string, CohortResult>(
  COHORTS.map((c, i) => [c.id, simulateCohort(c, 2000, 20261002 + i)]),
);
function cohort(id: string): CohortResult {
  const r = results.get(id);
  if (!r) throw new Error(`no cohort ${id}`);
  return r;
}
const partial = COHORTS.filter((c) => c.measured.length < STATS.length).map((c) => c.id);

describe("Character Level on synthetic users", () => {
  it("level 1 is the empty sheet: anyone with data is at least level 2", () => {
    for (const r of results.values()) expect(r.shareLevel1).toBe(0);
    expect(characterLevel(sheetFrom({ ...zeroes(), strength: 1 }, ["strength"], NOW))).toBe(2);
  });

  it("a wearable owner on day one lands between 5 and 15", () => {
    const r = cohort("watch_day1");
    expect(r.level.p50).toBeGreaterThanOrEqual(9);
    expect(r.level.p50).toBeLessThanOrEqual(14);
    expect(r.shareLevel5to15).toBeGreaterThanOrEqual(0.6);
  });

  it("a sedentary start is a start, not a punishment", () => {
    const r = cohort("sedentary_day1");
    expect(r.level.p50).toBeGreaterThanOrEqual(5);
    expect(r.level.p50).toBeLessThanOrEqual(12);
    expect(r.level.min).toBeGreaterThanOrEqual(2);
  });

  it("one in-app test is a visible start", () => {
    const r = cohort("test_day1");
    expect(r.level.p50).toBeGreaterThanOrEqual(3);
    expect(r.level.p50).toBeLessThanOrEqual(8);
  });

  it("measuring one more stat never lowers the level, however weak it is", () => {
    for (const id of partial) expect(cohort(id).shareLoweredByMeasuring).toBe(0);
    const three = sheetFrom(
      { ...zeroes(), movement: 50, aerobic: 50, recovery: 50 },
      ["movement", "aerobic", "recovery"],
      NOW,
    );
    const four = sheetFrom(
      { ...zeroes(), movement: 50, aerobic: 50, recovery: 50, strength: 3 },
      ["movement", "aerobic", "recovery", "strength"],
      NOW,
    );
    expect(characterLevel(four)).toBeGreaterThanOrEqual(characterLevel(three));
  });

  it("each stat is worth seven levels; the median adult sits at the midpoint, the trained a third from the top", () => {
    expect(LEVELS_PER_STAT).toBe(7);
    expect(cohort("full_median").level.p50).toBeGreaterThanOrEqual(24);
    expect(cohort("full_median").level.p50).toBeLessThanOrEqual(28);
    expect(cohort("full_fit").level.p50).toBeGreaterThanOrEqual(31);
    expect(cohort("full_fit").level.p50).toBeLessThanOrEqual(37);
  });

  it("the cap needs the 99th percentile in every stat; even the elite cohort stays below it", () => {
    expect(cohort("full_elite").level.p90).toBeLessThan(LEVEL_CAP);
    expect(characterLevel(sheetFrom(all(99), STATS, NOW))).toBe(LEVEL_CAP);
    expect(characterLevel(sheetFrom(all(95), STATS, NOW))).toBeLessThan(LEVEL_CAP);
  });

  it("the Summit never opens on partial data and opens for few median, most elite, fully measured users", () => {
    for (const id of partial) expect(cohort(id).shareSummitOpen).toBe(0);
    expect(cohort("full_median").shareSummitOpen).toBeLessThan(0.15);
    expect(cohort("full_elite").shareSummitOpen).toBeGreaterThan(0.5);
    const fitButUnmeasured = sheetFrom(all(80), ["movement", "aerobic", "recovery"], NOW);
    const status = regionStatus("summit", {
      classId: "all",
      level: SUMMIT_MIN_LEVEL,
      stats: fitButUnmeasured,
      bottleneck: null,
      earned: [],
    });
    expect(status.unlocked).toBe(false);
    expect(status.requirement).toMatch(/unmeasured: strength, mobility, power, nutrition/);
  });
});

function zeroes(): Record<(typeof STATS)[number], number> {
  return all(0);
}
function all(v: number): Record<(typeof STATS)[number], number> {
  const out = {} as Record<(typeof STATS)[number], number>;
  for (const s of STATS) out[s] = v;
  return out;
}
