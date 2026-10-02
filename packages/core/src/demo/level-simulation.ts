/**
 * Prints the Character Level distribution for the synthetic cohorts in level-cohorts.ts.
 *
 *   pnpm --filter @minmax/core demo:levels
 *
 * Use it whenever the level formula, the stat model or a region gate changes; the assertions in
 * character/level.test.ts pin the ranges that the game design relies on.
 */
import { LEVEL_CAP, LEVELS_PER_STAT } from "../character/level.js";
import { SUMMIT_MIN_LEVEL, SUMMIT_MIN_STAT } from "../character/regions.js";
import { formatResults, STAT_LOADING, simulateAll } from "./level-cohorts.js";

const N = 2000;
const results = simulateAll(N);

console.log(`Character Level on synthetic users (n = ${N} per cohort, stat loading ${STAT_LOADING})`);
console.log(
  `level = 1 + ${LEVELS_PER_STAT} × Σ measured stat / 100, cap ${LEVEL_CAP}; Summit: level ≥ ${SUMMIT_MIN_LEVEL}, all stats measured, none below ${SUMMIT_MIN_STAT}`,
);
console.log();
console.log(formatResults(results));
