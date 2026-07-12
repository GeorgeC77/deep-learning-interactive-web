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
  const sqrt1mB = Math.sqrt(Math.max(1 - betaT, 0));
  const sqrtB = Math.sqrt(Math.max(betaT, 0));
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

/** Mean vector of 2D samples */
export function sampleMeanVector(samples: number[][]): number[] {
  const d = samples[0]?.length ?? 0;
  const sums = new Array(d).fill(0);
  for (const row of samples) for (let j = 0; j < d; j++) sums[j] += row[j];
  return sums.map((s) => s / samples.length);
}

/** Covariance matrix of 2D samples (unbiased-ish, divide by N) */
export function sampleCovarianceMatrix(samples: number[][]): number[][] {
  const d = samples[0]?.length ?? 0;
  const mean = sampleMeanVector(samples);
  const cov = Array.from({ length: d }, () => new Array(d).fill(0));
  for (const row of samples) {
    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) {
        cov[i][j] += (row[i] - mean[i]) * (row[j] - mean[j]);
      }
    }
  }
  const n = samples.length;
  return cov.map((row) => row.map((v) => (n > 0 ? v / n : 0)));
}

/** Frobenius norm of matrix difference */
export function frobeniusDiff(a: number[][], b: number[][]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      const v = (a[i]?.[j] ?? 0) - (b[i]?.[j] ?? 0);
      sum += v * v;
    }
  }
  return Math.sqrt(sum);
}

/** Gaussian-kernel maximum mean discrepancy squared (biased V-statistic) */
export function mmdSquaredGaussian(a: number[][], b: number[][], bandwidth?: number): number {
  const dim = a[0]?.length ?? 1;
  const all = [...a, ...b];
  const sigma = bandwidth ?? medianPairwiseDistance(all) ?? Math.sqrt(dim);
  const sigma2 = 2 * sigma * sigma;
  const termAA = kernelSum(a, a, sigma2);
  const termBB = kernelSum(b, b, sigma2);
  const termAB = kernelSum(a, b, sigma2);
  return termAA / (a.length * a.length) + termBB / (b.length * b.length) - 2 * termAB / (a.length * b.length);
}

function medianPairwiseDistance(points: number[][]): number | undefined {
  if (points.length < 2) return undefined;
  const dists: number[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let s = 0;
      for (let k = 0; k < points[i].length; k++) s += (points[i][k] - points[j][k]) ** 2;
      dists.push(Math.sqrt(s));
    }
  }
  dists.sort((x, y) => x - y);
  return dists[Math.floor(dists.length / 2)] || 1;
}

function kernelSum(a: number[][], b: number[][], sigma2: number): number {
  let sum = 0;
  for (const ra of a) {
    for (const rb of b) {
      let d2 = 0;
      for (let k = 0; k < ra.length; k++) d2 += (ra[k] - rb[k]) ** 2;
      sum += Math.exp(-d2 / sigma2);
    }
  }
  return sum;
}

/**
 * 2-Wasserstein distance squared between two empirical distributions,
 * approximated by the Gaussian Wasserstein between their sample means/covariances.
 */
export function wasserstein2GaussianApprox(a: number[][], b: number[][]): number {
  const ma = sampleMeanVector(a);
  const mb = sampleMeanVector(b);
  const meanDiff = ma.map((v, i) => v - mb[i]);
  const meanTerm = meanDiff.reduce((s, v) => s + v * v, 0);
  const covA = sampleCovarianceMatrix(a);
  const covB = sampleCovarianceMatrix(b);
  // For equal covariance matrices the cross term is trace(Sigma);
  // We return meanTerm + trace(covA) + trace(covB) - 2 * trace(sqrt(covA covB)) approx.
  // For 2x2 we approximate the cross term with trace of geometric mean via eigenvalues.
  const cross = traceSqrtProduct(covA, covB);
  return Math.max(0, meanTerm + trace(covA) + trace(covB) - 2 * cross);
}

function trace(m: number[][]): number {
  let s = 0;
  for (let i = 0; i < m.length; i++) s += m[i]?.[i] ?? 0;
  return s;
}

/** Approximate trace(sqrt(A B)) for symmetric 2x2 matrices using eigenvalues of product. */
function traceSqrtProduct(a: number[][], b: number[][]): number {
  // product = A B
  const p00 = a[0][0] * b[0][0] + a[0][1] * b[1][0];
  const p01 = a[0][0] * b[0][1] + a[0][1] * b[1][1];
  const p10 = a[1][0] * b[0][0] + a[1][1] * b[1][0];
  const p11 = a[1][0] * b[0][1] + a[1][1] * b[1][1];
  const tr = p00 + p11;
  const det = p00 * p11 - p01 * p10;
  const disc = Math.max(tr * tr - 4 * det, 0);
  const lambda1 = Math.sqrt((tr + Math.sqrt(disc)) / 2);
  const lambda2 = Math.sqrt(Math.max((tr - Math.sqrt(disc)) / 2, 0));
  return lambda1 + lambda2;
}

/** Build a histogram with `bins` buckets over [min, max]. Returns bin edges and counts. */
export function histogram(values: number[], bins = 20): { edges: number[]; counts: number[] } {
  let min = Infinity, max = -Infinity;
  for (const v of values) {
    if (Number.isFinite(v)) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return { edges: Array.from({ length: bins + 1 }, (_, i) => min + i), counts: new Array(bins).fill(0) };
  }
  const counts = new Array(bins).fill(0);
  const edges: number[] = [];
  for (let i = 0; i <= bins; i++) edges.push(min + ((max - min) * i) / bins);
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    let idx = Math.floor(((v - min) / (max - min)) * bins);
    if (idx < 0) idx = 0;
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  }
  return { edges, counts };
}

/* -------------------------------------------------------------------------- */
/* Gaussian mixture score for generation denoiser                             */
/* -------------------------------------------------------------------------- */

export interface GaussianMixture2D {
  weights: number[];
  means: number[][];
  covs: number[][][];
}

function distSq(a: number[], b: number[]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

/** Simple deterministic k-means in 2D. */
export function kMeans2D(points: number[][], K: number, maxIter = 30): { means: number[][]; assignments: number[] } {
  const N = points.length;
  const means: number[][] = [];
  // Spread initial centers by sampling every N/K-th point to be deterministic.
  for (let k = 0; k < K; k++) means.push([...points[(k * Math.floor(N / K)) % N]]);
  const assignments = new Array(N).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < N; i++) {
      let bestK = 0;
      let bestD = Infinity;
      for (let k = 0; k < K; k++) {
        const d = distSq(points[i], means[k]);
        if (d < bestD) { bestD = d; bestK = k; }
      }
      if (assignments[i] !== bestK) { assignments[i] = bestK; changed = true; }
    }
    if (!changed) break;
    const counts = new Array(K).fill(0);
    const sums = Array.from({ length: K }, () => [0, 0]);
    for (let i = 0; i < N; i++) {
      const k = assignments[i];
      counts[k]++;
      sums[k][0] += points[i][0];
      sums[k][1] += points[i][1];
    }
    for (let k = 0; k < K; k++) {
      if (counts[k] > 0) {
        means[k][0] = sums[k][0] / counts[k];
        means[k][1] = sums[k][1] / counts[k];
      }
    }
  }
  return { means, assignments };
}

/** Fit a 2D Gaussian mixture from point cloud using k-means + sample covariances. */
export function fitGaussianMixture2D(points: number[][], K: number): GaussianMixture2D {
  const Kuse = Math.min(K, points.length);
  const { means, assignments } = kMeans2D(points, Kuse);
  const N = points.length;
  const counts = new Array(Kuse).fill(0);
  const covs: number[][][] = Array.from({ length: Kuse }, () => [[0, 0], [0, 0]]);
  for (let i = 0; i < N; i++) {
    const k = assignments[i];
    counts[k]++;
    const dx = points[i][0] - means[k][0];
    const dy = points[i][1] - means[k][1];
    covs[k][0][0] += dx * dx;
    covs[k][0][1] += dx * dy;
    covs[k][1][0] += dx * dy;
    covs[k][1][1] += dy * dy;
  }
  for (let k = 0; k < Kuse; k++) {
    if (counts[k] > 1) {
      covs[k][0][0] /= counts[k];
      covs[k][0][1] /= counts[k];
      covs[k][1][0] /= counts[k];
      covs[k][1][1] /= counts[k];
    }
    // Regularize to avoid singularities.
    covs[k][0][0] += 1e-4;
    covs[k][1][1] += 1e-4;
  }
  return { weights: counts.map((c) => c / N), means, covs };
}

/** Density of the time-t forward mixture at point z. */
export function gaussianMixtureDensity(
  z: number[], t: number, betas: number[], gmm: GaussianMixture2D,
): number {
  const ab = alphaBar(t, betas);
  const sqrtAb = Math.sqrt(Math.max(ab, 1e-12));
  const dataScale = Math.max(ab, 1e-12);
  const noiseScale = Math.max(1 - ab, 1e-12);
  let total = 0;
  for (let k = 0; k < gmm.weights.length; k++) {
    const meanT = [sqrtAb * gmm.means[k][0], sqrtAb * gmm.means[k][1]];
    const c0 = gmm.covs[k];
    const covT = [
      [dataScale * c0[0][0] + noiseScale, dataScale * c0[0][1]],
      [dataScale * c0[1][0], dataScale * c0[1][1] + noiseScale],
    ];
    const det = covT[0][0] * covT[1][1] - covT[0][1] * covT[1][0];
    if (det <= 1e-15) continue;
    const invDet = 1 / det;
    const invCov = [
      [invDet * covT[1][1], -invDet * covT[0][1]],
      [-invDet * covT[1][0], invDet * covT[0][0]],
    ];
    const dx = [z[0] - meanT[0], z[1] - meanT[1]];
    const mahal = dx[0] * (invCov[0][0] * dx[0] + invCov[0][1] * dx[1]) +
      dx[1] * (invCov[1][0] * dx[0] + invCov[1][1] * dx[1]);
    total += gmm.weights[k] * Math.exp(-0.5 * mahal) / (2 * Math.PI * Math.sqrt(det));
  }
  return Number.isFinite(total) ? total : 0;
}

/** Analytic score grad_z log p_t(z) for the fitted 2D Gaussian mixture. */
export function gaussianMixtureScore(
  z: number[], t: number, betas: number[], gmm: GaussianMixture2D,
): number[] {
  const ab = alphaBar(t, betas);
  const sqrtAb = Math.sqrt(Math.max(ab, 1e-12));
  const dataScale = Math.max(ab, 1e-12);
  const noiseScale = Math.max(1 - ab, 1e-12);

  let totalP = 0;
  const weightedScores: number[][] = [];

  for (let k = 0; k < gmm.weights.length; k++) {
    const meanT = [sqrtAb * gmm.means[k][0], sqrtAb * gmm.means[k][1]];
    const c0 = gmm.covs[k];
    const covT = [
      [dataScale * c0[0][0] + noiseScale, dataScale * c0[0][1]],
      [dataScale * c0[1][0], dataScale * c0[1][1] + noiseScale],
    ];
    const det = covT[0][0] * covT[1][1] - covT[0][1] * covT[1][0];
    if (det <= 1e-15) { weightedScores.push([0, 0]); continue; }
    const invDet = 1 / det;
    const invCov = [
      [invDet * covT[1][1], -invDet * covT[0][1]],
      [-invDet * covT[1][0], invDet * covT[0][0]],
    ];
    const dx = [z[0] - meanT[0], z[1] - meanT[1]];
    const mahal = dx[0] * (invCov[0][0] * dx[0] + invCov[0][1] * dx[1]) +
      dx[1] * (invCov[1][0] * dx[0] + invCov[1][1] * dx[1]);
    const density = gmm.weights[k] * Math.exp(-0.5 * mahal) / (2 * Math.PI * Math.sqrt(det));
    const scoreK = [
      -(invCov[0][0] * dx[0] + invCov[0][1] * dx[1]),
      -(invCov[1][0] * dx[0] + invCov[1][1] * dx[1]),
    ];
    weightedScores.push([density * scoreK[0], density * scoreK[1]]);
    totalP += density;
  }

  if (totalP < 1e-15 || !Number.isFinite(totalP)) return [0, 0];
  const sx = weightedScores.reduce((s, ws) => s + ws[0], 0) / totalP;
  const sy = weightedScores.reduce((s, ws) => s + ws[1], 0) / totalP;
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return [0, 0];
  return [sx, sy];
}

/** Convert score to epsilon prediction: ε̂ = -sqrt(1-ᾱ_t) · score_t(z). */
export function epsilonFromScore(score: number[], alphaBarT: number): number[] {
  const scale = -Math.sqrt(Math.max(1 - alphaBarT, 0));
  return score.map((s) => scale * s);
}

/** Clamp a point cloud to a bounded box to avoid runaway expansion. */
export function clampPointCloud(pts: number[][], limit = 20): number[][] {
  return pts.map((row) =>
    row.map((v) => {
      if (!Number.isFinite(v)) return 0;
      return Math.max(-limit, Math.min(limit, v));
    }),
  );
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
