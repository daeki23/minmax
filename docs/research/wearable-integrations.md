# Wearable and Health-Data Integrations: APIs, Access Terms, Metrics, Costs, and the MVP Path

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

## Summary for the founder

- **Garmin is closed to new developers right now.** Garmin paused all new Connect Developer Program applications in spring 2026 ("new access requests are temporarily paused", no reopening date); existing partners and aggregators keep working [15][16][17]. For a company founded today, Garmin cloud data (VO2max, Training Status) is only reachable via an aggregator or via what Garmin Connect writes into Apple Health / Health Connect. (confidence: high)
- **Fitbit's Web API shuts off on 2026-10-30**, and its successor, the Google Health API, is "not onboarding new projects at this time" [30][31]. Treat Fitbit/Pixel as Health-Connect-only for now. (confidence: high)
- **Apple HealthKit and Android Health Connect are free, require no approval beyond store review, and cover every stat MINMAX needs** (VO2max, HRV, resting HR, sleep stages, workouts, body composition, nutrition, blood pressure) [1][2][9]. They are the only sources that need zero business relationship. Both force an on-device app: there is no server API [7].
- **Health Connect's 30-day rule** blocks baseline/Origin computation unless MINMAX requests `READ_HEALTH_DATA_HISTORY`; background sync needs `READ_HEALTH_DATA_IN_BACKGROUND`; both must be justified in the Play Console Health apps declaration [8][11]. (confidence: high)
- **Oura, Polar, Withings and WHOOP have free, self-serve developer APIs** with sandbox caps (Oura 10 users, WHOOP 10 members) lifted by manual review [20][26]. Oura now requires end users to hold an active Membership (Gen3 and later) for any API access [22]. (confidence: high)
- **Aggregators cost $300–500/month at entry** (Junction $300 for up to 500 users; Terra $399–499 for 100k credits; ROOK $399 for 750 users; Spike from $450; Thryve €499 for 500 users) [39][40][41][42][43]. Open Wearables is MIT-licensed and self-hosted but cannot grant Garmin access you do not already have [44]. (confidence: high)
- **Accuracy varies strongly by metric and vendor.** Nocturnal HRV vs ECG: Oura MAPE 6–7%, WHOOP 8%, Garmin 10.5%, Polar 16% [57]. Wrist VO2max: Garmin MAPE ~7%, Apple Watch MAPE 13–16% with ~6 ml/kg/min underestimation in fit users [53][55][56]. Four-stage sleep kappa: Oura 0.65, Apple 0.60, Fitbit 0.55; sleep/wake is good, stages are not [59]. These numbers should set MINMAX's per-source confidence intervals.
- **Lab data has no API path in DACH today.** Apple Health Records (FHIR) exists only in the US, UK and Canada [5]; EHDS lab-result exchange is scheduled for March 2031 [48]; Function Health and Superpower publish no developer API [46][47]. MVP lab input = PDF/manual entry with "clinical" trust tier.
- **Recommended MVP: HealthKit + Health Connect direct, plus Oura v2 direct (free), no aggregator until Garmin-cloud data becomes a measurable conversion blocker.** Estimated out-of-pocket integration cost: well under $100/month at 1k users; an aggregator adds roughly $0.5–1k/month at 1k users and $2–9k/month at 10k users.
- **Apple's guideline 5.1.3 constrains the insurer/employer verification idea**: health data may fund a user benefit (e.g. reduced premium) only if "the app is submitted by the entity providing the benefit, and the data is not shared with a third party" [4]. Zero-knowledge proofs do not automatically clear this bar.

## Findings

### 1. Platform health stores

**Apple HealthKit.** HealthKit is an on-device store; "there is no server you can call with a user token to get their health data" [7]. MINMAX therefore needs a native iOS component that reads and uploads. Relevant types, all present today: `vo2Max` (ml/kg/min; Apple Watch Series 3+ generates samples "after an outdoor walk, outdoor run, or hiking workout" on <5% grade with HR ≥130% of resting; the estimable range is 14–60 ml/kg/min; iOS 11+) [1]; `heartRateVariabilitySDNN` (HealthKit's only HRV type since iOS 11; iOS 27, shipped 2026-09-14, adds an RMSSD type, bringing HealthKit to 122 quantity types) [6]; resting HR, walking HR average, workouts with per-type metrics, body mass/fat/BMI, blood glucose and blood pressure [7]; sleep analysis values `inBed`, `awake`, `asleepCore`, `asleepDeep`, `asleepREM`, `asleepUnspecified` [2]. Apple Watch-derived stages require watchOS 9+ [7]. Clinical records (FHIR R4/DSTU2: AllergyIntolerance, Condition, Immunization, MedicationRequest, Observation for labs/vitals, Procedure) need the `health-records` entitlement and exist only for US, Canadian and UK providers [5].

Background delivery wakes the app "at most once per time period" at `immediate` or `hourly`; `stepCount` is capped at hourly on iOS, while `vo2Max` can be immediate on watchOS; iOS 15+ requires the `com.apple.developer.healthkit.background-delivery` entitlement [3]. App Review 5.1.3 forbids using HealthKit data "for advertising, marketing, or other use-based data mining purposes other than improving health management", forbids storing personal health information in iCloud, and requires disclosure of the specific health data collected [4]. Guideline 2.5.1 adds that HealthKit must be used "for health and fitness purposes and integrate with the Health app" [4]. (confidence: high)

**Android Health Connect.** Built into Android 14+; compatible back to SDK 28 via the Play Store app [12][62]. Record types include `Vo2MaxRecord`, `HeartRateVariabilityRmssdRecord`, `RestingHeartRateRecord`, `SleepSessionRecord` (with `stages` mandatory), `ExerciseSessionRecord`, `BodyFatRecord`, `LeanBodyMassRecord`, `WeightRecord`, `BloodPressureRecord`, `BloodGlucoseRecord`, `NutritionRecord`, `StepsRecord`, `OxygenSaturationRecord`, `SkinTemperatureRecord` [9]. Note that Android's HRV is RMSSD while Apple's is SDNN; the two "are not interchangeable" [6].

Permission model: "By default, all applications can read data from Health Connect for up to 30 days prior to when any permission was first granted"; older reads error unless `PERMISSION_READ_HEALTH_DATA_HISTORY` is granted; on reinstall the 30-day window resets [8]. Background reads need `android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND` and a feature-availability check; the docs recommend WorkManager and `aggregate()` over raw reads to avoid double counting and rate limits [8]. Rate limits exist as periodic and daily quotas, stricter in background, but the numbers are not published [10]. Publishing requires the Data Safety section and the Health apps declaration form, with "a clear and detailed justification" per permission, minimum data types only, and a privacy policy identical to the one shown inside Health Connect [11]. Rejections are common for sloppy justifications [61]. (confidence: high)

### 2. Vendor APIs

**Garmin (Health API, Activity API, Women's Health, Training, Courses).** Garmin offers Push or Ping/Pull delivery of JSON summaries covering "heart rate, steps, calories, sleep, respiration, body composition as well as detailed stress, pulse-ox, and epoch summaries", and states "Commercial use requires a license fee payment" after a free evaluation environment [13][14]. Third-party guides list a "User Metrics" summary carrying VO2max and fitness age plus HRV, sleep and body composition callbacks [18]; Training Status/Readiness availability in the public Health API is **unverified**. Eligibility requires a legal entity, website and privacy policy [18]. Since spring 2026 the application form shows "Under Construction"; Garmin's reply to applicants: "The application form for new API access requests is currently unavailable while we complete updates to the Garmin Connect Developer Program. During this transition, new access requests are temporarily paused." [15]. Garmin cites a "significant redesign and modernisation of the API program" with no timeline; the pause followed Strava's October 2025 lawsuit over Garmin's API terms [16]. Existing partners, including aggregators, continue to operate [17]. (confidence: high)

**Oura API v2.** Endpoints: `personal_info`, `daily_activity`, `daily_sleep`, `daily_readiness`, `daily_resilience`, `daily_stress`, `daily_spo2`, `daily_cardiovascular_age`, `vO2_max`, `sleep` (stages), `sleep_time`, `rest_mode_period`, `workout`, `session`, `heartrate`, `interbeat_interval`, `tag`, `enhanced_tag`, `ring_configuration`, plus webhook subscriptions [19][23]. Rate limit 5,000 requests per 5 minutes [21]. "By default, API Applications have a ten user limit"; wider release requires submitting the app for review [20]. No developer fee is published (confidence: medium). Critically, "Gen3 and later users without active Oura Membership can't access their data through the Oura API" and "Partner applications ... do not have access to the data of Gen3 and later users who do not have active Oura Membership" [22]; third parties date the change to late 2025 [63].

**Polar AccessLink (Dynamic API v4).** "Any registered Polar Flow user can create API client" [25]; 16 read scopes including `sleep:read` (stages), `nightly_recharge:read` (ANS charge, HRV), `continuous_samples:read`, `ppi_data:read` (raw pulse-to-pulse intervals), `temperature_measurement:read`, Elixir biosensing (ECG, SpO2, skin temperature), cardio load [24][25]. Exercises are available only for 30 days after upload and cardio load for 28 days, so ingestion must be continuous [24]. Rate limits scale with users (15 min: 500 + 20/user; 24 h: 5,000 + 100/user) [24]. No cost stated. (confidence: high)

**WHOOP Developer Platform (v2).** Six scopes (recovery, cycles, sleep, workout, body_measurement, profile); data includes recovery score, strain, sleep performance and stages, HRV, RHR, respiratory rate, skin temperature and SpO2 [29]. Sandbox allows "up to 10 WHOOP members"; approval requires a privacy policy, a test with at least one member, adherence to WHOOP brand guidelines and the API Terms of Use; reviews are manual [26]. Default rate limit: 100 requests/minute, 10,000/day, raisable on request [27]. v1 webhooks have been removed [28]. End users must hold a paid WHOOP membership for OAuth to complete (confidence: medium, third-party source) [29].

**Fitbit / Google Health API.** Google: "Support for the legacy Fitbit Web API ends on September 30, 2026" and "On October 30, 2026, the Fitbit Web API will be turned off" [30]. The replacement Google Health API (launched 2026-03-24) exposes steps, exercise, VO2max, daily HRV, RHR, SpO2, respiratory rate, classic and staged sleep, weight, ECG and glucose from Fitbit and Pixel devices, with all scopes classed as Restricted (privacy/security review), and "While we are not onboarding new projects at this time, we are actively working to open access to more developers"; parity with Health Connect data types is promised for Q4 2026 / Q1 2027 [30][31]. (confidence: high)

**Withings.** The Public API is for "individuals and partners without a formal contract" and is free to start (confidence: medium) [33][34]. Data: weight, fat/fat-free/muscle/bone/water mass with segmental variants, visceral fat, BMR, VO2max, blood pressure, standing HR, PWV and vascular age (EU-purchased devices only), ECG intervals, AFib, SpO2, respiration rate, sleep score and stages, sleep apnea index, overnight HRV, core/skin temperature, steps and workouts; many are device-specific [32]. The Advanced Research API requires a signed contract [33].

**COROS.** A Partner API with OAuth 2.0, webhooks and two-way sync is offered to "established platform[s] with demonstrated user base" that are registered companies and accept COROS API Terms of Use [35] (confidence: medium; page returned 403 on fetch, content from search index).

**Suunto.** Cloud API access is for "companies/organizations" only via the partner program; data covers workouts (GPS, HR samples, laps, FIT files) and daily steps/calories; "The Suunto Cloud API doesn't yet support the sleep data fetch/push" and HRV is not listed [36].

**Samsung Health.** The Samsung Health Data SDK (v1.1.0, 2026-03-12) reads heart rate, sleep, exercise (with `vo2Max` on exercise sessions), body composition, blood pressure, glucose, SpO2, skin temperature, steps and nutrition; reading works in developer mode without a partner request, but "To distribute the app using the Samsung Health Data SDK, request partnership" [37][38]. The legacy Samsung Health SDK for Android is deprecated and remains operational "for at least 2 years after its deprecation" [38]. Samsung watches also write to Health Connect, which is the pragmatic route.

Terms common to all vendors: user-consent-only access, no resale, attribution/brand guidelines, and manual review before scaling. Garmin is the only one quoting a commercial license fee.

### 3. Aggregators

| Provider | Entry price | Included | Notes |
|---|---|---|---|
| Terra | $499/mo ($399 annual) | 100,000 credits; 200 credits per active auth per month; 400 events/auth free, then 0.5 credit; overage from $0.005/credit | Streaming, Lab Reports ($499+), Planned Workouts ($99+) are add-ons; 30-day money-back [39] |
| Junction (ex-Vital) | $300/mo | 1–500 connected users, 300+ devices, Link widget, free sandbox | Beyond 500 users = Enterprise (custom); lab testing API is Enterprise-only [40] |
| ROOK | $399/mo | 750 active users | Core+ $999 (5,000 users), Business $1,999 (15,000); webhooks $99, ROOKScore/granular data $249 each on lower tiers; Lab Data $249/mo for 300 files [42] |
| Spike | from $450/mo | 40+ providers, 500+ devices, Abbott/Dexcom, lab OCR, nutrition photo AI | No per-user pricing disclosed [41] |
| Thryve | €499/mo | 500 users, €0.50/additional; Scale Up €1,000 for 5,000 users + €999 per 10,000; free trial 25 users | Self-serve via Stripe [43][45] |
| Open Wearables | $0 (MIT) | Self-hosted FastAPI/Postgres/Redis/Celery; cloud providers Garmin, Oura, Whoop, Suunto, Polar, Withings, Ultrahuman, Strava, Fitbit, Google Health; SDKs for HealthKit, Health Connect, Samsung | 2.6k stars, "APIs may change before version 1.0"; you supply your own provider credentials [44] |

Independent comparisons put Terra at roughly 90 direct cloud integrations, Spike ~23, ROOK 8 [45]. All major aggregators deliver VO2max, HRV and sleep where the vendor exposes them. Pros: one schema, one webhook pipeline, and — decisive today — existing Garmin credentials [17]. Cons: a $300–500/month floor before revenue, per-connection costs when users link several devices, an extra hop in provenance, and no bypass of the on-device HealthKit/Health Connect requirement (aggregators ship their own mobile SDKs for those). (confidence: high)

### 4. Lab data, blood pressure, scales

- **Apple Health Records (FHIR)**: US/UK/Canada only; lab results arrive as `Observation` resources [5]. Not usable for a German/Swiss launch market.
- **EHDS**: Regulation (EU) 2025/327 entered into force 26 March 2025 [64]; implementing acts due March 2027; patient summaries and ePrescriptions exchange by March 2029; "medical images, lab results, and hospital discharge reports" by March 2031 [48]. Wellness apps claiming EHR interoperability must self-label (label valid max three years), pass a digital testing environment and register in the EU database under Article 49 [49]. EHDS is a 2029–2031 opportunity, not an MVP input.
- **Function Health / Superpower**: neither publishes a public or partner developer API; members get PDF exports; Superpower ingests wearables via Junction [46][47]. InsideTracker API: **unverified**.
- **Lab PDF/CSV import**: available as paid aggregator add-ons (Terra Lab Reports from $499/mo; ROOK Lab Data $249/mo for 300 files; Spike lab OCR) [39][42][41]. A self-built PDF/CSV parser with LOINC mapping is the realistic MVP path.
- **Blood pressure and scales**: Withings is the cleanest API (BP, PWV, body composition) [32]. OMRON Connect Create offers a consent-based Data API for blood pressure, heart rate and weight, contact-driven [50]. Eufy has no public API (community integrations reverse-engineer the app's cloud) [51]. Garmin Index S2 syncs to Garmin Connect and onward to Apple Health and Google Fit [52], so it reaches MINMAX through HealthKit; most BLE scales and cuffs also write to HealthKit/Health Connect via their vendor apps. (confidence: medium)

### 5. Data quality and error bars

**VO2max.** Garmin fēnix 6 vs lab: MAPE 7.05%, CCC 0.73, bias +0.75 ml/kg/min (n=19) [53]. Garmin Forerunner 920XT: MAPE 7.3%, bias −2.1, limits-of-agreement width 17.2 ml/kg/min; Polar V800 MAPE 13.2% (n=24) [54]. Apple Watch (S5–Ultra 2): bias −6.07 ml/kg/min (underestimation), MAE 6.92, MAPE 13.31%, LoA −6.1 to +18.3 (n=28, mostly fit participants) [55]; Series 7: MAPE 15.79%, RMSE 8.85 ml/kg/min [56]. Vendor claims of ~5% MAPE with a chest strap appear in secondary sources and are **unverified** here.

**HRV.** Nocturnal RMSSD vs ECG over 536 nights: Oura Gen4 CCC 0.99 / MAPE 5.96% (LoA −11.8 to +9.9 ms); Oura Gen3 0.97 / 7.15%; WHOOP 4.0 0.94 / 8.17% (LoA −12.5 to +10.9); Garmin fēnix 6 0.87 / 10.52% (LoA −15.2 to +11.6); Polar Grit X Pro 0.82 / 16.32% [57]. Nocturnal RHR error was 1–2 bpm for all devices, "well within the ~5 bpm threshold for clinical relevance" [57]. Apple Watch S6 SDNN vs ECG: bias −9.6 ms, LoA ±55 ms, r=0.67 [58].

**Sleep.** Sleep/wake sensitivity ≥95% for Oura Gen3, Fitbit Sense 2 and Apple Watch S8; four-stage kappa Oura 0.65, Apple 0.60, Fitbit 0.55; Apple underestimated deep sleep by 43 min and TST by 8 min; Fitbit underestimated deep by 15 min [59]. Oura reports 79% four-stage agreement vs 83% inter-scorer agreement for PSG itself [60]. Older generations were worse: Apple S6 TST +39.5 min, Garmin FR245 +43.8 min, stage kappa 0.20–0.44 [58].

**Suggested error bars for the trust model** (1 SD, my synthesis): VO2max Garmin ±4 ml/kg/min, Apple ±7 with a +6 correction option; nocturnal HRV Oura/WHOOP ±6 ms, Garmin ±8 ms, Polar ±12 ms, Apple SDNN ±25 ms (and never compare SDNN to RMSSD); total sleep time ±30 min for current-generation devices; sleep-stage minutes "indicative only". (confidence: medium — synthesized from small-n studies)

### 6. MVP path and cost

**Phase 1 (launch): HealthKit + Health Connect direct.** Zero API fees, no partner approval, and they aggregate for free: Garmin Connect, Oura, Polar Flow, Withings, Samsung and most scales write a subset of their data into the platform stores (exact fields per vendor **unverified**; must be tested device by device). The $99/yr Apple Developer Program and $25 Play fee are the only hard costs.

**Phase 1b: Oura API v2 direct.** Free, webhook-driven, best-validated HRV and sleep [57][59], and Oura users are a high-intent segment. Ten sandbox users, then review [20]. Polar AccessLink is the second cheapest add (open registration, raw PPI data) [24][25]; WHOOP is similar but smaller in DACH.

**Phase 2 (when data shows Garmin-cloud metrics are a conversion blocker): one aggregator.** Junction ($300/mo to 500 users) or ROOK ($399/mo to 750 users) are the lowest fixed-cost entries; Terra's credit model is the most generous at scale but priciest at the start [39][40][42]. Keep Garmin direct on a watchlist for the program's reopening and expect a license fee [14].

Rough monthly integration cost (assumes ~60% of registered users connect at least one source; 1.3 connections per connected user; infra is my estimate, excluding engineering time):

| Registered users | Direct only (HealthKit + Health Connect + Oura/Polar) | Direct + Junction | Direct + ROOK | Direct + Terra |
|---|---|---|---|---|
| 1,000 | ~$20–60 infra | $300 (≤500 connected) to Enterprise quote | $399–999 (+$99 webhooks) | ~$500–1,200 (~156k credits) |
| 10,000 | ~$100–300 infra | Enterprise quote (Sahha cites $0.50/user ≈ $3k) [45] | $1,999 (15,000 users) | ~$6–9k (~1.6M credits) |
| 100,000 | ~$1–3k infra | Enterprise quote | Enterprise quote | Enterprise quote; list price would exceed $50k |

## Implications for MINMAX

1. **Build mobile-first, with HealthKit and Health Connect as the primary ingest layer.** This is forced by Apple and Google and also happens to be the cheapest route; it makes every Garmin, Polar, Samsung and Withings user reachable on day one at reduced fidelity.
2. **Ask for Health Connect history and background permissions at onboarding with explicit, per-type justifications**, because Origin and baseline percentiles need more than 30 days and quests need silent nightly syncs [8][11].
3. **Encode device-level confidence in the provenance model**, not just source tier. "Device-verified" is too coarse: an Oura HRV reading (±6 ms) and a Polar HRV reading (±12 ms) deserve different confidence values, and Apple Watch VO2max should carry a wider band and a known negative bias [55][57].
4. **Never equate SDNN and RMSSD.** Store the HRV metric type with every sample; percentile tables must be metric-specific [6].
5. **Do not build quests on sleep-stage minutes.** Use total sleep time and consistency for the "sleep 8h" quest; show stages as colour, not score [58][59].
6. **Public claims should be verifiable only at the tier the data supports**: "VO2max ≥ 50 (Garmin-derived, ±4)" is honest; "Deep sleep 2h" is not.
7. **Plan for the Oura membership gate and for Garmin's absence in the integration list**; say so plainly in the UI to avoid support load [22][15].
8. **Lab results = import, not API, in DACH**: build a PDF/CSV importer with unit normalisation and mark imported values "clinical (self-uploaded)"; EHDS APIs are a 2031 roadmap item [48].
9. **The insurer/employer ZK-verification concept needs legal design on iOS**: guideline 5.1.3 ties insurance-type benefits to apps submitted by the benefit provider [4]; Play policy likewise restricts health data use for insurance eligibility (confidence: low, secondary source) [61]. Position verifiable achievements for challenges and communities first.
10. **Budget**: direct integrations keep variable data cost near zero to 10k users; an aggregator is a $300–2,000/month decision tied to measured demand for Garmin-cloud metrics.

## Open questions

- Which exact fields do Garmin Connect, Oura, Polar Flow and Withings write into Apple Health and Health Connect today (VO2max? HRV? sleep stages?) — needs device testing.
- When will Garmin reopen applications, and what will the new commercial license fee be?
- Does Oura charge for approved high-volume API apps, and is approval realistic for a gamified consumer app?
- Does the Google Health API open to new projects before 2027, and will it expose third-party Health Connect data?
- Do aggregators count HealthKit/Health Connect SDK connections as billable "active authentications"?
- Exact Health Connect rate-limit quotas (not published) and whether historical reads are throttled more aggressively.
- Validation of smart-scale BIA body-fat accuracy (not researched here) for the Strength/Nutrition stats.
- Legal review of Play "Health Content and Services" policy and Swiss/German insurance law for benefit-linked verification.

## Sources

1. Apple Developer — vo2Max (HKQuantityTypeIdentifier) — https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/vo2max — accessed 2026-10-02
2. Apple Developer — HKCategoryValueSleepAnalysis (JSON rendering of the doc page) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkcategoryvaluesleepanalysis.json — accessed 2026-10-02
3. Apple Developer — enableBackgroundDelivery(for:frequency:withCompletion:) (JSON rendering) — https://developer.apple.com/tutorials/data/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:).json — accessed 2026-10-02
4. Apple — App Review Guidelines (5.1.3, 2.5.1) — https://developer.apple.com/app-store/review/guidelines/ — accessed 2026-10-02
5. Apple Support — Technical requirements and specifications for Health Records — https://support.apple.com/guide/healthregister/technical-requirements-specifications-health-apd12d144779/web — accessed 2026-10-02
6. The Momentum — Apple Watch Series 12, iOS 27 and RMSSD in HealthKit — https://www.themomentum.ai/blog/apple-watch-series-12-ios-27-rmssd-healthkit — accessed 2026-10-02
7. Open Wearables — Apple HealthKit API: What Data You Can Access and How — https://openwearables.io/blog/apple-healthkit-api-what-data-you-can-access-and-how — accessed 2026-10-02
8. Android Developers — Health Connect: Read raw data — https://developer.android.com/health-and-fitness/health-connect/read-data — accessed 2026-10-02
9. Android Developers — Health Connect data types — https://developer.android.com/health-and-fitness/guides/health-connect/plan/data-types — accessed 2026-10-02
10. Android Developers — Health Connect rate limiting — https://developer.android.com/health-and-fitness/health-connect/rate-limiting — accessed 2026-10-02
11. Android Developers — Publish your health app on Google Play — https://developer.android.com/health-and-fitness/health-connect/publish — accessed 2026-10-02
12. Android Developers — Health Connect FAQ — https://developer.android.com/health-and-fitness/guides/health-connect/frequently-asked-questions — accessed 2026-10-02
13. Garmin — Connect Developer Program overview — https://developer.garmin.com/gc-developer-program/overview/ — accessed 2026-10-02
14. Garmin — Health API — https://developer.garmin.com/gc-developer-program/health-api/ — accessed 2026-10-02
15. Garmin Forums — Cannot access Developer Program application form ("Under Construction") — https://forums.garmin.com/developer/connect-iq/f/discussion/434798/cannot-access-developer-program-application-form-under-construction — accessed 2026-10-02
16. the5krunner — Garmin Freezes Developer API Months After Strava Lawsuit (2026-09-14) — https://the5krunner.com/2026/09/14/garmin-developer-api-access-paused/ — accessed 2026-10-02
17. Terra — Garmin's Connect Developer Program is paused (2026-09-07) — https://tryterra.co/blog/garmin-connect-developer-program-pause — accessed 2026-10-02
18. Open Wearables — Garmin Connect API: Developer Guide for Activities and Health Metrics — https://openwearables.io/blog/garmin-connect-api-developer-guide-activities-health-metrics — accessed 2026-10-02
19. Oura — API Documentation (2.0) — https://cloud.ouraring.com/v2/docs — accessed 2026-10-02
20. Oura — Developer docs landing (ten-user limit, approval) — https://cloud.ouraring.com/docs/ — accessed 2026-10-02
21. Oura — Error handling / rate limit — https://cloud.ouraring.com/docs/error-handling — accessed 2026-10-02
22. Oura Member Care — The Oura API (membership requirement) — https://support.ouraring.com/hc/lv/articles/4415266939155-The-Oura-API — accessed 2026-10-02
23. API Evangelist — Oura Ring API profile — https://github.com/api-evangelist/oura-ring — accessed 2026-10-02
24. Polar — AccessLink API — https://www.polar.com/accesslink-api/ — accessed 2026-10-02
25. Polar — AccessLink Dynamic API v4 — https://www.polar.com/polar-api-v4/ — accessed 2026-10-02
26. WHOOP Developer — App Approval — https://developer.whoop.com/docs/developing/app-approval/ — accessed 2026-10-02
27. WHOOP Developer — Rate Limiting — https://developer.whoop.com/docs/developing/rate-limiting/ — accessed 2026-10-02
28. WHOOP Developer — v1 to v2 Migration Guide — https://developer.whoop.com/docs/developing/v1-v2-migration/ — accessed 2026-10-02
29. Terra — WHOOP API in 2026: Data Access, Permissions, and Limitations — https://tryterra.co/blog/whoop-api-data-access-permissions-limitations-2026 — accessed 2026-10-02
30. Google Health API — Release notes — https://developers.google.com/health/release-notes — accessed 2026-10-02
31. Google Health API — About — https://developers.google.com/health/about — accessed 2026-10-02
32. Withings Developer — Available Health Data — https://developer.withings.com/developer-guide/v3/data-api/all-available-health-data/ — accessed 2026-10-02
33. Withings Developer — Public API integration guide — https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/public-health-data-api-overview/ — accessed 2026-10-02
34. Withings Developer — Partner Hub — https://developer.withings.com/ — accessed 2026-10-02
35. COROS Support — Partner API Access — https://support.coros.com/hc/en-us/articles/53181766856724-Partner-API-Access — accessed 2026-10-02 (page blocked fetch; content from search index)
36. Suunto — API FAQ — https://apizone.suunto.com/faq — accessed 2026-10-02
37. Samsung Developers — Health Data SDK release notes — https://developer.samsung.com/health/data/release-note.html — accessed 2026-10-02
38. Samsung Developers — Migration Guide overview — https://developer.samsung.com/health/data/migration-guide/overview.html — accessed 2026-10-02
39. Terra — Pricing — https://tryterra.co/pricing — accessed 2026-10-02
40. Junction — Pricing — https://www.junction.com/pricing — accessed 2026-10-02
41. Spike — Pricing — https://www.spikeapi.com/pricing — accessed 2026-10-02
42. ROOK — Pricing — https://www.tryrook.io/pricing — accessed 2026-10-02
43. Thryve — API Plans — https://www.thryve.health/pricing — accessed 2026-10-02
44. GitHub — the-momentum/open-wearables — https://github.com/the-momentum/open-wearables — accessed 2026-10-02
45. Sahha — 7 Best Terra API Alternatives in 2026 (last verified July 2026) — https://sahha.ai/compare/terra-alternatives/ — accessed 2026-10-02
46. API Evangelist — Function Health profile — https://github.com/api-evangelist/function-health — accessed 2026-10-02
47. API Evangelist — Superpower profile — https://github.com/api-evangelist/superpower-health — accessed 2026-10-02
48. European Commission — European Health Data Space Regulation (EHDS) — https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en — accessed 2026-10-02
49. Covington Inside Privacy — EHDS Series 4: Implications for Wellness Applications and Medical Devices — https://www.insideprivacy.com/digital-health/ehds-series-4-the-european-health-data-spaces-implications-for-wellness-applications-and-medical-devices/ — accessed 2026-10-02
50. OMRON Digital Health — OMRON Connect Create — https://www.digitalhealth.omronconnect.com/omron-connect-create — accessed 2026-10-02
51. GitHub — m4ary/eufylife-api-hacs (EufyLife unofficial cloud API) — https://github.com/m4ary/eufylife-api-hacs — accessed 2026-10-02
52. Wareable — Garmin Index S2 smart scale — https://www.wareable.com/garmin/garmin-index-s2-smart-scale-8130 — accessed 2026-10-02
53. Sensors 2025 — Validation of Aerobic Capacity (VO2max) and Pulse Oximetry in Wearable Technology (Garmin fēnix 6) — https://pmc.ncbi.nlm.nih.gov/articles/PMC11723475/ — accessed 2026-10-02
54. IJERPH 2019 — Validity of Wrist-Worn Activity Trackers for Estimating VO2max and Energy Expenditure — https://pmc.ncbi.nlm.nih.gov/articles/PMC6747132/ — accessed 2026-10-02
55. PLOS One 2025 — Investigating the accuracy of Apple Watch VO2 max measurements — https://pmc.ncbi.nlm.nih.gov/articles/PMC12080799/ — accessed 2026-10-02
56. JMIR Biomedical Engineering 2024 — Accuracy of Smartwatch-Based VO2max Estimation Using the Apple Watch Series 7 — https://biomedeng.jmir.org/2024/1/e59459 — accessed 2026-10-02 (abstract figures from search index)
57. Physiological Reports 2025 — Validation of nocturnal resting heart rate and heart rate variability in consumer wearables — https://pmc.ncbi.nlm.nih.gov/articles/PMC12367097/ — accessed 2026-10-02
58. Sensors 2022 — A Validation of Six Wearable Devices for Estimating Sleep, Heart Rate and Heart Rate Variability — https://pmc.ncbi.nlm.nih.gov/articles/PMC9412437/ — accessed 2026-10-02
59. Sensors 2024 — Accuracy of Three Commercial Wearable Devices for Sleep Tracking in Healthy Adults — https://pmc.ncbi.nlm.nih.gov/articles/PMC11511193/ — accessed 2026-10-02
60. Oura — 2024 Sensors validation study announcement — https://ouraring.com/blog/2024-sensors-oura-ring-validation-study/ — accessed 2026-10-02
61. Sahha — Why Google Play Rejects Health Apps — https://sahha.ai/blog/health-connect-play-store-rejection/ — accessed 2026-10-02
62. Android Developers Blog — Health Connect Jetpack SDK is now in beta (March 2025) — https://android-developers.googleblog.com/2025/03/health-connect-jetpack-sdk-now-in-beta.html — accessed 2026-10-02
63. Vitra Health — Oura Ring without a subscription: what still works in 2026 — https://vitrahealth.app/blog/use-oura-without-subscription — accessed 2026-10-02
64. Uroweb — The European Health Data Space Regulation (EHDS) — https://uroweb.org/the-european-health-data-space-regulation-ehds — accessed 2026-10-02
