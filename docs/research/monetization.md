# Monetization and Business Model: Subscriptions, B2B2C, Insurer Programs, and Realistic Revenue Scenarios

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

## Summary for the founder

- **Health & Fitness is the best subscription category to be in, but the absolute numbers are small.** RevenueCat's 2026 report (115k+ apps, $16B+ revenue, mostly 2025 data) puts median Health & Fitness download-to-paid at 2.9% (top quartile 6.2%), trial-to-paid at 37.7%, D60 revenue per install at $0.66, and first-year realized LTV per payer at $35.64. All of these lead or nearly lead the category rankings [1]. (confidence: high)
- **Annual plans carry the category, and renewal is the weak spot.** RevenueCat's plan-duration chart shows 68% of Health & Fitness plans sold as annual, the most annual-heavy category, and annual plans bring in 59% of category revenue [1]. (One caption in the same report calls the category "monthly-heavy (68%)", so the report contradicts itself; the majority of its text says annual.) The median first renewal of an annual plan in the category is only 25% (quartiles 16–37%) [3]. Retention, not acquisition, sets the ceiling. (confidence: high)
- **Price high and annual-first, but expect weaker renewal.** Adapty finds expensive Health & Fitness annual plans earn about 4× more per user than cheap ones ($70 vs $17 LTV; Adapty calls it "a 4x gap") and sees a 4.4× annual-price gap between Germany and Turkey [5]. Germany, the UK, France, Japan and Switzerland are high-willingness markets [5]. The trade-off: across all categories, RevenueCat finds high-priced annual plans renew less at the first renewal (24% vs 37% for low-priced) [1]. Recommended anchor: $/€/CHF 59.99–79.99 per year plus $7.99–9.99 per month, with a 7-day or longer trial. (confidence: medium)
- **Store fees are 15% for you, not 30%.** Apple's Small Business Program charges 15% below $1M in prior-year proceeds [6]. Google Play subscriptions are 15% on Play Billing, now split into a 10% service fee plus a 5% billing fee in the US, UK and EEA from 30 Jun 2026 [7]. US link-out to web checkout is allowed, but whether Apple may charge a commission on it is in litigation. The Supreme Court agreed on 30 Jun 2026 to hear Apple's appeal, and its term opens in October 2026; no argument date had been published as of 14 Sep 2026 [8]. (confidence: high on store rates, medium on US link-out)
- **Swiss insurer bonus programs are real, but they buy raw activity data, not third-party achievements.** Helsana+, CSS active365 and SWICA Benevita pull steps, heart rate, active minutes or MET from Apple Health, Health Connect, Garmin, Fitbit and Polar into their own apps, and those apps are run by specialist vendors (Fjuul for Helsana, eTherapists for CSS, bitforge/DEPT for SWICA) [10][12][13][14]. None of the sources says any of them accepts a third-party app's "verified claim". The realistic B2B2C path is to be the vendor, not a data source. (confidence: high on facts, medium on the implication)
- **German statutory insurers are a poor first B2B target.** In 2021 the BAS refused to let insurers make fitness-app use and fitness-data transmission a condition for § 65a bonuses [16]. TK only folded its tracker-based challenges (Apple Health, Google Fit/Health Connect) into its bonus program in Sep 2026 [15]. That shows tracker data can now earn GKV bonus points as one option among others, so the 2021 position should not be read as a blanket ban; whether the BAS has since updated its view is unverified. Generali Vitality closed to new business on 30 Apr 2025, with all memberships ended by 2 Feb 2026 at the latest [18]. (confidence: high on facts, medium on the conclusion)
- **For a solo founder, the realistic 36-month range is about $25k to $1.3M cumulative revenue, with a base case of about $200k cumulative and roughly $120k ARR at month 36.** These figures are modelled from category medians below, not forecasts. (confidence: low; they are models)
- **The three highest-leverage levers:** (1) activation-to-trial, meaning the Origin reveal before the paywall; (2) annual renewal, meaning the weekly quest loop plus streak protection; (3) localized paywalls and PPP pricing in the top five languages. A claim that RevenueCat found locale tests deliver the highest LTV uplift of any experiment type (+62.3%) could not be found in the cited guide [4] or in the State of Subscription Apps page [1] (**unverified**). (confidence: medium)
- **Launch countries: Switzerland, Germany, Austria, US and UK.** This means two languages (German and English) and covers the US (more than half of global Health & Fitness spend) plus the UK (about 8%, second-largest) [28]. (confidence: medium)

## Findings

### 1. Subscription benchmarks (2026)

**RevenueCat State of Subscription Apps 2026, Health & Fitness [1][2][3]** (report published 2026, metrics mostly for 2025):

| Metric | Median | Top quartile / note |
|---|---|---|
| Download → trial (D30) | 6.9% | >23% |
| Trial → paid | 37.7% | >51.4%; 2nd of all categories after Travel (43.5%) |
| Download → paid (D35) | 2.9% | >6.2%. For context, all-category regional medians are North America 2.56% and IN/SEA 1.37% (not H&F-specific) |
| RPI D14 / D60 | $0.48 / $0.66 | Highest of all categories |
| Realized LTV per payer, M1 / Y1 | $24.23 / $35.64 | For context, all-category Y1 medians by developer HQ are North America $32, Western Europe $25, global $23, IN/SEA $14 (not H&F-specific) |
| Plan mix sold | 68% annual; weekly (4%) and lifetime/other (4%) are the lowest of any category; monthly ≈ 24% by subtraction | Most annual-heavy category; annual = 59% of H&F revenue. One caption in the report says "monthly-heavy (68%)", contradicting its own chart text |
| Median prices | $4.99/wk, $9.99/mo, $39.94/yr | — |
| Annual first renewal (H&F) | 25% | 16% (Q1) – 37% (Q3) [3] |
| Annual first renewal by price tier (all categories) | Low 37%, mid 27%, high 24% | Expensive annual plans lose more users at renewal 1, though they converge by renewal 3 [1] |
| Trials 17–32 days vs ≤4 days (all categories) | 42.5% vs 25.5% conversion | Yet 82.1% of H&F trials start on day 0 [1] |
| AI apps | Y1 LTV $30.16 vs $21.37 non-AI | Monthly AI plans retain 36% worse over 12 months (6.1% vs 9.5%) [1][2] |

**Adapty, Health & Fitness (27 Mar 2026) [5]:** install-to-trial 11.2% (North America 14.5%); 12-month install LTV $1.21, the highest of any App Store category (App Store only); annual plans grew from 51% to 61% of revenue; top 10% of apps take 92.6% of category revenue. Global cross-category retention by renewal: 59.2% → 45.1% → 37.1% → 31.6% → 27.6% for renewals 1–5. It keeps declining rather than settling. Adapty and RevenueCat measure trial conversion differently (Adapty's H&F funnel shows 42.2% trial-to-paid), so I compare only within a single source. (confidence: high)

AppsFlyer benchmarks were not retrieved (**unverified**).

**Price points (extending competitors.md):**

| App | Price (US) | Source quality |
|---|---|---|
| Gentler Streak | $8.99/mo, $39.99/yr, lifetime $59.99–179.99 (App Store IAP list) [30] | Primary. Note: competitors.md listed $7.99/$54.99 |
| Hevy Pro | $2.99/mo, $23.99/yr, $74.99 lifetime [31] | Third-party (medium) |
| MacroFactor | $11.99/mo, $47.99/6 mo, $71.99/yr, no free tier, 7-day trial [32] | Third-party (medium) |
| Freeletics Coach | about $34.99–79.99 per 3/6/12-month block [34] | Third-party (low) |
| Noom | Behavioural plan about $17–70/mo (annual $209); Noom Med GLP-1 $199–299/mo [33] | Third-party (medium) |
| Strava, Whoop, Oura, Garmin Connect+, Fitbit Premium, Zwift, Zombies Run!, Habitica | see competitors.md | — |

The pattern holds. Software-only trackers cluster around $24–72 per year. Premium coaching or score products sit at $70–240 per year. A median H&F annual price of $39.94 [1] is below what MINMAX should charge, given Adapty's roughly 4× LTV finding for expensive annual plans [5]. Weigh this against RevenueCat's finding that high-priced annual plans renew less often (24% vs 37% at the first renewal, all categories) [1].

**PPP and regional pricing.** Apple and Google auto-price from exchange rates and taxes, not purchasing power [4]. RevenueCat's localization guide reports these cases [4]:
- In India, competitors price 50–80% below USD-equivalent, while Apple's default suggests only 21% lower.
- UK competitors price about 10% below Apple's suggested level.
- Flo grew 45% overall (80% in non-English markets) through regional pricing, and Brazil became its #3 market after price cuts.

RevenueCat recommends building a 10-competitor price table per market, running large price swings (e.g. $39 vs $69), and measuring LTV over 3–6 months [4]. (confidence: medium; these are vendor case studies)

### 2. Retention economics and gamification

- **Duolingo is the proof that a gamified streak can carry a subscription business.** Q2 2026 figures [9]:
  - 58.7M DAU, 140.6M MAU (DAU/MAU ≈ 42%)
  - 12.7M paid subscribers, about 9% of MAU
  - CURR (next-day retention of current users) at an all-time high of 84%
  - The one-time June 2026 "Streak Revival" event let 15.4M learners revive their streaks, including nearly 8M users who had no active streak when the event began.

  The lesson: offering forgiveness or a comeback path can bring back millions of lapsed users. The letter does not say that a lost streak is the main churn point; that is an inference. (confidence: high on the figures, medium on the lesson)
- **Health & Fitness differs because its retention is a fight against reality, not against boredom.** competitors.md already documented 3–4% day-30 retention and about 47% 90-day paid churn. The 25% median annual first renewal [3] is consistent with that.
- **Hardware-anchored vs software-only.** Whoop's membership includes the hardware and stops tracking without it; Oura's adds features on top of a ring the user already owns (competitors.md). Both have a sunk-cost and data-lock anchor that pure software lacks. A software-only app must replace that with identity (Origin and character history), social commitment and a weekly ritual. Garmin keeps VO2max and percentiles free, so MINMAX cannot charge for raw numbers that the device already shows. (confidence: medium, inference)
- **AI features raise LTV but not retention** [2]. Use LLM features as a paid differentiator, but do not expect them to fix churn.

### 3. B2B2C: insurers and corporate wellness

**Swiss supplementary-insurance (VVG) bonus apps:**

| Program | Reward | Data that counts | Operator | Third-party claims accepted? |
|---|---|---|---|---|
| Helsana+ | Up to about CHF 300+/yr (full account); about CHF 75 basic-only [11] | 10,000 steps/day; average HR 110 for ≥30 min; 150 active kcal in 30 min; via Garmin, Fitbit, Google Fit, Apple Health, phone sensor [10] (the guide is undated and still names Google Fit) | Fjuul ("Fjuul Data Provider" appears in Garmin Connect) [10]; Fjuul supplies the SDK with activity tracking and bonus calculation [14]. Helsana user base: ">150,000" in Fjuul's case box, "over 170,000" in a Helsana testimonial (undated) [14]. The claim that Fjuul sends Helsana only time, duration and MET is not on the cited page (**unverified**) | Not found in any source; only listed data sources |
| CSS active365 | Up to CHF 400/yr; requires CSS supplementary or property insurance (policies under 360 days excluded) [12] | Daily 7,500 steps + 1 exercise; weekly 300 min exercise, 90 min mindfulness, 20 min education; Apple Health, Health Connect, wristbands [12] | eTherapists GmbH. CSS receives only the activeID, completion dates and activity categories/subcategories, with no personal health data [12] | Not found |
| SWICA Benevita | 5% premium discount (Completa Top/Forte), up to 15% (Hospita) [11]; the percentages are not on SWICA's FAQ page | Steps and active minutes only; Apple Health, Health Connect, Garmin, Polar, Fitbit; Health Connect cannot supply active minutes [13] | Built with bitforge AG and DEPT [13] | Not found |
| Visana, Sanitas, ÖKK | CHF 120 (Visana), CHF 200 (ÖKK), not stated (Sanitas) [11] | Steps, sports, etc. [11] | — | Not found |

(confidence: high for Helsana, CSS and SWICA from primary pages; medium for the comparison blog [11])

**Germany (GKV):**
- **Regulator position.** On 31 May 2021 the BAS stated it had not allowed insurers to make fitness-app use and transmission of personal fitness data a bonus prerequisite, on social-data-protection grounds. Photo upload of receipts in apps was acceptable [16].
- **TK.** Since Sep 2026, TK-Fit challenges sit inside the TK bonus program (per TK's FAQ page). Reaching 60,000 steps or 40 km of cycling per week, or a mix, in 10 of 12 weeks earns 1,000 points, and the challenge can be submitted twice per participation year [15]. Points can be paid out or taken as a health dividend, which TK doubles. The €10 cash value of 1,000 points is not stated on the cited page (**unverified**). Sources are Apple Health and Google Fit, with Health Connect on Android; cycling is currently recognised only via Google Fit workouts [15]. The claim that TK stores only start/end date, data source and a pseudonymised ID is not on the cited pages (**unverified**).
- **Other GKV insurers.** A May 2026 guide says AOK, Barmer, DAK and KKH do not accept third-party tracker data, and only IKK has limited device links [17]. This source is a competitor's blog (confidence: low).

**Vitality licensees:**
- Generali Vitality (DE) is closed: new business ended 30 Apr 2025 and memberships terminated by 2 Feb 2026 [18].
- John Hancock Vitality (US): the cited article covers only the Apple Watch offer (SE, Series 11, Ultra 3). Daily workout points come from steps (10k/15k), active calories, or heart rate ≥60% of max for 30/45 min, and points pay down the watch's 24-month instalments [19]. Support for Garmin or Polar is not in this source (**unverified**).
- Vitality UK earns points only from recognised brands (Apple, Garmin, Samsung, Fitbit, Polar, Withings, Strava) [20].
- AIA was not researched (**unverified**).

**Corporate wellness:**
- **Wellhub** accepts "wellness apps" as partners for free. Payment structures "may differ by partner type", and app payout terms are not public [21].
- **Urban Sports Club** has an App Catalog of digital wellbeing apps included in corporate and 1- or 2-year private memberships; Clue Plus is one example [22]. Commercial terms are **unverified**.
- **Personify Health** (formerly Virgin Pulse) integrates a fixed list: Strava, Google Fit, Samsung Health, Apple Health, Health Connect, MyFitnessPal, Higi [23].

**Reading:** every program consumes **raw activity primitives (steps, HR minutes, MET, active kcal) from a short list of big platforms**. No source showed a program accepting a third-party app's derived score or claim. Two practical consequences follow:
1. Workouts recorded in MINMAX should be written back to HealthKit and Health Connect, so they count toward users' existing insurer bonuses. This is a free user benefit and a strong marketing line.
2. The B2B revenue route is to sell as a vendor, the way Fjuul [14] and eTherapists [12] do. Fjuul's cases are an SDK inside the Helsana bonus app, a full app for Nordea (MyLife Go) and "Bio Age Models" for SCOR; Pohjola and KLV are also shown as partners. The page does not use the term "white-label".

Apple guideline 5.1.3 and EU AI Act Annex III (see regulatory.md and wearable-integrations.md) push in the same direction: the insurer must be the publisher and the deployer. (confidence: medium)

### 4. Other revenue streams

- **Lab affiliates.**
  - Superpower's dub.co partner page offers $100 per sale. The $200 is a separate bonus paid when a partner you refer earns at least $400 in commissions, not a per-sale bonus [24]. A search snippet elsewhere claimed $25 per referral, so terms vary.
  - Cerascreen pays about 12% per sale, and Lykon about 10% or €80 for one program, both via affiliate directories [25] (confidence: low).
  - Function Health and Thriva affiliate terms were not found (**unverified**).
  - Risk: an evidence-tiered brand earning commission on lab panels it recommends is a credibility conflict. Show the disclosure and the evidence tier for each test.
- **Device affiliates.** Oura runs its program on Impact, at reportedly 10–20% or about $50 CPA. Garmin is reported at 5–10% [26] (confidence: low; third-party directories). Hardware buyers convert once, so this is a minor revenue line.
- **Coaching marketplace.** No benchmark data was found (**unverified**). It needs supply-side ops and liability handling, so it is not solo-founder-friendly before product-market fit.
- **Licensing the scoring engine and white-label.** The Fjuul precedent [14] shows that insurers buy "motion data → validated units" engines. MINMAX's provenance-aware, evidence-tiered stat engine fits that category. Pricing is not public (**unverified**). Typical sales cycles are long (no source found).

### 5. Costs

- **Stores.**
  - Apple: 15% under the Small Business Program (below $1M prior-year proceeds, enrollment required). Subscriptions after their first year are also 15%, or 10% on EU alternative terms [6].
  - Google: 15% on Play Billing (10% service fee + 5% billing fee), or 10% plus your own processor with alternative billing, per Adapty [7]. Google's own fee page confirms "10% + 5% billing fee" for auto-renewing subscriptions from 30 Jun 2026 in the EEA, UK and US, and from 30 Sep 2026 in Australia and Japan. Other markets stay at a flat 15% until a later, undated rollout. Adapty's "Korea by end-2026, most other markets Sep 2027" is not confirmed on Google's page. Google's page also still describes alternative billing as the Play rate minus 4%, so confirm the exact alternative-billing rate before relying on 10%.
  - US web checkout: in Aug 2026 Apple proposed commissions on linked-out purchases of 15% for standard apps, 10% for Video/News/Mini Apps partner programs and subscription renewals, and 5% for Small Business Program apps. Epic rejected the proposal. The Supreme Court granted review on 30 Jun 2026 and its term opens in October 2026, but the source gives no argument date [8].
- **Data.** HealthKit and Health Connect direct cost about $0. An aggregator costs $300–2,000/month (Junction from $300, ROOK $399, Thryve €499) (wearable-integrations.md).
- **LLM.** Claude Haiku 4.5 costs $1/$5 per million input/output tokens [27]. A coach turn of 2k input and 500 output tokens costs about $0.0045, so 30 turns per user per month is about $0.14 (about $1.60/yr). That is roughly 3% of a $59.99/yr list price, or about 4% of net proceeds, but it must be capped for free users. The 2k-token input is optimistic once a system prompt, the user's stat context and chat history are included; budget 2–3× that unless you use prompt caching. Apple's Small Business Program page also offers Apple Foundation Models on Private Cloud Compute with no cloud API cost [6]. Eligibility requires Small Business Program enrollment, fewer than two million first-time App Store downloads, and a Private Cloud Compute entitlement granted to the account. Suitability for a health-coach use case is unverified.
- **Other fixed costs.** Apple Developer $99/yr and Play $25 once (wearable-integrations.md). Support is founder time; budget about 2–4 h/week per 1,000 payers (assumption, unverified).
- **VAT.** Store prices include VAT, which stores remit: Germany 19%, Switzerland 8.1% (general knowledge, not re-verified here).

### 6. Three 36-month scenarios (solo founder)

**Common assumptions.**
- Launch at month 4.
- Prices $59.99/yr and $8.99/mo, with a 7-day trial, 70% annual mix, 15% store fee and about 12% blended VAT.
- Net revenue per payer-year of about $40.
- Annual renewal of 35%, above the H&F median of 25% and close to the H&F upper quartile of 37% [3]. The "cross-category 44%" previously cited could not be found. RevenueCat's renewal blog gives cross-category median annual first renewals of 23–40% across top categories [3], and high-priced annual plans renew at about 24% [1]. At $59.99 (above the H&F median price), 35% is **optimistic**. At a 25% renewal, base-case month-36 payers and ARR fall by only about 6%, and cumulative revenue by about 5%, because Y3 new payers dominate. The gap widens every year after month 36.
- No paid UA in the conservative and base cases.
- Context: only 4.6% of newly launched apps reach $10k in monthly revenue within two years, and Health & Fitness apps take more than 100 days to reach >$10k [1].

| | Conservative | Base | Upside |
|---|---|---|---|
| Installs Y1 / Y2 / Y3 | 5k / 10k / 15k | 20k / 50k / 80k | 60k / 160k / 280k |
| Download → paid | 1.5% | 3.0% (≈ median [1]) | 5.0% (near top quartile [1]) |
| New payers Y1 / Y2 / Y3 | 75 / 150 / 225 | 600 / 1,500 / 2,400 | 3,000 / 8,000 / 14,000 |
| Active payers, month 36 | ≈ 300 | ≈ 3,000 | ≈ 18,000 (40% renewal) |
| ARR, month 36 | ≈ $12k | ≈ $120k | ≈ $750k |
| Cumulative subscription revenue | ≈ $25k | ≈ $210k | ≈ $1.26M |
| B2B add-on | none | one Swiss pilot, CHF 20–50k (assumption) | white-label/licence, €50–150k/yr (assumption) |
| Main costs (36 mo) | ≈ $3–5k | ≈ $15–40k (aggregator from Y2, LLM) | ≈ $80–150k (aggregator, LLM, a part-time support hire) |
| What it takes | Organic only, no Garmin cloud | Strong ASO, Reddit/Discord/YouTube creators, one press moment, Garmin via aggregator | A viral or featured moment, creator partnerships, localized in 5+ languages. Y3 proceeds of about $0.7M, of which only the App Store share counts, stay under the $1M Small Business Program limit. If a later year crossed it, new first-year subscriptions would pay 30% the following year, while renewals after year one stay at 15% [6] |

Cross-check: the base case gives 150k installs × about $1.40 lifetime revenue per install. That is plausible against $0.66 D60 RPI [1] and $1.21 12-month install LTV [5], given an annual-heavy mix and two renewal cycles. (confidence: low; models only)

### 7. "Worldwide": languages, payments, launch countries

- **Revenue concentration.** The US took more than half of global H&F consumer spend in 2024 and the UK about 8%, the second-largest market [28]. H&F in-app purchases reached about $4.5B in 2025 (+13%) [35] (search snippet; fetch blocked; **unverified**). Sensor Tower had forecast that 2025 would pass $4B [28]. Shares for Germany and Japan are **unverified**; only market-research estimates were found.
- **Language order.** English, then German (home market, high willingness to pay [5]). Next: French (CH/FR/CA), Spanish and Portuguese (LATAM growth via PPP [4]), then Japanese (high willingness to pay [5], heavy localization).
- **Payments.** In-app purchases cover local methods automatically. For web checkout: cards, Apple Pay/Google Pay, SEPA Direct Debit, PayPal, and TWINT, which Stripe supports for recurring billing since 27 May 2026 (one mandate per merchant-customer pair) [29].
- **First five countries:**
  - **Switzerland:** home market, highest willingness to pay, insurer-bonus culture to piggy-back on, TWINT.
  - **Germany:** largest German-speaking market, high willingness to pay [5].
  - **Austria:** no extra localization.
  - **United States:** more than half of category spend [28].
  - **United Kingdom:** #2 market [28], English, strong Garmin, Strava and Vitality culture [20].

## Implications for MINMAX

1. **Paywall after the Origin reveal, annual-first.** Use two plans (annual highlighted, monthly), a trial of 7 days or more, and a soft paywall so Simple Mode stays free. Trials overwhelmingly start on day 0: 86.1% per Adapty [5] and 82.1% for H&F per RevenueCat [1]. Adapty sees only a small secondary window on days 4–14 (2.6%) [5]. So the paywall must appear right after the reveal, and again at the first completed quest.
2. **Charge for interpretation, not numbers.** Free: Origin, Class, bottleneck, basic stats, Simple Mode. Paid: full stat tree with percentiles and evidence tiers, the quest engine, multi-source provenance, history, AI coach (capped), and verified claims. Do not paywall numbers Garmin already gives for free.
3. **Design for renewal from day 1.** Weekly quests, a streak with forgiveness and a "revival" event (Duolingo [9]), seasonal arcs that line up with the annual renewal date, and a renewal-eve "year in review" of the character.
4. **Write workouts back to HealthKit and Health Connect.** This makes MINMAX activity count toward Helsana+, CSS active365, Benevita and TK challenges [10][12][13][15]. It is a free benefit, and a marketing claim to make only after you confirm it works device by device.
5. **B2B in year 2, as a vendor.** Pitch Swiss supplementary insurers and corporate wellness (Wellhub, USC App Catalog) with a white-label character layer plus a provenance and scoring engine, as the Fjuul and eTherapists model shows [12][14]. Do not wait for insurers to accept ZK claims; no evidence of that demand exists.
6. **Localize the paywall before adding features.** EN/DE at launch, PPP tables per market, and price tests with large swings [4].
7. **Keep affiliates honest or skip them.** Lab and device links only with disclosure and an evidence tier on every recommendation.
8. **Watch the Small Business Program threshold and US link-out.** Add web checkout (Stripe with TWINT/SEPA) once the Supreme Court outcome is known [8].

## Open questions

- AppsFlyer 2026 H&F benchmarks and monthly-plan 12-month retention for H&F specifically (not found).
- Commercial terms for Wellhub and Urban Sports Club app partners, and Fjuul and eTherapists contract sizes.
- Whether any Swiss insurer would accept a MINMAX-recorded workout or claim directly, versus only via Apple Health/Health Connect. Requires direct contact.
- Health & Fitness revenue shares for Germany, Japan, France and Switzerland from Sensor Tower or AppMagic (only market-research estimates found).
- Official prices for Freeletics, Hevy and MacroFactor from store pages. The Gentler Streak discrepancy with competitors.md needs resolving.
- Exact Apple Foundation Models / Private Cloud Compute eligibility, and whether it suits a health-coach use case.
- AIA Vitality and other Vitality licensees' third-party data policies.
- Outcome of Epic v. Apple at the Supreme Court. Review was granted 30 Jun 2026; a ruling by about mid-2027 is likely if the case is argued this term (argument date unverified).
- The source of the "+62.3% LTV uplift from locale tests" figure (not found in [1] or [4]).

## Sources

1. State of Subscription Apps 2026 — RevenueCat — https://www.revenuecat.com/state-of-subscription-apps — accessed 2026-10-02
2. The State of Subscription Apps in 10 minutes: lessons, trends, and benchmarks for 2026 — RevenueCat — https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026 — accessed 2026-10-02
3. Average Subscription Renewal Rates by App Category (2026 Benchmarks) — RevenueCat — https://www.revenuecat.com/blog/growth/average-subscription-renewal-rates-by-app-category — accessed 2026-10-02
4. The ultimate guide to price localization — RevenueCat — https://www.revenuecat.com/blog/growth/price-localization-for-apps — accessed 2026-10-02
5. In-app subscription benchmarks for Health & Fitness apps — Adapty — https://adapty.io/blog/health-fitness-app-subscription-benchmarks/ — accessed 2026-10-02
6. App Store Small Business Program — Apple Developer — https://developer.apple.com/app-store/small-business-program/ — accessed 2026-10-02
7. What Google Play's new billing rules mean for subscriptions (25 Jun 2026) — Adapty — https://adapty.io/blog/google-play-billing-changes-subscriptions-fees/ — accessed 2026-10-02; Service fees — Play Console Help — Google — https://support.google.com/googleplay/android-developer/answer/112622 — accessed 2026-10-02
8. Apple standing its ground in Epic's App Store fee suit — AppleInsider (14 Sep 2026) — https://appleinsider.com/articles/26/09/14/apple-standing-its-ground-in-epics-app-store-fee-suit — accessed 2026-10-02
9. Duolingo Q2 2026 Shareholder Letter (Form 8-K exhibit) — SEC — https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm — accessed 2026-10-02
10. Automatic Points Credit – Troubleshooting Guide — Helsana — https://www.helsana.ch/dam/en/pdf/individuals/brochures/automatic-points-credit.pdf — accessed 2026-10-02
11. Krankenkassen-Bonusprogramme im Vergleich (16 Nov 2025) — Credura — https://credura.ch/blog/krankenkassen-bonusprogramme-bis-zu-chf-400-mit-helsana-swica-css/ — accessed 2026-10-02
12. active365 — CSS — https://www.css.ch/en/private-customers/my-health/promoting-health/active365.html — accessed 2026-10-02
13. Frequently asked questions about Benevita — SWICA — https://www.swica.ch/en/private/health/health-promotion/benevita/faq — accessed 2026-10-02
14. Insurance — Fjuul — https://fjuul.com/insurance/ — accessed 2026-10-02
15. TK-Bonusprogramm: Mit unseren Challenges punkten (page dated 22 Jul 2026) — Die Techniker — https://www.tk.de/techniker/gesundheit-foerdern/digitale-gesundheit/tk-fit/belohnungen-fitnessprogramm-2066246 — accessed 2026-10-02; Challenges im TK-Bonusprogramm nutzen (FAQ, source for "seit September 2026" and Health Connect) — https://www.tk.de/techniker/versicherung/tk-leistungen/weitere-leistungen/praevention/haeufige-fragen-tk-fit-2113340 — accessed 2026-10-02
16. Übermittlung von Belegen zur Erlangung eines Bonus (31 May 2021) — Bundesamt für Soziale Sicherung — https://www.bundesamtsozialesicherung.de/de/themen/digitalausschuss/digitaler-kundenservice-und-automatisierte-bearbeitung/uebermittlung-von-belegen-zur-erlangung-eines-bonus/ — accessed 2026-10-02
17. Welche Krankenkassen bezuschussen Fitness-Apps? Der 2026-Ratgeber (17 May 2026) — Motion — https://motion-app.com/de/blog/krankenkasse-fitness-app-bonusprogramm/ — accessed 2026-10-02
18. Generali Vitality – weltweite Einstellung des Produkts — JDC News — https://www.jdcnews.de/weekly/weekly-leben/dialog-generali-vitality-weltweite-einstellung-des-produkts-tarif/ — accessed 2026-10-02
19. How to get an Apple Watch Series 11 or Ultra 3 for (almost) free — 9to5Mac (13 Jan 2026) — https://9to5mac.com/2026/01/13/free-apple-watch-for-exercise/ — accessed 2026-10-02
20. Fitness Tracker Offers — Vitality UK — https://www.vitality.co.uk/rewards/partners/activity-tracking/ — seen in search 2026-10-02 (fetch returned 403)
21. Wellhub for Partners — Wellhub — https://wellhub.com/en-us/partners/ — accessed 2026-10-02
22. App Catalog: your free access to digital wellbeing apps — Urban Sports Club Help — https://urbansports.zendesk.com/hc/en-us/articles/21689835078802-App-Catalog-your-free-access-to-digital-wellbeing-apps — seen in search 2026-10-02 (fetch returned 403); How does the Clue and Urban Sports Club partnership work? — https://support.helloclue.com/hc/en-us/articles/22859667793437-How-does-the-Clue-and-Urban-Sports-Club-partnership-work — seen in search
23. What other devices and applications are supported by Personify Health? — Personify Health Help — https://personifyhealth.zendesk.com/hc/en-us/articles/28763596451739-What-other-devices-and-applications-are-supported-by-Personify-Health — seen in search 2026-10-02 (not fetched)
24. Superpower Affiliate Program — dub.co Partners — https://partners.dub.co/superpower — accessed 2026-10-02
25. cerascreen.de Partnerprogramm — affiliate-marketing.de — https://www.affiliate-marketing.de/partnerprogramme/cerascreen.de — seen in search 2026-10-02; Lykon DE im Affiliate-Check — https://www.100partnerprogramme.de/p/lykon-de-/ — seen in search (neither fetched)
26. Oura Affiliate Program Commissions & Payments — UpPromote — https://uppromote.com/affiliate-directory/oura/ — seen in search 2026-10-02; Garmin affiliate — https://www.affiliate-toolkit.com/program/garmin/ — seen in search (neither fetched)
27. Introducing Claude Haiku 4.5 — Anthropic — https://www.anthropic.com/news/claude-haiku-4-5 — accessed 2026-10-02
28. State of Mobile Health & Fitness Apps 2025 — Sensor Tower — https://sensortower.com/blog/state-of-mobile-health-and-fitness-in-2025 — accessed 2026-10-02
29. Adds support for Twint as a payment method for recurring payments (2026-05-27) — Stripe Changelog — https://docs.stripe.com/changelog/dahlia/2026-05-27/recurring-payments-twint — seen in search 2026-10-02 (not fetched)
30. Gentler Streak Workout Tracker — App Store (US) — https://apps.apple.com/us/app/gentler-streak-workout-tracker/id1576857102 — accessed 2026-10-02
31. Hevy Review 2026 — Sensai — https://www.sensai.fit/blog/hevy-review-2026 — seen in search 2026-10-02 (not fetched)
32. MacroFactor Pricing 2026 — Arvo — https://arvo.guru/vs/macrofactor — seen in search 2026-10-02 (not fetched)
33. Noom Med GLP-1 review 2026 — GLP Chart — https://glpchart.com/program/noom-med/ — seen in search 2026-10-02; Noom Pricing Analysis — https://healthrx.com/brands-noom/pricing-analysis — seen in search (neither fetched)
34. Freeletics vs BetterMe vs Fitify (2026) — Sensai — https://www.sensai.fit/blog/freeletics-vs-betterme-vs-fitify-2026 — seen in search 2026-10-02 (not fetched)
35. Apps capture larger share of health and fitness market revenue in 2025 — Business of Apps — https://www.businessofapps.com/news/apps-capture-larger-share-health-fitness-market-2025/ — seen in search 2026-10-02 (fetch returned 403)
36. Internal: /home/user/minmax/docs/research/competitors.md, wearable-integrations.md, regulatory.md — accessed 2026-10-02

## Verification notes (2026-10-02)

Independent check by a separate fact-checker. Web search was unavailable (session search budget exhausted), so every check below used direct fetches of primary pages, with raw-HTML extraction where the summariser was unreliable.

1. **RevenueCat SOSA 2026, H&F medians** (trial-to-paid 37.7%, D35 download-to-paid 2.9% / top quartile 6.2%, RPI $0.48 / $0.66, Y1 RLTV $35.64, 68% annual, $9.99/mo, $39.94/yr): **verified**, with these **corrections**:
   - The North America 2.56% / IN-SEA 1.37% conversion and the $32 / $25 / $14 Y1 LTV splits are all-category regional figures, not H&F. Relabelled.
   - The report contradicts itself on plan mix. Most of its text and the plan-duration chart say "H&F 68% annual"; one caption says "monthly-heavy (68%)". Caveat added.
   - Added: annual plans are 59% of H&F revenue, and high-priced annual plans have a lower first renewal (24% vs 37%).
   - Source: https://www.revenuecat.com/state-of-subscription-apps (full page text extracted).
2. **H&F annual first renewal 25% (Q1 16%, Q3 37%)**: **verified**. Source: https://www.revenuecat.com/blog/growth/average-subscription-renewal-rates-by-app-category. The "cross-category 44%" used in the scenarios is **refuted / not found**: that blog gives 23–40% across top categories, and SOSA gives 23–40% as well. Text corrected and the 35% assumption flagged as optimistic.
3. **Adapty (27 Mar 2026)**: $1.21 12-month install LTV is **verified**, but it is the highest of the App Store categories (App Store only). $70 vs $17 is **verified**, but Adapty calls it "a 4x gap", so the report's "4.5×" is **corrected** to about 4×. The 4.4× Germany vs Turkey gap is **verified**. Further corrections:
   - The renewal curve continues to 31.6% and 27.6% at renewals 4–5 rather than "settling".
   - "Users convert on day 0 or days 4–7" is **corrected**: 86.1% of trials start on day 0, with a secondary window on days 4–14 (2.6%).
   - Source: https://adapty.io/blog/health-fitness-app-subscription-benchmarks/.
4. **Apple Small Business Program**: 15% under $1M prior-year proceeds is **verified**. The 10% for EU alternative terms (and for subscriptions after their first year) is **verified** on the page. The Foundation Models / PCC offer (under 2M first-time downloads) is **verified** and the eligibility details are now filled in. Source: https://developer.apple.com/app-store/small-business-program/.
   - Upside-scenario claim that MINMAX "crosses the $1M limit in Y3, so 30% in Y4" is **refuted by the report's own model**: Y3 proceeds are about $0.7M, and renewals after year one stay at 15% anyway. **Corrected.**
5. **Google Play 10% + 5% (15%) in US/UK/EEA from 30 Jun 2026**: **verified** on Google's own help page, https://support.google.com/googleplay/android-developer/answer/112622. **Corrected** the rollout: Australia and Japan are 30 Sep 2026 per Google. "Korea by end-2026" and "most markets Sep 2027" appear only in Adapty and are not on Google's page. The alternative-billing rate wording on Google's page ("minus 4%") differs from Adapty's 10%; caveat added.
6. **Apple Aug 2026 15/10/5% proposal and Epic's rejection**: **verified**. The 10% tier covers Video/News/Mini Apps partner programs and subscription renewals. "Supreme Court hears the appeal from October 2026" is **softened**: the Court granted review on 30 Jun 2026 and its term opens in October, but the article gives no argument date. Source: the AppleInsider article [8]; the Supreme Court docket itself was not checked.
7. **Duolingo Q2 2026**: 58.7M DAU, 140.6M MAU, 12.7M paid (period end) and CURR 84% (all-time high) are all **verified**. The Streak Revival figures are **verified**, with wording **corrected** from "15.4M streaks" to "15.4M learners revived their streaks, including nearly 8M with no active streak". The "main churn point" lesson is softened as an inference. Source: the SEC exhibit [9].
8. **Helsana+ criteria** (10,000 steps; HR 110 for ≥30 min; 150 active kcal in 30 min; Garmin, Fitbit, Google Fit, Apple Health, phone sensor; "Fjuul Data Provider" in Garmin Connect): **verified** from the PDF text. Fjuul's role is corroborated by https://fjuul.com/insurance/ (SDK in the Helsana Bonus App). The PDF is undated. "Fjuul sends Helsana only time, duration and MET" is **unverified** and marked.
9. **CSS active365** (up to CHF 400; supplementary or property insurance; eTherapists GmbH): **verified**. "CSS receives only aggregated completion data" is **corrected**: CSS receives the activeID, completion dates and activity categories/subcategories, but no health data. Added the 20 min weekly education goal and the 360-day exclusion. Source: the CSS page [12].
10. **Fjuul** (SDK, Bio Age Models, Helsana, Nordea, SCOR): **verified**. **Corrected**: the page does not say "white-label" (the Nordea case is labelled "App"). The Helsana user count appears as ">150,000" in the case box and "over 170,000" in an undated testimonial. Source: https://fjuul.com/insurance/.
11. **BAS 31 May 2021**: **verified**. The BAS rejected fitness-app use and data transmission as a bonus prerequisite on social-data-protection grounds, and allowed photographing receipts. Source: the BAS page [16]. A caveat was added that TK's Sep 2026 integration shows tracker-based GKV bonus points now exist; whether the BAS has updated its 2021 view is unverified.
12. **TK since Sep 2026; 60,000 steps or 40 km/week in 10 of 12 weeks; 1,000 points; Apple Health / Google Fit**: **verified**. The Sep 2026 date is from TK's FAQ page, https://www.tk.de/techniker/versicherung/tk-leistungen/weitere-leistungen/praevention/haeufige-fragen-tk-fit-2113340, not from the cited page, which is dated 22 Jul 2026; both URLs are now listed. Added Health Connect (Android) and the note that cycling is recognised only via Google Fit. "€10 cash / €20 dividend" is **unverified**: TK only says it doubles the dividend. "TK stores only start/end date, data source, pseudonymised ID" is **unverified**.
13. **Generali Vitality** (no new business from 30 Apr 2025; memberships ended by 2 Feb 2026 at the latest): **verified**. Source: the JDC News article dated 7 May 2025 (Dialog Lebensversicherungs-AG) [18].
14. **Claude Haiku 4.5 at $1/$5 per MTok**: **verified** from the Anthropic announcement (15 Oct 2025) and the current Claude API pricing table (cached 25 Sep 2026). The arithmetic is **verified**: 2k in + 500 out = $0.0045 per turn, about $0.135 for 30 turns. A caveat was added that real coach turns likely carry more input tokens.
15. **US more than half of 2024 H&F consumer spend; UK 8%, second-largest**: **verified**. Source: https://sensortower.com/blog/state-of-mobile-health-and-fitness-in-2025. The "$4.5B in 2025 (+13%)" figure [35] remains **unverified**; Sensor Tower's own forecast was "past $4B".

**Other items checked:**
- Locale-test "+62.3% LTV uplift": **unverified**. It is not in [4] or in the SOSA page text, and is now marked.
- RevenueCat localization guide claims (India, UK, Flo, $39 vs $69 tests, 3–6 months): **verified**. India is reworded: the 50–80% figure is competitor pricing, not an "optimal" price.
- AI-app LTV $30.16 vs $21.37 and 36% worse monthly retention: **verified** ([1], [2]).
- Gentler Streak IAP ($8.99/mo, $39.99/yr, lifetime $59.99–179.99): **verified** on the US App Store.
- Credura figures (Helsana CHF 300+ / about 75, Visana 120, ÖKK 200, SWICA 5%/15%): **verified** against [11]. The SWICA percentages are re-attributed to [11], because SWICA's FAQ [13] does not state them. The FAQ adds that Health Connect cannot supply active minutes.
- Superpower: **corrected**. The $200 is a bonus for referring a partner who earns at least $400, not a per-sale bonus.
- John Hancock Vitality: **corrected**. The cited 9to5Mac article covers only Apple Watch; Garmin and Polar are unverified.
- Wellhub (wellness apps can partner, free to join, payment "may differ by partner type"): **verified**.
- Stripe TWINT recurring support (API 2026-05-27.dahlia; one active mandate per merchant-customer pair): **verified**.
- Scenario arithmetic (payers, ARR, cumulative revenue): **recomputed and consistent** to within about 10%.
- Not re-checked: Hevy, MacroFactor, Freeletics and Noom prices; Motion blog [17]; Vitality UK [20]; Urban Sports Club [22]; Personify [23]; Cerascreen and Lykon [25]; Oura and Garmin affiliate rates [26]; VAT rates.
