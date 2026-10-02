import type { StatId, StatValue } from "./stat.js";

/** Origin = the shape of the profile at the start. Never a rank. See docs/02-game-system.md. */
export const ORIGINS = [
  "ironblood", // strength-dominant
  "engineborn", // aerobic-dominant
  "riverborn", // mobility-dominant
  "stormborn", // power-dominant
  "wayfarer", // movement-dominant
  "stillwater", // recovery-dominant
  "rootborn", // nutrition-dominant
  "evenkin", // flat profile
] as const;
export type OriginId = (typeof ORIGINS)[number];

export const ORIGIN_FOR_STAT: Readonly<Record<StatId, OriginId>> = {
  strength: "ironblood",
  aerobic: "engineborn",
  mobility: "riverborn",
  power: "stormborn",
  movement: "wayfarer",
  recovery: "stillwater",
  nutrition: "rootborn",
};

export interface Origin {
  readonly id: OriginId;
  readonly dominant: StatId | null;
  /** A second stat that stands out almost as much. */
  readonly secondary: StatId | null;
  readonly derivedAt: string;
  /** Snapshot of the stat midpoints the derivation used. */
  readonly snapshot: Readonly<Partial<Record<StatId, number>>>;
}

export const CLASSES = ["muscle", "aerobic", "mobility", "nutrition", "hybrid", "all"] as const;
export type ClassId = (typeof CLASSES)[number];

export const REGIONS = [
  "wilds",
  "forge",
  "engine",
  "arena",
  "temple",
  "garden",
  "sanctum",
  "summit",
] as const;
export type RegionId = (typeof REGIONS)[number];

export const REGION_LABEL: Readonly<Record<RegionId, string>> = {
  wilds: "The Wilds",
  forge: "The Forge",
  engine: "The Engine",
  arena: "The Arena",
  temple: "Temple of Motion",
  garden: "The Garden",
  sanctum: "The Sanctum",
  summit: "The Summit",
};

export const REGION_FOR_STAT: Readonly<Record<StatId, RegionId>> = {
  strength: "forge",
  aerobic: "engine",
  mobility: "temple",
  power: "arena",
  movement: "wilds",
  recovery: "sanctum",
  nutrition: "garden",
};

export type UiMode = "game" | "simple";

export interface Build {
  readonly name: string;
  readonly classId: ClassId;
  readonly originId: OriginId;
  /** Stat weighting the build implies for quest selection; sums to 1. */
  readonly weights: Readonly<Record<StatId, number>>;
  readonly userNamed: boolean;
}

export interface Character {
  readonly userId: string;
  readonly origin: Origin | null;
  readonly classId: ClassId;
  readonly classChosenAt: string;
  readonly build: Build;
  readonly stats: Readonly<Record<StatId, StatValue>>;
  readonly level: number;
  readonly journeyXp: number;
  readonly journey: number; // 1 = first journey; increments on New Journey
  readonly bottleneck: StatId | null;
  readonly homeRegion: RegionId;
  readonly unlockedRegions: readonly RegionId[];
  readonly mode: UiMode;
}
