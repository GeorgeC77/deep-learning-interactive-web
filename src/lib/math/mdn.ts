/* -------------------------------------------------------------------------- */
/* Mixture Density Network helpers                                            */
/* -------------------------------------------------------------------------- */

export type MixtureComponent = { weight: number; mean: number; sigma: number };
export type DataPoint = { x: number; t: number };

const TWO_PI = 2 * Math.PI;

/** Gaussian PDF N(t | mean, sigma^2) with full normalization constant. */
export function gaussianPdf(t: number, mean: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const z = (t - mean) / sigma;
  return Math.exp(-0.5 * z * z) / Math.sqrt(sigma * sigma * TWO_PI);
}

/** Evaluate a Gaussian mixture density at t. */
export function mixturePdf(t: number, components: MixtureComponent[]): number {
  return components.reduce((sum, c) => sum + c.weight * gaussianPdf(t, c.mean, c.sigma), 0);
}

/** Conditional mean E[t | x] of the mixture. */
export function mixtureMean(components: MixtureComponent[]): number {
  return components.reduce((sum, c) => sum + c.weight * c.mean, 0);
}

/**
 * Approximate the modes of a mixture by scanning a regular grid and returning
 * local maxima that exceed a small fraction of the peak density.
 */
export function mixtureModes(
  components: MixtureComponent[],
  tMin: number,
  tMax: number,
  steps = 200,
): number[] {
  if (components.length === 0 || tMax <= tMin) return [];
  const dt = (tMax - tMin) / steps;
  const grid: number[] = [];
  const pdf: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = tMin + i * dt;
    grid.push(t);
    pdf.push(mixturePdf(t, components));
  }
  const maxPdf = Math.max(...pdf, 1e-12);
  const threshold = 0.05 * maxPdf;
  const modes: number[] = [];
  for (let i = 1; i < pdf.length - 1; i++) {
    if (pdf[i] > threshold && pdf[i] > pdf[i - 1] && pdf[i] > pdf[i + 1]) {
      modes.push(grid[i]);
    }
  }
  return modes;
}

/** Deterministic seeded PRNG (mulberry32). */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller transform: sample N(0,1) from uniform [0,1). */
export function randNormal(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(TWO_PI * v);
}

/**
 * Sample from a Gaussian mixture via reparameterization:
 * first pick a component, then draw z ~ N(0,1) and return μ_k + σ_k z.
 */
export function sampleMixture(components: MixtureComponent[], seed: number, count: number): number[] {
  const rng = mulberry32(seed);
  const samples: number[] = [];
  for (let i = 0; i < count; i++) {
    const u = rng();
    let cumulative = 0;
    let selected = 0;
    for (let k = 0; k < components.length; k++) {
      cumulative += components[k].weight;
      if (u <= cumulative) {
        selected = k;
        break;
      }
    }
    const c = components[selected];
    samples.push(c.mean + c.sigma * randNormal(rng));
  }
  return samples;
}

/** Forward (single-valued) dataset: t = sin(x) + noise. */
export function generateForwardDataset(seed: number, count: number): DataPoint[] {
  const rng = mulberry32(seed);
  const data: DataPoint[] = [];
  for (let i = 0; i < count; i++) {
    const x = rng() * 4 - 2; // uniform [-2, 2]
    const noise = 0.12 * randNormal(rng);
    const t = Math.sin(x) + noise;
    data.push({ x, t });
  }
  return data;
}

/**
 * Inverse (multimodal) dataset: x = t + 0.3 sin(2πt) + noise,
 * then swap axes so the input is x and the target is t.
 */
export function generateInverseDataset(seed: number, count: number): DataPoint[] {
  const rng = mulberry32(seed);
  const data: DataPoint[] = [];
  for (let i = 0; i < count; i++) {
    const t = rng() * 4 - 2; // uniform [-2, 2]
    const noise = 0.05 * randNormal(rng);
    const x = t + 0.3 * Math.sin(TWO_PI * t) + noise;
    data.push({ x, t });
  }
  return data;
}

