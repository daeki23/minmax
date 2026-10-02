# 10 · Founder's vision and ideas backlog

_Status: living document · started 2026-10-02. This file holds ideas the founder has stated as part of the vision but that are not yet designed, researched or scheduled. Each entry records the idea as stated, what it implies for the existing documents, and the questions it opens. Nothing here is rejected; nothing here is in the MVP scope until `01-product-concept.md` and `08-roadmap.md` say so. The founder's words are preserved verbatim in `source/founder-notes.md`._

_Standing priority (founder, 2026-10-02): everything in this file is ideation. Shipping an MVP comes first, and no idea here may delay it. `01-product-concept.md` carries the lean cut of the MVP; `08-roadmap.md` schedules the ideas after it._

## 1. The companion

**As stated (2026-10-02).** A cute companion that lives on the smartwatch and on the phone. It greets the user when they first open the app, explains that all data stays local, that the app costs nothing and that revenue is purely cosmetic, and from then on tells the user their next quests.

**What it adds.** A voice for the product. Today the engine produces states and the two modes produce sentences (`modes/vocabulary.ts`); the companion is who says them. It gives onboarding a narrator for the three trust promises, gives the weekly quest list a herald, and gives the watch a reason to exist beyond complications.

**Implications and tensions.**

- `02-game-system.md` (aesthetic direction) and `01-product-concept.md` (risk table) currently say "no mascots", a line inferred from the ChatGPT conversation's premium-tone concern. The founder's vision overrides that line. The design task becomes: a companion that fits a dark, cinematic, restrained world. Think familiar or spirit rather than cartoon pet; small, quiet, present at state changes, never bouncing for attention. Tone has to be tested with the 35–55 cohort, who are the ones most sensitive to anything that reads as childish.
- **The three promises must be true as spoken.** "Your data stays on this phone" holds for HealthKit, Health Connect, in-app tests and manual entry. It does not hold word for word for cloud wearables connected through their vendor API (Oura today, Polar and Withings later): that data passes through the server once and is not kept (`05-architecture.md`, Vendor ingest). The companion's script needs that one honest sentence, and the regulatory report's wording rules apply to it (`research/regulatory.md`).
- **Watch.** A watch companion is a separate native target in every client stack under consideration: SwiftUI on watchOS, Compose on Wear OS (`research/tech-stack-proposal-expo.md`, `-flutter.md`). It is not free. The minimal version is a complication or tile showing the companion and the next quest, with the phone doing all the work; a full watch app that records workouts is a later phase.
- **Simple Mode.** The companion is a Game Mode idea. Whether Simple Mode has it, has a muted version of it, or has none is open. The one-engine-two-surfaces rule means the companion is presentation only; the quest list it reads from is the same.
- **Engine.** Nothing changes in `@minmax/core`. The companion reads `scheduleWeek()` output and the character state. A later "companion mood" could be a pure function of readiness and adherence, and would live in `modes/`.

**Open questions for the founder.** Name, look and voice (text only, or sound). Can it be switched off. Does Simple Mode have it. Is the watch part of the MVP or the first update after it.

## 2. Free app, revenue purely cosmetic

**As stated (2026-10-02).** The app costs nothing. App revenue is purely cosmetic.

**What it adds.** A trust position no competitor in `research/competitors.md` holds: every stat, quest, claim and trust level is free for everyone, forever, and the company is paid for how the character and its world look. It fits "nobody is punished for their starting point" and it makes the companion's promise simple to say.

**Implications and tensions.**

- `09-open-questions.md` asked "subscription or freemium with cosmetics". The founder has answered with the vision. `06-business-model.md` (pending) must therefore model a cosmetic economy rather than a subscription funnel, and say honestly what that means for revenue per user: the monetization report's benchmarks are subscription benchmarks (annual plans are 61 % of category revenue; the top 10 % of apps take 92.6 % of it), and the one cosmetic-first precedent in the competitor set, Habitica, sells cosmetics and gems at $4.99 a month alongside a free core. Cosmetic-only revenue needs volume and a reason to pay that is social or expressive. The public profile and shareable claims (`03-data-provenance.md`) are that reason: cosmetics are visible where the claims are.
- **What is cosmetic and what never is.** A written line is needed before the first screen: companion outfits and animations, region skins, character-sheet themes, build-title frames and claim-card designs are cosmetic. Stats, percentiles, trust levels, quests, evidence tiers, claims and the Rift are never sold, never gated and never faster for money. Journey XP may unlock cosmetics but money must not buy XP, or the effort meter stops meaning effort.
- **Store and law.** Cosmetics are in-app purchases, consumable or non-consumable, with the stores' 15–30 % share. Randomised rewards (loot boxes) are regulated or banned in several European markets and would also conflict with the honesty principle; cosmetics are bought knowingly or earned. Pricing for children is not a concern because the audience is adults, but age rating still applies.
- **Phrasing.** "Costs nothing" is a strong public promise. If the founder later wants an optional supporter tier (for example to fund new norm tables), the companion's wording on day one should leave room for it, or the promise is kept strictly. This is the founder's call.

**Open questions for the founder.** Is "no subscription, ever" the promise, or "the core is free forever" with cosmetics plus an optional supporter tier. Which cosmetics exist at launch. Should cosmetics also be earnable through XP so that paying is never the only route.

## 3. Jobs: cooking, guitar, language and other life skills

**As stated (2026-10-02).** Jobs would be cooking, guitar, language and so on.

**What it adds.** An RPG job system that extends MINMAX from the body to the whole person: the same character learns skills that are not health stats. It is the clearest step from "fitness app" towards the "life RPG" the founder is describing.

**Implications and tensions.**

- **Honest numbers do not extend to guitar.** The seven stats are percentiles and criterion scores with provenance. There are no population norms for cooking or language, and no device verifies a practice session. Jobs must therefore be an effort progression (sessions logged, time practised, self-reported milestones at trust 0, occasionally app-verified through an integration), kept visibly separate from the stats so that the honesty of the stats is not diluted. The right home in `02-game-system.md` is next to Journey XP, not next to Strength.
- **Overlaps to use.** Cooking already touches the Garden: `garden.cook.1` is a self-report quest, and the nutrition research values home cooking. A Cooking job could be the Garden's craft line. Language and music have no region; they would need either a new place in the world (a town, a guild hall) or a job layer that sits across regions.
- **Scope and positioning.** Jobs change what the app is and which store category, competitors and marketing lines apply. The MVP hypothesis in `01-product-concept.md` is the health core; Jobs belong to a later phase in `08-roadmap.md`, after the health loop is proven. Designing the data model so that a Job can be added without touching the stat engine is cheap now and should be done.
- **Evidence tiers.** Quests carry evidence tiers because health recommendations need them. A guitar quest does not, and the tier vocabulary should not be forced onto it.

**Open questions for the founder.** Which job first. Are jobs self-reported only, or should MINMAX integrate with apps that can verify (a language app's API, a music app's practice log). Do jobs have their own levels, or feed Journey XP.

## 4. Horizontal progression: there is always something to do

**As stated (2026-10-02).** The horizontal progression model, applied to the app: people always find something to do. For some it is their character, for others something else.

**What it means.** In game design, vertical progression is the power ladder (level, stats); horizontal progression is breadth: more places, options, collections and ways to play that do not require the number to go up. MINMAX's vertical axis is deliberately honest and slow (Character Level follows the body and can fall). Horizontal progression is everything a user can do while the body does not move: fill the unmeasured stats on the sheet, explore regions and chapters, earn claims, collect or earn cosmetics (§2), learn a job (§3), get to know the companion (§1). It answers the third job to be done in `01-product-concept.md`: make the work feel like progress even in weeks when the body does not move. And it says that different users progress on different surfaces: the character sheet for one, the world map for another, the quest list, the collection or the public profile for a third.

**What the engine already does horizontally.** Journey XP is effort-based and separate from Level. Regions open through data presence, the home region and the Rift, not through Level (only the Arena and the Summit have gates). Test and import quests exist to reveal unmeasured stats. New Journey resets the horizontal layer without touching the honest numbers. Nothing in `@minmax/core` needs to change for this idea; it is a content and interface question.

**Implications and tensions.**

- **Breadth is content cost.** Every horizontal track is content a solo founder has to write, test and maintain. The MVP can carry the three tracks that already exist (fill the sheet, explore the four regions, earn claims); cosmetics, jobs and the companion are tracks for later phases in `08-roadmap.md`.
- **"Always something to do" must stay pull, not push.** `01-product-concept.md` says daily use is optional and never required for progress. The horizontal layer may offer things to do; it must not punish for not doing them (no streaks that break, no decaying collections). The user-psychology report's findings on autonomy and pressure apply (`research/user-psychology.md`).
- **One home screen cannot show every track.** If people progress on different surfaces, the interface must let each user put their surface first (sheet, map, quests, collection, profile) instead of showing all of them. This is an onboarding question next to the Game or Simple Mode choice.
- **The honest numbers stay vertical.** Horizontal tracks may unlock cosmetics, titles, regions and chapters. They never change a stat, a percentile, a trust level or a claim.

**Open questions for the founder.** Which tracks exist at launch beyond the three that exist today. Whether the user picks a primary surface during onboarding or the app infers it from use. Whether a collection (cosmetics, titles, claim cards) is a visible track on day one or arrives with the first cosmetics.

## How this file is used

A new idea gets an entry here with the date. When an idea is researched, the report lands in `research/`; when it is designed, it moves into `01`, `02` or `05`; when it is scheduled, `08-roadmap.md` names the phase. The entry stays here as the record of where it came from.
