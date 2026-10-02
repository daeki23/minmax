// Entry for the Hermes check: compute the conformance vectors inside Hermes and
// print them as JSON. `print` is the Hermes CLI's output function.
import { generateVectors } from "../../../src/conformance/vectors.js";

declare function print(s: string): void;

const out = JSON.stringify(generateVectors());
// Hermes' print adds a newline; chunk to avoid any single-line buffer limits.
const CHUNK = 60_000;
for (let i = 0; i < out.length; i += CHUNK) {
  print(out.slice(i, i + CHUNK));
}
