/**
 * Standard normal helpers for probit-space interpolation of percentile tables.
 * Interpolating in z rather than in percentile keeps the tails honest: the distance between the
 * 90th and 95th percentile is much larger in metric units than between the 50th and 55th.
 */

/** Standard normal CDF Φ(z), via the complementary error function (Abramowitz & Stegun 7.1.26). */
export function normalCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2; // Φ(z) = ½(1 + erf(z/√2))
  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erfAbs = 1 - poly * Math.exp(-x * x);
  return 0.5 * (1 + (z < 0 ? -erfAbs : erfAbs));
}

/**
 * Inverse standard normal CDF (Acklam's rational approximation, |rel. error| < 1.15e-9),
 * refined with one Newton step. p must be strictly inside (0, 1).
 */
export function probit(p: number): number {
  if (!(p > 0 && p < 1)) throw new RangeError(`probit: p must be in (0,1), got ${p}`);
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1,
    2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968,
    2.938163982698783,
  ];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pLow = 0.02425;
  let x: number;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = poly(c, q) / (poly(d, q) * q + 1);
  } else if (p <= 1 - pLow) {
    const q = p - 0.5;
    const r = q * q;
    x = (poly(a, r) * q) / (poly(b, r) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -poly(c, q) / (poly(d, q) * q + 1);
  }
  // One Newton refinement step.
  const e = normalCdf(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

function poly(coef: readonly number[], x: number): number {
  let acc = 0;
  for (const k of coef) acc = acc * x + k;
  return acc;
}

/** Percentile (0-100, exclusive) → z. */
export function percentileToZ(pct: number): number {
  return probit(pct / 100);
}

/** z → percentile (0-100). */
export function zToPercentile(z: number): number {
  return 100 * normalCdf(z);
}
