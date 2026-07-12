/* -------------------------------------------------------------------------- */
/* Importance sampling math                                                    */
/* -------------------------------------------------------------------------- */

export type Integrand = {
  id: string;
  label: string;
  fn: (x: number) => number;
};

export const INTEGRANDS: Integrand[] = [
  { id: 'x', label: 'x', fn: (x) => x },
  { id: 'x2', label: 'x²', fn: (x) => x * x },
  { id: 'indicator2', label: '𝟙{x>2}', fn: (x) => (x > 2 ? 1 : 0) },
  { id: 'expHalf', label: 'exp(x/2)', fn: (x) => Math.exp(x / 2) },
];

export type RNG = () => number;

export function createRng(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(x: number, mu: number, sigma: number): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

export function sampleProposal(mu: number, sigma: number, n: number, seed: number): number[] {
  const rng = createRng(seed);
  const samples: number[] = [];
  const pairs = Math.ceil(n / 2);
  for (let i = 0; i < pairs; i++) {
    let u1 = rng();
    if (u1 === 0) u1 = 1e-12;
    const u2 = rng();
    const r = Math.sqrt(-2 * Math.log(u1));
    const z0 = r * Math.cos(2 * Math.PI * u2);
    const z1 = r * Math.sin(2 * Math.PI * u2);
    samples.push(mu + sigma * z0);
    if (samples.length < n) samples.push(mu + sigma * z1);
  }
  return samples.slice(0, n);
}

export type ImportanceResult = {
  estimate: number;
  standardError: number;
  weights: number[];
  normalizedWeights: number[];
};

export function importanceEstimate(
  samples: number[],
  f: (x: number) => number,
  p: (x: number) => number,
  q: (x: number) => number,
): ImportanceResult {
  const weights = samples.map((x) => p(x) / q(x));
  const fVals = samples.map((x) => f(x));
  const sumW = weights.reduce((acc, w) => acc + w, 0);
  const normalizedWeights = sumW > 0 ? weights.map((w) => w / sumW) : weights.map(() => 0);
  const estimate =
    sumW > 0 ? fVals.reduce((acc, fv, i) => acc + normalizedWeights[i] * fv, 0) : NaN;

  let standardError = NaN;
  if (sumW > 0 && samples.length > 1) {
    let sq = 0;
    for (let i = 0; i < samples.length; i++) {
      const diff = fVals[i] - estimate;
      sq += weights[i] * weights[i] * diff * diff;
    }
    standardError = Math.sqrt(sq) / sumW;
  }

  return { estimate, standardError, weights, normalizedWeights };
}

export function effectiveSampleSize(weights: number[]): number {
  const sum = weights.reduce((acc, w) => acc + w, 0);
  const sumSq = weights.reduce((acc, w) => acc + w * w, 0);
  return sumSq > 0 ? (sum * sum) / sumSq : 0;
}

export function maxWeightShare(weights: number[]): number {
  const sum = weights.reduce((acc, w) => acc + w, 0);
  if (sum === 0) return 0;
  return Math.max(...weights) / sum;
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax));
  return sign * y;
}

function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

export function analyticTruth(input: Integrand | string): number {
  const id = typeof input === 'string' ? input : input.id;
  switch (id) {
    case 'x':
      return 0;
    case 'x2':
      return 1;
    case 'indicator2':
      return 1 - normalCdf(2);
    case 'expHalf':
      return Math.exp(1 / 8);
    default:
      return NaN;
  }
}
