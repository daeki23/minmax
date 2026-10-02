import type { Build, ClassId, OriginId, RegionId } from "../types/character.js";
import type { StatId } from "../types/stat.js";
import { STATS } from "../types/stat.js";

/** The six plain-language onboarding answers, mapped to classes. The user never sees the class id first. */
export const ONBOARDING_ANSWERS = [
  { id: "stronger", label: "Get stronger", classId: "muscle" },
  { id: "endurance", label: "Build endurance", classId: "aerobic" },
  { id: "move_better", label: "Move better", classId: "mobility" },
  { id: "fuel_better", label: "Eat and fuel better", classId: "nutrition" },
  { id: "all_rounder", label: "Become an all-rounder", classId: "hybrid" },
  { id: "optimise", label: "Optimise everything", classId: "all" },
] as const satisfies readonly { id: string; label: string; classId: ClassId }[];

export type OnboardingAnswerId = (typeof ONBOARDING_ANSWERS)[number]["id"];

export function classForAnswer(answer: OnboardingAnswerId): ClassId {
  const found = ONBOARDING_ANSWERS.find((a) => a.id === answer);
  if (!found) throw new Error(`Unknown onboarding answer: ${answer}`);
  return found.classId;
}

export interface ClassSpec {
  readonly id: ClassId;
  readonly name: string;
  readonly primary: readonly StatId[];
  readonly homeRegion: RegionId;
  /** Summit is gated by level and stats; "all" starts in the Wilds until the gate opens. */
  readonly fallbackRegion?: RegionId;
}

export const CLASS_SPECS: Readonly<Record<ClassId, ClassSpec>> = {
  muscle: { id: "muscle", name: "Muscle", primary: ["strength", "power"], homeRegion: "forge" },
  aerobic: { id: "aerobic", name: "Aerobic", primary: ["aerobic", "movement"], homeRegion: "engine" },
  mobility: { id: "mobility", name: "Mobility", primary: ["mobility", "recovery"], homeRegion: "temple" },
  nutrition: { id: "nutrition", name: "Nutrition", primary: ["nutrition", "recovery"], homeRegion: "garden" },
  hybrid: { id: "hybrid", name: "Hybrid", primary: [...STATS], homeRegion: "wilds" },
  all: { id: "all", name: "All", primary: [...STATS], homeRegion: "summit", fallbackRegion: "wilds" },
};

/** Changing class is a decision, not a toggle: 14-day cooldown. */
export const CLASS_CHANGE_COOLDOWN_DAYS = 14;

/**
 * Stat weights for quest selection, by class and (for hybrid) by current stats so the two lowest get more.
 * Sums to 1.
 */
export function buildWeights(
  classId: ClassId,
  statMidpoints: Readonly<Partial<Record<StatId, number>>>,
): Record<StatId, number> {
  const w = {} as Record<StatId, number>;
  for (const s of STATS) w[s] = 0;
  const spec = CLASS_SPECS[classId];

  if (classId === "all") {
    for (const s of STATS) w[s] = 1 / STATS.length;
    return w;
  }
  if (classId === "hybrid") {
    // Base equal share, then double weight on the two lowest measured stats.
    for (const s of STATS) w[s] = 1;
    const measured = STATS.filter((s) => statMidpoints[s] !== undefined).sort(
      (a, b) => (statMidpoints[a] as number) - (statMidpoints[b] as number),
    );
    for (const s of measured.slice(0, 2)) w[s] = 2;
    return normalise(w);
  }
  // Specialist classes: 70 % on primaries, 30 % spread over the rest so nothing is ignored.
  const rest = STATS.filter((s) => !spec.primary.includes(s));
  for (const s of spec.primary) w[s] = 0.7 / spec.primary.length;
  for (const s of rest) w[s] = 0.3 / rest.length;
  return w;
}

function normalise(w: Record<StatId, number>): Record<StatId, number> {
  const total = STATS.reduce((s, k) => s + w[k], 0);
  for (const s of STATS) w[s] = w[s] / total;
  return w;
}

/** Working build names; cosmetic identity. The user may rename. */
const BUILD_NAMES: Readonly<
  Record<ClassId, Readonly<Partial<Record<OriginId, string>>> & { readonly default: string }>
> = {
  muscle: {
    default: "Forgewalker",
    ironblood: "Anvil",
    engineborn: "Late Forge",
    riverborn: "Tempered Current",
    stormborn: "Hammerfall",
  },
  aerobic: {
    default: "Pacer",
    ironblood: "Iron Engine",
    engineborn: "Long Breath",
    wayfarer: "Far Runner",
    stormborn: "Afterburner",
  },
  mobility: {
    default: "Kinetic",
    ironblood: "Bending Iron",
    riverborn: "Still Water",
    stillwater: "Quiet Range",
  },
  nutrition: {
    default: "Gardener",
    rootborn: "Deep Root",
    ironblood: "Fuelled Iron",
    engineborn: "Clean Burn",
  },
  hybrid: {
    default: "Alpine Athlete",
    ironblood: "Iron Alpine",
    engineborn: "Engine Alpine",
    evenkin: "Allrounder",
  },
  all: { default: "Summit Seeker", evenkin: "Even Summit" },
};

export function proposeBuild(
  classId: ClassId,
  originId: OriginId,
  statMidpoints: Readonly<Partial<Record<StatId, number>>>,
): Build {
  const names = BUILD_NAMES[classId];
  const name = names[originId] ?? names.default;
  return { name, classId, originId, weights: buildWeights(classId, statMidpoints), userNamed: false };
}
