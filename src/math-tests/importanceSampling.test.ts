import { describe, it, expect } from 'vitest';
import {
  gaussian,
  sampleProposal,
  importanceEstimate,
  effectiveSampleSize,
  maxWeightShare,
  analyticTruth,
  INTEGRANDS,
} from '../lib/math/importanceSampling';

describe('importanceSampling', () => {
  it('normalized weights sum to 1', () => {
    const p = (x: number) => gaussian(x, 0, 1);
    const q = (x: number) => gaussian(x, 1, 1);
    const samples = sampleProposal(1, 1, 200, 123);
    const { normalizedWeights } = importanceEstimate(samples, (x) => x, p, q);
    expect(normalizedWeights.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it('importance estimator is close to analytic truth when q ≈ p', () => {
    const p = (x: number) => gaussian(x, 0, 1);
    const q = (x: number) => gaussian(x, 0.05, 1.05);
    const samples = sampleProposal(0.05, 1.05, 3000, 7);
    for (const integrand of INTEGRANDS) {
      const { estimate } = importanceEstimate(samples, integrand.fn, p, q);
      const truth = analyticTruth(integrand);
      const tolerance = integrand.id === 'indicator2' ? 0.03 : 0.08;
      expect(Math.abs(estimate - truth)).toBeLessThan(tolerance);
    }
  });

  it('ESS decreases when q is far from p', () => {
    const p = (x: number) => gaussian(x, 0, 1);
    const n = 500;
    const seed = 99;

    const close = sampleProposal(0.1, 1.0, n, seed);
    const far = sampleProposal(3.0, 0.5, n, seed);
    const f = INTEGRANDS.find((i) => i.id === 'indicator2')!.fn;

    const weightsClose = importanceEstimate(close, f, p, (x) => gaussian(x, 0.1, 1.0)).weights;
    const weightsFar = importanceEstimate(far, f, p, (x) => gaussian(x, 3.0, 0.5)).weights;

    expect(effectiveSampleSize(weightsFar)).toBeLessThan(effectiveSampleSize(weightsClose));
  });

  it('max weight share bounded in [0,1]', () => {
    const p = (x: number) => gaussian(x, 0, 1);
    const q = (x: number) => gaussian(x, 2, 0.8);
    const samples = sampleProposal(2, 0.8, 200, 42);
    const { weights } = importanceEstimate(samples, (x) => x, p, q);
    const share = maxWeightShare(weights);
    expect(share).toBeGreaterThanOrEqual(0);
    expect(share).toBeLessThanOrEqual(1);
  });
});
