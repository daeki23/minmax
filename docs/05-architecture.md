# 05 · Architecture

_Status: draft v0.1 · 2026-10-02. System design is settled enough to build against; the client framework section waits for `research/tech-stack-decision.md`._

## What the architecture has to protect

Five product principles turn into five architectural constraints:

| Principle | Constraint |
|---|---|
| Honest numbers with provenance | Every value is a `Measurement` with source, trust and confidence from the moment it enters the system. No path exists for a bare number. |
| Claims leave the phone, data does not | Raw health data lives on the device. The server sees measurements only where a vendor pushes them to us, and never raw payloads. |
| One engine, two surfaces | All rules live in `@minmax/core`, a pure TypeScript package with no I/O. Apps and server call it; neither reimplements a rule. |
| Nobody is punished for their starting point | Origin, bottleneck hysteresis and quest roll-over are state the host persists and feeds back; the engine never "forgets" and never resets a user. |
| Evidence tiers on every recommendation | Quest templates and norm tables are versioned content with citations, shipped with the app and updatable without a release. |

## System overview

```
┌──────────────────────────── phone ────────────────────────────┐
│  Ingest adapters           Local store (encrypted SQLite)      │
│  · HealthKit (iOS)   ──▶   measurements · estimates cache      │
│  · Health Connect    ──▶   character snapshots · quests        │
│  · in-app tests      ──▶   claims · sync log · raw blobs       │
│  · manual / lab entry──▶            │                          │
│                                     ▼                          │
│                        @minmax/core (pure TS)                  │
│          resolve → stats → character → quests → claims         │
│                                     │                          │
│        Game Mode UI  ◀──────────────┴──────────▶  Simple Mode  │
└──────────────┬────────────────────────────────────────────────┘
               │ sync (measurements without raw_ref, E2E-encrypted)
               │ claim requests (predicate + evidence summary)
               ▼
┌──────────────────────────── server ───────────────────────────┐
│  Auth · accounts · subscription state                         │
│  Vendor webhooks (Oura, later Polar/Withings) → measurements  │
│  Claim signer (Ed25519 key in KMS) · verification page        │
│  Content service: norm tables, quest templates (versioned)    │
│  Push notifications · privacy-preserving analytics            │
└───────────────────────────────────────────────────────────────┘
```

The phone is the system of record for a user's measurements. The server is the system of record for identity, subscription, issued claims and content versions. Nothing on the server can reconstruct a character sheet from scratch unless the user has opted into encrypted backup.

## Data flow

1. **Ingest.** An adapter reads from its source and emits `Measurement` objects through `withProvenance()`, which fixes `trustLevel` to what the source may grant and sets the prior confidence (see `03-data-provenance.md`). Each adapter records `sourceRecordId` so re-reads are idempotent.
2. **Daily aggregation.** Sample-based metrics (steps, active minutes, sleep segments) go through `aggregateDaily()` so that one calendar day per source becomes one measurement.
3. **Resolve.** `resolveAll()` produces one `MetricEstimate` per metric: highest trust wins, then most recent, corroboration and disagreement are handled per source, never averaged across trust levels.
4. **Stats.** `computeAllStats()` turns estimates into seven `StatValue`s using the norm registry for the user's age and sex; each is a point, a range or unmeasured, with coverage, confidence, trust and norm status.
5. **Character.** `assembleCharacter()` derives or keeps Origin, computes Character Level, updates the bottleneck with hysteresis, resolves home and unlocked regions and proposes the Build. The host passes in the previous persisted state and stores the new one.
6. **Quests.** On Monday 00:00 local time `closeWeek()` then `scheduleWeek()` run; `evaluateProgress()` runs whenever new measurements or sessions arrive.
7. **Claims.** `checkPredicate()` decides locally whether a claim is honest. If so the client sends predicate and evidence summary (trust, sources, no values) to the server, which signs with `issueClaim()` and returns the `Claim`. Verification happens on the public page or, later, offline with the public key.

Steps 2 to 6 run on the device after every ingest batch and at least once a day in the background. The server runs steps 2 to 4 only for data it ingested itself via webhooks, and only to keep a server-side estimate that can back a claim when the phone is offline.

## The core engine contract

`@minmax/core` is deterministic and side-effect free. It never reads the clock, generates ids, touches the network or does cryptography. The host provides:

| Host provides | Type in core | Notes |
|---|---|---|
| Current time | `now: string` (ISO) on every call | Makes replay and tests trivial |
| Id generation | `idFactory(seed) => string` | Seeds are stable per user, week and template so retries do not duplicate quests |
| Norm tables | `NormRegistry` | Bundled JSON, versioned; `StaticNormRegistry` with pooled fallback |
| Quest templates | `QuestTemplate[]` | Bundled, versioned (`QUEST_TEMPLATES_VERSION`), each with evidence tier and a citation key resolved by `CITATIONS`; `autoSchedulable` refuses `restrictive_nutrition`, `opt_in` and D-tier recommendations (tests excepted), `ageAllows` enforces age gates |
| Self-report check-ins | `CheckIn[]` in `ProgressInput` | The only way a `self_report` criterion advances; always trust 0, XP capped by the host |
| Signing | `Signer` / `Verifier` over a canonical JSON string | Server-side Ed25519 in Phase 0 |
| Persisted state | `Origin`, `BottleneckState`, earned regions, journey XP, build name, carry-over quests | Returned by the engine, stored by the host, fed back next run |

| Module | Responsibility |
|---|---|
| `types/` | Metric specs (unit, plausible range, freshness, tolerance), `Measurement`, `StatValue`, character and claim types |
| `provenance/` | Confidence priors, recency decay, `resolveMetric`, `aggregateDaily` |
| `stats/` | Percentile knots and band tables, stat model weights, `computeStat` |
| `character/` | Origin derivation, class specs and build weights, level, bottleneck hysteresis, region gates, `assembleCharacter` |
| `recovery/` | HRV readiness from the personal, same-source baseline |
| `quests/` | Template types, scheduler, progress evaluation, week close |
| `claims/` | Predicate check, canonical payload, issue and verify |
| `modes/` | The Game Mode and Simple Mode strings for the same state |

The package is published to the mobile app as a workspace dependency and to the server as the same build. One version of the rules exists at any time, and the app's content version and engine version are both recorded on every `StatValue` and `Claim` so a result can be reproduced later.

## Storage model on the device

| Table | Contents | Synced |
|---|---|---|
| `measurements` | Full `Measurement` rows, indexed by metric and `measuredAt`; `rawRef` points into the blob store | Yes, without `rawRef` |
| `raw_blobs` | Encrypted vendor payloads for audit and re-parsing | Never |
| `estimates` | Last `MetricEstimate` per metric, cache only | No, recomputed |
| `character_snapshots` | One row per assembly: stats, level, bottleneck state, origin, regions | Latest row only |
| `quests` | Quests with status, progress and roll-over links | Yes |
| `sessions` | Workouts and in-app test sessions with their trust and source | Yes |
| `claims` | Issued claims with signature | Yes |
| `sync_log` | Append-only change log for conflict-free sync | Yes |

The database is encrypted at rest with a key held in the platform keystore. Sync is last-writer-wins per measurement id, which is safe because measurements are immutable facts; a corrected value is a new measurement with a new id, and the old one is tombstoned.

## Integrations layer

| Source | Runs | Delivery | History | Trust mapping |
|---|---|---|---|---|
| Apple HealthKit | iOS app, native module | Background delivery (hourly for steps, immediate for VO₂max on watchOS) | Full, since HealthKit is an on-device store | `source` = the writing app where HealthKit names it (Garmin Connect, Oura, Polar Flow, Withings), trust 2 for device-derived types, trust 1 for app-recorded, trust 0 for user-entered |
| Android Health Connect | Android app, native module | Periodic sync with `READ_HEALTH_DATA_IN_BACKGROUND` | 30 days by default; onboarding asks for `READ_HEALTH_DATA_HISTORY` with a per-type justification because Origin needs more | Same as HealthKit using the record's data origin |
| In-app tests | App | Immediate | n/a | Trust 1, method per test |
| Manual and lab entry | App | Immediate | n/a | Trust 0, even when the user says "lab" |
| Oura API v2 | Server | Webhooks | Full on first connect | Trust 2 with Oura's validated error bars |
| Polar, Withings, WHOOP | Server, after launch | Webhooks | Varies | Trust 2 |
| Garmin cloud | Not available to new developers in 2026 | — | — | Garmin data arrives through HealthKit and Health Connect; the UI says so |
| Aggregator (Junction, ROOK, Terra) | Server, only if Garmin-cloud metrics prove to be a conversion blocker | Webhooks | Varies | Trust 2, source = the vendor, `via` = aggregator |

Every measurement will carry a `via` field naming the ingest path, so "device-verified Garmin via Apple Health" and "device-verified Oura via Oura API" are distinguishable in the trust detail view and in claims. Details, limits and validation data are in `research/wearable-integrations.md`.

## Server

The MVP server is deliberately small and stateless where possible:

- **Auth**: Sign in with Apple, Google sign-in, email magic link. No passwords.
- **Accounts and subscription**: receipt validation through the stores, entitlement state, nothing about health.
- **Claim signer**: Ed25519 key in a managed KMS; issues `Claim` objects, keeps a revocation list, serves `minmax.app/v/<claim-id>`.
- **Vendor ingest**: OAuth broker and webhook receivers that turn vendor payloads into `Measurement` rows for the user's sync inbox; raw payloads are hashed for idempotency and dropped.
- **Content service**: versioned norm tables and quest templates with a changelog; the app pins a content version per assembly.
- **Push**: quest reminders and week close, scheduled from the device's time zone.
- **Analytics**: event counts and funnels without health values; no third-party SDK that receives identifiers.

Hosting in the EU (Frankfurt or Zürich) keeps the GDPR data-transfer analysis short. Target infrastructure cost at launch is under 50 USD a month; the cost drivers that matter later are vendor aggregators and push volume, not compute.

## Client platform

Decision pending; the judged comparison will be recorded in `research/tech-stack-decision.md` and summarised here. The non-negotiables that any choice must satisfy:

1. Native access to HealthKit and Health Connect, including background delivery and history permissions.
2. Reuse of `@minmax/core` without a port, or a port that passes the conformance vectors in `packages/core/conformance/` (generated from the TypeScript reference, pinned by its tests; see the README there for tolerances and the rounding trap).
3. Encrypted local database and platform keystore access.
4. A rendering path for the dark, cinematic Game Mode that stays at 60 fps on mid-range Android devices.
5. One solo developer can ship both stores from one codebase.

## Security and privacy

- **Threat model for claims**: a modified app or a replayed payload could try to mint a false claim. Phase 0 mitigations are App Attest and Play Integrity on claim requests, server-side ingestion as the witness for vendor data, and the honest wording "device-verified means authenticated vendor account plus unmodified app".
- **Keys**: the claim signing key never leaves the KMS; rotation is supported by the `keyId` in `signatureAlg`.
- **Data minimisation**: the server stores no measurement it did not ingest itself, and claims carry predicates, not values.
- **Deletion**: account deletion wipes server-side measurements and sync state and adds every issued claim to the revocation list. This is the reason no public ledger is used in Phases 0 to 2 (see `07-compliance.md` once drafted, and `research/regulatory.md`).
- **DPIA**: health data under GDPR Article 9 requires a data protection impact assessment before launch; the architecture document is one of its inputs.

## Environments and delivery

- `main` is always releasable; feature branches merge through pull requests with CI green (`.github/workflows/ci.yml` runs lint, typecheck, tests and build).
- Three environments: local, staging with a sandbox signing key, production.
- Content (norm tables, templates) ships with the app and is also fetchable from the content service, so a wrong citation or threshold can be fixed in hours.
- A `pnpm --filter @minmax/core demo` command prints a full character sheet from fixtures; it doubles as a smoke test for every engine change. `demo:levels` prints the Character Level distribution over synthetic cohorts, for tuning the formula and the region gates.
- `packages/core/conformance/vectors.json` records the engine's outputs for fixed inputs (norm lookups, levels, origins, bottleneck transitions, region gates, the fixture user end to end, claim payloads, quest progress). A test fails when the engine drifts from it, so an intended behaviour change regenerates the file (`pnpm --filter @minmax/core vectors`) and the diff documents the change. Any port of the engine must reproduce the file.

## Open architecture decisions

| Decision | Options | Needed by |
|---|---|---|
| Client framework | See `research/tech-stack-decision.md` | Before the first screen |
| Sync transport | Custom change log over HTTPS vs an off-the-shelf local-first sync layer | Before multi-device support, not before launch |
| Backup | Opt-in end-to-end encrypted backup of measurements vs none in v1 | Before launch |
| Server runtime | TypeScript on a managed platform (shares the engine) vs anything else | Before claims |
| Analytics | Self-hosted event store vs privacy-focused SaaS | Before beta |
