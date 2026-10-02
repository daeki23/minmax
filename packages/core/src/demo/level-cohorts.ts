/**
 * Synthetic users for tuning Character Level and the region gates. Not engine logic.
 *
 * Population model, deliberately simple: one latent "general fitness" factor z per person
 * (0 = population median, unit = one standard deviation), and each stat percentile is
 * Φ(λ·z + √(1−λ²)·ε), so fit people tend to be fit everywhere without being identical everywhere
 * (stat-to-stat correlation λ²). Cohorts differ in where their latent factor sits and in which
 * stats are measured on the day the level is computed. Deterministic PRNG, so the numbers quoted
 * in docs/02-game-system.md can be reproduced with `pnpm --filter @minmax/core demo:levels`.
 */
import { characterLevel } from "../character/level.js";
import { summitGate } from "../character/regions.js";
import type { StatId, StatValue } from "../types/stat.js";
import { STATS } from "../types/stat.js";
import { clamp } from "../util/math.js";
import { normalCdf } from "../util/normal.js";

/** Loading of every stat on the latent factor; stat-to-stat correlation is its square (0.36). */
export const STAT_LOADING = 0.6;

export interface Cohort {
  readonly id: string;
  readonly label: string;
  /** Where the cohort's latent fitness sits, in population standard deviations. */
  readonly latentMean: number;
  readonly latentSd: number;
  /** Stats that are measured on the day the level is computed. */
  readonly measured: readonly StatId[];
}

const WATCH_DAY_ONE: readonly StatId[] = ["movement", "aerobic", "recovery"];

export const COHORTS: readonly Cohort[] = [
  {
    id: "watch_day1",
    label: "Wearable owner, day one: steps, VO2max estimate, sleep",
    latentMean: 0,
    latentSd: 1,
    measured: WATCH_DAY_ONE,
  },
  {
    id: "sedentary_day1",
    label: "Sedentary wearable owner, day one, same three stats",
    latentMean: -0.8,
    latentSd: 0.5,
    measured: WATCH_DAY_ONE,
  },
  {
    id: "test_day1",
    label: "No wearable, one in-app strength test",
    latentMean: 0,
    latentSd: 1,
    measured: ["strength"],
  },
  {
    id: "month1",
    label: "Month one: three imports plus strength and mobility tests",
    latentMean: 0,
    latentSd: 1,
    measured: [...WATCH_DAY_ONE, "strength", "mobility"],
  },
  {
    id: "full_median",
    label: "Everything measured, general population",
    latentMean: 0,
    latentSd: 1,
    measured: STATS,
  },
  {
    id: "full_fit",
    label: "Everything measured, trained (latent +1 sd)",
    latentMean: 1,
    latentSd: 0.5,
    measured: STATS,
  },
  {
    id: "full_elite",
    label: "Everything measured, elite (latent +2 sd)",
    latentMean: 2,
    latentSd: 0.3,
    measured: STATS,
  },
];

export interface Quantiles {
  readonly min: number;
  readonly p10: number;
  readonly p50: number;
  readonly p90: number;
  readonly max: number;
}

export interface CohortResult {
  readonly cohort: Cohort;
  readonly n: number;
  readonly level: Quantiles;
  /** Mean percentile of the measured stats, for reading the level against its input. */
  readonly meanPercentile: Quantiles;
  readonly shareLevel5to15: number;
  readonly shareLevel1: number;
  readonly shareSummitOpen: number;
  /** Share of users whose level drops when the next unmeasured stat gets measured; null when nothing is unmeasured. */
  readonly shareLoweredByMeasuring: number | null;
}

/** mulberry32: a tiny deterministic PRNG, enough for a reproducible simulation. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(next: () => number): number {
  const u1 = Math.max(next(), 1e-12);
  const u2 = next();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** One synthetic person: a percentile per stat, clamped to 1–99 like the real tables. */
export function syntheticPercentiles(cohort: Cohort, next: () => number): Readonly<Record<StatId, number>> {
  const z = cohort.latentMean + cohort.latentSd * gaussian(next);
  const noise = Math.sqrt(1 - STAT_LOADING ** 2);
  const out = {} as Record<StatId, number>;
  for (const s of STATS) out[s] = clamp(100 * normalCdf(STAT_LOADING * z + noise * gaussian(next)), 1, 99);
  return out;
}

export function sheetFrom(
  percentiles: Readonly<Record<StatId, number>>,
  measured: readonly StatId[],
  computedAt: string,
): Readonly<Record<StatId, StatValue>> {
  const out = {} as Record<StatId, StatValue>;
  for (const s of STATS) {
    out[s] = measured.includes(s)
      ? {
          stat: s,
          kind: "point",
          value: percentiles[s],
          confidence: 0.8,
          trustLevel: 2,
          normStatus: "synthetic",
          basis: "population",
          contributions: [],
          computedAt,
          engineVersion: "simulation",
        }
      : {
          stat: s,
          kind: "unmeasured",
          missing: [],
          contributions: [],
          computedAt,
          engineVersion: "simulation",
        };
  }
  return out;
}

function quantiles(xs: readonly number[]): Quantiles {
  const sorted = [...xs].sort((a, b) => a - b);
  const at = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] as number;
  return { min: at(0), p10: at(0.1), p50: at(0.5), p90: at(0.9), max: sorted[sorted.length - 1] as number };
}

export function simulateCohort(cohort: Cohort, n = 2000, seed = 20261002): CohortResult {
  const next = rng(seed);
  const computedAt = "2026-10-02T00:00:00.000Z";
  const nextUnmeasured = STATS.find((s) => !cohort.measured.includes(s)) ?? null;
  const levels: number[] = [];
  const means: number[] = [];
  let summitOpen = 0;
  let lowered = 0;
  for (let i = 0; i < n; i++) {
    const pct = syntheticPercentiles(cohort, next);
    const stats = sheetFrom(pct, cohort.measured, computedAt);
    const level = characterLevel(stats);
    levels.push(level);
    let sum = 0;
    for (const s of cohort.measured) sum += pct[s];
    means.push(sum / cohort.measured.length);
    if (summitGate({ classId: "all", level, stats, bottleneck: null, earned: [] })) summitOpen++;
    if (nextUnmeasured) {
      const more = sheetFrom(pct, [...cohort.measured, nextUnmeasured], computedAt);
      if (characterLevel(more) < level) lowered++;
    }
  }
  return {
    cohort,
    n,
    level: quantiles(levels),
    meanPercentile: quantiles(means),
    shareLevel5to15: levels.filter((l) => l >= 5 && l <= 15).length / n,
    shareLevel1: levels.filter((l) => l === 1).length / n,
    shareSummitOpen: summitOpen / n,
    shareLoweredByMeasuring: nextUnmeasured ? lowered / n : null,
  };
}

export function simulateAll(n = 2000, seed = 20261002): readonly CohortResult[] {
  return COHORTS.map((c, i) => simulateCohort(c, n, seed + i));
}

export function formatResults(results: readonly CohortResult[]): string {
  const pct = (x: number | null) => (x === null ? "   —" : `${Math.round(100 * x)}%`.padStart(4));
  const q = (v: Quantiles) => `${v.p10}/${v.p50}/${v.p90}`.padStart(11);
  const head = `${"cohort".padEnd(58)} meas  mean-pct 10/50/90  level 10/50/90  in 5–15  at 1  Summit  measuring lowers`;
  const rows = results.map((r) => {
    const mp = { ...r.meanPercentile };
    const mpq = `${Math.round(mp.p10)}/${Math.round(mp.p50)}/${Math.round(mp.p90)}`.padStart(17);
    return `${r.cohort.label.padEnd(58)} ${String(r.cohort.measured.length).padStart(3)}/7${mpq}${q(r.level).padStart(16)}${pct(r.shareLevel5to15).padStart(9)}${pct(r.shareLevel1).padStart(6)}${pct(r.shareSummitOpen).padStart(8)}${pct(r.shareLoweredByMeasuring).padStart(18)}`;
  });
  return [head, ...rows].join("\n");
}
