import { resolveAll } from "../provenance/resolve.js";
import { computeAllStats } from "../stats/compute.js";
import type { NormRegistry } from "../stats/norms.js";
import type { Character, ClassId, Origin, RegionId, UiMode } from "../types/character.js";
import type { Measurement, UserProfile } from "../types/measurement.js";
import type { StatId } from "../types/stat.js";
import { STATS, statMidpoint } from "../types/stat.js";
import { type BottleneckState, INITIAL_BOTTLENECK, updateBottleneck } from "./bottleneck.js";
import { proposeBuild } from "./class.js";
import { characterLevel } from "./level.js";
import { deriveOrigin } from "./origin.js";
import { homeRegion, unlockedRegions } from "./regions.js";

export interface AssembleInput {
  readonly profile: UserProfile;
  readonly measurements: readonly Measurement[];
  readonly norms: NormRegistry;
  readonly classId: ClassId;
  readonly classChosenAt: string;
  readonly now: string;
  readonly mode: UiMode;
  /** Persisted state from the previous assembly; omit on first run. */
  readonly previous?: {
    readonly origin: Origin | null;
    readonly bottleneck: BottleneckState;
    readonly journeyXp: number;
    readonly journey: number;
    readonly earnedRegions: readonly RegionId[];
    readonly buildName?: { readonly name: string; readonly userNamed: boolean };
  };
}

export interface AssembleOutput {
  readonly character: Character;
  readonly bottleneckState: BottleneckState;
  /** Why Origin is still unknown, if it is. */
  readonly originPending: {
    readonly measured: number;
    readonly needed: number;
    readonly missing: readonly StatId[];
  } | null;
}

/**
 * The daily recomputation and the onboarding "Analyzing your character..." step are the same function.
 * Measurements → estimates → stats → origin (once) → level → bottleneck (with hysteresis) → regions → build.
 */
export function assembleCharacter(input: AssembleInput): AssembleOutput {
  const estimates = resolveAll(input.measurements, { now: input.now });
  const stats = computeAllStats({ profile: input.profile, norms: input.norms, estimates, now: input.now });

  // Origin is derived once and then kept; only a New Journey re-derives it.
  let origin = input.previous?.origin ?? null;
  let originPending: AssembleOutput["originPending"] = null;
  if (!origin) {
    const d = deriveOrigin(stats, input.now);
    if (d.ok) origin = d.origin;
    else originPending = { measured: d.measured, needed: d.needed, missing: d.missing };
  }

  const level = characterLevel(stats);
  const bottleneckState = updateBottleneck(
    input.previous?.bottleneck ?? INITIAL_BOTTLENECK,
    stats,
    input.now,
  );
  const regionCtx = {
    classId: input.classId,
    level,
    stats,
    bottleneck: bottleneckState.current,
    earned: input.previous?.earnedRegions ?? [],
  };
  const mids: Partial<Record<StatId, number>> = {};
  for (const s of STATS) {
    const v = statMidpoint(stats[s]);
    if (v !== null) mids[s] = v;
  }
  const proposed = proposeBuild(input.classId, origin?.id ?? "evenkin", mids);
  const build =
    input.previous?.buildName?.userNamed === true
      ? { ...proposed, name: input.previous.buildName.name, userNamed: true }
      : proposed;

  const character: Character = {
    userId: input.profile.userId,
    origin,
    classId: input.classId,
    classChosenAt: input.classChosenAt,
    build,
    stats,
    level,
    journeyXp: input.previous?.journeyXp ?? 0,
    journey: input.previous?.journey ?? 1,
    bottleneck: bottleneckState.current,
    homeRegion: homeRegion(regionCtx),
    unlockedRegions: unlockedRegions(regionCtx),
    mode: input.mode,
  };
  return { character, bottleneckState, originPending };
}
