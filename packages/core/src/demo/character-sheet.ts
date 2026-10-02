/**
 * Prints one character from the test fixtures, once in Game Mode and once in Simple Mode,
 * so the whole engine can be seen end to end without a UI.
 *
 *   pnpm --filter @minmax/core demo
 *
 * Norm tables are the published (provisional) ones from stats/published.ts, so the numbers are real
 * percentiles against named references wherever one exists.
 */
import { fitUserMeasurements, NOW, PROFILE, USER } from "../__fixtures__/measurements.js";
import { assembleCharacter } from "../character/assemble.js";
import { allRegionStatuses } from "../character/regions.js";
import { checkPredicate, describePredicate } from "../claims/issue.js";
import { bottleneckLine, levelLine, questTitle, statLine } from "../modes/vocabulary.js";
import { resolveAll } from "../provenance/resolve.js";
import { scheduleWeek } from "../quests/schedule.js";
import { QUEST_TEMPLATES, templateById } from "../quests/templates.js";
import { hrvReadiness } from "../recovery/hrv.js";
import { publishedNorms } from "../stats/published.js";
import { REGION_LABEL, type UiMode } from "../types/character.js";
import type { Predicate } from "../types/claim.js";
import { METRIC_SPECS } from "../types/metric.js";
import { isMeasured, STAT_LABEL, STATS } from "../types/stat.js";
import { startOfIsoWeek } from "../util/time.js";

const measurements = fitUserMeasurements();
const { character, originPending } = assembleCharacter({
  profile: PROFILE,
  measurements,
  norms: publishedNorms,
  classId: "hybrid",
  classChosenAt: NOW,
  now: NOW,
  mode: "game",
});
const estimates = resolveAll(measurements, { now: NOW });
const regions = allRegionStatuses({
  classId: character.classId,
  level: character.level,
  stats: character.stats,
  bottleneck: character.bottleneck,
  earned: [],
});
const quests = scheduleWeek({
  userId: USER,
  weekStart: startOfIsoWeek(NOW),
  homeRegion: character.homeRegion,
  unlocked: character.unlockedRegions,
  bottleneck: character.bottleneck,
  build: character.build,
  stats: character.stats,
  recentlyCompleted: [],
  carryOver: [],
  lastWeekAdherence: null,
  templates: QUEST_TEMPLATES,
  idFactory: (seed) => `q_${seed.slice(-16).replace(/[^a-z0-9]/gi, "_")}`,
});
const readiness = hrvReadiness(measurements, NOW);
const predicates: Predicate[] = [
  { kind: "stat", stat: "aerobic", op: ">=", percentile: 50 },
  { kind: "metric", metric: "vo2max", op: ">=", threshold: 45, unit: METRIC_SPECS.vo2max.unit },
  { kind: "level", op: ">=", level: 20 },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const out: string[] = [];
const line = (s = "") => out.push(s);

function sheet(mode: UiMode): void {
  line(`═══ MINMAX · ${mode === "game" ? "GAME MODE" : "SIMPLE MODE"} · ${PROFILE.sex}, ${PROFILE.age} ═══`);
  if (character.origin) {
    const o = character.origin;
    line(
      mode === "game"
        ? `Origin: ${cap(o.id)} (dominant ${STAT_LABEL[o.dominant ?? "strength"]}${o.secondary ? `, then ${STAT_LABEL[o.secondary]}` : ""})`
        : `Starting profile: strongest in ${STAT_LABEL[o.dominant ?? "strength"].toLowerCase()}`,
    );
  } else if (originPending) {
    line(`Origin pending: ${originPending.measured}/${originPending.needed} stats measured`);
  }
  line(
    mode === "game"
      ? `Class: ${cap(character.classId)} · Build: ${character.build.name}`
      : `Focus: ${cap(character.classId)}`,
  );
  line(levelLine(mode, character.level, null));
  line();
  for (const s of STATS) {
    const v = character.stats[s];
    const prov = isMeasured(v)
      ? `  [trust ${v.trustLevel} · confidence ${v.confidence} · norms ${v.normStatus}]`
      : "";
    line(`  ${statLine(mode, v)}${prov}`);
  }
  line();
  line(bottleneckLine(mode, character.bottleneck));
  line();
  line(mode === "game" ? "Regions" : "Areas");
  for (const r of regions) {
    line(
      r.unlocked
        ? `  ✓ ${REGION_LABEL[r.region]} (${r.reasons.join(", ")})`
        : `  ✗ ${REGION_LABEL[r.region]} — ${r.requirement}`,
    );
  }
  line();
  line(mode === "game" ? "This week's quests" : "This week's 3 goals");
  for (const q of quests) {
    const t = templateById(q.templateId);
    if (!t) continue;
    line(`  • ${questTitle(mode, t)}  [evidence ${t.evidence} · ${t.citation}]`);
  }
  line();
}

sheet("game");
sheet("simple");

line("═══ Provenance behind the sheet ═══");
for (const [metric, e] of estimates) {
  const flag = e.disagreement
    ? ` ⚠ disagrees with ${e.disagreement.withSource} by ${e.disagreement.delta}`
    : "";
  line(
    `  ${metric}: ${e.value} ${e.unit} · ${e.sources.join("+")} · trust ${e.trustLevel} · conf ${e.confidence.toFixed(2)} · ${e.rule}${flag}`,
  );
}
line();
line("═══ HRV readiness (personal baseline only) ═══");
line(
  readiness.kind === "ok"
    ? `  ${readiness.label} · z = ${readiness.z.toFixed(2)} · latest ${readiness.latest} ms vs baseline median ${readiness.baselineMedian} ms (${readiness.source})`
    : `  insufficient baseline: ${readiness.samples}/${readiness.needed} same-source nights`,
);
line();
line("═══ Claims the user could share (no raw values) ═══");
for (const p of predicates) {
  const c = checkPredicate(p, { estimates, stats: character.stats, level: character.level });
  line(
    c.satisfied
      ? `  ✓ "${describePredicate(p)}" · evidence trust ${c.trust} · sources ${c.sources.join(", ")}`
      : `  ✗ "${describePredicate(p)}" · ${c.reason}`,
  );
}

console.log(out.join("\n"));
