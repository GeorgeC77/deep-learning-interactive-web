import { describe, it, expect } from 'vitest';
import {
  adjacencyFromEdges,
  messagePassing,
  readout,
  permutationEquivarianceError,
  permutationInvarianceError,
  nodeFeatureVariance,
} from '../lib/math/gnn';

const NODES = 4;
const EDGES = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
];
const ADJ = adjacencyFromEdges(NODES, EDGES);
const FEATURES = [1.0, 2.0, 3.0, 0.5];

function randomPerm(N: number, seed = 123): number[] {
  const perm = Array.from({ length: N }, (_, i) => i);
  const rng = mulberry32(seed);
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

describe('gnn', () => {
  it('round changes output values', () => {
    const h1 = messagePassing(ADJ, FEATURES, 1, 0.5, 0.5, 'relu');
    const h2 = messagePassing(ADJ, FEATURES, 2, 0.5, 0.5, 'relu');
    expect(h1.length).toBe(2);
    expect(h2.length).toBe(3);
    // First round of both runs must be identical; adding a second round changes values.
    for (let i = 0; i < NODES; i++) {
      expect(h1[1][i]).toBeCloseTo(h2[1][i], 10);
    }
    let changed = false;
    for (let i = 0; i < NODES; i++) {
      if (Math.abs(h1[1][i] - h2[2][i]) > 1e-12) changed = true;
    }
    expect(changed).toBe(true);
    expect(readout(h1)).not.toBe(readout(h2));
  });

  it('permutation equivariance error is near zero', () => {
    const perm = randomPerm(NODES, 42);
    const err = permutationEquivarianceError(ADJ, FEATURES, perm, 3, 0.5, 0.5, 'tanh');
    expect(err).toBeLessThan(1e-10);
  });

  it('permutation invariance error is near zero', () => {
    const perm = randomPerm(NODES, 17);
    const err = permutationInvarianceError(ADJ, FEATURES, perm, 3, 0.5, 0.5, 'tanh');
    expect(err).toBeLessThan(1e-10);
  });

  it('over-smoothing increases with rounds', () => {
    const history = messagePassing(ADJ, FEATURES, 3, 0.5, 0.5, 'tanh');
    const variances = history.map(nodeFeatureVariance);
    // As messages mix, node features should become more similar.
    expect(variances[3]).toBeLessThanOrEqual(variances[0] + 1e-6);
    expect(variances[3]).toBeLessThan(variances[1]);
  });
});

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
