#!/bin/sh
# Bundle the engine's conformance generator, lower class syntax the way Metro's
# Babel preset does, execute it in the Hermes CLI and compare with the pinned
# vectors. Exit code 0 means Hermes reproduces every vector within tolerance.
#
#   cd packages/core/conformance/runtimes/hermes && npm install && npm run check
set -eu
cd "$(dirname "$0")"
OUT=.out
mkdir -p "$OUT"
case "$(uname -s)" in
  Darwin) HERMES=node_modules/hermes-engine-cli/osx-bin/hermes ;;
  *) HERMES=node_modules/hermes-engine-cli/linux64-bin/hermes ;;
esac
chmod +x "$HERMES"
./node_modules/.bin/esbuild entry.ts --bundle --format=iife --target=es2017 --platform=neutral \
  --outfile="$OUT/bundle.js" --log-level=warning
node lower.mjs "$OUT/bundle.js" "$OUT/bundle.lowered.js"
"$HERMES" -O "$OUT/bundle.lowered.js" > "$OUT/hermes-vectors.json"
node compare.mjs "$OUT/hermes-vectors.json" ../../vectors.json
