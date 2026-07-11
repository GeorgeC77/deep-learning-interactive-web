import { describe, it, expect } from 'vitest';
import {
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
    const _f = (p: number[]) => (graph[6].value = p[1], graph[1].value = p[0]) && forwardPass([...graph])['mul2'];
    // Rebuild with fresh params
    const _makeF = (params: number[]) => {
      const g: NodeSpec[] = JSON.parse(JSON.stringify(graph));
      g[1].value = params[0]; // w1
      g[6].value = params[1]; // w2
      return () => forwardPass(g)['mul2'];
    };
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
    // Graph: x→(add w), then both branches feed into mul → f = (x+w)^2
    const g2: NodeSpec[] = [
      { id: 'x',  op: 'input', inputs: [], value: 3 },
      { id: 'w',  op: 'weight', inputs: [], value: 2 },
      { id: 'a1', op: 'add', inputs: ['x','w'], value: 0 },
      { id: 'a2', op: 'add', inputs: ['x','w'], value: 0 },
      { id: 'mul',op: 'multiply', inputs: ['a1','a2'], value: 0 },
    ];
    const vals = forwardPass(g2);
    expect(vals['mul']).toBeCloseTo(25, 10);
    const { grads } = backwardPass(g2, vals);
    expect(grads['mul']).toBeCloseTo(1, 10);
    expect(grads['w']).toBeCloseTo(10, 10); // ∂/∂w of (x+w)² = 2(x+w) = 10
  });

  it('evalNode operations', () => {
    expect(evalNode('add', [3, 5])).toBe(8);
    expect(evalNode('multiply', [3, 5])).toBe(15);
    expect(evalNode('relu', [-2])).toBe(0);
    expect(evalNode('relu', [3])).toBe(3);
    expect(evalNode('sin', [0])).toBeCloseTo(0, 10);
    expect(evalNode('square', [4])).toBe(16);
  });
});
