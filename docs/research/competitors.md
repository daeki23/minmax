# Competitive Landscape: Gamified Fitness, Health RPGs, Premium Wearable Ecosystems, and the MINMAX Name

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

## Summary for the founder

- **The "body as RPG character" niche exists but is indie-scale.** The closest products (Forjum, Fitscape, Shikudo's Fitness RPG, Level-UP) have at most low hundreds of App Store ratings (Forjum, now live on both stores, has too few US ratings to display; Shikudo's Android version is larger at ~8.6k), €2–8/month pricing and Apple Watch/Wear OS-only data; none ingests Garmin, Oura, Whoop or labs, none shows percentiles or provenance [31][33][34][24]. (confidence: high)
- **The money is in scores, not games.** Whoop (2.5M+ members, $1.1B run-rate, $10.1B valuation, Mar 2026) and Oura (5M paid members, $1.21B revenue in the 9 months to Jun 2026) sell one daily number plus a longevity narrative for $70–360/yr [4][8]. MINMAX's stats layer competes with these, not with Pokémon GO. (confidence: high)
- **The price corridor is set:** $5.99–9.99/month for software-only (Oura, Garmin Connect+, Fitbit Premium, Apple Fitness+, Strava), $15–20 for virtual-world products (Zwift, Bevel), $149–499/yr for lab memberships (Function, Superpower, InsideTracker) [6][10][12][14][16][18][19b]. (confidence: high)
- **Gamification alone does not retain.** Industry-blog benchmarks put fitness-app day-30 retention at ~3–4%, and one B2C fitness-app case study found ~47% paid churn within 90 days (single study, not an industry average); drivers are motivation gaps, manual-entry fatigue and distrust when scores look wrong [37]. Habitica lost its moderators and social spaces; Zombies, Run! declined under OliveX; Shikudo's reviews centre on mis-counted steps [21][22][24]. (confidence: medium)
- **Move-to-earn is dead.** STEPN halved GMT earnings on 1 Jan 2026; Step App shut down Aug 2026 with FITFI down 99.99%; Sweatcoin survives on gift-card offers (~$10M revenue 2025) [29][30]. No tokens in MINMAX. (confidence: high)
- **Nobody leads with honest normative percentiles.** Garmin buries a VO2max percentile in Connect, Apple shows four bands, InsideTracker rejects norms for "optimized zones", and Whoop/Oura/Superpower sell proprietary "ages" [11][12][19b][2]. Percentile-first, evidence-tiered presentation is open. (confidence: medium)
- **Verifiable-but-private achievements exist nowhere in consumer fitness.** Midnight (IOG) offers ZK selective disclosure and there are health-eligibility prototypes, but no shipping fitness product [38][39]. Differentiator, not table stakes. (confidence: medium)
- **The name MINMAX has high conflict risk:** fitness-coaching apps already use MinMax/Min-Max Fitness (possibly one Australian PT business on two platforms), Jeff Nippard sells "The Min-Max Program", MinMax Inc. reportedly holds minmax.app, a registered US word mark "MINMAX" exists (Chen Xiaosheng, kitchen appliances, class 7), an indie studio trades as MinMax Games (its 2012 US "MINMAX GAMES" RPG application by a different, New Jersey LLC was abandoned in 2014), and MiniMax Group is a HKEX-listed AI company with identical phonetics [40]–[50]. Treat it as a codename; run clearance. (confidence: high)

## Findings

### 1. Gamified fitness and health-RPG apps

| Product | Model / price (US) | Public traction | Works / lacks |
|---|---|---|---|
| **Habitica** (2013) | Free core; $4.99/mo, $47.99/yr for cosmetics/gems [20] | "4M+ registered" per third parties (unverified) | Habit → RPG loop, parties. Self-reported only; moderators left Dec 2022, Tavern/guilds removed Aug 2023; research notes "counterproductive effects of gamification" [21] |
| **Zombies, Run!** (2012) | Free tier; $6.99/mo or $49.99/yr [23] | 750k players by 2014 [22]; ~300k MAU / ~50k payers (third-party, unverified) | Audio narrative makes running cinematic. Story "repetitive after many seasons", no fitness-data sync, no leaderboards; OliveX bought Six to Start for $9.5M (2021), cut staff; co-creator Naomi Alderman took it back (Nov 2025 [23] / 2026 [22]) |
| **Fitness RPG / Walking RPG** (Shikudo) | Free + IAP | Google Play "Best of 2019"; 4.3★ ~8.6k ratings; iOS 4.6★ ~50k downloads [24][25] | Steps → hero XP, maps, arena. "Repetitive grind", "800+ missing steps per login"; sync only via Fitbit/Google Fit |
| **Walkr** (Fourdesire) | IAP $1.99–99.99; Super Pilot $1.99/mo [26] | 1M+ Android downloads | Cute space loop around steps; steps only, cartoon |
| **Pikmin Bloom** (Niantic/Scopely) | F2P | $100M lifetime spend (1 Dec 2025); $34.8M in Jan–Nov 2025, already its best year; 667k installs Nov 2025 (AppMagic estimates) [27] | Walking as planting; player spending has grown every year since launch; steps only |
| **Pokémon GO** | F2P | >$8B lifetime spend, 20M+ WAU; Scopely bought Niantic games for $3.5B (Mar 2025) [28] | Walking is a side effect, not a health product |
| **Ring Fit Adventure** | $80 one-off | 15.38M units by Mar 2023 [19] | Exercises as RPG attacks works at scale; console-bound, "simplistic" |
| **Zwift** | $19.99/mo or $199.99/yr (€19.99 EU); up from $14.99 in May 2024 [35][36] | 550k accounts (Jan 2018); $450M from KKR (2020) [35] | Levels, XP, drops, unlocks, "Ride Ons"; needs trainer hardware |
| **Strava** | $11.99/mo or $79.99/yr; Family $139.99; +Runna $149.99 (from 1 Jul 2025) [12] | "Over 150 million athletes" (Aug 2025, official) [13]; ~180–200M and ~$500M ARR in 2026 IPO coverage (unverified) [14] | Segments, kudos, 1M+ clubs, Athlete Intelligence; social graph, not a health model; payer share undisclosed (est. 3–15%) |
| **Nike Run Club / NTC** | Free | "100M+ users" (third-party) [15] | Badges, coaching; loss-leader for shoes |
| **Freeletics** | Coach in blocks ~$34.99/3 mo to ~$89.99/12 mo; lifetime $549.99 (third-party, unverified) [16] | "60M users" (unverified) | AI bodyweight coach; no wearable stats |
| **Sweatcoin / STEPN / Step App** | Steps → tokens/rewards | Sweatcoin: 200M+ users claimed, ~$10M revenue, 22.5M downloads in 2025 [30]; STEPN −50% earnings 1 Jan 2026; Step App closed Aug 2026 [29] | Cheap acquisition, Ponzi-like economics, category "in structural decline" |

**Newer "your body as a character" apps (2023–26), the true comparables:**

- **Forjum** (© 2026, TestFlight beta): Apple Watch (Series 4+) and Wear OS data → five stats: Might (strength load), Agility (speed/reaction), Vitality (VO2max/cardio load), Spirit (sleep + HRV), Presence (social). Readiness 0–100, 16+ sensor-verified minigames, async duels. On-device only, no cloud, no ads, no sign-up. Free; Supporter €1.99/mo; Premium €4.99/mo. Explicit "no fake progression" and a stated aim to make itself unnecessary within a year. No Garmin/Oura/Whoop [31][32]. (confidence: high)
- **Fitscape** (BitLark LLC): Apple Health steps/workouts/sleep → hero, loot, quests; $3.99–7.99/mo; 4.1★ from 73 ratings; reviews cite thin content and few players; v2026.10 shipped this week [33].
- **Level-UP: Fitness** (solo dev): manually logged workouts → dungeons and gear; 4.0★ from 177 ratings; last update Feb 2025 [34].

No venture-funded startup in this niche surfaced; 2025–26 fitness capital went to Whoop ($575M), Oura ($900M) and Function Health ($298M + $450M) [4][9][17]. (confidence: medium)

### 2. Premium health and longevity ecosystems

| Product | Price | Score(s) shown | Notes |
|---|---|---|---|
| **Whoop** (5.0/MG, May 2025) | One $199/yr, Peak $239/yr, Life $359/yr ($25/30/40 mo); hardware included; stops tracking without membership [1][3] | Recovery, Strain, Sleep; **Healthspan = WHOOP Age + Pace of Aging** (Peak/Life), nine inputs incl. sleep hours/consistency, HR-zone time, strength-training time, steps, VO2max, RHR, lean mass [2] | 2.5M+ members, bookings +103% in 2025, $1.1B run-rate [4]. FDA warning letter 14 Jul 2025 over "medical-grade" Blood Pressure Insights, closed 2026 [5]. May 2025 upgrade-fee backlash and reversal [3] |
| **Oura** (Ring 4; Ring 5 listed at $399–499) | $5.99/mo or $69.99/yr [6][7] | Readiness, Sleep, Activity; Resilience, Daytime Stress, **Cardiovascular Age**, Cardio Capacity, Symptom Radar; Oura Advisor AI | FY2025 revenue $907.9M; 9-month FY2026 $1.21B (+74%); 5M paid members; DAU = 65% of MAU; IPO target >$16B [8][9] |
| **Garmin Connect+** (Mar 2025) | $6.99/mo or $69.99/yr [10] | Body Battery, Training Readiness, VO2max and its **age/sex percentile stay free**; Connect+ adds AI "Active Intelligence", dashboards, live activity, badges [10][11] | Launch met with skepticism; Garmin: "It's your data" |
| **Apple Fitness+ / Health** | $9.99/mo or $79.99/yr [12] | Rings, Cardio Fitness band (Low → High), **no readiness score** | Content, not scoring |
| **Fitbit Premium** | $9.99/mo or $79.99/yr (third-party) [13] | Daily Readiness (now free), Sleep Profile, Cardio Load, Gemini coach | — |
| **Gentler Streak** | ~$7.99/mo or $54.99/yr [14] | "Go Gentler" daily suggestion, Activity Path; no hard score | Apple Watch only; App of the Year 2022 [15b] |
| **Athlytic** | ~$2.99/mo or $24.99/yr [14] | Recovery % vs 60-day HRV baseline, Exertion | Apple Watch only |
| **Bevel** | $14.99/mo or $99.99/yr [14] | Recovery, Strain, Sleep, Nutrition, **Biological Age**; reads Apple Watch, Garmin, Oura, Whoop | Closest multi-wearable aggregator; "can feel like a lot" |
| **Function Health** | $365/yr, 160+ lab tests; MRI $499 post-Ezra (May 2025) [16][17] | Clinician-reviewed results and action items; no composite score found | 100k+ members (2024); $2.5B valuation (Nov 2025); criticised for alarmist claims [17] |
| **Superpower** | $349/yr, 150+ biomarkers [18] | **Biological age, 17 health scores, pace of aging**; syncs Apple Health, Whoop, Oura | Direct score-stack rival if MINMAX adds labs |
| **InsideTracker** | $149/yr; InnerAge $99; Ultimate test ~$589 [19b] | "Optimized zones" per biomarker, 10 healthspan scores; "normal does not mean optimal", explicitly not percentiles | Connects Apple Health, Oura, Fitbit, Garmin |
| **Zoe** | UK £149 kit + £9.99/mo (cut 60%); US ~$399 kit + $24.99–59.99/mo (third-party) [20b] | Food and gut scores; blood responses now algorithmic | Losses widened as price fell (unverified detail) |
| **Lumen** | ~$199–299 device + $19/mo (third-party) [21b][22b] | Fat vs carb burn %, "Body State", one next action | Accuracy questioned by reviewers |

Pattern: every premium player converges on **one daily readiness number plus one "age"**, and the ages are proprietary composites validated in white papers, not guidelines [2][9]. (confidence: medium)

### 3. Where the gap is

(a) **Honest normative percentiles.** Garmin shows a VO2max percentile; small utilities compute ACSM/Cooper percentiles; InsideTracker argues against norms. No product leads with percentiles across strength, aerobic, mobility, recovery and nutrition, and none labels advice by evidence tier [11][19b]. **Open.** (confidence: medium)

(b) **RPG character from real data.** Forjum does it best, Fitscape and Shikudo from steps/workouts; all are Apple Watch/Wear OS/pedometer-only, indie-scale, and have no origins, classes or bottleneck structure [31][33][24]. **Partially filled at the low end.**

(c) **One engine for gamers, athletes and mainstream.** Habitica serves gamers, Strava/Zwift/Whoop athletes, Oura/Apple mainstream. Nothing offers a game surface and a "3 goals this week" surface over one data model; Gentler Streak is the nearest Simple-Mode analogue [15b]. **Open.**

(d) **Verifiable-but-private achievements.** Strava/Zwift results are public and device-trust only; Whoop/Oura keep all private. Midnight provides Compact, zk-SNARKs and selective disclosure, and a prototype proves "cholesterol ≤ 200" as one bit, but no consumer fitness app uses it [38][39]. **Open, zero demand signal yet.** (confidence: medium)

**Closest three competitors**

1. **Forjum**: same core idea (biometrics → honest RPG stats, privacy-first). MINMAX differs via multi-source ingestion with provenance and trust tiers, lab/nutrition stats, Origin + Class + Bottleneck world, Simple Mode, percentile/evidence labels, later verifiable claims. Risk: cheaper (€4.99) and already in beta.
2. **Whoop Peak ($239/yr)**: the premium "your body, scored, with longevity narrative" benchmark. MINMAX differs by hardware agnosticism, percentiles instead of "WHOOP Age", and the game surface. Risk: Healthspan already uses strength time, steps, VO2max and lean mass, the same inputs as MINMAX stats [2].
3. **Bevel ($99.99/yr)**: multi-wearable aggregator with Biological Age. MINMAX differs via identity layer, guideline-anchored quests, provenance and two surfaces. Risk: Bevel could add an RPG skin quickly.

### 4. Name check: "MinMax" / "MINMAX" / "Min-Max"

| In use | What | Relevance |
|---|---|---|
| **MinMax Fitness** (Google Play `com.trainerize.minmaxfitness`, ABC Fitness Solutions) | White-label coaching app, Health & Fitness [40]; minmaxfitness.com did not resolve today | Identical word, same class |
| **Min-Max Fitness** (Erina, NSW, Australia) + **Min-Max Fitness App** (`com.mypthub.minmaxfitnessapp`) | PT business for 40+ with its own app [41][42] | Same word, same class, live |
| **The Min-Max Program** (Jeff Nippard) | 12-week hypertrophy program from a top fitness YouTuber [43] | Strong consumer association; SEO collision |
| **MinMax** (`co.minmax.app`, MinMax Inc.) | Video-creation app live since Oct 2024; **owns minmax.app** [44][45] | Domain gone; software overlap |
| **MinMax Games Ltd** (BC, Canada) | Indie studio; US mark "MINMAX GAMES 1 20" filed 13 Feb 2012 for role-playing games [46][47] | Games class, RPG goods named |
| **MINMAX** (Chen Xiaosheng, US serial 79322260 / IR 1617769) | Kitchen appliances, pending since 2021 [48] | Different class; word contested internationally |
| **MiniMax Group** (Shanghai; HKEX 0100 since Jan 2026) | AI firm (Hailuo); sued by Disney/Universal/WBD Sep 2025 [49][50] | Phonetically identical; negative press; search pollution |
| **MinnMax** (Minnesota) | Games media company [51] | Gamer-audience overlap |

Not checkable with the tools available: EUIPO eSearch, Swissreg (IGE), DPMAregister, USPTO TESS directly, WHOIS for minmax.health / getminmax.com / minmax.fit. **Unverified**; a clearance search is required.

**Risk (not legal advice): high.** Identical marks already sit in the fitness-app class; "min-maxing" is a generic gaming term, so the mark would be weak for a game-like product; the .app domain is taken; MiniMax AI owns search and voice. (confidence: high on facts, medium on legal weight)

**Alternative names (unchecked):** *Statborn*, *Kinforge*, *Vitalforge*, *Originline*, *Bottleneck* ("find your bottleneck"). Check all against EUIPO, Swissreg, USPTO, app stores and .app/.health domains in one pass.

## Implications for MINMAX

1. **Position against Whoop Peak and Bevel, not Pokémon GO.** The $70–240/yr buyer exists and buys scores; pitch "same inputs, shown honestly as percentiles with evidence tiers, wrapped in an identity you keep." Software-only at ≤ $9.99/mo or ~$69–79/yr; a higher tier for labs and verified claims.
2. **Multi-source ingestion with provenance is the moat against Forjum/Fitscape.** Launch with Garmin + HealthKit + Health Connect and show the trust tier on every stat. Match Forjum's privacy bar (on-device or an equally clear story).
3. **Design for the churn data.** With 3–4% day-30 retention and ~47% 90-day paid churn, week one must deliver the Origin reveal and one completed quest with zero manual logging where a device exists. Mis-counted data kills gamification trust; provenance and confidence labels are the fix competitors lack.
4. **No proprietary "biological age".** Credibility comes from percentile bands anchored to published norms (ACSM/Cooper VO2max, strength norms, step guidelines) and from labelling the rest "plausible / individual / experimental".
5. **No tokens, ever.** Keep ZK verification as a trust feature (prove "VO2max ≥ 50, Garmin-derived" to a challenge or insurer), scheduled after retention is proven.
6. **Rename before filing.** Keep MINMAX as codename; budget one clearance search.
7. **Dark, cinematic, adult is an open lane.** Every RPG rival is cartoon/pixel; every premium rival is a clinical dashboard.

## Open questions

- Forjum's real traction and whether it adds Garmin/Oura; revisit after it leaves TestFlight.
- Strava's and Whoop's payer counts and churn; Strava's S-1 (confidential since Feb 2026) would set the conversion benchmark.
- Which normative datasets Garmin uses, and which exist for strength, mobility and recovery that MINMAX can cite.
- Legal status of MINMAX in EUIPO, Swissreg, DPMA; WHOIS for minmax.health / getminmax.com.
- Midnight mainnet status and whether any insurer or wellness buyer would accept a ZK attestation.
- Zombies, Run! ownership date (Nov 2025 vs 2026) and real MAU; official Fitbit Premium and Freeletics prices.

## Sources

1. WHOOP Pricing 2026: All 3 Plans Compared — https://trackervs.com/pricing/whoop-pricing/ — accessed 2026-10-02 (official join.whoop.com and whoop.com/membership returned 403)
2. Understanding WHOOP Age & how it differs from Pace of Ageing — https://gadgetsandwearables.com/2025/05/09/whoop-age-pace-of-ageing/ — accessed 2026-10-02
3. Whoop (company) — Wikipedia — https://en.wikipedia.org/wiki/Whoop_(company) — accessed 2026-10-02
4. Whoop lands $575M at $10.1B valuation — Crunchbase News — https://news.crunchbase.com/venture/wearable-fitness-tech-ai-whoop-seriesg-funding/ — accessed 2026-10-02
5. FDA Warning Letter to WHOOP, Inc., 14 Jul 2025 — https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/whoop-inc-709755-07142025 — accessed 2026-10-02
6. Oura Membership — https://ouraring.com/membership — accessed 2026-10-02
7. Oura Ring 5 store page — https://ouraring.com/store/rings/oura-ring-5 — accessed 2026-10-02
8. Oura IPO Could Hit $16 Billion Valuation as Revenue Jumps 74% — Yahoo Finance (4 Sep 2026) — https://finance.yahoo.com/markets/stocks/articles/oura-ipo-could-hit-16-071029772.html — accessed 2026-10-02
9. Oura reaches $11 billion valuation with new $900 million fundraise — CNBC — https://www.cnbc.com/2025/10/14/oura-ringmaker-valuation-fundraise.html — seen in search results 2026-10-02 (not fetched)
10. Garmin Connect+ Paid Subscription: Hands-on Thoughts & Analysis — DC Rainmaker — https://www.dcrainmaker.com/2025/03/garmin-connect-plus-subscription-walkthrough.html — accessed 2026-10-02
11. What's a good VO2 max for me? — Garmin Blog — https://www.garmin.com/en-US/blog/fitness/whats-a-good-vo2-max-for-me/ — accessed 2026-10-02
12. Apple Fitness+ — https://www.apple.com/apple-fitness-plus/ — accessed 2026-10-02; Strava pricing — https://www.strava.com/pricing — accessed 2026-10-02
13. Fitbit Premium vs Free in 2026 — WearableBeat — https://wearablebeat.com/articles/fitbit-premium-vs-free-is-the-subscription-worth-it/ — seen in search 2026-10-02 (fetch returned 403); Strava mid-year data (26 Aug 2025) — https://press.strava.com/articles/strava-mid-year-data-shows-how-athletes-are-tracking-toward-2025-goals — accessed 2026-10-02
14. Athlytic vs Bevel vs Gentler Streak vs PeakWatch (2026) — https://www.healthappinsider.com/en/comparisons/athlytic-vs-bevel-vs-gentler-streak — accessed 2026-10-02; Strava Files for IPO — the5krunner — https://the5krunner.com/2026/01/09/strava-ipo-filing-3-billion-valuation-analysis/ — accessed 2026-10-02
15. Nike Run Club gamification — StriveCloud — https://www.strivecloud.io/blog/gamification-examples-nike-run-club — seen in search 2026-10-02 (not fetched)
15b. Gentler Streak — https://gentlerstories.com/gentlerstreak/ — accessed 2026-10-02
16. Function Health — https://www.functionhealth.com/ — accessed 2026-10-02; Freeletics vs BetterMe vs Fitify (2026) — https://www.sensai.fit/blog/freeletics-vs-betterme-vs-fitify-2026 — seen in search 2026-10-02 (not fetched)
17. Function Health — Wikipedia — https://en.wikipedia.org/wiki/Function_Health — accessed 2026-10-02
18. Superpower — https://superpower.com/ — accessed 2026-10-02
19. Ring Fit Adventure — Wikipedia — https://en.wikipedia.org/wiki/Ring_Fit_Adventure — accessed 2026-10-02
19b. InsideTracker Membership — https://store.insidetracker.com/products/insidetracker-membership — accessed 2026-10-02
20. Habitica Pricing — MainQuest — https://www.mainquest.net/habitica-pricing — accessed 2026-10-02
20b. Zoe gut health app losses swell as it cuts membership price — The Grocer — https://www.thegrocer.co.uk/news/zoe-gut-health-app-losses-swell-as-it-slashes-membership-price/718306.article — seen in search 2026-10-02 (fetch returned 405); ZOE Pricing Analysis — https://healthrx.com/brands-zoe/pricing-analysis — seen in search
21. Habitica — Wikipedia — https://en.wikipedia.org/wiki/Habitica — accessed 2026-10-02
21b. Lumen — https://www.lumen.me/ — accessed 2026-10-02
22. Zombies, Run! — Wikipedia — https://en.wikipedia.org/wiki/Zombies,_Run! — accessed 2026-10-02
22b. Lumen Review — Garage Gym Reviews — https://www.garagegymreviews.com/lumen-review — seen in search 2026-10-02 (not fetched)
23. Zombies, Run! Review 2026 — Motera — https://www.motera.app/zombie-run-app — accessed 2026-10-02
24. Fitness RPG: Walking Games — Google Play — https://play.google.com/store/apps/details?id=com.shikudo.fitrpg.google&hl=en&gl=US — seen in search 2026-10-02
25. Walking RPG: Hero health game — App Store — https://apps.apple.com/us/app/walking-rpg-hero-health-game/id1252580641 — seen in search 2026-10-02
26. Walkr: Fitness Space Adventure — Google Play — https://play.google.com/store/apps/details/Walkr_Fitness_Space_Adventure?id=com.fourdesire.spacewalk&hl=en_GB&gl=US — seen in search 2026-10-02; Common Sense Media review — https://www.commonsensemedia.org/app-reviews/walkr-a-gamified-fitness-app
27. Pikmin Bloom hits $100m after four years — PocketGamer.biz — https://www.pocketgamer.biz/pikmin-bloom-hits-100m-after-four-years-as-2025-becomes-its-best-year-yet/ — accessed 2026-10-02
28. Scopely to acquire Niantic's game business for $3.5 billion — Game World Observer — https://gameworldobserver.com/2025/03/12/scopely-niantic-game-business-3-5-billion-acquisition — accessed 2026-10-02
29. Step App Shuts Down After 4 Years — The Crypto Times (6 Aug 2026) — https://www.cryptotimes.io/2026/08/06/step-app-shuts-down-after-4-years-fitfi-token-collapses-to-near-zero-market-cap/ — accessed 2026-10-02; Is Move to Earn Dead in 2026? — https://bitletics.com/blog/move-to-earn-2026/ — seen in search
30. Sweatcoin Revenue and Usage Statistics (2026) — Business of Apps — https://www.businessofapps.com/data/sweatcoin-statistics/ — seen in search 2026-10-02 (fetch returned 403)
31. Forjum — Fitness RPG for Apple Watch & Wear OS — https://www.forjum.com/ — accessed 2026-10-02
32. Join the Forjum beta — TestFlight — https://testflight.apple.com/join/P6WBKV2J — seen in search 2026-10-02
33. Fitscape – Fitness RPG Quests — App Store — https://apps.apple.com/us/app/fitscape-fitness-rpg-quests/id1602746868 — accessed 2026-10-02
34. Level-UP: Fitness — App Store — https://apps.apple.com/us/app/level-up-fitness/id6499099763 — accessed 2026-10-02
35. Zwift — Wikipedia — https://en.wikipedia.org/wiki/Zwift — accessed 2026-10-02
36. Zwift pricing page — https://www.zwift.com/pricing — accessed 2026-10-02 (prices not rendered); Zwift's subscription price increase explained — Mountain Massif — https://mountainmassif.com/news/zwift/zwifts-subscription-price-increase/ — seen in search
37. Why Most Health App Users Churn Within 90 Days — Sahha — https://sahha.ai/blog/health-app-churn-retention/ — accessed 2026-10-02; Continued usage of mobile fitness applications: a systematic literature review — Springer (2025) — https://link.springer.com/article/10.1007/s11301-025-00537-1 — seen in search (paywalled)
38. What is Midnight? — Midnight Documentation — https://docs.midnight.network/what-is-midnight — accessed 2026-10-02
39. WeOwnHealth/passport: ZK clinical-trial matching on Midnight — GitHub — https://github.com/WeOwnHealth/passport — seen in search 2026-10-02
40. MinMax Fitness — Google Play — https://play.google.com/store/apps/details?id=com.trainerize.minmaxfitness&hl=en_US — seen in search 2026-10-02 (page content truncated on fetch)
41. Min-Max Fitness — Trainerize profile — https://www.trainerize.me/profile/min-maxfitness — accessed 2026-10-02
42. Min-Max Fitness App — APKPure — https://apkpure.com/min-max-fitness-app/com.mypthub.minmaxfitnessapp — seen in search 2026-10-02 (fetch returned 403)
43. The Min-Max Program — Jeff Nippard — https://jeffnippard.com/products/the-min-max-program — accessed 2026-10-02
44. MinMax — Google Play (`co.minmax.app`) — https://play.google.com/store/apps/details?id=co.minmax.app&hl=en_US — seen in search 2026-10-02
45. MinMax for Android — AppBrain — https://www.appbrain.com/app/minmax/co.minmax.app — seen in search 2026-10-02 (fetch returned 403)
46. MINMAX GAMES 1 20 — Justia Trademarks (serial 85541143) — https://trademarks.justia.com/855/41/minmax-games-1-85541143.html — seen in search 2026-10-02 (fetch returned 403)
47. MinMax Games — https://www.minmax-games.com/ — seen in search 2026-10-02
48. MINMAX — Justia Trademarks (serial 79322260, Chen Xiaosheng) — https://trademarks.justia.com/793/22/minmax-79322260.html — seen in search 2026-10-02 (fetch returned 403)
49. MiniMax Group — Wikipedia — https://en.wikipedia.org/wiki/MiniMax_Group — accessed 2026-10-02
50. Disney, WBD, NBCU sue MiniMax — Variety — https://variety.com/2025/digital/news/disney-warner-bros-discovery-nbcu-lawsuit-minimax-chinese-ai-company-1236520395/ — seen in search 2026-10-02
51. MinnMax — Wikipedia — https://en.wikipedia.org/wiki/MinnMax — accessed 2026-10-02
