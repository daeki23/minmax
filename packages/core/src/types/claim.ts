import type { Source, TrustLevel } from "./measurement.js";
import type { Metric } from "./metric.js";
import type { StatId } from "./stat.js";

export type ComparisonOp = ">=" | "<=";

/**
 * A predicate is the unit of sharing: a coarse threshold statement, never a value.
 * See docs/03-data-provenance.md "Claims".
 */
export type Predicate =
  | {
      readonly kind: "metric";
      readonly metric: Metric;
      readonly op: ComparisonOp;
      readonly threshold: number;
      readonly unit: string;
    }
  | { readonly kind: "stat"; readonly stat: StatId; readonly op: ">="; readonly percentile: number }
  | { readonly kind: "level"; readonly op: ">="; readonly level: number };

export interface UnsignedClaim {
  readonly id: string;
  /** Pseudonymous subject key, never the user id. */
  readonly subject: string;
  readonly predicate: Predicate;
  /** Minimum trust level among the measurements that satisfy the predicate. */
  readonly evidenceTrust: TrustLevel;
  /** Vendors only, never record ids. */
  readonly evidenceSources: readonly Source[];
  /** ISO dates at day resolution. */
  readonly validFrom: string;
  readonly validUntil: string;
  readonly issuedAt: string;
  readonly issuer: string;
  readonly schema: "minmax.claim.v0";
}

export interface Claim extends UnsignedClaim {
  readonly signature: string;
  readonly signatureAlg: string;
}

/**
 * Injected by the host. The core never does crypto itself and never touches bytes:
 * the payload is canonical JSON (a string); the host encodes it (UTF-8) and signs.
 */
export interface Signer {
  readonly alg: string;
  readonly keyId: string;
  sign(canonicalPayload: string): Promise<string>;
}

export interface Verifier {
  readonly alg: string;
  verify(canonicalPayload: string, signature: string, keyId: string): Promise<boolean>;
}
