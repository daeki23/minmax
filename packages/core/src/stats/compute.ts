import type { MetricEstimate } from "../provenance/resolve.js";
import type { TrustLevel, UserProfile } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import type { MetricContribution, NormStatus, StatId, StatValue } from "../types/stat.js";
import { STATS } from "../types/stat.js";
import { clamp, round, weightedMean } from "../util/math.js";
import { POINT_CONFIDENCE_MIN, POINT_COVERAGE_MIN, RANGE_COVERAGE_MIN, STAT_MODEL } from "./model.js";
import type { NormRegistry } from "./norms.js";
import { percentileFor } from "./norms.js";

export interface ComputeContext {
  readonly profile: UserProfile;
  readonly norms: NormRegistry;
  readonly estimates: ReadonlyMap<Metric, MetricEstimate>;
  readonly now: string;
}

const NORM_RANK: Readonly<Record<NormStatus, number>> = { verified: 2, provisional: 1, synthetic: 0 };

function worstNorm(statuses: readonly NormStatus[]): NormStatus {
  let worst: NormStatus = "verified";
  for (const s of statuses) if (NORM_RANK[s] < NORM_RANK[worst]) worst = s;
  return worst;
}

/**
 * Compute one stat. The value is a coverage-weighted mean of constituent percentiles.
 * Confidence is the weighted mean of constituent confidences, scaled by coverage.
 * Coverage < RANGE_COVERAGE_MIN → unmeasured; coverage < POINT_COVERAGE_MIN or confidence < POINT_CONFIDENCE_MIN → range.
 */
export function computeStat(stat: StatId, ctx: ComputeContext): StatValue {
  const inputs = STAT_MODEL[stat];
  const totalWeight = inputs.reduce((s, i) => s + i.weight, 0);
  const contributions: MetricContribution[] = [];
  const missing: Metric[] = [];
  let coveredWeight = 0;

  for (const input of inputs) {
    const est = ctx.estimates.get(input.metric);
    const table = ctx.norms.find(input.metric, ctx.profile);
    if (!est || !table) {
      missing.push(input.metric);
      contributions.push({
        metric: input.metric,
        percentile: null,
        weight: input.weight,
        confidence: 0,
        trustLevel: null,
        normStatus: table ? table.status : null,
        measurementIds: est ? est.measurementIds : [],
      });
      continue;
    }
    const pct = percentileFor(table, est.value, ctx.profile.age);
    if (pct === null) {
      missing.push(input.metric);
      contributions.push({
        metric: input.metric,
        percentile: null,
        weight: input.weight,
        confidence: 0,
        trustLevel: est.trustLevel,
        normStatus: table.status,
        measurementIds: est.measurementIds,
      });
      continue;
    }
    coveredWeight += input.weight;
    contributions.push({
      metric: input.metric,
      percentile: round(pct, 1),
      weight: input.weight,
      confidence: est.confidence,
      trustLevel: est.trustLevel,
      normStatus: table.status,
      measurementIds: est.measurementIds,
    });
  }

  const coverage = coveredWeight / totalWeight;
  const measured = contributions.filter(
    (c): c is MetricContribution & { percentile: number } => c.percentile !== null,
  );
  const requiredMissing = inputs.some((i) => i.required && missing.includes(i.metric));

  if (coverage < RANGE_COVERAGE_MIN || measured.length === 0 || requiredMissing) {
    return { stat, kind: "unmeasured", missing, contributions, computedAt: ctx.now };
  }

  const value = weightedMean(measured.map((c) => [c.percentile, c.weight] as const));
  const rawConfidence = weightedMean(measured.map((c) => [c.confidence, c.weight] as const));
  const confidence = clamp(rawConfidence * (0.5 + 0.5 * coverage), 0, 1);
  const trustLevel = Math.min(...measured.map((c) => c.trustLevel ?? 0)) as TrustLevel;
  const normStatus = worstNorm(measured.map((c) => c.normStatus ?? "synthetic"));

  if (coverage >= POINT_COVERAGE_MIN && confidence >= POINT_CONFIDENCE_MIN) {
    return {
      stat,
      kind: "point",
      value: round(clamp(value, 1, 99)),
      confidence: round(confidence, 2),
      trustLevel,
      normStatus,
      contributions,
      computedAt: ctx.now,
    };
  }

  // Range width grows with missing coverage and missing confidence. Width 10 at best, up to 40.
  const width = clamp(10 + 30 * (1 - coverage) * 0.5 + 30 * (1 - confidence) * 0.5, 10, 40);
  const mid = clamp(value, 1, 99);
  return {
    stat,
    kind: "range",
    low: round(clamp(mid - width / 2, 1, 99)),
    high: round(clamp(mid + width / 2, 1, 99)),
    mid: round(mid),
    confidence: round(confidence, 2),
    trustLevel,
    normStatus,
    contributions,
    computedAt: ctx.now,
  };
}

export function computeAllStats(ctx: ComputeContext): Readonly<Record<StatId, StatValue>> {
  const out = {} as Record<StatId, StatValue>;
  for (const s of STATS) out[s] = computeStat(s, ctx);
  return out;
}
