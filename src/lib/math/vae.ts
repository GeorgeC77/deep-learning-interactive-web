/* -------------------------------------------------------------------------- */
/* VAE latent-space utilities: diagonal Gaussian posterior, KL, β-objective    */
/* -------------------------------------------------------------------------- */

/** Deterministic seeded PRNG (mulberry32). */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller transform: sample N(0,1) from uniform [0,1). */
export function randNormal(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * KL divergence between a diagonal Gaussian q(z|x) = N(μ, diag(σ²))
 * and an isotropic Gaussian prior p(z) = N(0, priorVariance · I).
 *
 * Per-sample:
 *   KL = 0.5 * Σ_i [ σ_i² / priorVariance - log(σ_i² / priorVariance) - 1 + μ_i² / priorVariance ]
 *
 * The default priorVariance = 1 recovers the standard VAE prior N(0, I).
 */
export function klDivergenceDiagonalGaussian(
  mu: number[],
  sigma: number[],
  priorVariance = 1,
): number {
  if (mu.length !== sigma.length) {
    throw new Error('mu and sigma must have the same length');
  }
  if (priorVariance <= 0 || !Number.isFinite(priorVariance)) {
    return NaN;
  }

  let sum = 0;
  for (let i = 0; i < mu.length; i++) {
    const s = sigma[i];
    if (s <= 0 || !Number.isFinite(s)) return NaN;
    const s2 = s * s;
    const ratio = s2 / priorVariance;
    sum += ratio - Math.log(ratio) - 1 + (mu[i] * mu[i]) / priorVariance;
  }
  return 0.5 * sum;
}

/**
 * β-VAE objective.
 *
 *   L_β = E_q[ln p(x|z)] - β · KL(q(z|x) || p(z))
 *
 * For β = 1 this is the standard ELBO. For β > 1 the KL term is weighted more
 * heavily; for 0 < β < 1 it is weighted less.
 */
export function betaObjective(
  reconstructionLogLik: number,
  kl: number,
  beta: number,
): number {
  return reconstructionLogLik - beta * kl;
}

/**
 * Generate a cloud of latent points via the reparameterisation trick:
 *   z = μ + σ ⊙ ε,   ε ~ N(0, I).
 */
export function sampleLatent(
  mu: number[],
  sigma: number[],
  seed: number,
  count = 200,
): number[][] {
  if (mu.length !== sigma.length) {
    throw new Error('mu and sigma must have the same length');
  }
  const rng = mulberry32(seed);
  const d = mu.length;
  const points: number[][] = [];
  for (let n = 0; n < count; n++) {
    const z = new Array(d);
    for (let i = 0; i < d; i++) {
      z[i] = mu[i] + sigma[i] * randNormal(rng);
    }
    points.push(z);
  }
  return points;
}

/** Empirical mean and (population) covariance of a point cloud. */
export function latentStatistics(points: number[][]): {
  mean: number[];
  cov: number[][];
} {
  const n = points.length;
  const d = points[0]?.length ?? 0;
  const mean = new Array(d).fill(0);

  for (const p of points) {
    for (let i = 0; i < d; i++) {
      mean[i] += p[i];
    }
  }
  for (let i = 0; i < d; i++) {
    mean[i] /= n;
  }

  const cov = Array.from({ length: d }, () => new Array(d).fill(0));
  for (const p of points) {
    for (let i = 0; i < d; i++) {
      const di = p[i] - mean[i];
      for (let j = 0; j < d; j++) {
        cov[i][j] += di * (p[j] - mean[j]);
      }
    }
  }
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < d; j++) {
      cov[i][j] /= n;
    }
  }

  return { mean, cov };
}
