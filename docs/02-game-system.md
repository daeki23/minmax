# 02 · Game system

_Status: draft v0.1 · 2026-10-02. Distilled from the founder's material, with decisions and additions marked **[decision]** and **[addition]**. Names of origins, regions and classes are working titles._

## The four layers of a character

| Layer | Question it answers | Who sets it | Stability |
|---|---|---|---|
| **Origin** | What do you bring with you? | Derived from data at onboarding | Stable identity; only re-derived on an explicit "new journey" |
| **Class** | What do you want to become? | Chosen by the user in plain language | Changeable any time, with a cooldown so it feels like a decision |
| **Build** | How are you doing it? | Derived from Class + Origin + behaviour, nameable by the user | Evolves; may be renamed at milestones |
| **Level** | How far are you? | Computed from stats | Moves slowly, in both directions, honestly |

The founder's phrasing: *what you have is your origin, what you choose is your class.* We keep that split and never use the word "race" in the product. **[decision]**

## Stats

Seven stats, each a 0–100 number that is a **percentile within the user's age and sex band**, computed from constituent metrics with a confidence that reflects data provenance (see `03-data-provenance.md`) and the normative dataset behind it (see `research/normative-data.md`).

| Stat | What it measures | Typical inputs | Region |
|---|---|---|---|
| **Strength** | Force production relative to bodyweight | Grip, push-ups, pull-ups, squat/bench/deadlift estimates, sit-to-stand | The Forge |
| **Aerobic** | Cardiorespiratory fitness | VO₂max (device or field test), resting HR, aerobic volume | The Engine |
| **Mobility** | Range of motion and control | Sit-and-reach, shoulder, hip, ankle tests; balance | Temple of Motion |
| **Power** | Rate of force production | Vertical/broad jump, sprint, stair climb | The Arena **[addition]** |
| **Movement** | Daily activity base | Steps, active minutes, sedentary breaks, outdoor time | The Wilds |
| **Recovery** | Sleep and readiness | Sleep duration, regularity, efficiency; HRV vs personal baseline | The Sanctum **[addition]** |
| **Nutrition** | Fuel and metabolic health | Protein, fiber, plant intake, body composition, labs where available | The Garden |

Rules:

- A stat with insufficient data is shown as **unmeasured**, never as a guessed number. Each stat lists what is missing and which quest or import would reveal it. **[decision]**
- HRV never contributes as an absolute number. It enters Recovery only as deviation from the user's own 28-day baseline. **[decision, from the evidence critique]**
- Stats are recomputed daily; the displayed value is a 7-day smoothed figure so it does not flicker.
- The composite is **not** a single health score. The character sheet is the product; the seven numbers are the message. **[decision]**

## Origin

Origin is the **shape** of the stat profile at the start, not its height. This matters: a person whose stats are all low but whose relative strength stands out is Ironblood, exactly like an elite lifter with the same shape. Level carries the magnitude. Nobody gets a "weak" origin. **[decision]**

Derivation sketch:

1. Wait until at least four stats are measured with medium confidence or better (otherwise show "Origin: Unknown, 2 more measurements to reveal it", which is itself a quest).
2. Normalise the seven stats against the user's own mean.
3. If the largest deviation is below a threshold, the profile is flat → **Evenkin** (balanced).
4. Otherwise the dominant stat decides, with a secondary tag when two stand out.

Working names (placeholders, to be tested with users):

| Dominant stat | Origin | One-line flavour |
|---|---|---|
| Strength | **Ironblood** | Built on force. The engine comes later. |
| Aerobic | **Engineborn** | A heart that does not quit. |
| Mobility | **Riverborn** | Moves like water. Needs iron. |
| Power | **Stormborn** | Explosive. Learns endurance. |
| Movement | **Wayfarer** | Never still. Learns to push. |
| Recovery | **Stillwater** | Rests well. Learns to strain. |
| Nutrition | **Rootborn** | Fuels well. Learns to spend it. |
| Flat profile | **Evenkin** | Nothing dominates. Everything can. |

Origin is locked after derivation and shown as identity. It is re-derived only when the user starts a **New Journey** (see Endgame). The founder's instinct that it should not flip because someone trained endurance for three months is correct; the stats and level carry that change.

## Class

Chosen, never derived. Shown to the user in plain language first and translated internally. **[decision, per the "game underneath, normal app on top" principle]**

| What the user taps | Class | Primary stats | Home region |
|---|---|---|---|
| Get stronger | **Muscle** | Strength, Power | The Forge |
| Build endurance | **Aerobic** | Aerobic, Movement | The Engine |
| Move better | **Mobility** | Mobility, Recovery | Temple of Motion |
| Eat and fuel better | **Nutrition** | Nutrition, Recovery | The Garden |
| Become an all-rounder | **Hybrid** | All, weighted to the two lowest | The Wilds, then rotating |
| Optimise everything | **All** | All, equal weighting | The Summit (gated by level) |

Class decides the **home region** at the start. The user's choice wins over the algorithm's opinion on day one; autonomy is the strongest motivator we have and the bottleneck will make its case within weeks. **[decision; this resolves an ambiguity in the source material where both the class and the bottleneck were said to pick the start region]**

Changing class is allowed at any time with a 14-day cooldown and a short "your build will be re-named" moment, so it reads as a decision rather than a menu toggle.

## Build

Build = Class × Origin × observed behaviour. Examples: *Ironblood · Hybrid · Alpine Athlete*, *Engineborn · Muscle · Late Forge*. The system proposes a build name at onboarding and at each region transition; the user may rename it. Builds are cosmetic identity plus a hint about weighting, never a lock.

## Level and XP

Two progressions, deliberately separate, because they measure different things: **[addition]**

- **Character Level** is computed from stats. It is the honest, slow number. It can go down. A plateau is a plateau. Formula sketch: level is a monotone function of the mean of measured stats, with a penalty for the number of unmeasured stats so that measuring more is always rewarded. Range 1–50 for the base journey.
- **Journey XP** is earned from effort: completed quests, logged sessions, imports, tests taken. It never goes down, resets per season or per journey, and gates region unlocks, cosmetics and narrative. It is the Duolingo-style "you did the thing" meter that keeps weeks with no measurable stat change from feeling empty.

The character sheet shows both: `LEVEL 18` (state) and `XP 8,420 / 10,000` (effort toward the next region or chapter).

## Bottleneck

The lowest measured stat, with hysteresis: it changes only when another stat has been lower by at least 5 points for 14 consecutive days. The bottleneck is always visible on the sheet with the literal sentence *"This is holding your build back."* **[decision]**

The bottleneck does not force a region. It opens a **Rift**: a side quest line into the corresponding region that can be started from anywhere. Completing a Rift chapter raises the bottleneck stat's minimum data quality and typically moves the number. If the user ignores a Rift for eight weeks, the world narrates it ("The Engine still waits") but nothing is lost. **[addition]**

## Regions

| Region | Theme | Core stat | Unlock |
|---|---|---|---|
| **The Wilds** | Movement base, outdoors, walking, foundation | Movement | Open to all from day one |
| **The Forge** | Strength, muscle | Strength | Home of Muscle class; else via Rift or XP |
| **The Engine** | Aerobic base, intervals, VO₂max | Aerobic | Home of Aerobic class; else via Rift or XP |
| **The Arena** | Power, speed, jumps, sprints | Power | Requires Strength ≥ 40 and Mobility ≥ 40 for safety **[addition]** |
| **Temple of Motion** | Mobility, control, balance | Mobility | Home of Mobility class; else via Rift or XP |
| **The Garden** | Nutrition, metabolic health | Nutrition | Home of Nutrition class; else via Rift or XP |
| **The Sanctum** | Sleep, recovery, stress | Recovery | Opens automatically when sleep data is imported |
| **The Summit** | Hybrid, advanced, long-horizon | All | Character Level ≥ 25 and no stat below 50 |

Each region has **chapters** (quest lines of 3–6 weeks), each chapter has 3–5 quests. Regions are revisited; they are not consumed.

## Quests

A quest is a weekly or multi-week goal with:

- a plain-language title in Simple Mode and a region-flavoured title in Game Mode,
- a **measurable completion criterion** (e.g. "2 resistance sessions ≥ 20 min, each logged or device-detected"),
- a **data source that can verify it** and the resulting trust level,
- an **evidence tier** (see `04-evidence-framework.md`),
- a difficulty tier I/II/III chosen from the user's current stat and recent adherence,
- no penalty for failure; an unfinished quest rolls over once, then is replaced.

Quest templates live in `research/training-science.md` for now and will move to the core package as data.

Hard rules: **[decision]**

- Nutrition quests are additive by default (protein, fiber, plants, meal regularity). Restrictive quests (deficits) exist only behind an explicit goal setting with safeguards.
- Load progression quests cap weekly volume increases and require a deload every fourth to sixth week.
- No quest ever targets a biomarker value the evidence framework classifies as "not a lifestyle target".

## Modes

One state machine, two renderers.

| Concept | Game Mode | Simple Mode |
|---|---|---|
| Stat | Strength 64 | Strength: 64th percentile for your age |
| Level up | LEVEL 12 — The Engine opens | Your aerobic fitness moved into the top third |
| Quest | Forge I: Temper the base | Do 2 strength sessions this week |
| Bottleneck | This is holding your build back | Your weakest area right now |
| Region | You have entered The Forge | Focus this month: Strength |
| XP | 8,420 / 10,000 | 84 % of this month's plan done |

The default mode is decided at onboarding from one question ("How do you want this to feel?") and can be switched in one tap. **[decision; research on default choice pending]**

## Verified character

Achievements are **claims** (threshold statements) with provenance badges, not raw values:

```
VERIFIED
🟢 Aerobic ≥ 70th percentile      device-verified · Garmin
🟢 10+ pull-ups                    app-recorded
🟣 VO₂max ≥ 55 ml/kg/min           lab-verified · CPET
⚪ Bodyweight range                 self-reported
```

The public profile shows levels and claims. The raw numbers stay with the user. See `03-data-provenance.md`.

## Endgame and New Journey

When Character Level reaches the base cap or the user hits a personal milestone, they may start a **New Journey**: Origin is re-derived from the current profile, Journey XP resets, a prestige marker is kept, and the world re-opens with harder chapters. This is the only moment Origin changes, and it is framed as the user becoming a new person, which they have.

## Aesthetic direction

Dark, cinematic, restrained. Typography-led. Regions are evoked with light, texture and sound, not mascots. Animation is reserved for state changes (level up, region open, claim verified). Reference feel: a premium instrument, not a toy. Concept art and a design system are a later workstream.

## Open design questions

See `09-open-questions.md`. The main ones: the Character Level formula and cap, whether Power deserves its own stat for mainstream users or is folded into Strength at the start, exact Rift pacing, and how Hybrid's rotating home region feels in practice.
