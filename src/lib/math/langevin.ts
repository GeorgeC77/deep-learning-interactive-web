/* -------------------------------------------------------------------------- */
/* Langevin dynamics helpers                                                   */
/* -------------------------------------------------------------------------- */

export type ScoreFunction = (x: number) => number;

/** Score of a univariate Gaussian N(mean, sigma^2). */
export function gaussianScore(x: number, mean = 0, sigma = 1): number {
  return -(x - mean) / (sigma * sigma);
}

export interface MixtureComponent {
  weight: number;
  mean: number;
  sigma: number;
}

/** Score of a univariate Gaussian mixture (zero where density is zero). */
export function mixtureScore(x: number, components: MixtureComponent[]): number {
  let num = 0;
  let den = 0;
  for (const c of components) {
    if (c.sigma <= 0 || c.weight <= 0) continue;
    const z = (x - c.mean) / c.sigma;
    const val =
      (c.weight / c.sigma) * Math.exp(-0.5 * z * z);
    num += val * gaussianScore(x, c.mean, c.sigma);
    den += val;
  }
  return den === 0 ? 0 : num / den;
}

/** Seeded PRNG (mulberry32). */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller: sample N(0,1) using a uniform RNG. */
export function randNormal(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * One Euler–Maruyama Langevin step.
 *
 * x_{t+1} = x_t + η * score(x_t) + sqrt(2η) * ε_t,   ε_t ~ N(0,1)
 */
export function langevinStep(
  x: number,
  scoreFn: ScoreFunction,
  eta: number,
  rng: () => number,
): number {
  return x + eta * scoreFn(x) + Math.sqrt(2 * eta) * randNormal(rng);
}

/** Run Langevin dynamics for a fixed number of steps. */
export function langevinChain(
  start: number,
  scoreFn: ScoreFunction,
  eta: number,
  steps: number,
  seed: number,
): number[] {
  const rng = mulberry32(seed);
  const traj: number[] = [start];
  let x = start;
  for (let i = 0; i < steps; i++) {
    x = langevinStep(x, scoreFn, eta, rng);
    traj.push(x);
  }
  return traj;
}

/**
 * Estimate sample mean and variance of the final `count` states from a chain.
 * Useful for checking whether the chain has drifted/failed to converge.
 */
export function chainStats(samples: number[]): { mean: number; variance: number } {
  const n = samples.length;
  if (n === 0) return { mean: 0, variance: 0 };
  const mean = samples.reduce((s, v) => s + v, 0) / n;
  const variance =
    samples.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (n || 1);
  return { mean, variance };
}
