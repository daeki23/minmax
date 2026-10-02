# Normative Reference Data: Turning Measurements into Honest 0-100 Stats and Percentiles

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

## Summary for the founder

- **Only some stats can be honest population percentiles today.** Aerobic (VO2max, FRIEND 2022) and grip strength (Dodds 2014, PURE 2016) have large sampled reference tables by age and sex. Power (countermovement jump) has one recent cohort that is large overall but thin in adults: about 1,700 of its 30,217 participants are over 20, and only a few dozen men are over 50. Mobility, plank, pull-ups and barbell lifts have **no representative adult population norms**. Do not fake them; label them "criterion" or "community" scores. (confidence: high)
- **"Top 1 %" can be literal only where the reference table resolves the tail.** FRIEND gives percentiles up to the 95th, and Dodds up to the 90th. MINMAX should cap claims at the deepest published percentile ("Top 5 %") unless it fits a distribution and labels the claim as modelled. Mandsager 2018 gives an evidence-backed "Elite" tier: ≥2 SD above the age/sex mean (about the top 2.3 %) had the lowest mortality, with no upper limit of benefit seen [1][3]. That 2 SD is measured against a clinical referral cohort using estimated METs, so it is not the same cut-off as FRIEND's P97.7. (confidence: high)
- **A claim has to beat the measurement error, not only the threshold.** A wrist VO2max with ±7 ml/kg/min error can't honestly support "Top 5 %" unless the lower error bound clears the cut-off. Tie claim eligibility to the trust tier. (confidence: high)
- **HRV has no universal norm that is safe to use across consumer devices.** Nunan 2010 (44 studies, 21,438 people) found some studies with interindividual variation of up to 260,000 % for spectral measures. The authors did still pool lab reference values and said they could be used for reference ranges, with methodological caveats. Natarajan 2020 shows that wearable HRV depends on device, time window and epoch. Score HRV only against the user's own rolling baseline. (confidence: high for the recommendation; the "no norm" framing is a simplification)
- **Steps and sleep should be scored on dose-response curves, not percentiles.** Mortality benefit flattens at about 6-8k steps/day at age 60+ and about 8-10k under 60 (Paluch 2022). A 2025 Lancet Public Health meta-analysis puts the inflection at about 5-7k [27][28]. Sleep needs 7 h or more (AASM), regularity (SRI; UK Biobank median 81) and efficiency of 85 % or more (NSF) [33][34][35]. (confidence: high)
- **Lab markers need three different rules.** Lower is better within physiological limits: ApoB, LDL-C, BP, HbA1c, glucose and TG, scored on NHANES percentiles and guideline bands. Genetically fixed: Lp(a), shown as an "innate trait" with no XP. Context or U-shaped: HDL-C, hs-CRP and very low BP. Lp(a)HORIZON missed its primary endpoint in a September 2026 topline announcement, which adds to the case for treating Lp(a) as information, not a quest [41][46]. (confidence: high on guideline numbers; medium on classification)
- **New guideline baselines for 2026.** These replace older numbers in competitors' marketing: the 2026 ACC/AHA dyslipidemia guideline (LDL-C goals <100/<70/<55 mg/dL by risk; measure Lp(a) once), the 2025 AHA/ACC BP guideline (2017 categories kept) and ESC 2024 BP ("elevated" 120-139/70-89) [40][44][45]. (confidence: high)
- **Crowd data (Strength Level: 46 M qualifying self-reported lifts) is a "lifter percentile", not a population percentile.** Strength Level itself defines its tiers as percentiles of its own lifters (Beginner 5 %, Novice 20 %, Intermediate 50 %, Advanced 80 %, Elite 95 %). Show it as a separate, labelled scale and keep it out of population "Top X %" claims [15]. (confidence: high)

## Findings

### 1. Aerobic

**VO2max reference (FRIEND 2022).** The source is 22,379 CPET tests (16,278 treadmill, 6,101 cycle) from 34 US labs, 1968-2021, in apparently healthy adults aged 20-89. Treadmill norms are 1.5-4.6 ml/kg/min lower than the 2015 FRIEND norms. The mean decline is 13.5 % (4.0 ml/kg/min) per decade on treadmill and 16.4 % on cycle. Cycle values run lower than treadmill [1]. The primary PDF was not accessible (HTTP 403). The table below is a secondary transcription stating "2022 FRIEND treadmill, RER ≥1.10" [2]. Its 20-29 male median (45.4) is consistent with the reported drop from the 2015 value: the 2015 FRIEND treadmill P50 was 48.0, a drop of 2.6. All men's medians sit 2.6-3.8 below 2015. The women's medians, however, sit only 0.3-2.0 below 2015 (for example 50-59: 23.1 vs 23.4), and for ages 40-79 that is below the abstract's "1.5-4.6 lower" range. Either that range refers to a different statistic, or the women's rows are mis-transcribed. The decade-to-decade fall in the table (about 4.0 ml/kg/min per decade on average) does match the abstract. **Verify against the primary Table before shipping, especially the women's rows** (confidence: medium; the primary table is unverified).

**Table A1. VO2peak (ml/kg/min), treadmill, FRIEND 2022, percentiles P5/P25/P50/P75/P95. Source: [2] transcribing [1].**

| Age | Men P5 | P25 | P50 | P75 | P95 | Women P5 | P25 | P50 | P75 | P95 |
|---|---|---|---|---|---|---|---|---|---|---|
| 20-29 | 24.8 | 37.3 | 45.4 | 52.6 | 62.1 | 19.3 | 28.6 | 35.6 | 42.2 | 50.1 |
| 30-39 | 20.6 | 31.3 | 38.6 | 46.5 | 57.9 | 16.6 | 23.1 | 28.3 | 34.5 | 45.5 |
| 40-49 | 19.7 | 28.4 | 34.8 | 41.8 | 53.2 | 15.3 | 21.3 | 25.9 | 30.9 | 40.7 |
| 50-59 | 16.5 | 23.9 | 29.4 | 35.5 | 46.8 | 14.5 | 19.5 | 23.1 | 27.3 | 35.3 |
| 60-69 | 13.8 | 19.7 | 24.4 | 29.9 | 40.2 | 12.0 | 16.4 | 19.4 | 23.1 | 29.7 |
| 70-79 | 11.6 | 16.8 | 20.6 | 25.0 | 35.2 | 11.3 | 14.8 | 17.1 | 20.0 | 24.2 |
| 80-89 | 12.2 | 15.9 | 17.7 | 20.9 | 25.6 | 10.7 | 12.8 | 15.1 | 17.2 | 20.7 |

Caveats:
- FRIEND is a US lab-referral sample, not a random population sample.
- The 80-89 P5 for men (12.2) exceeds the 70-79 P5 (11.6), which reflects small numbers at that age.
- Watch-estimated VO2max is not CPET. The wearable report already gives error bars: Garmin MAPE about 7 %, Apple about 13 % with roughly −6 ml/kg/min bias (see `wearable-integrations.md` §5).

**Why fitness percentiles are worth claiming.** In 122,007 treadmill-tested patients, higher fitness was linked to lower long-term mortality with no observed upper limit. "Elite" fitness (≥2 SD above the age/sex mean) had the best survival (adjusted HR 0.20 vs low performers) [3]. This gives MINMAX a defensible evidence anchor for an "Elite" badge (confidence: high). Caveat: these were patients referred for symptom-limited treadmill testing at one tertiary centre (1991-2014). Fitness was *estimated* peak METs from treadmill workload, not measured VO2, and the 2 SD is relative to this referral cohort. The study supports the concept of an Elite tier, not a specific ml/kg/min cut-off.

**Field tests.**
- **Cooper 12-min run:** VO2max = (distance m − 504.9)/44.73. This is algebraically the same as Topend's 22.351 × km − 11.288. It was derived by Cooper (JAMA 1968) from US Air Force men (r about 0.90; the sample size of 115 is unverified, because the cited page does not state it). Accuracy in general populations is lower [4] (confidence: medium, secondary source).
- **Cooper Institute 1.5-mile run, 50th percentile:**
  - Men: 12:18 (20-29), 12:51 (30-39), 13:53 (40-49), 14:55 (50-59)
  - Women: 14:55, 15:26, 16:27, 17:24
  - These come from a copy of the Cooper Institute norm sheet [5]. Full Cooper/ACLS percentile tables appear to be licensed and were not retrieved (confidence: medium).
- **2.4 km test:** no separate primary norm was verified. Convert to VO2max and use Table A1.

**Resting heart rate.** Quer 2020 used Fitbit data from 92,457 adults (about 33 M person-days) [6]:
- Mean RHR was 65.5 ± 7.7 bpm.
- 95 % of men fell between 50 and 80 bpm, and 95 % of women between 53 and 82.
- Individual means ranged from 39.7 to 108.6 bpm.
- RHR rose until about age 50 and then declined, and was U-shaped against BMI.
- Age, sex, BMI and sleep together explained no more than 10 % of between-person variance.
- 20 % of people had at least one week with a swing of 10 bpm or more.

The sample is US Fitbit wearers (63 % women, mean age 45.8, mean BMI 28.4), and RHR follows Fitbit's own algorithm, so it is not a representative population. So RHR is a weak cross-sectional ranking metric and a good personal-trend metric (confidence: high).

**HRV: no universal norms.**
- Nunan 2010 reviewed 44 studies (21,438 participants). Literature values were lower than the 1996 Task Force norms. Some studies showed interindividual variation of up to 260,000 %, mostly for spectral measures. Methods (RR editing, posture, duration) drove disparities [7]. The authors also found "a degree of homogeneity" for common measures across studies, and said their pooled data should be used for reference ranges with these caveats. So lab short-term norms exist, but they are not transferable to consumer wearables.
- Natarajan 2020 (8,203,261 Fitbit users) found steep age decline: measured 06:00-07:00, high-frequency power fell about 81-82 % from 20 to 60 years (82.0 % men, 80.9 % women). It also found strong time-of-day effects, no sex difference in RMSSD, and dose-dependent links with activity. Its benchmark tables are specific to device, time window and 5-min epoch [8].
- Conclusion: score HRV only as a deviation from the user's own 28-60-day baseline, measured at a fixed nightly window. Never compare across devices or against a "≥100 ms" target (confidence: high).

### 2. Strength

**Grip strength: the best-normed strength metric.**
- Dodds 2014 pooled 12 British studies: 49,964 participants and 60,803 observations, analysed with GAMLSS. Median grip peaked at 51 kg in men (age 29-39) and 31 kg in women (26-42). The authors *suggested* weakness cut-offs at T-score ≤ −2.5: 27 kg for men and 16 kg for women. They also report 32 and 19 kg at T ≤ −2, and note that the cut-offs still need validating against outcomes [9]. Protocol: grip is the **maximum of up to six attempts, usually across both hands**; one study (ADNFS) used mainly the dominant hand. Studies used mixed devices (Jamar, Smedley, Nottingham electronic, Harpenden) and positions (seated or standing).

**Table S1. Grip strength (kg), Dodds 2014 Table 2, centiles at exact age. Source: [9] (read directly from the published table image).**

| Age | Men P10 | P25 | P50 | P75 | P90 | Women P10 | P25 | P50 | P75 | P90 |
|---|---|---|---|---|---|---|---|---|---|---|
| 20 | 30 | 35 | 40 | 46 | 52 | 21 | 24 | 28 | 32 | 36 |
| 25 | 36 | 41 | 48 | 55 | 61 | 23 | 26 | 30 | 35 | 38 |
| 30 | 38 | 44 | 51 | 58 | 64 | 24 | 27 | 31 | 35 | 39 |
| 35 | 39 | 45 | 51 | 58 | 64 | 23 | 27 | 31 | 35 | 39 |
| 40 | 38 | 44 | 50 | 57 | 63 | 23 | 27 | 31 | 35 | 39 |
| 45 | 36 | 42 | 49 | 56 | 61 | 22 | 26 | 30 | 34 | 38 |
| 50 | 35 | 41 | 48 | 54 | 60 | 21 | 25 | 29 | 33 | 37 |
| 55 | 34 | 40 | 47 | 53 | 59 | 19 | 23 | 28 | 32 | 35 |
| 60 | 33 | 39 | 45 | 51 | 56 | 18 | 22 | 27 | 31 | 34 |
| 65 | 31 | 37 | 43 | 48 | 53 | 17 | 21 | 25 | 29 | 33 |
| 70 | 29 | 34 | 39 | 44 | 49 | 16 | 20 | 24 | 27 | 31 |
| 75 | 26 | 31 | 35 | 41 | 45 | 14 | 18 | 21 | 25 | 28 |
| 80 | 23 | 27 | 32 | 37 | 42 | 13 | 16 | 19 | 23 | 26 |
| 85 | 19 | 24 | 29 | 33 | 38 | 11 | 14 | 17 | 20 | 23 |
| 90 | 16 | 20 | 25 | 29 | 33 | 9 | 11 | 14 | 17 | 20 |

**PURE (Leong 2016)** measured 125,462 healthy adults aged 35-70 in 21 countries with a Jamar dynamometer. Its value is the **mean of the dominant and non-dominant hand** (best of each hand), which differs from Dodds' best-of-both-hands. Grip varies strongly by region [10]. "Europe/North America" in PURE means Canada, Sweden, Poland and Turkey; it includes no US sites.

**Table S2. PURE, Europe/North America, median (P25-P75) kg. Source: [10].**

| Age | Men | Women |
|---|---|---|
| 35-40 | 50 (43-56) | 30 (26-35) |
| 41-50 | 49 (42-56) | 30 (25-34) |
| 51-60 | 46 (39-52) | 27 (23-31) |
| 61-70 | 42 (36-47) | 25 (21-29) |

Engine rules for grip:
- Default to Dodds for the percentile.
- Use a region-matched PURE table for non-European users later.
- Record the protocol (hand, best vs mean) in provenance, because comparing a "best hand" value with a "mean of hands" table inflates the percentile. Dodds is best of both hands; PURE is the mean of each hand's best.
- CLSA (Mayhew 2023; 25,470 Canadians aged 45-85) reports P5/P10/P20/P50/P80/P90/P95 for grip, five-repetition chair rise, single-leg balance, gait speed and TUG. The citation is a conference abstract (Innov Aging supplement). It is a good older-adult source, but the tables were not extracted here and a full paper was not located [16].

**Push-ups.**
- Yang 2019 followed 1,104 male firefighters for 10 years. Those able to do more than 40 push-ups had 96 % fewer CVD events than those doing fewer than 10 (IRR 0.04, 95 % CI 0.01-0.36). The estimate rests on only 37 events, so it is very imprecise [11]. This is a useful **criterion threshold for men** only, in an occupational cohort (confidence: high for the finding, low for generalisation).
- Cooper Institute 50th percentile push-ups in 1 minute [5]:
  - Men: 33 / 27 / 21 / 15 for ages 20-29 / 30-39 / 40-49 / 50-59
  - Women: 18 / 14 / 11 (20-49)
- The widely copied "ACSM/CSEP" push-up tables have murky provenance. One major aggregator states "the original source for this data is unknown" and modified the women's tables [12]. Treat push-up percentiles as low confidence.

**Plank.** The only sampled norm found is Strand 2014: 471 college students aged about 20. Medians were 110 s (men) and 72 s (women); P70 was 137 and 95 s, and P80 was 157 and 108 s. The paper reports P10-P90 in 10-point steps, with no P75 [13]. There are no age-stratified adult norms, so use criterion bands, not percentiles.

**Pull-ups.** No adult population norms were found (gap).

**30-s chair stand (Rikli & Jones).** Normal range (P25-P75) for community-dwelling adults 60+ [14]:

| Age | 60-64 | 65-69 | 70-74 | 75-79 | 80-84 | 85-89 | 90-94 |
|---|---|---|---|---|---|---|---|
| Men | 14-19 | 12-18 | 12-17 | 11-17 | 10-15 | 8-14 | 7-12 |
| Women | 12-17 | 11-16 | 10-15 | 10-15 | 9-14 | 8-13 | 4-11 |

**Barbell lifts.**
- Strength Level reports 195.5 M lifts from 27.9 M users, filtered to 46.2 M "qualifying" user-entered results (March 2015 to March 2026). The hub page doesn't define its tiers, but each exercise page does, as percentiles of its own lifters: Beginner 5 %, Novice 20 %, Intermediate 50 %, Advanced 80 %, Elite 95 % [15]. Its samples skew heavily male; bench press, for example, has 9.9 M male and 1.0 M female results.
- This is a self-selected, self-reported population of lifters, so a "top 10 %" there may mean "top 1 %" of the general population, or may not. Nobody knows.
- ExRx and NSCA standards were not verified here (gap).
- **Blending rule:** never merge crowd and sampled data into one percentile. Show "Population percentile" (sampled tests: grip, chair stand, push-ups) and "Lifter percentile (Strength Level community, self-reported)" as two labelled scales. Only the first feeds population claims.

### 3. Power

Koivunen 2026 (Scand J Med Sci Sports) is the largest found: 30,217 Finns aged 6-75, countermovement jump on a contact mat, but only 5,413 women [17]. **Most of the sample is children.** 21,492 boys and 3,496 girls are aged 11-15. Only about 340 men and about 1,330 women are over 20, and the older male cells are tiny: n = 10 at 51-55, 10 at 56-60, 4 at 61-65 and 7 over 65. Key points:
- CMJ height peaks at about 17-18 years.
- After the peak it declines about 0.9 %/year in both sexes. Peak power declines 0.5 %/year (men) and 0.3 %/year (women).
- Mean ± SD CMJ: men 51-55 years 26.2 ± 4.1 cm (n = 10) and over 65 years 22.1 ± 3.0 cm (n = 7); women 51-55 years 18.7 ± 3.9 cm (n = 502) and over 65 years 15.0 ± 3.9 cm (n = 26).

The engine can convert mean ± SD to percentiles under a normality assumption. For adult men this rests on samples of 4-71 per 5-year band, so tail percentiles are not credible (confidence: low for adults). The China National Health Survey publishes vertical jump and sit-and-reach norms for ages 8-80, but the article was paywalled (403) and numbers were not extracted [18]. **No verified adult sprint or broad-jump norms were found (gap).** Phone-based jump measurement (flight time from video or IMU) would need its own validation.

### 4. Mobility

This is the weakest-normed domain.
- **Sit-and-reach:** CSEP/CPAFLA norms use a box with "zero" at 26 cm. The "Excellent" band for ages 20-29 is over 40 cm (men) and over 41 cm (women). Protocol differences (23 vs 26 cm zero) shift results by 3 cm [19]. These age-band values and the 26 cm zero are unverified: the cited Topend page shows only an unstratified adult table with the zero at the feet (or "+23 cm") (confidence: low, unverified).
- **Knee-to-wall (weight-bearing lunge):** about 10 cm is the commonly cited restriction threshold, with a minimal detectable change of about 1-1.5 cm. Only secondary or small-sample sources were found [20] (confidence: low).
- **Single-leg stance:** Springer 2007 tested 549 healthy adults aged 18-99 in six age groups, eyes open and closed. Performance was age-dependent, not sex-dependent, and inter-rater ICC was 0.994-0.998 [21]. Only one value was verified, and only from a secondary summary (SRALab): mean eyes-closed time of 13.1 s at age 18-39 [22]. The full table is not open-access.
- **Shoulder mobility:** no population norms were verified.
- **FMS:** a 2017 BJSM meta-analysis concluded composite scores do not reliably predict injury [23]. Don't use FMS as a stat input.
- Recommendation: score Mobility as **criterion-based pass bands** (e.g., WBLT ≥10 cm, symmetry within 1.5 cm) and say so in the UI.

### 5. Body composition and Movement

**Body fat.** Gallagher 2000 linked BMI cut-offs to %fat measured by 4-compartment model or DXA in 1,626 adults across three ethnicities [24]. The widely circulated chart derived from it (secondary [25]; confidence: medium):

| Sex/age | Under | Healthy | Over | Obese |
|---|---|---|---|---|
| Men 20-39 | <8 | 8-19 | 20-25 | >25 |
| Men 40-59 | <11 | 11-21 | 22-28 | >28 |
| Men 60-79 | <13 | 13-24 | 25-30 | >30 |
| Women 20-39 | <21 | 21-33 | 34-39 | >39 |
| Women 40-59 | <23 | 23-34 | 35-40 | >40 |
| Women 60-79 | <24 | 24-35 | 36-42 | >42 |

Consumer BIA scales are far from DXA, so trust is low.

**Muscle mass (ALMI = appendicular lean mass/height², DXA).**
- Baumgartner 1998 sarcopenia cut-offs: 7.26 kg/m² for men and 5.45 kg/m² for women [26].
- Gould 2014 (Geelong, 2,371 adults) young-adult T-score cut-offs: −2.0 = 6.94 (men) and 5.30 (women); −1.0 = 7.87 and 6.07 [47].
- These are low-end thresholds. No open percentile table for high ALMI was found.

**Waist-to-height ratio (NICE NG246):** 0.4-0.49 is healthy, 0.5-0.59 is increased risk, and ≥0.6 is high risk [29]. This is the best single self-measurable body-comp input.

**Steps: dose-response points.**

| Source | Population | Curve points |
|---|---|---|
| Paluch 2022 [27] | 15 cohorts, 47,471 adults | Quartile medians 3,553 / 5,801 / 7,842 / 10,901 steps; HR vs Q1: 0.60 / 0.55 / 0.47. Plateau 6,000-8,000 (≥60 y), 8,000-10,000 (<60 y) |
| Ding 2025 [28] | 57 studies, 35 cohorts | 7,000 vs 2,000 steps: all-cause mortality HR 0.53; CVD incidence 0.75; dementia 0.62; depressive symptoms 0.78; falls 0.72 (very-low-certainty evidence). Inflection about 5,000-7,000 for all-cause mortality, CVD incidence, dementia and falls; no age-specific analysis |
| Banach 2023 [30] | 17 cohorts, 226,889 | Reference (lowest) quartile medians 3,867 (all-cause) and 2,337 (CV mortality), above which more steps were better. The published abstract says 3,867; the press coverage said 3,967. HR 0.85 per +1,000 steps (all-cause); HR 0.93 per +500 steps (CV) |
| Stens 2023 [31] | 12 studies, >110,000 | Minimal dose 2,517 (mortality), 2,735 (CVD); optimal 8,763 (−60 % mortality) and 7,126 (−51 % CVD) vs 2,000 |
| del Pozo Cruz 2022 [32] | UK Biobank, 78,430 | Dementia: minimal 3,826 (HR 0.75), optimal 9,826 (HR 0.49); peak-30-min cadence 112 steps/min |

### 6. Recovery and sleep

- **Duration:** the AASM/SRS consensus calls for 7 h or more for adults [33].
- **Regularity:** Windred (UK Biobank, 60,977 adults, accelerometry) found SRI median 81.0 (IQR 73.8-86.3). The top four SRI quintiles had 20-48 % lower all-cause mortality than the least regular quintile. Regularity predicted mortality better than duration [34]. The median and IQR give only three anchors (P25/P50/P75) for an SRI percentile table, and the sample is older (mean age 63) and from the healthy-volunteer UK Biobank.
- **Efficiency:** NSF puts good quality at ≥85 % efficiency and a latency of ≤30 min. Both 0-15 and 16-30 min were rated good, and the NSF does not rank ≤15 min as better. It flags efficiency ≤74 % (≤64 % for young adults), latency of 46-60 min (except in older adults) and latency >60 min as not good [35].
- **Accuracy:** six wrist devices against PSG (62 adults, mostly men) detected >90 % of sleep epochs but had specificity of only 29-52 % and stage kappa 0.21-0.53 [36]. Total sleep time and regularity can be scored; stage minutes can't.

### 7. Nutrition and metabolic

- **Protein:** a meta-analysis of 49 RCTs (1,863 participants) found that protein supplementation added fat-free mass during resistance training. In a break-point sub-analysis (42 study arms, 723 participants), gains in fat-free mass plateaued at about 1.62 g/kg/day, but the 95 % CI ran from 1.03 to 2.20 and the break-point model was not statistically significant (p = 0.079). The authors themselves suggest about 2.2 g/kg/day for people trying to maximise gains [37]. Treat about 1.6 g/kg/day as "most of the benefit captured", not a hard cap: score full credit from about 1.6, with no penalty up to about 2.2.
- **Fiber:** the greatest risk reduction was at 25-29 g/day, and higher intakes may add benefit [38].

**Table N1. Population percentiles, untreated US adults 18-85 (NHANES 2005-2016, n=12,696), mg/dL. Source: NLA 2024 Table 1 [39].**

| Pct | LDL-C | non-HDL-C | ApoB |
|---|---|---|---|
| 1 | 45 | 59 | 41 |
| 5 | 63 | 79 | 54 |
| 10 | 72 | 88 | 61 |
| 20 | 85 | 103 | 70 |
| 30 | 95 | 114 | 77 |
| 40 | 104 | 125 | 84 |
| 50 | 112 | 135 | 90 |
| 60 | 121 | 145 | 97 |
| 70 | 131 | 156 | 104 |
| 80 | 143 | 170 | 113 |
| 90 | 161 | 191 | 125 |
| 95 | 176 | 208 | 137 |
| 99 | 211 | 247 | 160 |

**Guideline thresholds.**

| Marker | Threshold | Direction | Source |
|---|---|---|---|
| LDL-C goal | <100 / <70 / <55 mg/dL by risk tier | Lower is better (causal) | ACC/AHA 2026 [40] |
| ApoB | ACC/AHA 2026: may be measured for residual risk once LDL-C/non-HDL-C goals are met. NLA 2024: consider intensifying therapy at apoB ≥60 (very high risk), ≥70 (high) or ≥90 mg/dL (borderline/intermediate). By regression, LDL-C 55/70/100 corresponds to apoB 62/73/94 when treated and 53/63/83 when untreated. By Table N1 percentiles, LDL-C 70 (about P9) sits near apoB 60; that is a derived reading, not an NLA statement | Lower is better | [40][39] |
| Lp(a) | <30 mg/dL (<75 nmol/L) rule-out; ≥50 mg/dL (≥125 nmol/L) rule-in, with a 30-50 grey zone; >90 % genetic; measure at least once in adulthood. The mg/dL and nmol/L pairs are pragmatic, not exact conversions | **Fixed trait** (it can rise at menopause) | EAS 2022 [41], ACC/AHA 2026 [40] |
| HbA1c | <5.7 % normal; 5.7-6.4 prediabetes; ≥6.5 diabetes | Lower is better within normal | ADA 2026 [42] |
| Fasting glucose | 100-125 mg/dL prediabetes; ≥126 diabetes | Lower is better within normal | ADA 2026 [42] |
| hs-CRP | <1 low, 1-3 average, >3 mg/L higher risk (approximate tertiles) | Context-dependent (acute-phase) | CDC/AHA 2003 [43] |
| BP (US) | <120/<80 normal; 120-129/<80 elevated; 130-139/80-89 stage 1; ≥140/90 stage 2 | Lower is better, floor for symptoms | AHA/ACC 2025 [44] |
| BP (EU) | <120/<70 non-elevated; 120-139/70-89 elevated; ≥140/90 hypertension; treated target 120-129 systolic | Same | ESC 2024 [45] |

Lp(a)HORIZON (8,323 patients with established CVD; enrolment confirmed on ClinicalTrials.gov NCT04023552) missed its primary MACE endpoint in a Novartis topline announcement in September 2026, although pelacarsen lowered Lp(a) [46]. Full results were still to be presented at the time of that report. HDL-C, triglyceride percentiles and NHANES HbA1c/glucose distributions were not retrieved (gap). Any claim that HDL is U-shaped is **unverified** in this research.

## Implications for MINMAX

**Proposed stat model.** Every stat value = the age- and sex-matched percentile (0-100), so **"Top 1 %" literally means stat ≥ 99 against a named reference**. Interpolate in probit space: convert table anchors to z-scores, interpolate linearly in z between anchors and across age midpoints, then convert back. Combine metrics as a weighted mean of z-scores, then convert to a percentile; never average percentiles. Each stat carries a confidence interval from device error and a coverage flag.

| Stat | Inputs (weight) | Norm table | Data source | Scoring |
|---|---|---|---|---|
| **Aerobic** | VO2max (0.8), RHR personal trend (0.2, not ranked) | FRIEND 2022 (A1) | Wearable estimate, field test, lab CPET | Population percentile |
| **Strength** | Grip (0.5), push-ups (0.2), chair stand ≥60 y (0.3) or push-ups <60 y; ALMI if DXA | Dodds/PURE (S1/S2), Cooper, Rikli & Jones | In-app tests plus dynamometer | Population percentile; Lifter percentile shown separately |
| **Power** | CMJ height | Koivunen 2026 (mean ± SD; adult cells n = 4-502) | In-app jump test | Modelled percentile, low trust; no tail claims for adults |
| **Mobility** | Sit-and-reach, WBLT, single-leg stance | CSEP, criterion bands | In-app tests | **Criterion score** (passed bands/total × 100), labelled "not a percentile" |
| **Recovery** | Sleep ≥7 h share (0.35), SRI (0.35), efficiency (0.15), HRV vs own baseline (0.15) | AASM, Windred SRI, NSF | Wearable | Mixed: SRI percentile plus criterion |
| **Nutrition** | Protein g/kg (full credit at about 1.6, no penalty up to about 2.2), fiber vs 25-29 g, WHtR, labs (ApoB, HbA1c, BP) | Morton, Reynolds, NICE, NHANES N1, guidelines | Self-report, labs | Guideline bands; ApoB inverse NHANES percentile capped at the guideline goal |
| **Movement** | Steps (7-day median), cadence | Paluch/Ding/Stens curve | Wearable or phone | Dose-response: 0 at 2,000 steps, 100 at the age-specific plateau (8k under 60, 7k at 60+), so "100" means "benefit captured", not "top 1 %" |

**Claims and tiers.**
- A claim like "Top 5 % VO2max" requires that (measured value − 1 SD device error) ≥ the reference P95, plus a trust tier ≥ device-verified.
- "Elite" (≥2 SD, Mandsager) needs CPET or a validated field test.
- No claim may extrapolate beyond the deepest published percentile without a "modelled" label.
- Lp(a) appears as a permanent trait card ("Inherited: low/grey/high"). It earns no XP and opens no Bottleneck region.

**Bottleneck fairness.** Mobility and Power have the weakest norms. They should be eligible as the bottleneck only when the user has completed their in-app tests; otherwise the engine might send everyone to Temple of Motion because of missing data.

**Engine data format.** Store each norm table as {source, DOI, population, protocol, sex, age band, anchors[p→value], licence}, and version them. Several tables (Cooper/ACLS full, ACSM book tables, Springer full table) are copyrighted or licensed. Use open-access tables (Dodds is CC-BY; FRIEND numbers are facts, but check the reproduction terms).

## Open questions

1. Get the FRIEND 2022 primary tables, including P90/P95 and the cycle tables, and confirm the transcription in Table A1. The women's rows need checking first (see §1).
2. Licensing: can ACSM/Cooper percentile tables be embedded commercially, or should MINMAX derive its own tables from open data?
3. Population norms for pull-ups, sprint, broad jump, shoulder mobility and barbell lifts don't exist in open form. Should MINMAX build its own sampled norm cohort (with consent, device-verified) over time?
4. Non-US/UK users: are PURE region tables and Asian-specific body-fat and WHtR norms needed at launch?
5. HDL-C, TG, HbA1c and glucose NHANES percentile tables still need retrieving.
6. Phone-based CMJ validity, and how well wearable SRI agrees with UK Biobank accelerometry, are not established.
7. Should non-binary users or users on hormone therapy choose a reference sex per metric?

## Sources

1. Kaminsky LA et al. Updated Reference Standards for CRF … FRIEND (Mayo Clin Proc 2022) — https://pubmed.ncbi.nlm.nih.gov/34809986/ — accessed 2026-10-02
2. FitnessNorms, VO2 Max Norms by Age & Sex (transcribes FRIEND 2022 treadmill) — https://fitnessnorms.com/cardio/vo2-max/ — accessed 2026-10-02
3. Mandsager K et al. Association of CRF With Long-term Mortality (JAMA Netw Open 2018) — https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2707428 — accessed 2026-10-02
4. Topend Sports, Cooper 12-Minute Run Test — https://www.topendsports.com/testing/tests/cooper.htm — accessed 2026-10-02
5. Cooper Institute Physical Fitness Norms, 50th percentile (copy hosted by Arizona Game & Fish) — https://s3.amazonaws.com/azgfd-portal-wordpress/azgfd.wp/wp-content/uploads/2017/06/05153632/Cooper-Institute-Physical-Fitness-Norms-50perc.pdf — accessed 2026-10-02
6. Quer G et al. Inter- and intraindividual variability in daily resting heart rate, 92,457 adults (PLoS ONE 2020) — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0227709 — accessed 2026-10-02
7. Nunan D et al. Quantitative systematic review of normal values for short-term HRV (PACE 2010) — https://repository.essex.ac.uk/943/ — accessed 2026-10-02
8. Natarajan A et al. HRV with photoplethysmography in 8 million individuals (Lancet Digit Health 2020) — https://pubmed.ncbi.nlm.nih.gov/33328029/ — accessed 2026-10-02
9. Dodds RM et al. Grip strength across the life course: normative data from twelve British studies (PLoS ONE 2014) — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0113637 — accessed 2026-10-02
10. Leong DP et al. Reference ranges of handgrip strength from 125,462 adults in 21 countries (PURE, JCSM 2016) — https://pmc.ncbi.nlm.nih.gov/articles/PMC4833755/ — accessed 2026-10-02
11. Yang J et al. Push-up Capacity and Future Cardiovascular Events (JAMA Netw Open 2019) — https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2724778 — accessed 2026-10-02
12. Topend Sports, Push-Up Test (source-provenance note) — https://www.topendsports.com/testing/tests/home-pushup.htm — accessed 2026-10-02
13. Strand SL et al. Norms for an Isometric Muscle Endurance Test (J Hum Kinet 2014) — https://pmc.ncbi.nlm.nih.gov/articles/PMC4096102/ — accessed 2026-10-02
14. Rikli & Jones 30-second Chair Stand norms (Univ. of Missouri Geriatric Toolkit) — https://geriatrictoolkit.missouri.edu/cv/30sec-chair-rise-rikli-jones.doc — accessed 2026-10-02
15. Strength Level, Strength Standards (methodology) — https://strengthlevel.com/strength-standards — accessed 2026-10-02; tier percentile definitions on exercise pages, e.g. https://strengthlevel.com/strength-standards/bench-press/kg — accessed 2026-10-02
16. Mayhew AJ et al. Normative values for strength and function, CLSA (Innov Aging 2023) — https://pmc.ncbi.nlm.nih.gov/articles/PMC10736589/ — accessed 2026-10-02
17. Koivunen et al. Effect of Age and Sex on Lower Extremity Power … 30,217 Finnish participants (Scand J Med Sci Sports 2026) — https://pmc.ncbi.nlm.nih.gov/articles/PMC13280190/ — accessed 2026-10-02
18. Normative values of vertical jump and sit-and-reach, China National Health Survey (abstract page only) — https://www.sciencedirect.com/science/article/pii/S258979182300018X — accessed 2026-10-02
19. Topend Sports, Sit and Reach Test Norms (CSEP/CPAFLA) — https://www.topendsports.com/testing/norms/sit-and-reach.htm — accessed 2026-10-02 (via search result)
20. Physiopedia, Knee to Wall Test — https://www.physio-pedia.com/Knee_to_Wall_Test — accessed 2026-10-02 (via search result)
21. Springer BA et al. Normative values for the unipedal stance test (J Geriatr Phys Ther 2007) — https://pubmed.ncbi.nlm.nih.gov/19839175/ — accessed 2026-10-02
22. Shirley Ryan AbilityLab, Timed Unipedal Stance Test — https://www.sralab.org/rehabilitation-measures/timed-unipedal-stance-test-single-leg-support-one-leg-stance-test — accessed 2026-10-02
23. Moran RW et al. Do FMS composite scores predict subsequent injury? (BJSM 2017) — https://www.researchgate.net/publication/315733488_Do_Functional_Movement_Screen_FMS_composite_scores_predict_subsequent_injury_A_systematic_review_with_meta-analysis — accessed 2026-10-02
24. Gallagher D et al. Healthy percentage body fat ranges (AJCN 2000) — https://pubmed.ncbi.nlm.nih.gov/10966886/ — accessed 2026-10-02
25. Body fat percentage chart derived from Gallagher 2000 — https://cf.ltkcdn.net/exercise/files/1905-body-fat-percentage-chart.pdf — accessed 2026-10-02 (via search result)
26. Sarcopenia and sarcopenic obesity (review citing Baumgartner 1998 cut-offs) — https://pmc.ncbi.nlm.nih.gov/articles/PMC5094937/ — accessed 2026-10-02 (via search result)
27. Paluch AE et al. Daily steps and all-cause mortality: 15 cohorts (Lancet Public Health 2022) — https://doi.org/10.1016/s2468-2667(21)00302-9 — accessed 2026-10-02
28. Ding D et al. Daily steps and health outcomes: dose-response meta-analysis (Lancet Public Health 2025) — https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(25)00164-1/fulltext — accessed 2026-10-02 (abstract via Europe PMC)
29. NICE NG246, Identifying and assessing overweight, obesity and central adiposity — https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity — accessed 2026-10-02
30. Banach M et al. Daily step count and all-cause and CV mortality (Eur J Prev Cardiol 2023) — https://pure.johnshopkins.edu/en/publications/the-association-between-daily-step-count-and-all-cause-and-cardio/ — accessed 2026-10-02
31. Stens NA et al. Relationship of Daily Step Counts to All-Cause Mortality and CV Events (JACC 2023) — https://www.jacc.org/doi/10.1016/j.jacc.2023.07.029 — accessed 2026-10-02
32. del Pozo Cruz B et al. Daily step count and incident dementia, 78,430 adults (JAMA Neurol 2022) — https://doi.org/10.1001/jamaneurol.2022.2672 — accessed 2026-10-02
33. Watson NF et al. Recommended Amount of Sleep for a Healthy Adult (AASM/SRS, JCSM 2015) — https://pmc.ncbi.nlm.nih.gov/articles/PMC4442216/ — accessed 2026-10-02
34. Windred DP et al. Sleep regularity is a stronger predictor of mortality risk than sleep duration (Sleep 2024) — https://doi.org/10.1093/sleep/zsad253 — accessed 2026-10-02
35. Ohayon M et al. NSF sleep quality recommendations: first report (Sleep Health 2017) — https://fatiguemanagersnetwork.org/wp-content/uploads/Ohayon-et-al.2017_National-Sleep-Foundations-Sleep-Quality-Recommendations.pdf — accessed 2026-10-02 (via search result)
36. Schyvens AM et al. Performance validation of six commercial wrist-worn sleep trackers vs PSG (Sleep Adv 2025) — https://doi.org/10.1093/sleepadvances/zpaf021 — accessed 2026-10-02
37. Morton RW et al. Protein supplementation and RET-induced gains (BJSM 2018) — https://pubmed.ncbi.nlm.nih.gov/28698222/ — accessed 2026-10-02
38. Reynolds A et al. Carbohydrate quality and human health (Lancet 2019) — https://doi.org/10.1016/s0140-6736(18)31809-9 — accessed 2026-10-02
39. Role of apolipoprotein B in clinical management: NLA Expert Clinical Consensus (J Clin Lipidol 2024) — https://pmc.ncbi.nlm.nih.gov/articles/PMC11734832/ — accessed 2026-10-02
40. ACC, ACC/AHA Release New Clinical Guideline for Managing Dyslipidemia (2026-03-13) — https://www.acc.org/latest-in-cardiology/journal-scans/2026/03/13/15/20/acc-aha-release-new-clinical-guideline-for-managing-dyslipidemia — accessed 2026-10-02
41. Kronenberg F et al. Lp(a) in ASCVD and aortic stenosis: EAS consensus statement (Eur Heart J 2022) — https://pmc.ncbi.nlm.nih.gov/articles/PMC9639807/ — accessed 2026-10-02
42. ADA, Diagnosis and Classification of Diabetes: Standards of Care in Diabetes—2026 — https://diabetesjournals.org/care/article/49/Supplement_1/S27/163926/2-Diagnosis-and-Classification-of-Diabetes — accessed 2026-10-02 (via search result)
43. Pearson TA et al. Markers of inflammation and CVD, CDC/AHA statement (Circulation 2003) — https://www.researchgate.net/publication/270835346_Markers_of_inflammation_and_cardiovascular_disease_AHACDC_scientific_statement — accessed 2026-10-02 (via search result)
44. ACC, New ACC/AHA Guideline … High Blood Pressure (2025-08-14) — https://www.acc.org/Latest-in-Cardiology/Journal-Scans/2025/08/14/15/36/New-ACC-AHA-Guideline-Addresses-Prevention-Detection-Evaluation-and-Management-of-HBP — accessed 2026-10-02 (via search result)
45. Navigating the 2024 ESC Hypertension Guidelines (JACC) — https://www.jacc.org/doi/10.1016/j.jacc.2024.10.114 — accessed 2026-10-02 (via search result)
46. Healio, Lp(a)-lowering drug pelacarsen fails to reduce CV events (2026-09-08) — https://www.healio.com/news/cardiology/20260908/not-the-results-we-hoped-for-lpalowering-drug-pelacarsen-fails-to-reduce-cv-events — accessed 2026-10-02 (via search result)
47. Gould H et al. Total and appendicular lean mass reference ranges, Geelong (Calcif Tissue Int 2014) — https://pubmed.ncbi.nlm.nih.gov/24390582/ — accessed 2026-10-02

## Verification notes (2026-10-02)

This was an independent check against primary sources, using Europe PMC / PMC full texts, ClinicalTrials.gov and publisher pages. The web-search quota ran out early, so the checks relied on direct retrieval of known primary records. Status key: **verified**, **corrected** (text changed), **unverified**, **refuted** (claim as written was wrong).

**Key claims**

1. **FRIEND 2022 sample and decline (22,379 tests; 16,278 treadmill, 6,101 cycle; 34 labs; 20-89 y; 1.5-4.6 lower than 2015; 13.5 %/decade treadmill):** verified against the abstract. https://europepmc.org/article/MED/34809986
2. **FRIEND 2022 percentile table (Table A1):** unverified against the primary source, which is paywalled (HTTP 403 at mayoclinicproceedings.org). The FitnessNorms transcription matches Table A1 cell for cell, and it is internally consistent with the abstract's average fall of about 4.0 ml/kg/min per decade. Its older-age medians sit just below the FRIEND 2022 *means* quoted by an independent paper (men 60-69/70-79/80-89: 25.4/21.2/17.9; women 20.0/17.5/15.9): https://pmc.ncbi.nlm.nih.gov/articles/PMC11851712/. Against the FRIEND 2015 table (https://pmc.ncbi.nlm.nih.gov/articles/PMC4919021/; P50 men 20-29 = 48.0), the men's rows fit the "1.5-4.6 lower" statement. The women's rows at 40-79 are only 0.3-1.2 lower, so a caveat was added.
3. **Mandsager 2018 (122,007 patients, inverse association, no upper limit, elite ≥2 SD best):** verified. https://europepmc.org/article/MED/30646252. Corrected by adding a caveat: referral cohort at one tertiary centre, *estimated* METs, and 2 SD relative to that cohort.
4. **Dodds 2014 (49,964 participants, 60,803 observations, 12 British studies; peak 51/31 kg; cut-offs 27/16 kg; P10-P90 table):** verified. All 150 adult cells of Table S1 match Table 2 of the full text: https://pmc.ncbi.nlm.nih.gov/articles/PMC4256164/. Corrected the framing: the 27/16 kg cut-offs are the authors' *suggestion* at T ≤ −2.5 (T ≤ −2 gives 32/19 kg), and the protocol is usually the maximum of both hands (one study used the dominant hand only).
5. **PURE Europe/North America grip:** verified. Table S2 matches PURE Table 2 ("Average" rows) exactly: https://europepmc.org/article/PMC/PMC4833755. Added caveats: the value is the mean of each hand's maximum, and the region is Canada, Sweden, Poland and Turkey, with no US sites.
6. **Nunan 2010 (44 studies, 21,438 participants, below Task Force norms, up to 260,000 %):** numbers verified. https://europepmc.org/article/MED/20663071. Corrected an overstatement: the abstract says "a number of studies" showed the variation, and also reports "a degree of homogeneity" and recommends using the data for reference ranges. "No usable universal norm" was softened to "not transferable to consumer devices".
7. **Quer 2020 RHR (92,457; 65.5 ± 7.7; 95 % ranges 50-80 and 53-82; ≤10 % variance explained):** verified in the full text: https://pmc.ncbi.nlm.nih.gov/articles/PMC7001906/. Added a caveat on sample representativeness.
8. **Paluch 2022 (15 cohorts, 47,471; quartile medians 3,553/5,801/7,842/10,901; HRs 0.60/0.55/0.47; plateaus 6-8k at ≥60 and 8-10k at <60):** verified. https://pmc.ncbi.nlm.nih.gov/articles/PMC9289978/
9. **Ding 2025 (7,000 vs 2,000 steps, HR 0.53; inflection 5,000-7,000):** verified. https://europepmc.org/article/MED/40713949. Added that falls evidence is very low certainty and that there was no age-specific analysis.
10. **Windred SRI (60,977; median 81.0, IQR 73.8-86.3; 20-48 % lower mortality; stronger than duration):** verified. https://pmc.ncbi.nlm.nih.gov/articles/PMC10782501/
11. **NLA/NHANES apoB and LDL-C percentiles (n = 12,696, untreated, 2005-2016):** verified; all 39 cells of Table N1 match NLA Table 1: https://pmc.ncbi.nlm.nih.gov/articles/PMC11734832/. Corrected the guideline row: the NLA does not state "LDL-C 70 ≈ apoB 60 by percentile". It gives apoB intensification thresholds of 60/70/90 mg/dL and regression equivalents for LDL-C 55/70/100 of apoB 62/73/94 (treated) and 53/63/83 (untreated).
12. **2026 ACC/AHA dyslipidemia guideline (2026-03-13; goals <100/<70/<55; Lp(a) at least once; lifestyle minimally affects Lp(a)):** verified on the ACC page. An independent confirmation that goals were restored is "The return of 'goals' in the 2026 ACC/AHA/Multisociety guideline" (J Clin Lipidol 2026), https://doi.org/10.1016/j.jacl.2026.06.006, and the JACC Guideline-at-a-Glance is at https://doi.org/10.1016/j.jacc.2026.02.4872.
13. **EAS 2022 Lp(a) (>90 % genetic; rule-out <30 mg/dL/<75 nmol/L; rule-in ≥50 mg/dL/≥125 nmol/L):** verified in the full text: https://europepmc.org/article/PMC/PMC9639807. Added the 30-50 grey zone and a note that the unit pairs are not exact conversions.
14. **Morton 2018 (49 RCTs, 1,863 participants; plateau at 1.62 g/kg/day):** numbers verified. https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/. Corrected an overstatement: the break-point came from a subset of 42 arms and 723 participants, was not significant (p = 0.079), and had a 95 % CI of 1.03-2.20. The authors suggest about 2.2 g/kg/day to maximise gains, so "cap" was changed to "most benefit by about 1.6, no penalty to about 2.2".
15. **Strength Level (195.5 M lifts, 27.9 M users, 46.2 M qualifying; no percentile definition of tiers):** the counts are verified (data from 7 March 2015 to 11 March 2026). The part saying there is no percentile definition is **refuted**: the exercise pages define Beginner/Novice/Intermediate/Advanced/Elite as stronger than 5/20/50/80/95 % of Strength Level lifters. https://strengthlevel.com/strength-standards/bench-press/kg

**Other claims checked**

- **Strand 2014 plank:** medians 110/72 s verified. **Refuted:** "P75 137/95 s". Those are the P70 values; the paper gives no P75, and its P80 is 157/108 s. https://pmc.ncbi.nlm.nih.gov/articles/PMC4096102/
- **Koivunen 2026 CMJ:** the 30,217 total, mean ± SD values and decline rates are verified. Corrected the framing: 24,988 of the participants are aged 11-15, adult men over 50 number 31 in total (n = 4-10 per band), and "largest" does not mean adequate for adult norms. https://pmc.ncbi.nlm.nih.gov/articles/PMC13280190/
- **Banach 2023 steps:** **corrected**. The published abstract gives 3,867, not 3,967, and the figure is the median of the reference (lowest) quartile, not a fitted "benefit starts here" dose. 2,337 and HR 0.85 per +1,000 steps are verified. https://europepmc.org/article/MED/37555441
- **Stens 2023** (2,517 / 2,735 / 8,763 / 7,126; 111,309 people from 12 studies): verified. https://europepmc.org/article/MED/37676198
- **del Pozo Cruz 2022** (78,430; 3,826 with HR 0.75; 9,826 with HR 0.49; cadence 112): verified. https://pmc.ncbi.nlm.nih.gov/articles/PMC9449869/
- **NSF sleep quality:** efficiency ≥85 % good, and ≤74 % (≤64 % for young adults) flagged, are verified in the cited PDF. **Corrected:** "≤15 min latency best" is unsupported, because NSF rated 0-15 and 16-30 min equally as good.
- **Schyvens 2025 wearables vs PSG** (sensitivity >90 %, specificity 29-52 %, kappa 0.21-0.53): verified; n = 62, 52 of them men. https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/
- **Natarajan 2020** (8,203,261 users; HF power −82.0 % in men and −80.9 % in women from 20 to 60; no sex difference in RMSSD): verified. https://europepmc.org/article/MED/33328029
- **Yang 2019 push-ups** (1,104 men; >40 vs <10, IRR 0.04): verified, with a caveat about 37 events and a wide CI. https://pmc.ncbi.nlm.nih.gov/articles/PMC6484614/
- **Cooper Institute 50th percentiles** (1.5-mile run and push-ups): verified against the cited PDF.
- **Cooper 12-min formula:** verified as equivalent to Topend's formula, with r ≈ 0.90. The n = 115 is unverified.
- **Gould 2014 ALMI** (1,411 men + 960 women = 2,371; cut-offs 6.94/7.87 and 5.30/6.07): verified. https://europepmc.org/article/MED/24390582
- **Gallagher 2000** (1,626 adults, three ethnic groups, 4C/DXA): verified. https://europepmc.org/article/MED/10966886. The derived chart values themselves are unverified (secondary source).
- **Springer 2007** (549 adults; ICC 0.994/0.998; age-dependent, not sex-dependent): verified. https://europepmc.org/article/MED/19839175. The 13.1 s eyes-closed value comes only from a secondary source (SRALab).
- **CLSA Mayhew 2023** (25,470; aged 45-85): verified, but it is a conference abstract and its percentiles are P5/P10/P20/P50/P80/P90/P95 (corrected).
- **Reynolds 2019 fibre** (25-29 g/day): verified. https://europepmc.org/article/MED/30638909
- **Lp(a)HORIZON** (8,323 patients; primary endpoint missed): enrolment verified on ClinicalTrials.gov (https://clinicaltrials.gov/study/NCT04023552). Reworded as a topline announcement.
- **2025 AHA/ACC BP guideline** (2025-08-14; hypertension ≥130/80 retained): verified via https://doi.org/10.1093/ndt/gfag055 and Hypertension companion pieces. The individual category cut-offs were not re-read from the guideline text.
- **Push-up "source unknown" note (Topend):** verified.
- **CSEP sit-and-reach age bands and 26 cm zero:** unverified, because the cited page does not contain them. Marked as such.
- **Knee-to-wall (Physiopedia):** unverified (HTTP 403).
- **Not re-checked** (left as stated, already labelled as secondary or guideline-standard): Rikli & Jones chair-stand ranges, Baumgartner cut-offs, the NICE NG246 WHtR bands (the NICE page returned 403), ADA 2026, CDC/AHA hs-CRP, ESC 2024 BP and the Moran 2017 FMS conclusion.
