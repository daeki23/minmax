/**
 * Writes conformance/vectors.json from the current engine. Run after an intended behaviour change
 * and review the diff: every changed line is a behaviour change a port must follow.
 *
 *   pnpm --filter @minmax/core vectors
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateVectors } from "./vectors.js";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, "../../conformance/vectors.json");
writeFileSync(target, `${JSON.stringify(generateVectors(), null, 2)}\n`);
console.log(`wrote ${target}`);
