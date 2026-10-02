# 01 · Product concept

_Status: draft v0.1 · 2026-10-02. MVP scope is a hypothesis until the research reports and the founder's original main prompt are folded in._

## Who it is for

Three audiences, one character. The founder's instinct is right that these can share an engine; they must not share a vocabulary.

| Audience | What they want | What they see first | What keeps them |
|---|---|---|---|
| **Gamers** (adults who grew up with RPGs) | Stats, builds, progression that is real | Character sheet, Origin reveal, home region | Rifts, chapters, New Journey, verified claims |
| **Fitness people** (train already, own a watch) | Honest percentiles, what to fix, PRs that count | Stat percentiles with sources, bottleneck, verified claims | Data depth, challenges, provenance badges |
| **Mainstream** ("tell me what to do this week") | Three goals, a reason, no jargon | Simple Mode: this week's plan | A first visible win in week one, a plan that adapts, no shame |

Primary launch audience: the overlap of the first two, people 25–45 who own a wearable and have played games. They are reachable, they pay for subscriptions, and they will test whether the engine is honest. Mainstream follows once Simple Mode is proven. **[decision]**

## Jobs to be done

1. *Tell me where I actually stand*, in numbers I can trust and compare, not in a proprietary score.
2. *Tell me what to work on next*, one thing, with the reason and the evidence.
3. *Make the work feel like progress* even in weeks when the body does not move.
4. *Let me prove it* without handing over my health history.

## Core loop

```
Import or measure  →  Stats + Origin  →  Choose class  →  Home region, 3 quests this week
        ↑                                                          │
        └──────────  Level / XP / Bottleneck update  ←─────────────┘
```

Weekly cadence. The Monday "new quests" moment and the Sunday "week closed" moment are the two scheduled touchpoints. Daily use is optional and should never be required for progress.

## Onboarding (target under four minutes)

1. **One question**: "What do you want to become?" Six plain-language answers map to a class.
2. **One permission**: import from Apple Health / Health Connect (and connect Garmin, Oura or Polar if present).
3. **Analysis moment**: the character is built from whatever data exists; unmeasured stats are shown as such, with the quest that would reveal them.
4. **Reveal**: Level, Origin (or "Origin unknown, 2 measurements away"), home region, bottleneck, this week's three quests.
5. **Mode choice**: "How do you want this to feel?" Game or Simple. One tap to switch later.

No questionnaire marathon. No paywall before the reveal. The reveal is the hook.

## Differentiators (why this and not Whoop, Oura, Strava, Habitica)

1. **Honest percentiles with provenance** instead of a black-box score. Nobody else shows "72nd percentile for your age, device-verified, confidence medium".
2. **A real game system** (origin, class, build, level, bottleneck, regions, chapters) rather than XP sprinkled on steps.
3. **Evidence tiers on every recommendation**, which makes MINMAX the credible counterweight to the biohacking market the founder has personally been burned by.
4. **Verifiable claims without raw data**, which opens B2B2C doors (insurer bonus programs, corporate challenges, coaches) that pure consumer apps cannot open.
5. **Hardware-agnostic**: reads what people already own; no ring or strap to sell.

## MVP scope hypothesis

In:

- Apple Health and Health Connect import; one vendor API (Garmin, pending research on approval) via server.
- In-app tests for Strength, Power and Mobility (grip via dynamometer entry, push-ups, pull-ups, sit-to-stand, jump, sit-and-reach, knee-to-wall) with camera-free, confirm-based recording.
- Seven stats with percentiles, confidence, unmeasured state.
- Origin, Class, Build, Character Level, Journey XP, Bottleneck with Rift.
- Four regions with one chapter each: The Wilds, The Forge, The Engine, Temple of Motion. The Garden and The Sanctum as single intro quests. The Arena and The Summit locked.
- Game Mode and Simple Mode.
- Phase 0 claims with a public verification page.
- Subscription with a free tier that includes stats and one region.

Out (explicitly, for the first release):

- Social features beyond a shareable character card.
- Nutrition logging beyond protein/fiber/plant check-ins (no calorie database in v1).
- Lab import beyond manual entry of a short marker list.
- Any blockchain component.
- Coaching content as a paid program (the founder's own training program may become a chapter later).
- Web app beyond the verification page and the landing page.

### Lean cut: the smallest version that can ship

The founder's standing priority is to get an MVP to market (`source/founder-notes.md`, 2026-10-02). Read against that, the scope above is still large for one person. The lean cut below removes everything that is not needed to test the core promise (honest stats, a real character, quests that adapt) and names where each item goes. Each line is a proposal **[hypothesis]** until the founder confirms it and `08-roadmap.md` adopts it.

| Item in the scope above | Lean cut | Returns in |
|---|---|---|
| Subscription with a free tier | No payments in the first release at all. The app is free; the first cosmetics arrive with the first update once there is something to dress (`10-ideas.md` §2). Removes store-billing, consumer-law and refund work from the launch checklist | First update after launch |
| One vendor API via server | Dropped. HealthKit and Health Connect only; Garmin's program is closed and Oura, Polar and Fitbit are reachable through the platform stores | Growth phase, with the aggregator decision |
| Four regions with one chapter each | Two regions with one chapter each: the home region of the chosen class and the Rift region of the bottleneck. The other regions are visible and explorable but have intro quests only | Second release |
| Game Mode and Simple Mode | Both stay: the engine already produces both vocabularies and the primary audience splits on this choice. Only the Simple Mode onboarding copy is cut to the minimum | n/a |
| Phase 0 claims with a public verification page | Kept in the lean cut because it needs the signer and the attestation path, which are the server's only reason to exist at launch; if the server slips, ship a shareable character card first and claims in the first update | Launch or first update |
| In-app tests for Strength, Power and Mobility | Grip, push-ups, sit-to-stand, sit-and-reach and knee-to-wall only; vertical and broad jump and pull-ups come with the Arena | Second release |
| Companion, watch, jobs, cosmetics collection, horizontal tracks beyond fill-the-sheet, explore, earn claims | Not in the first release | `08-roadmap.md` phases 4 and later |

The lean cut keeps the differentiators (honest percentiles with provenance, the character, evidence-tiered quests, claims) and cuts breadth and revenue. Revenue is cut on purpose: a free first release with no store is the fastest route through review and the cleanest test of whether the core loop retains people. **[decision pending founder]**

## Risks the concept must survive

| Risk | Why it is real | Mitigation |
|---|---|---|
| Normative data is thin for Mobility and Power | Good norms exist for VO₂max, grip, steps, sleep; much less for ROM | Show ranges and "emerging norm" labels; collect our own anonymised distributions with consent |
| Wearable estimates are noisy | Wrist VO₂max can be off by several points | Confidence model, corroboration, in-app field tests as upgrade quests |
| RPG framing reads as childish | Adults are sensitive to tone | Dark premium aesthetic, Simple Mode default for some cohorts; the founder's companion (`10-ideas.md`) must pass a tone test with the 35–55 cohort |
| Labels demotivate | An Origin could feel like a verdict | Origin is shape not rank; copy is strengths-first; tested in onboarding research |
| Health-data regulation | Special-category data in every market | Local-first, minimal server data, DPIA before launch, claims-not-data sharing |
| Solo founder bandwidth | Everything above is a lot | Core engine first, one platform-store at a time, aggregator for long-tail devices |
| Name conflict | "MinMax" is a common term | Trademark and store search in `research/competitors.md` |

## Positioning line candidates

- *Your body, as a character sheet.*
- *Honest stats. Real quests. Verifiable progress.*
- *Level up what is actually holding you back.*

## Relationship to the founder's "Ultra" program

The 49-dollar program the founder bought is a useful artefact: it shows exactly what the market pays for (an elite framing, a complete system, assessment and retesting) and exactly what is wrong with it (pseudo-precise biomarker targets, supplement stacks, mechanism-as-proof). MINMAX takes the first list and refuses the second. The program's sound parts (three strength sessions, two Zone 2 sessions, one interval day, high step count, sleep 8 hours, retesting) map directly onto early chapters of The Forge, The Engine and The Wilds.
