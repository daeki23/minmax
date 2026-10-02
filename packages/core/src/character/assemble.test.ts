import { describe, expect, it } from "vitest";
import { fitUserMeasurements, m, NOW, PROFILE } from "../__fixtures__/measurements.js";
import { syntheticNorms } from "../__fixtures__/norms.js";
import { hrvReadiness } from "../recovery/hrv.js";
import { assembleCharacter } from "./assemble.js";

describe("assembleCharacter", () => {
  it("builds a complete character from device and app data at onboarding", () => {
    const { character, originPending } = assembleCharacter({
      profile: PROFILE,
      measurements: fitUserMeasurements(),
      norms: syntheticNorms,
      classId: "hybrid",
      classChosenAt: NOW,
      now: NOW,
      mode: "game",
    });
    expect(originPending).toBeNull();
    expect(character.origin).not.toBeNull();
    expect(character.level).toBeGreaterThan(20);
    expect(character.bottleneck).not.toBeNull();
    expect(character.homeRegion).toBe("wilds");
    expect(character.unlockedRegions).toContain("wilds");
    expect(character.build.classId).toBe("hybrid");
  });

  it("reports what is missing when too little is measured, and keeps the sheet honest", () => {
    const { character, originPending } = assembleCharacter({
      profile: PROFILE,
      measurements: [m("steps_day", 8000, { source: "apple_health" })],
      norms: syntheticNorms,
      classId: "muscle",
      classChosenAt: NOW,
      now: NOW,
      mode: "simple",
    });
    expect(character.origin).toBeNull();
    expect(originPending?.needed).toBe(4);
    expect(character.stats.strength.kind).toBe("unmeasured");
    expect(character.level).toBeLessThan(20);
    expect(character.homeRegion).toBe("forge");
  });

  it("keeps a previously derived origin and a user-named build", () => {
    const first = assembleCharacter({
      profile: PROFILE,
      measurements: fitUserMeasurements(),
      norms: syntheticNorms,
      classId: "muscle",
      classChosenAt: NOW,
      now: NOW,
      mode: "game",
    });
    const later = assembleCharacter({
      profile: PROFILE,
      // Profile changes completely; origin must not.
      measurements: [
        m("vo2max", 65, { source: "lab", method: "cpet" }),
        m("steps_day", 15000, { source: "garmin" }),
        m("grip_kg", 30),
        m("sit_and_reach_cm", 10),
        m("sleep_duration_h", 8),
      ],
      norms: syntheticNorms,
      classId: "muscle",
      classChosenAt: NOW,
      now: NOW,
      mode: "game",
      previous: {
        origin: first.character.origin,
        bottleneck: first.bottleneckState,
        journeyXp: 1200,
        journey: 1,
        earnedRegions: ["engine"],
        buildName: { name: "Quiet Anvil", userNamed: true },
      },
    });
    expect(later.character.origin?.id).toBe(first.character.origin?.id);
    expect(later.character.build.name).toBe("Quiet Anvil");
    expect(later.character.journeyXp).toBe(1200);
    expect(later.character.unlockedRegions).toContain("engine");
  });
});

describe("hrvReadiness", () => {
  const nights = (values: number[], source: "oura" | "garmin" = "oura") =>
    values.map((v, i) => m("hrv_rmssd", v, { source, daysAgo: values.length - 1 - i }));

  it("needs a baseline before it says anything", () => {
    expect(hrvReadiness(nights([50, 52, 48]), NOW).kind).toBe("insufficient_baseline");
  });

  it("flags a night well below the personal baseline, in log space", () => {
    const base = [52, 55, 50, 53, 54, 51, 56, 52, 53, 55, 54, 52];
    const r = hrvReadiness(nights([...base, 38]), NOW);
    expect(r.kind).toBe("ok");
    if (r.kind !== "ok") return;
    expect(r.z).toBeLessThan(-1.5);
    expect(r.label).toBe("well_below");
    expect(r.baselineMedian).toBeCloseTo(53, 0);
  });

  it("never mixes sources", () => {
    // Twelve Garmin nights from 12 to 1 days ago, then a single Oura night today.
    const base = [52, 55, 50, 53, 54, 51, 56, 52, 53, 55, 54, 52].map((v, i) =>
      m("hrv_rmssd", v, { source: "garmin", daysAgo: 12 - i }),
    );
    const latestOura = m("hrv_rmssd", 70, { source: "oura", daysAgo: 0 });
    expect(hrvReadiness([...base, latestOura], NOW).kind).toBe("insufficient_baseline");
  });
});
