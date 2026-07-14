/* -------------------------------------------------------------------------- */
/* Normalizing-flow architectures: Jacobian structure & cost                   */
/* -------------------------------------------------------------------------- */

export type FlowArchitecture = 'coupling' | 'autoregressive' | 'continuous';

export type CostResult = {
  bigO: string;
  operations: number;
  description: string;
};

/** Default tolerance for comparing floating-point values to zero. */
export const DEFAULT_TOL = 1e-9;

/**
 * Check whether a square matrix is lower triangular (or block-lower-triangular).
 * A matrix is lower triangular when all entries strictly above the diagonal are
 * (near) zero. Block-lower-triangular matrices also satisfy this condition.
 */
export function isLowerTriangular(J: number[][], tol = DEFAULT_TOL): boolean {
  const n = J.length;
  for (let i = 0; i < n; i++) {
    if (J[i].length !== n) return false;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(J[i][j]) > tol) return false;
    }
  }
  return true;
}

/**
 * Check whether a square matrix is triangular (lower or upper).
 * Triangular matrices have zero entries either above (lower) or below (upper)
 * the diagonal, which makes the determinant equal the product of diagonals.
 */
export function isTriangular(J: number[][], tol = DEFAULT_TOL): boolean {
  const n = J.length;
  let lower = true;
  let upper = true;
  for (let i = 0; i < n; i++) {
    if (J[i].length !== n) return false;
    for (let j = 0; j < i; j++) {
      if (Math.abs(J[i][j]) > tol) upper = false;
    }
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(J[i][j]) > tol) lower = false;
    }
    if (!lower && !upper) return false;
  }
  return lower || upper;
}

/**
 * Log-determinant of a triangular matrix = sum of log diagonal entries.
 * This is exact for coupling/autoregressive flows because their Jacobians are
 * triangular by construction.
 */
export function logDetTriangular(J: number[][]): number {
  const n = J.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const d = J[i][i];
    if (d === 0) return -Infinity;
    sum += Math.log(Math.abs(d));
  }
  return sum;
}

/**
 * Hutchinson stochastic trace estimator.
 * Trace(J) = E[v^T J v] for Rademacher vectors v with entries ±1.
 * Used by continuous normalizing flows (FFJORD) to avoid materialising the full
 * dense Jacobian during ODE integration.
 */
export function hutchinsonTraceEstimate(J: number[][], numSamples: number): number {
  const n = J.length;
  if (n === 0 || numSamples <= 0) return 0;

  let estimate = 0;
  for (let s = 0; s < numSamples; s++) {
    // Deterministic Rademacher sequence seeded by sample index for reproducibility.
    const v = rademacher(n, s);
    // Compute J v.
    const Jv = Array.from({ length: n }, (_, i) => J[i].reduce((acc, val, j) => acc + val * v[j], 0));
    let vTJvv = 0;
    for (let i = 0; i < n; i++) vTJvv += v[i] * Jv[i];
    estimate += vTJvv;
  }
  return estimate / numSamples;
}

function rademacher(n: number, seed: number): number[] {
  const rng = mulberry32(seed);
  return Array.from({ length: n }, () => (rng() < 0.5 ? -1 : 1));
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a representative Jacobian for each architecture.
 * - Coupling: lower-triangular (block diagonal for unchanged dimensions).
 * - Autoregressive: triangular, here lower-triangular for the natural ordering.
 * - Continuous: dense Jacobian of a free-form vector field f(x).
 */
export function buildRepresentativeJacobian(
  architecture: FlowArchitecture,
  dim: number,
  seed = 123,
): number[][] {
  const rng = mulberry32(seed);
  const J = Array.from({ length: dim }, () => Array.from({ length: dim }, () => 0));

  switch (architecture) {
    case 'coupling': {
      // First half of dimensions are copied (identity diagonal), the second half
      // is transformed using a neural network that depends only on the first half.
      const split = Math.floor(dim / 2);
      for (let i = 0; i < dim; i++) {
        for (let j = 0; j <= Math.min(i, split - 1); j++) {
          if (i < split) {
            J[i][j] = i === j ? 1 : 0;
          } else {
            J[i][j] = rng() * 0.6;
          }
        }
        if (i >= split) {
          // Identity-like diagonal for the transformed half so determinant is easy.
          J[i][i] = 0.9 + rng() * 0.2;
        }
      }
      break;
    }
    case 'autoregressive': {
      // Each output dimension i depends only on inputs 0..i (lower triangular).
      for (let i = 0; i < dim; i++) {
        for (let j = 0; j <= i; j++) {
          J[i][j] = j === i ? 0.8 + rng() * 0.4 : rng() * 0.5;
        }
      }
      break;
    }
    case 'continuous': {
      // Dense Jacobian of a free-form neural-network vector field.
      for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
          J[i][j] = (rng() - 0.5) * 1.2;
        }
        J[i][i] += 1.0; // strong diagonal for stability
      }
      break;
    }
  }

  return J;
}

/**
 * Sampling complexity for each architecture.
 * Coupling/autoregressive require one forward pass with at most O(D) layers for
 * a single transformation; continuous flows require solving an ODE over time.
 */
export function samplingCost(architecture: FlowArchitecture, dim: number): CostResult {
  switch (architecture) {
    case 'coupling':
      return {
        bigO: 'O(D)',
        operations: dim,
        description: 'One forward evaluation of the coupling transform plus cheap copy/split.',
      };
    case 'autoregressive':
      return {
        bigO: 'O(D) serial steps',
        operations: dim,
        description: 'Each dimension sampled conditioned on previous ones; cannot be fully parallelised.',
      };
    case 'continuous':
      return {
        bigO: 'O(T · D²)',
        operations: dim * dim * 100,
        description: 'ODE integration over T steps, each evaluating a dense vector field f.',
      };
  }
}

/**
 * Density-evaluation complexity for each architecture.
 *
 * Coupling and autoregressive flows have triangular Jacobians, so the log-determinant
 * is a cheap product of diagonal entries — the saving comes from structure, not from
 * having only O(D) non-zeros in the full D×D matrix.
 *
 * Continuous flows: an explicit dense Jacobian costs O(D³) for a determinant (or O(D²)
 * per ODE step). FFJORD avoids materialising the full Jacobian by using a Hutchinson
 * trace estimator. The toy explicit-matrix implementation below costs O(M·D²) because
 * it forms J and computes Jv; a real autodiff implementation costs O(M·C_f), where
 * C_f is the cost of one vector-field JVP/VJP.
 */
export function densityEvalCost(architecture: FlowArchitecture, dim: number): CostResult {
  switch (architecture) {
    case 'coupling':
      return {
        bigO: 'O(D)',
        operations: dim,
        description: 'Log-det = product of diagonal blocks; full Jacobian can still have O(D²) non-zeros.',
      };
    case 'autoregressive':
      return {
        bigO: 'O(D)',
        operations: dim,
        description: 'Log-det = product of conditional-scale diagonals; triangular part has D(D+1)/2 slots.',
      };
    case 'continuous':
      return {
        bigO: 'O(M·D²) toy / O(M·C_f) real',
        operations: dim * dim * 10,
        description: 'Explicit determinant is O(D³); Hutchinson trace estimate avoids forming the full Jacobian.',
      };
  }
}

/** Compute the exact trace of a square matrix. */
export function trace(J: number[][]): number {
  let t = 0;
  for (let i = 0; i < J.length; i++) t += J[i][i];
  return t;
}

/** Total number of entries in a square D×D Jacobian. */
export function totalEntries(J: number[][]): number {
  return J.length * J.length;
}

/** Number of diagonal entries in a square Jacobian. */
export function diagonalEntries(J: number[][]): number {
  return J.length;
}

/** Number of non-zero entries (above tolerance) in a matrix. */
export function nonzeroCount(J: number[][], tol = DEFAULT_TOL): number {
  return J.flat().filter((v) => Math.abs(v) > tol).length;
}

/** Maximum possible non-zero entries in a strictly lower-triangular D×D matrix. */
export function maxTriangularNonzeros(dim: number): number {
  return (dim * (dim + 1)) / 2;
}

/** Maximum possible non-zero entries in a block-lower-triangular coupling Jacobian with a split. */
export function maxCouplingNonzeros(dim: number): number {
  const split = Math.floor(dim / 2);
  // First split dimensions: identity diagonal only.
  // Second split dimensions: each depends on all first-split inputs plus its own diagonal.
  const secondHalf = dim - split;
  return split + secondHalf * (split + 1);
}

/**
 * Estimate the change in log-determinant for a continuous normalizing flow over
 * a unit time interval using the Hutchinson trace estimate.
 *
 * For an ODE dx/dt = f(x, t), the instantaneous change of log-det is
 * div f = trace(∂f/∂x). Therefore
 *   log p_1(x(1)) - log p_0(x(0)) = -∫_0^1 trace(J_f(x(t), t)) dt.
 * This helper returns the estimate for one such step.
 */
export function estimatedLogDetChange(
  J: number[][],
  numSamples: number,
  timeSpan = 1,
): number {
  const tr = hutchinsonTraceEstimate(J, numSamples);
  return -tr * timeSpan;
}
