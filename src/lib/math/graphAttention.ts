/* -------------------------------------------------------------------------- */
/* Graph Attention Network (single-head) helpers                               */
/* -------------------------------------------------------------------------- */

export type Vector = number[];

export interface GATGraph {
  nodes: Vector[]; // node features h_u
  /** Adjacency list: neighbors of each node (usually includes self-loop). */
  neighbors: number[][];
}

const LEAKY_RELU_SLOPE = 0.2;

function leakyReLU(x: number): number {
  return x >= 0 ? x : LEAKY_RELU_SLOPE * x;
}

/** Element-wise vector addition. */
function add(a: Vector, b: Vector): Vector {
  return a.map((v, i) => v + b[i]);
}

/** Scalar-vector multiplication. */
function scale(s: number, v: Vector): Vector {
  return v.map((x) => s * x);
}

/** Dot product of two equal-length vectors. */
function dot(a: Vector, b: Vector): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

/** Matrix-vector multiplication: W (out x in) times v (in). */
export function matVec(W: number[][], v: Vector): Vector {
  return W.map((row) => dot(row, v));
}

/** Concatenate two vectors. */
function concat(a: Vector, b: Vector): Vector {
  return [...a, ...b];
}

/**
 * Compute GAT attention coefficients α_{uv} for a fixed center node v.
 *
 * Returns scores and normalized weights. The score compares neighbor k against
 * the center v: e_{kv} = LeakyReLU(a^T [W h_k ‖ W h_v]).
 *
 * `a` is the attention vector of length 2 * outDim.
 */
export function computeAttention(
  graph: GATGraph,
  center: number,
  W: number[][],
  a: Vector,
): {
  neighbors: number[];
  scores: number[];
  weights: number[];
} {
  const h = graph.nodes;
  const neigh = graph.neighbors[center];
  const WhCenter = matVec(W, h[center]);
  const scores = neigh.map((k) => {
    const WhK = matVec(W, h[k]);
    const z = concat(WhK, WhCenter);
    return leakyReLU(dot(a, z));
  });

  const maxScore = Math.max(...scores, -Infinity);
  const expScores = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = expScores.reduce((s, v) => s + v, 0);
  const weights = expScores.map((v) => v / sumExp);

  return { neighbors: neigh, scores, weights };
}

/**
 * GAT aggregation at node v: Σ_{k∈N(v)} α_{kv} W h_k.
 */
export function gatAggregate(
  graph: GATGraph,
  center: number,
  W: number[][],
  a: Vector,
): Vector {
  const { neighbors, weights } = computeAttention(graph, center, W, a);
  const outDim = W.length;
  let out = new Array(outDim).fill(0);
  for (let i = 0; i < neighbors.length; i++) {
    const k = neighbors[i];
    const WhK = matVec(W, graph.nodes[k]);
    out = add(out, scale(weights[i], WhK));
  }
  return out;
}

/**
 * Simple GCN aggregation at node v: mean of transformed neighbors.
 * (GCN normalization is often degree-based; here we use the common mean-pool
 * baseline to contrast with learnable GAT weights.)
 */
export function gcnMeanAggregate(
  graph: GATGraph,
  center: number,
  W: number[][],
): Vector {
  const neigh = graph.neighbors[center];
  const outDim = W.length;
  let out = new Array(outDim).fill(0);
  for (const k of neigh) {
    out = add(out, matVec(W, graph.nodes[k]));
  }
  return scale(1 / (neigh.length || 1), out);
}

/**
 * Build a simple graph for demos: a center node plus 3 neighbors.
 */
export function starGraph(centerFeature: Vector, neighborFeatures: Vector[]): GATGraph {
  const nodes = [centerFeature, ...neighborFeatures];
  const centerNeighbors = nodes.map((_, i) => i);
  const neighbors: number[][] = [centerNeighbors];
  for (let i = 1; i < nodes.length; i++) {
    neighbors.push([i, 0]);
  }
  return { nodes, neighbors };
}
