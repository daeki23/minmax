/**
 * Published reference tables, transcribed from docs/research/normative-data.md (section numbers and
 * [n] source ids refer to that report). Every table carries its status:
 *
 * - "provisional": transcribed from a published source but not yet independently re-checked against
 *   the primary table, or modelled from summary statistics (mean ± SD). The UI labels these.
 * - "verified" is reserved for tables re-checked against the primary publication; none yet.
 *
 * Metrics with no published adult norms (pull-ups, barbell lifts, sprint, broad jump, shoulder
 * flexion, plant servings, sedentary breaks) deliberately have NO table here: the engine then treats
 * them as missing rather than inventing a distribution.
 */
import type { Metric } from "../types/metric.js";
import type { AnyNormTable, BandTable, NormTable, PercentileAnchor, Sex } from "./norms.js";
import { StaticNormRegistry } from "./norms.js";

export const PUBLISHED_TABLES_VERSION = "2026.10.02";

type Band = NormTable["bands"][number];
type Knots = BandTable["bands"][number]["knots"];

function band(minAge: number, maxAge: number, anchors: readonly PercentileAnchor[]): Band {
  return { minAge, maxAge, anchors };
}

/** Tables are stored with anchors in ascending percentile order. */
function ascending(anchors: readonly PercentileAnchor[]): readonly PercentileAnchor[] {
  return [...anchors].sort((a, b) => a[0] - b[0]);
}

/** Normal-distribution anchors from mean ± SD (used only where a source publishes no percentiles). */
function normalAnchors(mean: number, sd: number): readonly PercentileAnchor[] {
  return [
    [5, mean - 1.6449 * sd],
    [25, mean - 0.6745 * sd],
    [50, mean],
    [75, mean + 0.6745 * sd],
    [95, mean + 1.6449 * sd],
  ];
}

// ───────────────────────────────── Aerobic ─────────────────────────────────

/**
 * §1 Table A1: VO2peak (ml/kg/min), treadmill CPET, FRIEND 2022 [1] via secondary transcription [2].
 * P5/P25/P50/P75/P95. The 20-29 band is extended down to 18 as an approximation.
 * Open question 1 of the report: confirm against the primary table before "verified". The fact-check
 * of the report flags the WOMEN's rows in particular: their medians sit only 0.3-2.0 ml/kg/min below
 * the 2015 FRIEND table where the paper's abstract reports a 1.5-4.6 drop, so they may be
 * mis-transcribed in the secondary source. Until the primary table is checked the women's Aerobic
 * percentile is provisional in the strong sense and must not back a claim.
 */
const FRIEND_MEN: readonly (readonly [number, number, number, number, number, number, number])[] = [
  [20, 29, 24.8, 37.3, 45.4, 52.6, 62.1],
  [30, 39, 20.6, 31.3, 38.6, 46.5, 57.9],
  [40, 49, 19.7, 28.4, 34.8, 41.8, 53.2],
  [50, 59, 16.5, 23.9, 29.4, 35.5, 46.8],
  [60, 69, 13.8, 19.7, 24.4, 29.9, 40.2],
  [70, 79, 11.6, 16.8, 20.6, 25.0, 35.2],
  [80, 89, 12.2, 15.9, 17.7, 20.9, 25.6],
];
const FRIEND_WOMEN: readonly (readonly [number, number, number, number, number, number, number])[] = [
  [20, 29, 19.3, 28.6, 35.6, 42.2, 50.1],
  [30, 39, 16.6, 23.1, 28.3, 34.5, 45.5],
  [40, 49, 15.3, 21.3, 25.9, 30.9, 40.7],
  [50, 59, 14.5, 19.5, 23.1, 27.3, 35.3],
  [60, 69, 12.0, 16.4, 19.4, 23.1, 29.7],
  [70, 79, 11.3, 14.8, 17.1, 20.0, 24.2],
  [80, 89, 10.7, 12.8, 15.1, 17.2, 20.7],
];

function friendTable(sex: Sex, rows: typeof FRIEND_MEN): NormTable {
  return {
    metric: "vo2max",
    sex,
    status: "provisional",
    basis: "population",
    source:
      "Kaminsky LA et al., Updated Reference Standards for Cardiorespiratory Fitness, FRIEND registry, Mayo Clin Proc 2022 [1]; transcription via [2]",
    population: "22,379 CPET tests, 34 US laboratories, 1968-2021, apparently healthy adults 20-89",
    protocol: "treadmill CPET, RER ≥ 1.10, directly measured VO2peak",
    version: PUBLISHED_TABLES_VERSION,
    bands: rows.map(([lo, hi, p5, p25, p50, p75, p95], i) =>
      band(i === 0 ? 18 : lo, hi, [
        [5, p5],
        [25, p25],
        [50, p50],
        [75, p75],
        [95, p95],
      ]),
    ),
  };
}

/**
 * §1 Resting heart rate, Quer 2020 [6]: 92,457 Fitbit users; 95 % of men 50-80 bpm, women 53-82 bpm.
 * Lower is better, so the anchors run from high values at low percentiles to low values at high ones.
 * The report calls RHR a weak cross-sectional ranking metric; its weight in Aerobic is small.
 */
function rhrTable(sex: Sex, lo95: number, hi95: number): NormTable {
  const mean = (lo95 + hi95) / 2;
  const sd = (hi95 - lo95) / (2 * 1.96);
  return {
    metric: "resting_hr",
    sex,
    status: "provisional",
    basis: "population",
    source:
      "Quer G et al., Inter- and intraindividual variability in daily resting heart rate, PLoS ONE 2020 [6]",
    population: "92,457 US adults wearing Fitbit, about 33 million person-days",
    protocol: "wrist-derived daily resting heart rate; 95 % interval converted to a normal distribution",
    version: PUBLISHED_TABLES_VERSION,
    bands: [band(18, 99, ascending(normalAnchors(mean, sd).map(([p, v]) => [100 - p, v] as const)))],
  };
}

/** WHO 2020 adult guideline: 150-300 min moderate activity per week. Criterion, not a percentile. */
const AEROBIC_MINUTES: BandTable = {
  metric: "aerobic_minutes_week",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source:
    "WHO Guidelines on physical activity and sedentary behaviour, 2020 (150-300 min/week moderate); citation to be confirmed in research/training-science.md",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [0, 2],
        [75, 30],
        [150, 80],
        [300, 95],
        [600, 97],
      ],
    },
  ],
};

// ───────────────────────────────── Strength ─────────────────────────────────

/**
 * §2 Table S1: grip strength (kg), Dodds 2014 Table 2 [9], centiles P10/P25/P50/P75/P90 at exact ages
 * 20..90 in 5-year steps. Each exact age becomes a 5-year band centred on it; the engine blends between
 * band midpoints, which reproduces the exact-age curve. Weakness cut-offs: 27 kg men, 16 kg women.
 */
const DODDS_MEN: readonly (readonly [number, number, number, number, number, number])[] = [
  [20, 30, 35, 40, 46, 52],
  [25, 36, 41, 48, 55, 61],
  [30, 38, 44, 51, 58, 64],
  [35, 39, 45, 51, 58, 64],
  [40, 38, 44, 50, 57, 63],
  [45, 36, 42, 49, 56, 61],
  [50, 35, 41, 48, 54, 60],
  [55, 34, 40, 47, 53, 59],
  [60, 33, 39, 45, 51, 56],
  [65, 31, 37, 43, 48, 53],
  [70, 29, 34, 39, 44, 49],
  [75, 26, 31, 35, 41, 45],
  [80, 23, 27, 32, 37, 42],
  [85, 19, 24, 29, 33, 38],
  [90, 16, 20, 25, 29, 33],
];
const DODDS_WOMEN: readonly (readonly [number, number, number, number, number, number])[] = [
  [20, 21, 24, 28, 32, 36],
  [25, 23, 26, 30, 35, 38],
  [30, 24, 27, 31, 35, 39],
  [35, 23, 27, 31, 35, 39],
  [40, 23, 27, 31, 35, 39],
  [45, 22, 26, 30, 34, 38],
  [50, 21, 25, 29, 33, 37],
  [55, 19, 23, 28, 32, 35],
  [60, 18, 22, 27, 31, 34],
  [65, 17, 21, 25, 29, 33],
  [70, 16, 20, 24, 27, 31],
  [75, 14, 18, 21, 25, 28],
  [80, 13, 16, 19, 23, 26],
  [85, 11, 14, 17, 20, 23],
  [90, 9, 11, 14, 17, 20],
];

function doddsTable(sex: Sex, rows: typeof DODDS_MEN): NormTable {
  return {
    metric: "grip_kg",
    sex,
    status: "provisional",
    basis: "population",
    source:
      "Dodds RM et al., Grip strength across the life course: normative data from twelve British studies, PLoS ONE 2014, Table 2 [9] (CC-BY)",
    population: "49,964 participants, 60,803 observations, 12 British cohorts; GAMLSS centiles",
    protocol: "maximum grip, Jamar-type dynamometer, best of either hand",
    version: PUBLISHED_TABLES_VERSION,
    bands: rows.map(([age, p10, p25, p50, p75, p90], i) =>
      band(i === 0 ? 18 : age - 2, i === rows.length - 1 ? 99 : age + 2, [
        [10, p10],
        [25, p25],
        [50, p50],
        [75, p75],
        [90, p90],
      ]),
    ),
  };
}

/**
 * §2 30-second chair stand, Rikli & Jones [14]: normal range (P25-P75) for community-dwelling adults 60+.
 * Only two anchors are published, so everything outside the interquartile range is a modelled tail.
 */
const CHAIR_STAND_AGES: readonly (readonly [number, number])[] = [
  [60, 64],
  [65, 69],
  [70, 74],
  [75, 79],
  [80, 84],
  [85, 89],
  [90, 99],
];
const CHAIR_STAND_MEN: readonly (readonly [number, number])[] = [
  [14, 19],
  [12, 18],
  [12, 17],
  [11, 17],
  [10, 15],
  [8, 14],
  [7, 12],
];
const CHAIR_STAND_WOMEN: readonly (readonly [number, number])[] = [
  [12, 17],
  [11, 16],
  [10, 15],
  [10, 15],
  [9, 14],
  [8, 13],
  [4, 11],
];

function chairStandTable(sex: Sex, rows: readonly (readonly [number, number])[]): NormTable {
  return {
    metric: "sit_to_stand_30s",
    sex,
    status: "provisional",
    basis: "population",
    source: "Rikli RE & Jones CJ, Senior Fitness Test, 30-second chair stand normal ranges [14]",
    population: "community-dwelling US adults aged 60-94 (Senior Fitness Test norming study)",
    protocol: "full stands in 30 s from a 43 cm chair, arms crossed",
    version: PUBLISHED_TABLES_VERSION,
    bands: rows.map(([p25, p75], i) => {
      const [lo, hi] = CHAIR_STAND_AGES[i] as readonly [number, number];
      return band(lo, hi, [
        [25, p25],
        [75, p75],
      ]);
    }),
  };
}

/**
 * §2 Push-ups: no trustworthy population percentiles exist (the circulating "ACSM" tables have unknown
 * provenance [12]). This is a CRITERION scale anchored on the Cooper Institute 50th percentile for
 * push-ups in one minute [5] (score 50) and, for men, on Yang 2019 [11]: fewer than 10 push-ups carried
 * the highest cardiovascular risk and more than 40 the lowest (scores 20 and 90). For women no upper
 * anchor is published; twice the Cooper median scores 90 as an engine assumption, flagged provisional.
 */
function pushupTable(
  sex: "male" | "female",
  rows: readonly (readonly [number, number, number])[],
): BandTable {
  return {
    metric: "pushups_max",
    sex,
    status: "provisional",
    basis: "criterion",
    source:
      "Cooper Institute Physical Fitness Norms, 50th percentile [5]; Yang J et al., Push-up capacity and future cardiovascular events, JAMA Netw Open 2019 [11]",
    protocol: "maximum consecutive push-ups, standard form (knees for the Cooper women's norm)",
    version: PUBLISHED_TABLES_VERSION,
    bands: rows.map(([lo, hi, p50]) => ({
      minAge: lo,
      maxAge: hi,
      knots:
        sex === "male"
          ? ([
              [0, 1],
              [10, 20],
              [p50, 50],
              [40, 90],
              [60, 97],
            ] as Knots)
          : ([
              [0, 1],
              [p50 / 2, 20],
              [p50, 50],
              [p50 * 2, 90],
              [p50 * 3, 97],
            ] as Knots),
    })),
  };
}

// ───────────────────────────────── Power ─────────────────────────────────

/**
 * §3 Countermovement jump height, Koivunen 2026 [17]: 30,217 Finns on a contact mat. The paper reports
 * mean ± SD for 51-55 y (men 26.2 ± 4.1 cm, women 18.7 ± 3.9 cm) and 65+ (22.1 ± 3.0; 15.0 ± 3.9) and a
 * decline of about 0.9 %/year after the peak at 17-18. Bands below 51 are extrapolated from the 51-55
 * anchor with that decline, bands above 65 use the 65+ anchor; SD scales with the mean. MODELLED.
 * Most of the sample is children; only about 340 men and 1,330 women are over 20, and the men's
 * anchor cells are tiny (n = 10 at 51-55, n = 7 over 65). Tail percentiles for adults are therefore
 * not credible and the report asks for no tail claims on Power until a better adult source exists.
 */
function cmjTable(sex: "male" | "female"): NormTable {
  const anchor53 = sex === "male" ? { mean: 26.2, sd: 4.1 } : { mean: 18.7, sd: 3.9 };
  const anchor70 = sex === "male" ? { mean: 22.1, sd: 3.0 } : { mean: 15.0, sd: 3.9 };
  const decline = 0.991;
  const meanAt = (age: number): number => {
    if (age <= 53) return anchor53.mean * decline ** (age - 53);
    if (age <= 70) return anchor53.mean + ((anchor70.mean - anchor53.mean) * (age - 53)) / 17;
    return anchor70.mean * decline ** (age - 70);
  };
  const cv53 = anchor53.sd / anchor53.mean;
  const cv70 = anchor70.sd / anchor70.mean;
  const bands: Band[] = [];
  for (let lo = 18; lo <= 78; lo += 5) {
    const hi = lo === 78 ? 99 : lo + 4;
    const mid = lo === 78 ? 80 : lo + 2;
    const mean = meanAt(mid);
    const cv = mid <= 53 ? cv53 : mid >= 70 ? cv70 : cv53 + ((cv70 - cv53) * (mid - 53)) / 17;
    bands.push(
      band(
        lo,
        hi,
        normalAnchors(mean, mean * cv).map(([p, v]) => [p, Math.round(v * 10) / 10] as const),
      ),
    );
  }
  return {
    metric: "vertical_jump_cm",
    sex,
    status: "provisional",
    basis: "population",
    source:
      "Koivunen K et al., Effect of age and sex on lower-extremity power, 30,217 Finnish participants, Scand J Med Sci Sports 2026 [17]; modelled from mean ± SD",
    population:
      "30,217 Finns aged 6-75 (5,413 women), contact-mat countermovement jump; adults are a small minority of the sample (about 340 men, 1,330 women over 20)",
    protocol:
      "countermovement jump height on a contact mat; phone-based measurement needs its own validation",
    version: PUBLISHED_TABLES_VERSION,
    bands,
  };
}

// ───────────────────────────────── Mobility (criterion only) ─────────────────────────────────

const SIT_AND_REACH: BandTable = {
  metric: "sit_and_reach_cm",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source:
    "CSEP/CPAFLA sit-and-reach bands via [19] (box zero at 26 cm; 'excellent' > 40 cm ≈ 14 cm past the toes for ages 20-29); criterion scale, low confidence",
  protocol: "value in cm relative to the toes, positive past the toes",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [-20, 5],
        [-10, 25],
        [0, 55],
        [8, 80],
        [14, 95],
        [25, 97],
      ],
    },
  ],
};

const KNEE_TO_WALL: BandTable = {
  metric: "knee_to_wall_cm",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source:
    "Weight-bearing lunge test, about 10 cm as the restriction threshold, MDC 1-1.5 cm [20]; criterion scale",
  protocol: "knee-to-wall distance in cm, worse side",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [0, 2],
        [5, 20],
        [10, 80],
        [13, 95],
        [18, 97],
      ],
    },
  ],
};

const SINGLE_LEG_BALANCE: BandTable = {
  metric: "single_leg_balance_s",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source:
    "Springer BA et al., Normative values for the unipedal stance test, J Geriatr Phys Ther 2007 [21][22]; full table not open-access, criterion bands by age",
  protocol: "eyes open, best of three, capped at 60 s",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 59,
      knots: [
        [0, 2],
        [10, 30],
        [30, 80],
        [45, 95],
        [60, 97],
      ],
    },
    {
      minAge: 60,
      maxAge: 99,
      knots: [
        [0, 2],
        [5, 30],
        [15, 80],
        [30, 95],
        [45, 97],
      ],
    },
  ],
};

// ───────────────────────────────── Movement (dose-response) ─────────────────────────────────

/**
 * §5 Steps: dose-response, not a percentile. 2,000 steps/day is the reference "no benefit" level in
 * Ding 2025 [28] and Stens 2023 [31]; mortality benefit plateaus at about 8,000-10,000 under 60 and
 * 6,000-8,000 at 60+ (Paluch 2022 [27]). A score near the ceiling means "benefit captured".
 */
const STEPS: BandTable = {
  metric: "steps_day",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source:
    "Paluch AE et al., Lancet Public Health 2022 [27]; Ding D et al., Lancet Public Health 2025 [28]; Stens NA et al., JACC 2023 [31]",
  protocol: "7-day median daily step count",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 59,
      knots: [
        [0, 1],
        [2000, 5],
        [4000, 35],
        [6000, 65],
        [8000, 92],
        [10000, 97],
        [14000, 99],
      ],
    },
    {
      minAge: 60,
      maxAge: 99,
      knots: [
        [0, 1],
        [2000, 5],
        [3500, 35],
        [5000, 65],
        [7000, 92],
        [8500, 97],
        [12000, 99],
      ],
    },
  ],
};

/** WHO 2020: 150 min/week ≈ 21 min/day moderate activity; 300 min/week ≈ 43 min/day. */
const ACTIVE_MINUTES: BandTable = {
  metric: "active_minutes_day",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source:
    "WHO Guidelines on physical activity 2020, daily equivalent; citation to be confirmed in research/training-science.md",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [0, 2],
        [10, 35],
        [21, 80],
        [43, 95],
        [90, 97],
      ],
    },
  ],
};

// ───────────────────────────────── Recovery ─────────────────────────────────

/** §6 AASM/SRS consensus: adults need 7 h or more [33]; long sleep above 9-10 h scores lower. */
const SLEEP_DURATION: BandTable = {
  metric: "sleep_duration_h",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source:
    "Watson NF et al., Recommended amount of sleep for a healthy adult, AASM/SRS consensus, JCSM 2015 [33]",
  protocol: "7-day mean total sleep time from a wearable; stage minutes are not scored [36]",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [4, 3],
        [5, 15],
        [6, 45],
        [7, 90],
        [8, 95],
        [9, 93],
        [10, 60],
        [11, 30],
      ],
    },
  ],
};

/** §6 Sleep Regularity Index, Windred 2024 [34]: UK Biobank median 81.0, IQR 73.8-86.3 (n = 60,977, mean age 63). */
const SLEEP_REGULARITY: NormTable = {
  metric: "sleep_regularity_index",
  sex: "pooled",
  status: "provisional",
  basis: "population",
  source:
    "Windred DP et al., Sleep regularity is a stronger predictor of mortality risk than sleep duration, Sleep 2024 [34]",
  population: "60,977 UK Biobank adults with 7-day accelerometry, mean age 63",
  protocol: "SRI 0-100 from accelerometry; wearable SRI agreement not yet established",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    band(18, 99, [
      [25, 73.8],
      [50, 81.0],
      [75, 86.3],
    ]),
  ],
};

/** §6 NSF sleep-quality consensus [35]: efficiency ≥ 85 % good; ≤ 74 % not good. */
const SLEEP_EFFICIENCY: BandTable = {
  metric: "sleep_efficiency_pct",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source: "Ohayon M et al., National Sleep Foundation sleep quality recommendations, Sleep Health 2017 [35]",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [60, 5],
        [74, 25],
        [80, 55],
        [85, 88],
        [90, 95],
        [97, 97],
      ],
    },
  ],
};

// ───────────────────────────────── Nutrition and metabolic ─────────────────────────────────

/** §7 Morton 2018 [37]: fat-free-mass gains plateau at about 1.6 g/kg/day; more is not better. */
const PROTEIN: BandTable = {
  metric: "protein_g_per_kg_day",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source: "Morton RW et al., Protein supplementation and resistance-training gains, BJSM 2018 [37]",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [0.4, 5],
        [0.8, 40],
        [1.2, 70],
        [1.6, 95],
        [2.2, 95],
        [3.0, 80],
      ],
    },
  ],
};

/** §7 Reynolds 2019 [38]: greatest risk reduction at 25-29 g fibre/day. */
const FIBER: BandTable = {
  metric: "fiber_g_day",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source: "Reynolds A et al., Carbohydrate quality and human health, Lancet 2019 [38]",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [5, 5],
        [15, 45],
        [25, 90],
        [29, 97],
        [50, 97],
      ],
    },
  ],
};

/** §5 NICE NG246 [29]: waist-to-height 0.4-0.49 healthy, 0.5-0.59 increased risk, ≥ 0.6 high risk. */
const WAIST_TO_HEIGHT: BandTable = {
  metric: "waist_to_height",
  sex: "pooled",
  status: "provisional",
  basis: "criterion",
  source: "NICE NG246, Identifying and assessing overweight, obesity and central adiposity [29]",
  version: PUBLISHED_TABLES_VERSION,
  bands: [
    {
      minAge: 18,
      maxAge: 99,
      knots: [
        [0.35, 70],
        [0.4, 92],
        [0.45, 95],
        [0.49, 90],
        [0.5, 60],
        [0.59, 30],
        [0.6, 15],
        [0.75, 3],
      ],
    },
  ],
};

/**
 * §5 Body fat % bands derived from Gallagher 2000 [24] via the circulating chart [25]:
 * under / healthy / over / obese per sex and age. Healthy band scores 85-95, "over" falls to 50 at the
 * obese boundary. Consumer BIA scales are far from DXA, so the measurement trust is low anyway.
 */
function bodyFatTable(
  sex: "male" | "female",
  rows: readonly (readonly [number, number, number, number, number])[],
): BandTable {
  return {
    metric: "body_fat_pct",
    sex,
    status: "provisional",
    basis: "criterion",
    source: "Gallagher D et al., Healthy percentage body fat ranges, AJCN 2000 [24]; chart via [25]",
    protocol: "DXA or 4-compartment %fat; BIA values carry low trust",
    version: PUBLISHED_TABLES_VERSION,
    bands: rows.map(([lo, hi, under, overStart, obese]) => {
      const healthyMid = (under + overStart) / 2;
      return {
        minAge: lo,
        maxAge: hi,
        knots: [
          [under - 5, 25],
          [under, 85],
          [healthyMid, 95],
          [overStart, 88],
          [obese, 50],
          [obese + 7, 20],
          [obese + 20, 3],
        ] as Knots,
      };
    }),
  };
}
// rows: [minAge, maxAge, underweightBelow, overweightFrom, obeseAbove]
const BODY_FAT_MEN: readonly (readonly [number, number, number, number, number])[] = [
  [18, 39, 8, 20, 25],
  [40, 59, 11, 22, 28],
  [60, 99, 13, 25, 30],
];
const BODY_FAT_WOMEN: readonly (readonly [number, number, number, number, number])[] = [
  [18, 39, 21, 34, 39],
  [40, 59, 23, 35, 40],
  [60, 99, 24, 36, 42],
];

/**
 * §7 Table N1: NHANES 2005-2016 population percentiles for untreated US adults 18-85 (n = 12,696),
 * NLA 2024 [39]. Lower is better and causal, so the fitness percentile is the inverse of the
 * population percentile: being at the population 10th percentile of LDL-C (72 mg/dL) is fitness p90.
 */
const NHANES_PCT = [1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99] as const;
const NHANES_LDL = [45, 63, 72, 85, 95, 104, 112, 121, 131, 143, 161, 176, 211] as const;
const NHANES_APOB = [41, 54, 61, 70, 77, 84, 90, 97, 104, 113, 125, 137, 160] as const;

function nhanesTable(metric: Metric, values: readonly number[]): NormTable {
  return {
    metric,
    sex: "pooled",
    status: "provisional",
    basis: "population",
    source:
      "NLA Expert Clinical Consensus on apolipoprotein B, J Clin Lipidol 2024, Table 1 (NHANES 2005-2016) [39]",
    population: "12,696 untreated US adults aged 18-85, NHANES 2005-2016",
    protocol: "fasting lipid panel; fitness percentile = 100 − population percentile",
    version: PUBLISHED_TABLES_VERSION,
    bands: [band(18, 99, ascending(NHANES_PCT.map((p, i) => [100 - p, values[i] as number] as const)))],
  };
}

/** §7 guideline bands: ADA 2026 [42] HbA1c and fasting glucose; AHA/ACC 2025 BP [44]; CDC/AHA 2003 hs-CRP [43]. */
function guidelineBand(metric: Metric, source: string, knots: Knots): BandTable {
  return {
    metric,
    sex: "pooled",
    status: "provisional",
    basis: "criterion",
    source,
    version: PUBLISHED_TABLES_VERSION,
    bands: [{ minAge: 18, maxAge: 99, knots }],
  };
}

const HBA1C = guidelineBand(
  "hba1c_pct",
  "ADA Standards of Care in Diabetes 2026, diagnosis and classification [42]",
  [
    [4.5, 95],
    [5.6, 90],
    [5.7, 60],
    [6.4, 30],
    [6.5, 15],
    [9, 2],
  ],
);
const FASTING_GLUCOSE = guidelineBand(
  "fasting_glucose_mg_dl",
  "ADA Standards of Care in Diabetes 2026, diagnosis and classification [42]",
  [
    [70, 95],
    [99, 90],
    [100, 60],
    [125, 30],
    [126, 15],
    [200, 2],
  ],
);
const SYSTOLIC_BP = guidelineBand(
  "systolic_bp",
  "AHA/ACC high blood pressure guideline 2025 (2017 categories kept) [44]",
  [
    [90, 80],
    [105, 95],
    [119, 90],
    [120, 70],
    [129, 55],
    [130, 40],
    [139, 25],
    [140, 15],
    [180, 2],
  ],
);
const DIASTOLIC_BP = guidelineBand(
  "diastolic_bp",
  "AHA/ACC high blood pressure guideline 2025 (2017 categories kept) [44]",
  [
    [55, 80],
    [65, 95],
    [79, 90],
    [80, 40],
    [89, 25],
    [90, 15],
    [120, 2],
  ],
);
const HS_CRP = guidelineBand(
  "hs_crp_mg_l",
  "Pearson TA et al., Markers of inflammation and CVD, CDC/AHA statement, Circulation 2003 [43]",
  [
    [0.3, 95],
    [1, 85],
    [3, 45],
    [10, 10],
  ],
);

// ───────────────────────────────── Registry ─────────────────────────────────

export const PUBLISHED_TABLES: readonly AnyNormTable[] = [
  friendTable("male", FRIEND_MEN),
  friendTable("female", FRIEND_WOMEN),
  rhrTable("male", 50, 80),
  rhrTable("female", 53, 82),
  AEROBIC_MINUTES,
  doddsTable("male", DODDS_MEN),
  doddsTable("female", DODDS_WOMEN),
  chairStandTable("male", CHAIR_STAND_MEN),
  chairStandTable("female", CHAIR_STAND_WOMEN),
  pushupTable("male", [
    [18, 29, 33],
    [30, 39, 27],
    [40, 49, 21],
    [50, 59, 15],
  ]),
  pushupTable("female", [
    [18, 29, 18],
    [30, 39, 14],
    [40, 49, 11],
  ]),
  cmjTable("male"),
  cmjTable("female"),
  SIT_AND_REACH,
  KNEE_TO_WALL,
  SINGLE_LEG_BALANCE,
  STEPS,
  ACTIVE_MINUTES,
  SLEEP_DURATION,
  SLEEP_REGULARITY,
  SLEEP_EFFICIENCY,
  PROTEIN,
  FIBER,
  WAIST_TO_HEIGHT,
  bodyFatTable("male", BODY_FAT_MEN),
  bodyFatTable("female", BODY_FAT_WOMEN),
  nhanesTable("ldl_mg_dl", NHANES_LDL),
  nhanesTable("apob_mg_dl", NHANES_APOB),
  HBA1C,
  FASTING_GLUCOSE,
  SYSTOLIC_BP,
  DIASTOLIC_BP,
  HS_CRP,
];

/** The registry a host should use in production until it loads tables from a versioned content bundle. */
export const publishedNorms = new StaticNormRegistry(PUBLISHED_TABLES);

/** Metrics the engine knows but has no published table for; the UI should say "no reference yet". */
export function metricsWithoutPublishedTable(all: readonly Metric[]): readonly Metric[] {
  const covered = new Set(PUBLISHED_TABLES.map((t) => t.metric));
  return all.filter((m) => !covered.has(m));
}
