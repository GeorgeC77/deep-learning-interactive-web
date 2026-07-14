import { describe, it, expect } from 'vitest';
import {
  factorization,
  isFirstOrderMarkovChain,
  markovChainFactorization,
  topologicalSort,
} from '../lib/math/graphFactorization';

function dag(nodes: string[], edges: [string, string][]) {
  return { nodes, edges };
}

describe('graphFactorization', () => {
  it('topological sort respects parent-before-child order', () => {
    const g = dag(['A', 'B', 'C'], [['A', 'B'], ['B', 'C']]);
    const order = topologicalSort(g);
    expect(order.indexOf('A')).toBeLessThan(order.indexOf('B'));
    expect(order.indexOf('B')).toBeLessThan(order.indexOf('C'));
  });

  it('general DAG factorization lists each node conditioned on its parents', () => {
    // B depends on A, C depends on A and B
    const g = dag(['A', 'B', 'C'], [['A', 'B'], ['A', 'C'], ['B', 'C']]);
    const f = factorization(g);
    expect(f.latex).toContain('p(x_{A})');
    expect(f.latex).toContain('p(x_{B} \\mid x_{A})');
    expect(f.latex).toContain('p(x_{C} \\mid x_{A}, x_{B})');
  });

  it('recognizes a first-order Markov chain', () => {
    const g = dag(['X1', 'X2', 'X3', 'X4'], [['X1', 'X2'], ['X2', 'X3'], ['X3', 'X4']]);
    expect(isFirstOrderMarkovChain(g)).toBe(true);
    expect(markovChainFactorization(g)).toContain('p(x_{X1})');
    expect(markovChainFactorization(g)).toContain('p(x_{X2} \\mid x_{X1})');
  });

  it('does not treat a branching DAG as a first-order chain', () => {
    const g = dag(['A', 'B', 'C'], [['A', 'B'], ['A', 'C']]);
    expect(isFirstOrderMarkovChain(g)).toBe(false);
    expect(markovChainFactorization(g)).toBeNull();
  });
});
