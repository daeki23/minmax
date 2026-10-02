// Lower ES2015 class syntax the way Metro's Babel preset does for Hermes.
import { readFileSync, writeFileSync } from "node:fs";
import { transformSync } from "@babel/core";

const [, , input, output] = process.argv;
const src = readFileSync(input, "utf8");
const result = transformSync(src, {
  babelrc: false,
  configFile: false,
  compact: false,
  plugins: ["@babel/plugin-transform-classes"],
});
writeFileSync(output, result.code);
console.log(`lowered ${input} -> ${output} (${result.code.length} bytes)`);
