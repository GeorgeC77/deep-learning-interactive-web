/* -------------------------------------------------------------------------- */
/* Backpropagation math — extracted from BackpropagationLab                    */
/* -------------------------------------------------------------------------- */

export type OpType = 'add' | 'multiply' | 'sin' | 'exp' | 'relu' | 'sigmoid' | 'square';

export type NodeSpec = {
  id: string;
  op: OpType | 'input' | 'weight';
  inputs: string[];
  value: number;
};

export function evalNode(op: OpType, inVals: number[]): number {
  switch (op) {
    case 'add': return inVals.reduce((s, v) => s + v, 0);
    case 'multiply': return inVals.reduce((p, v) => p * v, 1);
    case 'sin': return Math.sin(inVals[0]);
    case 'exp': return Math.exp(inVals[0]);
    case 'relu': return Math.max(0, inVals[0]);
    case 'sigmoid': return 1 / (1 + Math.exp(-inVals[0]));
    case 'square': return inVals[0] * inVals[0];
  }
}

export function localDeriv(op: OpType, outVal: number, inVals: number[], inIdx: number): number {
  switch (op) {
    case 'add': return 1;
    case 'multiply': return inVals[1 - inIdx];
    case 'sin': return Math.cos(inVals[0]);
    case 'exp': return Math.exp(inVals[0]);
    case 'relu': return inVals[0] > 0 ? 1 : 0;
    case 'sigmoid': return outVal * (1 - outVal);
    case 'square': return 2 * inVals[0];
  }
}

export function topoSort(nodes: NodeSpec[]): string[] {
  const inDegree = new Map<string, number>();
  const order: string[] = [];
  nodes.forEach((n) => inDegree.set(n.id, n.inputs.length));
  const queue = nodes.filter((n) => n.inputs.length === 0).map((n) => n.id);
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    nodes.filter((n) => n.inputs.includes(id)).forEach((n) => {
      const deg = (inDegree.get(n.id) ?? 1) - 1;
      inDegree.set(n.id, deg);
      if (deg === 0) queue.push(n.id);
    });
  }
  return order;
}

/**
 * Run full forward pass on a DAG.
 * Returns updated node values.
 */
export function forwardPass(nodes: NodeSpec[]): Record<string, number> {
  const values: Record<string, number> = {};
  const order = topoSort(nodes);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  for (const id of order) {
    const n = nodeMap.get(id)!;
    if (n.op === 'input' || n.op === 'weight') {
      values[id] = n.value;
    } else {
      const inVals = n.inputs.map((inId) => values[inId]);
      values[id] = evalNode(n.op as OpType, inVals);
    }
  }
  return values;
}

/**
 * Run a single backward pass.
 * Nodes must have forward values computed.
 * Returns adjoints (gradients) for all nodes.
 */
export function backwardPass(
  nodes: NodeSpec[],
  fwdVals: Record<string, number>,
): { grads: Record<string, number>; localGrads: Record<string, Record<string, number>> } {
  const grads: Record<string, number> = {};
  const localGrads: Record<string, Record<string, number>> = {};
  const order = topoSort(nodes);
  const revOrder = [...order].reverse();

  // Initialize
  for (const id of order) grads[id] = 0;
  grads[revOrder[0]] = 1; // output node gets adjoint=1

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Process every node in reverse order, including the output node
  for (const id of revOrder) {
    const n = nodeMap.get(id)!;
    if (n.inputs.length === 0) continue; // input/weight — nothing to propagate
    const inVals = n.inputs.map((inId) => fwdVals[inId]);
    localGrads[id] = {};
    for (let i = 0; i < n.inputs.length; i++) {
      const localG = localDeriv(n.op as OpType, fwdVals[id], inVals, i);
      localGrads[id][n.inputs[i]] = localG;
      grads[n.inputs[i]] += grads[id] * localG;
    }
  }
  return { grads, localGrads };
}

/**
 * Central difference numerical gradient.
 * f: (params: number[]) => number computes scalar output.
 * idx: which parameter to differentiate wrt.
 * h: step size.
 */
export function centralDiff(f: (params: number[]) => number, params: number[], idx: number, h: number): number {
  const plus = [...params];
  const minus = [...params];
  plus[idx] += h;
  minus[idx] -= h;
  return (f(plus) - f(minus)) / (2 * h);
}
