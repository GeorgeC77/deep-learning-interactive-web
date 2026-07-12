/* -------------------------------------------------------------------------- */
/* MCMC utilities: Metropolis-Hastings, autocorrelation, diagnostics          */
/* -------------------------------------------------------------------------- */

/** Bimodal Gaussian mixture target used by the demo: 0.5·N(-2,1)+0.5·N(2,1).
 *  The normalizing constant is omitted because the MH acceptance ratio is
 *  invariant to it. */
export function bimodalTarget(x: number): number {
  return (
    0.5 * Math.exp(-0.5 * (x + 2) * (x + 2)) +
    0.5 * Math.exp(-0.5 * (x - 2) * (x - 2))
  );
}

/** Deterministic mulberry32 PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller transform: returns a standard normal variate. */
function boxMuller(rng: () => number): number {
  const u1 = Math.max(1e-12, rng());
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export interface MetropolisHastingsResult {
  samples: number[];
  accepted: number;
}

/** Symmetric random-walk Metropolis sampler.
 *
 *  @param target      unnormalized target density
 *  @param proposalStd standard deviation of the Gaussian proposal
 *  @param nSteps      number of recorded samples
 *  @param seed        deterministic seed
 *  @param burnIn      number of discarded burn-in steps (default 0)
 */
export function metropolisHastings(
  target: (x: number) => number,
  proposalStd: number,
  nSteps: number,
  seed: number,
  burnIn = 0,
): MetropolisHastingsResult {
  const rng = mulberry32(seed);
  const totalSteps = burnIn + nSteps;
  const samples: number[] = new Array(nSteps);
  let x = 0;
  let accepted = 0;

  for (let i = 0; i < totalSteps; i++) {
    const z = boxMuller(rng);
    const xp = x + proposalStd * z;
    const alpha = Math.min(1, target(xp) / target(x));
    if (rng() < alpha) {
      x = xp;
      accepted++;
    }
    if (i >= burnIn) {
      samples[i - burnIn] = x;
    }
  }

  return { samples, accepted };
}

/** Autocorrelation function (ACF) for a 1-D sample path.
 *
 *  Returns rho[0..maxLag] with rho[0] = 1.  If maxLag >= sample length,
 *  it is truncated automatically.
 */
export function computeACF(samples: number[], maxLag: number): number[] {
  const n = samples.length;
  if (n === 0) return [];
  const lagCount = Math.min(maxLag, n - 1);
  const mean = samples.reduce((a, b) => a + b, 0) / n;
  let c0 = 0;
  for (let i = 0; i < n; i++) {
    const d = samples[i] - mean;
    c0 += d * d;
  }
  if (c0 === 0) {
    return Array.from({ length: lagCount + 1 }, () => 1);
  }

  const rho: number[] = [1];
  for (let k = 1; k <= lagCount; k++) {
    let ck = 0;
    for (let i = 0; i < n - k; i++) {
      ck += (samples[i] - mean) * (samples[i + k] - mean);
    }
    rho.push(ck / c0);
  }
  return rho;
}

/** Effective sample size via the autocorrelation sum (Kish / Geyer style).
 *
 *  ESS = n / (1 + 2 * sum_{k>=1} rho_k).  Negative autocorrelations are
 *  truncated to zero so that ESS never exceeds n.
 */
export function computeESS(samples: number[]): number {
  const n = samples.length;
  if (n < 2) return n;
  const maxLag = Math.min(n - 1, Math.floor(10 * Math.log10(n)));
  const acf = computeACF(samples, maxLag);
  let sum = 0;
  for (let k = 1; k < acf.length; k++) {
    sum += Math.max(0, acf[k]);
  }
  return Math.min(n, n / (1 + 2 * sum));
}

export interface TraceStats {
  binWidth: number;
  centers: number[];
  counts: number[];
  maxCount: number;
  total: number;
}

/** Histogram over a 1-D trace.  The bin range is padded by one bin on each
 *  side so the tails are visible. */
export function traceStats(samples: number[], binWidth: number): TraceStats {
  const n = samples.length;
  if (n === 0) {
    return { binWidth, centers: [], counts: [], maxCount: 0, total: 0 };
  }
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const lo = min - binWidth;
  const hi = max + binWidth;
  const binCount = Math.max(1, Math.ceil((hi - lo) / binWidth));
  const counts = Array<number>(binCount).fill(0);
  for (const x of samples) {
    let idx = Math.floor((x - lo) / binWidth);
    if (idx < 0) idx = 0;
    if (idx >= binCount) idx = binCount - 1;
    counts[idx]++;
  }
  const centers = Array.from({ length: binCount }, (_, i) => lo + (i + 0.5) * binWidth);
  const maxCount = Math.max(...counts);
  return { binWidth, centers, counts, maxCount, total: n };
}

/** Assign a sample to its nearest mode. */
function nearestMode(x: number, modes: number[]): number {
  let bestIdx = 0;
  let bestDist = Math.abs(x - modes[0]);
  for (let i = 1; i < modes.length; i++) {
    const d = Math.abs(x - modes[i]);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/** Fraction of samples assigned to each mode (nearest-mode assignment).  The
 *  returned occupancies always sum to 1. */
export function modeOccupancy(
  samples: number[],
  modes: number[] = [-2, 2],
): number[] {
  const n = samples.length;
  if (n === 0) return modes.map(() => 0);
  const counts = Array<number>(modes.length).fill(0);
  for (const x of samples) {
    counts[nearestMode(x, modes)]++;
  }
  return counts.map((c) => c / n);
}

/** Count transitions between nearest-mode assignments. */
export function modeSwitches(
  samples: number[],
  modes: number[] = [-2, 2],
): number {
  if (samples.length < 2) return 0;
  let switches = 0;
  let prev = nearestMode(samples[0], modes);
  for (let i = 1; i < samples.length; i++) {
    const cur = nearestMode(samples[i], modes);
    if (cur !== prev) switches++;
    prev = cur;
  }
  return switches;
}

/** Percentage of consecutive identical samples (a proxy for rejection rate). */
export function repeatedStatePct(samples: number[]): number {
  const n = samples.length;
  if (n < 2) return 0;
  let repeats = 0;
  for (let i = 1; i < n; i++) {
    if (samples[i] === samples[i - 1]) repeats++;
  }
  return repeats / (n - 1);
}
