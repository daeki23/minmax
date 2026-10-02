import type { Metric } from "../types/metric.js";
import type { StatId } from "../types/stat.js";

/**
 * Which metrics feed which stat and with what weight.
 * Weights follow the "Proposed stat model" in docs/research/normative-data.md where it gives them and
 * are otherwise the engine's provisional choice. Weights are relative within a stat; metrics without a
 * measurement OR without a norm table for the user's age/sex are renormalised away, so a user with only
 * grip strength still gets a Strength stat (with lower confidence and a "range" rendering).
 *
 * Metrics listed here without a published table (pull-ups, barbell lifts, sprint, broad jump, shoulder
 * flexion, plant servings, sedentary breaks) stay in the model so that measurements are kept and shown,
 * but contribute nothing to the percentile until a table exists.
 */
export interface StatInput {
  readonly metric: Metric;
  readonly weight: number;
  /** If true, the stat cannot be computed without this metric. */
  readonly required?: boolean;
}

export const STAT_MODEL: Readonly<Record<StatId, readonly StatInput[]>> = {
  strength: [
    { metric: "grip_kg", weight: 0.5 }, // Dodds 2014 population percentile
    { metric: "pushups_max", weight: 0.2 }, // criterion (Cooper p50, Yang 2019 thresholds)
    { metric: "sit_to_stand_30s", weight: 0.15 }, // Rikli & Jones, 60+ only
    { metric: "pullups_max", weight: 0.05 }, // no adult population norms yet
    { metric: "squat_1rm_ratio", weight: 0.04 }, // lifter (community) scale pending
    { metric: "deadlift_1rm_ratio", weight: 0.04 },
    { metric: "bench_1rm_ratio", weight: 0.02 },
  ],
  aerobic: [
    { metric: "vo2max", weight: 0.8 }, // FRIEND 2022
    { metric: "resting_hr", weight: 0.1 }, // weak cross-sectional metric (Quer 2020)
    { metric: "aerobic_minutes_week", weight: 0.1 }, // WHO criterion
  ],
  mobility: [
    { metric: "sit_and_reach_cm", weight: 0.3 },
    { metric: "knee_to_wall_cm", weight: 0.3 },
    { metric: "single_leg_balance_s", weight: 0.25 },
    { metric: "shoulder_flexion_deg", weight: 0.15 }, // no norms verified
  ],
  power: [
    { metric: "vertical_jump_cm", weight: 0.7 }, // Koivunen 2026, modelled
    { metric: "broad_jump_cm", weight: 0.2 }, // no verified adult norms
    { metric: "sprint_10m_s", weight: 0.1 }, // no verified adult norms
  ],
  movement: [
    { metric: "steps_day", weight: 0.7 }, // dose-response curve
    { metric: "active_minutes_day", weight: 0.2 }, // WHO criterion
    { metric: "sedentary_break_count_day", weight: 0.1 }, // no norms
  ],
  recovery: [
    { metric: "sleep_duration_h", weight: 0.35 }, // AASM ≥ 7 h criterion
    { metric: "sleep_regularity_index", weight: 0.35 }, // Windred 2024 percentile
    { metric: "sleep_efficiency_pct", weight: 0.15 }, // NSF criterion
    // HRV (0.15 in the research model) intentionally absent: it enters only as a personal-baseline
    // deviation, see recovery/hrv.ts, because no universal HRV norms exist (Nunan 2010).
  ],
  nutrition: [
    { metric: "protein_g_per_kg_day", weight: 0.2 }, // Morton 2018 cap 1.6 g/kg
    { metric: "fiber_g_day", weight: 0.15 }, // Reynolds 2019 25-29 g
    { metric: "plant_servings_day", weight: 0.1 }, // no table yet
    { metric: "waist_to_height", weight: 0.15 }, // NICE NG246
    { metric: "body_fat_pct", weight: 0.05 }, // Gallagher 2000 bands, low device trust
    { metric: "apob_mg_dl", weight: 0.15 }, // NHANES inverse percentile
    { metric: "hba1c_pct", weight: 0.1 }, // ADA bands
    { metric: "systolic_bp", weight: 0.1 }, // AHA/ACC bands
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
