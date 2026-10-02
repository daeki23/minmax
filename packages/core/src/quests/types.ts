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
 * Completion criteria are evaluated against measurements in the quest window.
 * Each is verifiable by data; a quest never completes by tapping "done" alone unless it is a self-report quest.
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
    };

export const SESSION_TYPES = [
  "resistance",
  "zone2",
  "intervals",
  "sprint",
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

export interface QuestTemplate {
  readonly id: string;
  readonly region: RegionId;
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
  /** Citation key into docs/research/training-science.md. */
  readonly citation: string;
  /** Safety rails: tags the scheduler respects (e.g. no two "load" quests in one week). */
  readonly tags: readonly (
    | "load"
    | "additive_nutrition"
    | "restrictive_nutrition"
    | "test"
    | "import"
    | "recovery"
  )[];
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
