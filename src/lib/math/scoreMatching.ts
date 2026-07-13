/* -------------------------------------------------------------------------- */
/* Score matching lab math                                                    */
/*                                                                            */
/* Implements the diffusion forward corruption score identity:                */
/*   ∇_{z_t} log q(z_t | x) = -ε / sqrt(1 - ᾱ_t)                              */
/* and its Monte-Carlo approximation to the marginal score:                   */
/*   ∇_{z_t} log q_t(z_t) ≈ -E[ε | z_t] / sqrt(1 - ᾱ_t)                       */
/* -------------------------------------------------------------------------- */

import {
  alphaBar as diffusionAlphaBar,
  boxMuller,
  generateGaussianNoise,
  makeBetaSchedule,
  mulberry32,
} from './diffusion';

export type ScheduleType = 'linear' | 'cosine';

/** Fixed 2D Gaussian mixture used to generate the lab's clean dataset. */
export const SCORE_MIXTURE_MEANS = [
  [-2, -2],
  [2, 2],
  [0, 3],
] as const;

export const SCORE_MIXTURE_WEIGHTS = [0.4, 0.4, 0.2] as const;

/* -------------------------------------------------------------------------- */
/* Noise schedules                                                            */
/* -------------------------------------------------------------------------- */

/** ᾱ_t for a linear β schedule from betaStart to betaEnd over T steps. */
export function linearAlphaBar(
  t: number,
  T: number,
  betaStart = 1e-4,
  betaEnd = 0.02,
): number {
  const betas = makeBetaSchedule(T, betaStart, betaEnd);
  return diffusionAlphaBar(t, betas);
}

/** ᾱ_t for a cosine schedule (Nichol & Dhariwal, improved DDPM). */
export function cosineAlphaBar(t: number, T: number): number {
  const s = 0.008;
  const alphaBar0 = Math.cos((s / (1 + s)) * (Math.PI / 2)) ** 2;
  const tNorm = (t / T + s) / (1 + s);
  return Math.cos(tNorm * (Math.PI / 2)) ** 2 / alphaBar0;
}

/** Return the selected ᾱ schedule as a function of t. */
export function getAlphaBar(
  schedule: ScheduleType,
  T: number,
): (t: number) => number {
  return schedule === 'cosine'
    ? (t: number) => cosineAlphaBar(t, T)
    : (t: number) => linearAlphaBar(t, T);
}

/* -------------------------------------------------------------------------- */
/* Core score functions                                                       */
/* -------------------------------------------------------------------------- */

/** Forward corruption: z_t = sqrt(ᾱ_t) x + sqrt(1 - ᾱ_t) ε. */
export function corrupt(
  x: number[],
  epsilon: number[],
  alphaBar: number,
): number[] {
  const sqrtAb = Math.sqrt(Math.max(alphaBar, 0));
  const sqrt1mAb = Math.sqrt(Math.max(1 - alphaBar, 0));
  return x.map((v, i) => sqrtAb * v + sqrt1mAb * epsilon[i]);
}

/**
 * Conditional corruption score.
 *   ∇_{z_t} log q(z_t | x) = -ε / sqrt(1 - ᾱ_t)
 * x and t are accepted for API consistency and pedagogical clarity.
 */
export function conditionalScore(
  x: number[],
  epsilon: number[],
  t: number,
  alphaBar: number,
): number[] {
  // x defines the conditioning event and is kept for API clarity.
  void x;
  return scoreFromPredictedEpsilon(epsilon, t, alphaBar);
}

/**
 * Convert a predicted noise ε̂ to the corresponding score estimate.
 *   score = -ε̂ / sqrt(1 - ᾱ_t)
 */
export function scoreFromPredictedEpsilon(
  epsilonHat: number[],
  _t: number,
  alphaBar: number,
): number[] {
  const scale = -1 / Math.sqrt(Math.max(1 - alphaBar, 1e-12));
  return epsilonHat.map((e) => scale * e);
}

/**
 * Deterministic network stub that predicts ε̂ from z_t.
 * Includes the natural sqrt(1 - ᾱ_t) scale so the predicted score becomes
 * -weight * z_t; the user can vary `weight` to explore the MSE target.
 */
export function predictEpsilon(
  z: number[],
  _t: number,
  alphaBar: number,
  weight = 0.5,
): number[] {
  const scale = weight * Math.sqrt(Math.max(1 - alphaBar, 0));
  return z.map((v) => scale * v);
}

/** Reconstruct the ε that maps a given clean x to a given noisy z_t. */
export function sampleConditionalEpsilon(
  zt: number[],
  x: number[],
  alphaBar: number,
): number[] {
  const sqrtAb = Math.sqrt(Math.max(alphaBar, 0));
  const sqrt1mAb = Math.sqrt(Math.max(1 - alphaBar, 1e-12));
  return zt.map((z, i) => (z - sqrtAb * x[i]) / sqrt1mAb);
}

/**
 * Build a sampler for clean samples x drawn from the conditional distribution
 * q(x | z_t) for an empirical dataset.  Uses weights proportional to
 * q(z_t | x) = N(z_t; sqrt(ᾱ_t) x, (1 - ᾱ_t) I).
 */
export function makeConditionalSampler(
  cleanSamples: number[][],
  zt: number[],
  alphaBar: number,
  seed = 42,
): () => number[] {
  const sqrtAb = Math.sqrt(Math.max(alphaBar, 0));
  const noiseVar = Math.max(1 - alphaBar, 1e-12);
  const weights = cleanSamples.map((x) => {
    let d2 = 0;
    for (let d = 0; d < zt.length; d++) {
      const diff = zt[d] - sqrtAb * x[d];
      d2 += diff * diff;
    }
    return Math.exp(-d2 / (2 * noiseVar));
  });
  const total = weights.reduce((a, b) => a + b, 0);
  const cdf: number[] = [];
  let cum = 0;
  for (const w of weights) {
    cum += w / total;
    cdf.push(cum);
  }
  const rng = mulberry32(seed);
  return () => {
    const u = rng();
    const idx = cdf.findIndex((p) => u < p);
    return cleanSamples[idx === -1 ? cleanSamples.length - 1 : idx];
  };
}

/** Draw many ε values conditioned on the same z_t from an empirical dataset. */
export function sampleConditionalEpsilons(
  zt: number[],
  alphaBar: number,
  numSamples: number,
  cleanSamples: number[][],
  seed = 42,
): number[][] {
  const sampler = makeConditionalSampler(cleanSamples, zt, alphaBar, seed);
  const out: number[][] = [];
  for (let i = 0; i < numSamples; i++) {
    out.push(sampleConditionalEpsilon(zt, sampler(), alphaBar));
  }
  return out;
}

/** Default zero-mean clean samples used when no dataset is supplied. */
const DEFAULT_ZERO_MEAN_DATA = generateGaussianNoise(2000, 2, 0);

/**
 * Monte-Carlo approximation of the marginal score.
 * Averages ε over many clean samples x drawn from q(x | z_t), then applies
 * the score scaling.
 */
export function monteCarloMarginalScore(
  zt: number[],
  t: number,
  alphaBar: number,
  numSamples: number,
  cleanSamples: number[][] = DEFAULT_ZERO_MEAN_DATA,
  seed = 42,
): number[] {
  const epsilons = sampleConditionalEpsilons(
    zt,
    alphaBar,
    numSamples,
    cleanSamples,
    seed,
  );
  const dim = zt.length;
  const sum = new Array(dim).fill(0);
  for (const eps of epsilons) {
    for (let d = 0; d < dim; d++) {
      sum[d] += eps[d];
    }
  }
  const meanEpsilon = sum.map((s) => s / numSamples);
  return scoreFromPredictedEpsilon(meanEpsilon, t, alphaBar);
}

/* -------------------------------------------------------------------------- */
/* Helpers / invariants                                                       */
/* -------------------------------------------------------------------------- */

/** Euclidean (L2) distance between two vectors. */
export function l2Distance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - (b[i] ?? 0);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/** Squared L2 norm of a vector. */
export function l2NormSq(a: number[]): number {
  return a.reduce((s, v) => s + v * v, 0);
}

/** Generate a deterministic 2D Gaussian-mixture point cloud. */
export function generateCleanSamples(
  N: number,
  seed: number,
): number[][] {
  const rng = mulberry32(seed);
  const means = SCORE_MIXTURE_MEANS.map((m) => [...m]);
  const weights = [...SCORE_MIXTURE_WEIGHTS];
  const samples: number[][] = [];
  for (let i = 0; i < N; i++) {
    const u = rng();
    let cum = 0;
    let k = 0;
    for (; k < weights.length; k++) {
      cum += weights[k];
      if (u < cum) break;
    }
    k = Math.min(k, weights.length - 1);
    const [mx, my] = means[k];
    samples.push([mx + boxMuller(rng), my + boxMuller(rng)]);
  }
  return samples;
}

/**
 * Empirical MSE between a candidate predicted score and a collection of
 * per-sample scores.  Useful for verifying that the conditional expectation
 * minimizes the MSE.
 */
export function empiricalScoreMse(
  candidateScore: number[],
  sampleScores: number[][],
): number {
  let sum = 0;
  for (const s of sampleScores) {
    sum += l2NormSq(s.map((v, i) => v - candidateScore[i]));
  }
  return sum / sampleScores.length;
}
