# The Case for Flutter: Tech-Stack Proposal for MINMAX (Flutter/Dart Client, TypeScript Backend)

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

> **Method note.** This session's WebSearch quota was already used up when this report began, so it ran **zero web searches** (the brief asked for at least six). Every external fact below comes from roughly 55 direct fetches of primary pages: pub.dev package pages and API docs, docs.flutter.dev, Apple developer docs, vendor pricing pages and official blogs. As a result the report has no third-party benchmarks (for example independent Impeller frame-time measurements), no DACH hiring data and no app-store revenue data for the health apps it cites. Wherever a claim rests on my own estimate or on something I could not open, it says so.

## Summary for the founder

- **Verdict: Flutter is the best of the cross-platform options for the cinematic Game Mode and for shipping one polished app to both stores, but it is not the best option for reusing the engine you already wrote.** The costs sit in three places: (1) porting or bridging `@minmax/core`, (2) native Swift/Kotlin code for health ingest, which you need anyway, and (3) a crypto, ZK and web ecosystem that is TypeScript- and Rust-first. If Game Mode's visual quality is the main differentiator, pick Flutter. If engine reuse, the web and Midnight matter more, pick React Native/Expo. (confidence: medium)
- **No Flutter plugin covers MINMAX's health needs.** The de-facto plugin `health` 13.3.2 handles Health Connect history and background permissions, workouts, workout routes, both HRV types and `recordingMethod`/source metadata. It has **no VO2max type and no iOS background delivery** [11][13]. The one Flutter plugin that does wrap HealthKit observer queries was last published about 21 months ago [14]. Budget for a native Swift + Kotlin ingest module behind a Pigeon API [9][10]. (confidence: high)
- **The engine has to be ported or bridged.** `@minmax/core` is about 3,050 lines of logic and types, plus about 850 lines of norm tables and 98 tests (repo count; the brief said 74). Porting it to Dart means two implementations from then on, which is allowed by non-negotiable #2 in `05-architecture.md` only with a conformance suite. There are concrete traps: JS `Math.round` rounds ties toward +∞ while Dart rounds them away from zero [63][64], and number formatting in canonical JSON is likely to differ. My estimate is 2–3 weeks for the port plus a lasting tax on every rule change. (estimate; confidence: low-medium)
- **The UI is Flutter's home ground.** Impeller is the only renderer on iOS and the default on Android API 29+, falling back to OpenGL elsewhere [5]. Shaders compile at build time, so there is no first-run jank [3]. You get custom GLSL fragment shaders [6], Rive 0.14 with its own renderer [18], pure-Dart Lottie [20] and the Flame 2D engine [22], and Flutter says it is "designed to deliver smooth 60fps and 120fps animations" [7]. Precedent: Tonal shipped its Flutter app with two engineers in under a year, including Rive animations [54]. (confidence: high)
- **The local-first storage is mature; sync is thin outside PowerSync.** drift 2.35 gives reactive SQLite, isolates and migrations, with encryption through SQLite3MultipleCiphers [23][24]. PowerSync has a GA Flutter SDK [25]. The ElectricSQL Dart client is discontinued [28], the Turso client is unofficial [29] and Automerge has no Dart binding [30]. Recommendation: drift plus the custom append-only sync log the architecture already describes. (confidence: high)
- **Backend: TypeScript, not Serverpod.** A Hono/Node service reuses `@minmax/core` as the reference engine for claims, with Postgres and Auth on Supabase Zurich (`eu-central-2`) [58] and compute on Cloud Run [60]. My estimate is about $35–50/month at 1k users, $60–110 at 10k and $250–560 at 100k, excluding any wearable aggregator. Serverpod 4 is attractive (type-safe client, MCP, experimental offline sync), but pub.dev shows the server package under **SSPL-1.0** [40][42] and Serverpod Cloud publishes no region [46]. (confidence: medium)
- **ZK is reachable from Flutter, but only through Rust.** Mopro generates Flutter bindings through flutter_rust_bridge for Circom/Noir/Halo2 [34][35][36]. Midnight's SDKs are TypeScript-only [37], and Midnight is not mobile-ready anyway (see `midnight-zk.md`). The only Dart SD-JWT library has 1 like and 7 downloads [33]. Keep issuance in the TS server. (confidence: medium-high)
- **On the web, one codebase covers only the logged-in app.** Flutter's own FAQ says Flutter web is a poor fit for landing pages and text-heavy content and points to Jaspr or plain HTML [8]. The landing page and `minmax.app/v/<id>` should be server-rendered HTML. (confidence: high)
- **Velocity tools are good; the talent pool is small.** Shorebird pushes Dart over the air on iOS and Android (5,000 patch installs/month free) but cannot patch native code [47][48]. Codemagic gives 500 free macOS minutes a month [49], Patrol drives native permission dialogs in tests [50], and there is an official Dart/Flutter MCP server [51]. But Dart is used by 5.9% of developers against 43.6% for TypeScript in the Stack Overflow 2025 survey [52]. (confidence: medium)

## Findings

### 1. Why this stack fits MINMAX

**1.1 A dark, cinematic game surface needs a renderer the app controls, and Flutter is one.** Flutter draws every pixel itself, so the dark, premium look is identical on iPhone and Android, with one design system and no fight with platform widgets. Current facts:

- Impeller is "the only supported rendering engine on iOS". On Android it is "enabled by default on Android API 29+", and devices without Vulkan fall back to the legacy OpenGL renderer [5]. (confidence: high)
- Flutter 3.47 (12 Aug 2026) says shaders are compiled "at build time rather than runtime, eliminating animation jank". The 3.47 release also made Impeller the default on desktop [3][2]. (confidence: high)
- Custom fragment shaders work on both Skia and Impeller with GLSL 100–460. The shader-based `ImageFilter` API is Impeller-only [6]. That covers glows, auras, energy fields and region transitions.
- **Rive** 0.14.11 (publisher rive.app, ~1.95k likes) now runs on the `rive_native` runtime and lets you choose the Rive renderer or Flutter's [18]. A Rive state machine is the natural fit for a stat-driven character avatar. Rive Cadet costs $9/seat/month to export without the splash screen [19].
- **Lottie** 3.6.1 is "a pure Dart implementation of a Lottie player" [20]. **Flame** 1.38.2 is a 2D engine with a game loop, components, sprite animations and particle effects [22]. That fits the world map with The Forge, The Engine, Temple of Motion and the other regions.
- Flutter's FAQ: "Flutter is designed to deliver smooth 60fps and 120fps animations" [7]. This is a vendor claim. I found no independent benchmark for mid-range Android (unverified).

**1.2 One solo developer can ship both stores.** Tonal, a connected-fitness company, built its iOS and Android app in Flutter "in less than a year with only two engineers", with full feature parity, a release every two weeks, Rive animations and a leaderboard for tens of thousands of members. Its engineering manager says Flutter's hot reload "actually works reliably and is consistently very fast" [54]. A vendor case study is marketing, but the scope (charts, Rive, social, video) is close to MINMAX's. (confidence: medium)

**1.3 The local-first data layer is the strongest in any cross-platform stack.**
- **drift** 2.35.1 (simonbinder.eu, ~2.48k likes, ~1.41M downloads) offers type-safe SQL, any query as an auto-updating stream, built-in isolate threading and migrations [23]. Encryption now runs through **SQLite3MultipleCiphers**, bundled via `sqlite3` build hooks. The old `sqlcipher_flutter_libs` route "is no longer necessary after upgrading to drift 2.32.0" [24]. The key goes into `flutter_secure_storage` 11.2.0, which uses the Keychain on iOS and RSA-OAEP-wrapped AES-GCM on Android [31]. This maps one-to-one onto the encrypted store in `05-architecture.md`.
- **PowerSync** 2.4.0 is GA on mobile, with web in beta. It syncs Postgres, MongoDB, MySQL or SQL Server into client SQLite, depends on `sqlcipher_flutter_libs` and integrates with Drift [25][27]. Pricing: Free $0 (50 concurrent clients); Pro from $49/month (1,000 concurrent clients, 30 GB synced; $30 per extra 1,000 clients); a self-hosted Open Edition is free and source-available [26].
- **Serverpod 4** (14 Sep 2026) adds offline sync between SQLite and Postgres via `database: sync`. It is "experimental in v4.0", with stabilisation planned for 4.1 [44].

**1.4 Native and Rust escape hatches are first-class.** **Pigeon** 29.0.6 (published by flutter.dev) generates type-safe Swift and Kotlin bindings and offers an experimental FFI/JNI "Native Interop" mode [10]. Flutter's docs recommend it over raw method channels, which are "not type safe" [9]. **flutter_rust_bridge** 2.13.0 (Flutter Favorite, ~643k weekly downloads) generates Dart bindings for arbitrary Rust [36]. That path reaches Noir, Halo2, Arkworks and BBS libraries written in Rust.

**1.5 Delivery tooling for a team of one.**
- **Over-the-air updates:** Shorebird supports Android and iOS. On iOS it runs patched Dart code in a custom interpreter to stay within Apple's rules. Free: 5,000 patch installs/month; Pro: $20/month for 50,000, then $1 per 2,500 [47][48].
- **CI:** Codemagic gives 500 free macOS M2 minutes/month, then $0.095/minute [49].
- **End-to-end tests:** Patrol 4.10.0 (LeanCode) handles native permission dialogs and notifications from Dart test code [50]. That matters because the HealthKit and Health Connect consent sheets are on the critical onboarding path.
- **AI-assisted coding:** the official Dart and Flutter MCP server gives coding agents "analyzer diagnostics, symbol resolution, test runners, and runtime inspection", and there are official agent rules and skills [51]. Serverpod 4 ships "AI agent skills and an MCP server out of the box" [44].

**1.6 The ecosystem is moving in the right direction.** In 3.47, 92 of the top 100 iOS plugins had moved to Swift Package Manager and CocoaPods is in maintenance mode. Material and Cupertino now ship as standalone v1.0 packages that can update weekly [3]. Dart 3.13 (12 Aug 2026) added primary constructors [4], which cuts boilerplate in the `Measurement`, `StatValue` and `Claim` value types. (confidence: high)

**1.7 Health and fitness apps in production.**

| App | What is Flutter | Source | Caveat |
|---|---|---|---|
| Tonal (strength-training hardware) | iOS and Android companion app; the device UI is native Android | [54] | Vendor case study |
| Headspace (mental health) | "migrating to Flutter" for mobile and web | [55] | Scope and date not stated on the page |
| Fitbit Ace | Listed in Google's Flutter showcase | [53] | Which part is Flutter is **unverified** |
| Reflectly (wellness journaling), CZ Zorgverzekeringen (Dutch health insurer) | Listed in the showcase | [53] | Details **unverified** |

I could not verify that any of these uses HealthKit or Health Connect **background delivery** from Flutter. (confidence: medium)

### 2. Where it hurts (brutally)

**2.1 You already wrote the engine in the wrong language for this stack.** `@minmax/core` is about 3,900 lines of non-test TypeScript. Of that, about 850 lines in `stats/published.ts` are norm tables and about 3,050 are logic and types; there are 98 tests. With Flutter you have three options:

- **(a) Port to Dart** and keep the TypeScript as the reference oracle, checked by a conformance suite.
- **(b) Run the TS bundle on-device** through `flutter_js` 0.8.7, which uses JavaScriptCore on iOS and QuickJS through FFI on Android. It was last published about 8 months ago and has 360 likes [38].
- **(c) Compute on the server.** This breaks the rule that the phone is the system of record, so it is not an option.

The port is the honest recommendation, but it carries real divergence risks that I checked in the code:

- `util/math.ts`, `character/level.ts`, `character/origin.ts` and `modes/vocabulary.ts` use `Math.round`. JavaScript rounds .5 ties "to the next integer in the direction of +∞" (`Math.round(-5.5) === -5`) [64]. Dart rounds "away from zero" (`(-3.5).round() == -4`) [63]. Negative z-scores or deltas will round differently at exact ties.
- `claims/issue.ts` builds the canonical payload from `JSON.stringify` of primitives, and Node prints `50.0` as `50` (checked locally). Dart's `double.toString` is documented only as a round-trippable literal [unverified from docs], and I expect `jsonEncode(50.0)` to give `"50.0"`. A Dart re-canonicalisation would then produce different bytes and break signatures. Confirm this in a one-line test.
- `util/normal.ts` (probit and erfc) and `recovery/hrv.ts` rely on `Math.exp`, `Math.log` and `Math.sqrt`. Last-bit differences between the V8 and Dart VM math libraries are possible (**unverified**) and could flip a percentile band at a boundary.

The ongoing cost: every rule change from `normative-data.md`, `training-science.md` and later research has to land twice. My estimate is +20–30% on each engine change (**estimate**).

**2.2 HealthKit depth needs native code, and the best plugin lacks two things MINMAX needs.**
- `health` 13.3.2 (carp.dk, 680 likes, iOS minimum raised to 15.0) has no `VO2MAX` in its `HealthDataType` enum [11][12][13]. VO₂max is the backbone of the Aerobic stat and of the "Engineborn" Origin.
- Its docs cover background reads only for Android Health Connect and say nothing about iOS observer queries or background delivery [11].
- Apple requires observer queries to be set up in the app delegate's `application(_:didFinishLaunchingWithOptions:)`, and the app must call the completion handler. "If your app fails to respond three times, HealthKit ... stops sending background updates" [15]. That code lives in Swift and runs before any Dart is guaranteed to exist.
- The React Native ecosystem has a maintained library that advertises change subscriptions and background delivery [16]. On this axis Flutter is behind. (confidence: high)

**2.3 No watch app.** Flutter's FAQ lists Android, iOS, web, desktop and embedded as targets, and no watchOS [7]. An Apple Watch companion for live workout recording would be a separate SwiftUI app, the same as with React Native. (confidence: high)

**2.4 Crypto, ZK and Midnight are TypeScript- and Rust-first.**
- Midnight offers only TypeScript SDKs: Wallet SDK, Midnight.js, Ledger and Testkit [37].
- Mopro supports Flutter, but its Flutter guide only demonstrates Circom with Arkworks, at version 0.3 [35].
- The Dart `sd_jwt` package implements an IETF draft rather than RFC 9901 and has 1 like and 7 downloads [33].
- `cryptography` 2.9.0 covers Ed25519, ECDSA, X25519, AES-GCM and XChaCha20 through platform APIs [32], but was last published about 10 months ago.

Every ZK feature in `midnight-zk.md` Phase 2 means adding a Rust toolchain through flutter_rust_bridge. (confidence: medium-high)

**2.5 The web is not a Flutter strength.** Flutter's FAQ says Flutter web "is geared towards dynamic application experiences" and is not ideal for "static websites with text-rich, flow-based content", and recommends Jaspr or plain HTML for landing pages [8]. The public claim-verification page must be crawlable, fast and verifiable with View Source, so it should not be a Flutter canvas. Wasm is "progressing toward becoming the default" [3]. A logged-in web dashboard would be fine, but it conflicts with keeping data on the device. (confidence: high)

**2.6 Sync choices are narrow.** ElectricSQL's Dart package is "discontinued" and incompatible with Electric Next [28]. The Turso/libSQL Dart client is a community package with 20 likes and no documented encryption [29]. Automerge officially supports only JS, Rust and Swift [30]. PowerSync's docs index lists no page on EU data residency for PowerSync Cloud [27] (**unverified**). Self-hosting the Open Edition avoids that question but adds an ops burden.

**2.7 Talent pool and AI corpus.** In the Stack Overflow 2025 survey, Dart is used by 5.9% of all respondents (6.1% of professionals). TypeScript is used by 43.6% (48.8%), Kotlin by 10.8% and Swift by 5.4% [52]. A Flutter developer for MINMAX also needs Swift and Kotlin for the health modules. I found no measurement of LLM code quality in Dart versus TypeScript (**unverified**), but the corpus gap points the same way. (confidence: medium)

**2.8 Platform governance.** Flutter and Dart are Google-run:
- Dart **macros** were cancelled on 29 Jan 2025 after years of prototyping, in favour of build_runner improvements and augmentations [61]. Code generation (drift, Pigeon, JSON) therefore stays a build step.
- 3.47 moved Material and Cupertino out of the SDK into separate packages [3], which is migration churn.
- A community fork called Flock exists (382 stars) [62]; why it was started is **unverified**.

(confidence: medium)

**2.9 Two Android render paths to test.** Devices below API 29 or without Vulkan use the legacy OpenGL path [5]. Custom shaders have tight limits: fragment shaders only, no vertex shaders, no UBO/SSBO, only `sampler2D`, float uniforms only [6]. Complex particles therefore stay CPU-side (Flame) or are faked in fragment shaders. I found no production-grade 3D path in this pass. Plan a 2D/2.5D art direction built around Rive.

**2.10 OTA has hard edges.** Shorebird "does not support changing native code", so a fix to the Swift/Kotlin health ingest still goes through store review. On iOS, patched Dart code runs in an interpreter [48].

**2.11 Small things.** `flutter_animate` 4.5.2 was last published about 22 months ago [21]. A minimal Flutter release app adds "a few megabytes compressed" [7].

### 3. Criterion scorecard

| Criterion | Flutter verdict | Evidence |
|---|---|---|
| HealthKit / Health Connect incl. background and workouts | **Adequate, needs native code** | HC history and background permissions, `writeWorkout`, workout routes, `recordingMethod` in `health` [11]; no VO₂max and no iOS background delivery [13]; Pigeon module required [10][15] |
| Vendor APIs via webhooks | Neutral | Runs on the server; language-independent |
| Premium cinematic UI, 60/120 fps | **Strong** | Impeller [5], build-time shaders [3], GLSL [6], Rive [18], Lottie [20], Flame [22], Tonal [54] |
| Local-first, encrypted store | **Strong** | drift + SQLite3MultipleCiphers [23][24], secure storage [31] |
| Sync with conflict resolution | Adequate | PowerSync GA [25]; Serverpod sync experimental [44]; Electric and Automerge absent [28][30] |
| Future on-device ZK | Adequate (via Rust) | Mopro + FRB [34][35][36]; Midnight TS-only [37]; SD-JWT in Dart immature [33] |
| Solo velocity | Strong for UI, **taxed by the engine port** | Hot reload, Tonal [54]; §2.1 |
| Hiring pool / AI | Weak to adequate | Dart 5.9% vs TS 43.6% [52]; official MCP server [51] |
| OTA | Adequate | Shorebird, Dart only [47][48] |
| CI/CD, store tooling, testing | Strong | Codemagic [49], Patrol [50] |
| Web (landing, verification page, dashboard) | **Weak** for public pages, adequate for a dashboard | Flutter web FAQ [8], Jaspr [56] |
| Production health precedents | Adequate | [53][54][55] |

## Concrete architecture

### Diagram

```
┌──────────────────────────────── phone (Flutter 3.47 / Dart 3.13) ────────────────────────────────┐
│                                                                                                   │
│  NATIVE INGEST (Swift / Kotlin, ~1–1.5k lines, est.)        DART                                  │
│  ┌──────────────────────────────┐   Pigeon API   ┌──────────────────────────────────────────────┐ │
│  │ iOS: HKObserverQuery +       │◀──────────────▶│ ingest/  drain inbox → withProvenance()      │ │
│  │  enableBackgroundDelivery    │                │ engine/  minmax_core (Dart port)             │ │
│  │  (registered in AppDelegate) │  encrypted     │   resolve → stats → character → quests       │ │
│  │  HKAnchoredObjectQuery       │  NDJSON inbox  │ data/    drift + SQLite3MultipleCiphers      │ │
│  │  vo2Max, HRV, RHR, sleep,    │──────────────▶ │          key in Keychain / Keystore          │ │
│  │  workouts, body comp         │  (file-protec- │ sync/    append-only log, LWW per id         │ │
│  │ Android: Health Connect      │   ted, app     │ ui/      Game Mode: Rive avatar, Flame map,  │ │
│  │  changes tokens, Vo2MaxRecord│   container)   │          GLSL shaders, Lottie                │ │
│  │  (rest via `health` plugin)  │                │          Simple Mode: plain widgets          │ │
│  └──────────────────────────────┘                └──────────────────────────────────────────────┘ │
│        ▲ BGProcessingTask / WorkManager (via `workmanager`) runs the Dart engine headless           │
└────────┼──────────────────────────────────────────────────────────────────┬──────────────────────┘
         │                                                                  │ HTTPS: sync batches
         │                                                                  │ (E2E-encrypted, no rawRef),
         │                                                                  │ claim requests + App Attest /
         │                                                                  │ Play Integrity token
┌────────┴──────────────────────────── server (EU: Zurich or Frankfurt) ────▼──────────────────────┐
│  api/ (TypeScript, Node 22, Hono)                                                               │
│   · imports @minmax/core: THE reference engine (checkPredicate, canonicalize, issueClaim)       │
│   · claim signer: Ed25519 in a managed KMS (KMS choice and price unverified)                    │
│   · vendor OAuth + webhooks (Oura v2, later Polar/WHOOP/Withings) → measurements inbox          │
│   · content service: norm tables + quest templates as versioned JSON (shared with Dart)         │
│   · SSR page minmax.app/v/<claim-id> (plain HTML, verifiable without JS)                        │
│  Postgres + Auth (Sign in with Apple/Google, magic link): Supabase eu-central-2 (Zurich)        │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
   Landing page: static HTML (or Jaspr if you want to stay in Dart). Not Flutter web.
```

Design choices that follow from the evidence:

- **Native code writes only to an inbox, never to the database.** If native code wrote straight into the encrypted drift database, it would also need the SQLite3MultipleCiphers build and the key. Instead, the background handler appends samples (HealthKit UUID or Health Connect record id as `sourceRecordId`, source bundle, device, user-entered flag) to a file-protected inbox, calls HealthKit's completion handler right away [15], and schedules a background task. Dart drains the inbox on that task or on the next app launch.
- **The phone never re-canonicalises claims.** The server canonicalises and signs with the TS engine and returns the exact canonical payload string with the signature. Any offline verification on the device checks those bytes. This removes the JSON-number trap in §2.1.
- **Norm tables and quest templates become JSON content** (the architecture already plans a content service). That shrinks the port to about 3,050 lines of logic, and both engines load the same data.

### Folder layout

```
minmax/
  packages/
    core/                    @minmax/core (TypeScript) – reference implementation, used by api/
    core_dart/               minmax_core (Dart) – on-device port, pure, no Flutter import
      lib/src/{types,provenance,stats,character,recovery,quests,claims,modes,util}/
      test/                  ported unit tests + conformance runner
    conformance/
      cases/*.input.json     fixtures (measurements, prior state, now, content version)
      expected/*.output.json generated by `pnpm --filter @minmax/core conformance:gen`
    content/                 norm tables + quest templates as versioned JSON (source of truth)
  apps/
    mobile/                  Flutter app
      lib/
        app/                 router, DI, theme tokens (dark), typography
        design/              components, shaders/*.frag, rive/*.riv, lottie/*.json
        features/            onboarding/ character/ world/ quests/ claims/ simple_mode/ settings/
        data/db/             drift tables (measurements, raw_blobs, quests, sessions, claims, sync_log)
        data/sync/           push/pull of the change log
        ingest/              Dart side of health adapters + inbox drain
      pigeons/health_api.dart
      ios/Runner/Health/     HealthKitIngest.swift (observers, anchors, VO2max, workouts)
      android/app/src/main/kotlin/.../health/HealthConnectIngest.kt
      integration_test/      Patrol flows (permission sheets, onboarding, claim)
    api/                     TypeScript server (Hono) – routes/, claims/, webhooks/, verify/ (SSR)
    web/                     static landing page (HTML or Jaspr)
  .github/workflows/         ci.yml (TS) + mobile.yml (flutter analyze/test, conformance, Codemagic trigger)
```

Dart 3.11 added glob support to pub workspaces [4], so `packages/core_dart` and `apps/mobile` can share one Dart workspace next to the pnpm workspace.

### Key libraries (versions from pub.dev on 2026-10-02)

| Concern | Choice | Version, last publish | Notes |
|---|---|---|---|
| SDK | Flutter / Dart | 3.47 / 3.13, 12 Aug 2026 [3][4] | Quarterly cadence |
| Health (reads/writes) | `health` (carp.dk) | 13.3.2, ~mid-Aug 2026 [11][12] | Add VO₂max and iOS background natively; consider an upstream PR |
| Native bridge | `pigeon` (flutter.dev) | 29.0.6 [10] | Swift/Kotlin codegen |
| Background jobs | `workmanager` (fluttercommunity) | 0.10.10, ~Sep 2026 [17] | WorkManager / BGTaskScheduler |
| Local DB | `drift` | 2.35.1, ~1 Oct 2026 [23] | Encryption via SQLite3MultipleCiphers [24] |
| Key storage | `flutter_secure_storage` | 11.2.0 [31] | Keychain / Keystore-wrapped AES-GCM |
| Crypto (E2E sync, verify) | `cryptography` (+ `cryptography_flutter`) | 2.9.0, ~Dec 2025 [32] | Ed25519, XChaCha20, AES-GCM via platform APIs |
| Animation | `rive` | 0.14.11, ~Aug 2026 [18] | Avatar state machine; Cadet $9/seat/mo [19] |
| Animation | `lottie` | 3.6.1, ~Sep 2026 [20] | Pure Dart |
| World map, particles | `flame` | 1.38.2, ~Aug 2026 [22] | Only for Game Mode screens |
| Micro-animation | `flutter_animate` | 4.5.2, ~Dec 2024 [21] | Stale; optional |
| Auth client | `supabase_flutter` | 2.18.0, ~30 Sep 2026 [59] | Native Apple/Google sign-in, magic link (`signInWithOtp`) |
| Sync (later, optional) | `powersync` | 2.4.0, ~Sep 2026 [25] | Only if multi-device editing is needed |
| ZK (Phase 2) | Mopro + `flutter_rust_bridge` | Mopro 0.3; FRB 2.13.0 [34][36] | Noir/Circom via Rust |
| E2E tests | `patrol` | 4.10.0, ~Sep 2026 [50] | Native dialogs |
| OTA | Shorebird | service [47] | Dart only [48] |
| State management | Riverpod or Bloc | versions not checked | Any is fine; pick one |

## Backend proposal

**Recommendation: TypeScript (Node 22 + Hono + Drizzle), Postgres and Auth on Supabase in Zurich, stateless compute on Cloud Run in Zurich (`europe-west6`) or Frankfurt (`europe-west3`).**

Why TypeScript, even in a Flutter stack:

1. Claims must be checked and signed by the **reference** engine. A TS server makes `@minmax/core` the single authority, and the Dart port only has to agree with it, which the conformance suite tests.
2. Midnight SDKs [37], the SD-JWT/OpenID4VC libraries described in `midnight-zk.md` and most vendor-API examples are TypeScript-first.
3. The existing CI and monorepo are already pnpm/TypeScript.

Facts behind the hosting choice:

- Supabase Pro is $25/month with 100,000 auth MAU, an 8 GB database, 250 GB egress and $10 of compute credit. Compute add-ons: Micro $10, Small $15, Medium $60. MAU overage is $0.00325 [57]. Regions include Frankfurt `eu-central-1` and Zurich `eu-central-2` [58].
- Cloud Run's free tier is 180,000 vCPU-seconds, 360,000 GiB-seconds and 2 million requests per month. Tier-1 request-based prices are $0.000024 per vCPU-second, $0.0000025 per GiB-second and $0.40 per million requests [60]. **Zurich and Frankfurt are Tier 2**, which is more expensive; I did not extract the exact Tier-2 rates [60].
- Hetzner (Germany/Finland) is a cheaper self-hosting option, but its page did not render prices in this pass (**unverified**) [65].

**Serverpod as the alternative (pure-Dart stack).** Serverpod 4.0.3 offers a type-safe ORM over Postgres or SQLite, auth (Apple, Google, email, passkeys and more), future calls, file uploads, the Relic web server, Docker and Terraform self-hosting, an MCP server and experimental offline sync [39][43][44]. Serverpod Cloud costs:

- Starter $5/month (1 small podlet + 1 small database).
- Growth $20/month plus usage. Podlets run $0.026/hour (256 MB) to $0.314/hour (4 GB); databases $0.043/hour (1 GB) to $0.172/hour (4 GB) [46].

Two blockers before choosing it:

1. **License:** the `serverpod` package page on pub.dev and `packages/serverpod/LICENSE` on GitHub show **SSPL-1.0** [40][42], while the repository's root LICENSE is BSD-3 [41]. For a company using Serverpod as its own backend, SSPL is usually tolerable, but it needs a legal read.
2. **Residency:** the Cloud pricing page names no region [46], so EU residency is **unverified**.

Choosing Serverpod also makes the TypeScript engine a third consumer to keep in sync, unless the claim signer stays in TypeScript anyway.

**Estimated monthly cost (USD).** My model: 30% of registered users active daily, about 20 API calls per active user per day, 100 ms CPU per call, 0.5 GiB instances with one warm minimum instance, and about 3 OTA patches per user per month. All of these are **estimates**.

| Line item | 1k users | 10k users | 100k users | Basis |
|---|---|---|---|---|
| Supabase (Postgres + Auth, Zurich) | $25 | $25–30 (Small) | $75–100 (Medium + storage) | [57] |
| Cloud Run API (Tier 2 region) | ~$0–10 (free tier + warm instance) | ~$10–20 | ~$30–60 | [60]; Tier-2 uplift not extracted |
| Shorebird OTA | $0 (≤5k installs) | $20 (Pro) | ~$120 (Pro + overage) | [47] |
| CI (Codemagic or GitHub Actions) | $0 (500 free min) | $0–30 | $30–100 | [49] |
| Rive (1 seat) | $9 | $9 | $9 | [19] |
| PowerSync (only if adopted) | $0 | $0–49 | ~$80–170 | [26] |
| **Total, excl. aggregator** | **~$35–50** | **~$60–110** | **~$250–560** | |
| Serverpod Cloud instead of Supabase + Cloud Run | ~$5–25 | ~$70 (Growth + 256 MB podlet + 1 GB DB) | ~$250–600 (est.) | [46] |

Fixed costs from `wearable-integrations.md`: Apple Developer Program $99/year and Google Play $25 one-time. If a wearable aggregator is ever added, its $300–2,000/month would dwarf everything above. KMS, transactional email and monitoring were not priced (**unverified**).

## Risks and mitigations

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| Dart port drifts from the TS reference (rounding, JSON, libm) | High / high (wrong stats, broken claims) | Golden-vector conformance in CI on every engine PR; a `roundHalfUp` helper that copies JS semantics in Dart; compare floats with a tolerance and assert on band and level outputs; server is the only canonicaliser |
| HealthKit background delivery silently stops (3 missed completions) [15] | Medium / high | Native handler only writes to the inbox and returns; a daily foreground catch-up with anchored queries; telemetry counter for "last background wake" |
| VO₂max missing from the `health` plugin [13] | Certain / high | Native Pigeon methods for HealthKit `vo2Max` and Health Connect `Vo2MaxRecord`; offer the change upstream to carp.dk |
| Impeller or shader regressions on mid-range or GL-fallback Android [5][6] | Medium / medium | Device matrix in pre-launch testing (one Vulkan mid-ranger, one GL-fallback device); Game Mode quality settings; Simple Mode as a fallback surface |
| Thin Dart crypto/ZK ecosystem [33][35][37] | High / low in 2026, medium in 2027 | Keep issuance and verification server-side in TS; Phase 2 ZK via Mopro + FRB in a spike before committing |
| Hiring or freelance help hard to find (Dart 5.9%) [52] | Medium / medium | Keep native modules small and well-specified; document Pigeon contracts; TS server stays hireable |
| Google deprioritises Flutter | Low–medium / high, slow | Engine logic is pure Dart, testable without Flutter; UI is the only lock-in |
| Serverpod SSPL or region uncertainty [40][46] | n/a if TS backend chosen | TS backend; revisit Serverpod after legal review |
| Shorebird cannot hot-fix native ingest [48] | Medium / medium | Keep native code minimal; feature-flag new HealthKit types from server content |

## Implications for MINMAX

1. **Decide whether Game Mode quality or engine reuse is the deciding criterion.** With Flutter you pay once to port `@minmax/core` while it is still about 3k lines, and then a smaller tax on every rule change. If you choose Flutter, port now, before the norm tables and quest catalogue grow.
2. **Turn the TypeScript engine into an executable spec now, whichever stack wins.** Move norm tables and quest templates to `packages/content/*.json` and add a `conformance:gen` script that writes input/output vectors. That is useful under React Native too (server/client parity, replays).
3. **Spike before committing (about 5 working days, estimate):**
   - (a) A Swift observer-query module delivering VO₂max and HRV into a Dart inbox in the background.
   - (b) A Kotlin Health Connect `Vo2MaxRecord` read with history permission.
   - (c) A Rive avatar plus one GLSL aura shader at 120 fps on an iPhone and 60 fps on a mid-range Android.
   - (d) A port of `util/normal.ts` and `stats/compute.ts` that passes golden vectors.
   - (e) An optional `flutter_js` run of the whole TS bundle in a background isolate, to measure the bridge option.
4. **Keep the server in TypeScript** and in Zurich (Supabase `eu-central-2`, Cloud Run `europe-west6`). This also keeps the "data stays in Switzerland" message open for the DACH market (regulatory analysis in `regulatory.md`).
5. **Build the landing page and verification page as plain HTML**, not Flutter web [8]. Revisit a Flutter web dashboard only if encrypted backup and multi-device support ship.
6. **Plan the art direction around 2D/2.5D** (Rive, Flame, shaders). A 3D character would be a different engine decision.

## Open questions

- Does Dart's `jsonEncode` print integer-valued doubles as `50.0`? (Expected, but not confirmed from docs in this pass; a one-line test settles it.) Do `exp`/`log` give bit-identical results in V8 and the Dart VM for the probit inputs MINMAX uses?
- Does `flutter_js` run reliably inside a `workmanager` background isolate on iOS (BGTaskScheduler) and Android? This decides whether the bridge option (no port) is viable.
- Can the `health` plugin maintainers (carp.dk) accept upstream PRs for VO₂max and iOS background delivery, or is a maintained fork needed?
- Serverpod: is the SSPL-1.0 server license intended for 4.x (pub.dev) despite the BSD-3 root LICENSE? Where does Serverpod Cloud host data?
- PowerSync Cloud: which regions are offered, and is there an EU data-residency commitment?
- How does Impeller perform with heavy fragment shaders on 2024–2026 mid-range Android devices (for example Samsung A-series) and on GL-fallback devices? No independent data was found.
- Exact Cloud Run Tier-2 (Zurich/Frankfurt) prices; Google Cloud KMS Ed25519 support and price; Hetzner/Infomaniak prices for a self-hosted alternative (all unverified).
- Which of the showcased health apps (Fitbit Ace, Headspace, Reflectly) use HealthKit or Health Connect from Flutter, and how?
- Is a watchOS companion part of the MVP? If yes, add a SwiftUI target to the plan whichever cross-platform stack is chosen.

## Sources

1. Flutter docs — Release notes (index) — https://docs.flutter.dev/release/release-notes — accessed 2026-10-02
2. Flutter docs — Flutter 3.47.0 release notes — https://docs.flutter.dev/release/release-notes/release-notes-3.47.0 — accessed 2026-10-02
3. Flutter blog — What's new in Flutter 3.47 (12 Aug 2026) — https://flutter.dev/blog/whats-new-in-flutter-3-47 — accessed 2026-10-02
4. Dart — SDK changelog (Dart 3.13, 12 Aug 2026) — https://dart.dev/changelog — accessed 2026-10-02
5. Flutter docs — Impeller rendering engine — https://docs.flutter.dev/perf/impeller — accessed 2026-10-02
6. Flutter docs — Writing and using fragment shaders — https://docs.flutter.dev/ui/design/graphics/fragment-shaders — accessed 2026-10-02
7. Flutter docs — FAQ — https://docs.flutter.dev/resources/faq — accessed 2026-10-02
8. Flutter docs — Web FAQ — https://docs.flutter.dev/platform-integration/web/faq — accessed 2026-10-02
9. Flutter docs — Writing custom platform-specific code (platform channels) — https://docs.flutter.dev/platform-integration/platform-channels — accessed 2026-10-02
10. pub.dev — pigeon 29.0.6 — https://pub.dev/packages/pigeon — accessed 2026-10-02
11. pub.dev — health 13.3.2 — https://pub.dev/packages/health — accessed 2026-10-02
12. pub.dev — health changelog — https://pub.dev/packages/health/changelog — accessed 2026-10-02
13. pub.dev — health API docs, HealthDataType enum — https://pub.dev/documentation/health/latest/health/HealthDataType.html — accessed 2026-10-02
14. pub.dev — health_kit_reporter 2.3.1 — https://pub.dev/packages/health_kit_reporter — accessed 2026-10-02
15. Apple Developer — enableBackgroundDelivery(for:frequency:withCompletion:) (JSON rendering) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:).json — accessed 2026-10-02
16. GitHub — kingstinct/react-native-healthkit — https://github.com/kingstinct/react-native-healthkit — accessed 2026-10-02
17. pub.dev — workmanager 0.10.10 — https://pub.dev/packages/workmanager — accessed 2026-10-02
18. pub.dev — rive 0.14.11 — https://pub.dev/packages/rive — accessed 2026-10-02
19. Rive — Pricing — https://rive.app/pricing — accessed 2026-10-02
20. pub.dev — lottie 3.6.1 — https://pub.dev/packages/lottie — accessed 2026-10-02
21. pub.dev — flutter_animate 4.5.2 — https://pub.dev/packages/flutter_animate — accessed 2026-10-02
22. pub.dev — flame 1.38.2 — https://pub.dev/packages/flame — accessed 2026-10-02
23. pub.dev — drift 2.35.1 — https://pub.dev/packages/drift — accessed 2026-10-02
24. Drift docs — Encryption — https://drift.simonbinder.eu/platforms/encryption/ — accessed 2026-10-02
25. pub.dev — powersync 2.4.0 — https://pub.dev/packages/powersync — accessed 2026-10-02
26. PowerSync — Pricing — https://www.powersync.com/pricing — accessed 2026-10-02
27. PowerSync — Documentation index (llms.txt) — https://docs.powersync.com/llms.txt — accessed 2026-10-02
28. pub.dev — electricsql 0.8.2 (discontinued) — https://pub.dev/packages/electricsql — accessed 2026-10-02
29. pub.dev — libsql_dart — https://pub.dev/packages/libsql_dart — accessed 2026-10-02
30. Automerge — Docs, "Hello" — https://automerge.org/docs/hello/ — accessed 2026-10-02
31. pub.dev — flutter_secure_storage 11.2.0 — https://pub.dev/packages/flutter_secure_storage — accessed 2026-10-02
32. pub.dev — cryptography 2.9.0 — https://pub.dev/packages/cryptography — accessed 2026-10-02
33. pub.dev — sd_jwt 1.0.1 — https://pub.dev/packages/sd_jwt — accessed 2026-10-02
34. Mopro — Introduction — https://zkmopro.org/docs/intro — accessed 2026-10-02
35. Mopro — Flutter setup — https://zkmopro.org/docs/setup/flutter-setup — accessed 2026-10-02
36. pub.dev — flutter_rust_bridge 2.13.0 — https://pub.dev/packages/flutter_rust_bridge — accessed 2026-10-02
37. Midnight Docs — Midnight API reference (SDK overview) — https://docs.midnight.network/develop/reference/midnight-api — accessed 2026-10-02
38. pub.dev — flutter_js 0.8.7 — https://pub.dev/packages/flutter_js — accessed 2026-10-02
39. pub.dev — serverpod 4.0.3 — https://pub.dev/packages/serverpod — accessed 2026-10-02
40. pub.dev — serverpod license tab (SSPL-1.0) — https://pub.dev/packages/serverpod/license — accessed 2026-10-02
41. GitHub — serverpod/serverpod root LICENSE (BSD-3-Clause) — https://github.com/serverpod/serverpod/blob/main/LICENSE — accessed 2026-10-02
42. GitHub — serverpod/serverpod packages/serverpod/LICENSE (SSPL) — https://github.com/serverpod/serverpod/blob/main/packages/serverpod/LICENSE — accessed 2026-10-02
43. Serverpod docs — Overview — https://docs.serverpod.dev/ — accessed 2026-10-02
44. Serverpod blog — Serverpod 4 (14 Sep 2026) — https://serverpod.dev/blog/serverpod-4 — accessed 2026-10-02
45. Serverpod blog — index — https://serverpod.dev/blog — accessed 2026-10-02
46. Serverpod Cloud — Pricing — https://serverpod.dev/cloud — accessed 2026-10-02
47. Shorebird — Pricing — https://shorebird.dev/pricing — accessed 2026-10-02
48. Shorebird docs — Code push FAQ — https://docs.shorebird.dev/code-push/faq/ — accessed 2026-10-02
49. Codemagic — Pricing — https://codemagic.io/pricing/ — accessed 2026-10-02
50. pub.dev — patrol 4.10.0 — https://pub.dev/packages/patrol — accessed 2026-10-02
51. Flutter docs — Dart and Flutter MCP server — https://docs.flutter.dev/ai/mcp-server — accessed 2026-10-02
52. Stack Overflow — 2025 Developer Survey, Technology — https://survey.stackoverflow.co/2025/technology — accessed 2026-10-02
53. Flutter — Showcase — https://flutter.dev/showcase — accessed 2026-10-02
54. Flutter — Tonal case study — https://flutter.dev/showcase/tonal — accessed 2026-10-02
55. Flutter — Headspace case study — https://flutter.dev/showcase/headspace — accessed 2026-10-02
56. pub.dev — jaspr 0.23.5 — https://pub.dev/packages/jaspr — accessed 2026-10-02
57. Supabase — Pricing — https://supabase.com/pricing — accessed 2026-10-02
58. Supabase docs — Available regions — https://supabase.com/docs/guides/platform/regions — accessed 2026-10-02
59. pub.dev — supabase_flutter 2.18.0 — https://pub.dev/packages/supabase_flutter — accessed 2026-10-02
60. Google Cloud — Cloud Run pricing — https://cloud.google.com/run/pricing — accessed 2026-10-02
61. Dart blog — An update on Dart macros & data serialization (29 Jan 2025) — https://dart.dev/blog/an-update-on-dart-macros-data-serialization — accessed 2026-10-02
62. GitHub — join-the-flock/flock (community fork of Flutter) — https://github.com/join-the-flock/flock — accessed 2026-10-02
63. Dart API — num.round — https://api.dart.dev/stable/dart-core/num/round.html — accessed 2026-10-02
64. MDN — Math.round() — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round — accessed 2026-10-02
65. Hetzner — Cloud (locations; prices not rendered on fetch) — https://www.hetzner.com/cloud/ — accessed 2026-10-02

Internal documents used for context (not re-researched): `docs/05-architecture.md`, `docs/research/wearable-integrations.md`, `docs/research/midnight-zk.md`, `docs/research/regulatory.md`, `docs/research/competitors.md`, and the source of `packages/core` (line and test counts measured on 2026-10-02).
