import { describe, expect, it } from 'vitest';
import {
  covarianceCorrelation,
  factorAnalysisCovariance,
  generativeApproaches,
  pcaVarianceSummary,
  rankGenerativeApproaches,
  scalarGaussianPosterior,
} from '@/lib/math/continuousLatent';

describe('continuous latent variable chapter math', () => {
  it('PCA retained and discarded variance form an exact partition', () => {
    const result = pcaVarianceSummary([5, 2, 0.7, 0.3], 2);
    expect(result.total).toBeCloseTo(8, 12);
    expect(result.kept).toBeCloseTo(7, 12);
    expect(result.discarded).toBeCloseTo(1, 12);
    expect(result.retainedRatio).toBeCloseTo(0.875, 12);
  });

  it('factor analysis covariance is W W^T plus diagonal noise', () => {
    expect(factorAnalysisCovariance([2, -1], [0.5, 0.25])).toEqual([
      [4.5, -2],
      [-2, 1.25],
    ]);
  });

  it('independent noise lowers correlation without changing shared covariance', () => {
    const lowNoise = factorAnalysisCovariance([1.8, 1.2], [0.3, 0.2]);
    const highNoise = factorAnalysisCovariance([1.8, 1.2], [0.3, 4]);
    expect(highNoise[0][1]).toBeCloseTo(lowNoise[0][1], 12);
    expect(Math.abs(covarianceCorrelation(highNoise))).toBeLessThan(Math.abs(covarianceCorrelation(lowNoise)));
  });

  it('larger observation noise shrinks the posterior mean and raises variance', () => {
    const precise = scalarGaussianPosterior(2, 0.1);
    const noisy = scalarGaussianPosterior(2, 4);
    expect(noisy.meanCoefficient).toBeLessThan(precise.meanCoefficient);
    expect(noisy.variance).toBeGreaterThan(precise.variance);
  });

  it('uses the four approaches named in Bishop section 16.4.4', () => {
    expect(generativeApproaches.map((approach) => approach.id)).toEqual(['gan', 'vae', 'flow', 'diffusion']);
  });

  it('ranks flows first when exact likelihood and fast sampling are required', () => {
    const ranking = rankGenerativeApproaches({ exactLikelihood: true, fastSampling: true, compactLatent: false });
    expect(ranking[0].id).toBe('flow');
    expect(ranking[0].score).toBe(6);
  });
});
