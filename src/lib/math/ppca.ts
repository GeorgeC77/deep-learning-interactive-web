/* -------------------------------------------------------------------------- */
/* PPCA closed-form maximum likelihood and posterior projection (2D)           */
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

/** Generate N D-dimensional samples from x = W z + ε, z ~ N(0,1), ε ~ N(0,σ²I). */
export function generatePPCAData(
  N: number,
  seed: number,
  W: number[][],
  sigma: number,
): number[][] {
  const rng = mulberry32(seed);
  const D = W.length;
  const M = W[0]?.length ?? 0;
  const out: number[][] = [];
  for (let n = 0; n < N; n++) {
    const z = Array.from({ length: M }, () => randNormal(rng));
    const x = new Array(D).fill(0);
    for (let m = 0; m < M; m++) {
      for (let d = 0; d < D; d++) {
        x[d] += W[d][m] * z[m];
      }
    }
    for (let d = 0; d < D; d++) {
      x[d] += sigma * randNormal(rng);
    }
    out.push(x);
  }
  return out;
}

/** Sample mean vector. */
export function sampleMean(data: number[][]): number[] {
  const d = data[0]?.length ?? 0;
  const sums = new Array(d).fill(0);
  for (const row of data) {
    for (let i = 0; i < d; i++) {
      sums[i] += row[i];
    }
  }
  return sums.map((s) => s / data.length);
}

/** Sample covariance of already-centered data (divide by N). */
export function sampleCovariance(centered: number[][]): number[][] {
  const d = centered[0]?.length ?? 0;
  const cov = Array.from({ length: d }, () => new Array(d).fill(0));
  for (const row of centered) {
    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) {
        cov[i][j] += row[i] * row[j];
      }
    }
  }
  return cov.map((row) => row.map((v) => v / centered.length));
}

/**
 * Stable eigen-decomposition of a symmetric 2x2 matrix.
 *
 * For a symmetric matrix S = [[a, b], [b, d]], the eigenvectors are obtained
 * from the principal rotation angle
 *   θ = 0.5 * atan2(2b, a - d)
 * and returned as an orthonormal pair [cosθ, sinθ], [-sinθ, cosθ].
 * The corresponding eigenvalues are computed by the Rayleigh quotient
 *   λ = uᵀ S u
 * and sorted in descending order. This avoids the degenerate case where the
 * conventional vector [λ - d, c] collapses to the zero vector (e.g. diag(1,4)).
 */
export function eig2x2(S: number[][]): {
  eigenvalues: [number, number];
  eigenvectors: [number[], number[]];
} {
  const a = S[0][0];
  const b = S[0][1];
  const d = S[1][1];

  const theta = 0.5 * Math.atan2(2 * b, a - d);
  const uA = [Math.cos(theta), Math.sin(theta)];
  const uB = [-Math.sin(theta), Math.cos(theta)];

  // Rayleigh quotients uᵀ S u.
  const lambdaA =
    uA[0] * (a * uA[0] + b * uA[1]) + uA[1] * (b * uA[0] + d * uA[1]);
  const lambdaB =
    uB[0] * (a * uB[0] + b * uB[1]) + uB[1] * (b * uB[0] + d * uB[1]);

  if (lambdaA >= lambdaB) {
    return {
      eigenvalues: [lambdaA, lambdaB],
      eigenvectors: [uA, uB],
    };
  }
  return {
    eigenvalues: [lambdaB, lambdaA],
    eigenvectors: [uB, uA],
  };
}

/** Dot product of two vectors. */
function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

/** Multiply a matrix by a vector. */
function matVecMul(M: number[][], v: number[]): number[] {
  return M.map((row) => dot(row, v));
}

/** Invert a small M x M matrix (M ≤ 2). Returns null if singular. */
function invertMxM(M: number[][]): number[][] | null {
  const n = M.length;
  if (n === 0) return [];
  if (n === 1) {
    const det = M[0][0];
    if (Math.abs(det) < 1e-12) return null;
    return [[1 / det]];
  }
  if (n === 2) {
    const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
    if (Math.abs(det) < 1e-12) return null;
    return [
      [M[1][1] / det, -M[0][1] / det],
      [-M[1][0] / det, M[0][0] / det],
    ];
  }
  return null;
}

export type PPCAMLResult = {
  Wml: number[][]; // D x M
  sigma2ml: number;
  boundary: boolean;
  logLikelihood: (S: number[][]) => number;
};

/**
 * Closed-form PPCA maximum-likelihood solution.
 *
 * W_ML = U_M (Λ_M - σ²_ML I)^{1/2}
 * σ²_ML = average of discarded eigenvalues (indices ≥ M)
 *
 * For M = D the standard formula is not defined (no discarded eigenvalues);
 * the result is marked as a boundary case with σ²_ML = NaN.
 */
export function ppcaClosedFormML(S: number[][], M: number): PPCAMLResult {
  const D = S.length;
  const { eigenvalues, eigenvectors } = eig2x2(S);
  const boundary = M >= D;

  let sigma2ml: number;
  if (boundary) {
    sigma2ml = NaN;
  } else {
    const discarded = eigenvalues.slice(M);
    sigma2ml =
      discarded.reduce((s, v) => s + v, 0) / Math.max(1, discarded.length);
  }

  const Wml: number[][] = Array.from({ length: D }, () => []);
  if (!boundary) {
    for (let i = 0; i < M; i++) {
      const scale = Math.sqrt(Math.max(0, eigenvalues[i] - sigma2ml));
      for (let d = 0; d < D; d++) {
        Wml[d][i] = eigenvectors[i][d] * scale;
      }
    }
  } else {
    // M = D: full-rank factorization; factorization is non-unique.
    for (let i = 0; i < D; i++) {
      const scale = Math.sqrt(Math.max(0, eigenvalues[i]));
      for (let d = 0; d < D; d++) {
        Wml[d][i] = eigenvectors[i][d] * scale;
      }
    }
  }

  return {
    Wml,
    sigma2ml,
    boundary,
    logLikelihood: (Sc: number[][]) => ppcaLogLikelihood(Sc, Wml, sigma2ml, 1),
  };
}

/** Posterior mean E[z | x] = (WᵀW + σ²I)^{-1} Wᵀ x, with x already centered. */
export function posteriorMean(
  x: number[],
  W: number[][],
  sigma2: number,
): number[] {
  const M = W[0]?.length ?? 0;
  if (M === 0) return [];

  const Mmat: number[][] = [];
  for (let i = 0; i < M; i++) {
    const row: number[] = [];
    for (let j = 0; j < M; j++) {
      let s = 0;
      for (let d = 0; d < W.length; d++) {
        s += W[d][i] * W[d][j];
      }
      row.push(s + (i === j ? sigma2 : 0));
    }
    Mmat.push(row);
  }

  const invM = invertMxM(Mmat);
  if (!invM) throw new Error('Singular posterior covariance matrix');

  const wtX = Array.from({ length: M }, (_, i) => {
    let s = 0;
    for (let d = 0; d < W.length; d++) {
      s += W[d][i] * x[d];
    }
    return s;
  });

  return matVecMul(invM, wtX);
}

/** PPCA posterior-mean reconstruction of x (original, uncentered). */
export function posteriorReconstruction(
  x: number[],
  W: number[][],
  sigma2: number,
  mean: number[],
): number[] {
  const centered = x.map((v, i) => v - mean[i]);
  const z = posteriorMean(centered, W, sigma2);
  const D = W.length;
  const recon = new Array(D).fill(0);
  for (let m = 0; m < z.length; m++) {
    for (let d = 0; d < D; d++) {
      recon[d] += W[d][m] * z[m];
    }
  }
  return recon.map((v, i) => v + mean[i]);
}

/** Standard PCA orthogonal projection onto the top-M eigenvectors. */
export function pcaOrthogonalProjection(
  x: number[],
  eigenvectors: number[][],
  M: number,
  mean: number[],
): number[] {
  const D = mean.length;
  const centered = x.map((v, i) => v - mean[i]);
  const proj = new Array(D).fill(0);
  for (let i = 0; i < M; i++) {
    const u = eigenvectors[i];
    const coef = dot(centered, u);
    for (let d = 0; d < D; d++) {
      proj[d] += coef * u[d];
    }
  }
  return proj.map((v, i) => v + mean[i]);
}

/**
 * Log-likelihood of centered data covariance S under C = WWᵀ + σ²I.
 *
 * ll = -N/2 [ D log(2π) + log|C| + tr(C^{-1} S) ]
 */
export function ppcaLogLikelihood(
  S: number[][],
  W: number[][],
  sigma2: number,
  N: number,
): number {
  const D = S.length;
  if (!Number.isFinite(sigma2) || sigma2 <= 0) return NaN;

  const C = Array.from({ length: D }, (_, i) =>
    Array.from({ length: D }, (_, j) => (i === j ? sigma2 : 0)),
  );
  const M = W[0]?.length ?? 0;
  for (let m = 0; m < M; m++) {
    const w = W.map((row) => row[m]);
    for (let i = 0; i < D; i++) {
      for (let j = 0; j < D; j++) {
        C[i][j] += w[i] * w[j];
      }
    }
  }

  const det = C[0][0] * C[1][1] - C[0][1] * C[1][0];
  if (det <= 0 || !Number.isFinite(det)) return NaN;

  const invC = [
    [C[1][1] / det, -C[0][1] / det],
    [-C[1][0] / det, C[0][0] / det],
  ];

  const trace =
    S[0][0] * invC[0][0] +
    S[0][1] * invC[1][0] +
    S[1][0] * invC[0][1] +
    S[1][1] * invC[1][1];

  return -0.5 * N * (D * Math.log(2 * Math.PI) + Math.log(det) + trace);
}
