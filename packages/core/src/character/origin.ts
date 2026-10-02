import type { Origin, OriginId } from "../types/character.js";
import { ORIGIN_FOR_STAT } from "../types/character.js";
import type { StatId, StatValue } from "../types/stat.js";
import { isMeasured, STATS, statMidpoint } from "../types/stat.js";
import { mean } from "../util/math.js";

/** Minimum measured stats before an origin can be derived. */
export const ORIGIN_MIN_MEASURED = 4;
/** Minimum stat confidence that counts toward the origin derivation. */
export const ORIGIN_MIN_CONFIDENCE = 0.5;
/** Max deviation from the user's own mean below which the profile is flat → Evenkin. */
export const ORIGIN_FLAT_THRESHOLD = 8;
/** A second stat within this many points of the dominant deviation becomes the secondary tag. */
export const ORIGIN_SECONDARY_GAP = 3;

export type OriginDerivation =
  | { readonly ok: true; readonly origin: Origin }
  | {
      readonly ok: false;
      readonly reason: "insufficient_data";
      readonly measured: number;
      readonly needed: number;
      readonly missing: readonly StatId[];
    };

/**
 * Origin is the SHAPE of the profile, not its height: deviations from the user's own mean decide.
 * A person whose stats are all low but whose strength stands out is Ironblood, like an elite lifter
 * with the same shape. Level carries the magnitude. See docs/02-game-system.md.
 */
export function deriveOrigin(stats: Readonly<Record<StatId, StatValue>>, now: string): OriginDerivation {
  const usable: { stat: StatId; value: number }[] = [];
  const missing: StatId[] = [];
  for (const s of STATS) {
    const v = stats[s];
    if (isMeasured(v) && v.confidence >= ORIGIN_MIN_CONFIDENCE) {
      usable.push({ stat: s, value: statMidpoint(v) as number });
    } else {
      missing.push(s);
    }
  }
  if (usable.length < ORIGIN_MIN_MEASURED) {
    return {
      ok: false,
      reason: "insufficient_data",
      measured: usable.length,
      needed: ORIGIN_MIN_MEASURED,
      missing,
    };
  }

  const mu = mean(usable.map((u) => u.value));
  const deviations = usable.map((u) => ({ stat: u.stat, dev: u.value - mu })).sort((a, b) => b.dev - a.dev);
  const top = deviations[0] as { stat: StatId; dev: number };
  const snapshot: Partial<Record<StatId, number>> = {};
  for (const u of usable) snapshot[u.stat] = Math.round(u.value);

  if (top.dev < ORIGIN_FLAT_THRESHOLD) {
    return {
      ok: true,
      origin: { id: "evenkin", dominant: null, secondary: null, derivedAt: now, snapshot },
    };
  }
  const second = deviations[1];
  const secondary =
    second && second.dev >= ORIGIN_FLAT_THRESHOLD && top.dev - second.dev <= ORIGIN_SECONDARY_GAP
      ? second.stat
      : null;
  const id: OriginId = ORIGIN_FOR_STAT[top.stat];
  return { ok: true, origin: { id, dominant: top.stat, secondary, derivedAt: now, snapshot } };
}

export const ORIGIN_COPY: Readonly<Record<OriginId, { readonly name: string; readonly line: string }>> = {
  ironblood: { name: "Ironblood", line: "Built on force. The engine comes later." },
  engineborn: { name: "Engineborn", line: "A heart that does not quit." },
  riverborn: { name: "Riverborn", line: "Moves like water. Needs iron." },
  stormborn: { name: "Stormborn", line: "Explosive. Learns endurance." },
  wayfarer: { name: "Wayfarer", line: "Never still. Learns to push." },
  stillwater: { name: "Stillwater", line: "Rests well. Learns to strain." },
  rootborn: { name: "Rootborn", line: "Fuels well. Learns to spend it." },
  evenkin: { name: "Evenkin", line: "Nothing dominates. Everything can." },
};
