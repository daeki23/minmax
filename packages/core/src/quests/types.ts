import type { RegionId } from "../types/character.js";
import type { TrustLevel } from "../types/measurement.js";
import type { Metric } from "../types/metric.js";
import type { StatId } from "../types/stat.js";

/**
 * Evidence tiers. Displayed on every quest. See docs/04-evidence-framework.md (pending research).
 * A = major guideline consensus · B = RCT/meta-analysis in a relevant population ·
 * C = consistent observational / plausible · D = mechanistic, small or experimental.
 * X exists only to name things MINMAX will never recommend; no quest may carry it.
 */
export type EvidenceTier = "A" | "B" | "C" | "D";

export type Difficulty = 1 | 2 | 3;

/**
 * Completion criteria are evaluated against measurements, sessions and check-ins in the quest window.
 * Each is verifiable by data; only `self_report` completes by the user saying so, and it carries the
 * lowest trust (hosts cap its XP accordingly).
 */
export type Criterion =
  | {
      /** N sessions of a kind with a minimum duration, e.g. 2 resistance sessions ≥ 20 min. */
      readonly kind: "sessions";
      readonly sessionType: SessionType;
      readonly count: number;
      readonly minMinutes: number;
    }
  | {
      /** Mean of a daily metric over the window ≥ target (or ≤ for lower-is-better). */
      readonly kind: "daily_average";
      readonly metric: Metric;
      readonly op: ">=" | "<=";
      readonly target: number;
    }
  | {
      /** At least N days in the window where the metric met the threshold. */
      readonly kind: "days_meeting";
      readonly metric: Metric;
      readonly op: ">=" | "<=";
      readonly threshold: number;
      readonly days: number;
    }
  | {
      /** A measurement of this metric exists in the window (take a test, import a source). */
      readonly kind: "measurement_exists";
      readonly metric: Metric;
      readonly minTrust?: TrustLevel;
    }
  | {
      /** A metric improved by at least delta vs. the best value before the window. */
      readonly kind: "improve";
      readonly metric: Metric;
      readonly delta: number;
    }
  | {
      /**
       * The window's daily mean improved by at least delta vs. the daily mean of the `baselineDays`
       * before the window (e.g. +1,000 steps a day vs. the last four weeks).
       */
      readonly kind: "improve_mean";
      readonly metric: Metric;
      readonly delta: number;
      readonly baselineDays: number;
    }
  | {
      /** The user confirmed the behaviour N times (check-ins). Trust 0 by definition. */
      readonly kind: "self_report";
      readonly count: number;
    }
  | {
      /** At least N calendar days in the window (already elapsed) with no session of any kind. */
      readonly kind: "rest_days";
      readonly days: number;
    }
  | {
      /** Every part must be met; progress is the mean of the parts and completes only when all do. */
      readonly kind: "all_of";
      readonly parts: readonly Criterion[];
    };

export const SESSION_TYPES = [
  "resistance",
  "zone2",
  "intervals",
  "sprint",
  "plyometric",
  "mobility",
  "walk",
  "balance",
  "sauna",
] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

/** A recorded session; hosts map device workouts and in-app logs onto this. */
export interface Session {
  readonly id: string;
  readonly userId: string;
  readonly type: SessionType;
  readonly startedAt: string;
  readonly minutes: number;
  readonly trustLevel: TrustLevel;
  readonly source: string;
}

/** A self-report check-in against one quest ("I did the warm-up today"). Always trust 0. */
export interface CheckIn {
  readonly id: string;
  readonly userId: string;
  readonly questId: string;
  readonly at: string;
  readonly note?: string;
}

export const QUEST_TAGS = [
  /** Prescribes training load; the scheduler allows one per stat per week. */
  "load",
  "additive_nutrition",
  /** Deficits and restriction. Never auto-scheduled; only behind an explicit goal with safeguards. */
  "restrictive_nutrition",
  /** Take a test or measurement; preferred for unmeasured stats. */
  "test",
  /** Connect or import a data source. */
  "import",
  "recovery",
  /** Alcohol, supplements, sauna, heavy bone loading: the user picks these; never assigned by default. */
  "opt_in",
] as const;
export type QuestTag = (typeof QUEST_TAGS)[number];

export interface QuestTemplate {
  readonly id: string;
  readonly region: RegionId;
  /** Primary stat; hybrid (Summit) quests name the stat they load most. */
  readonly stat: StatId;
  readonly difficulty: Difficulty;
  readonly evidence: EvidenceTier;
  /** Plain-language title, used in Simple Mode. */
  readonly title: string;
  /** Region-flavoured title, used in Game Mode. */
  readonly gameTitle: string;
  readonly why: string;
  readonly criterion: Criterion;
  /** Window length in days; 7 for weekly quests. */
  readonly windowDays: number;
  /** Citation key; resolved through CITATIONS in templates.ts to docs/research sources. */
  readonly citation: string;
  /** Safety rails: tags the scheduler respects (e.g. no two "load" quests in one week). */
  readonly tags: readonly QuestTag[];
  /** Age gates (inclusive). A template with a gate is never scheduled when the age is unknown. */
  readonly minAge?: number;
  readonly maxAge?: number;
}

export type QuestStatus = "active" | "completed" | "rolled_over" | "expired";

export interface Quest {
  readonly id: string;
  readonly templateId: string;
  readonly userId: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly status: QuestStatus;
  readonly rolledOverFrom?: string;
  readonly progress: number; // 0..1
  readonly completedAt?: string;
}
