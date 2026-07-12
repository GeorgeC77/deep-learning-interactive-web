import { describe, it, expect } from 'vitest';
import {
  topoSort,
  forwardPass,
  forwardTape,
  backwardPass,
  centralDiff,
  evalNode,
  computeLocalGrads,
  stepForwardOnce,
  stepBackwardOnce,
  tapeMemoryCost,
  type NodeSpec,
} from '../lib/math/backprop';

/* -------------------------------------------------------------------------- */
/* Test graph: f(x,w1,w2) = w2 * sin(w1 * x + 1)                              */
/* -------------------------------------------------------------------------- */
const graph: NodeSpec[] = [
  { id: 'x',   op: 'input',    inputs: [],       value: 2.0 },
  { id: 'w1',  op: 'weight',   inputs: [],       value: 0.8 },
  { id: 'b',   op: 'input',    inputs: [],       value: 1.0 },
  { id: 'mul1',op: 'multiply', inputs: ['x','w1'],value:0 },
  { id: 'add1',op: 'add',      inputs: ['mul1','b'],value:0 },
  { id: 'sin1',op: 'sin',      inputs: ['add1'],  value:0 },
  { id: 'w2',  op: 'weight',   inputs: [],       value: 1.5 },
  { id: 'mul2',op: 'multiply', inputs: ['sin1','w2'],value:0 },
];

/** Closed-form: f = w2 * sin(w1*x+1), ∂f/∂w1 = w2 * cos(w1*x+1) * x */
function closedFormAnalytic(x: number, w1: number, w2: number): { w1: number; w2: number } {
  const inner = w1 * x + 1;
  return {
    w1: w2 * Math.cos(inner) * x,
    w2: Math.sin(inner),
  };
}

function runStepForwardAll(nodes: NodeSpec[], order: string[]) {
  let stepFwdIdx: number | null = null;
  let stepFwdVals: Record<string, number> = {};
  while (true) {
    const res = stepForwardOnce(nodes, order, stepFwdIdx, stepFwdVals);
    if (!res) break;
    stepFwdIdx = res.stepFwdIdx;
    stepFwdVals = res.stepFwdVals;
  }
  return { stepFwdIdx, stepFwdVals };
}

function runStepBackwardAll(
  nodes: NodeSpec[],
  order: string[],
  revOrder: string[],
  stepFwdVals: Record<string, number>,
  fwdVals: Record<string, number> | null,
) {
  let stepBwdIdx: number | null = null;
  let stepBwdGrads: Record<string, number> = {};
  let allDetails: ReturnType<typeof stepBackwardOnce>['details'] = [];
  while (true) {
    const res = stepBackwardOnce(nodes, order, revOrder, stepBwdIdx, stepFwdVals, fwdVals, stepBwdGrads);
    if (!res) break;
    stepBwdIdx = res.stepBwdIdx;
    stepBwdGrads = res.stepBwdGrads;
    allDetails = allDetails.concat(res.details);
  }
  return { stepBwdIdx, stepBwdGrads, allDetails };
}

describe('backprop', () => {
  it('topological sort covers all nodes', () => {
    const order = topoSort([...graph]);
    expect(order.length).toBe(graph.length);
    // inputs must come before consumers
    const idx = (id: string) => order.indexOf(id);
    expect(idx('x')).toBeLessThan(idx('mul1'));
    expect(idx('w1')).toBeLessThan(idx('mul1'));
    expect(idx('mul1')).toBeLessThan(idx('add1'));
    expect(idx('b')).toBeLessThan(idx('add1'));
    expect(idx('add1')).toBeLessThan(idx('sin1'));
    expect(idx('sin1')).toBeLessThan(idx('mul2'));
    expect(idx('w2')).toBeLessThan(idx('mul2'));
  });

  it('forward pass computes correct output', () => {
    const vals = forwardPass([...graph]);
    const x = graph[0].value, w1 = graph[1].value, w2 = graph[6].value;
    const expected = w2 * Math.sin(w1 * x + 1);
    expect(vals['mul2']).toBeCloseTo(expected, 10);
  });

  it('w1 analytic gradient matches closed-form', () => {
    const vals = forwardPass([...graph]);
    const { grads } = backwardPass([...graph], vals);
    const x = graph[0].value, w1 = graph[1].value, w2 = graph[6].value;
    const cf = closedFormAnalytic(x, w1, w2);
    expect(grads['w1']).toBeCloseTo(cf.w1, 10);
  });

  it('w2 analytic gradient matches closed-form', () => {
    const vals = forwardPass([...graph]);
    const { grads } = backwardPass([...graph], vals);
    const x = graph[0].value, w1 = graph[1].value, w2 = graph[6].value;
    const cf = closedFormAnalytic(x, w1, w2);
    expect(grads['w2']).toBeCloseTo(cf.w2, 10);
  });

  it('central difference relative error < 1e-5 for w1', () => {
    const x = graph[0].value, w1 = graph[1].value, w2 = graph[6].value;
    const params = [w1, w2];
    const analyticGrad = closedFormAnalytic(x, w1, w2).w1;
    const fWrap = (p: number[]) => {
      const g: NodeSpec[] = JSON.parse(JSON.stringify(graph));
      g[1].value = p[0];
      g[6].value = p[1];
      return forwardPass(g)['mul2'];
    };
    const numGrad = centralDiff(fWrap, params, 0, 1e-5);
    const relErr = Math.abs(numGrad - analyticGrad) / Math.max(1e-12, Math.abs(numGrad));
    expect(relErr).toBeLessThan(1e-5);
  });

  it('branched graph gradients accumulate correctly', () => {
    // Graph: y = x^2 + sin(x), dy/dx = 2x + cos(x)
    const xVal = 1.5;
    const g2: NodeSpec[] = [
      { id: 'x',  op: 'input', inputs: [], value: xVal },
      { id: 'x2', op: 'square', inputs: ['x'], value: 0 },
      { id: 'sx', op: 'sin', inputs: ['x'], value: 0 },
      { id: 'y',  op: 'add', inputs: ['x2','sx'], value: 0 },
    ];
    const vals = forwardPass(g2);
    expect(vals['y']).toBeCloseTo(xVal * xVal + Math.sin(xVal), 10);
    const { grads } = backwardPass(g2, vals);
    expect(grads['x']).toBeCloseTo(2 * xVal + Math.cos(xVal), 10);
  });

  it('evalNode operations', () => {
    expect(evalNode('add', [3, 5])).toBe(8);
    expect(evalNode('multiply', [3, 5])).toBe(15);
    expect(evalNode('relu', [-2])).toBe(0);
    expect(evalNode('relu', [3])).toBe(3);
    expect(evalNode('sin', [0])).toBeCloseTo(0, 10);
    expect(evalNode('square', [4])).toBe(16);
  });

  it('stepBwdGrads matches backwardPass after full forward + backward step', () => {
    const nodes = JSON.parse(JSON.stringify(graph)) as NodeSpec[];
    const order = topoSort(nodes);
    const revOrder = [...order].reverse();
    const fwdVals = forwardPass(nodes);

    const { stepFwdVals } = runStepForwardAll(nodes, order);
    expect(stepFwdVals).toEqual(fwdVals);

    const { stepBwdGrads } = runStepBackwardAll(nodes, order, revOrder, stepFwdVals, fwdVals);
    const { grads } = backwardPass(nodes, fwdVals);
    for (const id of order) {
      expect(stepBwdGrads[id]).toBeCloseTo(grads[id], 10);
    }
  });

  it('edge magnitudes during stepping equal |g_upstream * localGrad|', () => {
    const nodes = JSON.parse(JSON.stringify(graph)) as NodeSpec[];
    const order = topoSort(nodes);
    const revOrder = [...order].reverse();
    const fwdVals = forwardPass(nodes);
    const { stepFwdVals } = runStepForwardAll(nodes, order);

    let stepBwdIdx: number | null = null;
    let stepBwdGrads: Record<string, number> = {};

    for (let i = 0; i < revOrder.length; i++) {
      const res = stepBackwardOnce(nodes, order, revOrder, stepBwdIdx, stepFwdVals, fwdVals, stepBwdGrads);
      expect(res).not.toBeNull();
      stepBwdIdx = res!.stepBwdIdx;
      stepBwdGrads = res!.stepBwdGrads;

      // For every edge updated in this step, the UI edge magnitude is
      // |upstream_adjoint * local_derivative|. Recompute it independently
      // from the stepped gradients and forward values and verify it matches
      // the contribution recorded for that edge.
      for (const d of res!.details) {
        const node = nodes.find((n) => n.id === d.nodeId)!;
        const lgs = computeLocalGrads(node, stepFwdVals);
        const upstream = stepBwdGrads[d.nodeId] ?? 0;
        const localGrad = lgs?.[d.parentId] ?? 0;
        const expectedMag = Math.abs(upstream * localGrad);
        expect(expectedMag).toBeCloseTo(Math.abs(d.contribution), 10);
      }
    }
  });

  it('numerical gradient selector correctly targets the chosen leaf', () => {
    const nodes = JSON.parse(JSON.stringify(graph)) as NodeSpec[];
    const order = topoSort(nodes);
    const outputId = order[order.length - 1];
    const { grads } = backwardPass(nodes, forwardPass(nodes));

    for (const leaf of nodes.filter((n) => n.op === 'input' || n.op === 'weight')) {
      const f = (p: number[]) => {
        const g = JSON.parse(JSON.stringify(nodes)) as NodeSpec[];
        g.forEach((n) => {
          if (n.id === leaf.id) n.value = p[0];
        });
        return forwardPass(g)[outputId];
      };
      const numGrad = centralDiff(f, [leaf.value], 0, 1e-5);
      expect(numGrad).toBeCloseTo(grads[leaf.id], 6);
    }
  });

  it('numerical gradient should not be compared against a fake zero analytic gradient', () => {
    const nodes = JSON.parse(JSON.stringify(graph)) as NodeSpec[];
    const leaf = nodes.find((n) => n.id === 'w1')!;

    // Before any backward pass, no analytic gradient exists yet.
    const fwdVals = forwardPass(nodes);
    const analyticBefore: Record<string, number> = {};
    expect(analyticBefore['w1']).toBeUndefined();

    // Numerical gradient can still be computed from forward-only values,
    // but it must not be compared to a fabricated zero.
    const f = (p: number[]) => {
      const g = JSON.parse(JSON.stringify(nodes)) as NodeSpec[];
      g.forEach((n) => {
        if (n.id === 'w1') n.value = p[0];
      });
      return forwardPass(g)['mul2'];
    };
    const numGrad = centralDiff(f, [leaf.value], 0, 1e-5);
    expect(numGrad).not.toBe(0);

    // Only after backwardPass does a real analytic gradient exist.
    const { grads } = backwardPass(nodes, fwdVals);
    expect(grads['w1']).toBeDefined();
    expect(grads['w1']).toBeCloseTo(numGrad, 6);
  });

  it('tape records expected forward intermediates', () => {
    const nodes = JSON.parse(JSON.stringify(graph)) as NodeSpec[];
    const { values, tape } = forwardTape(nodes);

    expect(tape.length).toBe(nodes.length);
    const byId = new Map(tape.map((e) => [e.nodeId, e]));

    expect(byId.get('x')!.output).toBe(values['x']);
    expect(byId.get('w1')!.output).toBe(values['w1']);
    expect(byId.get('mul1')!.op).toBe('multiply');
    expect(byId.get('mul1')!.inputs).toEqual(['x', 'w1']);
    expect(byId.get('mul1')!.inputValues).toEqual([values['x'], values['w1']]);
    expect(byId.get('add1')!.output).toBeCloseTo(values['mul1'] + values['b'], 10);
    expect(byId.get('sin1')!.output).toBeCloseTo(Math.sin(values['add1']), 10);
    expect(byId.get('mul2')!.output).toBeCloseTo(values['sin1'] * values['w2'], 10);

    const cost = tapeMemoryCost(tape);
    expect(cost.count).toBeGreaterThan(0);
    expect(cost.bytesEstimate).toBe(cost.count * 8);
  });
});
