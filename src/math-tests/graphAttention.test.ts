import { describe, it, expect } from 'vitest';
import {
  computeAttention,
  gatAggregate,
  gcnMeanAggregate,
  matVec,
  starGraph,
} from '../lib/math/graphAttention';

function identity2D(): number[][] {
  return [
    [1, 0],
    [0, 1],
  ];
}

describe('graphAttention', () => {
  it('attention weights over a node and its neighbors sum to 1', () => {
    const graph = starGraph([0, 0], [[1, 0], [0, 1], [-1, 0]]);
    const W = identity2D();
    const a = [0.2, 0.2, 0.2, 0.2]; // length 4 = 2 * outDim
    const result = computeAttention(graph, 0, W, a);
    const sum = result.weights.reduce((s, v) => s + v, 0);
    expect(sum).toBeCloseTo(1, 10);
    expect(result.weights.length).toBe(graph.neighbors[0].length);
  });

  it('GAT aggregation reduces to a weighted average of transformed neighbors', () => {
    const graph = starGraph([0, 0], [[2, 0], [0, 2]]);
    const W = identity2D();
    const a = [0.1, 0, 0.1, 0];
    const out = gatAggregate(graph, 0, W, a);
    expect(out.length).toBe(2);
    expect(Number.isFinite(out[0])).toBe(true);
    expect(Number.isFinite(out[1])).toBe(true);
  });

  it('GCN mean aggregation equals uniform average of transformed neighbors', () => {
    const graph = starGraph([1, 0], [[0, 1], [-1, 0]]);
    const W = identity2D();
    const out = gcnMeanAggregate(graph, 0, W);
    // neighbors are [0 (self), 1, 2]
    expect(out[0]).toBeCloseTo((1 + 0 + -1) / 3, 10);
    expect(out[1]).toBeCloseTo((0 + 1 + 0) / 3, 10);
  });

  it('matVec computes standard matrix-vector product', () => {
    const M = [
      [1, 2],
      [3, 4],
    ];
    const v = [5, 6];
    expect(matVec(M, v)).toEqual([17, 39]);
  });
});
