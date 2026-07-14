/* -------------------------------------------------------------------------- */
/* Model averaging: variance reduction with correlated errors                 */
/* -------------------------------------------------------------------------- */

/**
 * Minimum feasible average pairwise correlation for an ensemble of M models
 * with equal individual variance. The averaged-error variance stays non-negative
 * exactly when rho >= -1/(M-1) (for M > 1). For M <= 1 the correlation is
 * irrelevant and we return -1 as a harmless lower bound.
 */
export function minimumFeasibleCorrelation(M: number): number {
  if (M <= 1) return -1;
  return -1 / (M - 1);
}

/**
 * Check whether a given average pairwise correlation is feasible for M models.
 */
export function isFeasibleRho(M: number, rho: number): boolean {
  return rho >= minimumFeasibleCorrelation(M) && rho <= 1;
}

/**
 * Variance of the average prediction error for an ensemble of M correlated models.
 *
 * Each individual model has error variance sigma^2 and the pairwise correlation
 * between any two model errors is rho. The ensemble-average error variance is:
 *
 *   Var(error_bar) = sigma^2 * (rho + (1 - rho) / M)
 */
export function ensembleVariance(sigma: number, M: number, rho: number): number {
  return sigma * sigma * (rho + (1 - rho) / M);
}

/**
 * Standard deviation of the ensemble-average error.
 */
export function ensembleStd(sigma: number, M: number, rho: number): number {
  return sigma * Math.sqrt(rho + (1 - rho) / M);
}

/**
 * Variance reduction obtained by adding the (M+1)-th model to an ensemble of size M.
 *
 *   gain(M) = Var(error_bar_M) - Var(error_bar_{M+1})
 */
export function marginalGain(sigma: number, M: number, rho: number): number {
  return ensembleVariance(sigma, M, rho) - ensembleVariance(sigma, M + 1, rho);
}

/**
 * Asymptotic ensemble variance as M -> infinity.
 *
 *   Var(error_bar_infty) = sigma^2 * rho
 */
export function limitingVariance(sigma: number, rho: number): number {
  return sigma * sigma * rho;
}
