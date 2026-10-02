/**
 * Conformance vectors: deterministic inputs and the engine's outputs for them, serialised as plain
 * JSON. A port of the engine to another language (Dart, Kotlin, Swift) reproduces the inputs and
 * must match the outputs; the vitest in this folder pins the committed file to this implementation.
 *
 *   pnpm --filter @minmax/core vectors     # regenerate conformance/vectors.json after an intended change
 *
 * Nothing here is random or clock-dependent: every timestamp is fixed and every host hook (id
 * factories) is a pure function recorded in the vector. See conformance/README.md for tolerances.
 */
import { fitUserMeasurements, NOW, PROFILE, USER } from "../__fixtures__/measurements.js";
import { assembleCharacter } from "../character/assemble.js";
import { BOTTLENECK_SWITCH_DAYS, INITIAL_BOTTLENECK, updateBottleneck } from "../character/bottleneck.js";
import { buildWeights, proposeBuild } from "../character/class.js";
import { chapterXpTarget, characterLevel, xpProgress } from "../character/level.js";
import { deriveOrigin } from "../character/origin.js";
import { allRegionStatuses } from "../character/regions.js";
import { buildUnsignedClaim, checkPredicate, claimPayload } from "../claims/issue.js";
import { levelLine, statLine, xpLine } from "../modes/vocabulary.js";
import { resolveAll } from "../provenance/resolve.js";
import { evaluateProgress } from "../quests/progress.js";
import { scheduleWeek } from "../quests/schedule.js";
import { QUEST_TEMPLATES, QUEST_TEMPLATES_VERSION, templateById } from "../quests/templates.js";
import type { Quest, Session } from "../quests/types.js";
import { hrvReadiness } from "../recovery/hrv.js";
import { combinePercentiles } from "../stats/compute.js";
import { isBandTable, percentileFor } from "../stats/norms.js";
import { PUBLISHED_TABLES, PUBLISHED_TABLES_VERSION, publishedNorms } from "../stats/published.js";
import type { ClassId, OriginId } from "../types/character.js";
import type { Predicate } from "../types/claim.js";
import type { Measurement } from "../types/measurement.js";
import type { StatId, StatValue } from "../types/stat.js";
import { STATS } from "../types/stat.js";
import { groupThousands, interpolate, round } from "../util/math.js";
import { normalCdf, probit } from "../util/normal.js";
import { addDays, startOfIsoWeek, toDateOnly } from "../util/time.js";
import { ENGINE_VERSION } from "../version.js";

export const CONFORMANCE_SCHEMA = "minmax.conformance.v1";

/** Point stat values for a synthetic sheet; `null` leaves the stat unmeasured. */
function sheet(values: Readonly<Partial<Record<StatId, number | null>>>): Record<StatId, StatValue> {
  const out = {} as Record<StatId, StatValue>;
  for (const s of STATS) {
    const v = values[s];
    out[s] =
      v === undefined || v === null
        ? {
            stat: s,
            kind: "unmeasured",
            missing: [],
            contributions: [],
            computedAt: NOW,
            engineVersion: ENGINE_VERSION,
          }
        : {
            stat: s,
            kind: "point",
            value: v,
            confidence: 0.8,
            trustLevel: 2,
            normStatus: "provisional",
            basis: "population",
            contributions: [],
            computedAt: NOW,
            engineVersion: ENGINE_VERSION,
          };
  }
  return out;
}

const SHEETS: Readonly<Record<string, Readonly<Partial<Record<StatId, number | null>>>>> = {
  empty: {},
  one_low: { strength: 1 },
  watch_day1: { movement: 55, aerobic: 62, recovery: 48 },
  median_all: {
    strength: 50,
    aerobic: 50,
    mobility: 50,
    power: 50,
    movement: 50,
    recovery: 50,
    nutrition: 50,
  },
  fit_all: { strength: 71, aerobic: 84, mobility: 40, power: 66, movement: 77, recovery: 58, nutrition: 61 },
  elite_all: {
    strength: 99,
    aerobic: 99,
    mobility: 99,
    power: 99,
    movement: 99,
    recovery: 99,
    nutrition: 99,
  },
  flat_profile: {
    strength: 52,
    aerobic: 48,
    mobility: 55,
    power: 50,
    movement: 49,
    recovery: 53,
    nutrition: 47,
  },
  iron_wind: {
    strength: 80,
    aerobic: 78,
    mobility: 40,
    power: 60,
    movement: 50,
    recovery: 55,
    nutrition: 45,
  },
  arena_locked: {
    strength: 39,
    aerobic: 70,
    mobility: 60,
    power: 50,
    movement: 60,
    recovery: 60,
    nutrition: 60,
  },
};

function sortedEstimates(map: ReadonlyMap<string, unknown>): unknown[] {
  return [...map.keys()].sort().map((k) => map.get(k));
}

/** Everything a port needs: the inputs as given to the engine and the outputs it produced. */
export function generateVectors(): Record<string, unknown> {
  // The fixture numbers its ids from a module counter; renumber so the vector does not depend on call order.
  const measurements = fitUserMeasurements().map((m, i) => ({
    ...m,
    id: `m_${String(i + 1).padStart(2, "0")}`,
  }));

  // --- util -------------------------------------------------------------------------------------
  const zs = [-3, -2.5, -2, -1.5, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 1.5, 2, 2.5, 3];
  const ps = [0.001, 0.01, 0.02425, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.975, 0.99, 0.999];
  const util = {
    normalCdf: zs.map((z) => ({ z, p: normalCdf(z) })),
    probit: ps.map((p) => ({ p, z: probit(p) })),
    round: [
      { x: 0.5, digits: 0, result: round(0.5) },
      { x: 1.5, digits: 0, result: round(1.5) },
      { x: 2.5, digits: 0, result: round(2.5) },
      { x: -0.5, digits: 0, result: round(-0.5) },
      { x: -1.5, digits: 0, result: round(-1.5) },
      { x: 0.125, digits: 2, result: round(0.125, 2) },
      { x: 0.135, digits: 2, result: round(0.135, 2) },
      { x: 72.45, digits: 1, result: round(72.45, 1) },
      { x: 1.005, digits: 2, result: round(1.005, 2) },
    ],
    groupThousands: [0, 7, 999, 1000, 8420, 1234567.6, -10000].map((n) => ({ n, result: groupThousands(n) })),
    interpolate: [
      {
        knots: [
          [0, 0],
          [10, 100],
        ],
        x: 2.5,
        result: interpolate(
          [
            [0, 0],
            [10, 100],
          ],
          2.5,
        ),
      },
      {
        knots: [
          [0, 0],
          [10, 100],
        ],
        x: -1,
        result: interpolate(
          [
            [0, 0],
            [10, 100],
          ],
          -1,
        ),
      },
      {
        knots: [
          [0, 0],
          [10, 100],
        ],
        x: 11,
        result: interpolate(
          [
            [0, 0],
            [10, 100],
          ],
          11,
        ),
      },
      {
        knots: [
          [5, 20],
          [5, 80],
          [9, 99],
        ],
        x: 5,
        result: interpolate(
          [
            [5, 20],
            [5, 80],
            [9, 99],
          ],
          5,
        ),
      },
    ],
    time: {
      startOfIsoWeek: [
        NOW,
        "2026-10-05T00:00:00.000Z",
        "2026-10-04T23:59:59.000Z",
        "2026-01-01T06:00:00.000Z",
      ].map((iso) => ({ iso, result: startOfIsoWeek(iso) })),
      addDays: [
        { iso: NOW, days: 7, result: addDays(NOW, 7) },
        { iso: NOW, days: -0.5, result: addDays(NOW, -0.5) },
      ],
      toDateOnly: [
        { iso: NOW, result: toDateOnly(NOW) },
        { iso: "2026-12-31T23:30:00.000Z", result: toDateOnly("2026-12-31T23:30:00.000Z") },
      ],
    },
  };

  // --- norm tables -----------------------------------------------------------------------------
  // One probe per published table at a few values and ages, including outside the anchors.
  const tables = PUBLISHED_TABLES.map((t) => {
    const ages = t.bands.map((b) => Math.round((b.minAge + b.maxAge) / 2));
    const firstAge = t.bands[0]?.minAge ?? 20;
    const lastAge = t.bands[t.bands.length - 1]?.maxAge ?? 80;
    const probeAges = [...new Set([firstAge, ...ages, lastAge, Math.round((firstAge + lastAge) / 2) + 1])];
    // Probe values span the first band's published range and reach beyond it on both sides.
    const published: number[] = isBandTable(t)
      ? (t.bands[0]?.knots ?? []).map(([v]) => v)
      : (t.bands[0]?.anchors ?? []).map(([, v]) => v);
    const values: number[] = [];
    if (published.length > 0) {
      const lo = Math.min(...published);
      const hi = Math.max(...published);
      const reach = isBandTable(t) ? 0.2 : 0.5;
      values.push(lo - (hi - lo) * reach, lo, (lo + hi) / 2, hi, hi + (hi - lo) * reach);
    }
    const probes = [];
    for (const age of probeAges)
      for (const value of values) probes.push({ age, value, percentile: percentileFor(t, value, age) });
    return { metric: t.metric, sex: t.sex, basis: t.basis, status: t.status, version: t.version, probes };
  });
  const combine = [
    [[50, 1]],
    [
      [90, 1],
      [10, 1],
    ],
    [
      [95, 2],
      [50, 1],
    ],
    [
      [1, 1],
      [99, 1],
    ],
    [
      [99.9, 1],
      [0.1, 3],
    ],
    [
      [60, 0.4],
      [70, 0.4],
      [20, 0.2],
    ],
  ].map((pairs) => ({ pairs, result: combinePercentiles(pairs as [number, number][]) }));

  // --- character --------------------------------------------------------------------------------
  const sheets = Object.fromEntries(
    Object.entries(SHEETS).map(([k, v]) => [k, Object.fromEntries(STATS.map((s) => [s, v[s] ?? null]))]),
  );
  const level = Object.entries(SHEETS).map(([name, v]) => ({ sheet: name, level: characterLevel(sheet(v)) }));
  const origin = Object.entries(SHEETS).map(([name, v]) => ({
    sheet: name,
    derivation: deriveOrigin(sheet(v), NOW),
  }));
  const classIds: ClassId[] = ["muscle", "aerobic", "mobility", "nutrition", "hybrid", "all"];
  const originIds: OriginId[] = [
    "ironblood",
    "engineborn",
    "riverborn",
    "stormborn",
    "wayfarer",
    "stillwater",
    "rootborn",
    "evenkin",
  ];
  const mids = {
    strength: 71,
    aerobic: 84,
    mobility: 40,
    power: 66,
    movement: 77,
    recovery: 58,
    nutrition: 61,
  };
  const build = classIds.flatMap((c) =>
    originIds.map((o) => ({ classId: c, originId: o, statMidpoints: mids, build: proposeBuild(c, o, mids) })),
  );
  const partialMids = { aerobic: 62, movement: 55, recovery: 48 };
  const weights = classIds.map((c) => ({
    classId: c,
    statMidpoints: partialMids,
    weights: buildWeights(c, partialMids),
  }));

  // Bottleneck: a 16-day sequence in which mobility starts lowest, then nutrition undercuts it by the margin.
  const bottleneck: unknown[] = [];
  let bState = INITIAL_BOTTLENECK;
  for (let day = 0; day <= BOTTLENECK_SWITCH_DAYS + 1; day++) {
    const now = addDays(NOW, day);
    const nutrition = day === 0 ? 45 : day < 3 ? 36 : day === 3 ? 38 : 34; // day 3 interrupts the challenge
    const stats = sheet({
      strength: 60,
      aerobic: 70,
      mobility: 40,
      power: 55,
      movement: 65,
      recovery: 58,
      nutrition,
    });
    const next = updateBottleneck(bState, stats, now);
    bottleneck.push({ day, now, nutrition, mobility: 40, previous: bState, next });
    bState = next;
  }
  // The current bottleneck turns unmeasured: the lowest measured stat takes over at once.
  const dropped = updateBottleneck(
    bState,
    sheet({ strength: 60, aerobic: 70, mobility: 40, power: 55, movement: 65, recovery: 58 }),
    addDays(NOW, 20),
  );
  bottleneck.push({
    day: 20,
    now: addDays(NOW, 20),
    nutrition: null,
    mobility: 40,
    previous: bState,
    next: dropped,
  });

  const regions = Object.entries(SHEETS).flatMap(([name, v]) =>
    classIds.map((classId) => {
      const stats = sheet(v);
      const lvl = characterLevel(stats);
      const ctx = { classId, level: lvl, stats, bottleneck: null, earned: [] as const };
      return { sheet: name, classId, level: lvl, statuses: allRegionStatuses(ctx) };
    }),
  );

  const xp = [0, 500, 1000, 1250, 4000].flatMap((journeyXp) =>
    [0, 1, 3].map((chapter) => ({
      journeyXp,
      chapter,
      target: chapterXpTarget(chapter),
      progress: xpProgress(journeyXp, chapter),
    })),
  );

  // --- the fixture user end to end ---------------------------------------------------------------
  const estimates = resolveAll(measurements, { now: NOW });
  const assembled = assembleCharacter({
    profile: PROFILE,
    measurements,
    norms: publishedNorms,
    classId: "hybrid",
    classChosenAt: NOW,
    now: NOW,
    mode: "game",
  });
  const { character } = assembled;
  const weekStart = startOfIsoWeek(NOW);
  const idFactory = (seed: string) => `q_${seed.slice(-16).replace(/[^a-z0-9]/gi, "_")}`;
  const quests = scheduleWeek({
    userId: USER,
    weekStart,
    homeRegion: character.homeRegion,
    unlocked: character.unlockedRegions,
    bottleneck: character.bottleneck,
    build: character.build,
    stats: character.stats,
    age: PROFILE.age,
    recentlyCompleted: [],
    carryOver: [],
    lastWeekAdherence: null,
    templates: QUEST_TEMPLATES,
    idFactory,
  });
  const predicates: Predicate[] = [
    { kind: "stat", stat: "aerobic", op: ">=", percentile: 50 },
    { kind: "stat", stat: "aerobic", op: ">=", percentile: 96 },
    { kind: "stat", stat: "mobility", op: ">=", percentile: 30 },
    { kind: "metric", metric: "vo2max", op: ">=", threshold: 45, unit: "ml/kg/min" },
    { kind: "metric", metric: "vo2max", op: ">=", threshold: 50, unit: "ml/kg/min" },
    { kind: "metric", metric: "resting_hr", op: "<=", threshold: 60, unit: "bpm" },
    { kind: "level", op: ">=", level: 20 },
    { kind: "level", op: ">=", level: 40 },
  ];
  const evidence = { estimates, stats: character.stats, level: character.level };
  const claims = predicates.map((predicate) => {
    const check = checkPredicate(predicate, evidence);
    if (!check.satisfied) return { predicate, check, unsigned: null, payload: null };
    const unsigned = buildUnsignedClaim(predicate, check, {
      subject: "subj_conformance",
      issuer: "minmax.conformance",
      now: NOW,
      idFactory: () => "claim_0001",
    });
    return { predicate, check, unsigned, payload: claimPayload(unsigned) };
  });

  const vocabulary = {
    statLine: STATS.flatMap((s) =>
      (["game", "simple"] as const).map((mode) => ({
        mode,
        stat: s,
        line: statLine(mode, character.stats[s]),
      })),
    ),
    levelLine: (["game", "simple"] as const).map((mode) => ({
      mode,
      line: levelLine(mode, character.level, null),
    })),
    xpLine: (["game", "simple"] as const).map((mode) => ({ mode, line: xpLine(mode, 8420, 12500) })),
  };

  // --- quest progress ------------------------------------------------------------------------------
  const questWindow = { startsAt: weekStart, endsAt: addDays(weekStart, 7) };
  const mkQuest = (templateId: string): Quest => ({
    id: `q_${templateId}`,
    templateId,
    userId: USER,
    ...questWindow,
    status: "active",
    progress: 0,
  });
  const day = (i: number, hour = 9) =>
    `${addDays(weekStart, i).slice(0, 10)}T${String(hour).padStart(2, "0")}:00:00.000Z`;
  const sessions: Session[] = [
    {
      id: "s1",
      userId: USER,
      type: "resistance",
      startedAt: day(0),
      minutes: 45,
      trustLevel: 1,
      source: "minmax_app",
    },
    {
      id: "s2",
      userId: USER,
      type: "resistance",
      startedAt: day(2),
      minutes: 15,
      trustLevel: 1,
      source: "minmax_app",
    },
    {
      id: "s3",
      userId: USER,
      type: "zone2",
      startedAt: day(3),
      minutes: 40,
      trustLevel: 2,
      source: "garmin",
    },
    {
      id: "s4",
      userId: USER,
      type: "resistance",
      startedAt: day(5),
      minutes: 30,
      trustLevel: 1,
      source: "minmax_app",
    },
  ];
  const stepDays = [4000, 11000, 12000, 9000, 10500];
  const stepMeasurements: Measurement[] = stepDays.map((v, i) => ({
    id: `steps_${i}`,
    userId: USER,
    metric: "steps_day",
    value: v,
    unit: "steps",
    measuredAt: day(i, 20),
    recordedAt: day(i, 20),
    source: "garmin",
    trustLevel: 2,
    confidence: 0.8,
    verification: "source_authenticated",
  }));
  const progressTemplates = [
    "forge.sessions.1",
    "wilds.steps.1",
    "wilds.steps.up",
    "engine.easy.1",
    "sanctum.rest.1",
    "garden.protein.1",
  ];
  const progress = progressTemplates.map((templateId) => {
    const template = templateById(templateId);
    if (!template) throw new Error(`unknown quest template ${templateId}`);
    const quest = mkQuest(templateId);
    return {
      templateId,
      criterion: template.criterion,
      windowDays: template.windowDays,
      quest,
      progress: evaluateProgress(template, quest, {
        measurements: stepMeasurements,
        sessions,
        checkIns: [],
        now: day(5, 23),
      }),
    };
  });

  return {
    schema: CONFORMANCE_SCHEMA,
    engineVersion: ENGINE_VERSION,
    publishedTablesVersion: PUBLISHED_TABLES_VERSION,
    questTemplatesVersion: QUEST_TEMPLATES_VERSION,
    now: NOW,
    util,
    norms: { tables, combinePercentiles: combine },
    character: { sheets, level, origin, build, weights, bottleneck, regions, xp },
    fixture: {
      profile: PROFILE,
      measurements,
      estimates: sortedEstimates(estimates),
      character,
      originPending: assembled.originPending,
      bottleneckState: assembled.bottleneckState,
      weekStart,
      questIdFactory: "q_ + last 16 chars of the seed with non-alphanumerics replaced by _",
      quests,
      hrvReadiness: hrvReadiness(measurements, NOW),
      claims,
      vocabulary,
    },
    progress: { sessions, measurements: stepMeasurements, now: day(5, 23), cases: progress },
  };
}
