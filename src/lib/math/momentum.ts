export type MomentumConvention = 'classical' | 'ema';

export interface MomentumTrajectoryResult {
  /** Position w_t at each time step, length T + 1 (w_0 = 0). */
  w: number[];
  /** Internal momentum velocity v_t at each time step, length T + 1 (v_0 = 0). */
  v: number[];
}

/**
 * Simulate T steps of momentum update.
 *
 * Classical: v_{t+1} = μ v_t + g_t,     w_{t+1} = w_t - η v_{t+1}
 * EMA:       v_{t+1} = μ v_t + (1-μ) g_t, w_{t+1} = w_t - η v_{t+1}
 *
 * Initial conditions: w_0 = 0, v_0 = 0.
 */
export function momentumTrajectory(
  gradients: number[],
  mu: number,
  eta: number,
  convention: MomentumConvention,
): MomentumTrajectoryResult {
  const T = gradients.length;
  const w = new Array<number>(T + 1).fill(0);
  const v = new Array<number>(T + 1).fill(0);
  const scale = convention === 'ema' ? 1 - mu : 1;

  for (let t = 0; t < T; t++) {
    v[t + 1] = mu * v[t] + scale * gradients[t];
    w[t + 1] = w[t] - eta * v[t + 1];
  }

  return { w, v };
}

/**
 * Steady-state amplification factor for a constant gradient.
 *
 * Classical: 1 / (1 - μ)
 * EMA:       1
 */
export function steadyStateFactor(mu: number, convention: MomentumConvention): number {
  if (convention === 'ema') {
    return 1;
  }
  return 1 / (1 - mu);
}

/**
 * Exact finite-time effective velocity at step t.
 *
 * Returns the change in position Δw_t = w_t - w_{t-1}:
 *
 *   v_t^eff = -η Σ_{j=0}^{t-1} μ^j g_{t-1-j}          (classical)
 *   v_t^eff = -η Σ_{j=0}^{t-1} μ^j (1-μ) g_{t-1-j}    (EMA)
 *
 * For t <= 0 the result is 0.
 */
export function finiteTimeVelocity(
  gradients: number[],
  mu: number,
  eta: number,
  t: number,
  convention: MomentumConvention,
): number {
  if (t <= 0) {
    return 0;
  }
  const scale = convention === 'ema' ? 1 - mu : 1;
  let sum = 0;
  const maxJ = Math.min(t, gradients.length);
  for (let j = 0; j < maxJ; j++) {
    sum += Math.pow(mu, j) * scale * gradients[t - 1 - j];
  }
  return -eta * sum;
}

/** Constant gradient sequence of length T. */
export function constantGradient(g: number, T: number): number[] {
  return Array.from({ length: T }, () => g);
}

/** Alternating +g, -g sequence of length T. */
export function alternatingGradient(g: number, T: number): number[] {
  return Array.from({ length: T }, (_, i) => (i % 2 === 0 ? g : -g));
}

/** Deterministic seeded PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Noisy gradient sequence of length T.
 *
 * Returns g plus deterministic zero-mean uniform noise in [-0.5, 0.5].
 */
export function noisyGradient(g: number, T: number, seed: number): number[] {
  const rand = mulberry32(seed);
  return Array.from({ length: T }, () => g + (rand() - 0.5));
}

/**
 * Narrow-valley-like gradient sequence of length T.
 *
 * Alternates between a large gradient and a small gradient,
 * mimicking directions with very different curvatures.
 */
export function narrowValleyGradients(T: number): number[] {
  const gBig = 1.0;
  const gSmall = 0.02;
  return Array.from({ length: T }, (_, i) => (i % 2 === 0 ? gBig : gSmall));
}
