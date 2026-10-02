# User Psychology and Retention Design: Does RPG Framing Have Mainstream Appeal, and How Do We Avoid Harm?

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

## Summary for the founder

- **You are not thinking "too much like a gamer". You are using gamer vocabulary.** The average US player is 36 and the split is 52 % men / 47 % women (ESA, June 2025). In ESA's 21-country survey (Oct 2025) the average player is 41 and the split is 51/48 [10][11]. Ring Fit's launch buyers were mostly 20–30 and "a lot of them are women" [12]. Finch, a soft pet-and-quests self-care app, has 4.9★ from ~758k App Store ratings [13]. Game *mechanics* travel to the mainstream. Hard-core RPG *words* like "build", "min-max" and "bottleneck" are the part that may not. (confidence: medium)
- **Gamification works, but the effect is small.** In 16 RCTs it had a small-to-medium short-term effect (g = 0.42) that shrinks to g = 0.15 after the programme ends [1]. Against the *same app without game features*, it adds only ~489 steps/day, which the authors call "trivial" [2]. The game layer cannot be the product. Honest, useful measurement has to be. (confidence: high)
- **Social design matters more than badges.** In STEP UP (n = 602), competition was the only arm still clearly ahead 12 weeks after the game was switched off (+569 steps/day). The collaboration effect disappeared (+126, n.s.) [3]. Strava kudos raised running, but runners drifted towards their *less* active peers [24]. (confidence: high)
- **Numbers change how people feel, not only what they do.** People given fake bad sleep feedback felt worse the same day (d = 0.55–0.79) [19]. People given a fake "high genetic risk" result ran with worse physiology [21]. Tracking raises output but lowers enjoyment [6]. A low stat or a "weak" Origin can turn into a self-fulfilling label. (confidence: high)
- **Streaks retain when they are forgiving.** Duolingo raised Day-14 retention and the share of learners on a streak by making the streak *easier* to keep: one lesson a day, separate from the daily goal [8]. Apple added "Pause Rings" that leave award streaks intact [33]. Default to forgiveness. (confidence: high)
- **Nutrition quests are the highest-risk feature.** 73 % of eating-disorder patients who used MyFitnessPal said it contributed to their disorder [28]. Warnings, red numbers and streaks were turned into self-punishment [27]. Causality is not proven [26], but the design rules are clear: no calorie-deficit quests, no weight-loss XP, no streaks on food logging. (confidence: medium)
- **Do not let progression enforce load.** The "10 % rule" did not prevent injuries in an RCT [31]. Novice runners who increased weekly distance by >30 % had more distance-related injuries [32]. Cap quest progression and reward rest. (confidence: medium)
- **Trial design:** in Health & Fitness, 5–9 day trials convert best (46.8 %). Longer trials raise first renewal from 51.5 % to 77.1 % [34]. A 7-day trial built around one "first win" in week 1 fits this data. (confidence: medium)

## Findings

### 1. Does gamification change health behaviour?

**Effect sizes.** Mazeas et al. (JMIR 2022) pooled 16 RCTs (n = 2,407):
- Short-term effect on physical activity: Hedges g = 0.42 (95 % CI 0.14–0.69), about +1,610 steps/day.
- Against active non-gamified interventions: g = 0.23.
- At follow-up (about 14 weeks after the intervention ended): g = 0.15.

The authors read this as "not just a novelty effect", although the effect does decay [1]. Nishi et al. (eClinicalMedicine 2024) compared apps *with vs without* gamification: 36 RCTs, n = 10,079. They found +489 steps/day (high certainty), no effect on MVPA, and small drops in BMI (−0.28) and body weight (−0.70 kg). Their conclusion is that the improvements are "trivial" [2]. (confidence: high)

**Design details change the outcome.** STEP UP randomised 602 adults with overweight to three gamified arms plus control, for 24 weeks with 12 weeks of follow-up [3]:

| Arm | During the 24 weeks (steps/day vs control) | During follow-up |
|---|---|---|
| Competition | +920 | +569 |
| Support | +689 | +428 |
| Collaboration | +637 | +126 (not significant) |

(confidence: high)

**Crowding-out.** Deci, Koestner & Ryan's meta-analysis of 128 experiments found that tangible rewards contingent on engagement, completion or performance reduce free-choice intrinsic motivation (d = −0.40, −0.36, −0.28). Positive informational feedback *increased* it (d ≈ +0.33) [4]. In a 16-week course, students with badges and leaderboards ended up with *lower* intrinsic motivation than students in the non-gamified course [5]. Etkin's six experiments showed that measuring an activity increases how much people do but lowers enjoyment and well-being [6]. For XP the implication is: **XP that informs ("your Aerobic rose because your VO2max estimate rose") is safe. XP that bribes ("+50 XP for logging") is the risky kind.** (confidence: medium; these studies are lab and classroom work, not fitness apps)

**Habitica.** A study of Habitica users found counterproductive effects in every participant. Examples: being "punished" in productive weeks, and relabelling tasks to dodge damage. Perceived inappropriateness of the rewards predicted falling motivation. A follow-up reports that only 49 % rate Habitica's rewards as appropriate [7]. (confidence: medium, seen via abstract)

**Zwift.** In Dec 2023 Zwift raised the cycling level cap from 60 to 100 and eased the XP curve [17]. In July 2024 it quietly *raised* the XP needed for levels 28+: level 100 went from ~591k to ~807k XP. One rider had gone from level 61 to 100 in 25 days under the old curve. Players were angry mainly because the change was not communicated [16]. Lesson: design the XP curve and the endgame up front, and announce any change to it. (confidence: medium)

### 2. Streaks: the Duolingo evidence

Duolingo's own data [8][9]:
- Learners who reach a 7-day streak are 2.4× more likely to come back the next day.
- Separating "streak = one lesson" from the daily XP goal produced +3.3 % Day-14 retention, +1 % DAU and +10.5 % learners on a streak (+19 % for new learners).
- Learners with "intense" goals kept streaks *least*.
- The share of daily learners with 7+ day streaks rose from ~33 % to >50 %.
- Streak Wager gave +14 % Day-7 retention.
- The Weekend Amulet made learners 4 % more likely to return a week later.

A widely repeated claim that streak freezes cut at-risk churn by 21 % comes from third-party blogs and is **unverified**. Apple's watchOS 11 added "Pause Rings" without breaking award streaks, and per-weekday goals, so that rest and injury do not count as failure [33]. (confidence: high for Duolingo's published figures)

### 3. Is the audience really "gamers"?

- **US (ESA, June 2025):** average player 36, 52 % men / 47 % women, 205.1M Americans play, 60 % of adults play weekly. Among boomers, women play more than men [10].
- **Global (ESA, Oct 2025, n = 24,216, 21 countries):** average age 41, 51 % men / 48 % women. Mobile is the main platform (55 %). The top motivations are fun (66 %) and stress relief (58 %) [11].
- **Ring Fit Adventure:** Nintendo's president said launch buyers were largely 20–30 and "a lot of them are women" [12]. It has sold 15.38M units (see competitors.md).
- **Finch:** 4.9★ from ~758k App Store ratings, Apple Editors' Choice, explicitly "no penalty for missed goals" [13]. Third-party estimates of ~$30M ARR, no VC money and ~75 % women users are **unverified** [14].
- **Peloton Lanebreak:** a game mode tucked inside a mainstream fitness product ("More Rides" tab) [15].

My reading (inference, confidence: medium): mainstream adults already play games and accept *mechanics* such as rings, streaks, levels, quests and pets. What filters people out is *tone*: grind, punishment, combat-stat jargon, and the "hardcore" aesthetic. MINMAX's dark, cinematic look is fine for gamers and fitness people. For mainstream users the risk is in the words and in failure states, not in the presence of levels.

### 4. Scores, labels and identity

- **Readiness scores.** Seventeen long-term Whoop/Oura users said they changed *non-exercise* behaviour to optimise their scores. They also stressed that "you can't really capture the complexities of a human on a device" and fell back on their own judgement [18].
- **Nocebo.** In insomnia patients, sham *negative* sleep feedback worsened alertness (d = 0.79) and fatigue (d = 0.55) that day compared with positive feedback [19].
- **Orthosomnia.** Depending on the cut-off, 3–14 % of a young, mostly female sample had orthosomnia (anxious preoccupation with tracked sleep), linked with worse insomnia scores [20].
- **Labels are self-fulfilling.** People randomly told they had "high-risk" obesity genes showed worse cardiorespiratory physiology, higher perceived exertion and shorter running endurance, independent of their real genotype [21].
- **Perceived fitness predicts outcomes.** People who believed they were *less active than their peers* had higher mortality, even after adjusting for measured activity (three US samples, n = 61,141) [22]. A percentile shown carelessly can create exactly that belief.
- **Identity-based motivation.** When an action feels identity-congruent, difficulty is read as "this matters". When it feels incongruent, the same difficulty means "not for people like me" [23].

**Fitness-age and "biological age" scores:** I found no controlled study of how they change behaviour. **Unverified**; treat them as high-nocebo-risk by analogy with [19][21].

Implication for Origin: "Ironblood" will motivate if it reads as *the identity of someone who trains*, with Aerobic as the next frontier. It will harm if it reads as *you are the kind of person who can't run*. Stereotype-threat evidence specific to fitness archetypes was not found (gap).

### 5. Social features

- **Kudos.** In 329 runners across five Strava clubs (19,026 kudos ties), receiving kudos increased running frequency and volume. But "athletes were more likely to come to resemble the running behavior of their kudos-friends who ran less" [24]. Social graphs can drag people *down*. Recommend peers at a similar level or slightly above, and do not build big global feeds.
- **Competition** produced the most durable effect in STEP UP [3]. **Leaderboards with badges** reduced intrinsic motivation in Hanus & Fox [5]. My synthesis: competition works in small, matched groups (STEP UP used small teams) and backfires as public global ranking.
- **Privacy.** Strava's 2018 global heatmap exposed military bases. The problem was that location sharing was on by default, and Strava had to restrict the data afterwards [25]. Social features should share *claims*, not routes or raw values. This fits MINMAX's claim/ZK design.

### 6. Harm: eating disorders, compulsive exercise, injury

- **Eating disorders.**
  - Simpson & Mazzeo (n = 493 students) linked calorie tracking with eating concern and restraint, and fitness tracking with ED symptoms [29].
  - Levinson et al.: ~75 % of ED patients used MyFitnessPal. 73 % of those said it contributed to their disorder, and 63 % said "at least moderately" [28].
  - Eikey (2021, 24 women) found that MyFitnessPal's "Complete Diary" warnings, red/green calorie colours, streaks and reminders were all turned into fuel for restriction [27].
  - A 2025 systematic review (27 studies): the association is consistent, causality is unproven, and risk is higher with frequent use and with *weight/shape* goals rather than health goals [26].
- **Compulsive exercise.** A 2026 meta-analysis (30 studies) estimates exercise-addiction prevalence at 12.26%. It is higher in fitness training and triathlon and ~15 % higher in 18–30-year-olds [30]. These are exactly MINMAX's "fitness people".
- **Injury.**
  - A graded 13-week programme based on the 10 % rule did not reduce injuries in 532 novice runners (20.8 % vs 20.3 %) [31].
  - In 874 novices, increasing distance by >30 % over two weeks was associated with more distance-related injuries [32].
  - So, progression caps should be conservative and well explained, not presented as precise rules.
- **Dark patterns.** Noom settled for $56M plus $6M in credits over trial auto-renewal disclosure and cancellation. It agreed to explicit opt-in, reminder emails and turning off auto-renew for inactive users [35].
- **Minors.** The UK Children's Code requires high-privacy defaults, profiling and geolocation off by default, and no nudges to weaken privacy [36]. App-store rules on health data for children are in regulatory.md.

### 7. Onboarding, trials and defaults

- **Retention baseline.** Fitness apps keep ~3–4 % of users at day 30 (competitors.md, third-party).
- **Trial length (RevenueCat, 17,000+ apps, Aug 2025–Jul 2026)** [34]:
  - 17+ day trials convert at a 42.5 % median vs 25.5 % for ≤4 days.
  - Health & Fitness peaks at 5–9 days (46.8 %).
  - First renewal rises from 51.5 % (≤4 days) to 77.1 % (17–32 days).
- **Defaults.** Fewer than 5 % of Word users changed *any* of 150+ settings [37]. Opt-out countries reached organ-donor consent "frequently above 90 %" vs low rates under opt-in [38]. Whichever surface (Game or Simple) is the default, most people will stay there.
- **Order of onboarding.** I found no controlled study comparing "import data first" with "questions first" in health apps (gap). Duolingo's evidence that lowering the barrier beats raising ambition early on [8] favours the shortest route to a first visible result.

## Implications for MINMAX

**Design principles**

1. **Game layer on top of something useful.** Gamification adds about +489 steps/day over the same app without it [2]. The retention engine has to be honest measurement plus good weekly quests. XP is the presentation. *Evidence: [1][2].*
2. **XP should inform, not pay.** Award XP for real, provenance-tagged change in stats and for completing quests, with the explanation attached. Never give XP for opening the app or logging food. *Evidence: [4][6].*
3. **Pick the default surface by context, and make it obvious.** Ask one plain question in onboarding ("Show my progress as a game character / as simple weekly goals"). Pre-select based on the acquisition channel (game-store ads → Game; health/wearable channels → Simple). Defaults stick [37][38]. Both surfaces must share one character and one quest list (Lanebreak-style coexistence [15]).
4. **Plain language first, game words second.** In Simple Mode, "Strength 62 (top 40 % for your age)" and never "Bottleneck". In Game Mode, the region name comes *with* the plain label ("The Engine · aerobic fitness"). *Evidence: identity congruence [23]; mainstream tone inference (§3).*
5. **Frame the bottleneck as the next region to explore, not as a deficit.** Write "Your next frontier: The Engine. Biggest gain per hour is here", not "Weakest stat: Aerobic". *Evidence: labels change physiology [21]; difficulty-as-importance [23]; negative-feedback nocebo [19].*
6. **Origin is a strength-based starting point, always revisable in meaning.** Describe each Origin by what it is good at, show a path out of every weakness, and never use "can't" language. Re-measure and show movement within 4 weeks. *Evidence: [21][22].*
7. **Percentiles with care.** Show age/sex percentiles with confidence ranges and evidence tier. Lead with change over time ("+3 percentile points since June") before rank among peers. Do not show "below average" without an action next to it. *Evidence: perceived relative activity predicts mortality [22].*
8. **No daily red scores.** Do not invent a single "readiness" number. When showing device scores, add "how do you feel?" and let subjective feel win. Never block a quest because HRV dipped. *Evidence: [18][19][20].*
9. **Forgiving weekly streaks.** Count streaks in *weeks with ≥1 quest done*, not days. Build rest weeks, injury pause and illness pause into the rules, keeping streaks and levels intact. *Evidence: Duolingo [8][9], Apple Pause Rings [33].*
10. **Ambition grows slowly.** Start with quests a beginner can finish in week 1, then scale. Let users choose a quest's difficulty, with "Standard" as the default. *Evidence: intense goals reduced streak keeping [8]; autonomy [4].*
11. **Cap load progression and reward recovery.** Volume-based quests should not ask for more than ~10–30 % above the user's recent 2-week baseline. Tell users this is a heuristic, not a law. The Sanctum (recovery) must earn XP as fully as The Forge. *Evidence: [31][32].*
12. **Nutrition quests are behaviour-only and never deficit-based.** Allowed: "protein at 3 meals", "vegetables 5 days", "cook 3 times". Prohibited: calorie targets below maintenance, weight-loss XP, food-logging streaks, red/green calorie colours, before/after body imagery. Add a screening question and an opt-out for the whole Garden region. Show support resources if a user reports ED history. *Evidence: [26][27][28][29].*
13. **Compulsive-exercise guardrails.** Flag patterns such as no rest days for 14+ days, rising load with falling self-reported mood, or exercise during reported illness. Respond with a gentle check-in and a rest quest, not more XP. Weekly XP should be capped so extra volume beyond the plan earns nothing. *Evidence: 12.26% prevalence, higher in fitness/triathlon and 18–30 [30].*
14. **Social = small, matched and cooperative-competitive.** Use parties of 3–6 at similar levels and team-vs-team weekly challenges. No global leaderboards; only opt-in, cohort-matched ones. Shared "kudos" should be one tap. *Evidence: competition durable [3]; leaderboards hurt intrinsic motivation [5]; downward assimilation [24].*
15. **Share claims, never routes or raw values. Private by default.** Location, routes and raw biomarkers should never be shared by default. Social posts carry coarse claims ("Engine tier III, device-verified"). *Evidence: Strava heatmap [25].*
16. **First win in week 1, zero manual entry where possible.** Connect wearable → Origin reveal from historical data → one quest sized to finish in ≤7 days. Offer a 7-day trial that ends *after* the first quest completes, with a reminder 2 days before charging. *Evidence: [8][34][35]; churn baseline in competitors.md.*
17. **Under-18: separate mode or no mode.** Either block under-16s or run a teen mode: no nutrition region, no percentiles against adults, no social features, profiling off by default. *Evidence: [36]; regulatory.md.*
18. **Announce any change to the economy.** The XP curve, level caps and the stat formula should be versioned and changelogged. Never silently re-score users. *Evidence: Zwift 2024 [16].*

**Anti-patterns**

- Punishing missed days with HP loss, decay or a lost level (Habitica effects [7]).
- Daily "you are behind" notifications, red-number warnings and shame copy ([19][27]).
- Global public leaderboards for health stats, and "Top 0.1 %" framing ([5][22]).
- Biological age, fitness age or "pace of aging" as headline numbers without confidence intervals ([21]; unverified behaviour effects).
- Calorie budgets, weight-loss quests and body-shape goals ([26][28]).
- XP for raw volume without a cap, which rewards overtraining ([30][32]).
- Hard-to-cancel trials or unclear auto-renewal ([35]).
- Location sharing on by default ([25]).

## Open questions

1. Does the word "Origin" with archetype names help or hurt mainstream users? Run a 5-second test and an A/B test of plain vs fantasy labels. No direct evidence was found.
2. Is the measured effect of Game vs Simple Mode on 30-day retention different by audience? This needs MINMAX's own experiment. No published dual-mode health-app RCT was found.
3. Is importing data first better than a short questionnaire first? No controlled study was found.
4. What is the behavioural effect of "fitness age" and "biological age" scores? Not verified.
5. Duolingo's streak-freeze numbers (the "21 %" churn figure) are unverified. Use only the figures Duolingo published [8][9].
6. Finch's demographics and revenue (~75 % women, $30M+ ARR) are third-party estimates [14].
7. Validated short screeners for ED risk and exercise addiction that can be used in-app, and their licensing, need clinical input.
8. Age gating: block under-16 or under-18 globally, or build a teen mode? This is a regulatory and cost trade-off (see regulatory.md).

## Sources

1. Mazeas A. et al., "Evaluating the Effectiveness of Gamification on Physical Activity: Systematic Review and Meta-analysis of RCTs", JMIR 2022 — https://pmc.ncbi.nlm.nih.gov/articles/PMC8767479/ — accessed 2026-10-02
2. Nishi S.K. et al., "Effect of digital health applications with or without gamification on physical activity and cardiometabolic risk factors", eClinicalMedicine 2024 — https://pmc.ncbi.nlm.nih.gov/articles/PMC11701442/ — accessed 2026-10-02
3. Patel M.S. et al., "STEP UP Randomized Clinical Trial", JAMA Internal Medicine 2019 — https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2749761 — accessed 2026-10-02
4. Deci E.L., Koestner R., Ryan R.M., "A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation", Psychological Bulletin 1999 — https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf — accessed 2026-10-02 (figures from search summary)
5. Hanus M.D., Fox J., "Assessing the effects of gamification in the classroom: a longitudinal study…" (2015) — https://www.researchgate.net/publication/265644737_Assessing_the_effects_of_gamification_in_the_classroom_A_longitudinal_study_on_intrinsic_motivation_social_comparison_satisfaction_effort_and_academic_performance — accessed 2026-10-02 (seen in search)
6. Etkin J., "The hidden cost of personal quantification", Journal of Consumer Research 2016 — https://scholars.duke.edu/publication/1134328 — accessed 2026-10-02 (seen in search)
7. "Counterproductive effects of gamification: An analysis on the example of the gamified task manager Habitica" — https://www.sciencedirect.com/science/article/abs/pii/S1071581918305135 — accessed 2026-10-02 (abstract seen in search)
8. Duolingo, "Improving the streak: Forming habits one lesson at a time" (19 Nov 2020) — https://blog.duolingo.com/improving-the-streak/ — accessed 2026-10-02
9. Duolingo, "How Streaks keep Duolingo learners committed to their language goals" (10 May 2017) — https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/ — accessed 2026-10-02
10. ESA, "Annual ESA Study Reveals Video Games' Universal Appeal Across Generations" (3 Jun 2025) — https://www.theesa.com/annual-esa-study-reveals-video-games-universal-appeal-across-generations/ — accessed 2026-10-02
11. TechSpot, "ESA report shows the average gamer is 41" (Oct 2025) — https://www.techspot.com/news/109812-esa-report-shows-average-gamer-41-ndash-nearly.html — accessed 2026-10-02
12. Nintendo Life, "A Lot Of Ring Fit Adventure Users Are Between 20 And 30 Years Old, According To Nintendo" (Nov 2019) — https://www.nintendolife.com/news/2019/11/a_lot_of_ring_fit_adventure_users_are_between_20_and_30_years_old_according_to_nintendo — accessed 2026-10-02
13. Apple App Store, "Finch: Self-Care Pet" — https://apps.apple.com/us/app/finch-self-care-pet/id1528595748 — accessed 2026-10-02
14. Sparrow Apps, "Finch: How a Self-Care App Hit $30M ARR Without VC Money" — https://blog.sparrowapps.io/p/finch-how-a-self-care-app-hit-30m-arr-without-vc-money — accessed 2026-10-02 (seen in search; third-party estimates)
15. Peloton, "Fitness Meets Gaming: Welcome to Peloton Lanebreak" — https://www.onepeloton.com/blog/lanebreak — accessed 2026-10-02 (seen in search)
16. Zwift Insider, "Leveling Ain't Easy: Zwift Increases XP Level Requirements" (Jul 2024) — https://zwiftinsider.com/level-changes-july-2024/ — accessed 2026-10-02
17. Zwift, "Earn More Rewards Than Ever Before With New Zwift Features!" (Dec 2023) — https://news.zwift.com/en-WW/232499-earn-more-rewards-than-ever-before-with-new-zwift-features/ — accessed 2026-10-02 (seen in search)
18. Ibrahim A.H., Beaumont C.T., Strohacker K., "Exploring Regular Exercisers' Experiences with Readiness/Recovery Scores Produced by Wearable Devices", Applied Psychophysiology and Biofeedback 2024 — https://pubmed.ncbi.nlm.nih.gov/38668986/ — accessed 2026-10-02 (abstract via Europe PMC)
19. Gavriloff D. et al., "Sham sleep feedback delivered via actigraphy biases daytime symptom reports in people with insomnia", Journal of Sleep Research 2018 — https://pubmed.ncbi.nlm.nih.gov/29989248/ — accessed 2026-10-02 (seen in search)
20. Jahrami H. et al., "Prevalence of Orthosomnia in a General Population Sample", Brain Sciences 2024 — https://pmc.ncbi.nlm.nih.gov/articles/PMC11592250/ — accessed 2026-10-02
21. Turnwald B.P. et al., "Learning one's genetic risk changes physiology independent of actual genetic risk", Nature Human Behaviour 2019 — https://www.nature.com/articles/s41562-018-0483-4 — accessed 2026-10-02 (seen in search)
22. Zahrt O.H., Crum A.J., "Perceived Physical Activity and Mortality", Health Psychology 2017 — https://www.apa.org/pubs/journals/releases/hea-hea0000531.pdf — accessed 2026-10-02 (seen in search)
23. Oyserman D., "Identity-Based Motivation" — https://rcgd.isr.umich.edu/wp-content/uploads/2018/08/oyserman2015ibm.pdf — and Oyserman et al., "Identity-Based Motivation: Implications for Health and Health Disparities", J. Social Issues 2014 — https://spssi.onlinelibrary.wiley.com/doi/abs/10.1111/josi.12056 — accessed 2026-10-02 (seen in search)
24. Franken R., Bekhuis H., Tolsma J., "Kudos make you run! How runners influence each other on the online social network Strava", Social Networks 72 (2023) — https://robfranken.net/files/1-s2.0-S0378873322000909.pdf — accessed 2026-10-02
25. Engadget, "After exposing secret military bases, Strava restricts data visibility" (Mar 2018) — https://www.engadget.com/2018-03-13-after-exposing-secret-military-bases-strava-restricts-data-visi.html — accessed 2026-10-02 (seen in search)
26. Moody S. et al., "Associations Between the Use of Fitness and Diet Tracking Technology and Disordered Eating Behaviour: A Systematic Review", European Eating Disorders Review 2025 — https://pmc.ncbi.nlm.nih.gov/articles/PMC12547374/ — accessed 2026-10-02
27. Eikey E.V., "Effects of diet and fitness apps on eating disorder behaviours: qualitative study", BJPsych Open 2021 — https://www.cambridge.org/core/journals/bjpsych-open/article/effects-of-diet-and-fitness-apps-on-eating-disorder-behaviours-qualitative-study/2D1EE739D97AB3EFC6573835E4C527BD — accessed 2026-10-02
28. Levinson C.A., Fewell L., Brosof L.C., "My Fitness Pal calorie tracker usage in the eating disorders", Eating Behaviors 2017 — https://www.sciencedirect.com/science/article/abs/pii/S1471015317301484 — accessed 2026-10-02 (seen in search)
29. Simpson C.C., Mazzeo S.E., "Calorie counting and fitness tracking technology: Associations with eating disorder symptomatology", Eating Behaviors 2017 — https://www.sciencedirect.com/science/article/abs/pii/S1471015316303646 — accessed 2026-10-02 (seen in search)
30. Zhu Y., Wang K., Ma K., "Meta-analysis of exercise addiction prevalence across diverse athletic disciplines", Acta Psychologica 2026 — https://pubmed.ncbi.nlm.nih.gov/42150429/ — accessed 2026-10-02 (abstract via Europe PMC)
31. Buist I. et al., "No effect of a graded training program on the number of running-related injuries in novice runners: a randomized controlled trial", AJSM 2008 — https://pubmed.ncbi.nlm.nih.gov/17940147/ — accessed 2026-10-02 (seen in search)
32. Nielsen R.O. et al., "Excessive Progression in Weekly Running Distance and Risk of Running-Related Injuries", JOSPT 2014 — https://www.jospt.org/doi/10.2519/jospt.2014.5164 — accessed 2026-10-02 (seen in search)
33. Apple Newsroom, "watchOS 11 brings powerful health and fitness insights" (Jun 2024) — https://www.apple.com/newsroom/2024/06/watchos-11-brings-powerful-health-and-fitness-insights/ — accessed 2026-10-02 (seen in search)
34. RevenueCat, "How long should your free trial be? Data from 17,000+ apps" (28 Sep 2026) — https://www.revenuecat.com/blog/growth/free-trial-length — accessed 2026-10-02
35. Top Class Actions, "Noom auto-renewal and cancellation policy $56M class action settlement" — https://topclassactions.com/lawsuit-settlements/closed-settlements/noom-auto-renewal-and-cancellation-policy-56m-class-action-settlement/ — accessed 2026-10-02 (seen in search)
36. UK ICO, "Age appropriate design: a code of practice for online services" — https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/ — accessed 2026-10-02 (seen in search)
37. Spool J., "Do users change their settings?" UIE (2011) — https://archive.uie.com/brainsparks/2011/09/14/do-users-change-their-settings/ — accessed 2026-10-02 (seen in search)
38. Johnson E.J., Goldstein D.G., "Do Defaults Save Lives?", Science 2003 — https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1324774 — accessed 2026-10-02 (seen in search)
