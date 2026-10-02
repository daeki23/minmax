# MINMAX

**Your body, as a character sheet.** A health and fitness app that turns real measurements from wearables, in-app tests and labs into an RPG character with honest, percentile-based stats, a game world to progress through, evidence-tiered weekly quests, and achievements that can be verified by third parties without exposing raw health data.

_Working title. Early stage: concept, research and domain engine. No app yet._

## Status (2026-10-02)

| Area | State |
|---|---|
| Vision, product concept, game system, data provenance | Drafted, see `docs/00`–`03` |
| Research (market, integrations, regulation, norms, ZK, monetization, psychology, training science, tech stack) | In progress, see `docs/research/` |
| Evidence framework, architecture, business model, compliance, roadmap | Pending research results, see `docs/04`–`08` |
| Domain engine (`packages/core`) | Planned next |
| Mobile app, backend | Not started |

The founder's original ChatGPT material is preserved verbatim in `docs/source/`. The original main prompt is still missing; see `docs/09-open-questions.md`.

## Repository layout

```
docs/
  00-vision.md               why MINMAX exists, principles, what it is not
  01-product-concept.md      audiences, core loop, onboarding, MVP scope hypothesis, risks
  02-game-system.md          Origin / Class / Build / Level, stats, bottleneck, regions, quests, modes
  03-data-provenance.md      trust levels, measurement schema, claims, phased proof architecture
  04-evidence-framework.md   (pending) how recommendations are tiered and what MINMAX never claims
  05-architecture.md         (pending) stack decision, system design, local-first, sync
  06-business-model.md       (pending) pricing, channels, revenue scenarios
  07-compliance.md           (pending) MDR/FDA wellness line, GDPR, store rules, checklist
  08-roadmap.md              (pending) phases and milestones
  09-open-questions.md       questions for the founder and for research; decisions log
  research/                  fact-checked research reports with sources
  source/                    raw founder material
packages/
  core/                      (planned) platform-agnostic domain engine in TypeScript
apps/
  mobile/                    (planned)
  api/                       (planned)
```

## Principles in one breath

Honest numbers with provenance. Evidence tiers on every recommendation. Game design, not gamification. Nobody is punished for their starting point. Privacy as a feature: claims leave the phone, data does not. One engine, two surfaces.

## Language

Documentation and code are in English because the product is global. Conversations with the founder are in German.
