import { describe, expect, it } from "vitest";
import { m, NOW, USER } from "../__fixtures__/measurements.js";
import { buildWeights } from "../character/class.js";
import type { Build } from "../types/character.js";
import type { StatId, StatValue } from "../types/stat.js";
import { STATS } from "../types/stat.js";
import { startOfIsoWeek } from "../util/time.js";
import { applyProgress, evaluateProgress } from "./progress.js";
import { ageAllows, autoSchedulable, closeWeek, pickDifficulty, scheduleWeek } from "./schedule.js";
import {
  CITATIONS,
  citationFor,
  QUEST_TEMPLATES,
  QUEST_TEMPLATES_VERSION,
  templateById,
} from "./templates.js";
import type { CheckIn, Quest, QuestTemplate, Session } from "./types.js";
import { SESSION_TYPES } from "./types.js";

const weekStart = startOfIsoWeek(NOW);
const ids = (seed: string) => `q_${seed.replace(/[^a-z0-9]/gi, "_").slice(0, 60)}`;

function point(stat: StatId, value: number): StatValue {
  return {
    stat,
    kind: "point",
    value,
    confidence: 0.8,
    trustLevel: 2,
    normStatus: "synthetic",
    basis: "population",
    contributions: [],
    computedAt: NOW,
    engineVersion: "test",
  };
}
function sheet(values: Partial<Record<StatId, number>>): Record<StatId, StatValue> {
  const out = {} as Record<StatId, StatValue>;
  for (const s of STATS) {
    const v = values[s];
    out[s] =
      v === undefined
        ? {
            stat: s,
            kind: "unmeasured",
            missing: [],
            contributions: [],
            computedAt: NOW,
            engineVersion: "test",
          }
        : point(s, v);
  }
  return out;
}
const build: Build = {
  name: "Anvil",
  classId: "muscle",
  originId: "ironblood",
  weights: buildWeights("muscle", {}),
  userNamed: false,
};

function baseCtx(over: Partial<Parameters<typeof scheduleWeek>[0]> = {}) {
  return {
    userId: USER,
    weekStart,
    homeRegion: "forge" as const,
    unlocked: ["wilds", "forge", "engine", "sanctum"] as const,
    bottleneck: "aerobic" as StatId,
    build,
    stats: sheet({ strength: 65, aerobic: 35, movement: 60, recovery: 55 }),
    age: 32,
    recentlyCompleted: [],
    carryOver: [],
    lastWeekAdherence: null,
    templates: QUEST_TEMPLATES,
    idFactory: ids,
    ...over,
  };
}

describe("templates", () => {
  it("every template carries an evidence tier, a resolvable citation and a verifiable criterion; none is restrictive", () => {
    expect(QUEST_TEMPLATES_VERSION).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
    for (const t of QUEST_TEMPLATES) {
      expect(["A", "B", "C", "D"]).toContain(t.evidence);
      expect(citationFor(t), t.id).toBeDefined();
      expect(t.tags).not.toContain("restrictive_nutrition");
      expect(t.windowDays).toBeGreaterThan(0);
      expect([1, 2, 3]).toContain(t.difficulty);
      if (t.minAge !== undefined && t.maxAge !== undefined) expect(t.minAge).toBeLessThanOrEqual(t.maxAge);
    }
    expect(new Set(QUEST_TEMPLATES.map((t) => t.id)).size).toBe(QUEST_TEMPLATES.length);
    // Every citation key is used by at least one template; no orphans.
    const used = new Set(QUEST_TEMPLATES.map((t) => t.citation));
    for (const key of Object.keys(CITATIONS)) expect(used.has(key), key).toBe(true);
  });

  it("covers every region with at least one tier-I quest and gives every region a test or import quest", () => {
    for (const region of [
      "wilds",
      "forge",
      "engine",
      "arena",
      "temple",
      "garden",
      "sanctum",
      "summit",
    ] as const) {
      const inRegion = QUEST_TEMPLATES.filter((t) => t.region === region);
      expect(
        inRegion.some((t) => t.difficulty === 1 && autoSchedulable(t)),
        region,
      ).toBe(true);
      expect(
        inRegion.some((t) => t.tags.includes("test") || t.tags.includes("import")),
        region,
      ).toBe(true);
    }
  });

  it("keeps opt-in and D-tier recommendations out of auto-scheduling, but lets D-tier tests through", () => {
    for (const t of QUEST_TEMPLATES) {
      if (t.tags.includes("opt_in")) expect(autoSchedulable(t), t.id).toBe(false);
      if (t.evidence === "D" && !t.tags.includes("test")) expect(autoSchedulable(t), t.id).toBe(false);
    }
    expect(autoSchedulable(templateById("arena.test.sprint") as QuestTemplate)).toBe(true);
    expect(autoSchedulable(templateById("garden.alcohol.1") as QuestTemplate)).toBe(false);
    expect(autoSchedulable(templateById("sanctum.rest.1") as QuestTemplate)).toBe(false);
  });

  it("follows the copy rules: no 'Zone 2', no 'to failure', no lifespan promises", () => {
    for (const t of QUEST_TEMPLATES) {
      const text = `${t.title} ${t.why}`;
      expect(text, t.id).not.toMatch(/zone 2|zone two/i);
      expect(text, t.id).not.toMatch(/\bto failure\b/i);
      expect(text, t.id).not.toMatch(/years? of life|live longer|add years/i);
      if (t.evidence === "C") expect(text, t.id).not.toMatch(/\bproven\b|\bproves\b/i);
    }
  });

  it("age gates", () => {
    const sts = templateById("forge.test.sts") as QuestTemplate;
    expect(ageAllows(sts, 45)).toBe(true);
    expect(ageAllows(sts, 32)).toBe(false);
    expect(ageAllows(sts, undefined)).toBe(false);
    const young = templateById("wilds.steps.2") as QuestTemplate;
    const older = templateById("wilds.steps.2.60plus") as QuestTemplate;
    expect(ageAllows(young, 59)).toBe(true);
    expect(ageAllows(young, 60)).toBe(false);
    expect(ageAllows(older, 60)).toBe(true);
    expect(ageAllows(templateById("forge.sessions.1") as QuestTemplate, undefined)).toBe(true);
  });
});

describe("scheduleWeek", () => {
  it("schedules three quests: one from the home region and one Rift quest for the bottleneck", () => {
    const qs = scheduleWeek(baseCtx());
    expect(qs).toHaveLength(3);
    const regions = qs.map((q) => templateById(q.templateId)?.region);
    expect(regions).toContain("forge");
    const stats = qs.map((q) => templateById(q.templateId)?.stat);
    expect(stats).toContain("aerobic");
  });

  it("never schedules two load quests for the same stat in one week", () => {
    const qs = scheduleWeek(baseCtx({ questsPerWeek: 6 }));
    const loadByStat = new Map<string, number>();
    for (const q of qs) {
      const t = templateById(q.templateId) as QuestTemplate;
      if (t.tags.includes("load")) loadByStat.set(t.stat, (loadByStat.get(t.stat) ?? 0) + 1);
    }
    for (const n of loadByStat.values()) expect(n).toBeLessThanOrEqual(1);
  });

  it("leaves a slot empty rather than schedule a second load quest for a stat", () => {
    const forgeLoad = QUEST_TEMPLATES.filter((t) => t.region === "forge" && t.tags.includes("load"));
    expect(forgeLoad.length).toBeGreaterThan(1);
    const qs = scheduleWeek(
      baseCtx({ unlocked: ["forge"], homeRegion: "forge", bottleneck: null, templates: forgeLoad }),
    );
    expect(qs).toHaveLength(1);
  });

  it("only uses unlocked regions", () => {
    const qs = scheduleWeek(baseCtx({ unlocked: ["wilds"], homeRegion: "wilds", bottleneck: null }));
    for (const q of qs) expect(templateById(q.templateId)?.region).toBe("wilds");
  });

  it("never assigns opt-in quests or quests gated to another age", () => {
    const all = scheduleWeek(
      baseCtx({
        unlocked: ["wilds", "forge", "engine", "arena", "temple", "garden", "sanctum", "summit"],
        questsPerWeek: 40,
      }),
    );
    for (const q of all) {
      const t = templateById(q.templateId) as QuestTemplate;
      expect(t.tags, t.id).not.toContain("opt_in");
      expect(ageAllows(t, 32), t.id).toBe(true);
    }
    expect(all.map((q) => q.templateId)).not.toContain("wilds.steps.2.60plus");
    const senior = scheduleWeek(
      baseCtx({ age: 66, unlocked: ["wilds"], homeRegion: "wilds", bottleneck: null, questsPerWeek: 40 }),
    );
    const ids = senior.map((q) => q.templateId);
    expect(ids).toContain("wilds.steps.2.60plus");
    expect(ids).not.toContain("wilds.steps.2");
    const { age: _known, ...withoutAge } = baseCtx({
      unlocked: ["forge"],
      bottleneck: null,
      questsPerWeek: 40,
    });
    const unknownAge = scheduleWeek(withoutAge);
    expect(unknownAge.map((q) => q.templateId)).not.toContain("forge.test.sts");
  });

  it("picks the Rift quest from the bottleneck's own region", () => {
    const qs = scheduleWeek(baseCtx({ bottleneck: "recovery" }));
    const rift = qs
      .map((q) => templateById(q.templateId) as QuestTemplate)
      .find((t) => t.stat === "recovery");
    expect(rift?.region).toBe("sanctum");
  });

  it("prefers test quests for unmeasured stats", () => {
    const qs = scheduleWeek(baseCtx({ stats: sheet({ aerobic: 35 }), bottleneck: null, questsPerWeek: 3 }));
    const t = qs.map((q) => templateById(q.templateId) as QuestTemplate);
    expect(t.some((x) => x.region === "forge" && x.tags.includes("test"))).toBe(true);
  });

  it("rolls an unfinished quest over exactly once", () => {
    const first = scheduleWeek(baseCtx());
    const { carryOver, adherence } = closeWeek(first); // nothing completed
    expect(adherence).toBe(0);
    expect(carryOver).toHaveLength(3);
    const second = scheduleWeek(baseCtx({ carryOver }));
    expect(second.every((q) => q.rolledOverFrom)).toBe(true);
    const { carryOver: again } = closeWeek(second);
    expect(again).toHaveLength(0); // rolled quests expire instead of rolling again
  });

  it("steps difficulty up after a perfect week and down after a poor one", () => {
    const stat = point("strength", 50);
    expect(pickDifficulty(stat, null)).toBe(1);
    expect(pickDifficulty(stat, 1)).toBe(2);
    expect(pickDifficulty(point("strength", 75), 0.3)).toBe(1);
  });
});

describe("evaluateProgress", () => {
  const forge = templateById("forge.sessions.1") as QuestTemplate;
  const quest: Quest = {
    id: "q1",
    templateId: forge.id,
    userId: USER,
    startsAt: weekStart,
    endsAt: new Date(Date.parse(weekStart) + 7 * 86_400_000).toISOString(),
    status: "active",
    progress: 0,
  };
  const session = (minutes: number, daysIn = 1): Session => ({
    id: `s_${minutes}_${daysIn}`,
    userId: USER,
    type: "resistance",
    startedAt: new Date(Date.parse(weekStart) + daysIn * 86_400_000).toISOString(),
    minutes,
    trustLevel: 2,
    source: "garmin",
  });

  it("counts qualifying sessions and ignores short ones", () => {
    expect(evaluateProgress(forge, quest, { measurements: [], sessions: [session(30)] })).toBe(0.5);
    expect(
      evaluateProgress(forge, quest, { measurements: [], sessions: [session(30), session(10, 2)] }),
    ).toBe(0.5);
    expect(
      evaluateProgress(forge, quest, { measurements: [], sessions: [session(30), session(25, 3)] }),
    ).toBe(1);
  });

  it("marks completion with a timestamp and never regresses a completed quest", () => {
    const done = applyProgress(quest, 1, NOW);
    expect(done.status).toBe("completed");
    expect(done.completedAt).toBe(NOW);
    expect(applyProgress(done, 0.2, NOW).status).toBe("completed");
  });

  it("daily_average needs enough reporting days to complete", () => {
    const steps = templateById("wilds.steps.1") as QuestTemplate;
    const q: Quest = { ...quest, templateId: steps.id };
    const inWeek = (d: number, v: number) => ({
      ...m("steps_day", v, { source: "garmin" }),
      measuredAt: new Date(Date.parse(weekStart) + d * 86_400_000 + 3_600_000).toISOString(),
    });
    // Two big days only → high ratio but low coverage → not complete.
    const partial = evaluateProgress(steps, q, {
      measurements: [inWeek(0, 12000), inWeek(1, 12000)],
      sessions: [],
    });
    expect(partial).toBeLessThan(1);
    const full = evaluateProgress(steps, q, {
      measurements: [0, 1, 2, 3, 4].map((d) => inWeek(d, 7500)),
      sessions: [],
    });
    expect(full).toBe(1);
  });

  it("days_meeting counts distinct days meeting the threshold", () => {
    const sleep = templateById("sanctum.sleep.1") as QuestTemplate;
    const q: Quest = { ...quest, templateId: sleep.id };
    const night = (d: number, h: number) => ({
      ...m("sleep_duration_h", h, { source: "oura" }),
      measuredAt: new Date(Date.parse(weekStart) + d * 86_400_000 + 3_600_000).toISOString(),
    });
    const p = evaluateProgress(sleep, q, {
      measurements: [night(0, 7.5), night(1, 6.2), night(2, 7.1), night(3, 8), night(4, 5.9)],
      sessions: [],
    });
    expect(p).toBeCloseTo(3 / 5, 6);
  });

  const at = (d: number, hours = 1) =>
    new Date(Date.parse(weekStart) + d * 86_400_000 + hours * 3_600_000).toISOString();

  it("self_report counts check-ins for this quest only, inside the window", () => {
    const warmup = templateById("temple.warmup.1") as QuestTemplate;
    const q: Quest = { ...quest, templateId: warmup.id };
    const checkIn = (id: string, questId: string, d: number): CheckIn => ({
      id,
      userId: USER,
      questId,
      at: at(d),
    });
    const checkIns = [
      checkIn("c1", q.id, 0),
      checkIn("c2", q.id, 2),
      checkIn("c3", "other", 3),
      checkIn("c4", q.id, 9),
    ];
    expect(evaluateProgress(warmup, q, { measurements: [], sessions: [], checkIns })).toBeCloseTo(2 / 3, 6);
    expect(evaluateProgress(warmup, q, { measurements: [], sessions: [] })).toBe(0);
  });

  it("improve_mean compares the window's daily mean with the baseline weeks before it", () => {
    const up = templateById("wilds.steps.up") as QuestTemplate;
    const q: Quest = { ...quest, templateId: up.id };
    const day = (d: number, v: number) => ({ ...m("steps_day", v, { source: "garmin" }), measuredAt: at(d) });
    const baseline = Array.from({ length: 28 }, (_, i) => day(-28 + i, 6000));
    const thisWeek = [0, 1, 2, 3, 4, 5].map((d) => day(d, 7100));
    expect(evaluateProgress(up, q, { measurements: [...baseline, ...thisWeek], sessions: [] })).toBe(1);
    // Half the gain → partial credit; no baseline → nothing to compare against.
    const half = [0, 1, 2, 3, 4, 5].map((d) => day(d, 6500));
    const p = evaluateProgress(up, q, { measurements: [...baseline, ...half], sessions: [] });
    expect(p).toBeGreaterThan(0.3);
    expect(p).toBeLessThan(1);
    expect(evaluateProgress(up, q, { measurements: thisWeek, sessions: [] })).toBe(0);
  });

  it("all_of completes only when every part does and reports the mean meanwhile", () => {
    const pyramid = templateById("engine.pyramid.1") as QuestTemplate;
    const q: Quest = { ...quest, templateId: pyramid.id };
    const s = (type: Session["type"], d: number, minutes = 40): Session => ({
      id: `s_${type}_${d}`,
      userId: USER,
      type,
      startedAt: at(d),
      minutes,
      trustLevel: 2,
      source: "garmin",
    });
    const easyOnly = [s("zone2", 0), s("zone2", 2)];
    expect(evaluateProgress(pyramid, q, { measurements: [], sessions: easyOnly })).toBeCloseTo(0.5, 6);
    expect(
      evaluateProgress(pyramid, q, { measurements: [], sessions: [...easyOnly, s("intervals", 4)] }),
    ).toBe(1);
    // Plyometric sessions are a real session type now (Arena).
    expect(SESSION_TYPES).toContain("plyometric");
    const plyo = templateById("arena.plyo.1") as QuestTemplate;
    expect(
      evaluateProgress(
        plyo,
        { ...q, templateId: plyo.id },
        { measurements: [], sessions: [s("plyometric", 1, 12)] },
      ),
    ).toBe(0.5);
  });

  it("rest_days counts only elapsed days without any session", () => {
    const rest = templateById("sanctum.rest.1") as QuestTemplate;
    const q: Quest = { ...quest, templateId: rest.id };
    const s = (d: number): Session => ({
      id: `s${d}`,
      userId: USER,
      type: "walk",
      startedAt: at(d, 9),
      minutes: 30,
      trustLevel: 2,
      source: "garmin",
    });
    // Evaluated on day 2 (two days elapsed) with sessions on both → no rest yet.
    expect(evaluateProgress(rest, q, { measurements: [], sessions: [s(0), s(1)], now: at(2, 0) })).toBe(0);
    // Day 3 elapsed and free → one rest day.
    expect(evaluateProgress(rest, q, { measurements: [], sessions: [s(0), s(1)], now: at(3, 0) })).toBe(1);
    // Without `now` the whole window counts (end-of-week evaluation).
    expect(evaluateProgress(rest, q, { measurements: [], sessions: [0, 1, 2, 3, 4, 5, 6].map(s) })).toBe(0);
  });

  it("device-verified tests ignore self-reported values when minTrust is set", () => {
    const vo2 = templateById("engine.test.vo2") as QuestTemplate;
    const q: Quest = { ...quest, templateId: vo2.id };
    const selfReported = {
      ...m("vo2max", 45, { source: "self" }),
      measuredAt: at(1),
      trustLevel: 0 as const,
    };
    const device = { ...m("vo2max", 45, { source: "garmin" }), measuredAt: at(1), trustLevel: 2 as const };
    expect(evaluateProgress(vo2, q, { measurements: [selfReported], sessions: [] })).toBe(0);
    expect(evaluateProgress(vo2, q, { measurements: [device], sessions: [] })).toBe(1);
  });
});
