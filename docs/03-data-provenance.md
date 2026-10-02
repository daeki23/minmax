# 03 · Data provenance, trust and proofs

_Status: draft v0.1 · 2026-10-02. The founder's trust-level model is adopted and made concrete. The proof layer is designed in phases so that the MVP ships with none of the blockchain complexity and loses nothing later._

## The core idea

A blockchain does not make a measurement true. Neither does Garmin. MINMAX therefore never stores a bare number. It stores a **Measurement** that knows its source, its device, its time, its trust level and its confidence, and it derives everything else from that.

Three separate things, kept separate in code and in the UI:

```
Measurement  →  Provenance  →  Proof
"Garmin computed    "This value came      "This user satisfies
 VO₂max = 52"        from Garmin Connect    VO₂max ≥ 50 and I can
                     via OAuth on Oct 2,    show it without the 52"
                     device FR965,
                     trust: device"
```

## Trust levels

| Level | Name | Example | Typical confidence |
|---|---|---|---|
| 0 | **Self-reported** | User types "VO₂max 52" or "15 pull-ups" | Low |
| 1 | **App-recorded** | MINMAX records a 5 km run or an in-app grip/jump/push-up test with the phone sensors and the user's confirmation | Medium |
| 2 | **Device-verified** | Value comes from a known device through a platform health store or vendor API (Garmin, Apple Watch, Oura, Polar, Whoop, Withings scale) | Medium-high, metric-dependent |
| 3 | **Clinical / lab** | CPET VO₂max, laboratory blood panel, DEXA, validated BP cuff with clinic protocol | High |
| + | **Corroborated** | Two or more independent sources agree within tolerance | Raises confidence one notch |

"Device-verified" means MINMAX can trace the value to a device and an authenticated account. It does not mean the device is right. Wrist-estimated VO₂max, HRV and sleep stages carry known error bars (see `research/wearable-integrations.md`); the confidence field encodes them per metric and per vendor.

## Measurement schema

Every health event carries these fields from day one. This is the one architectural decision that must be right in the MVP, because retrofitting it is expensive and because the proof layer depends on it. **[decision]**

```
Measurement
  id                 ULID
  user_id
  metric             enum   (vo2max, resting_hr, hrv_rmssd, steps, sleep_duration, grip_kg, pullups, ...)
  value              number
  unit               string
  measured_at        timestamp (when the body was measured)
  recorded_at        timestamp (when MINMAX received it)
  source             enum   (self, minmax_app, apple_health, health_connect, garmin, oura, polar, whoop, withings, lab, ...)
  via                enum   (device_direct, apple_health, health_connect, aggregator, in_app, manual, import) optional:
                            the ingest path, so "Garmin via Apple Health" and "Oura via Oura API" stay distinguishable
  source_record_id   string  (vendor's id, for dedup and audit)
  device             { vendor, model, firmware? }  optional
  method             string  (e.g. "firstbeat_estimate", "cpet", "cooper_12min", "in_app_camera_count")
  trust_level        0 | 1 | 2 | 3
  confidence         0..1    (metric- and source-specific prior, adjusted by corroboration and recency)
  verification       enum   (unverified, source_authenticated, corroborated, attested)
  context            json    (e.g. activity type, altitude, illness flag, menstrual phase if user opted in)
  raw_ref            pointer to the raw payload in encrypted local storage, never synced by default
```

Derived objects reference measurements, never copy values:

```
MetricEstimate   one current best value per metric, with the list of measurement ids it came from and the rule used
StatValue        one 0-100 percentile per stat, with the metric estimates, norm table version per metric,
                 confidence and the engine version that computed it
Claim            a threshold statement over stat values or metric estimates (see below), signed together
                 with the engine version that evaluated it
```

## Resolving disagreement between sources

Garmin says VO₂max 52, Apple Health says 48, the user ran a Cooper test that implies 50. Rule set: **[decision]**

1. Prefer the highest trust level.
2. Within the same trust level, prefer the most recent within a metric-specific window (VO₂max: 30 days; steps: same day; grip: 90 days).
3. If sources at the same trust level disagree beyond the metric's tolerance, keep the preferred one, lower its confidence, and show the disagreement to the user ("Two devices disagree by 4 points; your Aerobic stat uses the Garmin value with reduced confidence").
4. Never average across trust levels. Averaging a lab value with a guess is how numbers become lies.

## Confidence into stats

A stat's displayed value is the percentile of its best estimate. Its confidence is the minimum of its constituent confidences weighted by contribution. Below a confidence floor the stat renders as a **range** ("Aerobic 60–72") instead of a point, and below a second floor as **unmeasured**. The character sheet is allowed to be honest about not knowing. **[decision]**

## Claims

A claim is the unit of sharing. It is a predicate over the user's data that is true or false, with provenance attached:

```
Claim
  id
  subject            pseudonymous user key
  predicate          e.g. { metric: "vo2max", op: ">=", threshold: 50, unit: "ml/kg/min" }
                       or { stat: "aerobic", op: ">=", percentile: 70 }
  evidence_trust     minimum trust level among the measurements that satisfy it
  evidence_sources   ["garmin"]            (vendors, never record ids)
  valid_from / valid_until
  issued_by          MINMAX issuer key
  signature
```

Claims are what the public profile shows, what a challenge checks, and what an insurer or coach would receive. They are deliberately coarse. A claim never contains the raw value, the device id, timestamps finer than a day, or anything that lets a verifier reconstruct the measurement series.

Two honesty rules decide whether a claim may be issued at all (`research/normative-data.md`): **[decision]**

- **A claim must beat the measurement error, not only the threshold.** Below clinical trust the value minus one error margin has to clear the threshold; a wrist VO₂max of 46 does not certify "≥ 45". Until per-vendor error bars are wired in, the metric's tolerance stands in for the margin.
- **Stat claims stop where the reference tables stop.** Published norms resolve the tail to the 95th percentile at best (grip strength only to the 90th). Percentiles beyond that are a modelled extrapolation, shown to the user as such but never certified, so "Top 1 %" is not a claim MINMAX issues until a table supports it.

## Phased proof architecture

| Phase | What ships | What it proves | Dependency |
|---|---|---|---|
| **0 · MVP** | Provenance fields on every measurement; claims signed by MINMAX's server key; a verification page `minmax.app/v/<claim-id>` that shows the predicate, trust level and issuance date | "MINMAX attests that this user satisfied the predicate based on source X" | None |
| **1 · Portable credentials** | Claims issued as W3C Verifiable Credentials (SD-JWT VC or Data Integrity with BBS), held in the app's wallet, presented by QR or deep link; verifier checks MINMAX's public key | Same attestation, but the user carries it and chooses what to disclose per presentation | Standards libraries only |
| **2 · Client-side proofs** | Threshold proofs generated on the phone from the local measurement set, so even MINMAX's server need not see the raw value | "A value signed by source X satisfies the predicate" without revealing the value to anyone | Mobile ZK toolchain maturity |
| **3 · Public verifiability** | Claims anchored or verified on a privacy-preserving network (Midnight was the founder's candidate) so a verifier does not have to trust MINMAX's server at all | Trustless verification | Network maturity, legal analysis of ledger immutability vs erasure |

Phase 0 is in the MVP. Phases 1–3 each get a go/no-go decision based on demand from actual verifiers (insurer programs, challenges, coaches). The research report `research/midnight-zk.md` assesses the current state of each option.

## The attestation gap

The hardest unsolved piece is proving that a value really came from Garmin rather than from a tampered app or a replayed payload. Options, in order of practicality:

1. **App integrity**: Apple App Attest and Google Play Integrity prove the claim was produced by an unmodified MINMAX build. Cheap, available now, included in Phase 0's threat model.
2. **Server-side ingestion**: for vendor APIs that push to MINMAX's server (Garmin, Oura, Polar, Whoop), the server is the witness; the raw value can be hashed and discarded while the claim is minted. Available now.
3. **zkTLS-style attestation** (Reclaim, Opacity, TLSNotary): cryptographic proof of what a vendor API returned, without the vendor's cooperation. Promising, evaluated in Phase 2.
4. **Vendor-signed data**: would be ideal; no major vendor does it for consumer APIs today as far as we know.

Until (3) or (4) is real, "device-verified" honestly means "authenticated vendor account plus unmodified app", and the UI says so in the detail view.

## Privacy posture

- Raw payloads stay on device, encrypted, and are not synced by default. Sync carries measurements without `raw_ref` and is end-to-end encrypted where the stack allows.
- Stats and claims are computed on device when possible; the server computes only for server-ingested vendor data and for claims that need a server signature.
- Health data is never used for advertising, never sold, never shared with a third party except as a user-initiated claim presentation. This is both a principle and an App Store requirement.
- Users can export and delete everything. Deletion propagates to issued claims by revocation lists, which is why Phase 3's immutability question needs legal analysis before any ledger is used.

## What this enables in the game

- Leaderboards that rank **claims**, not values, so nobody has to publish their VO₂max to compete.
- Verified-only challenges ("device-verified Aerobic ≥ 60th percentile to enter").
- A trust badge on every stat that tells the user how much to believe their own number, which is itself a nudge to measure better: importing a device or taking an in-app test is a quest.

## Implementation note for the core package

The domain package will expose: `Measurement`, `TrustLevel`, `Source`, `MetricEstimate`, `StatValue`, `Claim`, the resolution rules above as pure functions, and a `ClaimIssuer` interface with a Phase-0 implementation (server signature) and stubs for later phases. No vendor SDK and no network code lives in the core.
