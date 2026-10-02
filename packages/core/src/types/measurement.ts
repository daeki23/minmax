import type { Metric } from "./metric.js";

/**
 * Trust levels, from the founder's model. See docs/03-data-provenance.md.
 * 0 self-reported · 1 app-recorded · 2 device-verified · 3 clinical/lab
 */
export type TrustLevel = 0 | 1 | 2 | 3;

export const TRUST_LABEL: Readonly<Record<TrustLevel, string>> = {
  0: "self-reported",
  1: "app-recorded",
  2: "device-verified",
  3: "lab-verified",
};

export const SOURCES = [
  "self",
  "minmax_app",
  "apple_health",
  "health_connect",
  "garmin",
  "oura",
  "polar",
  "whoop",
  "fitbit",
  "withings",
  "coros",
  "suunto",
  "lab",
  "clinic",
  "aggregator",
] as const;

export type Source = (typeof SOURCES)[number];

/** Default trust level a source can grant on its own. A lab PDF typed in by the user is still self-reported. */
export const SOURCE_DEFAULT_TRUST: Readonly<Record<Source, TrustLevel>> = {
  self: 0,
  minmax_app: 1,
  apple_health: 2,
  health_connect: 2,
  garmin: 2,
  oura: 2,
  polar: 2,
  whoop: 2,
  fitbit: 2,
  withings: 2,
  coros: 2,
  suunto: 2,
  lab: 3,
  clinic: 3,
  aggregator: 2,
};

/**
 * How a value reached MINMAX, independent of who produced it. "Garmin via Apple Health" and
 * "Oura via the Oura API" are both device-verified, but the trust detail view and claims must be able
 * to tell them apart. See docs/05-architecture.md (Integrations layer).
 */
export const INGEST_PATHS = [
  "device_direct", // the vendor's own SDK or API, server- or app-side
  "apple_health",
  "health_connect",
  "aggregator",
  "in_app", // recorded by MINMAX itself (tests, sessions)
  "manual", // typed in by the user
  "import", // file import (CSV, lab PDF)
] as const;

export type IngestPath = (typeof INGEST_PATHS)[number];

export type Verification =
  | "unverified" // nothing beyond the value itself
  | "source_authenticated" // came through an authenticated vendor account or platform store
  | "corroborated" // two or more independent sources agree
  | "attested"; // cryptographic attestation of origin (later phases)

export interface Device {
  readonly vendor: string;
  readonly model: string;
  readonly firmware?: string;
}

export interface Measurement {
  readonly id: string;
  readonly userId: string;
  readonly metric: Metric;
  readonly value: number;
  readonly unit: string;
  /** When the body was measured (ISO 8601). */
  readonly measuredAt: string;
  /** When MINMAX received it (ISO 8601). */
  readonly recordedAt: string;
  readonly source: Source;
  /** Ingest path; omitted means the source's own path. */
  readonly via?: IngestPath;
  readonly sourceRecordId?: string;
  readonly device?: Device;
  /** How the value was produced, e.g. "firstbeat_estimate", "cpet", "cooper_12min", "manual_entry". */
  readonly method?: string;
  readonly trustLevel: TrustLevel;
  /** 0..1 prior belief that the value reflects the body, before corroboration. */
  readonly confidence: number;
  readonly verification: Verification;
  readonly context?: Readonly<Record<string, string | number | boolean>>;
  /** Pointer to the encrypted raw payload on device. Never synced by default. */
  readonly rawRef?: string;
}

export interface UserProfile {
  readonly userId: string;
  /** Biological sex used for normative tables. "unspecified" falls back to pooled tables where available. */
  readonly sex: "female" | "male" | "unspecified";
  /** Age in whole years at the time of computation. */
  readonly age: number;
}
