import { describe, expect, it } from 'vitest';
import { gaussianPoints, summarizePairwiseDistances } from '../lib/math/highDimensional';

describe('high-dimensional distance experiment', () => {
  it('generates reproducible Gaussian point clouds', () => {
    expect(gaussianPoints(4, 5, 42)).toEqual(gaussianPoints(4, 5, 42));
  });

  it('shows lower relative distance dispersion as dimension grows', () => {
    const low = summarizePairwiseDistances(gaussianPoints(2, 120, 7));
    const high = summarizePairwiseDistances(gaussianPoints(50, 120, 7));
    expect(high.coefficientOfVariation).toBeLessThan(low.coefficientOfVariation);
  });
});
