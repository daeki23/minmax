import type { Measurement } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import { METRIC_SPECS } from "../types/metric.js";
import { clamp } from "../util/math.js";
import { parseIso } from "../util/time.js";
import type { Quest, QuestTemplate, Session } from "./types.js";

export interface ProgressInput {
  readonly measurements: readonly Measurement[];
  readonly sessions: readonly Session[];
}

function inWindow(iso: string, startIso: string, endIso: string): boolean {
  const t = parseIso(iso);
  return t >= parseIso(startIso) && t < parseIso(endIso);
}

function meets(op: ">=" | "<=", value: number, threshold: number): boolean {
  return op === ">=" ? value >= threshold : value <= threshold;
}

/** Daily best/sum per calendar day for a metric within a window; sum for accumulating metrics, max otherwise. */
const ACCUMULATING: ReadonlySet<Metric> = new Set<Metric>([
  "steps_day",
  "active_minutes_day",
  "sedentary_break_count_day",
  "fiber_g_day",
  "plant_servings_day",
]);

function dailyValues(metric: Metric, ms: readonly Measurement[], start: string, end: string): number[] {
  const byDay = new Map<string, number[]>();
  for (const m of ms) {
    if (m.metric !== metric || !inWindow(m.measuredAt, start, end)) continue;
    const day = m.measuredAt.slice(0, 10);
    const arr = byDay.get(day);
    if (arr) arr.push(m.value);
    else byDay.set(day, [m.value]);
  }
  const out: number[] = [];
  for (const vals of byDay.values()) {
    if (ACCUMULATING.has(metric)) out.push(vals.reduce((a, b) => a + b, 0));
    else out.push(METRIC_SPECS[metric].direction === "lower" ? Math.min(...vals) : Math.max(...vals));
  }
  return out;
}

/**
 * Evaluate a quest's progress (0..1) against data in its window. Pure.
 * Progress is a fraction toward the criterion so the UI can show partial completion honestly.
 */
export function evaluateProgress(template: QuestTemplate, quest: Quest, input: ProgressInput): number {
  const c = template.criterion;
  const { startsAt: start, endsAt: end } = quest;
  switch (c.kind) {
    case "sessions": {
      const n = input.sessions.filter(
        (s) => s.type === c.sessionType && s.minutes >= c.minMinutes && inWindow(s.startedAt, start, end),
      ).length;
      return clamp(n / c.count, 0, 1);
    }
    case "daily_average": {
      const days = dailyValues(c.metric, input.measurements, start, end);
      if (days.length === 0) return 0;
      const avg = days.reduce((a, b) => a + b, 0) / days.length;
      // Partial credit scales with the ratio and with how many days actually reported.
      // Complete only when the target is met with at least 70 % of the window's days reporting.
      const coverage = clamp(days.length / template.windowDays, 0, 1);
      const ratio = c.op === ">=" ? avg / c.target : c.target / Math.max(avg, 1e-9);
      if (ratio >= 1 && coverage >= 0.7) return 1;
      return clamp(Math.min(ratio, 1) * coverage, 0, 0.99);
    }
    case "days_meeting": {
      const days = dailyValues(c.metric, input.measurements, start, end);
      const hits = days.filter((v) => meets(c.op, v, c.threshold)).length;
      return clamp(hits / c.days, 0, 1);
    }
    case "measurement_exists": {
      const found = input.measurements.some(
        (m) =>
          m.metric === c.metric &&
          inWindow(m.measuredAt, start, end) &&
          (c.minTrust === undefined || m.trustLevel >= c.minTrust),
      );
      return found ? 1 : 0;
    }
    case "improve": {
      const before = input.measurements
        .filter((m) => m.metric === c.metric && parseIso(m.measuredAt) < parseIso(start))
        .map((m) => m.value);
      const during = input.measurements
        .filter((m) => m.metric === c.metric && inWindow(m.measuredAt, start, end))
        .map((m) => m.value);
      if (before.length === 0 || during.length === 0) return 0;
      const higher = METRIC_SPECS[c.metric].direction !== "lower";
      const base = higher ? Math.max(...before) : Math.min(...before);
      const best = higher ? Math.max(...during) : Math.min(...during);
      const gain = higher ? best - base : base - best;
      return clamp(gain / c.delta, 0, 1);
    }
  }
}

export function applyProgress(quest: Quest, progress: number, now: string): Quest {
  if (quest.status !== "active") return quest;
  if (progress >= 1) return { ...quest, progress: 1, status: "completed", completedAt: now };
  return { ...quest, progress };
}
