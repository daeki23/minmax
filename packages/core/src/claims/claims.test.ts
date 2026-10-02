import { describe, expect, it } from "vitest";
import { fitUserMeasurements, NOW, PROFILE } from "../__fixtures__/measurements.js";
import { syntheticNorms } from "../__fixtures__/norms.js";
import { characterLevel } from "../character/level.js";
import { resolveAll } from "../provenance/resolve.js";
import { computeAllStats } from "../stats/compute.js";
import type { Claim, Signer, Verifier } from "../types/claim.js";
import { canonicalize, checkPredicate, describePredicate, issueClaim, verifyClaim } from "./issue.js";

/** Test-only signer: a deterministic non-cryptographic digest of the whole payload. */
function digest(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return `sig(${(h >>> 0).toString(16)}:${s.length})`;
}
const fakeSigner: Signer = {
  alg: "fake",
  keyId: "k1",
  async sign(payload) {
    return digest(payload);
  },
};
const fakeVerifier: Verifier = {
  alg: "fake",
  async verify(payload, signature, keyId) {
    return keyId === "k1" && signature === digest(payload);
  },
};

function evidence() {
  const estimates = resolveAll(fitUserMeasurements(), { now: NOW });
  const stats = computeAllStats({ profile: PROFILE, norms: syntheticNorms, estimates, now: NOW });
  return { estimates, stats, level: characterLevel(stats) };
}
const opts = {
  subject: "subj_abc",
  issuer: "minmax-test",
  now: NOW,
  idFactory: (s: string) => `c_${s.length}`,
};

describe("canonicalize", () => {
  it("is key-order independent", () => {
    expect(canonicalize({ b: 1, a: [{ d: 2, c: 3 }] })).toBe(canonicalize({ a: [{ c: 3, d: 2 }], b: 1 }));
  });
});

describe("checkPredicate", () => {
  it("metric threshold met with device trust", () => {
    const r = checkPredicate(
      { kind: "metric", metric: "vo2max", op: ">=", threshold: 48, unit: "ml/kg/min" },
      evidence(),
    );
    expect(r.satisfied).toBe(true);
    if (!r.satisfied) return;
    expect(r.trust).toBe(2);
    expect(r.sources).toEqual(["garmin"]);
  });

  it("metric threshold not met", () => {
    const r = checkPredicate(
      { kind: "metric", metric: "vo2max", op: ">=", threshold: 60, unit: "ml/kg/min" },
      evidence(),
    );
    expect(r).toEqual({ satisfied: false, reason: "not_met" });
  });

  it("a threshold met only within measurement error is not certified below clinical trust", () => {
    // Fixture VO2max is 52 from a wrist estimate; 51 is inside the metric's tolerance.
    const r = checkPredicate(
      { kind: "metric", metric: "vo2max", op: ">=", threshold: 51, unit: "ml/kg/min" },
      evidence(),
    );
    expect(r).toEqual({ satisfied: false, reason: "within_error" });
  });

  it("stat percentiles beyond the published reference tail cannot be certified", () => {
    const r = checkPredicate({ kind: "stat", stat: "aerobic", op: ">=", percentile: 99 }, evidence());
    expect(r).toEqual({ satisfied: false, reason: "beyond_reference" });
  });

  it("unmeasured metric cannot be claimed", () => {
    const r = checkPredicate(
      { kind: "metric", metric: "ldl_mg_dl", op: "<=", threshold: 100, unit: "mg/dL" },
      evidence(),
    );
    expect(r).toEqual({ satisfied: false, reason: "unmeasured" });
  });

  it("a stat rendered as a range is too uncertain to certify", () => {
    const ev = evidence();
    // Power has only two of three metrics in the fixture, with app-recorded confidence; force a range by dropping confidence.
    const stats = {
      ...ev.stats,
      power: {
        ...ev.stats.power,
        kind: "range" as const,
        low: 50,
        high: 80,
        mid: 65,
        confidence: 0.5,
        trustLevel: 1 as const,
        normStatus: "synthetic" as const,
        contributions: [],
      },
    };
    const r = checkPredicate({ kind: "stat", stat: "power", op: ">=", percentile: 50 }, { ...ev, stats });
    expect(r).toEqual({ satisfied: false, reason: "range_too_wide" });
  });

  it("level predicates use the weakest trust across measured stats", () => {
    const ev = evidence();
    const r = checkPredicate({ kind: "level", op: ">=", level: 5 }, ev);
    expect(r.satisfied).toBe(true);
    if (!r.satisfied) return;
    expect(r.trust).toBe(0); // nutrition is self-reported in the fixture
  });
});

describe("issueClaim / verifyClaim", () => {
  it("issues a signed, coarse claim and verifies it", async () => {
    const res = await issueClaim(
      { kind: "metric", metric: "vo2max", op: ">=", threshold: 48, unit: "ml/kg/min" },
      evidence(),
      opts,
      fakeSigner,
    );
    expect("signature" in res).toBe(true);
    const claim = res as Claim;
    expect(claim.subject).toBe("subj_abc");
    expect(JSON.stringify(claim)).not.toContain("52"); // raw value never leaves
    expect(claim.validFrom).toBe("2026-10-02");
    expect(claim.validUntil).toBe("2026-12-01"); // vo2max freshness 30 d × 2
    expect(await verifyClaim(claim, fakeVerifier, NOW)).toEqual({ valid: true });
  });

  it("rejects tampered and expired claims", async () => {
    const claim = (await issueClaim(
      { kind: "metric", metric: "vo2max", op: ">=", threshold: 48, unit: "ml/kg/min" },
      evidence(),
      opts,
      fakeSigner,
    )) as Claim;
    const tampered: Claim = {
      ...claim,
      predicate: { kind: "metric", metric: "vo2max", op: ">=", threshold: 70, unit: "ml/kg/min" },
    };
    expect((await verifyClaim(tampered, fakeVerifier, NOW)).valid).toBe(false);
    expect((await verifyClaim(claim, fakeVerifier, "2027-03-01T00:00:00.000Z")).reason).toBe("expired");
  });

  it("returns the failed check instead of a claim when the predicate does not hold", async () => {
    const res = await issueClaim(
      { kind: "metric", metric: "vo2max", op: ">=", threshold: 80, unit: "ml/kg/min" },
      evidence(),
      opts,
      fakeSigner,
    );
    expect(res).toEqual({ satisfied: false, reason: "not_met" });
  });

  it("describes predicates without values", () => {
    expect(describePredicate({ kind: "stat", stat: "aerobic", op: ">=", percentile: 70 })).toBe(
      "aerobic at or above the 70th percentile",
    );
  });
});
