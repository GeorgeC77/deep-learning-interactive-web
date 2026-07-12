/* -------------------------------------------------------------------------- */
/* Graph neural network — message passing & permutation (in)variance          */
/* -------------------------------------------------------------------------- */

export type Activation = 'relu' | 'tanh';

export function applyActivation(x: number, activation: Activation): number {
  if (activation === 'tanh') return Math.tanh(x);
  return Math.max(0, x);
}

export function adjacencyFromEdges(n: number, edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (const [u, v] of edges) {
    adj[u][v] = 1;
    adj[v][u] = 1;
  }
  return adj;
}

/** Permute an adjacency matrix: P A P^T. */
export function permuteAdjacency(adj: number[][], perm: number[]): number[][] {
  const N = adj.length;
  return Array.from({ length: N }, (_, i) =>
    Array.from({ length: N }, (_, j) => adj[perm[i]][perm[j]]),
  );
}

/** Apply a permutation to a vector: P x. */
export function permuteVector<T>(vec: T[], perm: number[]): T[] {
  return Array.from({ length: vec.length }, (_, i) => vec[perm[i]]);
}

/** Mean aggregation from neighbors. */
function neighborMean(adj: number[][], features: number[]): number[] {
  const N = adj.length;
  return Array.from({ length: N }, (_, i) => {
    const neighbors: number[] = [];
    for (let j = 0; j < N; j++) {
      if (adj[i][j] !== 0) neighbors.push(features[j]);
    }
    if (neighbors.length === 0) return 0;
    return neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
  });
}

/**
 * Message passing with mean aggregation.
 * @param adj      N x N adjacency matrix (symmetric, unweighted).
 * @param features Initial scalar feature per node, length N.
 * @param rounds   Number of message-passing layers.
 * @param wSelf    Weight on self feature.
 * @param wNeighbor Weight on aggregated neighbor message.
 * @param activation Non-linearity.
 * @returns history Array of length rounds+1; history[0] = initial features.
 */
export function messagePassing(
  adj: number[][],
  features: number[],
  rounds: number,
  wSelf: number,
  wNeighbor: number,
  activation: Activation,
): number[][] {
  const history: number[][] = [[...features]];
  let current = [...features];
  for (let l = 0; l < rounds; l++) {
    const msg = neighborMean(adj, current);
    current = current.map((h, i) => applyActivation(wSelf * h + wNeighbor * msg[i], activation));
    history.push([...current]);
  }
  return history;
}

/** Graph-level readout: mean of final node features. */
export function readout(history: number[][]): number {
  const finalFeatures = history[history.length - 1];
  return finalFeatures.reduce((a, b) => a + b, 0) / finalFeatures.length;
}

/** Compute permutation equivariance error: max || H(PAP^T, PX) - P H(A,X) ||. */
export function permutationEquivarianceError(
  adj: number[][],
  features: number[],
  perm: number[],
  rounds: number,
  wSelf: number,
  wNeighbor: number,
  activation: Activation,
): number {
  const permutedAdj = permuteAdjacency(adj, perm);
  const permutedFeatures = permuteVector(features, perm);
  const h1 = messagePassing(permutedAdj, permutedFeatures, rounds, wSelf, wNeighbor, activation);
  const h2 = messagePassing(adj, features, rounds, wSelf, wNeighbor, activation).map((row) =>
    permuteVector(row, perm),
  );
  let maxErr = 0;
  for (let l = 0; l < h1.length; l++) {
    for (let i = 0; i < h1[l].length; i++) {
      maxErr = Math.max(maxErr, Math.abs(h1[l][i] - h2[l][i]));
    }
  }
  return maxErr;
}

/** Compute permutation invariance error: |readout(H_permuted) - readout(H_original)|. */
export function permutationInvarianceError(
  adj: number[][],
  features: number[],
  perm: number[],
  rounds: number,
  wSelf: number,
  wNeighbor: number,
  activation: Activation,
): number {
  const permutedAdj = permuteAdjacency(adj, perm);
  const permutedFeatures = permuteVector(features, perm);
  const hPerm = messagePassing(permutedAdj, permutedFeatures, rounds, wSelf, wNeighbor, activation);
  const hOrig = messagePassing(adj, features, rounds, wSelf, wNeighbor, activation);
  return Math.abs(readout(hPerm) - readout(hOrig));
}

/** Variance of node features. */
export function nodeFeatureVariance(features: number[]): number {
  const mean = features.reduce((a, b) => a + b, 0) / features.length;
  return features.reduce((s, v) => s + (v - mean) ** 2, 0) / features.length;
}

/** Pairwise Euclidean distances between node representation vectors. */
export function pairwiseDistances(values: number[]): number[][] {
  const N = values.length;
  return Array.from({ length: N }, (_, i) =>
    Array.from({ length: N }, (_, j) => Math.abs(values[i] - values[j])),
  );
}
