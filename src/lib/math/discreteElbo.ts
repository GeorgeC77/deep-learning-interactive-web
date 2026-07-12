/* -------------------------------------------------------------------------- */
/* 1-D GMM posterior / ELBO helpers for the discrete-latent ELBO demo        */
/* -------------------------------------------------------------------------- */

/** Deterministic mulberry32 PRNG. */
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard-normal sample from a uniform RNG (Box-Muller). */
function randn(rng: () => number): number {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Generate N scalar observations from a 1-D GMM with the given parameters. */
export function generateGMMData(
  N: number,
  seed: number,
  means: number[],
  weights: number[],
  sigma: number
): number[] {
  const rng = mulberry32(seed);
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = rng();
    let cum = 0;
    let comp = 0;
    for (let k = 0; k < weights.length; k++) {
      cum += weights[k];
      if (u < cum) {
        comp = k;
        break;
      }
    }
    out.push(means[comp] + randn(rng) * sigma);
  }
  return out;
}

/** Log-PDF of a 1-D Gaussian N(mu, sigma^2). */
export function gaussianLogPdf(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return -0.5 * (z * z + Math.log(2 * Math.PI * sigma * sigma));
}

/** Numerically stable log-sum-exp. */
export function logSumExp(arr: number[]): number {
  if (arr.length === 0) return -Infinity;
  const max = Math.max(...arr);
  const sum = arr.reduce((s, v) => s + Math.exp(v - max), 0);
  return max + Math.log(sum);
}

/** Softmax over a real vector; returned probabilities sum to 1. */
export function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((v) => Math.exp(v - max));
  const sum = exps.reduce((s, v) => s + v, 0);
  return exps.map((v) => v / sum);
}

/** True posterior p(z = k | x, theta) as a probability simplex. */
export function truePosterior(
  x: number,
  means: number[],
  weights: number[],
  sigma: number
): number[] {
  const logProbs = means.map((mu, k) => Math.log(weights[k]) + gaussianLogPdf(x, mu, sigma));
  return softmax(logProbs);
}

/** Clamp a 2-D control point to a valid 3-simplex and return [q0, q1, q2]. */
export function constrainSimplex(q12: [number, number]): [number, number, number] {
  let q0 = Math.max(0, Math.min(1, q12[0]));
  let q1 = Math.max(0, Math.min(1, q12[1]));
  const sum = q0 + q1;
  if (sum > 1) {
    q0 = q0 / sum;
    q1 = q1 / sum;
  }
  const q2 = Math.max(0, 1 - q0 - q1);
  // Renormalise if rounding pushed the total away from 1.
  const total = q0 + q1 + q2;
  if (total > 0 && Math.abs(total - 1) > 1e-12) {
    return [q0 / total, q1 / total, q2 / total];
  }
  return [q0, q1, q2];
}

/** Compute ELBO, log-likelihood and KL(q || posterior) for a single observation. */
export function computeELBO(
  x: number,
  q: number[],
  means: number[],
  weights: number[],
  sigma: number
): { elbo: number; logPx: number; kl: number } {
  const logProbs = means.map((mu, k) => Math.log(weights[k]) + gaussianLogPdf(x, mu, sigma));
  const logPx = logSumExp(logProbs);
  const posterior = softmax(logProbs);

  const eps = 1e-12;
  let elbo = 0;
  let kl = 0;
  for (let k = 0; k < q.length; k++) {
    const qk = q[k];
    if (qk > eps) {
      elbo += qk * (logProbs[k] - Math.log(qk));
      kl += qk * Math.log(qk / Math.max(posterior[k], eps));
    }
  }
  return { elbo, logPx, kl };
}

/** Identity residual |ln p(x|theta) - ELBO(q) - KL(q || p)|. */
export function identityResidual(logPx: number, elbo: number, kl: number): number {
  return Math.abs(logPx - elbo - kl);
}
