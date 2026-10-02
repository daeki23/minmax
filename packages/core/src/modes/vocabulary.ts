import type { QuestTemplate } from "../quests/types.js";
import type { RegionId, UiMode } from "../types/character.js";
import { REGION_LABEL } from "../types/character.js";
import type { StatId, StatValue } from "../types/stat.js";
import { STAT_LABEL } from "../types/stat.js";

/**
 * One state machine, two renderers. These helpers produce the strings; the UI only chooses the mode.
 * See docs/02-game-system.md "Modes".
 */

/**
 * Simple Mode may only say "percentile" when every input ranked against a sampled population.
 * Criterion scores (guideline bands, dose-response curves) and mixed stats say "score" instead,
 * because "72nd percentile" would be a false claim about other people (research/normative-data.md).
 */
export function statLine(mode: UiMode, s: StatValue): string {
  const name = STAT_LABEL[s.stat];
  switch (s.kind) {
    case "point":
      if (mode === "game") return `${name} ${s.value}`;
      return s.basis === "population"
        ? `${name}: ${ordinal(s.value)} percentile for your age`
        : `${name}: score ${s.value} of 100 against health guidelines`;
    case "range":
      if (mode === "game") return `${name} ${s.low}–${s.high}`;
      return s.basis === "population"
        ? `${name}: roughly the ${ordinal(s.low)} to ${ordinal(s.high)} percentile`
        : `${name}: score roughly ${s.low} to ${s.high} of 100 against health guidelines`;
    case "unmeasured":
      return mode === "game" ? `${name} —` : `${name}: not measured yet`;
  }
}

export function questTitle(mode: UiMode, t: QuestTemplate): string {
  return mode === "game" ? t.gameTitle : t.title;
}

export function bottleneckLine(mode: UiMode, stat: StatId | null): string {
  if (!stat)
    return mode === "game"
      ? "No bottleneck yet. Measure more to reveal it."
      : "Measure a few more areas to see what to focus on.";
  return mode === "game"
    ? `${STAT_LABEL[stat]} is holding your build back.`
    : `Your weakest area right now: ${STAT_LABEL[stat].toLowerCase()}.`;
}

export function regionLine(mode: UiMode, region: RegionId, focusStat: StatId | null): string {
  if (mode === "game") return `You have entered ${REGION_LABEL[region]}.`;
  return focusStat
    ? `Focus this month: ${STAT_LABEL[focusStat].toLowerCase()}.`
    : `Focus this month: ${REGION_LABEL[region]}.`;
}

export function levelLine(mode: UiMode, level: number, previous: number | null): string {
  if (mode === "game")
    return previous !== null && level > previous ? `LEVEL ${level} — level up` : `LEVEL ${level}`;
  if (previous !== null && level > previous) return "Your overall fitness moved up a step.";
  if (previous !== null && level < previous)
    return "Your overall fitness slipped a step. That happens; the plan adapts.";
  return `Overall level ${level} of 50`;
}

export function xpLine(mode: UiMode, current: number, target: number): string {
  if (mode === "game") return `XP ${current.toLocaleString("en-US")} / ${target.toLocaleString("en-US")}`;
  return `${Math.round((100 * current) / Math.max(target, 1))} % of this chapter's plan done`;
}

export function ordinal(n: number): string {
  const v = Math.round(n);
  const s = ["th", "st", "nd", "rd"] as const;
  const mod100 = v % 100;
  const suffix = s[(mod100 - 20) % 10] ?? s[mod100] ?? s[0];
  return `${v}${suffix}`;
}
