import type { UserProfile } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import type { NormBasis, NormStatus } from "../types/stat.js";
import { clamp, interpolate } from "../util/math.js";
import { percentileToZ, zToPercentile } from "../util/normal.js";

export type Sex = "female" | "male" | "pooled";

/**
 * One published anchor: the metric value at the Nth FITNESS percentile of the reference population.
 * Higher percentile is always better (high VO2max, low resting HR), so for lower-is-better metrics the
 * values decrease as the percentile rises. Tables may publish any subset of percentiles
 * (FRIEND: 5/25/50/75/95, Dodds: 10/25/50/75/90, Rikli & Jones: 25/75); at least two are needed.
 */
export type PercentileAnchor = readonly [percentile: number, value: number];

export interface AgeBand {
  readonly minAge: number;
  readonly maxAge: number; // inclusive
  readonly anchors: readonly PercentileAnchor[];
}

interface TableMeta {
  readonly metric: Metric;
  readonly sex: Sex;
  readonly status: NormStatus;
  /** Who the numbers describe and how they rank: a sampled population, a criterion scale, or a self-selected community. */
  readonly basis: NormBasis;
  /** Citation. Required for verified tables. */
  readonly source: string;
  /** Who was measured (sample, country, years) so the UI can say "against 22,379 US adults". */
  readonly population?: string;
  /** Measurement protocol the table assumes (e.g. "best hand, Jamar", "treadmill CPET, RER ≥ 1.10"). */
  readonly protocol?: string;
  readonly version: string;
}

/** A percentile table: value anchors per age band, interpolated in probit (z) space. */
export interface NormTable extends TableMeta {
  readonly bands: readonly AgeBand[];
}

/**
 * Some metrics are not ranked against a population but scored against a criterion: a healthy band
 * (sleep duration, body fat), a guideline threshold (blood pressure) or a dose-response curve (steps).
 * Knots map the metric value directly to a 1-99 score: [value, score]. The score is NOT a percentile
 * and the UI must say so; `basis` is "criterion" for these tables.
 */
export interface BandTable extends TableMeta {
  readonly bands: readonly {
    readonly minAge: number;
    readonly maxAge: number;
    readonly knots: readonly (readonly [value: number, score: number])[];
  }[];
}

export type AnyNormTable = NormTable | BandTable;

export function isBandTable(t: AnyNormTable): t is BandTable {
  const first = t.bands[0];
  return first !== undefined && "knots" in first;
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
  all(): readonly AnyNormTable[] {
    return this.tables;
  }
}

function hasBand(t: AnyNormTable, age: number): boolean {
  return t.bands.some((b) => age >= b.minAge && age <= b.maxAge);
}

/** The highest percentile the table actually publishes; beyond it every number is a modelled tail. */
export function deepestPublishedPercentile(t: AnyNormTable): number | null {
  if (isBandTable(t)) return null;
  let max = 0;
  for (const b of t.bands) for (const [p] of b.anchors) if (p > max) max = p;
  return max || null;
}

/** Percentile limits of the engine: nobody is "better than everyone" on an estimate. */
export const PERCENTILE_FLOOR = 1;
export const PERCENTILE_CEILING = 99;

/**
 * Map a value to a percentile within the user's age/sex band.
 *
 * Percentile tables are interpolated linearly in z (probit space) between anchors, as the normative-
 * data report recommends, and linearly across the midpoints of neighbouring age bands so exact-age
 * tables (Dodds) behave like curves rather than steps. Beyond the outermost anchors the z-slope of the
 * outer segment is extended and capped at the 1st/99th percentile; such values are "modelled".
 *
 * Band (criterion) tables interpolate their [value, score] knots directly.
 */
export function percentileFor(table: AnyNormTable, value: number, age: number): number | null {
  if (isBandTable(table)) {
    const band = table.bands.find((b) => age >= b.minAge && age <= b.maxAge);
    if (!band) return null;
    return clamp(interpolate(band.knots, value), PERCENTILE_FLOOR, PERCENTILE_CEILING);
  }

  const bands = [...table.bands].sort((a, b) => a.minAge - b.minAge);
  const idx = bands.findIndex((b) => age >= b.minAge && age <= b.maxAge);
  if (idx === -1) return null;
  const band = bands[idx] as AgeBand;

  const zHere = zFor(band, value);
  if (zHere === null) return null;

  // Blend toward the neighbouring band when the user's age is off this band's midpoint.
  const mid = (band.minAge + band.maxAge) / 2;
  const neighbour = age < mid ? bands[idx - 1] : age > mid ? bands[idx + 1] : undefined;
  let z = zHere;
  if (neighbour) {
    const zThere = zFor(neighbour, value);
    const nMid = (neighbour.minAge + neighbour.maxAge) / 2;
    if (zThere !== null && nMid !== mid) {
      const t = clamp((age - mid) / (nMid - mid), 0, 1);
      z = zHere + t * (zThere - zHere);
    }
  }
  return clamp(zToPercentile(z), PERCENTILE_FLOOR, PERCENTILE_CEILING);
}

/**
 * z-score of `value` within one band: piecewise-linear in (value, z), extrapolated and capped.
 * Anchors are "value at fitness percentile", so for lower-is-better metrics the values simply run the
 * other way; sorting the pairs by value is all the direction handling needed.
 */
function zFor(band: AgeBand, value: number): number | null {
  if (band.anchors.length < 2) return null;
  const zMin = percentileToZ(PERCENTILE_FLOOR);
  const zMax = percentileToZ(PERCENTILE_CEILING);
  const pairs: [number, number][] = band.anchors.map(([p, v]) => [v, percentileToZ(clamp(p, 0.5, 99.5))]);
  pairs.sort((a, b) => a[0] - b[0]);
  const first = pairs[0] as [number, number];
  const second = pairs[1] as [number, number];
  const last = pairs[pairs.length - 1] as [number, number];
  const beforeLast = pairs[pairs.length - 2] as [number, number];
  let z: number;
  if (value <= first[0]) z = extend(value, first, second);
  else if (value >= last[0]) z = extend(value, last, beforeLast);
  else z = interpolate(pairs, value);
  return clamp(z, zMin, zMax);
}

function extend(value: number, outer: [number, number], inner: [number, number]): number {
  const dv = outer[0] - inner[0];
  if (dv === 0) return outer[1];
  const slope = (outer[1] - inner[1]) / dv;
  return outer[1] + slope * (value - outer[0]);
}
