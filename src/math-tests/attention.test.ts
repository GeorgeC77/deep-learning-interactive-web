import { describe, it, expect } from 'vitest';
import {
  softmax,
  matMul,
  multiHeadAttention,
  divisors,
  sinusoidalPE,
} from '../lib/math/attention';

function makeW(rows: number, cols: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng() - 0.5) * 0.4));
}

function identityPerm(N: number): number[] {
  return Array.from({ length: N }, (_, i) => i);
}

function reversePerm(N: number): number[] {
  return Array.from({ length: N }, (_, i) => N - 1 - i);
}

function cyclicPerm(N: number, shift = 1): number[] {
  return Array.from({ length: N }, (_, i) => (i + shift) % N);
}

function swapPerm(N: number, i = 0, j = 1): number[] {
  const perm = identityPerm(N);
  if (N >= 2) [perm[i], perm[j]] = [perm[j], perm[i]];
  return perm;
}

function randomPerm(N: number, seed = 123): number[] {
  const perm = identityPerm(N);
  const rng = mulberry32(seed);
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

function applyPermutation<T>(arr: T[], perm: number[]): T[] {
  return Array.from({ length: arr.length }, (_, newPos) => {
    const oldIdx = perm.indexOf(newPos);
    return arr[oldIdx];
  });
}

function buildXWithPE(base: number[][], perm: number[]): number[][] {
  const dModel = base[0].length;
  return Array.from({ length: base.length }, (_, newPos) => {
    const oldIdx = perm.indexOf(newPos);
    const pe = sinusoidalPE(newPos, dModel);
    return base[oldIdx].map((v, j) => v + pe[j]);
  });
}

function equivarianceMetric(
  X: number[][],
  PX: number[][],
  perm: number[],
  wq: number[][][],
  wk: number[][][],
  wv: number[][][],
  wo: number[][],
  causalMask: boolean,
): number {
  const N = X.length;
  const dModel = X[0].length;
  const yX = multiHeadAttention(X, wq, wk, wv, wo, causalMask).finalOutput;
  const yPX = multiHeadAttention(PX, wq, wk, wv, wo, causalMask).finalOutput;
  let maxErr = 0;
  for (let i = 0; i < N; i++) {
    const pi = perm[i];
    for (let j = 0; j < dModel; j++) {
      maxErr = Math.max(maxErr, Math.abs(yPX[pi][j] - yX[i][j]));
    }
  }
  return maxErr;
}

describe('attention', () => {
  it('softmax sums to 1', () => {
    const s = softmax([2, 1, 0.1]);
    expect(s.reduce((a, b) => a + b)).toBeCloseTo(1, 10);
  });

  it('softmax max index preserved', () => {
    const s = softmax([1, 3, 2]);
    expect(s.indexOf(Math.max(...s))).toBe(1);
  });

  it('dModel % H = 0', () => {
    expect(6 % 2).toBe(0);
    expect(6 % 4).not.toBe(0);
  });

  it('divisors of 6', () => {
    expect(divisors(6)).toEqual([1, 2, 3, 6]);
  });

  it('multi-head concat dimensions correct', () => {
    const dModel = 6, dK = 3, N = 4;
    const X = Array.from({ length: N }, () => Array.from({ length: dModel }, () => 1));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    expect(result.concat.length).toBe(N);
    expect(result.concat[0].length).toBe(dModel);
    expect(result.finalOutput.length).toBe(N);
    expect(result.finalOutput[0].length).toBe(dModel);
  });

  it('every attention row sums to 1', () => {
    const dModel = 6, dK = 3, N = 4;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, () => i));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    for (const ho of result.headOutputs) {
      for (const row of ho.attention) {
        expect(row.reduce((a, b) => a + b)).toBeCloseTo(1, 8);
      }
    }
  });

  it('causal mask future weights = 0', () => {
    const dModel = 6, dK = 3, N = 4;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, () => i));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, true);
    for (const ho of result.headOutputs) {
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          expect(ho.attention[i][j]).toBeLessThan(1e-10);
        }
      }
    }
  });

  it('final output = concat × W_O', () => {
    const dModel = 6, dK = 3, N = 3;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, () => (i + 1)));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    const expected = matMul(result.concat, wo);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < dModel; j++)
        expect(result.finalOutput[i][j]).toBeCloseTo(expected[i][j], 8);
  });

  it('permutation equivariance without PE', () => {
    const dModel = 4, dK = 2;
    const X = [[1,2,3,4],[5,6,7,8],[9,10,11,12]];
    // Permute: swap rows 0 and 1
    const PX = [X[1], X[0], X[2]];
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const r1 = multiHeadAttention(X, wq, wk, wv, wo, false);
    const r2 = multiHeadAttention(PX, wq, wk, wv, wo, false);
    // Y(PX) should equal P*Y(X): row 0 of r2 = row 1 of r1, row 1 of r2 = row 0 of r1
    let maxErr = 0;
    for (let j = 0; j < dModel; j++) {
      maxErr = Math.max(maxErr, Math.abs(r2.finalOutput[0][j] - r1.finalOutput[1][j]));
      maxErr = Math.max(maxErr, Math.abs(r2.finalOutput[1][j] - r1.finalOutput[0][j]));
      maxErr = Math.max(maxErr, Math.abs(r2.finalOutput[2][j] - r1.finalOutput[2][j]));
    }
    expect(maxErr).toBeLessThan(1e-8);
  });

  it('empty token list returns empty output without error', () => {
    const dModel = 4;
    const X: number[][] = [];
    const wq = [makeW(dModel, 2, 1)];
    const wk = [makeW(dModel, 2, 2)];
    const wv = [makeW(dModel, 2, 3)];
    const wo = makeW(dModel, dModel, 4);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    expect(result.headOutputs).toEqual([]);
    expect(result.concat).toEqual([]);
    expect(result.finalOutput).toEqual([]);
  });

  const permutationCases: { name: string; perm: (N: number) => number[] }[] = [
    { name: 'reverse', perm: reversePerm },
    { name: 'cyclic shift', perm: cyclicPerm },
    { name: 'swap', perm: (N) => swapPerm(N, 0, 1) },
    { name: 'random', perm: (N) => randomPerm(N, 123) },
  ];

  permutationCases.forEach(({ name, perm }) => {
    it(`${name} permutation: maxAbs(Y(PX)-P·Y(X)) is near zero when PE and causal mask are both off`, () => {
      const dModel = 6, dK = 3, N = 4;
      const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
      const permutation = perm(N);
      const PX = applyPermutation(X, permutation);
      const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
      const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
      const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
      const wo = makeW(dModel, dModel, 7);
      const metric = equivarianceMetric(X, PX, permutation, wq, wk, wv, wo, false);
      expect(metric).toBeLessThan(1e-8);
    });
  });

  it('when PE is on, at least one permutation yields a non-zero metric', () => {
    const dModel = 6, dK = 3, N = 4;
    const base = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);

    const metrics = permutationCases.map(({ perm }) => {
      const permutation = perm(N);
      const X = buildXWithPE(base, identityPerm(N));
      const PX = buildXWithPE(base, permutation);
      return equivarianceMetric(X, PX, permutation, wq, wk, wv, wo, false);
    });
    expect(Math.max(...metrics)).toBeGreaterThan(1e-6);
  });

  it('when causal mask is on, at least one permutation yields a non-zero metric', () => {
    const dModel = 6, dK = 3, N = 4;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);

    const metrics = permutationCases.map(({ perm }) => {
      const permutation = perm(N);
      const PX = applyPermutation(X, permutation);
      return equivarianceMetric(X, PX, permutation, wq, wk, wv, wo, true);
    });
    expect(Math.max(...metrics)).toBeGreaterThan(1e-6);
  });

  it('each head score uses its own d_k (single 4D head divides by sqrt(4))', () => {
    const X = [[1, 0, 0, 0], [0, 1, 0, 0]];
    const wq = [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]];
    const wk = [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]];
    const wv = [[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]];
    const wo = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    const score00 = result.headOutputs[0].scores[0][0];
    // Q[0] = [1,0,0,0], K[0] = [1,0,0,0] => dot = 1, scaled by sqrt(4)=2 => 0.5
    expect(score00).toBeCloseTo(0.5, 8);
  });

  it('each head score uses its own d_k (two 2D heads divide by sqrt(2))', () => {
    const X = [[1, 0, 0, 0], [0, 1, 0, 0]];
    const wq = [
      [[1, 0], [0, 1], [0, 0], [0, 0]],
      [[0, 0], [0, 0], [1, 0], [0, 1]],
    ];
    const wk = [
      [[1, 0], [0, 1], [0, 0], [0, 0]],
      [[0, 0], [0, 0], [1, 0], [0, 1]],
    ];
    const wv = [
      [[1, 0], [0, 1], [0, 0], [0, 0]],
      [[0, 0], [0, 0], [1, 0], [0, 1]],
    ];
    const wo = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    // head 0: Q[0]=[1,0], K[0]=[1,0] => dot=1, scaled by sqrt(2) => ~0.7071
    expect(result.headOutputs[0].scores[0][0]).toBeCloseTo(1 / Math.sqrt(2), 8);
    // head 1: Q[0]=[0,0], K[0]=[0,0] => dot=0
    expect(result.headOutputs[1].scores[0][0]).toBeCloseTo(0, 8);
  });

  it('changing head 1 weights does not directly change head 2 attention', () => {
    const dModel = 4, dK = 2, N = 3;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1) / 10));
    const baseWQ1 = makeW(dModel, dK, 1);
    const baseWQ2 = makeW(dModel, dK, 2);
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);

    const r1 = multiHeadAttention(X, [baseWQ1, baseWQ2], wk, wv, wo, false);
    const r2 = multiHeadAttention(X, [baseWQ1, makeW(dModel, dK, 99)], wk, wv, wo, false);

    // Head 0 attention should be identical; head 1 attention should differ.
    expect(r1.headOutputs[0].attention).toEqual(r2.headOutputs[0].attention);
    let maxDiff = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        maxDiff = Math.max(maxDiff, Math.abs(r1.headOutputs[1].attention[i][j] - r2.headOutputs[1].attention[i][j]));
      }
    }
    expect(maxDiff).toBeGreaterThan(1e-6);
  });

  it('output equals concat(head outputs) multiplied by W_O', () => {
    const dModel = 6, dK = 3, N = 4;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, () => (i + 1) / 10));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    const concat: number[][] = [];
    for (let i = 0; i < N; i++) {
      concat.push([...result.headOutputs[0].headOut[i], ...result.headOutputs[1].headOut[i]]);
    }
    const expected = matMul(concat, wo);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < dModel; j++) {
        expect(result.finalOutput[i][j]).toBeCloseTo(expected[i][j], 8);
      }
    }
  });

  it('implementation matches a manual numerical example', () => {
    // N=2, dModel=2, H=2, dK=1.
    // X = [[1,0],[0,1]], identity projection weights per head.
    const X = [[1, 0], [0, 1]];
    const wq = [[[1], [0]], [[0], [1]]];
    const wk = [[[1], [0]], [[0], [1]]];
    const wv = [[[1], [0]], [[0], [1]]];
    const wo = [[1, 0], [0, 1]];

    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    // head 0: token 0 attends [sigmoid(1), sigmoid(-1)]; token 1 attends [0.5, 0.5].
    expect(result.headOutputs[0].attention[0][0]).toBeCloseTo(sigmoid(1), 8);
    expect(result.headOutputs[0].attention[0][1]).toBeCloseTo(sigmoid(-1), 8);
    expect(result.headOutputs[0].attention[1][0]).toBeCloseTo(0.5, 8);
    expect(result.headOutputs[0].attention[1][1]).toBeCloseTo(0.5, 8);
    // head 0 outputs (V selects first dimension)
    expect(result.headOutputs[0].headOut[0][0]).toBeCloseTo(sigmoid(1), 8);
    expect(result.headOutputs[0].headOut[1][0]).toBeCloseTo(0.5, 8);
    // head 1 is symmetric on the second dimension and uses its own weights
    expect(result.headOutputs[1].attention[0][0]).toBeCloseTo(0.5, 8);
    expect(result.headOutputs[1].attention[0][1]).toBeCloseTo(0.5, 8);
    expect(result.headOutputs[1].attention[1][0]).toBeCloseTo(sigmoid(-1), 8);
    expect(result.headOutputs[1].attention[1][1]).toBeCloseTo(sigmoid(1), 8);
    expect(result.headOutputs[1].headOut[0][0]).toBeCloseTo(0.5, 8);
    expect(result.headOutputs[1].headOut[1][0]).toBeCloseTo(sigmoid(1), 8);
    // final output = concat * W_O
    expect(result.finalOutput[0][0]).toBeCloseTo(sigmoid(1), 8);
    expect(result.finalOutput[0][1]).toBeCloseTo(0.5, 8);
    expect(result.finalOutput[1][0]).toBeCloseTo(0.5, 8);
    expect(result.finalOutput[1][1]).toBeCloseTo(sigmoid(1), 8);
  });

  it('formula and code agree: Q equals X multiplied by W_Q (column convention)', () => {
    const dModel = 4, dK = 2, N = 3;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const result = multiHeadAttention(X, wq, wk, wv, wo, false);
    const expectedQ0 = matMul(X, wq[0]);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < dK; j++) {
        expect(result.headOutputs[0].Q[i][j]).toBeCloseTo(expectedQ0[i][j], 8);
      }
    }
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
