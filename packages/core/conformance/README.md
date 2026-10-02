# Engine conformance vectors

`vectors.json` holds deterministic inputs and the outputs `@minmax/core` produces for them. It is generated from the engine (`pnpm --filter @minmax/core vectors`) and pinned by `src/conformance/vectors.test.ts`: a change in engine behaviour fails the test until the file is regenerated on purpose, and the diff of the file is the list of behaviour changes.

The file exists for two readers:

1. **A port of the engine** to another language (Dart for Flutter, Kotlin or Swift for native clients). The port reads the inputs, runs its own implementation and compares. Matching every vector is the definition of "the same engine"; `docs/05-architecture.md` lists it among the non-negotiables for the client platform.
2. **A reviewer of an engine change**, who reads the regenerated diff to see exactly which stats, levels, quests or claim payloads moved.

## What is covered

| Section | Inputs | Outputs |
|---|---|---|
| `util` | z and p grids, rounding cases, thousands grouping, interpolation knots, ISO timestamps | `normalCdf`, `probit`, `round`, `groupThousands`, `interpolate`, `startOfIsoWeek`, `addDays`, `toDateOnly` |
| `norms.tables` | every published norm table, probed at five values (inside and beyond the published anchors) and at every age band midpoint plus the edges | `percentileFor` |
| `norms.combinePercentiles` | percentile and weight pairs | the combined percentile (weighted mean in z) |
| `character` | nine synthetic stat sheets, six classes, eight origins, a 17-day bottleneck sequence | `characterLevel`, `deriveOrigin`, `proposeBuild`, `buildWeights`, `updateBottleneck`, `allRegionStatuses`, `chapterXpTarget`, `xpProgress` |
| `fixture` | the fit 32-year-old test user: profile and 34 measurements | resolved estimates, the assembled character, the week's quests, HRV readiness, predicate checks and the canonical claim payloads, Game and Simple Mode lines |
| `progress` | four sessions and five days of steps in one quest window | `evaluateProgress` for six templates covering `sessions`, `daily_average`, `improve_mean`, `rest_days` and `self_report` |

Timestamps are fixed (`now` is `2026-10-02T12:00:00.000Z`); host hooks (id factories) are pure functions described in the vector.

## How a port compares

- **Strings, integers, booleans, enums, array order**: exact.
- **Rounded fields** (`StatValue.value`, `low`, `high`, `mid`, `confidence`, `MetricContribution.percentile`, `level`): exact. They are rounded by the engine, and a port must round the same way: JavaScript `Math.round` rounds halves toward positive infinity (`round(-0.5) = -0`, `round(2.5) = 3`), unlike Dart and Kotlin, whose `round()` rounds halves away from zero. The `util.round` vectors pin this.
- **Unrounded floats** (`normalCdf`, `probit`, `percentileFor`, `combinePercentiles`, estimate `confidence`, HRV `z`, quest `progress`): absolute tolerance 1e-9 for the normal helpers and 1e-6 elsewhere. The engine uses the Abramowitz–Stegun 7.1.26 erf approximation and Acklam's probit with one Newton step; a port that uses a platform `erf` instead will differ in the sixth decimal and must either adopt the same approximations or accept that a rounded stat can differ by one point at a boundary. Adopting the approximations is the recommendation.
- **Canonical claim payloads** (`fixture.claims[].payload`): exact, byte for byte, because they are what gets signed. The payload is JSON with keys sorted by UTF-16 code unit order and numbers printed the way ECMAScript prints them (shortest round-trip form, no trailing `.0`, exponent form only below 1e-6 or at 1e21 and above). Claim numbers are integers or short decimals, so the practical rule for a port is: print integers without a decimal point and decimals without trailing zeros.
- **Map outputs**: `fixture.estimates` is the engine's `Map<Metric, MetricEstimate>` written as an array sorted by metric name.
- **`undefined` fields** are absent in the JSON (JavaScript drops them); a port must treat a missing optional field and an absent one as the same thing.

## Regenerating

```
pnpm --filter @minmax/core vectors
pnpm --filter @minmax/core test
```

Commit the regenerated file together with the engine change that caused it, and say in the commit message which sections moved. A vector change that was not intended is a bug.
