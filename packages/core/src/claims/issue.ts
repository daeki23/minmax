import type { MetricEstimate } from "../provenance/resolve.js";
import type { Claim, Predicate, Signer, UnsignedClaim, Verifier } from "../types/claim.js";
import type { Source, TrustLevel } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import { METRIC_SPECS } from "../types/metric.js";
import type { StatId, StatValue } from "../types/stat.js";
import { isMeasured } from "../types/stat.js";
import { addDays, toDateOnly } from "../util/time.js";
import { ENGINE_VERSION } from "../version.js";

export interface ClaimEvidence {
  readonly estimates: ReadonlyMap<Metric, MetricEstimate>;
  readonly stats: Readonly<Record<StatId, StatValue>>;
  readonly level: number;
}

export type PredicateCheck =
  | { readonly satisfied: true; readonly trust: TrustLevel; readonly sources: readonly Source[] }
  | {
      readonly satisfied: false;
      readonly reason:
        | "unmeasured"
        | "not_met"
        | "within_error"
        | "range_too_wide"
        | "low_confidence"
        | "beyond_reference";
    };

/** Minimum confidence to issue a claim at all; a claim is a promise, not a guess. */
export const CLAIM_MIN_CONFIDENCE = 0.6;

/**
 * Published reference tables resolve the tail to the 95th percentile at best (FRIEND VO2max p95,
 * grip strength p90). Beyond that the engine's percentile is a modelled extrapolation, which may be
 * shown to the user as such but never certified. See research/normative-data.md.
 */
export const CLAIM_MAX_STAT_PERCENTILE = 95;

/**
 * A claim must beat the measurement error, not only the threshold: a wrist VO2max of 46 does not
 * certify "≥ 45". Below clinical trust the metric's tolerance stands in for one standard error until
 * per-source error bars are wired in (research/wearable-integrations.md).
 */
export function claimErrorMargin(metric: Metric, trust: TrustLevel): number {
  return trust >= 3 ? 0 : METRIC_SPECS[metric].tolerance;
}

/**
 * Evaluate a predicate honestly:
 * - metric predicates use the resolved estimate and its trust level;
 * - stat predicates require a point value (ranges are too uncertain to certify) and use the stat's trust;
 * - level predicates are derived, so trust is the minimum trust across measured stats.
 */
export function checkPredicate(p: Predicate, ev: ClaimEvidence): PredicateCheck {
  switch (p.kind) {
    case "metric": {
      const e = ev.estimates.get(p.metric);
      if (!e) return { satisfied: false, reason: "unmeasured" };
      if (e.confidence < CLAIM_MIN_CONFIDENCE) return { satisfied: false, reason: "low_confidence" };
      const nominal = p.op === ">=" ? e.value >= p.threshold : e.value <= p.threshold;
      if (!nominal) return { satisfied: false, reason: "not_met" };
      const margin = claimErrorMargin(p.metric, e.trustLevel);
      const beyondError = p.op === ">=" ? e.value - margin >= p.threshold : e.value + margin <= p.threshold;
      return beyondError
        ? { satisfied: true, trust: e.trustLevel, sources: e.sources }
        : { satisfied: false, reason: "within_error" };
    }
    case "stat": {
      if (p.percentile > CLAIM_MAX_STAT_PERCENTILE) return { satisfied: false, reason: "beyond_reference" };
      const s = ev.stats[p.stat];
      if (!isMeasured(s)) return { satisfied: false, reason: "unmeasured" };
      if (s.kind === "range") return { satisfied: false, reason: "range_too_wide" };
      if (s.confidence < CLAIM_MIN_CONFIDENCE) return { satisfied: false, reason: "low_confidence" };
      if (s.value < p.percentile) return { satisfied: false, reason: "not_met" };
      const sources = new Set<Source>();
      for (const c of s.contributions) {
        if (c.percentile === null) continue;
        for (const id of c.measurementIds) {
          const est = [...ev.estimates.values()].find((e) => e.measurementIds.includes(id));
          if (est) for (const src of est.sources) sources.add(src);
        }
      }
      return { satisfied: true, trust: s.trustLevel, sources: [...sources] };
    }
    case "level": {
      if (ev.level < p.level) return { satisfied: false, reason: "not_met" };
      const measured = Object.values(ev.stats).filter(isMeasured);
      if (measured.length === 0) return { satisfied: false, reason: "unmeasured" };
      const trust = Math.min(...measured.map((s) => s.trustLevel)) as TrustLevel;
      const sources = new Set<Source>();
      for (const e of ev.estimates.values()) for (const s of e.sources) sources.add(s);
      return { satisfied: true, trust, sources: [...sources] };
    }
  }
}

export interface IssueOptions {
  readonly subject: string; // pseudonymous key
  readonly issuer: string;
  readonly now: string;
  readonly validityDays?: number; // default: metric freshness × 2, or 30 for stats/levels
  readonly idFactory: (seed: string) => string;
}

export function buildUnsignedClaim(
  p: Predicate,
  check: Extract<PredicateCheck, { satisfied: true }>,
  o: IssueOptions,
): UnsignedClaim {
  const validity = o.validityDays ?? (p.kind === "metric" ? METRIC_SPECS[p.metric].freshnessDays * 2 : 30);
  const validFrom = toDateOnly(o.now);
  const validUntil = toDateOnly(addDays(o.now, validity));
  return {
    id: o.idFactory(`${o.subject}|${JSON.stringify(p)}|${validFrom}`),
    subject: o.subject,
    predicate: p,
    evidenceTrust: check.trust,
    evidenceSources: [...check.sources].sort(),
    validFrom,
    validUntil,
    issuedAt: toDateOnly(o.now),
    issuer: o.issuer,
    schema: "minmax.claim.v0",
    engineVersion: ENGINE_VERSION,
  };
}

/** Deterministic canonical JSON (sorted keys) so signatures are reproducible across platforms. */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(",")}}`;
}

export function claimPayload(c: UnsignedClaim): string {
  return canonicalize(c);
}

export async function issueClaim(
  p: Predicate,
  ev: ClaimEvidence,
  o: IssueOptions,
  signer: Signer,
): Promise<Claim | PredicateCheck> {
  const check = checkPredicate(p, ev);
  if (!check.satisfied) return check;
  const unsigned = buildUnsignedClaim(p, check, o);
  const signature = await signer.sign(claimPayload(unsigned));
  return { ...unsigned, signature, signatureAlg: `${signer.alg}:${signer.keyId}` };
}

export async function verifyClaim(
  c: Claim,
  verifier: Verifier,
  now: string,
): Promise<{ readonly valid: boolean; readonly reason?: string }> {
  // "alg:keyId"; key ids may themselves contain colons, so split on the first one only.
  const sep = c.signatureAlg.indexOf(":");
  const alg = sep === -1 ? c.signatureAlg : c.signatureAlg.slice(0, sep);
  const keyId = sep === -1 ? "" : c.signatureAlg.slice(sep + 1);
  if (alg !== verifier.alg || !keyId) return { valid: false, reason: "unsupported_alg" };
  const today = toDateOnly(now);
  if (today < c.validFrom || today > c.validUntil) return { valid: false, reason: "expired" };
  const { signature: _s, signatureAlg: _a, ...unsigned } = c;
  const ok = await verifier.verify(claimPayload(unsigned as UnsignedClaim), c.signature, keyId);
  return ok ? { valid: true } : { valid: false, reason: "bad_signature" };
}

/** Public wording for a claim; never includes the raw value. */
export function describePredicate(p: Predicate): string {
  switch (p.kind) {
    case "metric":
      return `${p.metric.replace(/_/g, " ")} ${p.op} ${p.threshold} ${p.unit}`;
    case "stat":
      return `${p.stat} at or above the ${p.percentile}th percentile`;
    case "level":
      return `character level ${p.level} or higher`;
  }
}
