import { describe, expect, it } from 'vitest';
import {
  generateGradientPopulation,
  mean,
  populationStandardDeviation,
  rootMeanSquaredError,
  sampleMeanEstimates,
  standardError,
} from '../lib/math/batchGradient';

describe('mini-batch gradient estimates', () => {
  it('uses the 1/sqrt(B) standard-error law', () => {
    expect(standardError(2, 100)).toBeCloseTo(0.2, 12);
    expect(standardError(2, 10_000)).toBeCloseTo(0.02, 12);
  });

  it('is deterministic for a fixed population and sampling seed', () => {
    const population = generateGradientPopulation(128, 1.5, 1, 42);
    expect(sampleMeanEstimates(population, 16, 10, 7)).toEqual(
      sampleMeanEstimates(population, 16, 10, 7),
    );
  });

  it('reduces empirical gradient error with larger batches', () => {
    const population = generateGradientPopulation(512, 1.5, 1, 2024);
    const target = mean(population);
    const small = sampleMeanEstimates(population, 2, 2_000, 11);
    const large = sampleMeanEstimates(population, 64, 2_000, 11);
    expect(rootMeanSquaredError(large, target)).toBeLessThan(
      rootMeanSquaredError(small, target),
    );
    expect(populationStandardDeviation(population)).toBeGreaterThan(0.8);
  });
});
