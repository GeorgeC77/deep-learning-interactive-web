/* -------------------------------------------------------------------------- */
/* Cost-sensitive classification decision theory                               */
/* -------------------------------------------------------------------------- */

export type Action = 'positive' | 'negative';

/**
 * Expected risk of predicting positive given posterior p = P(class = 1 | x).
 *
 *   R(positive) = cFP * (1 - p)
 */
export function riskPositive(
  p: number,
  cFP: number,
  cFN: number,
): number {
  void cFN;
  return cFP * (1 - p);
}

/**
 * Expected risk of predicting negative given posterior p = P(class = 1 | x).
 *
 *   R(negative) = cFN * p
 */
export function riskNegative(
  p: number,
  cFP: number,
  cFN: number,
): number {
  void cFP;
  return cFN * p;
}

/**
 * Probability threshold that equalizes the two risks.
 *
 *   p* = cFP / (cFP + cFN)
 */
export function optimalThreshold(cFP: number, cFN: number): number {
  const denom = cFP + cFN;
  if (denom === 0) return 0.5;
  return cFP / denom;
}

/**
 * Log-odds decision threshold.
 *
 *   ln(cFP / cFN)
 */
export function logOddsThreshold(cFP: number, cFN: number): number {
  if (cFN === 0) return Infinity;
  return Math.log(cFP / cFN);
}

/**
 * Choose the action with smaller expected risk.
 */
export function optimalAction(
  p: number,
  cFP: number,
  cFN: number,
): Action {
  return riskPositive(p, cFP, cFN) <= riskNegative(p, cFP, cFN)
    ? 'positive'
    : 'negative';
}
