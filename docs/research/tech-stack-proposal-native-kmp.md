# The Case for Native SwiftUI + Jetpack Compose on a Kotlin Multiplatform Core for MINMAX

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

> **Method note.** This session's web-search budget was already used up when the research started. Every WebSearch call returned a budget-exhausted error, so the six or more discovery searches the brief asked for could not run. To compensate, every external claim below comes from one of three places. The first is a direct fetch of a primary page: official docs, release notes, pricing pages or GitHub READMEs (87 fetches). The second is Maven Central, Google Maven or npm metadata, where a release date is the `Last-Modified` header of that version's POM. The third is my own reading of the MINMAX repository. Some pages failed: the Health Connect background-reads guide and the Kotlin Objective-C interop page returned 404; the Ktor docs page returned only a title; the Render, Hetzner and Cloud Run pricing pages did not render. I discarded the Fly.io pricing numbers because they looked implausible. Anything I could not open myself is marked **unverified**. Statements marked *my estimate* or *my judgement* are reasoning, not sourced facts. Facts carried over from earlier MINMAX reports are cited to those files by path.

## Summary for the founder

- **Verdict: this is the highest-ceiling stack for MINMAX and the slowest to a first release.** It gives the deepest health-data access and the most headroom for a cinematic UI, with no bridge layer in between. You pay for that by building every screen twice. With two UI codebases it does **not** meet non-negotiable #5 in `docs/05-architecture.md` ("one solo developer can ship both stores from one codebase"), unless you read "one codebase" as "one repository with one shared engine", or you move shared screens to Compose Multiplatform. Choose it only if you accept that. (confidence: high)
- **Health data is where native wins clearly.** The demanding HealthKit details are things native code does directly:
  - observer queries registered in `application(_:didFinishLaunchingWithOptions:)`;
  - the background-delivery entitlement;
  - the rule that HealthKit stops waking the app after three missed completion handlers [16];
  - `HKWorkoutSession` on iPhone from iOS 17, with Lock Screen Live Activities [15].

  Health Connect 1.1.0 is stable with history and background-read permissions [32]. Android's `health` foreground-service type covers phone workout tracking [33]. Every cross-platform stack ends up writing these parts in Swift and Kotlin anyway. Here they are simply the main code path. (confidence: high)
- **Cinematic UI: strong on iOS, conditional on Android.**
  - iOS: SwiftUI runs Metal shaders from iOS 17 [18]. `glassEffect` (Liquid Glass) needs iOS 26 [19], which 79% of all iPhones ran on 2026-06-07 [23].
  - Android: Compose runs AGSL `RuntimeShader` **only on Android 13+**, and Google's own docs say to provide a fallback [27][28].
  - Rive has an officially recommended runtime on both platforms; the Android Compose API is labelled Beta but "production ready" [44][45].
  - A steady 60 fps on mid-range Android is unproven until a spike measures it. (confidence: medium)
- **The existing TypeScript core: port it to Kotlin, and let the conformance vectors that already exist decide when the port is correct.**
  - `packages/core` is 4,818 lines of non-test engine code. 1,965 of them are two data catalogues (norm tables, quest templates). The real logic to port is about 2,850 lines (my count today).
  - `packages/core/conformance/vectors.json` (331 KB, schema `minmax.conformance.v1`) already pins the engine's outputs.
  - The traps are rounding, number printing in signed claim payloads, and date parsing.
  - The repository's own conformance README misstates Kotlin's rounding (see Findings §4).

  (confidence: medium)
- **Fallback if the port fails: embed the TypeScript engine.** Use JavaScriptCore on iOS [22] and Jetpack JavaScriptEngine on Android (an out-of-process V8 sandbox, API 26+ when WebView supports it) [37][38]. That means zero port and zero drift, at the cost of an asynchronous, string-marshalled boundary. (confidence: medium)
- **Where it hurts most:**
  - two UIs (my estimate: 1.5–2× the UI effort of a single-UI framework);
  - a Mac is mandatory, because final Apple binaries cannot be built on Linux [8], so cloud AI agents cannot build or run the iOS app;
  - no over-the-air code updates [43];
  - Swift interop: Swift export is still Alpha [2], and SKIE documents support only up to Kotlin 2.4.10 while Kotlin 2.4.20 shipped on 2026-09-07 [1][14];
  - three languages;
  - a smaller hiring pool (Kotlin 10.8% and Swift 5.4% of Stack Overflow 2025 respondents, against TypeScript at 43.6% [75]). (confidence: high)
- **Backend: Ktor 3.6 on the JVM, sharing the Kotlin engine and claims modules.**
  - Database and auth: Supabase Postgres and Supabase Auth in Frankfurt (`eu-central-1`), or Zurich (`eu-central-2`) [68].
  - Compute: DigitalOcean App Platform in FRA [69][70].
  - Signing: AWS KMS [71].
  - Estimated cost: **≈ $40–50 / $80–240 / $550–800 per month at 1k / 10k / 100k users** (*my estimate*, before aggregators, monitoring and store fees). A TypeScript backend is equally valid if TypeScript stays the engine of truth. Midnight would add a TypeScript sidecar later in either case. (confidence: medium)
- **ZK and credentials fit native best of all the stacks, but nothing here is production-ready on the phone yet.**
  - Mopro generates Swift and Kotlin bindings for Circom, Noir and Halo2 provers [55].
  - The EU wallet project ships SD-JWT libraries in Kotlin (JVM) and Swift [62][63].
  - Midnight's SDK is TypeScript, and its proving is not mobile-ready (`midnight-zk.md`), whatever client stack you choose.

  (confidence: medium)
- **Production evidence is real but indirect.** Down Dog (yoga; 7 employees, 500k+ subscribers) shares logic in KMP with native views; "a single engineer … now does all three clients" [5]. WHOOP's engineering blog shows separate native iOS and Android apps [76]. Whether WHOOP uses KMP is **unverified**. I found no verified health app on exactly SwiftUI + Compose + KMP with public details. (confidence: medium)
- **Gate the decision with a 2–3 week spike** with explicit pass/fail tests (see Implications): port three engine modules against the vectors; test HealthKit background delivery on a device; test Health Connect history and background reads on a mid-range Android phone; render one Rive-plus-shader scene at 60 fps with a fallback for Android 12 and lower; check SKIE with the pinned Kotlin version; and **build the same screen twice to measure the real two-UI cost**.

## Findings

### 1. Why this stack fits MINMAX

**1.1 Health data is the product, and both health APIs are native-first.**
- **iOS background delivery is defined in native code.** Apple's background-delivery contract is written in terms of the iOS app lifecycle:
  - "For iOS 15 and watchOS 8 and later, you must enable the HealthKit Background Delivery by adding the `com.apple.developer.healthkit.background-delivery` entitlement".
  - `stepCount` is capped at hourly on iOS.
  - "If your app fails to respond three times, HealthKit assumes your app can't receive data and stops sending background updates".
  - Observer queries must be set up in `application(_:didFinishLaunchingWithOptions:)` [16].

  In a native app this is ordinary AppDelegate code. In React Native or Flutter it is still native code, written in a module that must start before the JavaScript or Dart runtime.
- **Testing needs real devices on every stack.** "Background server queries aren't supported on the Simulator" [17].
- **Workouts on iPhone.** `HKWorkoutSession` is available on iOS 17.0+. "Collecting heart rate data on iPhone or iPad requires pairing with an external heart rate sensor". You can "display Live Activities on the Lock Screen", and Siri can start, pause, resume or cancel workouts from the Lock Screen [15]. Live Activities, widgets and Siri are native extension points. On cross-platform stacks they are always written separately in Swift.
- **Android: Health Connect.** `connect-client` 1.1.0 became stable on 2025-10-08. It added:
  - feature availability checks;
  - history and background read permissions;
  - exercise routes and training plans;
  - skin temperature;
  - experimental FHIR medical records;
  - mindfulness sessions.

  The 1.2.0 alphas add richer exercise fields and activity intensity (alpha03, 2026-03-25), "matchmaking" APIs (alpha04, 2026-04-22) and raise `minSdk` to 24 (alpha05, 2026-08-12) [32]. Native code gets these the day they ship; wrapper libraries follow later. The 30-day default read window and the `READ_HEALTH_DATA_HISTORY` / `READ_HEALTH_DATA_IN_BACKGROUND` permissions are covered in `wearable-integrations.md`.
- **Android phone workouts.** The `health` foreground-service type requires `FOREGROUND_SERVICE_HEALTH` plus either `HIGH_SAMPLING_RATE_SENSORS` or a granted body-sensor, Health Connect or activity-recognition permission. Its stated use is "exercise trackers" [33]. The Wear OS exercise API (`ExerciseClient` in Health Services) exists only on "Wear OS 3 and higher" [34]. On an Android phone, MINMAX therefore records workouts with its own foreground service and writes an `ExerciseSessionRecord` with a route to Health Connect.
- **The KMP health wrapper is too thin to build on.** HealthKMP covers 18 metrics, has 91 stars and is at version 1.7.0 [53]. That argues for writing the adapters per platform; see "Where it hurts".

(confidence: high)

**1.2 The cinematic UI path is native-first on both platforms.**
- **iOS shaders:**
  - SwiftUI's `Shader` is "a reference to a function in a Metal shader library". It applies through `colorEffect`, `distortionEffect` and `layerEffect`, and it conforms to `ShapeStyle`, so a shader can fill text and shapes. Available from iOS 17.0 [18].
  - `keyframeAnimator` is iOS 17+ [20]. `glassEffect(_:in:)` "applies the Liquid Glass effect to a view" on iOS 26+ [19].
  - Apple reported iOS 26 on 79% of all iPhones and 86% of iPhones from the last four years, measured 2026-06-07 [23]. A minimum target of iOS 17, with iOS 26 effects behind `#available`, therefore loses very few users. The exact iOS 17+ share is **unverified**, but it is at least 79%.
- **Android shaders:** AGSL "is used by Android 13 and above to define the behavior of programmable `RuntimeShader` objects" [27]. The Compose brush docs say: "`RuntimeShaders` only works on Android 13+. Wrap your Composable in an API if-else check and provide a suitable fallback" [28].
- **Android performance tooling:** Baseline Profiles "improve code execution speed by about 30% from the first launch" [29]. Macrobenchmark 1.5.0 (2026-09-09) is current [80].
- **Rive:**
  - Android 11.13.0 was published 2026-10-01 [80]. Its "New Compose API (Beta)" is described as "feature complete, production ready, and recommended for any new projects using Compose". The legacy View API "will be deprecated in the future" [44].
  - Apple: the new runtime is the recommended one. It renders with Metal, supports iOS 14.0+, and does data binding through `ViewModelInstance` [45].
  - This matters for Game Mode: stat-driven character animation can bind Rive view-model properties straight to engine output on both platforms.
- **Lottie:** `lottie-compose` 6.7.1 was last published 2025-10-31 [79]. It is fine for small UI accents but is not where the momentum is (*my judgement*).

(confidence: high for API facts; medium for the 60 fps claim, which needs a device test)

**1.3 One Kotlin engine can run on Android, iOS, the JVM server and the web.** KMP's own stability table lists:
- Stable: Android, iOS, JVM desktop, JVM server and web via Kotlin/JS.
- Beta: Kotlin/Wasm, watchOS and tvOS.
- Compose Multiplatform: Stable on Android, iOS and desktop; Beta on the web [3].

`@JsExport` makes Kotlin declarations callable from TypeScript, with generated `.d.ts` files [6]. Kotlin 2.4.20 can export suspending lambdas as JavaScript `async` functions, behind a flag [1]. Once the engine is ported, a single Kotlin engine runs on all four surfaces, which is the property the TypeScript core gives Expo today. (confidence: high)

**1.4 On-device cryptography and ZK plug in without a bridge.**
- **Mopro** generates native bindings for "Swift (iOS), Kotlin (Android), Flutter, and React Native" and supports Circom, Noir and Halo2 [55].
  - On Android it drops in a UniFFI Kotlin file, JNA 5.13.0 and per-ABI `.so` libraries, with a Compose sample [57].
  - On iOS it is an XCFramework plus `mopro.swift`, with a SwiftUI sample [58].
  - Its Circom benchmarks on an iPhone 16 Pro show a Keccak256 proof in 630.3 ms against 5,182.1 ms with snarkjs. On a Galaxy S23 Ultra, Anon Aadhaar takes 3,394.5 ms against 51,546.3 ms [56]. A native app gets those speeds without a JavaScript prover. Note that Mopro's Noir "iOS" numbers were measured on a MacBook Air M3, not an iPhone [56].
- **Longfellow-ZK** (Google; C++ and Rust; Apache-2.0) ships `ios.sh` and `android.sh` build scripts and "has completed several independent security reviews" [60].
- **SD-JWT:** the EU Digital Identity Wallet project publishes SD-JWT libraries in Kotlin ("RFC 9901 is implemented in Kotlin, targeting JVM") [62] and Swift [63]. Its Android wallet core is in Kotlin [64]. The EU's own wallet ecosystem is native.

(confidence: high for availability; low for production readiness, see 2.9)

**1.5 Watch apps are native territory on every stack.** `HKWorkoutSession` has existed on watchOS since 2.0 [15], and Wear OS Health Services is the Wear OS API [34]. Strava "expands to Wear OS and sees 30% more users" [41]. Watch-recorded workouts with heart rate fit the device-verified trust tier. On this stack they are written in the same languages (Swift, Kotlin) and share the same KMP model; KMP watchOS targets are Beta [3]. (confidence: medium)

**1.6 AI-assisted coding works inside the IDEs.**
- Xcode 27 offers "coding agents in Xcode, powered by the model of your choice" [26].
- Gemini in Android Studio has Agent Mode, MCP servers, skills, local and remote models, and Compose preview generation [39].
- Compose Multiplatform 1.12.1 (2026-09-22) ships an experimental MCP server for Compose Hot Reload, but for **desktop** only [7].

The flip side is in 2.2. (confidence: high)

### 2. Where it hurts (brutally)

**2.1 Two UIs.**
- **Effort.** Every screen, animation and Game Mode/Simple Mode variant is built twice, in SwiftUI and in Compose. Shared ViewModels in `commonMain` reduce this to view code, which is exactly Down Dog's pattern: platform-independent ViewControllers, with native Views [5]. My estimate is **1.5–2× the UI effort** of a single-UI framework, and the cinematic screens are the expensive ones (confidence: low; the spike measures it).
- **Non-negotiable #5.** This conflicts with #5 ("from one codebase").
- **Kotlin's own fitness example uses a shared UI.** Kotlin's case-study page features Fast&Fit, which shares "over 90% of the Fast&Fit codebase, including the entire UI, through KMP and Compose Multiplatform" [4]. The KMP fitness example the vendor chose to feature took the shared-UI route, not native UIs.

(confidence: high that the cost exists; low on the multiplier)

**2.2 A Mac, Xcode and Apple-only build steps.**
- "Building final binaries for Apple targets on Linux and Windows is also not possible" [8]. Kotlin libraries for Apple targets can be compiled on any host, but a Mac is needed for cinterop, CocoaPods or final binaries [9].
- An AI agent working in a Linux container, like the one writing this report, can build and test the shared engine, the Android app and the server. It **cannot build, run or test the iOS app**.
- CI cost:
  - GitHub's macOS runners cost $0.062/min against $0.006/min for Linux [74].
  - Xcode Cloud includes 25 compute hours a month with the developer program; then $49.99 for 100 h and $99.99 for 250 h [25].
- The price of a suitable Mac is **unverified**.

(confidence: high)

**2.3 No over-the-air fixes for native code.**
- **Google Play:** "an app may not download executable code (such as dex, JAR, .so files) from a source other than Google Play". The exception is "code that runs in a virtual machine or an interpreter where either provides indirect access to Android APIs (such as JavaScript in a webview or browser)" [43].
- **Apple:** the equivalent guideline was not fetched in this session (**unverified**).
- **What this means.** Every logic or UI bug fix goes through store review. Apple says "90% of submissions are reviewed in less than 24 hours", and expedited review is available for critical bug fixes [24]. Expo's OTA channel has no equivalent here.
- **Mitigation.** Ship content (norm tables, quest templates) as signed, versioned JSON *data*. `05-architecture.md` already requires content to be "updatable without a release".

(confidence: high)

**2.4 Swift interop is the weakest link in KMP.**
- **Swift export is not ready.** "Kotlin's interoperability with Swift through Swift export is currently in Alpha". Generic types "are generally not supported" and are type-erased to their upper bounds. Types inheriting `List`/`Set`/`Map` are ignored [2]. Kotlin 2.4.20 added sealed-class→Swift-enum mapping (Experimental) and a generated `Package.swift` [1].
- **SKIE fills the gap, with a version lag.** The practical path today is the Objective-C header plus Touchlab's SKIE, which maps sealed classes, enums, `suspend` and `Flow` to Swift [13]. SKIE's docs say it is "currently compatible with Kotlin versions from 2.0.0 up to 2.4.10", and that support for a new Kotlin version "is usually released within a couple of working days" [14].
  - SKIE 0.10.15 was published 2026-09-25 [79]. Kotlin 2.4.20 shipped 2026-09-07, and 2.5.0-Beta1 appeared 2026-09-23 [1][78]. Whether 0.10.15 supports 2.4.20 is **unverified**.
  - Practically, your Kotlin version is pinned by a third-party plugin.

(confidence: high)

**2.5 Three languages, plus shader languages.** The stack needs Swift (iOS UI, HealthKit, extensions), Kotlin (engine, Android, server) and TypeScript (landing page, claim verifier, and a later Midnight sidecar). On top of that come Metal Shading Language and AGSL for effects. For a solo founder, constantly switching between them costs real time (*my judgement*). (confidence: medium)

**2.6 A smaller hiring pool.** In Stack Overflow's 2025 survey of all respondents, JavaScript is at 66%, TypeScript 43.6%, Kotlin 10.8%, Dart 5.9% and Swift 5.4%. Among professional developers: TypeScript 48.8%, Kotlin 11.5%, Swift 5.7% [75]. The survey has no KMP-specific figure, so the size of the KMP-experienced pool is **unverified**. A partial offset: idiomatic SwiftUI or Compose code is easy to hand to any native contractor (*my judgement*). (confidence: high for the percentages)

**2.7 The engine port, and the drift that follows.**
- **It contradicts a stated principle.** `05-architecture.md` says: "All rules live in `@minmax/core` … neither reimplements a rule". A Kotlin port is, by definition, a reimplementation.
- **It only works under one of two strict conditions.** Either the Kotlin port becomes *the* engine and TypeScript is frozen, or every TypeScript change is followed by a Kotlin change that passes the vectors.
- **Two live engines means every bug is fixed twice.** See §4. (confidence: high)

**2.8 Android below 13 needs a separate visual path.** AGSL is Android 13+ only [27][28]. Google's public dashboard no longer shows Android version shares, only graphics-API data; version distribution is in the Play Console [30]. The share of MINMAX's target users below API 33 is therefore **unverified**. Non-negotiable #4 (60 fps on mid-range Android) is the most likely to fail on any stack, and Compose has no public frame-time evidence for MINMAX-like scenes that I could verify. (confidence: medium)

**2.9 The cryptography libraries exist; their maturity does not.**
- BBS via `pairing_crypto`: "This library has not undergone an independent implementation audit" [60].
- The EUDI Swift Longfellow wrapper has 4 stars and says it "by no means can be considered as the final product" [61].
- The EUDI Kotlin SD-JWT library targets the JVM [62]. It works on Android and Ktor but not in iOS `commonMain`, so iOS needs the Swift library [63]: two libraries implementing one RFC.
- Midnight is TypeScript plus a Docker proof server, and is not mobile-ready (`midnight-zk.md`). Native changes nothing there.

(confidence: high)

**2.10 Ecosystem churn.**
- **Room 3.0** (stable 2026-07-01) moved to a new Maven group and package (`androidx.room3`). It generates Kotlin only via KSP, requires coroutines, and now targets JS and WasmJs [36]. The Room KMP guide still shows `3.1.0-alpha01` and does not mention encryption [35].
- **JetBrains' KMP `navigation-compose`** is at 2.10.0-beta01 [78]. **Kotlin/Wasm** is Beta [3].
- **Community-maintained libraries** that this stack would otherwise lean on:
  - `supabase-kt` (844 stars) [66];
  - HealthKMP (91 stars) [53];
  - quickjs-kt (152 stars) [54].

(confidence: high)

**2.11 Encrypting the database on iOS from KMP is not documented in what I read.**
- **Android:** `sqlcipher-android` 4.19.1 (2026-09-29) supports both Room 2 (`SupportOpenHelperFactory`) and Room 3 (`SQLCipherDriver`) on API 23+ [47].
- **iOS:** I found no primary documentation for SQLCipher under Kotlin/Native with Room 3 or SQLDelight (**unverified**). The commercial SQLCipher edition starts at $999/year [48].
- **iOS Data Protection** offers file-level encryption. The default class is "complete until first user authentication" [21].

This is a spike item. (confidence: medium)

### 3. Criterion scorecard

| Criterion | Native + KMP | Evidence and caveat |
|---|---|---|
| HealthKit and Health Connect depth, incl. background and workout recording | **Strong** | Direct use of entitlement, observer queries and `HKWorkoutSession` [15][16]; HC 1.1.0 stable plus 1.2 alphas [32]; `health` FGS type [33] |
| Vendor APIs via webhooks | Neutral | Server-side on any stack. Ktor receivers share the Kotlin normaliser with the apps |
| Cinematic UI (60/120 fps, shaders, particles, Rive/Lottie) | **Strong on iOS; adequate on Android** | Metal `Shader` iOS 17 [18]; AGSL Android 13+ only, fallback needed [27][28]; Rive on both [44][45]; Android fps unproven |
| Local-first, encrypted store, sync | Adequate | Room 3 KMP [36]; SQLCipher on Android [47]; iOS encryption path unverified; PowerSync Kotlin exists [46]; Electric and Turso have no official Kotlin/Swift client [51][52] |
| On-device ZK | **Best of the options, ecosystem immature** | Mopro Swift/Kotlin bindings [55]; audit gaps [60][61]; Midnight not mobile (`midnight-zk.md`) |
| Reuse of `@minmax/core` | Weak → adequate | Port plus the vectors that already exist, or embed via JSC/JavaScriptEngine [22][37] |
| Solo velocity | **Weak** | Two UIs; Mac-only iOS builds [8] |
| Hiring | Weak/adequate | Kotlin 10.8%, Swift 5.4% [75] |
| AI coding | Adequate | IDE agents [26][39]; cloud Linux agents cannot build iOS [8] |
| OTA | **None** | [43]; content-as-data is the only lever |
| CI/CD | Adequate | Linux for shared, Android and server; Xcode Cloud 25 h free or macOS runners [25][74] |
| Testing | Strong for engine; standard for UI | Engine vectors run on the JVM in seconds (*my estimate*); HealthKit background tests need devices [17]; Maestro runs YAML UI flows [77] |
| Web (dashboard, landing, claim verifier) | Adequate | Kotlin/JS Stable, Compose for Web Beta [3]; landing and verifier best kept as plain TS/HTML |
| Production health apps on this stack | Medium | Down Dog [5], WHOOP native [76], Headspace Kotlin rewrite [40], Withings on Health Connect [42] |

### 4. The existing TypeScript core: port or embed

**What exists** (read from the repository today):
- `@minmax/core` 0.0.1 is 4,818 lines of non-test TypeScript, excluding fixtures, demos and the conformance generator. There are about 121 `it`/`test` cases (grep count).
- Two files hold most of the volume, and they are content, not logic: `stats/published.ts` (851 lines of norm tables) and `quests/templates.ts` (1,114 lines of quest catalogue). The rest, about 2,850 lines including types, is what a port must translate.
- `packages/core/conformance/vectors.json` (331 KB) fixes inputs and outputs for:
  - utilities;
  - every norm table;
  - character derivation;
  - a full fixture user (estimates, character, quests, HRV, claims, Game and Simple Mode strings);
  - quest progress.
- `05-architecture.md` now makes "a port that passes the conformance vectors" an acceptable route under non-negotiable #2.

**Option A: port to Kotlin `commonMain` (recommended for this stack).**
1. **Move the data out of the code first.** Generate `content/norms-<version>.json` and `content/quests-<version>.json` from the TypeScript sources and have both engines load them. This shrinks the port to logic only, and it implements the architecture's "updatable without a release" content rule, which matters doubly on a stack with no OTA (*my judgement*).
2. **Port module by module**, running the matching section of the vectors in `commonTest` on the JVM (fast, Linux) and on `iosSimulatorArm64` (Mac).
3. **Known traps:**
   - *Rounding.* JavaScript `Math.round` sends halves toward +∞. Kotlin's `roundToInt()` does the same ("Ties are rounded towards positive infinity" [10]). Kotlin's `round()` does **not**: it rounds "with ties rounded towards even integer" [11].

     The repository's `packages/core/conformance/README.md` currently says Kotlin's `round()` "rounds halves away from zero". By the Kotlin docs that is wrong, and the README should be corrected so a porter is not misled. The `util.round` vectors (`-0.5`, `2.5`, `1.005`, `72.45`) catch either mistake.
   - *Number printing in signed payloads.*
     - RFC 8785 requires numbers serialised per ECMA-262 §7.1.12.1 and keys sorted by UTF-16 code units [12].
     - The core's `canonicalize()` uses `JSON.stringify` plus `Object.keys().sort()`.
     - Kotlin's `Double.toString()` does not print the ECMAScript way; for example, JVM Kotlin prints `1.0` where JavaScript prints `1` (my knowledge, not separately cited).
     - The Kotlin `claims` module therefore needs its own small ECMAScript-compatible number formatter. Alternatively, claim payloads keep to integers and short decimals, as the conformance README already recommends.
   - *Dates.* `util/time.ts` uses `Date.parse`, which is lenient. Kotlin should use `kotlinx-datetime` 0.8.0 [78]. Tighten the TypeScript `parseIso` to strict ISO-8601 so both sides reject the same inputs.
   - *Normal-distribution helpers.* Use the same Abramowitz–Stegun and Acklam approximations, not a platform `erf`, as the README states.
4. **Then flip the source of truth.** Once all vectors pass, make Kotlin the engine of record: add a Kotlin vector writer, freeze the TypeScript package as the historical reference, and stop maintaining two engines.
   - The web claim verifier does not need the engine at all. It needs canonical bytes and a signature check (`@noble/ed25519` 3.2.0 on npm [81]), or a Kotlin/JS export of the `claims` module [3][6].
   - Effort, *my estimate*: 2–4 weeks for a solo developer with AI assistance. (confidence: low)

**Option B: embed the TypeScript engine (the fallback).**
- **iOS:** JavaScriptCore, to "evaluate JavaScript programs from within an app" [22].
- **Android:** Jetpack JavaScriptEngine:
  - 1.0.0 (2025-07-02), 1.1.0 (2026-05-06, Message Ports), 1.1.1 (2026-09-23) [38];
  - it runs a V8 sandbox out of process, "supported on API 26 and above if the WebView implementation supports it", and apps must call `isSupported()`;
  - one sandbox per app; results come back as strings;
  - it can run inside a Service or WorkManager task [37].
- **Shared alternative:** quickjs-kt 1.0.15 (2026-09-03) runs QuickJS from KMP on Android, JVM and Kotlin/Native [54][79].
- **Not applicable:** Cash App's Zipline runs Kotlin/JS, not arbitrary TypeScript [55].
- **Trade-offs.** No port and no drift. In exchange, every engine call is an asynchronous JSON round-trip, and the Android path depends on the installed WebView. Debugging crosses a language boundary.
- **Play policy** permits interpreted JavaScript [43]. A JS bundle still ships inside the binary, unless you deliberately use the interpreter exception for OTA logic, which I would not do with health rules (*my judgement*).

(confidence: medium)

### 5. Local-first storage and sync

- **Storage: Room 3.0.3 or SQLDelight 2.4.0.**
  - Room 3.0.3 (2026-09-09) is Google's recommended KMP database, runs on bundled SQLite (`sqlite-bundled` 2.7.1) and on Android pairs with `SQLCipherDriver` [36][47][80].
  - SQLDelight 2.4.0 (2026-09-18) is the alternative if you prefer writing SQL first [79].
- **Sync design.** The MINMAX design already rules out a CRDT. Measurements are immutable facts; the sync is "last-writer-wins per measurement id" and E2E-encrypted (`05-architecture.md`). A hand-written outbox is enough: encrypted measurement records are uploaded idempotently by id through the Ktor client, and vendor-ingested measurements are pulled from an inbox (*my judgement*).
- **Off-the-shelf sync engines don't fit:**
  - PowerSync Kotlin 1.15.2 (2026-09-28) supports Android, JVM and Apple targets and works with Room and SQLDelight. Its docs do not mention encryption, and syncing plaintext Postgres rows conflicts with E2E encryption [46][79].
  - Electric ships TypeScript and Elixir clients over an HTTP API [51].
  - Turso's official SDKs are TypeScript, Python, Go and Rust [52].
  - Automerge's Swift binding is at 0.5.2 (326 stars), and the Java binding is at 0.0.9 (48 stars) [49][50][79]. Neither is needed for append-only facts.
- **iOS keys and files.** Keep the database at iOS's default protection class ("complete until first user authentication" [21]) so background work after the first unlock can write. HealthKit itself says health data "usually isn't accessible while the device is locked" [15]. Store the database key in the Keychain (Keychain API not re-fetched in this session).

(confidence: medium)

### 6. Solo velocity, AI coding, CI/CD and testing

- **Velocity.** Down Dog is the best evidence that small teams can run KMP with native views. It is a 7-person company with 500k+ subscribers and 100k+ daily users, rated 4.9 stars, whose native code is "mostly just the view code" [5]. It is not evidence for a greenfield solo build: Down Dog arrived at this architecture over years (*my judgement*).
- **Release cadence.** Expect one store submission per fix. Apple reviews 90% of submissions within 24 hours [24].
- **CI:**
  - GitHub Actions on Linux for `shared` (JVM tests against the vectors), `apps/android` and `apps/api` ($0.006/min [74]);
  - Xcode Cloud for iOS within the free 25 h [25];
  - the existing TypeScript CI (`.github/workflows/ci.yml`: lint, typecheck, test, build) stays.
- **Testing layers:**
  - engine: vector conformance in `commonTest`;
  - UI: XCTest and Compose UI tests, plus Maestro YAML flows across both apps [77];
  - performance: Macrobenchmark frame timing [80] and Xcode 27's Instruments additions (Swift Concurrency instrument, run comparisons) [26];
  - health: device-only tests for HealthKit background behaviour [17].
- **AI agents.** They work well in the shared Kotlin and server code from Linux. iOS work needs an agent on a Mac, or Xcode 27's built-in agents [26].

(confidence: medium)

### 7. Web: landing page, dashboard and claim verification

- **Landing page.** Static HTML/TypeScript on any static host. Compose for Web is Beta [3] and wrong for a marketing page (*my judgement*).
- **Claim verifier (`minmax.app/v/<claim-id>`).** A Ktor server-rendered page plus a small client-side TypeScript check with `@noble/ed25519` [81], so anyone can see the signature verify against the published key.
- **Dashboard.** A later TypeScript SPA against the Ktor API, or Compose for Web once it leaves Beta. Because the server stores only vendor-ingested data and claims (`05-architecture.md`), the dashboard mostly shows claims and account state, not a recomputed character sheet.

(confidence: medium)

### 8. Known production health and fitness apps relevant to this stack

| App | What is verified | Source |
|---|---|---|
| Down Dog (yoga) | KMP shared logic and ViewControllers; native views; "a single engineer … now does all three clients"; 7 employees; 500k+ subscribers | [5] |
| Fast&Fit (fitness) | KMP **and Compose Multiplatform**, "over 90% … including the entire UI" | [4] |
| Philips | "We consolidated all our business logic into shared code" (app not named on the page) | [4] |
| WHOOP | Native iOS and Android engineering posts, e.g. "WHOOP vs. Android Wake Locks" (2026-03-12); KMP use **unverified** | [76] |
| Headspace | Full Kotlin rewrite on Android; rating 3.5 → 4.7 (Q1–Q2 2020); 70M users | [40] |
| Withings | Health Connect "reduced the amount of code related to data sync with third-party applications by 50%" (2023-03-10) | [42] |
| Peloton, Strava | Featured by Google for multidevice and Wear OS | [41] |

Whether Down Dog's native views are SwiftUI or Compose specifically is **unverified**.

## Concrete architecture

### Diagram

```
+------------------------------- iPhone ---------------------------------+
|  SwiftUI app                                                           |
|   Game Mode: Metal Shader, keyframeAnimator, Rive (Metal),             |
|              glassEffect if iOS 26                                     |
|   Simple Mode: plain SwiftUI                                           |
|        ^  StateFlow -> AsyncSequence (SKIE)                            |
|        |                                                               |
|  shared.xcframework (Kotlin/Native)                                    |
|   presentation . engine . model . claims . store(Room 3) . sync        |
|        ^  DTOs                                                         |
|  Swift adapters: HealthKitSource (observer queries, bg delivery),      |
|   WorkoutRecorder (HKWorkoutSession + Live Activity), Keychain,        |
|   App Attest (unverified here), Mopro.xcframework (later)              |
+--------------------------------+---------------------------------------+
                                 |  HTTPS: E2E-encrypted measurement outbox,
                                 |  inbox pull, claim requests
+------------------------------- Android -------------------------------+
|  Jetpack Compose app                                                   |
|   Game Mode: AGSL RuntimeShader (API 33+) / fallback (<33),            |
|              Rive Compose                                              |
|   Simple Mode: Material 3                                              |
|  shared (same Kotlin modules, JVM bytecode)                            |
|  Kotlin adapters: HealthConnectSource (history + background via        |
|   WorkManager), ExerciseService (FGS type "health"), Keystore,         |
|   SQLCipherDriver, Play Integrity (unverified here)                    |
+--------------------------------+---------------------------------------+
                                 v
+------------------------ Backend (EU, Frankfurt) -----------------------+
|  Ktor 3.6 on JVM (DigitalOcean App Platform, FRA)                      |
|   auth check (Supabase Auth JWT) . sync inbox/outbox . claim signer    |
|   vendor webhooks: Oura (MVP), Polar/WHOOP/Withings later              |
|     -> shared normaliser + engine (steps 2-4) -> inbox                 |
|   content service: norms/quests JSON (signed, versioned)               |
|   push via FCM . job table in Postgres (SKIP LOCKED)                   |
|        |                     |                       |                 |
|  Supabase Postgres      AWS KMS signing key   (later) Midnight sidecar |
|  + Auth (eu-central-1                         in TypeScript            |
|  or eu-central-2)                                                      |
+------------------------------------------------------------------------+
                                 |
+-------------------------------- Web -----------------------------------+
|  Landing (static) . /v/<claim-id> verifier: Ktor-rendered page         |
|  + @noble/ed25519 check in the browser                                 |
+------------------------------------------------------------------------+
```

### Folder layout

```
minmax/
├─ package.json, pnpm-workspace.yaml   existing TS workspace (unchanged)
├─ packages/core/                      TS reference engine; conformance/vectors.json + README (exist)
├─ content/                            norms-<ver>.json, quests-<ver>.json (generated from TS, then owned here)
├─ settings.gradle.kts                 Gradle root for all Kotlin
├─ gradle/libs.versions.toml           one version catalogue (pins Kotlin to SKIE-supported)
├─ shared/
│  ├─ model/          @Serializable Measurement, Provenance, StatValue, Claim
│  ├─ engine/         port of @minmax/core logic; commonTest runs ../../packages/core/conformance/vectors.json
│  ├─ claims/         canonical JSON (RFC 8785 rules), predicate checks, ECMAScript number printer
│  ├─ store/          Room 3 entities/DAOs, outbox, sync_log; expect/actual DB-key provider
│  ├─ sync/           Ktor client, outbox upload, inbox pull, E2E envelope
│  ├─ presentation/   screen-state holders (ViewModels) shared by both UIs; Game/Simple vocabulary
│  └─ umbrella/       iOS framework export + SKIE config; the only module Swift sees
├─ apps/
│  ├─ ios/            Xcode project: SwiftUI, HealthKitSource, WorkoutRecorder,
│  │                  LiveActivity + Widget extensions, Shaders.metal, Rive assets
│  ├─ android/        Compose app: HealthConnectSource, ExerciseService, WorkManager jobs,
│  │                  AGSL shaders + fallbacks, baseline-prof module
│  ├─ api/            Ktor server (JVM); depends on shared/model, engine, claims
│  └─ web/            landing (static) + verifier (TS, @noble/ed25519)
└─ .github/workflows/ ci.yml (existing TS) + kotlin.yml (Linux: shared, android, api)
                      iOS builds in Xcode Cloud
```

The README's planned `apps/mobile` becomes `apps/ios` + `apps/android`.

### Key libraries (versions and publish dates checked 2026-10-02)

| Area | Library | Version (date) | Note | Source |
|---|---|---|---|---|
| Language | Kotlin | 2.4.20 (2026-09-07) | 2.5.0-Beta1 (2026-09-23) exists; do not use for production | [1][78] |
| Swift bridge | SKIE | 0.10.15 (2026-09-25) | docs: Kotlin 2.0.0–2.4.10; check 2.4.20 | [14][79] |
| Coroutines | kotlinx-coroutines | 1.11.0 (2026-05-07) | | [78] |
| Serialization | kotlinx-serialization | 1.11.0 (2026-04-09) | 1.12.0-RC exists | [78] |
| Time | kotlinx-datetime | 0.8.0 (2026-05-07) | strict ISO parsing | [78] |
| DB | Room 3 (`androidx.room3`) | 3.0.3 (2026-09-09) | KMP incl. iOS; KSP, coroutines only | [36][80] |
| DB driver | androidx.sqlite `sqlite-bundled` | 2.7.1 (2026-09-09) | same SQLite on both OSes | [80] |
| DB (alt) | SQLDelight | 2.4.0 (2026-09-18) | SQL-first alternative | [79] |
| Encryption (Android) | sqlcipher-android | 4.19.1 (2026-09-29) | `SQLCipherDriver` for Room 3; API 23+ | [47][79] |
| Networking / server | Ktor client + server | 3.6.0 (2026-09-16) | one HTTP stack on all tiers | [78] |
| Server SQL | Exposed | 1.5.0 (2026-08-26) | or plain JDBC | [78] |
| Shared ViewModels | JetBrains lifecycle-viewmodel (KMP) | 2.11.0 (2026-07-13) | | [78] |
| Android UI | Compose BOM | 2026.09.00 (2026-09-09) | ui/foundation/animation 1.12.1, material3 1.4.0 | [31][80] |
| Escape hatch | Compose Multiplatform | 1.12.1 (2026-09-22) | only if shared screens are adopted | [7][78] |
| Health (Android) | Health Connect `connect-client` | 1.1.0 stable (2025-10-08); 1.2.0-alpha06 (2026-08-26) | ship on 1.1.0; evaluate 1.2 alphas | [32][80] |
| Background (Android) | WorkManager | 2.12.0 (2026-09-23) | HC background reads | [80] |
| Perf (Android) | benchmark-macro-junit4 | 1.5.0 (2026-09-09) | frame-timing gate | [80] |
| Animation | Rive Android | 11.13.0 (2026-10-01) | new Compose API (Beta) | [44][79] |
| Animation | Rive Apple | 6.24.0 shown in docs | latest version unverified | [45] |
| Animation | Lottie Compose | 6.7.1 (2025-10-31) | accents only | [79] |
| Payments | RevenueCat purchases-kmp | 3.11.0 (2026-10-01) | free to $2,500 MTR, then 1% | [72][79] |
| Crash reporting | Sentry KMP | 0.27.0 (2026-06-03) | 0.28.0-beta.2 exists; pricing unverified | [79] |
| Auth client | supabase-kt BOM | 3.8.0 (2026-08-26) | community-maintained; use Auth module only | [66][79] |
| Crypto (Android/JVM) | Tink | 1.23.0 (newest in metadata, updated 2026-07-09) | | [79] |
| Credentials | EUDI SD-JWT (Kotlin JVM / Swift) | versions unverified | RFC 9901 | [62][63] |
| ZK (later) | Mopro | v0.3 docs | UniFFI Swift/Kotlin | [55][57][58] |
| Engine embed (fallback B) | Jetpack JavaScriptEngine | 1.1.1 (2026-09-23) | API 26+, WebView-dependent | [37][38] |
| Engine embed (fallback B) | quickjs-kt | 1.0.15 (2026-09-03) | 152 stars | [54][79] |
| Sync (optional later) | PowerSync Kotlin | 1.15.2 (2026-09-28) | no encryption mentioned | [46][79] |
| Web verifier | @noble/ed25519 | 3.2.0 | npm | [81] |

**Minimum OS targets** (*my judgement*):
- **iOS 17.** Needed for `Shader`, `keyframeAnimator` and `HKWorkoutSession` on iPhone [15][18][20]. Kotlin/Native's Tier 1 iOS targets need 15.0+ [8].
- **Android minSdk 26.** Needed by JavaScriptEngine if fallback B is used [37]. Health Connect 1.2 needs 24 [32], and SQLCipher 23 [47]. The share of users this excludes is **unverified** [30].

## Backend proposal

**Language and framework: Kotlin on the JVM with Ktor 3.6.0** (2026-09-16) [78]. Server-side JVM is Stable in KMP [3]. The server compiles the same `shared/model`, `shared/engine` and `shared/claims` modules as the apps. That gives one canonical-payload implementation and one normaliser for vendor webhooks. The Ktor docs page returned no content in this session, so Ktor plugin details (JWT auth, OpenAPI) are **unverified** here. (confidence: medium)

**When to choose a TypeScript backend instead.** If TypeScript stays the engine of truth (Option A without the flip, or Option B), a Node/TypeScript server that imports `@minmax/core` directly is the simpler server. The Kotlin port is then client-only and pinned by the vectors. Midnight's SDK is TypeScript and proves through a Docker proof server (`midnight-zk.md`), so Phase 3 adds a small TypeScript sidecar whichever language the main API uses. (confidence: high)

**Database and auth: Supabase.**
- **Pricing.** Pro costs $25/month and includes:
  - 50,000 MAU (then $0.00325/MAU);
  - 8 GB disk (then $0.125/GB);
  - 250 GB egress (then $0.09/GB);
  - a $10 compute credit.

  Compute add-ons: Micro $10, Small $15, Medium $60, Large $110, XL $210. PITR costs $100 per 7 days of retention. SOC2/ISO are Team-plan features ($599) [67].
- **Regions** include Frankfurt `eu-central-1`, which is the default for Europe, and Zurich `eu-central-2` [68].
- **Usage pattern.** Use Postgres through Ktor, not PostgREST. Use Supabase Auth for Sign in with Apple, Google and magic links; the provider list was not re-verified in this session. Ktor verifies Supabase-issued JWTs.
- **Client SDK risk.** `supabase-kt` is community-maintained [66]. Keep it to the auth flow, or do auth through the native Apple/Google SDKs and exchange tokens server-side.

**Hosting: DigitalOcean App Platform, FRA.**
- Shared instances: 1 vCPU/512 MiB $5, 1 vCPU/1 GiB $10–12, 1 vCPU/2 GiB $25, 2 vCPU/4 GiB $50. Dedicated 2 vCPU/4 GiB: $78. Billing is per second [69]. App Platform is available in the FRA region; DigitalOcean's European datacentres are AMS3, FRA1 and LON1 [70].
- Put Supabase in Frankfurt to co-locate with the API. Choose Zurich only if Swiss residency is a selling point; DigitalOcean has no Zurich region [70].
- An EU-owned alternative (Hetzner) is possible, but its pricing page did not render here (**unverified**).

**Claim signing: AWS KMS** at "$1/month" per key, with signing "$0.15 per 10,000 requests". Asymmetric Sign/Verify calls are excluded from the free tier [71]. Whether KMS offers Ed25519 keys, as `05-architecture.md` specifies, is **unverified** in this session. The fallback is ECDSA P-256, which changes the web verifier library.

**Push and payments.** FCM is "No-cost" [73]. APNs relaying was not verified here. RevenueCat is free up to $2,500 monthly tracked revenue, then "1% of what you track" [72].

**Vendor webhooks.** Oura is direct at MVP; Polar, WHOOP and Withings come later (`wearable-integrations.md`). They land on Ktor routes, are verified and deduplicated by hashing the payload, then go into a Postgres job table, through the shared Kotlin normaliser, and into the user's encrypted inbox. The raw payload is dropped, as `05-architecture.md` specifies.

**EU residency caveat.** Supabase, DigitalOcean, AWS, Google (FCM) and RevenueCat are US companies. EU regions reduce the transfer analysis but do not remove it. Sign SCCs with each; the EU-US DPF is under pressure (`regulatory.md`).

### Monthly cost estimate (*my estimate*; users ≈ MAU)

| Line item | 1k users | 10k users | 100k users | Basis |
|---|---|---|---|---|
| Supabase Pro base (incl. $10 compute credit) | $25 | $25 | $25 | [67] |
| Supabase compute beyond credit | $0 (Micro) | $5–50 (Small/Medium) | $100–200 (Large/XL) | [67] |
| Auth MAU overage above 50k | $0 | $0 | ≈ $163 (50k × $0.00325) | [67] |
| Disk above 8 GB | $0 | ≈ $1–3 | ≈ $5–15 | [67]; disk size is my guess |
| PITR, 7 days | — | $0–100 (optional) | $100 | [67] |
| Ktor on App Platform FRA | $12 (1 × 1 vCPU/1 GiB) | $50 (2 × 1 vCPU/2 GiB) | $156–234 (2–3 × dedicated 2 vCPU/4 GiB) | [69] |
| AWS KMS key + signing | ≈ $1 | ≈ $1–2 | ≈ $2–10 | [71] |
| FCM | $0 | $0 | $0 | [73] |
| CI (Xcode Cloud 25 h free; Linux Actions) | $0–10 | $0–10 | $0–50 | [25][74] |
| **Total** | **≈ $40–50** | **≈ $80–240** | **≈ $550–800** | |

Not included in these totals:
- RevenueCat at 1% of tracked revenue once above $2,500 [72];
- monitoring and transactional email (**unverified**);
- a wearable aggregator, $300–500/month at entry if ever added (`wearable-integrations.md`);
- egress beyond 250 GB;
- the Mac;
- store fees: $99/year Apple and $25 one-off Google, as carried in sibling reports and not re-verified here.

The 1k figure fits the "under 50 USD a month" launch target in `05-architecture.md`.

## Risks and mitigations

| # | Risk | Likelihood / impact | Mitigation |
|---|---|---|---|
| 1 | Two UIs slow the MVP beyond the founder's runway | High / high | Ship iOS first and Android second (*judgement*). Share screen state in `shared/presentation` (Down Dog pattern [5]). Generate design tokens for both. Measure "same screen twice" in the spike. Escape hatch: Compose Multiplatform for game-world screens (CMP iOS Stable [3]) |
| 2 | The Kotlin port drifts from the TS engine | High if both stay live / high | Vectors in CI on every commit. Move content to JSON. Flip the source of truth to Kotlin once green, or choose fallback B |
| 3 | Kotlin version pinned by SKIE; Swift export still Alpha | Medium / medium | Pin Kotlin in `libs.versions.toml`. Keep the Swift-visible API small (DTOs, `suspend`, `Flow`). Re-evaluate Swift export when it leaves Alpha [2][14] |
| 4 | Mac dependency; cloud agents cannot build iOS | Certain / medium | Own an Apple Silicon Mac. Use Xcode Cloud's free 25 h [25]. Keep logic tests on Linux |
| 5 | No OTA: a bad release stays out until review | Medium / high | Content as signed JSON. Remote feature flags. Staged rollouts on Play. Expedited review for critical bugs [24] |
| 6 | Game Mode misses 60 fps on mid-range Android or Android <13 | Medium / high | API-gated AGSL with Rive-only or static fallbacks [28]. Baseline Profiles [29]. Macrobenchmark gate on a named device [80] |
| 7 | HealthKit background delivery silently stops | Medium / high | Register observers at launch. Always call completion handlers. Device-only soak tests [16][17]. Reconcile on every foreground launch |
| 8 | Health Connect permissions or Play declaration rejected | Medium / high | Request history and background permissions with per-type justification (`wearable-integrations.md`). Degrade to a 30-day Origin with honest messaging |
| 9 | No documented SQLCipher path on iOS from KMP | Medium / medium | Spike it. Fallback: Data Protection [21] plus field-level encryption with a Keychain-held key. Commercial SQLCipher ($999/yr [48]) if needed |
| 10 | Community-maintained dependencies go stale | Medium / medium | Keep `supabase-kt`, HealthKMP and quickjs-kt out of critical paths, behind interfaces [53][54][66] |
| 11 | ZK and BBS libraries unaudited or immature | High / low for MVP | SD-JWT first. Hide proofs behind a `ProofProvider` interface. Mopro spike only in Phase 2+ [55][60][61] |
| 12 | Hiring help later is harder than for TS | Medium / medium | Idiomatic native code with no exotic framework. Document the KMP boundary. Budget for Kotlin-experienced contractors (rates **unverified**) |
| 13 | US vendors under EU-US DPF uncertainty | Medium / medium | EU regions, SCCs, E2E-encrypted sync so the servers hold ciphertext (`regulatory.md`) |

## Implications for MINMAX

1. **Decide what "one codebase" in non-negotiable #5 means before choosing this stack.** If it means one UI codebase, native SwiftUI + Compose fails #5, and the comparison should weigh Compose Multiplatform or Expo/Flutter instead. If it means one repository with one shared engine, this stack qualifies.
2. **Run a 2–3 week spike with pass/fail gates before committing:**
   1. `shared/engine` passes the `util`, `norms` and `fixture.claims` vector sections on the JVM and `iosSimulatorArm64`;
   2. HealthKit background delivery of HRV, resting HR and workouts wakes the app on a physical iPhone and survives 48 h;
   3. Health Connect history (>30 days) and WorkManager background reads work on a mid-range Android phone;
   4. one Game Mode scene (Rive character plus shader background plus particles) holds 60 fps under Macrobenchmark on that phone, with an acceptable fallback below API 33;
   5. SKIE (or Swift export) with the pinned Kotlin exposes engine state as Swift `async`/`AsyncSequence`;
   6. encrypted Room 3 or SQLDelight on iOS works, or the fallback is accepted;
   7. **the same screen built twice**, timed.

   If gate 1, 4 or 7 fails badly, switch to Compose Multiplatform for shared screens or to another stack.
3. **Engine work that pays off on any stack:**
   - move `stats/published.ts` and `quests/templates.ts` into versioned JSON under `content/`;
   - tighten `parseIso` to strict ISO-8601;
   - keep claim payload numbers to integers and short decimals;
   - correct the Kotlin rounding sentence in `packages/core/conformance/README.md` (Kotlin `round()` is half-even [11], and `roundToInt()` matches JavaScript [10]).
4. **Choose the engine of truth.** With this stack, the coherent end state is Kotlin as the engine on phone, server and (via Kotlin/JS, if needed) web, with the TypeScript core frozen as reference. Keeping TypeScript as truth points to a TypeScript backend and makes the Kotlin port a permanent follower.
5. **Plan for iOS first.** It is the platform where this stack's advantages (Metal shaders, Live Activities, HKWorkoutSession) are largest, and where 79% of iPhones already run iOS 26 [23]. Market-share data for the launch countries was not verified here.

## Open questions

1. Does the founder read non-negotiable #5 as "one UI codebase" or "one repository and engine"?
2. Does SKIE 0.10.15 support Kotlin 2.4.20? Its docs say up to 2.4.10 [14].
3. Is there a supported SQLCipher (or equivalent) path for Room 3 or SQLDelight on Kotlin/Native iOS?
4. What share of MINMAX's target users run Android below 13 (API 33)? This needs Play Console reach data [30]. Which named mid-range device defines "60 fps"?
5. What exactly does Apple's App Review guideline 2.5.2 allow regarding downloaded content and interpreted code? Not fetched here.
6. Does AWS KMS support Ed25519 signing keys, and in which EU regions? Not verified here.
7. Should the HealthKit adapter be Swift (Apple samples, entitlements) or Kotlin/Native calling HealthKit directly? Kotlin/Native's HealthKit bindings were not verified in this session.
8. Will Midnight work force a TypeScript service anyway, and does that tip the main backend to TypeScript?
9. Do Down Dog's native views use SwiftUI and Compose, and are there other public health apps on exactly this stack? Discovery search was unavailable this session.
10. What are the costs of a suitable Mac, Sentry and transactional email? All unverified.

## Sources

1. What's new in Kotlin 2.4.20 — https://kotlinlang.org/docs/whatsnew2420.html — accessed 2026-10-02
2. Kotlin docs: Interoperability with Swift using Swift export — https://kotlinlang.org/docs/native-swift-export.html — accessed 2026-10-02
3. Kotlin Multiplatform: Stability of supported platforms — https://kotlinlang.org/docs/multiplatform/supported-platforms.html — accessed 2026-10-02
4. Kotlin case studies (Fast&Fit, Philips entries) — https://kotlinlang.org/case-studies/ — accessed 2026-10-02
5. Kotlin case study: Down Dog — https://kotlinlang.org/case-studies/down-dog/ — accessed 2026-10-02
6. Kotlin docs: Use Kotlin code from JavaScript (`@JsExport`) — https://kotlinlang.org/docs/js-to-kotlin-interop.html — accessed 2026-10-02
7. What's new in Compose Multiplatform 1.12 — https://kotlinlang.org/docs/multiplatform/whats-new-compose-112.html — accessed 2026-10-02
8. Kotlin/Native target support — https://kotlinlang.org/docs/native-target-support.html — accessed 2026-10-02
9. Kotlin Multiplatform: Set up library publication — https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html — accessed 2026-10-02
10. Kotlin stdlib: `roundToInt` — https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/round-to-int.html — accessed 2026-10-02
11. Kotlin stdlib: `round` — https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/round.html — accessed 2026-10-02
12. RFC 8785: JSON Canonicalization Scheme (JCS) — https://www.rfc-editor.org/rfc/rfc8785 — accessed 2026-10-02
13. SKIE (Touchlab) home — https://skie.touchlab.co/ — accessed 2026-10-02
14. SKIE introduction (supported Kotlin versions) — https://skie.touchlab.co/intro — accessed 2026-10-02
15. Apple Developer: HKWorkoutSession (documentation data) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkworkoutsession.json — accessed 2026-10-02
16. Apple Developer: `enableBackgroundDelivery(for:frequency:withCompletion:)` (documentation data) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:).json — accessed 2026-10-02
17. Apple Developer: HKObserverQuery (documentation data) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkobserverquery.json — accessed 2026-10-02
18. Apple Developer: SwiftUI `Shader` (documentation data) — https://developer.apple.com/tutorials/data/documentation/swiftui/shader.json — accessed 2026-10-02
19. Apple Developer: SwiftUI `glassEffect(_:in:)` (documentation data) — https://developer.apple.com/tutorials/data/documentation/swiftui/view/glasseffect(_:in:).json — accessed 2026-10-02
20. Apple Developer: SwiftUI `keyframeAnimator` (documentation data) — https://developer.apple.com/tutorials/data/documentation/swiftui/view/keyframeanimator(initialvalue:repeating:content:keyframes:).json — accessed 2026-10-02
21. Apple Developer: Encrypting your app's files (documentation data) — https://developer.apple.com/tutorials/data/documentation/uikit/encrypting-your-app-s-files.json — accessed 2026-10-02
22. Apple Developer: JavaScriptCore (documentation data) — https://developer.apple.com/tutorials/data/documentation/javascriptcore.json — accessed 2026-10-02
23. Apple Developer: App Store (iOS adoption, measured 2026-06-07) — https://developer.apple.com/support/app-store/ — accessed 2026-10-02
24. Apple Developer: App Review — https://developer.apple.com/distribute/app-review/ — accessed 2026-10-02
25. Apple Developer: Xcode Cloud (pricing) — https://developer.apple.com/xcode-cloud/ — accessed 2026-10-02
26. Apple Developer: What's new in Xcode — https://developer.apple.com/xcode/whats-new/ — accessed 2026-10-02
27. Android Developers: AGSL — https://developer.android.com/develop/ui/views/graphics/agsl — accessed 2026-10-02
28. Android Developers: Compose Brush (RuntimeShader with ShaderBrush) — https://developer.android.com/develop/ui/compose/graphics/draw/brush — accessed 2026-10-02
29. Android Developers: Baseline Profiles overview — https://developer.android.com/topic/performance/baselineprofiles/overview — accessed 2026-10-02
30. Android Developers: Distribution dashboard — https://developer.android.com/about/dashboards — accessed 2026-10-02
31. Android Developers: Compose BOM to library version mapping — https://developer.android.com/develop/ui/compose/bom/bom-mapping — accessed 2026-10-02
32. Android Developers: Health Connect release notes — https://developer.android.com/jetpack/androidx/releases/health-connect — accessed 2026-10-02
33. Android Developers: Foreground service types — https://developer.android.com/develop/background-work/services/fgs/service-types — accessed 2026-10-02
34. Android Developers: Health Services on Wear OS — https://developer.android.com/health-and-fitness/guides/health-services — accessed 2026-10-02
35. Android Developers: Room for Kotlin Multiplatform — https://developer.android.com/kotlin/multiplatform/room — accessed 2026-10-02
36. Android Developers: Room 3 release notes — https://developer.android.com/jetpack/androidx/releases/room3 — accessed 2026-10-02
37. Android Developers: JavaScriptEngine guide — https://developer.android.com/develop/ui/views/layout/webapps/jsengine — accessed 2026-10-02
38. Android Developers: JavaScriptEngine release notes — https://developer.android.com/jetpack/androidx/releases/javascriptengine — accessed 2026-10-02
39. Android Developers: Gemini in Android Studio — https://developer.android.com/studio/gemini/overview — accessed 2026-10-02
40. Android Developers story: Headspace — https://developer.android.com/stories/apps/headspace — accessed 2026-10-02
41. Android Developers: Health & fitness developer center — https://developer.android.com/health-and-fitness — accessed 2026-10-02
42. Android Developers Blog: Withings reduces data sync code with Health Connect (2023-03-10) — https://android-developers.googleblog.com/2023/03/withings-reduces-data-sync-code-with--health-and-fitness-api-health-connect.html — accessed 2026-10-02
43. Google Play Console Help: Device and Network Abuse policy — https://support.google.com/googleplay/android-developer/answer/9888379 — accessed 2026-10-02
44. Rive docs: Android runtime — https://rive.app/docs/runtimes/android/android — accessed 2026-10-02
45. Rive docs: Apple runtime — https://rive.app/docs/runtimes/apple/apple — accessed 2026-10-02
46. PowerSync docs: Kotlin Multiplatform SDK — https://docs.powersync.com/client-sdk-references/kotlin-multiplatform — accessed 2026-10-02
47. GitHub: sqlcipher/sqlcipher-android — https://github.com/sqlcipher/sqlcipher-android — accessed 2026-10-02
48. Zetetic: SQLCipher editions and pricing — https://www.zetetic.net/sqlcipher/ — accessed 2026-10-02
49. GitHub: automerge/automerge-swift — https://github.com/automerge/automerge-swift — accessed 2026-10-02
50. GitHub: automerge/automerge-java — https://github.com/automerge/automerge-java — accessed 2026-10-02
51. Electric docs: TypeScript client — https://electric.ax/docs/api/clients/typescript — accessed 2026-10-02
52. Turso docs: SDK introduction — https://docs.turso.tech/sdk/introduction — accessed 2026-10-02
53. GitHub: vitoksmile/HealthKMP — https://github.com/vitoksmile/HealthKMP — accessed 2026-10-02
54. GitHub: dokar3/quickjs-kt — https://github.com/dokar3/quickjs-kt — accessed 2026-10-02
55. GitHub: cashapp/zipline — https://github.com/cashapp/zipline — accessed 2026-10-02
56. Mopro docs: Performance (v0.2) — https://zkmopro.org/docs/0.2/performance/ — accessed 2026-10-02
57. Mopro docs: Android setup — https://zkmopro.org/docs/setup/android-setup — accessed 2026-10-02
58. Mopro docs: iOS setup — https://zkmopro.org/docs/setup/ios-setup — accessed 2026-10-02
59. Mopro docs: Introduction — https://zkmopro.org/docs/intro — accessed 2026-10-02
60. GitHub: mattrglobal/pairing_crypto — https://github.com/mattrglobal/pairing_crypto — accessed 2026-10-02
61. GitHub: eu-digital-identity-wallet/av-lib-ios-longfellow-zkp — https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp — accessed 2026-10-02
62. GitHub: eu-digital-identity-wallet/eudi-lib-jvm-sdjwt-kt — https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-sdjwt-kt — accessed 2026-10-02
63. GitHub: eu-digital-identity-wallet/eudi-lib-sdjwt-swift — https://github.com/eu-digital-identity-wallet/eudi-lib-sdjwt-swift — accessed 2026-10-02
64. GitHub: eu-digital-identity-wallet (organisation) — https://github.com/eu-digital-identity-wallet — accessed 2026-10-02
65. GitHub: google/longfellow-zk — https://github.com/google/longfellow-zk — accessed 2026-10-02
66. GitHub: supabase-community/supabase-kt — https://github.com/supabase-community/supabase-kt — accessed 2026-10-02
67. Supabase pricing — https://supabase.com/pricing — accessed 2026-10-02
68. Supabase docs: Regions — https://supabase.com/docs/guides/platform/regions — accessed 2026-10-02
69. DigitalOcean docs: App Platform pricing — https://docs.digitalocean.com/products/app-platform/details/pricing/ — accessed 2026-10-02
70. DigitalOcean docs: Regional availability — https://docs.digitalocean.com/platform/regional-availability/ — accessed 2026-10-02
71. AWS KMS pricing — https://aws.amazon.com/kms/pricing/ — accessed 2026-10-02
72. RevenueCat pricing — https://www.revenuecat.com/pricing/ — accessed 2026-10-02
73. Firebase pricing (Cloud Messaging) — https://firebase.google.com/pricing — accessed 2026-10-02
74. GitHub Docs: Actions runner pricing — https://docs.github.com/en/billing/reference/actions-runner-pricing — accessed 2026-10-02
75. Stack Overflow Developer Survey 2025: Technology — https://survey.stackoverflow.co/2025/technology — accessed 2026-10-02
76. WHOOP Engineering blog — https://engineering.prod.whoop.com/ — accessed 2026-10-02
77. Maestro documentation — https://docs.maestro.dev/ — accessed 2026-10-02
78. Maven Central metadata, JetBrains/Kotlin artifacts (`kotlin-stdlib`, `io.ktor:ktor-server-core`, `ktor-client-core`, `org.jetbrains.exposed:exposed-core`, `org.jetbrains.kotlinx:kotlinx-coroutines-core`, `kotlinx-serialization-core`, `kotlinx-datetime`, `org.jetbrains.compose.ui:ui`, `org.jetbrains.androidx.lifecycle:lifecycle-viewmodel`, `org.jetbrains.androidx.navigation:navigation-compose`; dates from each version's POM `Last-Modified`), e.g. — https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-stdlib/maven-metadata.xml — accessed 2026-10-02
79. Maven Central metadata, third-party artifacts (`co.touchlab.skie:gradle-plugin`, `app.cash.sqldelight:runtime`, `com.powersync:core`, `app.rive:rive-android`, `com.airbnb.android:lottie-compose`, `net.zetetic:sqlcipher-android`, `io.insert-koin:koin-core`, `io.sentry:sentry-kotlin-multiplatform`, `com.revenuecat.purchases:purchases-kmp-core`, `io.github.jan-tennert.supabase:bom`, `app.cash.zipline:zipline`, `io.github.dokar3:quickjs-kt`, `org.automerge:automerge`, `com.viktormykhailiv:health-kmp`, `com.google.crypto.tink:tink-android`), e.g. — https://repo1.maven.org/maven2/co/touchlab/skie/gradle-plugin/maven-metadata.xml — accessed 2026-10-02
80. Google Maven metadata (`androidx.room3`, `androidx.compose:compose-bom`, `androidx.health.connect:connect-client`, `androidx.work:work-runtime`, `androidx.sqlite:sqlite-bundled`, `androidx.benchmark:benchmark-macro-junit4`, `androidx.javascriptengine:javascriptengine`), e.g. — https://dl.google.com/android/maven2/androidx/room3/group-index.xml — accessed 2026-10-02
81. npm registry: `@noble/ed25519` latest — https://registry.npmjs.org/@noble/ed25519/latest — accessed 2026-10-02

Internal MINMAX documents used (not re-verified externally): `docs/05-architecture.md`, `docs/research/wearable-integrations.md`, `docs/research/regulatory.md`, `docs/research/midnight-zk.md`, `docs/research/tech-stack-proposal-expo.md`, `packages/core/src/**`, `packages/core/conformance/README.md`, `packages/core/conformance/vectors.json`, `.github/workflows/ci.yml`.
