import { describe, expect, it } from 'vitest';
import {
  binaryGaussianPosterior,
  gaussianPdf,
  sharedVarianceBoundary,
} from '../lib/math/gaussianClassifier';

describe('gaussianClassifier', () => {
  it('evaluates the standard normal density at zero', () => {
    expect(gaussianPdf(0, 0, 1)).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 12);
  });

  it('returns normalized posteriors', () => {
    const result = binaryGaussianPosterior(0.4, {
      mean0: -1,
      mean1: 1,
      sd0: 1,
      sd1: 1,
      prior1: 0.35,
    });
    expect(result.posterior0 + result.posterior1).toBeCloseTo(1, 12);
    expect(result.evidence).toBeGreaterThan(0);
  });

  it('places the equal-prior shared-variance boundary at the midpoint', () => {
    expect(sharedVarianceBoundary(-2, 4, 1.3, 0.5)).toBeCloseTo(1, 12);
  });

  it('moves the boundary toward class 0 when class 1 prior increases', () => {
    const balanced = sharedVarianceBoundary(-1.5, 1.5, 1, 0.5);
    const class1Favored = sharedVarianceBoundary(-1.5, 1.5, 1, 0.8);
    expect(class1Favored).toBeLessThan(balanced);
  });
});
