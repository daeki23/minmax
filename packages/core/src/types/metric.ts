/**
 * Metrics are the raw things MINMAX measures. Every Measurement names exactly one metric.
 * Stats (see ./stat.ts) are derived from one or more metrics via normative tables.
 */
export const METRICS = [
  // aerobic
  "vo2max", // ml/kg/min
  "resting_hr", // bpm
  "hrv_rmssd", // ms, used only relative to personal baseline
  "aerobic_minutes_week", // min of moderate+vigorous activity per week
  // strength
  "grip_kg", // best hand, kg
  "pushups_max", // reps, strict
  "pullups_max", // reps, strict
  "sit_to_stand_30s", // reps in 30 s
  "squat_1rm_ratio", // estimated 1RM / bodyweight
  "bench_1rm_ratio",
  "deadlift_1rm_ratio",
  // power
  "vertical_jump_cm",
  "broad_jump_cm",
  "sprint_10m_s", // lower is better
  // mobility
  "sit_and_reach_cm", // relative to toes, positive = past toes
  "knee_to_wall_cm", // ankle dorsiflexion
  "shoulder_flexion_deg",
  "single_leg_balance_s",
  // movement
  "steps_day",
  "active_minutes_day",
  "sedentary_break_count_day",
  "vilpa_bouts_day", // vigorous bursts of ≥1 min in daily life (stairs, uphill walk)
  // per-session training markers (one measurement per workout, dated by the workout)
  "hr_time_above_85pct", // minutes of a session with HR ≥ 85 % of max; verifies interval quality
  // recovery
  "sleep_duration_h",
  "sleep_regularity_index", // 0-100
  "sleep_efficiency_pct",
  "wake_deviation_min", // |wake time − target wake time| in minutes; lower is better
  // nutrition / metabolic
  "protein_g_per_kg_day",
  "protein_meals_day", // meals that day with ≥ 0.4 g/kg protein
  "fiber_g_day",
  "plant_servings_day",
  "alcohol_drinks_day", // standard drinks; 0 is the target
  "body_fat_pct", // lower-is-better within healthy range, handled by table shape
  "waist_to_height",
  "bodyweight_kg", // not a stat input; used for ratios and claims
  // labs (manual entry or lab import)
  "apob_mg_dl",
  "ldl_mg_dl",
  "hba1c_pct",
  "fasting_glucose_mg_dl",
  "hs_crp_mg_l",
  "systolic_bp",
  "diastolic_bp",
] as const;

export type Metric = (typeof METRICS)[number];

/** Which way is "better" for percentile mapping. `none` = not ranked (e.g. bodyweight). */
export type Direction = "higher" | "lower" | "none";

export interface MetricSpec {
  readonly unit: string;
  readonly direction: Direction;
  /** Days within which a measurement is considered current. */
  readonly freshnessDays: number;
  /** Absolute disagreement between two same-trust sources that still counts as agreement. */
  readonly tolerance: number;
  /** Plausible physical bounds; values outside are rejected as data errors. */
  readonly min: number;
  readonly max: number;
}

export const METRIC_SPECS: Readonly<Record<Metric, MetricSpec>> = {
  vo2max: { unit: "ml/kg/min", direction: "higher", freshnessDays: 30, tolerance: 3, min: 10, max: 95 },
  resting_hr: { unit: "bpm", direction: "lower", freshnessDays: 7, tolerance: 4, min: 30, max: 120 },
  hrv_rmssd: { unit: "ms", direction: "none", freshnessDays: 7, tolerance: 15, min: 5, max: 300 },
  aerobic_minutes_week: {
    unit: "min",
    direction: "higher",
    freshnessDays: 7,
    tolerance: 30,
    min: 0,
    max: 3000,
  },

  grip_kg: { unit: "kg", direction: "higher", freshnessDays: 90, tolerance: 3, min: 5, max: 120 },
  pushups_max: { unit: "reps", direction: "higher", freshnessDays: 90, tolerance: 3, min: 0, max: 200 },
  pullups_max: { unit: "reps", direction: "higher", freshnessDays: 90, tolerance: 2, min: 0, max: 80 },
  sit_to_stand_30s: { unit: "reps", direction: "higher", freshnessDays: 90, tolerance: 2, min: 0, max: 60 },
  squat_1rm_ratio: { unit: "x BW", direction: "higher", freshnessDays: 120, tolerance: 0.1, min: 0, max: 5 },
  bench_1rm_ratio: { unit: "x BW", direction: "higher", freshnessDays: 120, tolerance: 0.1, min: 0, max: 4 },
  deadlift_1rm_ratio: {
    unit: "x BW",
    direction: "higher",
    freshnessDays: 120,
    tolerance: 0.1,
    min: 0,
    max: 6,
  },

  vertical_jump_cm: { unit: "cm", direction: "higher", freshnessDays: 90, tolerance: 3, min: 5, max: 120 },
  broad_jump_cm: { unit: "cm", direction: "higher", freshnessDays: 90, tolerance: 8, min: 50, max: 400 },
  sprint_10m_s: { unit: "s", direction: "lower", freshnessDays: 90, tolerance: 0.1, min: 1.2, max: 5 },

  sit_and_reach_cm: { unit: "cm", direction: "higher", freshnessDays: 90, tolerance: 2, min: -40, max: 40 },
  knee_to_wall_cm: { unit: "cm", direction: "higher", freshnessDays: 90, tolerance: 1.5, min: 0, max: 25 },
  shoulder_flexion_deg: {
    unit: "deg",
    direction: "higher",
    freshnessDays: 90,
    tolerance: 8,
    min: 60,
    max: 200,
  },
  single_leg_balance_s: { unit: "s", direction: "higher", freshnessDays: 90, tolerance: 5, min: 0, max: 180 },

  steps_day: { unit: "steps", direction: "higher", freshnessDays: 1, tolerance: 800, min: 0, max: 100000 },
  active_minutes_day: {
    unit: "min",
    direction: "higher",
    freshnessDays: 1,
    tolerance: 10,
    min: 0,
    max: 1440,
  },
  sedentary_break_count_day: {
    unit: "breaks",
    direction: "higher",
    freshnessDays: 1,
    tolerance: 2,
    min: 0,
    max: 100,
  },
  vilpa_bouts_day: { unit: "bouts", direction: "higher", freshnessDays: 1, tolerance: 1, min: 0, max: 50 },
  hr_time_above_85pct: { unit: "min", direction: "higher", freshnessDays: 7, tolerance: 2, min: 0, max: 180 },

  sleep_duration_h: { unit: "h", direction: "none", freshnessDays: 1, tolerance: 0.5, min: 0, max: 16 },
  sleep_regularity_index: {
    unit: "SRI",
    direction: "higher",
    freshnessDays: 7,
    tolerance: 5,
    min: 0,
    max: 100,
  },
  sleep_efficiency_pct: { unit: "%", direction: "higher", freshnessDays: 7, tolerance: 4, min: 30, max: 100 },
  wake_deviation_min: { unit: "min", direction: "lower", freshnessDays: 1, tolerance: 10, min: 0, max: 720 },

  protein_g_per_kg_day: { unit: "g/kg", direction: "none", freshnessDays: 7, tolerance: 0.2, min: 0, max: 5 },
  protein_meals_day: { unit: "meals", direction: "higher", freshnessDays: 7, tolerance: 1, min: 0, max: 10 },
  fiber_g_day: { unit: "g", direction: "higher", freshnessDays: 7, tolerance: 4, min: 0, max: 120 },
  plant_servings_day: {
    unit: "servings",
    direction: "higher",
    freshnessDays: 7,
    tolerance: 1,
    min: 0,
    max: 30,
  },
  alcohol_drinks_day: { unit: "drinks", direction: "lower", freshnessDays: 1, tolerance: 1, min: 0, max: 40 },
  body_fat_pct: { unit: "%", direction: "none", freshnessDays: 60, tolerance: 2.5, min: 2, max: 70 },
  waist_to_height: {
    unit: "ratio",
    direction: "lower",
    freshnessDays: 60,
    tolerance: 0.02,
    min: 0.3,
    max: 1,
  },
  bodyweight_kg: { unit: "kg", direction: "none", freshnessDays: 14, tolerance: 1.5, min: 25, max: 300 },

  apob_mg_dl: { unit: "mg/dL", direction: "lower", freshnessDays: 365, tolerance: 8, min: 20, max: 300 },
  ldl_mg_dl: { unit: "mg/dL", direction: "lower", freshnessDays: 365, tolerance: 8, min: 10, max: 400 },
  hba1c_pct: { unit: "%", direction: "lower", freshnessDays: 365, tolerance: 0.2, min: 3.5, max: 15 },
  fasting_glucose_mg_dl: {
    unit: "mg/dL",
    direction: "lower",
    freshnessDays: 365,
    tolerance: 6,
    min: 40,
    max: 400,
  },
  hs_crp_mg_l: { unit: "mg/L", direction: "lower", freshnessDays: 365, tolerance: 0.5, min: 0, max: 100 },
  systolic_bp: { unit: "mmHg", direction: "lower", freshnessDays: 90, tolerance: 6, min: 60, max: 250 },
  diastolic_bp: { unit: "mmHg", direction: "lower", freshnessDays: 90, tolerance: 5, min: 30, max: 150 },
};

export function isMetric(value: string): value is Metric {
  return (METRICS as readonly string[]).includes(value);
}
