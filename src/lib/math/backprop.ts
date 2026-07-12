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

export type StepBwdDetail = {
  nodeId: string;
  incomingAdjoint: number;
  parentId: string;
  localDerivative: number;
  contribution: number;
  previousAdjoint: number;
  newAdjoint: number;
};

export type TapeEntry = {
  nodeId: string;
  op: OpType | 'input' | 'weight';
  inputs: string[];
  output: number;
  inputValues: number[];
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
 * Compute local gradients for a single node's inputs from forward values.
 */
export function computeLocalGrads(
  node: NodeSpec,
  fwdVals: Record<string, number>,
): Record<string, number> | undefined {
  if (node.inputs.length === 0) return undefined;
  const inVals = node.inputs.map((id) => fwdVals[id]);
  const outVal = fwdVals[node.id];
  if (inVals.some((v) => v === undefined) || outVal === undefined) return undefined;
  const localGrads: Record<string, number> = {};
  for (let i = 0; i < node.inputs.length; i++) {
    localGrads[node.inputs[i]] = localDeriv(node.op as OpType, outVal, inVals, i);
  }
  return localGrads;
}

/**
 * Run full forward pass and produce a tape of intermediate primal values.
 */
export function forwardTape(nodes: NodeSpec[]): { values: Record<string, number>; tape: TapeEntry[] } {
  const values: Record<string, number> = {};
  const tape: TapeEntry[] = [];
  const order = topoSort(nodes);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  for (const id of order) {
    const n = nodeMap.get(id)!;
    if (n.op === 'input' || n.op === 'weight') {
      values[id] = n.value;
      tape.push({ nodeId: id, op: n.op, inputs: [], output: n.value, inputValues: [] });
    } else {
      const inVals = n.inputs.map((inId) => values[inId]);
      const out = evalNode(n.op as OpType, inVals);
      values[id] = out;
      tape.push({ nodeId: id, op: n.op as OpType, inputs: n.inputs, output: out, inputValues: inVals });
    }
  }
  return { values, tape };
}

/**
 * Estimate reverse-mode memory cost from a forward tape.
 * Counts every stored scalar (each output and each saved input value).
 */
export function tapeMemoryCost(tape: TapeEntry[]): { count: number; bytesEstimate: number } {
  const count = tape.reduce((sum, e) => sum + 1 + e.inputValues.length, 0);
  return { count, bytesEstimate: count * 8 };
}

/**
 * Whether backward stepping is currently allowed.
 * Enabled after a full forward pass or after stepping forward to completion.
 */
export function canStepBackward(
  fwdVals: Record<string, number> | null,
  stepFwdIdx: number | null,
  orderLength: number,
): boolean {
  return fwdVals !== null || stepFwdIdx === orderLength - 1;
}

/**
 * Advance the step-by-step forward pass by one node.
 */
export function stepForwardOnce(
  nodes: NodeSpec[],
  order: string[],
  stepFwdIdx: number | null,
  stepFwdVals: Record<string, number>,
): { stepFwdIdx: number; stepFwdVals: Record<string, number>; tapeEntry: TapeEntry } | null {
  const next = stepFwdIdx === null ? 0 : stepFwdIdx + 1;
  if (next >= order.length) return null;
  const node = nodes.find((n) => n.id === order[next])!;
  const vals: Record<string, number> = {};
  let tapeEntry: TapeEntry;
  if (node.op === 'input' || node.op === 'weight') {
    vals[node.id] = node.value;
    tapeEntry = { nodeId: node.id, op: node.op, inputs: [], output: node.value, inputValues: [] };
  } else {
    const inVals = node.inputs.map((inId) => stepFwdVals[inId]);
    const out = evalNode(node.op as OpType, inVals);
    vals[node.id] = out;
    tapeEntry = { nodeId: node.id, op: node.op as OpType, inputs: node.inputs, output: out, inputValues: inVals };
  }
  return { stepFwdIdx: next, stepFwdVals: { ...stepFwdVals, ...vals }, tapeEntry };
}

/**
 * Advance the step-by-step backward pass by one node.
 * Requires forward values for the active node to be available in `stepFwdVals`
 * (or supplied via `fwdVals` fallback); otherwise throws.
 */
export function stepBackwardOnce(
  nodes: NodeSpec[],
  order: string[],
  revOrder: string[],
  stepBwdIdx: number | null,
  stepFwdVals: Record<string, number>,
  fwdVals: Record<string, number> | null,
  stepBwdGrads: Record<string, number>,
): { stepBwdIdx: number; stepBwdGrads: Record<string, number>; details: StepBwdDetail[] } | null {
  const next = stepBwdIdx === null ? 0 : stepBwdIdx + 1;
  if (next >= revOrder.length) return null;
  const nodeId = revOrder[next];
  const node = nodes.find((n) => n.id === nodeId)!;
  const g = { ...stepBwdGrads };
  const details: StepBwdDetail[] = [];

  if (stepBwdIdx === null) {
    for (const id of order) g[id] = 0;
    g[revOrder[0]] = 1; // output node adjoint
  }

  if (node.inputs.length > 0) {
    const inVals = node.inputs.map((inId) => {
      const v = stepFwdVals[inId] ?? fwdVals?.[inId];
      if (v === undefined) {
        throw new Error(`Forward value missing for input ${inId} of node ${nodeId} at backward step ${next}`);
      }
      return v;
    });
    const outVal = stepFwdVals[nodeId] ?? fwdVals?.[nodeId];
    if (outVal === undefined) {
      throw new Error(`Forward value missing for node ${nodeId} at backward step ${next}`);
    }
    for (let i = 0; i < node.inputs.length; i++) {
      const parentId = node.inputs[i];
      const previousAdjoint = g[parentId] ?? 0;
      const incomingAdjoint = g[nodeId] ?? 0;
      const localDerivative = localDeriv(node.op as OpType, outVal, inVals, i);
      const contribution = incomingAdjoint * localDerivative;
      g[parentId] = previousAdjoint + contribution;
      details.push({
        nodeId,
        incomingAdjoint,
        parentId,
        localDerivative,
        contribution,
        previousAdjoint,
        newAdjoint: g[parentId],
      });
    }
  }

  return { stepBwdIdx: next, stepBwdGrads: g, details };
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
