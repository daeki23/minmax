# 00 · Vision

_Status: draft v0.1 · 2026-10-02 · derived from the founder's ChatGPT material (part 1) and the first research pass. Will be revised once the original main prompt is available._

## One sentence

**MINMAX turns your real body into a character you can level up, with honest numbers and verifiable progress.**

## The problem we are actually solving

1. **Health advice is either boring or dishonest.** Clinical guidance is correct but motivates nobody. Longevity and biohacking content motivates people but sells pseudo-precision (HRV ≥ 100 ms, testosterone ≥ 1000 ng/dL, Lp(a) ≤ 5) that no guideline supports. People pay 49 dollars for "Top 0.1 %" programs that are a good "Top 1 %" program with a marketing layer.
2. **Scores are black boxes.** Readiness, Strain, Body Battery and "fitness age" are proprietary single numbers. Nobody can tell you what percentile you are in, which input moved the number, or how much to trust the measurement.
3. **Progress is not portable.** You cannot prove to a challenge, an insurer or a coach that you hit VO₂max ≥ 50 without handing over your entire health history.
4. **Games already solved motivation.** Stats, builds, levels, quests and regions keep millions of adults engaged for years. Health apps borrow the surface (XP for steps) and get churn. The engine underneath has never been built properly for a human body.

## What MINMAX is

- A **character sheet for your body**: seven stats computed from wearables, in-app tests, self-reports and labs, each expressed as an honest percentile within your age and sex band.
- A **game world you move through**: your weakest stat is your bottleneck, your chosen class is your path, regions open as you develop.
- A **weekly plan**: quests are real training, nutrition, movement and sleep goals with a measurable completion criterion and an evidence tier.
- A **provenance layer**: every number knows where it came from and how much it can be trusted.
- Later, a **proof layer**: achievements verifiable by third parties without exposing raw data.

One engine, two surfaces: Game Mode for people who want the RPG, Simple Mode for people who want three goals a week.

## What MINMAX is not

- Not a medical device. It does not diagnose, treat or compute disease risk. It tells you where you stand relative to a population and what evidence says you can do about it.
- Not a biohacking app. No "optimal" hormone values, no supplement stacks presented as core protocol, no mechanism-as-proof.
- Not a cartoon. Dark, premium, cinematic. The user should think "my health program feels like a game", never "I am playing a kids' fitness game".
- Not a hardware company. MINMAX reads from the devices people already own.
- Not a social network first. Social features come after the single-player loop works.

## Principles

1. **Honest numbers.** A stat is a percentile with a source and a confidence, or it is not shown.
2. **Evidence-tiered advice.** Every recommendation carries its tier: established, strong, plausible, experimental. The tier is visible, not buried.
3. **The user is never punished for their starting point.** Origin is shape, not rank. A missed week costs nothing but time.
4. **Game design, not gamification.** XP for steps is gamification. "Your Aerobic stat is now strong enough to open The Engine" is game design.
5. **Privacy as a feature.** Compute on device where possible. Raw values stay with the user. Claims, not data, leave the phone.
6. **One engine, many surfaces.** The same state machine renders as RPG or as a plain weekly plan.

## Why now

- Wearable penetration makes VO₂max, HRV, resting HR, sleep stages and body composition available to tens of millions of people without a lab.
- Platform health stores (HealthKit, Health Connect) and vendor APIs make aggregation feasible for a small team.
- Selective-disclosure credentials and client-side zero-knowledge proofs have matured enough to plan for, even if the first version ships without them.
- The longevity market has created demand for "where do I stand" and simultaneously poisoned it with pseudo-precision. The honest version has a gap.

## Success looks like

- A user opens MINMAX on Monday and knows exactly what three things to do this week and why.
- Six months later their character looks different because their body is different, and they can point to the specific stats that moved.
- A coach, challenge or insurer can verify "Aerobic ≥ 70th percentile, device-verified" in one tap, seeing nothing else.
- Revenue comes from people who pay because the product is worth it, not from selling their data.

## Founder's intent (as understood so far)

Solo founder, German-speaking, wants a real business with worldwide reach, considers this a life's work. Has already thought deeply about trust levels, the RPG system and Midnight-based verification. Wants everything worked out properly rather than shipped half-baked.
