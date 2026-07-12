/* -------------------------------------------------------------------------- */
/* ROC / AUC math                                                             */
/* -------------------------------------------------------------------------- */

import { boxMuller, mulberry32 } from './diffusion';

export type ROCPoint = {
  tpr: number;
  fpr: number;
  threshold: number;
};

export type ScoreDistributions = {
  negScores: number[];
  posScores: number[];
};

/**
 * Standard normal CDF using the Abramowitz & Stegun erf approximation.
 *
 * The rational approximation is for erf(z), so we evaluate it at z = x / sqrt(2)
 * and return 0.5 * (1 + erf(z)).
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const z = x / Math.sqrt(2);
  const sign = z >= 0 ? 1 : -1;
  const t = 1 / (1 + p * Math.abs(z));
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-z * z);

  return 0.5 * (1 + sign * y);
}

/**
 * Generate N negative and N positive scores from two normal distributions.
 *
 *   delta = 3 * (1 - overlap) + 0.1
 *   negMean = -delta / 2
 *   posMean =  delta / 2
 *   std     = 1
 */
export function genScores(
  N: number,
  seed: number,
  overlap: number,
): ScoreDistributions {
  const rng = mulberry32(seed);
  const delta = 3 * (1 - overlap) + 0.1;
  const negMean = -delta / 2;
  const posMean = delta / 2;
  const std = 1;

  const negScores: number[] = [];
  const posScores: number[] = [];

  for (let i = 0; i < N; i++) {
    negScores.push(negMean + boxMuller(rng) * std);
    posScores.push(posMean + boxMuller(rng) * std);
  }

  return { negScores, posScores };
}

/**
 * Theoretical AUC for two equally-variable normal distributions.
 *
 *   AUC = Φ((posMean - negMean) / (sqrt(2) * std))
 */
export function theoreticalAUC(overlap: number): number {
  const delta = 3 * (1 - overlap) + 0.1;
  return normalCDF(delta / (Math.sqrt(2) * 1));
}

/**
 * Compute an empirical ROC curve over a regular threshold grid.
 *
 * The returned array always starts at (FPR=0, TPR=0) and ends at (FPR=1, TPR=1).
 */
export function computeROC(
  negScores: number[],
  posScores: number[],
  numPoints: number,
): ROCPoint[] {
  const allScores = [...negScores, ...posScores];
  const minScore = Math.min(...allScores) - 0.5;
  const maxScore = Math.max(...allScores) + 0.5;

  const Nneg = negScores.length;
  const Npos = posScores.length;
  const points: ROCPoint[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const threshold = maxScore - (maxScore - minScore) * (i / numPoints);

    let tp = 0;
    for (const s of posScores) {
      if (s >= threshold) tp++;
    }

    let fp = 0;
    for (const s of negScores) {
      if (s >= threshold) fp++;
    }

    points.push({
      tpr: tp / Npos,
      fpr: fp / Nneg,
      threshold,
    });
  }

  return points;
}

/**
 * Compute the area under an ROC curve using the trapezoidal rule.
 *
 * Assumes the curve is sorted by increasing FPR.
 */
export function computeAUC(roc: ROCPoint[]): number {
  let auc = 0;
  for (let i = 1; i < roc.length; i++) {
    auc +=
      ((roc[i].fpr - roc[i - 1].fpr) *
        (roc[i].tpr + roc[i - 1].tpr)) /
      2;
  }
  return auc;
}

/**
 * Exact empirical AUC using the Mann-Whitney U statistic.
 * AUC = P(score_positive > score_negative).
 */
export function empiricalAUC(
  negScores: number[],
  posScores: number[],
): number {
  const labeled = [
    ...negScores.map((s) => ({ s, label: 0 as const })),
    ...posScores.map((s) => ({ s, label: 1 as const })),
  ].sort((a, b) => a.s - b.s);

  let rankSum = 0;
  labeled.forEach((item, idx) => {
    if (item.label === 1) rankSum += idx + 1;
  });

  const nPos = posScores.length;
  const nNeg = negScores.length;
  if (nPos === 0 || nNeg === 0) return 0.5;
  return (rankSum - (nPos * (nPos + 1)) / 2) / (nPos * nNeg);
}
