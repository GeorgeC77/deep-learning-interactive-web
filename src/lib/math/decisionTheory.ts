/* -------------------------------------------------------------------------- */
/* Decision theory for regression: posterior + loss → optimal prediction       */
/* -------------------------------------------------------------------------- */

export type DensityFunction = (t: number) => number;

export interface PosteriorDistribution {
  density: DensityFunction;
  samples?: number[];
}

export type LossFunction = (t: number, y: number) => number;

const DEFAULT_INTEGRATION_STEPS = 1000;
const DEFAULT_OPTIMAL_STEPS = 1000;

function gaussianPDF(t: number, mean: number, sigma: number): number {
  const z = (t - mean) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/**
 * Generate deterministic samples from a posterior for plotting.
 */
function sampleGrid(
  density: DensityFunction,
  tMin: number,
  tMax: number,
  steps = 400,
): number[] {
  const pts: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = tMin + ((tMax - tMin) * i) / steps;
    pts.push(density(t));
  }
  return pts;
}

/**
 * Symmetric Gaussian posterior p(t) = N(t | mean, sigma^2).
 */
export function symmetricGaussian(
  mean: number,
  sigma: number,
): PosteriorDistribution {
  const density = (t: number) => gaussianPDF(t, mean, sigma);
  return {
    density,
    samples: sampleGrid(density, mean - 4 * sigma, mean + 4 * sigma),
  };
}

/**
 * Skewed mixture posterior: weight1 * N(mean1, sigma1^2) +
 * (1 - weight1) * N(mean2, sigma2^2).
 */
export function skewedMixture(
  mean1: number,
  sigma1: number,
  mean2: number,
  sigma2: number,
  weight1: number,
): PosteriorDistribution {
  const w1 = Math.max(0, Math.min(1, weight1));
  const w2 = 1 - w1;
  const density = (t: number) =>
    w1 * gaussianPDF(t, mean1, sigma1) + w2 * gaussianPDF(t, mean2, sigma2);

  const tMin = Math.min(mean1 - 4 * sigma1, mean2 - 4 * sigma2);
  const tMax = Math.max(mean1 + 4 * sigma1, mean2 + 4 * sigma2);
  return { density, samples: sampleGrid(density, tMin, tMax) };
}

/**
 * Gaussian with an outlier component:
 * (1 - outlierWeight) * N(mainMean, mainSigma^2) +
 * outlierWeight * N(outlierMean, outlierSigma^2).
 */
export function distributionWithOutliers(
  mainMean: number,
  mainSigma: number,
  outlierMean: number,
  outlierSigma: number,
  outlierWeight: number,
): PosteriorDistribution {
  const wo = Math.max(0, Math.min(1, outlierWeight));
  const wm = 1 - wo;
  const density = (t: number) =>
    wm * gaussianPDF(t, mainMean, mainSigma) +
    wo * gaussianPDF(t, outlierMean, outlierSigma);

  const tMin = Math.min(mainMean - 4 * mainSigma, outlierMean - 4 * outlierSigma);
  const tMax = Math.max(mainMean + 4 * mainSigma, outlierMean + 4 * outlierSigma);
  return { density, samples: sampleGrid(density, tMin, tMax) };
}

/* -------------------------------------------------------------------------- */
/* Loss functions                                                              */
/* -------------------------------------------------------------------------- */

export function squaredLoss(t: number, y: number): number {
  const d = t - y;
  return d * d;
}

export function absoluteLoss(t: number, y: number): number {
  return Math.abs(t - y);
}

/**
 * Asymmetric absolute loss: alpha * |t - y| if y < t, else |t - y|.
 */
export function asymmetricAbsoluteLoss(
  t: number,
  y: number,
  alpha: number,
): number {
  return y < t ? alpha * Math.abs(t - y) : Math.abs(t - y);
}

/**
 * Zero-one interval loss: 0 if |t - y| <= delta, else 1.
 */
export function zeroOneIntervalLoss(
  t: number,
  y: number,
  delta: number,
): number {
  return Math.abs(t - y) <= delta ? 0 : 1;
}

/* -------------------------------------------------------------------------- */
/* Numerical utilities                                                           */
/* -------------------------------------------------------------------------- */

function integrate(
  fn: (t: number) => number,
  tMin: number,
  tMax: number,
  steps: number,
): number {
  if (tMin >= tMax || steps <= 0) return 0;
  const dt = (tMax - tMin) / steps;
  let sum = 0.5 * (fn(tMin) + fn(tMax));
  for (let i = 1; i < steps; i++) {
    sum += fn(tMin + i * dt);
  }
  return sum * dt;
}

function normalizeDensity(
  density: DensityFunction,
  tMin: number,
  tMax: number,
  steps = DEFAULT_INTEGRATION_STEPS,
): number {
  const z = integrate(density, tMin, tMax, steps);
  return z === 0 ? 1 : z;
}

/**
 * Expected risk R(y) = E_{t~p}[loss(t, y)].
 */
export function expectedRisk(
  posteriorFn: DensityFunction,
  y: number,
  lossFn: LossFunction,
  tMin: number,
  tMax: number,
  steps = DEFAULT_INTEGRATION_STEPS,
): number {
  const z = normalizeDensity(posteriorFn, tMin, tMax, steps);
  const integrand = (t: number) => (posteriorFn(t) / z) * lossFn(t, y);
  return integrate(integrand, tMin, tMax, steps);
}

/**
 * Grid-search for the prediction y that minimizes expected risk.
 *
 * Uses a coarse global scan followed by a finer local scan around the best
 * coarse point for better accuracy without excessive cost.
 */
export function optimalY(
  posteriorFn: DensityFunction,
  lossFn: LossFunction,
  tMin: number,
  tMax: number,
  yMin: number = tMin,
  yMax: number = tMax,
  steps = DEFAULT_OPTIMAL_STEPS,
): number {
  if (steps <= 0 || yMin >= yMax) return (yMin + yMax) / 2;

  const coarseSteps = Math.min(steps, 400);
  const dy = (yMax - yMin) / coarseSteps;
  let bestY = yMin;
  let bestRisk = Infinity;

  for (let i = 0; i <= coarseSteps; i++) {
    const y = yMin + i * dy;
    const risk = expectedRisk(posteriorFn, y, lossFn, tMin, tMax);
    if (risk < bestRisk) {
      bestRisk = risk;
      bestY = y;
    }
  }

  // Fine local refinement in a window around the best coarse point.
  const window = Math.max(dy, 2 * ((yMax - yMin) / Math.max(steps, 1000)));
  const localMin = Math.max(yMin, bestY - window);
  const localMax = Math.min(yMax, bestY + window);
  const fineSteps = Math.max(steps - coarseSteps, 200);
  const localDy = (localMax - localMin) / fineSteps;

  for (let i = 0; i <= fineSteps; i++) {
    const y = localMin + i * localDy;
    const risk = expectedRisk(posteriorFn, y, lossFn, tMin, tMax);
    if (risk < bestRisk) {
      bestRisk = risk;
      bestY = y;
    }
  }

  return bestY;
}

/**
 * Posterior mean E[t].
 */
export function posteriorMean(
  posteriorFn: DensityFunction,
  tMin: number,
  tMax: number,
  steps = DEFAULT_INTEGRATION_STEPS,
): number {
  const z = normalizeDensity(posteriorFn, tMin, tMax, steps);
  const integrand = (t: number) => (t * posteriorFn(t)) / z;
  return integrate(integrand, tMin, tMax, steps);
}

/**
 * Posterior median: the value m with P(t <= m) = 0.5.
 */
export function posteriorMedian(
  posteriorFn: DensityFunction,
  tMin: number,
  tMax: number,
  steps = DEFAULT_INTEGRATION_STEPS,
): number {
  const z = normalizeDensity(posteriorFn, tMin, tMax, steps);
  const dt = (tMax - tMin) / steps;
  let prevCdf = 0;
  let prevT = tMin;

  for (let i = 0; i <= steps; i++) {
    const t = tMin + i * dt;
    const p = posteriorFn(t) / z;
    const cdf =
      i === 0 ? 0 : prevCdf + ((p + posteriorFn(prevT) / z) * dt) / 2;
    if (cdf >= 0.5) {
      const frac = (0.5 - prevCdf) / (cdf - prevCdf || 1);
      return prevT + frac * (t - prevT);
    }
    prevCdf = cdf;
    prevT = t;
  }
  return tMax;
}

/**
 * Posterior mode: the t with maximum density.
 */
export function posteriorMode(
  posteriorFn: DensityFunction,
  tMin: number,
  tMax: number,
  steps = DEFAULT_INTEGRATION_STEPS,
): number {
  let bestT = tMin;
  let bestP = -Infinity;
  for (let i = 0; i <= steps; i++) {
    const t = tMin + ((tMax - tMin) * i) / steps;
    const p = posteriorFn(t);
    if (p > bestP) {
      bestP = p;
      bestT = t;
    }
  }
  return bestT;
}
