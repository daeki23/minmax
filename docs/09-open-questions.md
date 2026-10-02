# 09 · Open questions

_Status: living document · started 2026-10-02. Questions for the founder are marked **[founder]**; questions the research or the build will answer are marked **[research]** / **[build]**._

## Material still missing

- **[founder] The original main prompt ("Hauptprompt").** The supplied conversation starts mid-way, at the critique of the "Ultra" program. The main prompt presumably defines MINMAX's scope, the stat list, the first mention of Midnight, and the founder's goals. Everything in `00`–`03` is inferred from the later turns and must be reconciled with it.
- **[founder] The earlier turns** in which the name MINMAX, the character stats and the Midnight idea were introduced, and any turns after the Origin/Class discussion.
- **[founder] The "Ultra" program itself** (the 49-dollar PDF or course). Its sound parts can seed early chapters; its structure shows what the market buys. Only needed if the founder wants it used.

## Product

- **[founder] Confirm the lean cut of the MVP** (`01-product-concept.md`, "Lean cut"). Three lines need a yes or no: a free first release with no payments at all; two regions with chapters instead of four; claims at launch or a shareable card first and claims in the first update. The roadmap is written from the answers.
- **[founder] Is the training program part of the product?** Three readings are possible: (a) MINMAX is the game layer and plans come from quests only; (b) MINMAX ships the founder's own program as premium chapters; (c) MINMAX is a platform where coaches publish chapters. The MVP assumes (a).
- **[founder] Platforms.** iOS first, Android first, or both at once? The assumption is both via a cross-platform stack, iOS store first because of HealthKit depth. `research/tech-stack-decision.md` argues the stack. The companion's watch presence (`10-ideas.md`) is a separate native target on either platform and needs its own place in the roadmap.
- **[founder] Launch market.** Switzerland/Germany/Austria first for language and insurer programs, or English-speaking markets first for size? The monetization report proposes five countries.
- **[founder] Name.** Is MINMAX fixed, or open if the trademark search shows conflicts?
- **[research] Default mode.** Game Mode or Simple Mode as the default for which cohort. Pending `research/user-psychology.md`.
- **[research] Is Power a stat mainstream users understand**, or should it be folded into Strength for v1 and split later?
- **[founder] Level feel.** With the decided formula a fully measured median adult is level 26 of 50 and a day-one wearable owner about 11. If the founder wants the median adult lower (say 15–18) the mapping from percentile to level must become convex, which makes early percentile gains worth less; the simulation in `packages/core/src/demo/level-cohorts.ts` is set up to test that in minutes.
- **[build] Rift pacing.** How soon after onboarding the bottleneck should start speaking.
- **[build] Quests the engine cannot verify yet.** Per-muscle set logging (Forge set-volume quests), a GPS "outdoor" flag for green-space walks, HRV-guided session swaps, and the Summit meta quests need new data types before they join the catalogue (`research/training-science.md`, quest tables).
- **[research] Pre-participation screening.** Should a PAR-Q+-style screen gate Engine III, the Arena and heavy bone loading? Not researched; the regulatory report should weigh in.
- **[research] Sedentary breaks across vendors.** Apple stand hours, Garmin move alerts and Health Connect have no common data type; `wilds.breaks.1` needs one mapping rule.
- **[research] Older and female users in the strength dose data.** Pelland's sample was 79 % male, mean age 25; whether Tier I should be larger for 50+ users is unknown.

## Data and trust

- **[research] Which vendor API first.** Garmin's developer program approval process and timing decide whether Garmin can be in the MVP or must come through an aggregator. Pending `research/wearable-integrations.md`.
- **[research] Error bars per metric and vendor** for the confidence priors.
- **[research] Mobility norms.** No adult population norms exist (normative-data report §4); Mobility is a criterion score for now. Whether MINMAX builds its own consented, device-verified norm cohort is open.
- **[founder] Reference sex for non-binary users and users on hormone therapy.** Published tables are male/female only; today such users get no percentile for sex-specific metrics. Letting the user choose a reference sex per metric is the honest option; needs a decision.
- **[founder] How hard a requirement is Midnight?** The provenance design is Midnight-ready without depending on it. If the founder wants Midnight in the first public release for strategic reasons (ecosystem grants, partnerships), that changes the roadmap.

## Business

- **[founder] Budget and time.** Full-time or evenings? Any capital? This decides whether the MVP is three months or nine.
- **[founder] Entity and location.** Where the company sits determines GDPR lead authority, VAT, store accounts and which insurer programs are reachable.
- **[founder] Pricing: the vision says free app, cosmetic revenue only** (`10-ideas.md` §2). To confirm before `06-business-model.md` is written: is the promise "no subscription, ever", or "the core is free forever" with cosmetics plus an optional supporter tier? Which cosmetics exist at launch, and are they also earnable through XP? The monetization report's benchmarks are subscription benchmarks and will be read against this choice, not instead of it.
- **[founder] The companion** (`10-ideas.md` §1). Name, look, voice; can it be switched off; does Simple Mode have it; is the watch complication in the MVP or the first update.
- **[founder] Jobs** (`10-ideas.md` §3). Which job first (cooking fits the Garden), self-reported only or verified through integrations, own levels or Journey XP. Assumed to be a phase after the health core is proven.
- **[founder] Horizontal tracks** (`10-ideas.md` §4). Which "things to do" exist at launch beyond filling the sheet, exploring regions and earning claims; whether the user picks a primary surface (sheet, map, quests, collection, profile) in onboarding.
- **[founder] B2B appetite.** Are insurer bonus programs and corporate wellness a target in year one, or consumer only?

## Legal

- **[research] The exact line** between allowed percentile statements and medical-device claims under MDR, FDA wellness guidance and Swissmedic. Pending `research/regulatory.md`.
- **[research] Ledger vs erasure.** Whether any on-chain anchoring is compatible with GDPR erasure rights, before Phase 3 is planned in detail.

## Resolved so far

| Question | Decision | Where |
|---|---|---|
| Does the class or the bottleneck pick the start region? | Class picks the home region; the bottleneck opens a Rift | `02-game-system.md` |
| Does Origin change when stats change? | No; only on an explicit New Journey | `02-game-system.md` |
| Is there a single health score? | No; seven stats, no composite shown | `02-game-system.md` |
| Does HRV have an absolute target? | No; personal-baseline deviation only | `02-game-system.md`, `03-data-provenance.md` |
| Does the MVP contain any blockchain? | No; provenance fields and signed claims only (Phase 0) | `03-data-provenance.md` |
| Documentation language | English, because the product is global; conversation with the founder stays German | `README.md` |
| How do several readings from a second source affect confidence? | Only that source's newest reading counts: one corroboration or one disagreement per source, never per reading | `packages/core/src/provenance/resolve.ts` |
| Can two load quests for the same stat be scheduled in one week? | No, as a hard rule; the scheduler leaves a slot empty instead | `packages/core/src/quests/schedule.ts` |
| Where does the server see health data? | Only vendor-webhook data it ingested itself; the phone is the system of record | `05-architecture.md` |
| Garmin in the MVP? | Only through HealthKit and Health Connect; Garmin's developer program is closed to new applicants in 2026 | `05-architecture.md`, `research/wearable-integrations.md` |
| Which metrics are real percentiles? | Only those with sampled population tables (VO₂max, grip, chair stand, jump, SRI, lipids, RHR). Everything else is a criterion score and the UI never calls it a percentile | `packages/core/src/stats/published.ts`, `research/normative-data.md` |
| How are percentiles interpolated and combined? | Linearly in z (probit) between anchors and across age-band midpoints; stats combine inputs as a weighted mean in z, never as a mean of percentiles | `packages/core/src/stats/norms.ts`, `compute.ts` |
| Metrics without published norms (pull-ups, lifts, sprint, broad jump, shoulder) | No table; measured and shown, but they contribute nothing to the percentile until a table exists. Lifter crowd data would be a separate "community" scale | `packages/core/src/stats/model.ts` |
| Can a claim exceed the published tail? | No; stat claims stop at the 95th percentile and metric claims must beat the measurement error | `packages/core/src/claims/issue.ts` |
| Which quests may the scheduler assign on its own? | Only A–C tier templates that are neither opt-in nor restrictive; D-tier recommendations and opt-in quests (alcohol, creatine, sauna, bone loading, hill sprints) are the user's choice. D-tier tests may be offered | `packages/core/src/quests/schedule.ts`, `research/evidence-check.md` |
| How does a quest with a self-reported part complete? | Through `self_report` check-ins only, trust 0, counted per quest inside its window; the host caps the XP | `packages/core/src/quests/progress.ts` |
| Where do quest citations live? | In `CITATIONS`, keyed per template and resolved to numbered sources in the research reports; a test fails on an unknown or unused key | `packages/core/src/quests/templates.ts` |
| Age-specific targets (steps at 60+, sit-to-stand from 40) | Separate templates with inclusive age gates; skipped when the age is unknown | `packages/core/src/quests/templates.ts` |
| Character Level formula and cap | Every stat is worth up to seven levels, unmeasured stats nothing (`1 + Σ 7 × stat/100`, cap 50, any data ≥ 2). Chosen over mean × √coverage because, on 2,000 synthetic users per cohort, it puts day-one wearable owners at median 11 instead of 17 and never lowers the level for measuring a weak stat | `packages/core/src/character/level.ts`, `demo/level-cohorts.ts`, `02-game-system.md` |
| Can the Summit open with unmeasured stats? | No; it needs all seven measured and ≥ 50, plus level ≥ 25. Otherwise 15 % of day-one wearable owners would have started on the Summit | `packages/core/src/character/regions.ts` |
| Do the backlog ideas (companion, cosmetics, jobs, horizontal tracks) gate the MVP? | No. The founder's standing priority is shipping an MVP; the ideas are filed and scheduled after it | `10-ideas.md`, `source/founder-notes.md` |
