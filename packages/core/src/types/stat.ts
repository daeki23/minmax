import type { TrustLevel } from "./measurement.js";
import type { Metric } from "./metric.js";

export const STATS = [
  "strength",
  "aerobic",
  "mobility",
  "power",
  "movement",
  "recovery",
  "nutrition",
] as const;
export type StatId = (typeof STATS)[number];

export const STAT_LABEL: Readonly<Record<StatId, string>> = {
  strength: "Strength",
  aerobic: "Aerobic",
  mobility: "Mobility",
  power: "Power",
  movement: "Movement",
  recovery: "Recovery",
  nutrition: "Nutrition",
};

/** Status of the normative table a number came from. Provisional tables must be visibly labelled in the UI. */
export type NormStatus = "verified" | "provisional" | "synthetic";

export interface MetricContribution {
  readonly metric: Metric;
  /** Percentile 0-100 of the user's estimate within their age/sex band, or null if unmeasured. */
  readonly percentile: number | null;
  readonly weight: number;
  readonly confidence: number;
  readonly trustLevel: TrustLevel | null;
  readonly normStatus: NormStatus | null;
  readonly measurementIds: readonly string[];
}

/**
 * A stat is a percentile with provenance. It can be a point, a range, or unmeasured.
 * See docs/03-data-provenance.md "Confidence into stats".
 */
export type StatValue =
  | {
      readonly stat: StatId;
      readonly kind: "point";
      readonly value: number; // 0-100
      readonly confidence: number;
      readonly trustLevel: TrustLevel;
      readonly normStatus: NormStatus;
      readonly contributions: readonly MetricContribution[];
      readonly computedAt: string;
    }
  | {
      readonly stat: StatId;
      readonly kind: "range";
      readonly low: number;
      readonly high: number;
      readonly mid: number;
      readonly confidence: number;
      readonly trustLevel: TrustLevel;
      readonly normStatus: NormStatus;
      readonly contributions: readonly MetricContribution[];
      readonly computedAt: string;
    }
  | {
      readonly stat: StatId;
      readonly kind: "unmeasured";
      readonly missing: readonly Metric[];
      readonly contributions: readonly MetricContribution[];
      readonly computedAt: string;
    };

export function statMidpoint(s: StatValue): number | null {
  switch (s.kind) {
    case "point":
      return s.value;
    case "range":
      return s.mid;
    case "unmeasured":
      return null;
  }
}

export function isMeasured(s: StatValue): s is Exclude<StatValue, { kind: "unmeasured" }> {
  return s.kind !== "unmeasured";
}
