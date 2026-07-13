import { describe, it, expect } from 'vitest';
import {
  ensembleVariance,
  ensembleStd,
  marginalGain,
  limitingVariance,
} from '../lib/math/modelAveraging';

describe('modelAveraging', () => {
  it('independent errors: ensemble std equals sigma / sqrt(M)', () => {
    const sigma = 3.0;
    for (const M of [1, 2, 5, 10, 50]) {
      const expected = sigma / Math.sqrt(M);
      expect(ensembleStd(sigma, M, 0)).toBeCloseTo(expected, 10);
    }
  });

  it('perfectly correlated errors: ensemble variance is sigma^2 for any M', () => {
    const sigma = 2.5;
    const expected = sigma * sigma;
    for (const M of [1, 2, 5, 10, 50]) {
      expect(ensembleVariance(sigma, M, 1)).toBeCloseTo(expected, 10);
      expect(ensembleStd(sigma, M, 1)).toBeCloseTo(sigma, 10);
    }
  });

  it('marginal gain is non-negative and decreases with M for rho < 1', () => {
    const sigma = 1.5;
    const rhos = [-0.2, 0, 0.3, 0.5, 0.9];
    for (const rho of rhos) {
      let previousGain: number | null = null;
      for (let M = 1; M <= 20; M++) {
        const gain = marginalGain(sigma, M, rho);
        expect(gain).toBeGreaterThanOrEqual(0);
        if (previousGain !== null) {
          expect(gain).toBeLessThanOrEqual(previousGain);
        }
        previousGain = gain;
      }
    }
  });

  it('limiting variance equals sigma^2 * rho', () => {
    for (const sigma of [0.5, 1.0, 2.0, 3.0]) {
      for (const rho of [-0.2, 0, 0.25, 0.5, 1]) {
        expect(limitingVariance(sigma, rho)).toBeCloseTo(sigma * sigma * rho, 10);
      }
    }
  });

});
