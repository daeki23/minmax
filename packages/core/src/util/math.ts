export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

export function mean(xs: readonly number[]): number {
  if (xs.length === 0) throw new Error("mean of empty list");
  let s = 0;
  for (const x of xs) s += x;
  return s / xs.length;
}

export function weightedMean(pairs: readonly (readonly [value: number, weight: number])[]): number {
  let num = 0;
  let den = 0;
  for (const [v, w] of pairs) {
    num += v * w;
    den += w;
  }
  if (den === 0) throw new Error("weightedMean with zero total weight");
  return num / den;
}

export function round(x: number, digits = 0): number {
  const f = 10 ** digits;
  return Math.round(x * f) / f;
}

/**
 * Integer with "," thousands separators, e.g. 8420 → "8,420". Written out instead of
 * `toLocaleString` so the engine has no dependency on an Intl implementation (Hermes, Dart ports).
 */
export function groupThousands(n: number): string {
  const sign = n < 0 ? "-" : "";
  const digits = String(Math.round(Math.abs(n)));
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ",";
    out += digits[i];
  }
  return sign + out;
}

/**
 * Piecewise-linear interpolation of y at x over sorted knots.
 * Outside the knot range the nearest y is returned (no extrapolation).
 */
export function interpolate(knots: readonly (readonly [x: number, y: number])[], x: number): number {
  if (knots.length === 0) throw new Error("interpolate with no knots");
  const first = knots[0] as readonly [number, number];
  const last = knots[knots.length - 1] as readonly [number, number];
  if (x <= first[0]) return first[1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < knots.length; i++) {
    const [x0, y0] = knots[i - 1] as readonly [number, number];
    const [x1, y1] = knots[i] as readonly [number, number];
    if (x <= x1) {
      if (x1 === x0) return y1;
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return last[1];
}
