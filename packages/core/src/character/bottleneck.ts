import type { StatId, StatValue } from "../types/stat.js";
import { isMeasured, STATS, statMidpoint } from "../types/stat.js";
import { daysBetween } from "../util/time.js";

/** The bottleneck switches only when a challenger has been lower by at least this many points... */
export const BOTTLENECK_SWITCH_MARGIN = 5;
/** ...for at least this many consecutive days. */
export const BOTTLENECK_SWITCH_DAYS = 14;

export interface BottleneckState {
  readonly current: StatId | null;
  /** The challenger currently undercutting the bottleneck, and since when. */
  readonly challenger: { readonly stat: StatId; readonly since: string } | null;
  readonly updatedAt: string;
}

export const INITIAL_BOTTLENECK: BottleneckState = {
  current: null,
  challenger: null,
  updatedAt: "1970-01-01T00:00:00.000Z",
};

function lowestMeasured(stats: Readonly<Record<StatId, StatValue>>): { stat: StatId; value: number } | null {
  let best: { stat: StatId; value: number } | null = null;
  for (const s of STATS) {
    const v = stats[s];
    if (!isMeasured(v)) continue;
    const mid = statMidpoint(v) as number;
    if (!best || mid < best.value) best = { stat: s, value: mid };
  }
  return best;
}

/**
 * Daily update. Pure: feed the previous state and today's stats, get the new state.
 * Rules (docs/02-game-system.md "Bottleneck"):
 * - No bottleneck yet → the lowest measured stat becomes it immediately.
 * - The current bottleneck stays unless another measured stat is lower by ≥ margin for ≥ N consecutive days.
 * - If the current bottleneck becomes unmeasured, the lowest measured stat takes over immediately.
 */
export function updateBottleneck(
  prev: BottleneckState,
  stats: Readonly<Record<StatId, StatValue>>,
  now: string,
): BottleneckState {
  const lowest = lowestMeasured(stats);
  if (!lowest) return { current: null, challenger: null, updatedAt: now };

  if (prev.current === null || !isMeasured(stats[prev.current])) {
    return { current: lowest.stat, challenger: null, updatedAt: now };
  }

  const currentValue = statMidpoint(stats[prev.current]) as number;
  if (lowest.stat === prev.current || currentValue - lowest.value < BOTTLENECK_SWITCH_MARGIN) {
    // No qualified challenger today; reset any pending challenge.
    return { current: prev.current, challenger: null, updatedAt: now };
  }

  // A qualified challenger exists.
  if (prev.challenger && prev.challenger.stat === lowest.stat) {
    // Inclusive count of daily observations: a challenge that began on day 1 has been observed
    // on BOTTLENECK_SWITCH_DAYS days when daysBetween reaches BOTTLENECK_SWITCH_DAYS - 1.
    const observedDays = daysBetween(prev.challenger.since, now) + 1;
    if (observedDays >= BOTTLENECK_SWITCH_DAYS) {
      return { current: lowest.stat, challenger: null, updatedAt: now };
    }
    return { current: prev.current, challenger: prev.challenger, updatedAt: now };
  }
  return { current: prev.current, challenger: { stat: lowest.stat, since: now }, updatedAt: now };
}
