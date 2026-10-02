# 09 · Open questions

_Status: living document · started 2026-10-02. Questions for the founder are marked **[founder]**; questions the research or the build will answer are marked **[research]** / **[build]**._

## Material still missing

- **[founder] The original main prompt ("Hauptprompt").** The supplied conversation starts mid-way, at the critique of the "Ultra" program. The main prompt presumably defines MINMAX's scope, the stat list, the first mention of Midnight, and the founder's goals. Everything in `00`–`03` is inferred from the later turns and must be reconciled with it.
- **[founder] The earlier turns** in which the name MINMAX, the character stats and the Midnight idea were introduced, and any turns after the Origin/Class discussion.
- **[founder] The "Ultra" program itself** (the 49-dollar PDF or course). Its sound parts can seed early chapters; its structure shows what the market buys. Only needed if the founder wants it used.

## Product

- **[founder] Is the training program part of the product?** Three readings are possible: (a) MINMAX is the game layer and plans come from quests only; (b) MINMAX ships the founder's own program as premium chapters; (c) MINMAX is a platform where coaches publish chapters. The MVP assumes (a).
- **[founder] Platforms.** iOS first, Android first, or both at once? The assumption is both via a cross-platform stack, iOS store first because of HealthKit depth and subscription revenue share. `research/tech-stack-decision.md` argues the stack.
- **[founder] Launch market.** Switzerland/Germany/Austria first for language and insurer programs, or English-speaking markets first for size? The monetization report proposes five countries.
- **[founder] Name.** Is MINMAX fixed, or open if the trademark search shows conflicts?
- **[research] Default mode.** Game Mode or Simple Mode as the default for which cohort. Pending `research/user-psychology.md`.
- **[research] Is Power a stat mainstream users understand**, or should it be folded into Strength for v1 and split later?
- **[build] Character Level formula** and cap. Needs the stat model and a simulation on synthetic users so that typical new users land at levels 5–15, not 1 or 40.
- **[build] Rift pacing.** How soon after onboarding the bottleneck should start speaking.

## Data and trust

- **[research] Which vendor API first.** Garmin's developer program approval process and timing decide whether Garmin can be in the MVP or must come through an aggregator. Pending `research/wearable-integrations.md`.
- **[research] Error bars per metric and vendor** for the confidence priors.
- **[research] Mobility norms.** Where published norms are missing, how to label and how to build our own.
- **[founder] How hard a requirement is Midnight?** The provenance design is Midnight-ready without depending on it. If the founder wants Midnight in the first public release for strategic reasons (ecosystem grants, partnerships), that changes the roadmap.

## Business

- **[founder] Budget and time.** Full-time or evenings? Any capital? This decides whether the MVP is three months or nine.
- **[founder] Entity and location.** Where the company sits determines GDPR lead authority, VAT, store accounts and which insurer programs are reachable.
- **[founder] Pricing instinct.** A monthly subscription around the Strava/Oura band, a higher Whoop-style band, or freemium with cosmetics? The monetization report gives benchmarks; the final call is the founder's.
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
