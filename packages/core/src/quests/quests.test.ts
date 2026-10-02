import { describe, expect, it } from "vitest";
import { m, NOW, USER } from "../__fixtures__/measurements.js";
import { buildWeights } from "../character/class.js";
import type { Build } from "../types/character.js";
import type { StatId, StatValue } from "../types/stat.js";
import { STATS } from "../types/stat.js";
import { startOfIsoWeek } from "../util/time.js";
import { applyProgress, evaluateProgress } from "./progress.js";
import { closeWeek, pickDifficulty, scheduleWeek } from "./schedule.js";
import { QUEST_TEMPLATES, templateById } from "./templates.js";
import type { Quest, QuestTemplate, Session } from "./types.js";

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
    contributions: [],
    computedAt: NOW,
  };
}
function sheet(values: Partial<Record<StatId, number>>): Record<StatId, StatValue> {
  const out = {} as Record<StatId, StatValue>;
  for (const s of STATS) {
    const v = values[s];
    out[s] =
      v === undefined
        ? { stat: s, kind: "unmeasured", missing: [], contributions: [], computedAt: NOW }
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
    recentlyCompleted: [],
    carryOver: [],
    lastWeekAdherence: null,
    templates: QUEST_TEMPLATES,
    idFactory: ids,
    ...over,
  };
}

describe("templates", () => {
  it("every template carries an evidence tier, a citation and a verifiable criterion; none is restrictive", () => {
    for (const t of QUEST_TEMPLATES) {
      expect(["A", "B", "C", "D"]).toContain(t.evidence);
      expect(t.citation.length).toBeGreaterThan(3);
      expect(t.tags).not.toContain("restrictive_nutrition");
      expect(t.windowDays).toBeGreaterThan(0);
    }
    expect(new Set(QUEST_TEMPLATES.map((t) => t.id)).size).toBe(QUEST_TEMPLATES.length);
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
});
