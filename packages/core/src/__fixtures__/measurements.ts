import { withProvenance } from "../provenance/confidence.js";
import type { Measurement, Source, TrustLevel, UserProfile } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import { METRIC_SPECS } from "../types/metric.js";

export const NOW = "2026-10-02T12:00:00.000Z";
export const USER = "user_test";
export const PROFILE: UserProfile = { userId: USER, sex: "male", age: 32 };

let seq = 0;

export function m(
  metric: Metric,
  value: number,
  opts: {
    source?: Source;
    daysAgo?: number;
    trust?: TrustLevel;
    method?: string;
    id?: string;
  } = {},
): Measurement {
  seq += 1;
  const source = opts.source ?? "minmax_app";
  const measuredAt = new Date(Date.parse(NOW) - (opts.daysAgo ?? 0) * 86_400_000).toISOString();
  const base = {
    id: opts.id ?? `m_${seq}`,
    userId: USER,
    metric,
    value,
    unit: METRIC_SPECS[metric].unit,
    measuredAt,
    recordedAt: measuredAt,
    source,
  };
  const withOpt = {
    ...base,
    ...(opts.trust !== undefined ? { trustLevel: opts.trust } : {}),
    ...(opts.method !== undefined ? { method: opts.method } : {}),
  };
  return withProvenance(withOpt);
}

/** A reasonably complete, device-sourced data set for a fit 32-year-old. */
export function fitUserMeasurements(): Measurement[] {
  return [
    m("vo2max", 52, { source: "garmin", method: "firstbeat_estimate" }),
    m("resting_hr", 50, { source: "garmin" }),
    m("aerobic_minutes_week", 240, { source: "garmin" }),
    m("grip_kg", 52, { source: "minmax_app" }),
    m("pushups_max", 35, { source: "minmax_app" }),
    m("pullups_max", 12, { source: "minmax_app" }),
    m("sit_to_stand_30s", 20, { source: "minmax_app" }),
    m("sit_and_reach_cm", -4, { source: "minmax_app" }),
    m("knee_to_wall_cm", 9, { source: "minmax_app" }),
    m("shoulder_flexion_deg", 160, { source: "minmax_app" }),
    m("single_leg_balance_s", 25, { source: "minmax_app" }),
    m("vertical_jump_cm", 48, { source: "minmax_app" }),
    m("broad_jump_cm", 230, { source: "minmax_app" }),
    m("steps_day", 9500, { source: "garmin" }),
    m("active_minutes_day", 45, { source: "garmin" }),
    m("sleep_duration_h", 7.4, { source: "garmin" }),
    m("sleep_regularity_index", 82, { source: "garmin" }),
    m("sleep_efficiency_pct", 88, { source: "garmin" }),
    m("protein_g_per_kg_day", 1.7, { source: "self" }),
    m("fiber_g_day", 24, { source: "self" }),
    m("plant_servings_day", 4, { source: "self" }),
    m("waist_to_height", 0.46, { source: "minmax_app" }),
  ];
}
