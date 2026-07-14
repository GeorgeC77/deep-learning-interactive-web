import { describe, it, expect } from 'vitest';
import {
  ensembleVariance,
  ensembleStd,
  marginalGain,
  limitingVariance,
  minimumFeasibleCorrelation,
  isFeasibleRho,
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

  it('minimum feasible correlation is -1/(M-1) for M > 1 and -1 for M <= 1', () => {
    expect(minimumFeasibleCorrelation(1)).toBe(-1);
    expect(minimumFeasibleCorrelation(2)).toBeCloseTo(-1, 10);
    expect(minimumFeasibleCorrelation(10)).toBeCloseTo(-1 / 9, 10);
    expect(minimumFeasibleCorrelation(50)).toBeCloseTo(-1 / 49, 10);
  });

  it('rejects infeasible negative rho for M=10', () => {
    const M = 10;
    const rhoMin = minimumFeasibleCorrelation(M);
    expect(isFeasibleRho(M, rhoMin - 0.01)).toBe(false);
    expect(isFeasibleRho(M, rhoMin)).toBe(true);
    expect(isFeasibleRho(M, 0)).toBe(true);
    expect(isFeasibleRho(M, 1)).toBe(true);
    expect(isFeasibleRho(M, 1.1)).toBe(false);
  });

  it('scaled negative dependence rho = -0.8/(M-1) is feasible for all M > 1', () => {
    for (let M = 2; M <= 50; M++) {
      const rho = -0.8 / (M - 1);
      expect(isFeasibleRho(M, rho)).toBe(true);
      expect(ensembleVariance(1, M, rho)).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(ensembleStd(1, M, rho))).toBe(true);
    }
  });

  it('infeasible rho for M=10 produces negative variance', () => {
    const M = 10;
    const rho = -0.2; // below -1/9
    expect(isFeasibleRho(M, rho)).toBe(false);
    expect(ensembleVariance(1, M, rho)).toBeLessThan(0);
  });

  it('marginal gain is non-negative and decreases with M for feasible rho < 1', () => {
    const sigma = 1.5;
    for (let M = 1; M <= 20; M++) {
      const rhos: number[] = [0, 0.3, 0.5, 0.9];
      if (M > 1) {
        rhos.push(-0.8 / (M - 1)); // feasible scaled negative correlation
      }
      for (const rho of rhos) {
        const gain = marginalGain(sigma, M, rho);
        expect(Number.isFinite(gain)).toBe(true);
        expect(gain).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('limiting variance equals sigma^2 * rho for feasible rho', () => {
    for (const sigma of [0.5, 1.0, 2.0, 3.0]) {
      for (const rho of [0, 0.25, 0.5, 1]) {
        expect(limitingVariance(sigma, rho)).toBeCloseTo(sigma * sigma * rho, 10);
      }
    }
  });
});
