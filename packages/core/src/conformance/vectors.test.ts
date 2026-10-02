import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { generateVectors } from "./vectors.js";

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, "../../conformance/vectors.json");

describe("conformance vectors", () => {
  it("the committed vectors match the engine (regenerate with `pnpm --filter @minmax/core vectors` after an intended change)", () => {
    const committed = JSON.parse(readFileSync(file, "utf8"));
    const current = JSON.parse(JSON.stringify(generateVectors()));
    expect(current).toEqual(committed);
  });

  it("the generator is deterministic", () => {
    const a = JSON.stringify(generateVectors());
    const b = JSON.stringify(generateVectors());
    expect(a).toBe(b);
  });

  it("covers every published norm table and every stat", () => {
    const v = generateVectors() as {
      norms: { tables: { metric: string; probes: unknown[] }[] };
      fixture: { character: { stats: Record<string, unknown> } };
    };
    expect(v.norms.tables.length).toBeGreaterThan(0);
    for (const t of v.norms.tables) expect(t.probes.length).toBeGreaterThan(0);
    expect(Object.keys(v.fixture.character.stats)).toHaveLength(7);
  });
});
