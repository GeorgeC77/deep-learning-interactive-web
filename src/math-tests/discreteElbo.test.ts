import { describe, it, expect } from 'vitest';
import {
  generateGMMData,
  gaussianLogPdf,
  logSumExp,
  truePosterior,
  computeELBO,
  identityResidual,
  softmax,
  constrainSimplex,
} from '../lib/math/discreteElbo';

const MEANS = [-2, 0, 2];
const WEIGHTS = [0.3, 0.4, 0.3];
const SIGMA = 1;

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

describe('discreteElbo', () => {
  it('softmax outputs sum to 1', () => {
    const probs = softmax([1.2, -0.5, 3.0, 0.0]);
    expect(probs.length).toBe(4);
    expect(sum(probs)).toBeCloseTo(1, 8);
    expect(probs.every((p) => p >= 0 && p <= 1)).toBe(true);
  });

  it('truePosterior outputs sum to 1', () => {
    const posterior = truePosterior(0.5, MEANS, WEIGHTS, SIGMA);
    expect(posterior.length).toBe(MEANS.length);
    expect(sum(posterior)).toBeCloseTo(1, 8);
    expect(posterior.every((p) => p >= 0 && p <= 1)).toBe(true);
  });

  it('computeELBO identity residual < 1e-9 when q equals true posterior', () => {
    const x = 0.5;
    const q = truePosterior(x, MEANS, WEIGHTS, SIGMA);
    const { elbo, logPx, kl } = computeELBO(x, q, MEANS, WEIGHTS, SIGMA);
    const residual = identityResidual(logPx, elbo, kl);
    expect(residual).toBeLessThan(1e-9);
    expect(kl).toBeCloseTo(0, 10);
    expect(elbo).toBeCloseTo(logPx, 10);
  });

  it('constrainSimplex outputs sum to 1', () => {
    const q = constrainSimplex([0.2, 0.5]);
    expect(q.length).toBe(3);
    expect(sum(q)).toBeCloseTo(1, 8);
    expect(q.every((p) => p >= 0 && p <= 1)).toBe(true);
  });

  it('constrainSimplex clamps out-of-range inputs', () => {
    // Negative values become 0; excess mass above 1 is renormalised.
    const q1 = constrainSimplex([-0.5, 0.8]);
    expect(q1[0]).toBeCloseTo(0, 10);
    expect(sum(q1)).toBeCloseTo(1, 8);

    // Sum > 1 should be renormalised.
    const q2 = constrainSimplex([0.8, 0.8]);
    expect(q2[2]).toBeCloseTo(0, 10);
    expect(sum(q2)).toBeCloseTo(1, 8);
    expect(q2[0]).toBeCloseTo(0.5, 8);
    expect(q2[1]).toBeCloseTo(0.5, 8);

    // Values above 1 are clamped.
    const q3 = constrainSimplex([1.5, -1.0]);
    expect(q3[0]).toBeCloseTo(1, 8);
    expect(q3[1]).toBeCloseTo(0, 8);
    expect(q3[2]).toBeCloseTo(0, 8);
    expect(sum(q3)).toBeCloseTo(1, 8);
  });

  it('gaussianLogPdf integrates to 1 in log space', () => {
    const xs = Array.from({ length: 1001 }, (_, i) => -10 + (i * 20) / 1000);
    const dx = 20 / 1000;
    const total = xs.reduce((s, x) => s + Math.exp(gaussianLogPdf(x, 0, 1)) * dx, 0);
    expect(total).toBeCloseTo(1, 2);
  });

  it('logSumExp is stable and exact for offset arrays', () => {
    const a = [-1000, -1000, -1000];
    expect(logSumExp(a)).toBeCloseTo(-1000 + Math.log(3), 8);
  });

  it('generateGMMData is deterministic for a fixed seed', () => {
    const d1 = generateGMMData(10, 42, MEANS, WEIGHTS, SIGMA);
    const d2 = generateGMMData(10, 42, MEANS, WEIGHTS, SIGMA);
    expect(d1).toEqual(d2);
    expect(d1.length).toBe(10);
  });
});
