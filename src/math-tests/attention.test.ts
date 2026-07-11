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

  function equivarianceMetric(
    X: number[][],
    PX: number[][],
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
      const pi = N - 1 - i;
      for (let j = 0; j < dModel; j++) {
        maxErr = Math.max(maxErr, Math.abs(yPX[pi][j] - yX[i][j]));
      }
    }
    return maxErr;
  }

  it('maxAbs(Y(PX)-P·Y(X)) is near zero when PE and causal mask are both off', () => {
    const dModel = 6, dK = 3, N = 4;
    const X = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
    const PX = [...X].reverse();
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const metric = equivarianceMetric(X, PX, wq, wk, wv, wo, false);
    expect(metric).toBeLessThan(1e-8);
  });

  it('maxAbs(Y(PX)-P·Y(X)) is non-zero when PE or causal mask is on', () => {
    const dModel = 6, dK = 3, N = 4;
    const base = Array.from({ length: N }, (_, i) => Array.from({ length: dModel }, (_, j) => (i + 1) * (j + 1)));
    const X = base.map((row, i) => {
      const pe = sinusoidalPE(i, dModel);
      return row.map((v, j) => v + pe[j]);
    });
    const PX = base.map((_, i) => {
      const pe = sinusoidalPE(i, dModel);
      return base[N - 1 - i].map((v, j) => v + pe[j]);
    });
    const wq = [makeW(dModel, dK, 1), makeW(dModel, dK, 2)];
    const wk = [makeW(dModel, dK, 3), makeW(dModel, dK, 4)];
    const wv = [makeW(dModel, dK, 5), makeW(dModel, dK, 6)];
    const wo = makeW(dModel, dModel, 7);
    const metricPE = equivarianceMetric(X, PX, wq, wk, wv, wo, false);
    const metricCausal = equivarianceMetric(base, [...base].reverse(), wq, wk, wv, wo, true);
    expect(metricPE).toBeGreaterThan(1e-6);
    expect(metricCausal).toBeGreaterThan(1e-6);
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
