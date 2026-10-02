// Compare Hermes output against the committed conformance vectors with the
// tolerances from packages/core/conformance/README.md:
// strings, booleans, nulls, integers: exact. Floats: 1e-9 for util.normalCdf /
// util.probit, 1e-6 elsewhere. Claim payloads byte-exact.
import { readFileSync } from "node:fs";

const [, , hermesPath, refPath] = process.argv;
const hermesRaw = readFileSync(hermesPath, "utf8").replace(/\n/g, "");
const hermes = JSON.parse(hermesRaw);
const ref = JSON.parse(readFileSync(refPath, "utf8"));

let compared = 0;
let floatCompared = 0;
let maxDiff = 0;
let maxDiffPath = "";
const failures = [];

function tol(path) {
  return path.startsWith("util.normalCdf") || path.startsWith("util.probit") ? 1e-9 : 1e-6;
}

function walk(a, b, path) {
  if (typeof a !== typeof b) {
    failures.push(`${path}: type ${typeof a} vs ${typeof b}`);
    return;
  }
  if (a === null || b === null) {
    if (a !== b) failures.push(`${path}: ${a} vs ${b}`);
    compared++;
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      failures.push(`${path}: array length ${a.length} vs ${b?.length}`);
      return;
    }
    a.forEach((v, i) => walk(v, b[i], `${path}[${i}]`));
    return;
  }
  if (typeof a === "object") {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    if (ka.join("\u0000") !== kb.join("\u0000")) {
      failures.push(`${path}: keys differ (${ka.length} vs ${kb.length})`);
      return;
    }
    for (const k of ka) walk(a[k], b[k], path ? `${path}.${k}` : k);
    return;
  }
  compared++;
  if (typeof a === "number") {
    if (Number.isInteger(a) && Number.isInteger(b)) {
      if (a !== b) failures.push(`${path}: ${a} vs ${b}`);
      return;
    }
    floatCompared++;
    const d = Math.abs(a - b);
    if (d > maxDiff) {
      maxDiff = d;
      maxDiffPath = path;
    }
    if (!(d <= tol(path))) failures.push(`${path}: ${a} vs ${b} (diff ${d})`);
    return;
  }
  if (a !== b) failures.push(`${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
}

walk(hermes, ref, "");

// Claim payloads must be byte-exact.
const payloads = (ref.fixture?.claims ?? [])
  .map((c, i) => [i, c.payload, hermes.fixture?.claims?.[i]?.payload])
  .filter(([, p]) => p !== undefined);
const payloadMismatch = payloads.filter(([, a, b]) => a !== b).length;

console.log(
  JSON.stringify(
    {
      scalarsCompared: compared,
      floatsCompared: floatCompared,
      maxFloatDiff: maxDiff,
      maxFloatDiffPath: maxDiffPath,
      claimPayloads: payloads.length,
      claimPayloadMismatches: payloadMismatch,
      byteIdentical: hermesRaw === JSON.stringify(ref),
      failures: failures.length,
      firstFailures: failures.slice(0, 15),
    },
    null,
    2,
  ),
);
process.exit(failures.length === 0 && payloadMismatch === 0 ? 0 : 1);
