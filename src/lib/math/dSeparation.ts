/* -------------------------------------------------------------------------- */
/* d-separation for small directed acyclic graphs                              */
/* -------------------------------------------------------------------------- */

export type NodeId = string;

export interface DAG {
  nodes: NodeId[];
  edges: [NodeId, NodeId][]; // parent -> child
}

interface Adj {
  parents: Record<NodeId, NodeId[]>;
  children: Record<NodeId, NodeId[]>;
}

function buildAdj(graph: DAG): Adj {
  const parents: Record<NodeId, NodeId[]> = {};
  const children: Record<NodeId, NodeId[]> = {};
  for (const n of graph.nodes) {
    parents[n] = [];
    children[n] = [];
  }
  for (const [p, c] of graph.edges) {
    children[p].push(c);
    parents[c].push(p);
  }
  return { parents, children };
}

/** Return the set of descendants of `node` (including the node itself). */
export function descendants(graph: DAG, node: NodeId): Set<NodeId> {
  const { children } = buildAdj(graph);
  const visited = new Set<NodeId>();
  const stack: NodeId[] = [node];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const ch of children[cur] ?? []) {
      if (!visited.has(ch)) stack.push(ch);
    }
  }
  return visited;
}

/** Internal structure of one undirected trail in the moral graph. */
interface Trail {
  nodes: NodeId[];
  // For each internal node, whether it is a collider along this trail
  collider: boolean[];
}

/** Enumerate all simple undirected trails between source and target. */
function enumerateTrails(graph: DAG, source: NodeId, target: NodeId): Trail[] {
  const { parents, children } = buildAdj(graph);
  const trails: Trail[] = [];

  function isParentOf(a: NodeId, b: NodeId): boolean {
    return (parents[b] ?? []).includes(a);
  }

  function dfs(path: NodeId[], visited: Set<NodeId>) {
    const cur = path[path.length - 1];
    if (cur === target) {
      if (path.length >= 2) {
        const collider: boolean[] = [];
        for (let i = 1; i < path.length - 1; i++) {
          const prev = path[i - 1];
          const mid = path[i];
          const next = path[i + 1];
          // collider if both edges point into mid: prev -> mid <- next
          const prevIsParent = isParentOf(prev, mid);
          const nextIsParent = isParentOf(next, mid);
          collider.push(prevIsParent && nextIsParent);
        }
        trails.push({ nodes: [...path], collider });
      }
      return;
    }
    const neighbors = [...(parents[cur] ?? []), ...(children[cur] ?? [])];
    for (const nb of neighbors) {
      if (!visited.has(nb)) {
        visited.add(nb);
        path.push(nb);
        dfs(path, visited);
        path.pop();
        visited.delete(nb);
      }
    }
  }

  const visited = new Set<NodeId>();
  visited.add(source);
  dfs([source], visited);
  return trails;
}

/**
 * Return true if the trail is active given the conditioning set `observed`.
 *
 * Rules for an internal node B on a trail:
 * - Non-collider: active iff B is NOT in `observed`.
 * - Collider: active iff B or any descendant of B is in `observed`.
 */
export function isTrailActive(
  graph: DAG,
  trail: Trail,
  observed: Set<NodeId>,
): boolean {
  const descCache = new Map<NodeId, Set<NodeId>>();
  for (let i = 1; i < trail.nodes.length - 1; i++) {
    const node = trail.nodes[i];
    const isCollider = trail.collider[i - 1];
    if (isCollider) {
      let desc = descCache.get(node);
      if (!desc) {
        desc = descendants(graph, node);
        descCache.set(node, desc);
      }
      const conditioned = [...desc].some((d) => observed.has(d));
      if (!conditioned) return false;
    } else {
      if (observed.has(node)) return false;
    }
  }
  return true;
}

/**
 * Test whether X and Y are d-separated given the observed set Z.
 *
 * X and Y are d-separated iff no undirected trail between them is active.
 */
export function isDSeparated(
  graph: DAG,
  x: NodeId,
  y: NodeId,
  observed: NodeId[] | Set<NodeId>,
): boolean {
  const obs = observed instanceof Set ? observed : new Set(observed);
  // Conditioning on an endpoint makes the conditional independence trivial.
  if (obs.has(x) || obs.has(y)) return true;
  const trails = enumerateTrails(graph, x, y);
  return !trails.some((t) => isTrailActive(graph, t, obs));
}

/** Return all active trails between x and y given Z (useful for diagnostics). */
export function activeTrails(
  graph: DAG,
  x: NodeId,
  y: NodeId,
  observed: NodeId[] | Set<NodeId>,
): NodeId[][] {
  const obs = observed instanceof Set ? observed : new Set(observed);
  return enumerateTrails(graph, x, y)
    .filter((t) => isTrailActive(graph, t, obs))
    .map((t) => t.nodes);
}
