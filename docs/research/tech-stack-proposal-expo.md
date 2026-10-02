# The Case for Expo / React Native + a TypeScript Backend for MINMAX

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

> **Method note.** This session's web-search budget was already used up when the research started, so no new WebSearch queries could run (the brief asked for at least six). To compensate, every claim below comes from a direct fetch of a primary page (official docs, changelogs, pricing pages, GitHub READMEs), from npm registry metadata, or from my own reading of published package source (`@kingstinct/react-native-healthkit` 16.0.0 and `react-native-health-connect` 4.1.3 tarballs). Anything I could not open myself is marked **unverified**. Facts carried over from the earlier MINMAX reports are cited to those files.

## Summary for the founder

- **Verdict: Expo is the strongest fit for MINMAX, because the rules engine already exists in TypeScript.** `@minmax/core` is about 4.8k lines of non-test TypeScript with about 109 test cases (my count today). On Expo it runs unchanged on the phone, on the server and in the web claim verifier. That gives one version of the rules everywhere, which is non-negotiable #2 in `05-architecture.md`. Every other stack must either port the engine and keep a conformance suite in step with it, or embed a JS engine. (confidence: high)
- **Health-data access is good, but parts of it have to be native code.** HealthKit and Health Connect both have actively maintained libraries with Expo config plugins: `@kingstinct/react-native-healthkit` 16.0.0 (published 2026-09-18) and `react-native-health-connect` 4.1.3 (2026-08-06) [5][6][8][9]. However, Apple requires observer queries to be registered in `didFinishLaunchingWithOptions`. HealthKit also stops background delivery after three missed completion handlers [11]. Neither library records live workouts on the phone (`HKWorkoutSession`) [8]. **Plan on two small native Expo modules, one in Swift and one in Kotlin.** (confidence: high)
- **The dark, cinematic look is achievable, but it has not been measured on mid-range Android.** React Native Skia 2.14 handles shaders and particles, Reanimated 4.7 runs animations on the UI thread at "up to 120 fps", and the new Rive runtime (built on Nitro, supports data binding) can drive a living character sheet [16][17][18]. The costs: Skia adds about 6 MB to the iOS app and 4 MB to the Android app, Graphite/WebGPU is still experimental, and the new Rive runtime is version 0.5.1 with feature gaps [16][17]. I found no published 60 fps benchmark on a mid-range Android phone, so a spike has to settle this. (confidence: medium)
- **Local-first storage is well covered.** expo-sqlite supports SQLCipher encryption, session changesets, Drizzle and libSQL sync. op-sqlite and PowerSync are mature alternatives [19][21][22]. Automerge and every other WebAssembly-based CRDT are ruled out on the phone, because Hermes has no WebAssembly [27][28]. Because MINMAX measurements are immutable facts, a custom append-only sync is enough for v1. (confidence: high)
- **On-device zero-knowledge proofs are this stack's weakest point.** Noir JS, snarkjs, Automerge and Midnight's JS SDK all depend on WebAssembly. On a phone running React Native that means native Rust bindings through Mopro/UniFFI, which is exactly the work a native or Flutter app would need. Midnight's TypeScript SDK only helps on the server and the web. Correction to `midnight-zk.md`: Mopro's "iOS" Noir benchmarks ran on an M3 MacBook Air, not an iPhone. The real Android figures on a Pixel 6 are 1.3–8.2 s [23][24][25][26]. (confidence: high)
- **The stack suits a solo founder.** TypeScript became the most-used language on GitHub in August 2025. GitHub cites a study finding that 94% of compile errors in LLM-generated code are type-check failures [33]. EAS bundles builds, store submission, over-the-air (OTA) updates and Maestro end-to-end tests in CI, starting at $0 or $19 a month [20][31]. OTA updates may only ship fixes and content. Apple guideline 2.5.2 forbids downloading code that "introduces or changes features" [15]. (confidence: high)
- **Proposed backend:** Node 22 with Hono, Postgres via Drizzle (Supabase in Zurich or Frankfurt), Better Auth, an Ed25519 claim key in AWS KMS (EU region) and Expo Push. My estimated cost is about $45–65/month at 1k users, $200–250 at 10k and $1.2–1.5k at 100k, before any wearable aggregator. The biggest line items at scale are Expo services and RevenueCat, not compute (see the cost table). (confidence: medium, my estimate)
- **Web:** the same TypeScript renders the claim verification page on the server, which needs no React Native at all. Expo Router's static export can serve the landing page and a light dashboard. Web support is second-class for Skia (2.9 MB CanvasKit download) and for expo-sqlite (alpha) [16][19][30]. (confidence: medium)
- **Few health apps prove this stack at scale.** Expo's case studies include Callie, a mental-health app built by a one-person mobile team (3.2k App Store reviews, 4.9 average), and Fieldy, an AI wearable app that wrote its Bluetooth and background layer natively through Expo Modules [37][38]. I could not verify any large wearable-data brand running on React Native. WHOOP's engineering blog describes native iOS and Android stacks [40]. (confidence: medium)
- **Gate the decision with a two-week spike** on four things: core tests under Hermes, HealthKit background delivery on a real device, the Health Connect background worker, and one Skia/Rive scene at 60 fps on a mid-range Android phone. If any of the four fails, reopen the stack decision.

## Findings

### 1. Platform state on 2026-10-02

- **React Native** has run only on the New Architecture since 0.82 (2025-10-08). Version 0.84 (2026-02-11) made Hermes V1 the default and removed the Legacy Architecture on both platforms. Version 0.87 (2026-08-11) made the strict TypeScript API the default and added experimental Swift Package Manager support. The latest npm release is 0.87.1 [2][4]. (confidence: high)
- **Expo** shipped SDK 56 on 2026-05-21 and SDK 57 on 2026-06-30 (React Native 0.86, React 19.2). SDK 57 bundles Reanimated 4.5 and react-native-worklets 0.10 [1][3]. The SDK 58 beta (2026-09-15) targets React Native 0.88 RC and iOS 27, and lists Expo Router data loaders, SSR and middleware as stable. The beta "will last three to four weeks", so stable SDK 58 should arrive around mid-October 2026 [1][3a]. Expo packages now carry the SDK number as their version (`expo` 57.0.26, `expo-sqlite` 57.0.3) [4]. (confidence: high)
- **Consequence:** the stack is current and moving fast. Three SDK releases in about four months (May, June, September beta) is a real upgrade treadmill for one person (see "Where it hurts").

### 2. Health-data access

**iOS / HealthKit.** `@kingstinct/react-native-healthkit` 16.0.0 has 715 GitHub stars and an MIT licence. It is built on Nitro Modules, peer-depends on React Native ≥0.79 and react-native-nitro-modules ≥0.35, ships an Expo config plugin whose `"background": true` option adds the background-delivery entitlement, and does not work in Expo Go (a development build is required) [5][6][8]. Its README table lists query, save and subscribe for 100+ quantity types, 63 category types and 75+ workout types. Clinical records (FHIR) live in a separate package [6]. In the published source I found `enableBackgroundDelivery`, `disableBackgroundDelivery`, `subscribeToChanges`, `saveWorkoutSample`, `saveWorkoutRoute` and `startWatchAppWithWorkoutConfiguration`. I found **no** `HKWorkoutSession` or `HKLiveWorkoutBuilder` API for recording a workout on the iPhone itself [8]. Apple makes `HKWorkoutSession` and `HKLiveWorkoutBuilder` available on iOS 17+, but notes that "Collecting heart rate data on iPhone or iPad requires pairing with an external heart rate sensor" [13]. The older `react-native-health` has had no release since 2024-10-15, so it should not be used [4]. (confidence: high)

**Background delivery is where React Native has to defer to native code.** Apple: "set up all your observer queries in your app delegate's `application(_:didFinishLaunchingWithOptions:)` method". In addition, "If your app fails to respond three times, HealthKit assumes your app can't receive data and stops sending background updates" [11]. A JS subscription registered once the React tree mounts runs later than that native launch hook. The robust pattern is an Expo module with an `ExpoAppDelegateSubscriber`. Expo documents `didFinishLaunchingWithOptions` as a subscribable method [44]. That module would register observer queries natively, run anchored queries, write rows to SQLite and call the completion handler. JS then processes the rows on the next foreground or background task. The Expo Modules API is Swift/Kotlin with "similar performance characteristics" to TurboModules via JSI [43]. Fieldy's Expo case study describes the same split for its wearable: a native Swift/Kotlin Bluetooth layer, because a JS layer is killed by "the OS ... to save battery" [38]. (confidence: high for the Apple requirement; medium for the claim that JS-only subscription is unreliable, which needs a device test)

**Android / Health Connect.** `react-native-health-connect` 4.1.3 has 416 stars, an Expo plugin built in "as of v4", and supports "both old and new architecture" [9]. Its source exposes `BackgroundAccessPermission` (mapped to `PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND`), `ReadHealthDataHistory` (mapped to `PERMISSION_READ_HEALTH_DATA_HISTORY`), `getChanges` with change tokens and `insertRecords`, including `ExerciseSession` records [10]. It does **not** schedule background work itself. Android's own docs recommend a `WorkManager` worker after checking `FEATURE_READ_HEALTH_DATA_IN_BACKGROUND`. They also confirm the 30-day default history limit and the history permission [14]. From JS, `expo-background-task` uses WorkManager on Android ("minimum 15 minutes") and BGTaskScheduler on iOS. Tasks run only with enough battery and an available network, timing is up to the system, and tasks stop when the user kills the app [12]. A small native Kotlin worker that writes into the same SQLite file is more predictable. (confidence: high)

**Vendor APIs (Oura, Polar, WHOOP, Withings) stay on the server, behind webhooks.** None of them are client-framework concerns. A TypeScript backend can reuse `@minmax/core`'s `withProvenance()` to turn vendor payloads into `Measurement` rows, so trust mapping lives in one place. Garmin cloud access is closed to new developers and Fitbit's Web API shuts down on 2026-10-30 (`wearable-integrations.md`). (confidence: high)

### 3. Premium cinematic UI

| Need | Library (version on npm, 2026-10-02) | What the primary source says |
|---|---|---|
| Shaders, particles, blur, custom drawing | `@shopify/react-native-skia` 2.14.0 | Requires RN ≥0.79, React ≥19, Reanimated ≥4 with worklets ≥0.7; adds "6 MB" on iOS, "4 MB" on Android, "2.9 MB" on web; Graphite (Dawn/WebGPU) backend experimental on `@next` [16] |
| 60/120 fps UI-thread motion, gestures | `react-native-reanimated` 4.7.0 / `react-native-worklets` 0.13.0 (SDK 57 pins 4.5 / 0.10) | Animations "run natively on the UI thread by default ... up to 120 fps and beyond" [17][3] |
| Rigged, state-driven character art | `@rive-app/react-native` 0.5.1 (new, Nitro) / `rive-react-native` 9.8.5 (legacy) | New runtime requires Nitro, supports Expo SDK 53+, iOS 15.1+, Android SDK 24+, supports data binding; the docs recommend it but say feature support is still incomplete compared with legacy [18] |
| Designer-made micro-animations | `lottie-react-native` 7.5.0 | Version from npm [4]; capabilities not re-checked |
| Custom GPU compute/shaders beyond Skia | `react-native-wgpu` 0.5.17 | Pre-1.0; zero-copy interop with Skia Graphite [16] |

Impeller is Flutter's renderer and does not apply here. React Native draws platform views, plus Skia canvases where needed. For MINMAX the combination fits well. Rive can bind the character's seven stats to a rig, Skia can render region backdrops and particle effects (embers in The Forge, mist in the Sanctum), and Reanimated can drive the transition between Game Mode and Simple Mode. Custom fonts and a dark theme are routine (`expo-font`, design tokens). **What is unverified:** sustained 60 fps for a full-screen Skia and Rive scene on a mid-range Android device. I found no primary benchmark. (confidence: medium)

### 4. Local-first, privacy and sync

- **expo-sqlite 57.0.3:** SQLCipher via the `useSQLCipher` config option (not available in Expo Go), then `PRAGMA key`. It also offers `SQLiteSession` changesets, official Drizzle support, libSQL with `syncLibSQL()`, and a SQLite-backed key-value store. On web, "Web support is in alpha and may be unstable" and requires COOP/COEP headers [19]. (confidence: high)
- **op-sqlite 18.2.5:** SQLCipher, libSQL and Turso as compilation targets, reactive queries, sqlite-vec, 1.0k stars, MIT [21]. PowerSync's React Native SDK (2.3.1) uses it and "places every write ... in an upload queue and uploads the queue to your backend", so your server stays authoritative [22]. PowerSync Cloud Pro costs from $49/month with 1,000 peak concurrent clients included, then $30 per 1,000. The Open Edition is free to self-host and supports Postgres [23a]. Whether PowerSync works with a SQLCipher build of op-sqlite is **unverified**.
- **ElectricSQL** (`@electric-sql/client` 1.5.28) still shows a "status-beta" badge [4]. Turso's React Native sync binding is at 0.8.1 [4]. Both are pre-1.0 for this use.
- **Automerge** 3.5.0 is "backed by @automerge/automerge-wasm" [4]. Hermes does not list WebAssembly as supported, and the request for it (facebook/hermes#429) has been open since 2020-12-04 [27][28]. CRDT documents are also the wrong model for MINMAX: measurements are immutable facts, and `05-architecture.md` already specifies last-writer-wins per measurement id with tombstones.
- **Keys:** `expo-secure-store` 57.0.4 (Keychain/Keystore) holds the SQLCipher key and the payload-encryption key for end-to-end encrypted sync [4].
- **Recommendation:** use expo-sqlite with SQLCipher and Drizzle on the device, plus a custom outbox/inbox sync of encrypted measurement payloads over HTTPS. Switch to PowerSync (self-hosted Open Edition, so data stays in the EU) only if multi-device editing becomes a requirement. (confidence: medium)

### 5. Future on-device zero-knowledge proofs

| Tool | State on this stack | Source |
|---|---|---|
| Noir JS (`@noir-lang/noir_js` 1.0.0-rc.3) | Depends on `@noir-lang/acvm_js` and `noirc_abi` (WebAssembly builds); usable in a browser verifier and in Node, not inside Hermes | [4][27][28] |
| snarkjs 0.7.6 | JS/WebAssembly; Mopro measured native witness generation 19–25× faster than snarkjs for RSA | [4][26] |
| Mopro (Rust → Swift/Kotlin/React Native/Flutter via UniFFI) | Supports Circom, Halo2 and Noir; React Native setup documented at v0.3; official Expo sample proves a Circom `multiplier2` circuit (6 stars) | [24][23][25] |
| Mopro Noir benchmarks | "iOS" figures (Keccak 349 ms, Semaphore 828 ms, Anon Aadhaar 2,225 ms) were measured on a **MacBook Air M3 running the iPad app**, not an iPhone; Pixel 6: 1,303 / 3,990 / 8,179 ms | [26] |
| Midnight JS SDK (`midnight-js-contracts` 4.1.1, `compact-runtime` 0.20.0) | TypeScript, but proving runs in a Docker proof server and mobile was unsupported at launch (see `midnight-zk.md`) | [4], midnight-zk.md |
| BBS (`@mattrglobal/bbs-signatures`) | Last release 2.0.0 on 2024-09-19; no `@mattrglobal/react-native-bbs-signatures` package exists on npm | [4] |
| Pure-JS curves (`@noble/curves` 2.4.0, `@noble/ed25519` 3.2.0) | Run in Hermes, which makes local Ed25519 claim verification and signature checks easy; BLS pairing speed in Hermes is **unverified** | [4] |

**Bottom line:** if ZK proofs move onto the phone, they will be a native Rust module wrapped as an Expo module. The work is about the same as on native or Flutter, so neither side gains here. Expo DOM components run web code in a WebView [29]. In principle that could host a WebAssembly prover (my inference, untested). The docs warn that this code is "slower to parse and start up than optimized Hermes bytecode" and that props cross an asynchronous bridge [29]. The TypeScript advantage is real **on the server and on the web verification page**, where Noir JS, the Midnight SDK and `@minmax/core` all run in Node or the browser. (confidence: high)

### 6. Solo-founder velocity, hiring, AI coding, OTA, CI/CD, testing

- **TypeScript everywhere:** GitHub Octoverse 2025 reports that TypeScript became the most-used language on GitHub in August 2025, adding over 1 million contributors (+66% year over year). It attributes the rise partly to "agent-assisted coding" and cites a finding that "94% of LLM-generated compilation errors were type-check failures" [33]. For a solo founder who codes with AI assistance, one strictly typed language across engine, app, server and web is the biggest productivity lever. (confidence: high)
- **Hiring pool:** in the 2024 Stack Overflow survey, React Native was used by 8.4% of all respondents and Flutter by 9.4% ("other frameworks and libraries") [34]. React Native is not ahead on that measure, but React and TypeScript web developers can ramp up quickly. I found no React Native/Flutter row in the 2025 survey [35]. (confidence: medium)
- **EAS pricing [20]:**

| Plan | Price | Builds | OTA update MAUs included | Overage per MAU |
|---|---|---|---|---|
| Free | $0 | 15 Android + 15 iOS | 1,000, hard cap | n/a |
| Starter | $19/mo | $45 build credit | 3,000 | $0.005 |
| Production | $199/mo | $225 build credit | 50,000 | $0.005 |

- **CI/CD:** EAS Workflows automates builds, submissions and updates and can "Run E2E tests with Maestro as part of CI" [31]. The existing GitHub Actions job (lint, typecheck, Vitest) keeps testing `@minmax/core` unchanged. React Native 0.85 moved the Jest preset into its own package [2].
- **OTA rules:** App Review Guideline 2.5.2 (last updated 2026-06-08) bars apps from downloading code that "introduces or changes features or functionality" [15]. Expo's FAQ adds that native code, permissions and SDK version changes need a new binary [32]. OTA updates are for bug fixes and copy. Norm tables and quest templates already come from the content service.
- **App integrity:** `@expo/app-integrity` 57.0.2 wraps App Attest and Play Integrity (standard requests), which the claim threat model needs. It is "currently in alpha and will frequently experience breaking changes" [45]. (confidence: high)
- **Auth on the device:** `@better-auth/expo` stores sessions in SecureStore and supports Apple and Google ID-token sign-in [47].
- **Watch and widgets:** `@bacons/apple-targets` 5.0.0 generates Swift/SwiftUI targets (widgets, Live Activities, App Clips, watch-face complications) outside `/ios` [42][4]. A full watchOS app target is not listed explicitly (**unverified**). Either way, an Apple Watch app is SwiftUI on every stack.

### 7. Web: landing page, dashboard, claim verification

- **Claim verification page (`/v/<claim-id>`):** render it on the server in the Hono API, using `@minmax/core`'s canonical payload and verify functions plus `@noble/ed25519`. It needs no client JS, which keeps it fast, easy to audit and unaffected by app releases. This reuses the engine without any React Native. (confidence: high)
- **Landing page and dashboard:** Expo Router's `web.output: "static"` generates one HTML file per route, with `generateStaticParams` for dynamic routes. "Rendering at request-time is not supported" in static mode [30]. API routes deploy to EAS Hosting, or through adapters (Bun, Express, Netlify, Vercel) that are "subject to breaking changes" [30a]. A dashboard can share components, tokens and `@minmax/core` with the app. Skia on web loads CanvasKit (+2.9 MB) and expo-sqlite on web is alpha [16][19]. (confidence: medium)

### 8. Production health apps on this stack

- **Callie** (Expo): a self-care app for eating-disorder recovery. One founding mobile engineer, "Most Creative App at the 2025 Expo App Awards", 3.2k+ App Store reviews averaging 4.9+. EAS Build ships to both stores "from a single command". It is not a wearable-data app [37].
- **Fieldy** (Expo): an AI wearable (Bluetooth device plus app). Its Bluetooth and background layers are written natively in Swift/Kotlin through Expo Modules, with AppDelegate subscribers [38].
- **Lifeline** by Kingstinct, the maintainer of the HealthKit library: "insights on the correlations between your health and lifestyle habits" [39]. Whether it ships the library in production is **unverified**.
- **Counter-evidence:** the official React Native showcase lists no health, fitness or wearable apps [36]. WHOOP's engineering blog covers native iOS and Android work (for example "WHOOP vs. Android Wake Locks", 2026-03-12) [40]. I could not confirm that Oura, Garmin, Bevel or Function Health use React Native: **unverified**. (confidence: medium)

## Why this stack fits MINMAX

1. **The engine moves with you.** `@minmax/core` was written as pure TypeScript with injected clock, ids, signer and norms (`05-architecture.md`). On Expo the same build runs in Hermes on the phone, in Node for webhook ingest and claim signing, and in the browser or SSR for verification. A claim the phone checks with `checkPredicate()` is verified by the same code on the server. On any other stack, that guarantee becomes a conformance test suite you have to maintain. The engine does no I/O and no crypto, and it uses only ES2022 plus `toLocaleString("en-US")` in `modes/vocabulary.ts`. Running its tests under Hermes should be the first task of the spike.
2. **One language for a solo founder working with AI tools.** That covers engine, app, API, web, content schemas (zod) and infrastructure scripts. React Native 0.87 made the strict TypeScript API the default [2], and Octoverse documents the effect of typed code on AI-generated code quality [33].
3. **Native code is available exactly where MINMAX needs it.** HealthKit launch hooks, Health Connect workers, workout sessions and a future Rust prover are each roughly a few hundred lines of Swift or Kotlin (my estimate) inside Expo Modules. They run at JSI speed and are first-class in Expo [43][44]. The other 90% of the app (screens, Game Mode, Simple Mode, onboarding, quests) stays shared.
4. **A good premium-UI toolkit is available today**: Skia, Reanimated 4, Rive with data binding and Lottie, all compatible with Expo [16][17][18].
5. **Shipping infrastructure a solo founder could not build alone.** That includes cloud builds for iOS from any machine, store submission, OTA fixes, Maestro end-to-end tests in CI, a free push service (600 notifications per second per project, contents not stored) [20][31][46], and App Attest / Play Integrity through one module [45]. Subscriptions can run through RevenueCat (`react-native-purchases` 10.11.0), which is free up to $2,500 in monthly tracked revenue [48][4].
6. **The backend and the later Midnight work stay in the same language.** Midnight's SDK is TypeScript, so any Phase 3 anchoring can happen server-side in the same codebase. Better Auth runs in your own process and your own EU database [47].

## Where it hurts (be brutal)

1. **"One codebase" really means TypeScript plus two native modules you own.** HealthKit background delivery has to be wired in `didFinishLaunchingWithOptions` and acknowledged reliably. Three misses and iOS stops waking the app [11]. Health Connect background reads need a WorkManager worker [14]. Live workout recording on the phone needs `HKWorkoutSession`, which the HealthKit library does not expose [8][13]. These modules are the heart of the data pipeline, and you will debug them in Xcode and Android Studio. If you cannot or will not touch Swift or Kotlin, budget for a freelancer.
2. **Critical libraries each depend on a single maintainer.** The HealthKit library has 715 stars and is maintained by one consultancy. The Health Connect library has 416 stars. The best-known alternative (`react-native-health`) has been dormant since 2024 [5][9][4]. If either library is abandoned, you inherit it. Native Swift/Kotlin stacks call Apple's and Google's SDKs directly and carry no such risk.
3. **Upgrade treadmill.** React Native went from 0.82 to 0.87 in ten months, with breaking changes in 0.84 and 0.85. Expo shipped SDK 56, SDK 57 and the SDK 58 beta between May and September 2026 [1][2]. Nitro-based libraries (HealthKit, Rive) add their own peer constraints [8][18]. Expect a few days of upgrade work several times a year.
4. **On-device ZK gets no benefit from TypeScript.** Hermes has no WebAssembly, so every TypeScript or WebAssembly prover is out of reach on the phone [27][28]. The React Native Mopro path has a six-star sample that proves only a Circom toy circuit [25]. The midnight-zk report's "0.3–2.2 s on iPhone" figures actually come from a Mac; on a Pixel 6, a Noir Semaphore proof takes 4.0 s [26].
5. **Cinematic is not the same as a game engine.** Skia and Reanimated are excellent for UI motion and 2D effects, but complex scenes run through React reconciliation and a single JS thread unless you keep them in worklets. I found no published mid-range Android benchmark. Skia adds 4–6 MB to the binary [16]. The new Rive runtime is version 0.5.1 with acknowledged feature gaps [18]. If "Game Mode" grows into a real-time 3D world, this stack is the wrong tool.
6. **Web is a passenger, not a driver.** expo-sqlite on web is alpha, Skia on web downloads 2.9 MB, Expo Router's third-party server adapters carry no stability guarantee, and static output cannot render per request [19][16][30][30a]. A polished marketing site is easier in a plain web framework. The proposal therefore keeps the verification page server-rendered and treats the dashboard as nice-to-have.
7. **Expo's bills grow with success.** At 100k monthly update users on the Production plan, EAS Update alone costs $199 + 50,000 × $0.005 = $449/month [20]. Self-hosting an update server is possible in principle, but I did not verify it in this session (**unverified**).
8. **Few proof points in this category.** The React Native showcase contains no health apps, and the category leader whose stack I could check (WHOOP) is native [36][40]. Investors and hires may ask about this. The honest answer is Callie, Fieldy and the "shared engine" argument.
9. **Platform policy limits OTA.** Guideline 2.5.2 forbids shipping new features over the air [15]. OTA saves you from a broken release, but it does not let you skip app review for new features.
10. **The App Attest / Play Integrity wrapper is alpha** [45]. Claims rely on it, so pin its version and keep a fallback (server-side vendor ingestion as the witness, as `05-architecture.md` already plans).

## Concrete architecture

### Diagram

```
┌──────────────────────────── phone (Expo SDK 57→58, RN 0.86→0.88, Hermes V1) ─────────────────────────────┐
│                                                                                                          │
│  Native layer (Expo Modules, owned code)            JS/TS layer (shared iOS+Android)                     │
│  ┌──────────────────────────────┐                   ┌──────────────────────────────────────────────────┐ │
│  │ minmax-health-ios (Swift)    │  rows ──────────▶ │ ingest/: HealthKit + HC readers via kingstinct /  │ │
│  │ · AppDelegate subscriber     │                   │   rn-health-connect → withProvenance()           │ │
│  │ · HKObserverQuery + anchors  │                   │ store/: expo-sqlite + SQLCipher + Drizzle        │ │
│  │ · completion handler always  │                   │ engine/: @minmax/core (pure TS)                  │ │
│  │ · HKWorkoutSession recorder  │                   │   resolve → stats → character → quests → claims  │ │
│  ├──────────────────────────────┤                   │ sync/: outbox/inbox, E2E-encrypted payloads      │ │
│  │ minmax-health-android(Kotlin)│  rows ──────────▶ │ ui/game: Skia scenes · Rive character · Reanim.  │ │
│  │ · WorkManager worker (1 h)   │                   │ ui/simple: plain RN "3 goals this week"          │ │
│  │ · HC changes tokens          │                   └──────────────────────────────────────────────────┘ │
│  │ · ExerciseSession writer     │                   expo-secure-store (keys) · @expo/app-integrity       │
│  ├──────────────────────────────┤                   react-native-purchases · expo-notifications          │
│  │ (later) minmax-zk (Rust via  │                                                                        │
│  │  Mopro/UniFFI)               │                                                                        │
│  └──────────────────────────────┘                                                                        │
└───────────────┬──────────────────────────────────────────────────────────────────────────────────────────┘
                │ HTTPS: auth · encrypted sync · claim requests (+ App Attest / Play Integrity token)
                ▼
┌──────────────────────────── EU: Fly.io fra (or Hetzner DE) ────────────────────────────┐
│  api (Node 22 + Hono)                                                                   │
│  · Better Auth (Apple/Google ID token, magic link)  · RevenueCat webhooks → entitlement │
│  · /sync inbox/outbox (opaque encrypted blobs)       · /content norm tables + templates │
│  · /webhooks/oura|polar|whoop → withProvenance()    · /v/:claimId  server-rendered HTML │
│  · claim signer: @minmax/core issueClaim() with KMS Signer (Ed25519, eu-central-1/2)    │
│  · push via Expo Push (no health values in payloads)                                    │
└───────────────┬─────────────────────────────────────────────────────────────────────────┘
                ▼
   Postgres (Supabase eu-central-2 Zurich or eu-central-1 Frankfurt) · AWS KMS (EU)
```

### Folder layout (fits the existing pnpm workspace `packages/*`, `apps/*`)

```
minmax/
├─ packages/
│  ├─ core/                 @minmax/core (exists): engine, unchanged
│  ├─ content/              norm tables + quest templates as versioned JSON, zod-validated
│  ├─ contract/             zod schemas for API requests/responses (shared by app + api)
│  └─ tokens/               colours, type scale, motion curves (shared by mobile + web)
├─ apps/
│  ├─ mobile/               Expo app (expo-router)
│  │  ├─ app/               routes: (onboarding)/, (game)/, (simple)/, settings/, claim/
│  │  ├─ src/ingest/        healthkit.ts, health-connect.ts, manual.ts, lab-import.ts
│  │  ├─ src/store/         db.ts (SQLCipher open/key), schema.ts (Drizzle), repos/
│  │  ├─ src/sync/          outbox.ts, inbox.ts, crypto.ts
│  │  ├─ src/engine/        assemble.ts (calls core with now/idFactory/norms/state)
│  │  ├─ src/ui/game/       skia/, rive/, regions/ (Forge, Engine, Temple ...)
│  │  ├─ src/ui/simple/
│  │  ├─ modules/minmax-health-ios/      Expo module (Swift)
│  │  ├─ modules/minmax-health-android/  Expo module (Kotlin)
│  │  ├─ targets/            (later) widgets / watch via @bacons/apple-targets
│  │  └─ e2e/                Maestro flows
│  └─ api/                  Hono server
│     ├─ src/routes/         auth, sync, claims, verify, content, webhooks/
│     ├─ src/signing/        kms-signer.ts (implements core's Signer)
│     ├─ src/db/             Drizzle schema + migrations
│     └─ test/               Vitest
└─ .github/workflows/ci.yml  lint · typecheck · test · build (+ EAS Workflows for app)
```

### Key libraries (latest on npm, 2026-10-02 [4]; install mobile packages via `npx expo install` so they match the SDK pins)

| Concern | Package | Version |
|---|---|---|
| Framework | `expo` / `expo-router` | 57.0.26 / 57.0.24 (SDK 58 stable expected around mid-October) |
| Runtime | `react-native` | 0.86 via SDK 57 (latest 0.87.1) |
| HealthKit | `@kingstinct/react-native-healthkit` + `react-native-nitro-modules` | 16.0.0 + 0.37.1 |
| Health Connect | `react-native-health-connect` | 4.1.3 |
| Background JS | `expo-background-task` | 57.0.21 |
| Local DB | `expo-sqlite` (SQLCipher) + `drizzle-orm` | 57.0.3 + 0.45.3 |
| Alt. local DB / sync | `@op-engineering/op-sqlite` / `@powersync/react-native` | 18.2.5 / 2.3.1 |
| Secrets | `expo-secure-store` | 57.0.4 |
| Graphics | `@shopify/react-native-skia` | 2.14.0 |
| Animation | `react-native-reanimated` / `react-native-worklets` | 4.7.0 / 0.13.0 (SDK 57 pins 4.5 / 0.10) |
| Character art | `@rive-app/react-native` (fallback `rive-react-native`) | 0.5.1 (9.8.5) |
| Micro-animations | `lottie-react-native` | 7.5.0 |
| Integrity | `@expo/app-integrity` | 57.0.2 (alpha) |
| Subscriptions | `react-native-purchases` | 10.11.0 |
| Crypto (verify) | `@noble/ed25519` / `@noble/curves` | 3.2.0 / 2.4.0 |
| Data fetching / validation | `@tanstack/react-query` / `zod` | 5.104.1 / 4.6.5 |
| Crash reporting | `@sentry/react-native` | 8.29.0 (scrub health values; EU hosting unverified) |
| Server | `hono` + `@hono/node-server`, `better-auth`, `drizzle-orm` | 4.13.12 + 2.1.3, 1.7.7, 0.45.3 |

## Backend proposal

- **Language and runtime:** TypeScript on Node 22, the version already required by the monorepo and by React Native 0.84+ [2].
- **Framework:** Hono. It is small, built on Web standards, and portable if hosting changes. Fastify 5.12.5 is the conservative alternative [4].
- **Database:** Postgres through Drizzle, sharing schema style with the device. Hosting: Supabase in **Zurich (`eu-central-2`)** or **Frankfurt (`eu-central-1`)** [50]. Pro costs $25/month and includes 8 GB of database, 250 GB egress and $10 of compute credit. Extra storage is $0.125/GB [49]. Compute sizes run from Micro (~$10) through Medium (~$60) and Large (~$110) to XL (~$210) a month [51]. Neon's Launch plan ($0.106 per compute-unit hour, $0.35 per GB-month) is a fallback; its EU region was not confirmed on the pricing page [52]. If US-company exposure is a concern for health data, self-hosted Postgres on Hetzner in Germany or Finland is an option. Hetzner's prices did not render on its page, so they are **unverified** [55].
- **Auth:** Better Auth inside the API (sessions in your own Postgres; Apple/Google ID-token sign-in; Expo integration) [47]. No passwords, matching `05-architecture.md`.
- **Claim signing:** an AWS KMS `ECC_NIST_EDWARDS25519` key using `ED25519_SHA_512` with `MessageType:RAW` [54]. It costs $1 per key per month plus $0.03 per 10,000 requests, and 20,000 requests a month are free [53]. Implement `@minmax/core`'s `Signer` interface on top of it.
- **Hosting:** Fly.io in Frankfurt (`fra`, 1.1538× the Ashburn price; shared-cpu-1x 512 MB is $3.94 × 1.1538 ≈ $4.55/month; performance-1x 2 GB is $11.66 × 1.1538 ≈ $13.45/month; egress $0.02/GB) [56].
- **Push:** Expo Push is free, limited to 600 notifications per second per project, and keeps contents only in memory and queues [46]. Never put health values in push payloads.
- **Subscriptions:** RevenueCat is free up to $2,500 monthly tracked revenue, then 1% of tracked revenue [48].
- **EU residency:** health data stays in EU Postgres, encrypted. US processors (Expo, RevenueCat, Sentry) see no health values. Sign SCCs with each, because the EU-US Data Privacy Framework is under review (`regulatory.md`).

### Monthly cost estimate (my synthesis; excludes engineering time, aggregators and store fees of $99/yr Apple + $25 one-off Google)

Assumptions: "users" means registered users who are active monthly, so EAS Update MAU equals users. Each user syncs about 5 KB/day of encrypted measurement rows (about 1.8 MB per user per year). 5% pay about $8/month, which feeds the RevenueCat fee.

| Item | 1k users | 10k users | 100k users |
|---|---|---|---|
| API compute (Fly.io fra) | 2× shared 512 MB ≈ $9 | 2× performance-1x 2 GB ≈ $27 | 5× performance-1x 2 GB ≈ $67 |
| Postgres (Supabase Pro + compute + storage) | $25 (Micro covered by credit) | $25 + Medium ($60 − $10) + ~$2 storage ≈ $77 | $25 + XL ($210 − $10) + ~$22 storage ≈ $247 (Team plan $599+ if an SLA is needed) |
| AWS KMS | ~$1 | ~$1–2 | ~$2–5 |
| EAS (builds + OTA) | $19 Starter (Free caps OTA at 1,000 MAU) | $19 + 7,000 × $0.005 = $54 | $199 + 50,000 × $0.005 = $449 |
| RevenueCat | $0 (<$2.5k MTR) | ~$40 (on ~$4k MTR) | ~$400 (on ~$40k MTR) |
| Expo Push | $0 | $0 | $0 |
| Sync engine | $0 (custom) | $0 custom / $49 PowerSync Pro | $0 custom / ~$170–250 PowerSync Pro (est. 5k peak clients) |
| Egress | <$1 | ~$2 | ~$20 (assumes ~1 TB) |
| **Total** | **≈ $55** | **≈ $200–250** | **≈ $1,200–1,450** |

Context from `wearable-integrations.md`: adding an aggregator would cost about $0.3–1.2k/month at 1k users and $2–9k/month at 10k, which dwarfs all of the above. The cost of this stack is driven by Expo services and revenue share, not by compute. (confidence: medium)

## Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| HealthKit background delivery is unreliable when only JS handles it | Medium | High (silent data gaps, wrong quests) | Native Expo module with an AppDelegate subscriber; always call the completion handler; integration test on a physical device (no simulator support [11][12]) |
| Health Connect background sync is delayed or killed | Medium | Medium | Native WorkManager worker (Android docs pattern [14]); show "last synced" in the UI; read `getChanges` tokens on foreground |
| A health library is abandoned or breaks on an upgrade | Medium | High | Pin versions; sponsor or contract the maintainer; wrap behind `ingest/` interfaces; keep the native-module fallback path documented |
| Expo / React Native upgrade churn | High | Medium | Upgrade on a fixed cadence, not every release; a Continuous Native Generation setup (no committed `ios/`/`android/`) keeps diffs small (`expo prebuild` regenerates by default in SDK 57 [3]) |
| Game Mode misses 60 fps on mid-range Android | Medium | High (premium promise) | Spike on a mid-range device first; keep animation in worklets/Skia; fall back to Rive/Lottie-only scenes; Simple Mode stays fast by design |
| ZK on the phone needs Rust/native work | Certain (if pursued) | Medium | Phase 0 server-signed claims (Ed25519/KMS); later Mopro native module; keep Noir/Midnight verification server-side or on the web |
| `@expo/app-integrity` alpha breaks | Medium | Medium | Pin; server tolerates a missing attestation by downgrading claim trust rather than refusing |
| EAS cost at scale | Medium | Low–Medium | Production plan from ~50k MAU; evaluate self-hosted updates (unverified) and local builds on GitHub Actions |
| Web dashboard quality | Medium | Low | Server-rendered verification page from Hono; dashboard optional; marketing site can be static |
| A single founder is the only person able to change native code | High | Medium | Keep native modules small and well tested; document them; a freelance iOS/Android day rate is the budget line |

## Implications for MINMAX

1. **Pick Expo / React Native for the client and TypeScript for the server, conditional on a two-week spike.** The spike must (a) run `@minmax/core`'s Vitest suite logic under Hermes (or an equivalent smoke test of `assembleCharacter` and claims); (b) receive a HealthKit background delivery on a physical iPhone with the app terminated; (c) run a Health Connect background read from a WorkManager worker; (d) render one Skia + Rive region scene at a steady 60 fps on a mid-range Android phone. If any of these fails, reopen `research/tech-stack-decision.md`.
2. **Budget for native code honestly:** two Expo modules (Swift, Kotlin) for ingest and workout recording. Size is unknown until the spike; my rough guess is a few hundred lines each (confidence: low). Everything else is TypeScript.
3. **Update `05-architecture.md`:** the "Client platform" section can record this choice, a Hono/Fly.io/Supabase-EU/KMS server, and the sync decision (custom append-only for v1, PowerSync self-hosted as the upgrade path).
4. **Stop expecting TypeScript to make on-device ZK easy.** Treat it as a native Rust module in a later phase, and use the TypeScript advantage for server-side and web verification.
5. **Use OTA only for fixes and copy.** Norm tables and quest templates go through the content service, as already planned.
6. **Keep the claim verification page server-rendered from the API**, not from React Native Web.
7. **Correct `midnight-zk.md`:** the Mopro "iOS" Noir timings were measured on an M3 MacBook Air running the iPad app, not on an iPhone [26].

## Open questions

- Does `subscribeToChanges` in `@kingstinct/react-native-healthkit` 16 survive a background launch of a terminated app on iOS 27 without native registration? Only a device test can answer this.
- Exact React Native 0.88 changes and the SDK 58 stable date. Should MINMAX start on SDK 58 directly?
- Which Rive features does the character rig need that the new Nitro runtime (0.5.1) still lacks [18]?
- Mid-range Android frame times for Skia and Rive scenes: no primary benchmark was found.
- Does PowerSync support a SQLCipher build of op-sqlite? (unverified)
- Can EAS Update be replaced by a self-hosted update server at scale, and does EAS Build work locally on GitHub Actions? (unverified in this session)
- Does `@bacons/apple-targets` support a full watchOS app target, or only complications? (unverified)
- Does Hermes V1 fully support `Number.prototype.toLocaleString("en-US")` as used in `modes/vocabulary.ts`? (unverified)
- Hetzner Cloud prices (the page did not render server-side) and whether Supabase as a US company is acceptable for Swiss/German health data under the DPIA.
- Which large health or wearable apps ship on React Native today? None were verified here; a search pass is needed once the search budget is restored.

## Sources

1. Expo — Changelog (SDK 56 2026-05-21, SDK 57 2026-06-30, SDK 58 beta 2026-09-15) — https://expo.dev/changelog — accessed 2026-10-02
2. React Native — Blog (releases 0.80–0.87) — https://reactnative.dev/blog — accessed 2026-10-02
3. Expo — SDK 57 changelog — https://expo.dev/changelog/sdk-57 — accessed 2026-10-02
3a. Expo — SDK 58 beta changelog — https://expo.dev/changelog/sdk-58-beta — accessed 2026-10-02
4. npm registry metadata (latest version, publish time, dependencies, README) for every package named in this report, queried as https://registry.npmjs.org/{package} — https://registry.npmjs.org/ — accessed 2026-10-02
5. GitHub — kingstinct/react-native-healthkit — https://github.com/kingstinct/react-native-healthkit — accessed 2026-10-02
6. README — @kingstinct/react-native-healthkit (raw) — https://raw.githubusercontent.com/kingstinct/react-native-healthkit/master/README.md — accessed 2026-10-02
7. (reserved: not used)
8. npm tarball — @kingstinct/react-native-healthkit 16.0.0 (source specs inspected: CoreModule, WorkoutsModule, WorkoutProxy, app.plugin) — https://registry.npmjs.org/@kingstinct/react-native-healthkit/-/react-native-healthkit-16.0.0.tgz — accessed 2026-10-02
9. GitHub — matinzd/react-native-health-connect — https://github.com/matinzd/react-native-health-connect — accessed 2026-10-02
10. npm tarball — react-native-health-connect 4.1.3 (source inspected: permissions, getChanges, insertRecords) — https://registry.npmjs.org/react-native-health-connect/-/react-native-health-connect-4.1.3.tgz — accessed 2026-10-02
11. Apple Developer — enableBackgroundDelivery(for:frequency:withCompletion:) (JSON rendering) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:).json — accessed 2026-10-02
11a. Apple Developer — HKObserverQuery (JSON rendering) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkobserverquery.json — accessed 2026-10-02
12. Expo Docs — BackgroundTask — https://docs.expo.dev/versions/latest/sdk/background-task/ — accessed 2026-10-02
13. Apple Developer — HKWorkoutSession (JSON rendering) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkworkoutsession.json — accessed 2026-10-02
14. Android Developers — Health Connect: Read raw data — https://developer.android.com/health-and-fitness/health-connect/read-data — accessed 2026-10-02
15. Apple — App Review Guidelines (2.5.2; last updated 2026-06-08) — https://developer.apple.com/app-store/review/guidelines/ — accessed 2026-10-02
16. React Native Skia — Installation — https://shopify.github.io/react-native-skia/docs/getting-started/installation/ — accessed 2026-10-02
17. Software Mansion — React Native Reanimated docs — https://docs.swmansion.com/react-native-reanimated/ — accessed 2026-10-02
18. Rive — React Native runtime docs — https://rive.app/docs/runtimes/react-native/react-native — accessed 2026-10-02
19. Expo Docs — SQLite — https://docs.expo.dev/versions/latest/sdk/sqlite/ — accessed 2026-10-02
20. Expo — Pricing — https://expo.dev/pricing — accessed 2026-10-02
21. GitHub — OP-Engineering/op-sqlite — https://github.com/OP-Engineering/op-sqlite — accessed 2026-10-02
22. PowerSync — React Native & Expo SDK — https://docs.powersync.com/client-sdk-references/react-native-and-expo — accessed 2026-10-02
23a. PowerSync — Pricing — https://www.powersync.com/pricing — accessed 2026-10-02
23. Mopro — React Native setup — https://zkmopro.org/docs/setup/react-native-setup — accessed 2026-10-02
24. Mopro — Home — https://zkmopro.org/ — accessed 2026-10-02
25. GitHub — zkmopro/react-native-app — https://github.com/zkmopro/react-native-app — accessed 2026-10-02
26. Mopro — Performance and Benchmarks (v0.2) — https://zkmopro.org/docs/0.2/performance/ — accessed 2026-10-02
27. Hermes — Features.md — https://github.com/facebook/hermes/blob/main/doc/Features.md — accessed 2026-10-02
28. Hermes — Issue #429 "WASM support within Hermes?" (open since 2020-12-04) — https://github.com/facebook/hermes/issues/429 — accessed 2026-10-02
29. Expo Docs — Using React DOM in Expo native apps (DOM components) — https://docs.expo.dev/guides/dom-components/ — accessed 2026-10-02
30. Expo Docs — Static rendering — https://docs.expo.dev/router/reference/static-rendering/ — accessed 2026-10-02
30a. Expo Docs — API routes — https://docs.expo.dev/router/web/api-routes/ — accessed 2026-10-02
31. Expo Docs — EAS Workflows introduction — https://docs.expo.dev/eas/workflows/introduction/ — accessed 2026-10-02
32. Expo Docs — EAS Update FAQ — https://docs.expo.dev/eas-update/faq/ — accessed 2026-10-02
33. GitHub Blog — Octoverse 2025: TypeScript becomes #1 — https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/ — accessed 2026-10-02
34. Stack Overflow — Developer Survey 2024, Technology — https://survey.stackoverflow.co/2024/technology — accessed 2026-10-02
35. Stack Overflow — Developer Survey 2025, Technology — https://survey.stackoverflow.co/2025/technology — accessed 2026-10-02
36. React Native — Showcase — https://reactnative.dev/showcase — accessed 2026-10-02
37. Expo — Customer story: Callie (2026-01-15) — https://expo.dev/customers/callie — accessed 2026-10-02
38. Expo — Customer story: Fieldy (2026-03-24) — https://expo.dev/customers/fieldy — accessed 2026-10-02
38a. Expo — Customers — https://expo.dev/customers — accessed 2026-10-02
39. Kingstinct — Company site — https://kingstinct.com — accessed 2026-10-02
40. WHOOP Engineering Blog — https://engineering.prod.whoop.com/ — accessed 2026-10-02
41. (reserved: not used)
42. GitHub — EvanBacon/expo-apple-targets — https://github.com/EvanBacon/expo-apple-targets — accessed 2026-10-02
43. Expo Docs — Expo Modules API overview — https://docs.expo.dev/modules/overview/ — accessed 2026-10-02
44. Expo Docs — iOS AppDelegate subscribers — https://docs.expo.dev/modules/appdelegate-subscribers/ — accessed 2026-10-02
45. Expo Docs — AppIntegrity — https://docs.expo.dev/versions/latest/sdk/app-integrity/ — accessed 2026-10-02
46. Expo Docs — Push notifications FAQ — https://docs.expo.dev/push-notifications/faq/ — accessed 2026-10-02
47. Better Auth — Expo integration — https://www.better-auth.com/docs/integrations/expo — accessed 2026-10-02
48. RevenueCat — Pricing — https://www.revenuecat.com/pricing/ — accessed 2026-10-02
49. Supabase — Pricing — https://supabase.com/pricing — accessed 2026-10-02
50. Supabase Docs — Regions — https://supabase.com/docs/guides/platform/regions — accessed 2026-10-02
51. Supabase Docs — Compute and disk — https://supabase.com/docs/guides/platform/compute-and-disk — accessed 2026-10-02
52. Neon — Pricing — https://neon.com/pricing — accessed 2026-10-02
53. AWS — KMS pricing — https://aws.amazon.com/kms/pricing/ — accessed 2026-10-02
54. AWS Docs — KMS key spec reference (ECC_NIST_EDWARDS25519) — https://docs.aws.amazon.com/kms/latest/developerguide/symm-asymm-choose-key-spec.html — accessed 2026-10-02
55. Hetzner — Cloud (locations; prices not rendered in fetch) — https://www.hetzner.com/cloud — accessed 2026-10-02
56. Fly.io Docs — Pricing — https://docs.fly.io/about/pricing — accessed 2026-10-02

Internal MINMAX documents used for context (not re-researched): `docs/05-architecture.md`, `docs/research/wearable-integrations.md`, `docs/research/midnight-zk.md`, `docs/research/regulatory.md`, `docs/research/competitors.md`, `packages/core/src/index.ts`.
