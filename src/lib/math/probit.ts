/* -------------------------------------------------------------------------- */
/* Probit link and comparison with logistic link                              */
/* -------------------------------------------------------------------------- */

const EPS = 1e-12;
const SQRT2 = Math.sqrt(2);
const SQRT_PI = Math.sqrt(Math.PI);
const SQRT_2PI = Math.sqrt(2 * Math.PI);

/**
 * Scaling factor that makes the probit slope at a=0 equal to the sigmoid
 * slope at a=0 (which is 1/4).
 */
export const DEFAULT_LAMBDA = Math.sqrt(Math.PI / 8);

/**
 * Numerically stable sigmoid.
 */
export function sigmoid(a: number): number {
  if (a >= 0) {
    const e = Math.exp(-a);
    return 1 / (1 + e);
  }
  const e = Math.exp(a);
  return e / (1 + e);
}

/**
 * Standard normal probability density function φ(a).
 */
export function normalPdf(a: number): number {
  return Math.exp(-0.5 * a * a) / SQRT_2PI;
}

/**
 * Error function approximation (Abramowitz & Stegun formula 7.1.26).
 * Accurate to about 1.5e-7 for moderate |x|.
 */
function erf(x: number): number {
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + p * ax);
  const poly = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
  const y = 1 - poly * Math.exp(-ax * ax);
  return sign * y;
}

/**
 * Asymptotic expansion of the complementary error function for large z>0.
 *
 *   erfc(z) ~ exp(-z^2) / (z sqrt(pi))
 *             * (1 - 1/(2z^2) + 3/(4z^4) - 15/(8z^6) + ...)
 */
function erfcAsymptotic(z: number): number {
  const z2 = z * z;
  const z4 = z2 * z2;
  const z6 = z4 * z2;
  const series = 1 - 1 / (2 * z2) + 3 / (4 * z4) - 15 / (8 * z6);
  return (Math.exp(-z2) / (z * SQRT_PI)) * series;
}

/**
 * Standard normal cumulative distribution function Φ(a).
 *
 * Uses the erf approximation near the origin and an asymptotic expansion
 * in the tails to keep relative accuracy for large |a|.
 */
export function normalCDF(a: number): number {
  const x = a / SQRT2;
  const ax = Math.abs(x);

  let y: number;
  if (ax <= 3.5) {
    // Erf approximation is accurate in the central region.
    y = 0.5 * (1 + erf(x));
  } else {
    // Tail: use erfc asymptotic expansion.
    // For a > 0: Φ(a) = 1 - 0.5 * erfc(|x|)
    // For a < 0: Φ(a) = 0.5 * erfc(|x|)
    const erfc = erfcAsymptotic(ax);
    y = a > 0 ? 1 - 0.5 * erfc : 0.5 * erfc;
  }

  return Math.max(0, Math.min(1, y));
}

/**
 * Scaled probit link Φ(λ a).
 *
 * With λ = sqrt(pi/8) the slope at a=0 matches the sigmoid slope (1/4).
 */
export function scaledProbit(a: number, lambda: number = DEFAULT_LAMBDA): number {
  return normalCDF(lambda * a);
}

/**
 * Logistic loss for a binary label y ∈ {0, 1}.
 */
export function logisticLoss(y: 0 | 1, a: number): number {
  const s = sigmoid(a);
  if (y === 1) {
    return -Math.log(Math.max(s, EPS));
  }
  return -Math.log(Math.max(1 - s, EPS));
}

/**
 * Probit loss for a binary label y ∈ {0, 1}.
 */
export function probitLoss(y: 0 | 1, a: number): number {
  const p = normalCDF(a);
  if (y === 1) {
    return -Math.log(Math.max(p, EPS));
  }
  return -Math.log(Math.max(1 - p, EPS));
}

/**
 * Gradient of the logistic loss with respect to the linear predictor a.
 *
 *   y=1: σ(a) - 1
 *   y=0: σ(a)
 */
export function logisticGradient(y: 0 | 1, a: number): number {
  const s = sigmoid(a);
  return y === 1 ? s - 1 : s;
}

/**
 * Mills ratio for the lower tail: φ(t)/Φ(-t) for t > 0.
 *
 * Uses the asymptotic expansion
 *   φ(t)/Φ(-t) = t / (1 - 1/t² + 3/t⁴ - 15/t⁶ + O(t⁻⁸)).
 */
function millsRatioTail(t: number): number {
  const t2 = t * t;
  const t4 = t2 * t2;
  const t6 = t4 * t2;
  const denom = 1 - 1 / t2 + 3 / t4 - 15 / t6;
  return t / denom;
}

/**
 * Gradient of the probit loss with respect to the linear predictor a.
 *
 *   y=1: -φ(a) / Φ(a)
 *   y=0:  φ(a) / (1 - Φ(a))
 *
 * In the tails the direct ratio loses accuracy, so we use the Mills-ratio
 * asymptotic expansion for |a| > 3.
 */
export function probitGradient(y: 0 | 1, a: number): number {
  if (y === 1) {
    if (a < -3) {
      return -millsRatioTail(-a);
    }
    const p = normalCDF(a);
    const phi = normalPdf(a);
    return -phi / Math.max(p, EPS);
  }
  if (a > 3) {
    return millsRatioTail(a);
  }
  const p = normalCDF(a);
  const phi = normalPdf(a);
  return phi / Math.max(1 - p, EPS);
}
