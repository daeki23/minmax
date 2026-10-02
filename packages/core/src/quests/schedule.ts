import type { Build, RegionId } from "../types/character.js";
import type { StatId, StatValue } from "../types/stat.js";
import { isMeasured, statMidpoint } from "../types/stat.js";
import { addDays } from "../util/time.js";
import type { Difficulty, Quest, QuestTemplate } from "./types.js";

export interface ScheduleContext {
  readonly userId: string;
  readonly weekStart: string; // ISO, Monday 00:00 UTC
  readonly homeRegion: RegionId;
  readonly unlocked: readonly RegionId[];
  readonly bottleneck: StatId | null;
  readonly build: Build;
  readonly stats: Readonly<Record<StatId, StatValue>>;
  /** Templates completed in the last N weeks, to avoid repeats and to step difficulty. */
  readonly recentlyCompleted: readonly string[];
  /** Active quests from last week that were not completed and have not rolled over yet. */
  readonly carryOver: readonly Quest[];
  /** Fraction of last week's quests completed, 0..1; drives difficulty. Null for the first week. */
  readonly lastWeekAdherence: number | null;
  readonly templates: readonly QuestTemplate[];
  readonly idFactory: (seed: string) => string;
  readonly questsPerWeek?: number; // default 3
}

/** Difficulty step: start at I; go up after a fully completed week; drop after a week under 50 %. */
export function pickDifficulty(stat: StatValue, lastWeekAdherence: number | null): Difficulty {
  const mid = isMeasured(stat) ? (statMidpoint(stat) as number) : 30;
  let d: Difficulty = mid >= 70 ? 2 : 1;
  if (lastWeekAdherence !== null) {
    if (lastWeekAdherence >= 0.99) d = Math.min(3, d + 1) as Difficulty;
    else if (lastWeekAdherence < 0.5) d = Math.max(1, d - 1) as Difficulty;
  }
  return d;
}

/**
 * Weekly quest selection. Rules (docs/02-game-system.md "Quests"):
 * - Default 3 quests. Unfinished quests roll over once, then are replaced.
 * - At least one quest from the home region; one Rift quest from the bottleneck's region if different and unlocked.
 * - Never two "load" quests from the same stat in a week; nothing tagged restrictive_nutrition is ever auto-scheduled.
 * - Prefer templates not completed recently; prefer "test"/"import" quests for unmeasured stats so the sheet fills in.
 */
export function scheduleWeek(ctx: ScheduleContext): Quest[] {
  const per = ctx.questsPerWeek ?? 3;
  const endsAt = addDays(ctx.weekStart, 7);
  const out: Quest[] = [];
  const usedTemplates = new Set<string>();
  const loadStats = new Set<StatId>();

  // 1. Roll-overs (once).
  for (const q of ctx.carryOver) {
    if (out.length >= per) break;
    if (q.rolledOverFrom) continue; // already rolled once → replaced
    const t = ctx.templates.find((x) => x.id === q.templateId);
    if (!t) continue;
    out.push({
      id: ctx.idFactory(`${ctx.userId}|${ctx.weekStart}|${t.id}|ro`),
      templateId: t.id,
      userId: ctx.userId,
      startsAt: ctx.weekStart,
      endsAt,
      status: "active",
      rolledOverFrom: q.id,
      progress: 0,
    });
    usedTemplates.add(t.id);
    if (t.tags.includes("load")) loadStats.add(t.stat);
  }

  const eligible = ctx.templates.filter(
    (t) =>
      ctx.unlocked.includes(t.region) &&
      !t.tags.includes("restrictive_nutrition") &&
      !usedTemplates.has(t.id),
  );

  // Hard rules, never just a score penalty: no template twice, and one load quest per stat per week.
  const allowed = (t: QuestTemplate): boolean =>
    !usedTemplates.has(t.id) && !(t.tags.includes("load") && loadStats.has(t.stat));

  const pick = (candidates: readonly QuestTemplate[]): QuestTemplate | null => {
    const pool = candidates.filter(allowed);
    const fresh = pool.filter((t) => !ctx.recentlyCompleted.includes(t.id));
    const ranked = [...(fresh.length ? fresh : pool)].sort((a, b) => score(b) - score(a));
    return ranked[0] ?? null;
  };

  const score = (t: QuestTemplate): number => {
    const stat = ctx.stats[t.stat];
    const wantDifficulty = pickDifficulty(stat, ctx.lastWeekAdherence);
    let s = 0;
    s += ctx.build.weights[t.stat] * 10; // class/build focus
    s -= Math.abs(t.difficulty - wantDifficulty) * 3; // right difficulty
    if (!isMeasured(stat) && (t.tags.includes("test") || t.tags.includes("import"))) s += 6; // fill the sheet
    if (isMeasured(stat) && t.tags.includes("test")) s -= 2; // don't re-test measured stats too eagerly
    if (ctx.bottleneck === t.stat) s += 2;
    return s;
  };

  const add = (t: QuestTemplate | null) => {
    if (!t || out.length >= per) return;
    out.push({
      id: ctx.idFactory(`${ctx.userId}|${ctx.weekStart}|${t.id}`),
      templateId: t.id,
      userId: ctx.userId,
      startsAt: ctx.weekStart,
      endsAt,
      status: "active",
      progress: 0,
    });
    usedTemplates.add(t.id);
    if (t.tags.includes("load")) loadStats.add(t.stat);
  };

  // 2. One from the home region.
  if (!out.some((q) => ctx.templates.find((t) => t.id === q.templateId)?.region === ctx.homeRegion)) {
    add(pick(eligible.filter((t) => t.region === ctx.homeRegion)));
  }
  // 3. One Rift quest from the bottleneck's region if different.
  if (ctx.bottleneck) {
    const riftRegion = eligible.find((t) => t.stat === ctx.bottleneck)?.region;
    if (
      riftRegion &&
      riftRegion !== ctx.homeRegion &&
      !out.some((q) => ctx.templates.find((t) => t.id === q.templateId)?.stat === ctx.bottleneck)
    ) {
      add(pick(eligible.filter((t) => t.stat === ctx.bottleneck)));
    }
  }
  // 4. Fill by score.
  while (out.length < per) {
    const next = pick(eligible);
    if (!next) break;
    add(next);
  }
  return out;
}

/** Close a week: completed stay completed; active ones become rolled_over (if first time) or expired. */
export function closeWeek(quests: readonly Quest[]): {
  readonly closed: Quest[];
  readonly carryOver: Quest[];
  readonly adherence: number;
} {
  const closed: Quest[] = [];
  const carryOver: Quest[] = [];
  let completed = 0;
  for (const q of quests) {
    if (q.status === "completed") {
      completed++;
      closed.push(q);
      continue;
    }
    if (q.status !== "active") {
      closed.push(q);
      continue;
    }
    if (q.rolledOverFrom) closed.push({ ...q, status: "expired" });
    else {
      const ro: Quest = { ...q, status: "rolled_over" };
      closed.push(ro);
      carryOver.push(ro);
    }
  }
  return { closed, carryOver, adherence: quests.length === 0 ? 0 : completed / quests.length };
}
