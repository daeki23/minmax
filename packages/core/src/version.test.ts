import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ENGINE_VERSION } from "./version.js";

describe("ENGINE_VERSION", () => {
  it("matches package.json so recorded versions mean something", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      version: string;
    };
    expect(ENGINE_VERSION).toBe(pkg.version);
  });
});
