import type { Measurement, Source, TrustLevel } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import { METRIC_SPECS } from "../types/metric.js";
import { daysBetween } from "../util/time.js";
import { corroborated, penalisedForDisagreement, recencyFactor } from "./confidence.js";

/**
 * One current best value per metric, with the measurements it came from and the rule used.
 * See docs/03-data-provenance.md "Resolving disagreement between sources".
 */
export interface MetricEstimate {
  readonly metric: Metric;
  readonly value: number;
  readonly unit: string;
  readonly confidence: number;
  readonly trustLevel: TrustLevel;
  readonly sources: readonly Source[];
  readonly measurementIds: readonly string[];
  readonly measuredAt: string;
  readonly rule: "single" | "highest_trust" | "most_recent" | "corroborated" | "disagreement";
  /** Set when same-trust sources disagreed beyond tolerance; the UI shows it. */
  readonly disagreement?: { readonly withSource: Source; readonly delta: number };
  readonly ageDays: number;
}

export interface ResolveOptions {
  readonly now: string;
  /** Measurements older than freshness × this factor are ignored entirely. Default 3. */
  readonly maxAgeFactor?: number;
}

function isPlausible(m: Measurement): boolean {
  const spec = METRIC_SPECS[m.metric];
  return Number.isFinite(m.value) && m.value >= spec.min && m.value <= spec.max;
}

/**
 * Rules, in order:
 * 1. Prefer the highest trust level present.
 * 2. Within that level prefer the most recent inside the metric's freshness window.
 * 3. Same-trust sources disagreeing beyond tolerance keep the preferred value, lower its confidence, flag it.
 * 4. Never average across trust levels. Agreement within tolerance raises confidence (corroboration).
 */
export function resolveMetric(
  metric: Metric,
  all: readonly Measurement[],
  opts: ResolveOptions,
): MetricEstimate | null {
  const spec = METRIC_SPECS[metric];
  const maxAge = spec.freshnessDays * (opts.maxAgeFactor ?? 3);
  const candidates = all
    .filter((m) => m.metric === metric && isPlausible(m))
    .map((m) => ({ m, age: daysBetween(m.measuredAt, opts.now) }))
    .filter(({ age }) => age >= 0 && age <= maxAge);
  if (candidates.length === 0) return null;

  const topTrust = Math.max(...candidates.map((c) => c.m.trustLevel)) as TrustLevel;
  const top = candidates.filter((c) => c.m.trustLevel === topTrust).sort((a, b) => a.age - b.age);
  const preferred = top[0] as (typeof top)[number];

  let confidence = preferred.m.confidence * recencyFactor(preferred.age, spec.freshnessDays);
  let rule: MetricEstimate["rule"] =
    candidates.length === 1 ? "single" : top.length === candidates.length ? "most_recent" : "highest_trust";
  let disagreement: MetricEstimate["disagreement"];
  const sources = new Set<Source>([preferred.m.source]);
  const ids = [preferred.m.id];

  // Corroboration / disagreement only against the most recent value of each OTHER source at the same
  // trust level, inside the freshness window. A source never corroborates itself, and a source's older
  // readings never count as disagreement with its own newer one (`top` is sorted most recent first).
  const seenSources = new Set<Source>([preferred.m.source]);
  const others: typeof top = [];
  for (const c of top) {
    if (c.age > spec.freshnessDays || seenSources.has(c.m.source)) continue;
    seenSources.add(c.m.source);
    others.push(c);
  }
  for (const o of others) {
    const delta = Math.abs(o.m.value - preferred.m.value);
    if (delta <= spec.tolerance) {
      confidence = corroborated(confidence);
      rule = "corroborated";
      sources.add(o.m.source);
      ids.push(o.m.id);
    } else if (!disagreement) {
      confidence = penalisedForDisagreement(confidence);
      rule = "disagreement";
      disagreement = { withSource: o.m.source, delta };
    }
  }

  const base: Omit<MetricEstimate, "disagreement"> = {
    metric,
    value: preferred.m.value,
    unit: preferred.m.unit,
    confidence,
    trustLevel: topTrust,
    sources: [...sources],
    measurementIds: ids,
    measuredAt: preferred.m.measuredAt,
    rule,
    ageDays: preferred.age,
  };
  return disagreement ? { ...base, disagreement } : base;
}

export function resolveAll(
  all: readonly Measurement[],
  opts: ResolveOptions,
): ReadonlyMap<Metric, MetricEstimate> {
  const metrics = new Set(all.map((m) => m.metric));
  const out = new Map<Metric, MetricEstimate>();
  for (const metric of metrics) {
    const e = resolveMetric(metric, all, opts);
    if (e) out.set(metric, e);
  }
  return out;
}

/**
 * Daily aggregate for metrics that arrive as many samples per day (steps, sleep).
 * Produces one synthetic measurement per calendar day per source, keeping the best trust and
 * the minimum confidence of its parts. Hosts call this before resolve for such metrics.
 */
export function aggregateDaily(
  metric: Metric,
  all: readonly Measurement[],
  agg: "sum" | "max" | "mean",
): Measurement[] {
  const groups = new Map<string, Measurement[]>();
  for (const m of all) {
    if (m.metric !== metric) continue;
    const key = `${m.source}|${m.measuredAt.slice(0, 10)}`;
    const g = groups.get(key);
    if (g) g.push(m);
    else groups.set(key, [m]);
  }
  const out: Measurement[] = [];
  for (const [key, g] of groups) {
    const values = g.map((m) => m.value);
    const value =
      agg === "sum"
        ? values.reduce((a, b) => a + b, 0)
        : agg === "max"
          ? Math.max(...values)
          : values.reduce((a, b) => a + b, 0) / values.length;
    const first = g[0] as Measurement;
    const day = key.split("|")[1] as string;
    out.push({
      ...first,
      id: `${first.id}:day:${day}`,
      value,
      measuredAt: `${day}T12:00:00.000Z`,
      confidence: Math.min(...g.map((m) => m.confidence)),
      trustLevel: Math.max(...g.map((m) => m.trustLevel)) as TrustLevel,
    });
  }
  return out;
}
