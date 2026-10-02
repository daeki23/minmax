import type { ClassId, RegionId } from "../types/character.js";
import { REGION_FOR_STAT, REGIONS } from "../types/character.js";
import type { StatId, StatValue } from "../types/stat.js";
import { isMeasured, STATS, statMidpoint } from "../types/stat.js";
import { CLASS_SPECS } from "./class.js";

export interface RegionContext {
  readonly classId: ClassId;
  readonly level: number;
  readonly stats: Readonly<Record<StatId, StatValue>>;
  readonly bottleneck: StatId | null;
  /** Regions the user has reached through XP or a completed Rift chapter (persisted by the host). */
  readonly earned: readonly RegionId[];
}

export type UnlockReason = "open_to_all" | "home_region" | "rift" | "earned" | "data_present" | "gate_met";

export interface RegionStatus {
  readonly region: RegionId;
  readonly unlocked: boolean;
  readonly reasons: readonly UnlockReason[];
  /** Human-readable requirement when locked. */
  readonly requirement: string | null;
}

/** Summit gate: level ≥ 25 and no measured stat below 50. */
export const SUMMIT_MIN_LEVEL = 25;
export const SUMMIT_MIN_STAT = 50;
/** Arena gate for safety: strength and mobility both at least 40. */
export const ARENA_MIN_STRENGTH = 40;
export const ARENA_MIN_MOBILITY = 40;

function statAtLeast(stats: Readonly<Record<StatId, StatValue>>, s: StatId, min: number): boolean {
  const v = stats[s];
  return isMeasured(v) && (statMidpoint(v) as number) >= min;
}

export function homeRegion(ctx: RegionContext): RegionId {
  const spec = CLASS_SPECS[ctx.classId];
  if (spec.id === "all" && !summitGate(ctx)) return spec.fallbackRegion ?? "wilds";
  return spec.homeRegion;
}

export function summitGate(ctx: RegionContext): boolean {
  if (ctx.level < SUMMIT_MIN_LEVEL) return false;
  return STATS.every(
    (s) => !isMeasured(ctx.stats[s]) || (statMidpoint(ctx.stats[s]) as number) >= SUMMIT_MIN_STAT,
  );
}

export function regionStatus(region: RegionId, ctx: RegionContext): RegionStatus {
  const reasons: UnlockReason[] = [];
  if (region === "wilds") reasons.push("open_to_all");
  if (homeRegion(ctx) === region) reasons.push("home_region");
  if (ctx.bottleneck && REGION_FOR_STAT[ctx.bottleneck] === region) reasons.push("rift");
  if (ctx.earned.includes(region)) reasons.push("earned");
  if (region === "sanctum" && isMeasured(ctx.stats.recovery)) reasons.push("data_present");

  let requirement: string | null = null;
  if (region === "arena") {
    const ok =
      statAtLeast(ctx.stats, "strength", ARENA_MIN_STRENGTH) &&
      statAtLeast(ctx.stats, "mobility", ARENA_MIN_MOBILITY);
    if (ok) reasons.push("gate_met");
    else requirement = `Strength ≥ ${ARENA_MIN_STRENGTH} and Mobility ≥ ${ARENA_MIN_MOBILITY}`;
    // Arena is gated even for Muscle class homes and rifts; safety first.
    return {
      region,
      unlocked: ok && reasons.length > 0,
      reasons: ok ? reasons : [],
      requirement: ok ? null : requirement,
    };
  }
  if (region === "summit") {
    const ok = summitGate(ctx);
    if (ok) reasons.push("gate_met");
    else requirement = `Level ≥ ${SUMMIT_MIN_LEVEL} and every measured stat ≥ ${SUMMIT_MIN_STAT}`;
    return { region, unlocked: ok, reasons: ok ? reasons : [], requirement: ok ? null : requirement };
  }
  if (reasons.length === 0) {
    requirement =
      region === "sanctum" ? "Import sleep data" : "Reach it through a Rift or by finishing a chapter";
  }
  return { region, unlocked: reasons.length > 0, reasons, requirement };
}

export function allRegionStatuses(ctx: RegionContext): readonly RegionStatus[] {
  return REGIONS.map((r) => regionStatus(r, ctx));
}

export function unlockedRegions(ctx: RegionContext): readonly RegionId[] {
  return allRegionStatuses(ctx)
    .filter((s) => s.unlocked)
    .map((s) => s.region);
}
