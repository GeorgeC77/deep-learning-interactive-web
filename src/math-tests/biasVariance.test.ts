import { describe, it, expect } from 'vitest';
import {
  biasVarianceDecomposition,
  fitPolynomial,
  predictChebyshev,
  trueFunction,
  standardize,
  mulberry32,
  randNormal,
} from '../lib/math/biasVariance';

describe('biasVariance', () => {
  it('test error approx equals bias^2 + variance + sigma^2', () => {
    const res = biasVarianceDecomposition(30, 5, 0.3, 0.001, 100, 123);
    const decomp = res.avgBias2 + res.avgVariance + res.noise;
    const relErr = Math.abs(res.avgExpectedError - decomp) / (decomp + 1e-12);
    expect(relErr).toBeLessThan(0.1);
    expect(res.actualTestMse).toBeCloseTo(decomp, 4);
  });

  it('higher degree reduces bias but increases variance', () => {
    const low = biasVarianceDecomposition(30, 1, 0.3, 0.001, 120, 1);
    const high = biasVarianceDecomposition(30, 12, 0.3, 0.001, 120, 1);
    expect(high.avgBias2).toBeLessThan(low.avgBias2);
    expect(high.avgVariance).toBeGreaterThan(low.avgVariance);
  });

  it('noise variance label matches actual distribution variance', () => {
    const sigma = 0.5;
    const rng = mulberry32(99);
    const samples: number[] = [];
    for (let i = 0; i < 5000; i++) {
      samples.push(sigma * randNormal(rng));
    }
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const var_ = samples.reduce((s, v) => s + (v - mean) ** 2, 0) / samples.length;
    expect(Math.abs(var_ - sigma * sigma)).toBeLessThan(0.05);
  });

  it('stable fit for degree up to 15', () => {
    const xs = Array.from({ length: 30 }, (_, i) => -1 + (2 * i) / 29);
    const ys = xs.map((x) => trueFunction(x));
    const w = fitPolynomial(xs, ys, 15, 1e-6);
    expect(w.length).toBe(16);
    for (let i = 0; i < xs.length; i++) {
      const pred = predictChebyshev(xs[i], w);
      expect(Math.abs(pred - ys[i])).toBeLessThan(0.05);
    }
  });

  it('standardize maps to [-1, 1]', () => {
    const xs = [0, 1, 2, 3, 4];
    const { scaled } = standardize(xs);
    expect(Math.min(...scaled)).toBeCloseTo(-1, 10);
    expect(Math.max(...scaled)).toBeCloseTo(1, 10);
  });
});
