import type { StatId, StatValue } from "../types/stat.js";
import { isMeasured, STATS, statMidpoint } from "../types/stat.js";
import { clamp, mean } from "../util/math.js";

/**
 * Character Level: the honest, slow number computed from stats. It can go down.
 * level = 1 + 49 × (mean of measured stat midpoints / 100) × coverage factor
 * coverage factor = sqrt(measured / 7): a user with 4 of 7 stats measured at 64 lands around
 * level 24 rather than 32, so measuring more is always rewarded and never guessed.
 * Range 1–50 for the base journey. See docs/02-game-system.md "Level and XP".
 */
export const LEVEL_CAP = 50;

export function characterLevel(stats: Readonly<Record<StatId, StatValue>>): number {
  const measured = STATS.map((s) => stats[s]).filter(isMeasured);
  if (measured.length === 0) return 1;
  const mu = mean(measured.map((v) => statMidpoint(v) as number));
  const coverage = Math.sqrt(measured.length / STATS.length);
  const raw = 1 + (LEVEL_CAP - 1) * (mu / 100) * coverage;
  return clamp(Math.round(raw), 1, LEVEL_CAP);
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
