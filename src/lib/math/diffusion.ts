/* -------------------------------------------------------------------------- */
/* Diffusion math                                                              */
/* -------------------------------------------------------------------------- */

/** Linear beta schedule from betaStart to betaEnd over T steps */
export function makeBetaSchedule(T: number, betaStart: number, betaEnd: number): number[] {
  return Array.from({ length: T }, (_, t) => betaStart + (t / (T - 1)) * (betaEnd - betaStart));
}

/** alpha_bar[t] = ∏_{s=1}^{t} (1 - β_s) */
export function alphaBar(t: number, betas: number[]): number {
  // betas indexed 0..T-1, alphaBar(0) uses no betas = 1
  if (t < 0) return 1;
  let prod = 1;
  for (let s = 0; s < t; s++) prod *= (1 - betas[s]);
  return prod;
}

/** Box-Muller: generate N(0,1) sample */
export function boxMuller(rng: () => number): number {
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** Generate N standard Gaussian samples */
export function generateGaussianNoise(N: number, dim: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  return Array.from({ length: N }, () => Array.from({ length: dim }, () => boxMuller(rng)));
}

/**
 * Closed-form forward: z_t = sqrt(ᾱ_t) * z_0 + sqrt(1 - ᾱ_t) * ε
 */
export function forwardClosed(
  z0: number[][], epsilon: number[][], alphaBarT: number,
): number[][] {
  const sqrtAb = Math.sqrt(Math.max(alphaBarT, 0));
  const sqrt1mAb = Math.sqrt(Math.max(1 - alphaBarT, 0));
  return z0.map((row, i) =>
    row.map((val, j) => sqrtAb * val + sqrt1mAb * epsilon[i][j]),
  );
}

/**
 * Incremental forward: z_t = sqrt(1-β_t) * z_{t-1} + sqrt(β_t) * ε_t
 */
export function forwardIncremental(
  zPrev: number[][], epsilonT: number[][], betaT: number,
): number[][] {
  const sqrt1mB = Math.sqrt(1 - betaT);
  const sqrtB = Math.sqrt(betaT);
  return zPrev.map((row, i) =>
    row.map((val, j) => sqrt1mB * val + sqrtB * epsilonT[i][j]),
  );
}

/** Mean and variance of Gaussian samples */
export function sampleStats(samples: number[][]): { mean: number; variance: number } {
  let sum = 0, sumSq = 0, count = 0;
  for (const row of samples) for (const v of row) { sum += v; sumSq += v * v; count++; }
  const mean = sum / count;
  return { mean, variance: sumSq / count - mean * mean };
}

/**
 * Single reverse step: z_{t-1} = mu_theta(z_t, t) + sigma_t * epsilon
 * mu_theta = (z_t - (β_t / √(1-ᾱ_t)) * ε̂_t) / √(1-β_t)
 * sigma_t = √β_t (or 0 for final step)
 */
export function reverseMean(
  zt: number[], t: number, epsilonHat: number[], betas: number[],
): number[] {
  const ab = alphaBar(t, betas);
  
  const betaT = betas[t - 1];
  const sqrt1mAb = Math.sqrt(Math.max(1 - ab, 1e-10));
  const sqrt1mBeta = Math.sqrt(Math.max(1 - betaT, 1e-10));
  const frac = betaT / sqrt1mAb;
  return zt.map((z, j) => (z - frac * epsilonHat[j]) / sqrt1mBeta);
}

export function reverseStep(
  zt: number[][], t: number, epsilonHat: number[][], betas: number[],
  isFinalStep: boolean,
): number[][] {
  const betaT = betas[t - 1];
  const noise = isFinalStep ? 0 : Math.sqrt(betaT);
  // Generate new Gaussian noise for stochastic reverse
  const rng = mulberry32(t * 12345 + 1);
  return zt.map((row, i) => {
    const mu = reverseMean(row, t, epsilonHat[i], betas);
    return mu.map((m) => m + (noise > 0 ? noise * boxMuller(rng) : 0));
  });
}

/**
 * Full reverse chain from zT back to z0.
 * predictNoise(z, t) is called at each step.
 * Returns full path: [zT, z_{T-1}, ..., z0]
 */
export function reverseChain(
  zT: number[][],
  T: number,
  betas: number[],
  predictNoise: (z: number[][], t: number) => number[][],
  stochastic: boolean,
): number[][][] {
  const path: number[][][] = [zT.map((r) => [...r])];
  let z = zT.map((r) => [...r]);
  for (let t = T; t >= 1; t--) {
    const epsilonHat = predictNoise(z, t);
    const isFinal = (t === 1) || !stochastic;
    z = reverseStep(z, t, epsilonHat, betas, isFinal);
    path.push(z.map((r) => [...r]));
  }
  return path;
}

export function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
