# MINMAX

**Your body, as a character sheet.** A health and fitness app that turns real measurements from wearables, in-app tests and labs into an RPG character with honest, percentile-based stats, a game world to progress through, evidence-tiered weekly quests, and achievements that can be verified by third parties without exposing raw health data.

_Working title. Early stage: concept, research and domain engine. No app yet._

## Status (2026-10-02)

| Area | State |
|---|---|
| Vision, product concept, game system, data provenance, architecture | Drafted, see `docs/00`–`03` and `docs/05` |
| Research (market, integrations, regulation done; norms, ZK, monetization, psychology, evidence, training science, tech stack in progress) | See `docs/research/` |
| Evidence framework, business model, compliance, roadmap | Pending research results, see `docs/04`, `06`–`08` |
| Domain engine (`packages/core`) | Built: provenance, stats, character, quests, claims, modes; 118 tests; published (provisional) norm tables from the normative-data report, probit-space percentiles, criterion scores labelled as such; cited quest catalogue (65 templates, 51 citation keys) from the training-science report with opt-in, D-tier and age-gate rules; Character Level formula and Summit gate tuned on a synthetic-cohort simulation (`pnpm --filter @minmax/core demo:levels`) |
| CI | GitHub Actions: lint, typecheck, test, build on every push |
| Mobile app, backend | Not started; client framework decision pending |

Try the engine without a UI:

```
pnpm install
pnpm --filter @minmax/core demo
```

The founder's original ChatGPT material is preserved verbatim in `docs/source/`. The original main prompt is still missing; see `docs/09-open-questions.md`.

## Repository layout

```
docs/
  00-vision.md               why MINMAX exists, principles, what it is not
  01-product-concept.md      audiences, core loop, onboarding, MVP scope hypothesis, risks
  02-game-system.md          Origin / Class / Build / Level, stats, bottleneck, regions, quests, modes
  03-data-provenance.md      trust levels, measurement schema, claims, phased proof architecture
  04-evidence-framework.md   (pending) how recommendations are tiered and what MINMAX never claims
  05-architecture.md         system design, data flow, engine contract, storage, integrations, server
  06-business-model.md       (pending) pricing, channels, revenue scenarios
  07-compliance.md           (pending) MDR/FDA wellness line, GDPR, store rules, checklist
  08-roadmap.md              (pending) phases and milestones
  09-open-questions.md       questions for the founder and for research; decisions log
  research/                  fact-checked research reports with sources
  source/                    raw founder material
packages/
  core/                      @minmax/core: platform-agnostic domain engine in TypeScript (pure, tested)
    src/types                metric specs, measurement, stat, character, claim types
    src/provenance           confidence priors, recency, source resolution, daily aggregation
    src/stats                norm tables, stat model, percentile computation
    src/character            origin, class, level, bottleneck, regions, assemble
    src/quests               templates, scheduler, progress
    src/claims               predicate check, canonical payload, issue and verify
    src/modes                Game Mode and Simple Mode vocabulary
    src/demo                 character-sheet demo (pnpm --filter @minmax/core demo)
apps/
  mobile/                    (planned)
  api/                       (planned)
```

## Principles in one breath

Honest numbers with provenance. Evidence tiers on every recommendation. Game design, not gamification. Nobody is punished for their starting point. Privacy as a feature: claims leave the phone, data does not. One engine, two surfaces.

## Language

Documentation and code are in English because the product is global. Conversations with the founder are in German.
