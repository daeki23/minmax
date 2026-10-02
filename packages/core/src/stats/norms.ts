import type { UserProfile } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import { METRIC_SPECS } from "../types/metric.js";
import type { NormStatus } from "../types/stat.js";
import { clamp, interpolate } from "../util/math.js";

export type Sex = "female" | "male" | "pooled";

/**
 * Percentile knots: the metric value at the 5th, 10th, 25th, 50th, 75th, 90th and 95th FITNESS percentile.
 * p95 is always the best value: high for VO2max, low for resting HR. Monotone in the metric's direction.
 */
export interface PercentileKnots {
  readonly p5: number;
  readonly p10: number;
  readonly p25: number;
  readonly p50: number;
  readonly p75: number;
  readonly p90: number;
  readonly p95: number;
}

export interface AgeBand {
  readonly minAge: number;
  readonly maxAge: number; // inclusive
  readonly knots: PercentileKnots;
}

export interface NormTable {
  readonly metric: Metric;
  readonly sex: Sex;
  readonly bands: readonly AgeBand[];
  readonly status: NormStatus;
  /** Citation. Required for verified tables. */
  readonly source: string;
  readonly version: string;
}

/**
 * Some metrics are not "higher is better" but have a healthy band (sleep duration, protein,
 * body fat). For those, the table maps distance from the optimal band to a pseudo-percentile:
 * inside the band → 85-100, outside → falls off. Expressed as knots over the metric value
 * directly: [value, score].
 */
export interface BandTable {
  readonly metric: Metric;
  readonly sex: Sex;
  readonly bands: readonly {
    readonly minAge: number;
    readonly maxAge: number;
    readonly knots: readonly (readonly [number, number])[];
  }[];
  readonly status: NormStatus;
  readonly source: string;
  readonly version: string;
}

export type AnyNormTable = NormTable | BandTable;

export function isBandTable(t: AnyNormTable): t is BandTable {
  const first = t.bands[0];
  return first !== undefined && Array.isArray((first as { knots: unknown }).knots);
}

export interface NormRegistry {
  find(metric: Metric, profile: UserProfile): AnyNormTable | null;
}

export class StaticNormRegistry implements NormRegistry {
  private readonly tables: readonly AnyNormTable[];
  constructor(tables: readonly AnyNormTable[]) {
    this.tables = tables;
  }
  find(metric: Metric, profile: UserProfile): AnyNormTable | null {
    const sex: Sex = profile.sex === "unspecified" ? "pooled" : profile.sex;
    const exact = this.tables.find((t) => t.metric === metric && t.sex === sex && hasBand(t, profile.age));
    if (exact) return exact;
    const pooled = this.tables.find(
      (t) => t.metric === metric && t.sex === "pooled" && hasBand(t, profile.age),
    );
    return pooled ?? null;
  }
}

function hasBand(t: AnyNormTable, age: number): boolean {
  return t.bands.some((b) => age >= b.minAge && age <= b.maxAge);
}

const KNOT_PERCENTILES = [5, 10, 25, 50, 75, 90, 95] as const;

/**
 * Map a value to a percentile within the user's age/sex band.
 * Beyond p95/p5 the percentile is extended with a gentle tail toward 99/1, never 100/0:
 * nobody is "better than everyone" on an estimate.
 */
export function percentileFor(table: AnyNormTable, value: number, age: number): number | null {
  const band = table.bands.find((b) => age >= b.minAge && age <= b.maxAge);
  if (!band) return null;

  if (isBandTable(table)) {
    const knots = (band as BandTable["bands"][number]).knots;
    return clamp(interpolate(knots, value), 1, 99);
  }

  const k = (band as AgeBand).knots;
  const values = [k.p5, k.p10, k.p25, k.p50, k.p75, k.p90, k.p95];
  const higherIsBetter = METRIC_SPECS[table.metric].direction !== "lower";
  // Convention: pN is the metric value at the Nth FITNESS percentile, so p95 is always the best value
  // (high for VO2max, low for resting HR). The percentile assignment therefore never changes; for
  // lower-is-better metrics the pairs merely need sorting by value so interpolation works.
  const pairs: [number, number][] = values.map((v, i) => [v, KNOT_PERCENTILES[i] as number]);
  if (!higherIsBetter) pairs.sort((a, b) => a[0] - b[0]);
  const first = pairs[0] as [number, number];
  const last = pairs[pairs.length - 1] as [number, number];
  if (value <= first[0]) return tail(value, first, pairs[1] as [number, number], higherIsBetter ? 1 : 99);
  if (value >= last[0])
    return tail(value, last, pairs[pairs.length - 2] as [number, number], higherIsBetter ? 99 : 1);
  return clamp(interpolate(pairs, value), 1, 99);
}

/** Linear tail from the outer knot toward the limit, using the slope of the outermost segment, capped. */
function tail(value: number, outer: [number, number], inner: [number, number], limit: number): number {
  const slope = (outer[1] - inner[1]) / (outer[0] - inner[0] || 1);
  const est = outer[1] + slope * (value - outer[0]);
  return limit > outer[1] ? clamp(est, outer[1], limit) : clamp(est, limit, outer[1]);
}
