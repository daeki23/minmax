import type { Measurement, Source, TrustLevel } from "../types/measurement.js";
import { SOURCE_DEFAULT_TRUST } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import { clamp } from "../util/math.js";

/**
 * PROVISIONAL confidence priors. These encode how much a value from a given source
 * tends to reflect the body, before corroboration. They will be replaced by
 * per-vendor, per-metric error bars from docs/research/wearable-integrations.md.
 * Keep the shape; change the numbers.
 */
const TRUST_BASE: Readonly<Record<TrustLevel, number>> = {
  0: 0.35,
  1: 0.6,
  2: 0.75,
  3: 0.95,
};

/** Metric-specific adjustments for device-derived values (trust level 2). */
const DEVICE_METRIC_ADJUST: Readonly<Partial<Record<Metric, number>>> = {
  vo2max: -0.1, // wrist estimates: several ml/kg/min error
  hrv_rmssd: -0.15,
  sleep_duration_h: -0.05,
  sleep_efficiency_pct: -0.15,
  sleep_regularity_index: -0.05,
  body_fat_pct: -0.2, // BIA scales
  steps_day: 0.1,
  resting_hr: 0.1,
  bodyweight_kg: 0.15,
  systolic_bp: 0.0,
  diastolic_bp: 0.0,
};

/** Method-specific adjustments regardless of source. */
const METHOD_ADJUST: Readonly<Record<string, number>> = {
  cpet: 0.03,
  dexa: 0.03,
  cooper_12min: -0.1,
  firstbeat_estimate: 0,
  manual_entry: -0.05,
  bia: -0.1,
};

export const CONFIDENCE_FLOOR = 0.05;
export const CONFIDENCE_CEILING = 0.98;

export function priorConfidence(
  metric: Metric,
  source: Source,
  trustLevel: TrustLevel,
  method?: string,
): number {
  let c = TRUST_BASE[trustLevel];
  if (trustLevel === 2) c += DEVICE_METRIC_ADJUST[metric] ?? 0;
  if (method && method in METHOD_ADJUST) c += METHOD_ADJUST[method] as number;
  // A lab value typed in by the user cannot exceed what self-report earns.
  if (source === "self" && trustLevel > 0) c = TRUST_BASE[0];
  return clamp(c, CONFIDENCE_FLOOR, CONFIDENCE_CEILING);
}

/** The trust a source may grant; the caller may lower it (e.g. a manual lab entry) but never raise it. */
export function effectiveTrust(source: Source, requested?: TrustLevel): TrustLevel {
  const max = SOURCE_DEFAULT_TRUST[source];
  if (requested === undefined) return max;
  return (Math.min(requested, max) as TrustLevel) ?? max;
}

/**
 * Recency decay: full confidence inside the freshness window, then a linear drop to
 * 25 % of the original over the next two windows. Never zero, so stale data still
 * renders as a wide range rather than vanishing.
 */
export function recencyFactor(ageDays: number, freshnessDays: number): number {
  if (ageDays <= freshnessDays) return 1;
  const over = ageDays - freshnessDays;
  const span = freshnessDays * 2;
  return clamp(1 - 0.75 * (over / span), 0.25, 1);
}

export const CORROBORATION_BONUS = 0.1;
export const DISAGREEMENT_PENALTY = 0.2;

export function corroborated(confidence: number): number {
  return clamp(confidence + CORROBORATION_BONUS, CONFIDENCE_FLOOR, CONFIDENCE_CEILING);
}

export function penalisedForDisagreement(confidence: number): number {
  return clamp(confidence - DISAGREEMENT_PENALTY, CONFIDENCE_FLOOR, CONFIDENCE_CEILING);
}

/** Convenience for hosts constructing measurements: fills trust and confidence consistently. */
export function withProvenance(
  m: Omit<Measurement, "trustLevel" | "confidence" | "verification"> & {
    trustLevel?: TrustLevel;
    verification?: Measurement["verification"];
  },
): Measurement {
  const trustLevel = effectiveTrust(m.source, m.trustLevel);
  const confidence = priorConfidence(m.metric, m.source, trustLevel, m.method);
  const verification: Measurement["verification"] =
    m.verification ?? (trustLevel >= 2 ? "source_authenticated" : "unverified");
  const { trustLevel: _t, verification: _v, ...rest } = m;
  return { ...rest, trustLevel, confidence, verification };
}
