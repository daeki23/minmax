import type { Metric } from "../types/metric.js";
import type { StatId } from "../types/stat.js";

/**
 * Which metrics feed which stat and with what weight.
 * PROVISIONAL weights; to be reconciled with docs/research/normative-data.md "Proposed stat model".
 * Weights are relative within a stat; missing metrics are renormalised away, so a user with only
 * grip strength still gets a Strength stat (with lower confidence and a "range" rendering).
 */
export interface StatInput {
  readonly metric: Metric;
  readonly weight: number;
  /** If true, the stat cannot be computed without this metric. */
  readonly required?: boolean;
}

export const STAT_MODEL: Readonly<Record<StatId, readonly StatInput[]>> = {
  strength: [
    { metric: "grip_kg", weight: 0.25 },
    { metric: "pushups_max", weight: 0.2 },
    { metric: "pullups_max", weight: 0.15 },
    { metric: "squat_1rm_ratio", weight: 0.15 },
    { metric: "deadlift_1rm_ratio", weight: 0.1 },
    { metric: "bench_1rm_ratio", weight: 0.05 },
    { metric: "sit_to_stand_30s", weight: 0.1 },
  ],
  aerobic: [
    { metric: "vo2max", weight: 0.6 },
    { metric: "resting_hr", weight: 0.2 },
    { metric: "aerobic_minutes_week", weight: 0.2 },
  ],
  mobility: [
    { metric: "sit_and_reach_cm", weight: 0.3 },
    { metric: "knee_to_wall_cm", weight: 0.25 },
    { metric: "shoulder_flexion_deg", weight: 0.25 },
    { metric: "single_leg_balance_s", weight: 0.2 },
  ],
  power: [
    { metric: "vertical_jump_cm", weight: 0.5 },
    { metric: "broad_jump_cm", weight: 0.3 },
    { metric: "sprint_10m_s", weight: 0.2 },
  ],
  movement: [
    { metric: "steps_day", weight: 0.6 },
    { metric: "active_minutes_day", weight: 0.3 },
    { metric: "sedentary_break_count_day", weight: 0.1 },
  ],
  recovery: [
    { metric: "sleep_duration_h", weight: 0.5 },
    { metric: "sleep_regularity_index", weight: 0.3 },
    { metric: "sleep_efficiency_pct", weight: 0.2 },
    // hrv_rmssd intentionally absent: it enters only as a personal-baseline deviation, see recovery/hrv.ts (planned)
  ],
  nutrition: [
    { metric: "protein_g_per_kg_day", weight: 0.3 },
    { metric: "fiber_g_day", weight: 0.25 },
    { metric: "plant_servings_day", weight: 0.2 },
    { metric: "waist_to_height", weight: 0.15 },
    { metric: "body_fat_pct", weight: 0.1 },
  ],
};

/** Minimum share of a stat's total weight that must be measured before a point estimate is shown. */
export const POINT_COVERAGE_MIN = 0.6;
/** Below this share the stat is "unmeasured". */
export const RANGE_COVERAGE_MIN = 0.2;
/** Below this confidence a covered stat renders as a range, not a point. */
export const POINT_CONFIDENCE_MIN = 0.6;

export function metricsForStat(stat: StatId): readonly Metric[] {
  return STAT_MODEL[stat].map((i) => i.metric);
}
