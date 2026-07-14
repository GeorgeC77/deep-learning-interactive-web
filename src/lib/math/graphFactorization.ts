/* -------------------------------------------------------------------------- */
/* Bayesian network factorization helpers                                      */
/* -------------------------------------------------------------------------- */

export type NodeId = string;

export interface DAG {
  nodes: NodeId[];
  edges: [NodeId, NodeId][]; // parent -> child
}

export interface FactorizationResult {
  /** LaTeX factorization string, e.g. p(x_1)p(x_2\mid x_1)\prod... */
  latex: string;
  /** Ordered node list after topological sort. */
  order: NodeId[];
  /** Map from node to its parent set. */
  parents: Record<NodeId, NodeId[]>;
}

function buildParents(graph: DAG): Record<NodeId, NodeId[]> {
  const parents: Record<NodeId, NodeId[]> = {};
  for (const n of graph.nodes) {
    parents[n] = [];
  }
  for (const [p, c] of graph.edges) {
    parents[c].push(p);
  }
  return parents;
}

/** Topological sort; returns [] if cycle detected. */
export function topologicalSort(graph: DAG): NodeId[] {
  const parents = buildParents(graph);
  const children: Record<NodeId, NodeId[]> = {};
  for (const n of graph.nodes) children[n] = [];
  for (const [p, c] of graph.edges) children[p].push(c);

  const inDegree: Record<NodeId, number> = {};
  for (const n of graph.nodes) inDegree[n] = parents[n].length;

  const queue = graph.nodes.filter((n) => inDegree[n] === 0);
  const result: NodeId[] = [];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    result.push(cur);
    for (const ch of children[cur]) {
      inDegree[ch]--;
      if (inDegree[ch] === 0) queue.push(ch);
    }
  }

  return result.length === graph.nodes.length ? result : [];
}

/** Convert a node id to a LaTeX subscript, e.g. "x_1" stays "x_1". */
function latexNode(node: NodeId): string {
  return `x_{${node}}`;
}

/**
 * Build the general Bayesian network factorization
 * p(x) = ∏_i p(x_i | pa_i).
 */
export function factorization(graph: DAG): FactorizationResult {
  const order = topologicalSort(graph);
  const parents = buildParents(graph);

  const parts = order.map((node) => {
    const pa = parents[node];
    const childLatex = latexNode(node);
    if (pa.length === 0) return `p(${childLatex})`;
    const paLatex = pa.map(latexNode).join(', ');
    return `p(${childLatex} \\mid ${paLatex})`;
  });

  const latex = parts.length <= 1
    ? parts.join('')
    : `p(\\mathbf{x}) = ${parts.join('\\,')}`;

  return { latex, order, parents };
}

/**
 * Remove a directed edge from the DAG and return the updated factorization.
 * Removing an edge means the child loses one parent.
 */
export function removeEdgeFactorization(graph: DAG, edge: [NodeId, NodeId]): FactorizationResult {
  const newEdges = graph.edges.filter((e) => !(e[0] === edge[0] && e[1] === edge[1]));
  return factorization({ nodes: [...graph.nodes], edges: newEdges });
}

/**
 * Detect whether the DAG is exactly a first-order Markov chain in topological order.
 * (Every node has at most one parent, and parents form a chain.)
 */
export function isFirstOrderMarkovChain(graph: DAG): boolean {
  const order = topologicalSort(graph);
  if (order.length !== graph.nodes.length) return false;
  const parents = buildParents(graph);
  for (let i = 0; i < order.length; i++) {
    const node = order[i];
    const pa = parents[node];
    if (pa.length > 1) return false;
    if (pa.length === 1 && pa[0] !== order[i - 1]) return false;
    if (i === 0 && pa.length !== 0) return false;
  }
  return true;
}

/**
 * Build the first-order Markov chain factorization string
 * p(x_1) ∏_{i=2}^{N} p(x_i | x_{i-1}) for display as a special case.
 */
export function markovChainFactorization(graph: DAG): string | null {
  if (!isFirstOrderMarkovChain(graph)) return null;
  const order = topologicalSort(graph);
  if (order.length === 0) return null;
  const first = latexNode(order[0]);
  if (order.length === 1) return `p(${first})`;
  const prod = order
    .slice(1)
    .map((node, idx) => `p(${latexNode(node)} \\mid ${latexNode(order[idx])})`)
    .join('\\,');
  return `p(\\mathbf{x}) = p(${first})\\,${prod}`;
}
