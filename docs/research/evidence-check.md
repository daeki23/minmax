# Evidence Check: Fact-Check of the GPT Program Critique and the MINMAX Evidence-Tier Framework

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

## Summary for the founder

- **The critique mostly holds.** Of 15 claims, 8 are true, 6 are mostly true but need a caveat, and 1 is out of date. None is false. The ACSM "2-3 sets of 8-12 reps" line is the out-of-date one: ACSM replaced its 2009 position stand in March 2026 (confidence: high).
- **Two updates in 2026 change the copy MINMAX can use.** (1) The ACSM 2026 resistance-training position stand recommends high-effort training of all major muscle groups at least twice a week and at least 2 sets per exercise. It sets no rep range, and it says training to failure is not necessary [2]. (2) The **2026** ACC/AHA multisociety dyslipidemia guideline came out in JACC on 13 March 2026. It is a 2026 guideline, not a 2025 one. It recommends measuring Lp(a) at least once in adulthood and sets explicit LDL-C goals of <100, <70 and <55 mg/dL by risk group [16][17] (confidence: high).
- **Every pseudo-precise target in the $49 program fails the check.** HRV ≥100 ms is far above the published short-term RMSSD ranges (mean 42 ± 15 ms; study means 19-75 ms) [10][11]. Testosterone ≥1000 ng/dL is above the 97.5th percentile (916 ng/dL) for healthy non-obese men aged 19-39 [15]. Lp(a) is genetic and lifestyle barely moves it [16]. HOMA-IR has no universal cut-off, and its precision is poor (CV ~31 %) [19][21]. The AASM advises against melatonin for chronic insomnia (WEAK recommendation, based on 2 mg trials) [24] (confidence: high).
- **Where the critique is imprecise, MINMAX should correct it, not repeat it.** Lowe 2020 was an ad-libitum TRE trial, not an isocaloric one [33]. The "NAC blunts adaptations" evidence comes from acute signalling and recovery studies in about 10 men, not from long-term training RCTs [29][30]. HOMA "upper limits ~1.9-2.0" depends on population and method; published values range from 1.7 to 3.46 [19][20] (confidence: high).
- **Adopt a five-tier label (A/B/C/D/X) on every quest, stat explainer and recommendation.** The tier describes the evidence behind a *recommendation*. The existing trust levels describe a *measurement*. Keep the two axes separate in the data model and in the UI.
- **"Top 1 %" is only legitimate as a percentile against a named, age- and sex-specific normative table, with provenance.** It may never mean "optimal health". It may never be shown for metrics where no population norm exists, or where "more" is not "better" (HRV, testosterone, sleep beyond 9 h) [34].
- **Regulatory fit.** Tier A/B lifestyle targets fit general-wellness framing. Lab-marker "targets" (Lp(a), LDL goals, testosterone) are clinical territory. Show them as the lab's own reference ranges and route the user to a clinician, never as quests [35].

## Findings

Verdict scale: **true** (the claim matches the primary source), **mostly true** (correct in substance, but a detail is wrong or a caveat is missing), **outdated** (correct for an older source that has been superseded), **misleading**, **false**.

### a) WHO 150-300 / 75-150 min plus strength on 2+ days: **true**

The WHO 2020 guidelines say: "All adults should undertake 150-300 min of moderate-intensity, or 75-150 min of vigorous-intensity physical activity, or some equivalent combination … per week". They recommend muscle-strengthening activity at moderate or greater intensity on 2 or more days a week. The adult recommendations rest on moderate-certainty evidence [1]. This search found no newer WHO adult guideline (confidence: high).

### b) ACSM 2-3 sets × 8-12 reps, 2-3 days/week: **outdated**

The ACSM position stand by Currier et al. appeared in *Med Sci Sports Exerc* 58(4):851-872 in April 2026, published online 17 March 2026. It replaces the 2009 "Progression models" stand and synthesises 137 systematic reviews covering more than 30,000 participants [2][3].

The new primary recommendation is: "healthy adults perform RT with high effort … at least twice weekly, with all major muscle groups being engaged". Healthy adults "are advised to complete at least two sets per exercise." For strength, the stand lists ≥80 % 1RM, 2-3 sets and ≥2 sessions per week. For hypertrophy, it lists ≥10 sets per week [2].

The stand summarises the 2009 guidance as 2-3 sessions per week, 1-4 sets and 8-20 reps per set. It adds that those details "may be less relevant for most adults" [2]. The exact phrase "8-12 reps" in the 2009 document was **unverified** here. MINMAX copy should cite the 2026 stand (confidence: high).

### c) No large hypertrophy benefit from training every set to failure: **mostly true**

The meta-analysis is Refalo et al. 2023 (*Sports Med* 53:649-665), covering 15 studies [4]. Momentary muscular failure vs non-failure showed no advantage: ES 0.12 (95 % CI −0.13 to 0.37). Any definition of "set failure" gave only a trivial edge: ES 0.19 (0.00 to 0.37).

The caveat: Robinson et al. 2024 ran meta-regressions on estimated reps in reserve (RIR). Hypertrophy increased as sets ended closer to failure, while strength did not [5]. The ACSM 2026 stand concludes that training to momentary failure "does not enhance gains in strength, hypertrophy, and power". It recommends near-failure effort, about 2-3 RIR [2].

**Honest summary:** proximity to failure matters, but absolute failure on every set does not (confidence: high).

### d) 4×4 intervals beat moderate continuous training for VO2max (Helgerud 2007): **true, with a population caveat**

The trial randomised 40 healthy, non-smoking, moderately trained men into four arms for 8 weeks at 3 sessions per week, matched for total oxygen consumption. 4×4 min at 90-95 % HRmax raised VO2max by 7.2 % (55.5 → 60.4 ml/kg/min) and 15/15 intervals raised it by 5.5 %. Both were significantly better than long slow distance or lactate-threshold training (P < 0.01) [6].

It is a single, small RCT in young men, not a guideline. On its own it supports tier **B** for "intervals improve VO2max in healthy adults" (confidence: high).

### e) Step dose-response is non-linear, with large benefits by ~5-7k and age-dependent plateaus: **true**

- **Paluch 2022** (15 cohorts, 47,471 adults): mortality kept falling up to 6,000-8,000 steps/day at age ≥60, and up to 8,000-10,000 at age <60 [7].
- **Ding 2025** (*Lancet Public Health*; 57 studies, 31 in meta-analysis): the curve is non-linear for all-cause mortality, CVD incidence, dementia and falls, with inflection points at about 5,000-7,000 steps. Compared with 2,000 steps/day, 7,000 steps/day carried HR 0.53 (0.46-0.60) for all-cause mortality [8].

Both are observational, so a step target is a correlate, not a proven cause (confidence: high).

### f) Finnish sauna cohort: **true**

Laukkanen 2015 (*JAMA Intern Med*) is the KIHD prospective cohort of 2,315 men aged 42-60 from eastern Finland, followed for a median of 20.7 years [9]. Compared with one session per week, 4-7 sessions per week carried an adjusted HR for sudden cardiac death of 0.37 (0.18-0.75), with similar trends for CHD, CVD and all-cause mortality.

Only 201 men were in the 4-7 per week group. The study is observational, male-only and culturally specific. It supports tier **C** at most (confidence: high).

### g) No generally accepted HRV reference values: **mostly true**

Nunan 2010 (*PACE*) is a systematic review of 44 studies with 21,438 participants. It states "there are currently no normative data for short-term measures of HRV" [10]. It found values lower than the 1996 Task Force norms and inter-individual variation of up to 260,000 %, and it proposed ranges: RMSSD 42 ± 15 ms (study range 19-75) and SDNN 50 ± 16 ms (32-93) [10][11]. Sammito 2016 published 24-h Holter percentiles by age and sex, again noting that no appropriate reference values existed [12].

So reference ranges have been proposed, but none is accepted for consumer wearables. These devices use different windows, postures and metrics: Apple reports SDNN, Oura, Whoop and Garmin report nightly RMSSD. **HRV ≥100 ms as a universal target is tier X** (confidence: high).

### h) Endocrine Society definition and AUA target 450-600 ng/dL: **true**

The Endocrine Society 2018 guideline recommends diagnosing hypogonadism "only in men with symptoms and signs consistent with T deficiency and unequivocally and consistently low serum T". Diagnosis needs repeated fasting morning total T measurements [13].

The AUA guideline (published 2018, "reviewed and validity confirmed 2024") uses <300 ng/dL as a reasonable cut-off, measured twice in the early morning. It defines therapeutic success as 450-600 ng/dL, "middle tertile of the reference range", with symptom improvement [14].

The 450-600 ng/dL figure is a **treatment** target for diagnosed patients, not a lifestyle target. For context, harmonized CDC-calibrated ranges for healthy non-obese men aged 19-39 run from 264 to 916 ng/dL (2.5th-97.5th percentile) [15]. The program's ≥1000 ng/dL target lies outside the healthy reference range (confidence: high).

### i) Lp(a) once in a lifetime and risk enhancer ≥50 mg/dL / ≥125 nmol/L; 2025 guideline with LDL targets: **true for the 2026 guideline; the year is wrong**

The "2026 ACC/AHA/AACVPR/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA Guideline on the Management of Dyslipidemia" was published in JACC on 13 March 2026 [16]. Its key statements:

- "Lp(a) should be measured at least once in adulthood".
- "Lifestyle changes minimally affect Lp(a) levels, so repeat testing is generally not needed" [16].
- Lp(a) ≥50 mg/dL is a risk enhancer, with about 1.4× ASCVD risk. At ≥100 mg/dL (~250 nmol/L) the risk is about 2× [17][18].
- LDL-C goals: <100 mg/dL in primary prevention with PREVENT-ASCVD <10 %; <70 with ≥10 %; <55 in very-high-risk clinical ASCVD [16][17].
- PREVENT equations replace the Pooled Cohort Equations [16].

**No 2025 ACC/AHA dyslipidemia guideline was found**; the explicit-goal guideline is the 2026 one. The mg/dL and nmol/L units do not convert exactly, so MINMAX must store the unit the lab reports [17][18]. **"Lp(a) ≤5" as a lifestyle target is tier X** (confidence: high).

### j) HOMA-IR has no universal cut-off; population upper limits ~1.9-2.0: **mostly true**

The first half is true. The "1.9-2.0" figure is one of many:

- EPIRCE (Spain, n=2,459): the cut-off was 3.46 by the 90th percentile, 2.05 when based on metabolic syndrome, and 1.85 in non-diabetic men [19].
- Japan: a "health-associated" reference interval of 0.4-2.4, and a metabolic-syndrome cut-off of 1.7 [20].

The original HOMA paper reports a coefficient of variation of about 31 % for insulin-resistance estimates [21]. That makes **HOMA-IR ≤0.7 a tier X target**: it is a pseudo-precise goal on an imprecise index, sitting inside the normal range (confidence: high on variability; medium on any single threshold).

### k) Morton 2018: no extra lean-mass gain above ~1.6 g/kg/day (CI upper ~2.2): **true**

Morton 2018 (*BJSM*) pooled 49 RCTs with 1,863 participants. The break point for fat-free-mass gains was 1.62 g/kg/day (95 % CI 1.03-2.20). The authors note that the wide CI may make ~2.2 g/kg/day a prudent upper target [22].

Two caveats: the population is people doing resistance training, and the setting is protein supplementation (confidence: high).

### l) AASM/SRS: adults 7+ hours: **true**

The consensus statement reads: "Adults should sleep 7 or more hours per night on a regular basis to promote optimal health", for ages 18-60. More than 9 h "may be appropriate for young adults, individuals recovering from sleep debt, and individuals with illnesses" [23] (confidence: high).

### m) NIH: omega-3 evidence stronger for existing CHD or low intake than for healthy people: **mostly true**

NCCIH (an NIH centre, updated November 2024) writes that "people with heart disease or high triglycerides may benefit from taking omega-3 supplements". It also says seafood evidence is stronger than supplement evidence [25].

In the primary-prevention trial VITAL (25,871 adults), 1 g/day of omega-3 did not reduce major cardiovascular events: HR 0.92 (0.80-1.06) [27]. According to the NIH ODS fact sheet as surfaced in search, VITAL found a larger MI reduction in people eating <1.5 fish servings per week, and the AHA does not recommend supplements for people without high CVD risk [26]. **The ODS page returned 403, so this part is partially unverified.** The low-intake subgroup is a secondary analysis (confidence: medium).

### n) NAC: men's systematic review shows performance and antioxidant effects but no clear biomarker benefit; NAC blunted adaptations: **mostly true, but the second half is overstated**

Fernández-Lázaro 2023 (*Nutrients*) reviewed 16 controlled trials in adult males. It reported improvements in exercise performance, antioxidant capacity and glutathione homeostasis, but "no clear evidence" of benefit on haematological, inflammatory or muscle markers. Supplementation lasted 1-21 days [28].

The blunting evidence is short-term and mechanistic:

- **Petersen 2012** (*Acta Physiol*): NAC infusion blocked the exercise-induced rise in JNK phosphorylation and attenuated some adaptation-related signalling [30].
- **Michailidis 2013** (*AJCN*): a crossover in 10 men. NAC after eccentric exercise blunted mTOR/p70S6K signalling, and performance fully recovered only on placebo [29].
- **Paschalis 2018:** NAC improved performance only in people with low baseline glutathione [31].

No long-term RCT showing reduced hypertrophy or VO2max gains was found (**unverified**). "NAC before training" belongs in tier D/X (confidence: medium).

### o) Isocaloric TRE trials work mostly through reduced calories (Liu 2022, Lowe 2020): **mostly true; Lowe is mislabelled**

- **Liu 2022** (*NEJM*): 139 adults with obesity, both arms calorie-restricted for 12 months. TRE added no significant benefit: net difference −1.8 kg (−4.0 to 0.4), P = 0.11 [32].
- **Lowe 2020** (TREAT, *JAMA IM*) was **ad libitum 16:8 vs 3 structured meals, not isocaloric**. It found no between-group difference in weight loss and a loss of appendicular lean mass in the TRE group [33].

Both support "TRE is a tool for eating less, not a metabolic advantage" (confidence: high).

### Verdict table

| # | Claim | Verdict | Tier for MINMAX use |
|---|---|---|---|
| a | WHO activity volumes | true | A |
| b | ACSM 2-3×8-12, 2-3 d | outdated (2026 update) | A (use 2026 wording) |
| c | Failure not needed | mostly true | A/B |
| d | 4×4 > MICT for VO2max | true (small RCT) | B |
| e | Steps non-linear | true | B/C (meta-analysis of cohorts) |
| f | Sauna cohort | true | C |
| g | No HRV norms | mostly true | X for absolute targets |
| h | Endocrine Society / AUA | true | clinical, not a quest |
| i | Lp(a) once; LDL goals | true, year is 2026 | A (measure once); clinical for goals |
| j | HOMA no cut-off | mostly true | X for ≤0.7 |
| k | Protein ~1.6 g/kg | true | B |
| l | Sleep 7+ h | true | A |
| m | Omega-3 subgroups | mostly true | B (CHD) / C-D (healthy) |
| n | NAC | mostly true, overstated | D/X |
| o | TRE via calories | mostly true | B |

## Implications for MINMAX: the evidence-tier framework (draft v0.1)

### 1. Two axes, never merged

- **Measurement trust** (already in the model): self-reported < app-recorded < device-verified < clinical. This answers: *how sure are we about this number?*
- **Recommendation evidence tier** (new): A / B / C / D / X. This answers: *how sure is science that acting on this helps?*

A device-verified VO2max (high trust) can feed an A-tier quest. A clinical-grade HOMA-IR (high trust) can still carry an X-tier "target". The UI shows both axes.

### 2. Tier definitions

| Tier | Name (Game / Simple mode) | Definition | Admission rule |
|---|---|---|---|
| **A** | "Canon" / "Strong consensus" | Recommendation of a major guideline body (WHO, ACSM, AASM/SRS, ACC/AHA, ESC, Endocrine Society, national health agencies) for the general adult population | Cite the guideline, year and the exact statement. Re-check yearly. |
| **B** | "Proven" / "Good evidence" | At least one RCT, or a meta-analysis of RCTs or high-quality cohorts, in a population relevant to the user, with no strong contradicting evidence | Cite the study design, n and population. Flag "small RCT" when n < 100. |
| **C** | "Lore" / "Promising" | Consistent observational associations plus a plausible mechanism, with no RCT on hard outcomes | Must carry "linked to, not proven to cause". Never framed as risk reduction for a disease. |
| **D** | "Experimental" / "Early science" | Mechanistic, acute, animal, very small human or single-study evidence | Opt-in only (a Game mode "Experimental" toggle). Never auto-suggested. No XP multiplier. |
| **X** | "Myth / Not a target" / "Not recommended" | Contradicted by better evidence, outside physiological reference ranges, genetically fixed, or a clinical treatment parameter | Never a quest. Can appear as "Myth busted" education cards. |

### 3. How each tier is shown

- **Badge:** a small letter glyph on every quest card and stat explainer. Game mode uses a sigil per tier (A = crown, B = shield, C = scroll, D = flask, X = broken sword) on the dark theme. Simple mode uses a plain text chip: "Strong consensus", and so on.
- **Tap-through "Why this?" sheet:** a one-sentence claim, the source (body, year, link), the population it applies to, and "what we don't know". The data comes from a versioned content registry, so every quest stores `evidenceTier`, `sourceIds[]` and `contentVersion`.
- **Language rules per tier:**
  - A uses "recommended".
  - B uses "shown to improve … in [population]".
  - C uses "associated with".
  - D uses "early research suggests; may not apply to you".
  - X uses "not supported" or "not a lifestyle target".
- **XP weighting:** XP is tied to the measurable criterion, not to the tier, so the game does not reward chasing D-tier hacks. D quests can be capped at a cosmetic reward.

### 4. Example recommendations per tier

| Tier | Example quest / statement | Source |
|---|---|---|
| A | "Move 150-300 min moderate or 75-150 min vigorous this week (or a mix)." | WHO 2020 [1] |
| A | "Train all major muscle groups on 2 days this week, ≥2 hard sets each, stopping 2-3 reps short of failure." | ACSM 2026 [2] |
| A | "Aim for 7+ hours of sleep on most nights." | AASM/SRS [23] |
| A (info) | "Ask your doctor to measure Lp(a) once; it is mostly genetic." | ACC/AHA 2026 [16] |
| B | "Do one 4×4 interval session (4 min hard, 3 min easy) to raise VO2max." | Helgerud 2007 [6] |
| B | "Hit ~1.6 g protein per kg on training days (no proven extra muscle above ~2.2)." | Morton 2018 [22] |
| B/C | "Reach 7,000 steps on 5 days; benefits rise steeply up to ~5-7k." | Ding 2025, Paluch 2022 [7][8] |
| C | "Sauna 2+ times a week, if you enjoy it; linked to lower CVD death in Finnish men." | Laukkanen 2015 [9] |
| D | "NAC around training": not suggested; shown only on request, with a note that it may blunt recovery signalling. | [29][30] |
| X | "HRV ≥100 ms", "testosterone ≥1000 ng/dL", "Lp(a) ≤5", "HOMA-IR ≤0.7" | [10][15][16][21] |

### 5. "MINMAX will never claim" (and what we say instead)

| Never claim | Why | Honest alternative |
|---|---|---|
| "Get your HRV above 100 ms." | No accepted norms; device metrics differ; mean short-term RMSSD is ~42 ms [10][11] | "Your HRV trend vs **your own** 30-day baseline. Higher than usual often means good recovery." |
| "Optimise testosterone to ≥1000 ng/dL." | Above the 97.5th percentile of healthy young men [15]; the 450-600 ng/dL target applies only to treated hypogonadism [14] | "Low T is diagnosed by a doctor from symptoms plus two low morning tests. Sleep, training and body fat are the lifestyle levers." |
| "Lower your Lp(a) to ≤5." | Genetic; lifestyle barely moves it [16] | "Know your number once. If ≥50 mg/dL / ≥125 nmol/L, discuss overall risk with a clinician." |
| "HOMA-IR ≤0.7 = top metabolic health." | No universal cut-off; CV ~31 % [19][21] | "Fasting glucose and HbA1c shown against the lab's reference range; training and waist size are the levers." |
| "Take 3-10 mg melatonin." | AASM advises against melatonin for chronic insomnia (weak) [24]; it is a drug or supplement decision | "Keep a regular sleep window. Talk to a clinician about sleep aids." |
| "NAC before training boosts gains." | Only helps people with low glutathione; may blunt adaptation signalling [29][31] | "No supplement replaces training load. Antioxidant megadoses around training are not recommended." |
| "Fasting window burns more fat." | No benefit beyond calorie intake in RCTs [32][33] | "An eating window can help some people eat less; total intake is what counts." |
| "Train every set to failure." | Not needed per ACSM 2026 [2][4] | "Finish sets 1-3 reps short of failure." |
| "10,000 steps or it doesn't count." | Benefits plateau earlier, depending on age [7][8] | "Every 1,000 steps counts; most of the benefit comes by ~7,000." |
| "This prevents heart disease / reduces your risk by X %." | EU MDR risk framing; cohort data are not causal [35] | "Associated with lower risk in studies of [population]." |
| "Top 0.1 % health." | No validated composite "health percentile" exists | See the next section. |

### 6. What "Top 1 % / Top 0.1 %" may legitimately mean

A percentile claim is allowed only if **all** of these hold:

1. **Named normative table:** for example FRIEND 2022 for VO2max, or Dodds 2014 for grip, with the age band and sex matched. See normative-data.md [34].
2. **The table resolves the tail.** If it stops at P95, the strongest claim is "Top 5 %". A claim beyond that is shown as "modelled" with the distribution assumption stated [34].
3. **The metric is monotonic-beneficial.** "Higher is better" must be supported, as for VO2max, where there is no upper limit of benefit [34]. Percentiles are never shown as achievements for HRV, testosterone, sleep length, BMI or Lp(a).
4. **Provenance is attached:** measurement trust level, device, protocol and date. Example: "VO2max ≥ P95 for men 40-49, FRIEND 2022 treadmill norms, device-estimated (Garmin), 2026-09-28".
5. **Single metric, not a composite.** "Top 1 % aerobic fitness" is allowed. "Top 1 % health" is not.
6. **Crowd data stays separate.** Self-reported lifter databases produce a "lifter percentile", never a population claim [34].

**"Top 0.1 %"** therefore effectively never appears: no reviewed normative table resolves the 99.9th percentile with confidence.

## Open questions

1. **ACSM 2026 vs WHO.** Should MINMAX's A-tier strength quest copy say "2 sets per exercise" (ACSM) or "muscle-strengthening on 2+ days" (WHO)? Recommendation: use WHO as the floor and ACSM as the "build" detail.
2. **The NIH ODS omega-3 fact sheet could not be read (HTTP 403).** The low-fish-intake VITAL subgroup statement needs a direct read before publication.
3. **The exact 2009 ACSM wording ("8-12 reps")** was not verified against the 2009 text.
4. **Long-term human RCTs on chronic oral NAC and training adaptations** were not found. Is "may blunt" defensible copy, or should it say "unknown"?
5. **Endocrine Society hypogonadism guideline.** It is the 2018 version. Whether a newer revision exists as of 2026 is unverified.
6. **Tier governance.** Who re-reviews tiers, and how often? Proposal: an annual review plus an event-driven review when a major guideline changes, with `contentVersion` bumped and old claims kept as versioned.
7. **ZK claims.** Should the proof attest the evidence tier and source version alongside the threshold, so a verifier knows which norm table the "Top 5 %" used?
8. **Steps.** Tier B or C? The meta-analyses are of cohorts, not RCTs. This draft says B/C. A strict reading gives C.

## Sources

1. Bull FC et al. World Health Organization 2020 guidelines on physical activity and sedentary behaviour. BJSM 2020 — https://pmc.ncbi.nlm.nih.gov/articles/PMC7719906/ — accessed 2026-10-02
2. Currier BS et al. ACSM Position Stand. Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews. MSSE 2026;58(4):851-872 — https://www.ovid.com/jnls/acsm-msse/fulltext/10.1249/mss.0000000000003897~american-college-of-sports-medicine-position-stand (full text read via https://www.fisiologiadelejercicio.com/wp-content/uploads/2026/03/Resistance-Training-Prescription-for-Muscl.pdf) — accessed 2026-10-02
3. Newswise / ACSM. ACSM Unveils Landmark 2026 Resistance Training Guidelines — https://www.newswise.com/articles/acsm-unveils-landmark-2026-resistance-training-guidelines-first-update-in-17-years — accessed 2026-10-02
4. Refalo MC et al. Influence of Resistance Training Proximity-to-Failure on Skeletal Muscle Hypertrophy: A Systematic Review with Meta-analysis. Sports Med 2023 — https://pubmed.ncbi.nlm.nih.gov/36334240/ — accessed 2026-10-02
5. Robinson ZP et al. Exploring the Dose-Response Relationship Between Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy. Sports Med 2024 (DOI 10.1007/s40279-024-02069-2) — https://rke.abertay.ac.uk/en/publications/exploring-the-dose-response-relationship-between-estimated-resist/ — accessed 2026-10-02
6. Helgerud J et al. Aerobic high-intensity intervals improve VO2max more than moderate training. MSSE 2007 — https://pubmed.ncbi.nlm.nih.gov/17414804/ — accessed 2026-10-02
7. Paluch AE et al. Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts. Lancet Public Health 2022 — https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(21)00302-9/fulltext — accessed 2026-10-02
8. Ding D et al. Daily steps and health outcomes in adults: a systematic review and dose-response meta-analysis. Lancet Public Health 2025 — https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(25)00164-1/fulltext — accessed 2026-10-02
9. Laukkanen T et al. Association between sauna bathing and fatal cardiovascular and all-cause mortality events. JAMA Intern Med 2015 (DOI 10.1001/jamainternmed.2014.8187; abstract via Europe PMC, PMID 25705824) — https://doi.org/10.1001/jamainternmed.2014.8187 — accessed 2026-10-02
10. Nunan D et al. A quantitative systematic review of normal values for short-term heart rate variability in healthy adults. PACE 2010 — https://onlinelibrary.wiley.com/doi/10.1111/j.1540-8159.2010.02841.x — accessed 2026-10-02
11. Shaffer F, Ginsberg JP. An Overview of Heart Rate Variability Metrics and Norms. Front Public Health 2017 — https://pmc.ncbi.nlm.nih.gov/articles/PMC5624990/ — accessed 2026-10-02
12. Sammito S, Böckelmann I. Reference values for time- and frequency-domain heart rate variability measures. Heart Rhythm 2016 (DOI 10.1016/j.hrthm.2016.02.006; abstract via Europe PMC, PMID 26883166) — https://doi.org/10.1016/j.hrthm.2016.02.006 — accessed 2026-10-02
13. Bhasin S et al. Testosterone Therapy in Men With Hypogonadism: An Endocrine Society Clinical Practice Guideline. JCEM 2018 (PMID 29562364) — https://doi.org/10.1210/jc.2018-00229 — accessed 2026-10-02
14. American Urological Association. Testosterone Deficiency Guideline (2018, validity confirmed 2024) — https://www.auanet.org/guidelines-and-quality/guidelines/testosterone-deficiency-guideline — accessed 2026-10-02
15. Travison TG et al. Harmonized Reference Ranges for Circulating Testosterone Levels in Men of Four Cohort Studies. JCEM 2017 (PMID 28324103) — https://doi.org/10.1210/jc.2016-2935 — accessed 2026-10-02
16. American College of Cardiology. ACC, AHA Release New Clinical Guideline For Managing Dyslipidemia (13 Mar 2026) — https://www.acc.org/latest-in-cardiology/journal-scans/2026/03/13/15/20/acc-aha-release-new-clinical-guideline-for-managing-dyslipidemia — accessed 2026-10-02
17. UIC Drug Information Group. Key updates from the 2026 ACC/AHA/… dyslipidemia guideline — https://dig.pharmacy.uic.edu/faqs/2026-2/may-2026-faqs/what-are-key-updates-from-the-2026-acc-aha-aacvpr-abc-acpm-ada-ags-apha-aspc-nla-pcna-guideline-on-dyslipidemia-management/ — accessed 2026-10-02
18. American College of Cardiology. Keeping it Simple: Top 10 Things to Know About the 2026 Dyslipidemia Guideline — https://www.acc.org/latest-in-cardiology/articles/2026/04/27/19/07/accel-lite-28apr2026 — accessed 2026-10-02
19. Gayoso-Diz P et al. Insulin resistance (HOMA-IR) cut-off values and the metabolic syndrome in a general adult population: EPIRCE. BMC Endocr Disord 2013 (PMID 24131857) — https://doi.org/10.1186/1472-6823-13-47 — accessed 2026-10-02
20. Yamada C et al. Optimal cut-off point for HOMA-IR to discriminate metabolic syndrome in non-diabetic Japanese subjects. J Diabetes Investig 2012 — https://pmc.ncbi.nlm.nih.gov/articles/PMC4019259 — accessed 2026-10-02
21. Matthews DR et al. Homeostasis model assessment: insulin resistance and beta-cell function from fasting plasma glucose and insulin concentrations in man. Diabetologia 1985 (PMID 3899825) — https://doi.org/10.1007/bf00280883 — accessed 2026-10-02
22. Morton RW et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength. BJSM 2018 (PMC5867436) — https://doi.org/10.1136/bjsports-2017-097608 — accessed 2026-10-02
23. Watson NF et al. Recommended Amount of Sleep for a Healthy Adult: Joint Consensus Statement of the AASM and SRS. JCSM 2015 — https://aasm.org/resources/pdf/pressroom/adult-sleep-duration-consensus.pdf — accessed 2026-10-02
24. Sateia MJ et al. Clinical Practice Guideline for the Pharmacologic Treatment of Chronic Insomnia in Adults (AASM). JCSM 2017 — https://aasm.org/resources/pdf/pharmacologictreatmentofinsomnia.pdf — accessed 2026-10-02
25. NCCIH (NIH). Omega-3 Supplements: What You Need To Know (updated Nov 2024) — https://www.nccih.nih.gov/health/omega3-supplements-what-you-need-to-know — accessed 2026-10-02
26. NIH Office of Dietary Supplements. Omega-3 Fatty Acids – Health Professional Fact Sheet (page returned HTTP 403; content only via search snippet) — https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/ — accessed 2026-10-02
27. Manson JE et al. Marine n-3 Fatty Acids and Prevention of Cardiovascular Disease and Cancer (VITAL). NEJM 2019 (PMID 30415637) — https://doi.org/10.1056/nejmoa1811403 — accessed 2026-10-02
28. Fernández-Lázaro D et al. Influence of N-Acetylcysteine Supplementation on Physical Performance and Laboratory Biomarkers in Adult Males: A Systematic Review of Controlled Trials. Nutrients 2023 — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10255663/ — accessed 2026-10-02
29. Michailidis Y et al. Thiol-based antioxidant supplementation alters human skeletal muscle signaling and attenuates its inflammatory response and recovery after intense eccentric exercise. AJCN 2013 (PMID 23719546) — https://doi.org/10.3945/ajcn.112.049163 — accessed 2026-10-02
30. Petersen AC et al. Infusion with the antioxidant N-acetylcysteine attenuates early adaptive responses to exercise in human skeletal muscle. Acta Physiol 2012 (PMID 21827635) — https://doi.org/10.1111/j.1748-1716.2011.02344.x — accessed 2026-10-02
31. Paschalis V et al. N-acetylcysteine supplementation increases exercise performance and reduces oxidative stress only in individuals with low levels of glutathione. Free Radic Biol Med 2018 (PMID 29233792) — https://doi.org/10.1016/j.freeradbiomed.2017.12.007 — accessed 2026-10-02
32. Liu D et al. Calorie Restriction with or without Time-Restricted Eating in Weight Loss. NEJM 2022 (PMID 35443107) — https://doi.org/10.1056/nejmoa2114833 — accessed 2026-10-02
33. Lowe DA et al. Effects of Time-Restricted Eating on Weight Loss and Other Metabolic Parameters (TREAT). JAMA Intern Med 2020 (PMID 32986097) — https://doi.org/10.1001/jamainternmed.2020.4153 — accessed 2026-10-02
34. MINMAX internal research: Normative Reference Data — /home/user/minmax/docs/research/normative-data.md — accessed 2026-10-02
35. MINMAX internal research: Regulatory — /home/user/minmax/docs/research/regulatory.md — accessed 2026-10-02
