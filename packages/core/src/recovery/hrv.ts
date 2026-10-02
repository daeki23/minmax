import type { Measurement } from "../types/measurement.js";
import { daysBetween } from "../util/time.js";

/**
 * HRV never enters a stat as an absolute number: there are no accepted population norms and
 * device, posture and measurement window dominate the value. MINMAX uses only the deviation from
 * the user's own rolling baseline, as a readiness signal and a quest modifier.
 * See docs/02-game-system.md (Stats rules) and docs/04-evidence-framework.md.
 */
export const HRV_BASELINE_DAYS = 28;
export const HRV_MIN_BASELINE_SAMPLES = 10;

export type HrvReadiness =
  | { readonly kind: "insufficient_baseline"; readonly samples: number; readonly needed: number }
  | {
      readonly kind: "ok";
      /** Natural-log RMSSD z-score of the latest value vs the baseline (log makes RMSSD roughly normal). */
      readonly z: number;
      readonly latest: number;
      readonly baselineMedian: number;
      /** Coarse label for the UI; thresholds are conventional, not clinical. */
      readonly label: "well_above" | "normal" | "below" | "well_below";
      readonly source: string;
    };

/**
 * Computes the deviation of the most recent nightly RMSSD from the same-source 28-day baseline.
 * Same-source only: mixing Oura and Garmin RMSSD would compare different algorithms.
 */
export function hrvReadiness(all: readonly Measurement[], now: string): HrvReadiness {
  const hrv = all
    .filter((m) => m.metric === "hrv_rmssd" && m.value > 0)
    .map((m) => ({ m, age: daysBetween(m.measuredAt, now) }))
    .filter(({ age }) => age >= 0 && age <= HRV_BASELINE_DAYS)
    .sort((a, b) => a.age - b.age);
  const latest = hrv[0];
  if (!latest) return { kind: "insufficient_baseline", samples: 0, needed: HRV_MIN_BASELINE_SAMPLES + 1 };

  const sameSource = hrv.filter((x) => x.m.source === latest.m.source && x.m.id !== latest.m.id);
  if (sameSource.length < HRV_MIN_BASELINE_SAMPLES) {
    return {
      kind: "insufficient_baseline",
      samples: sameSource.length + 1,
      needed: HRV_MIN_BASELINE_SAMPLES + 1,
    };
  }
  const logs = sameSource.map((x) => Math.log(x.m.value));
  const mu = logs.reduce((a, b) => a + b, 0) / logs.length;
  const sd = Math.sqrt(logs.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, logs.length - 1)) || 1e-6;
  const z = (Math.log(latest.m.value) - mu) / sd;
  const sorted = sameSource.map((x) => x.m.value).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const baselineMedian =
    sorted.length % 2 === 0
      ? ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2
      : (sorted[mid] as number);
  const label = z >= 1 ? "well_above" : z <= -1.5 ? "well_below" : z <= -0.75 ? "below" : "normal";
  return { kind: "ok", z, latest: latest.m.value, baselineMedian, label, source: latest.m.source };
}
