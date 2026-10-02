import type { StatId, StatValue } from "../types/stat.js";
import { isMeasured, STATS, statMidpoint } from "../types/stat.js";
import { clamp } from "../util/math.js";

/**
 * Character Level: the honest, slow number computed from stats. It can go down.
 *
 *   level = 1 + Σ over measured stats of (LEVELS_PER_STAT × stat / 100)
 *
 * Every stat is worth up to seven levels; an unmeasured stat is worth nothing. So measuring a stat
 * never lowers the level, however weak it turns out (the honest cost of a weakness is the Rift, not
 * a lost level), and the level climbs by a few levels per in-app test during onboarding before it
 * settles into the slow, percentile-driven number. Level 1 is the empty sheet; any data makes it at
 * least 2. Range 1–50 for the base journey. The cohort numbers behind these choices are reproduced
 * by `pnpm --filter @minmax/core demo:levels` and pinned in level.test.ts; see docs/02-game-system.md
 * "Level and XP".
 */
export const LEVEL_CAP = 50;
export const LEVELS_PER_STAT = (LEVEL_CAP - 1) / STATS.length; // 7

export function characterLevel(stats: Readonly<Record<StatId, StatValue>>): number {
  const measured = STATS.map((s) => stats[s]).filter(isMeasured);
  if (measured.length === 0) return 1;
  let raw = 1;
  for (const v of measured) raw += (LEVELS_PER_STAT * (statMidpoint(v) as number)) / 100;
  return clamp(Math.round(raw), 2, LEVEL_CAP);
}

/**
 * Journey XP: effort-based, never decreases, resets on New Journey.
 * PROVISIONAL values pending docs/research/user-psychology.md.
 */
export const XP = {
  questTier: { 1: 100, 2: 200, 3: 350 } as Readonly<Record<1 | 2 | 3, number>>,
  sessionLogged: 30,
  testTaken: 80,
  sourceConnected: 150,
  weekClosedAllQuests: 150, // bonus for completing every quest of a week
  chapterCompleted: 500,
} as const;

/** XP needed to finish chapter n of a region (cumulative within the chapter). */
export function chapterXpTarget(chapterIndex: number): number {
  return 1000 + 250 * Math.max(0, chapterIndex);
}

/**
 * Shown next to the level: how far the next region or chapter is. Pure presentation helper.
 */
export function xpProgress(
  journeyXp: number,
  chapterIndex: number,
): { readonly current: number; readonly target: number; readonly fraction: number } {
  const target = chapterXpTarget(chapterIndex);
  const current = clamp(journeyXp, 0, target);
  return { current, target, fraction: target === 0 ? 1 : current / target };
}
