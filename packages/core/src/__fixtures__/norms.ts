import type { AnyNormTable, NormTable } from "../stats/norms.js";
import { StaticNormRegistry } from "../stats/norms.js";
import type { Metric } from "../types/metric.js";

/**
 * SYNTHETIC norm tables for tests only. Numbers are plausible but invented; status "synthetic" so the
 * engine would label any stat built on them. Real tables come from docs/research/normative-data.md.
 */
function higherTable(metric: Metric, p50: number, spread: number): NormTable {
  const k = (m: number) => p50 + m * spread;
  return {
    metric,
    sex: "pooled",
    status: "synthetic",
    source: "synthetic fixture",
    version: "test",
    bands: [
      {
        minAge: 18,
        maxAge: 99,
        knots: {
          p5: k(-1.65),
          p10: k(-1.28),
          p25: k(-0.67),
          p50: k(0),
          p75: k(0.67),
          p90: k(1.28),
          p95: k(1.65),
        },
      },
    ],
  };
}

/** For lower-is-better metrics the knots are still "value at percentile": p5 is the worst (highest) value. */
function lowerTable(metric: Metric, p50: number, spread: number): NormTable {
  const k = (m: number) => p50 - m * spread;
  return {
    metric,
    sex: "pooled",
    status: "synthetic",
    source: "synthetic fixture",
    version: "test",
    bands: [
      {
        minAge: 18,
        maxAge: 99,
        knots: {
          p5: k(-1.65),
          p10: k(-1.28),
          p25: k(-0.67),
          p50: k(0),
          p75: k(0.67),
          p90: k(1.28),
          p95: k(1.65),
        },
      },
    ],
  };
}

export const SYNTHETIC_TABLES: readonly AnyNormTable[] = [
  // aerobic
  higherTable("vo2max", 42, 7),
  lowerTable("resting_hr", 65, 9),
  higherTable("aerobic_minutes_week", 150, 90),
  // strength
  higherTable("grip_kg", 40, 9),
  higherTable("pushups_max", 18, 10),
  higherTable("pullups_max", 4, 4),
  higherTable("squat_1rm_ratio", 1.0, 0.4),
  higherTable("deadlift_1rm_ratio", 1.3, 0.5),
  higherTable("bench_1rm_ratio", 0.8, 0.3),
  higherTable("sit_to_stand_30s", 14, 4),
  // mobility
  higherTable("sit_and_reach_cm", 0, 8),
  higherTable("knee_to_wall_cm", 10, 3),
  higherTable("shoulder_flexion_deg", 165, 12),
  higherTable("single_leg_balance_s", 30, 15),
  // power
  higherTable("vertical_jump_cm", 40, 10),
  higherTable("broad_jump_cm", 200, 35),
  lowerTable("sprint_10m_s", 2.0, 0.3),
  // movement
  higherTable("steps_day", 6500, 2800),
  higherTable("active_minutes_day", 30, 20),
  higherTable("sedentary_break_count_day", 8, 4),
  // recovery (duration as a band table: healthy band 7–9 h scores high)
  {
    metric: "sleep_duration_h",
    sex: "pooled",
    status: "synthetic",
    source: "synthetic fixture",
    version: "test",
    bands: [
      {
        minAge: 18,
        maxAge: 99,
        knots: [
          [4, 5],
          [5.5, 25],
          [6.5, 60],
          [7, 85],
          [8, 95],
          [9, 85],
          [10, 50],
          [11, 20],
        ],
      },
    ],
  },
  higherTable("sleep_regularity_index", 75, 12),
  higherTable("sleep_efficiency_pct", 85, 6),
  // nutrition
  {
    metric: "protein_g_per_kg_day",
    sex: "pooled",
    status: "synthetic",
    source: "synthetic fixture",
    version: "test",
    bands: [
      {
        minAge: 18,
        maxAge: 99,
        knots: [
          [0.5, 5],
          [0.8, 30],
          [1.2, 60],
          [1.6, 90],
          [2.2, 95],
          [3.0, 80],
        ],
      },
    ],
  },
  higherTable("fiber_g_day", 18, 8),
  higherTable("plant_servings_day", 3, 2),
  lowerTable("waist_to_height", 0.52, 0.07),
  {
    metric: "body_fat_pct",
    sex: "pooled",
    status: "synthetic",
    source: "synthetic fixture",
    version: "test",
    bands: [
      {
        minAge: 18,
        maxAge: 99,
        knots: [
          [5, 40],
          [10, 85],
          [18, 90],
          [25, 60],
          [32, 30],
          [40, 10],
        ],
      },
    ],
  },
];

export const syntheticNorms = new StaticNormRegistry(SYNTHETIC_TABLES);
