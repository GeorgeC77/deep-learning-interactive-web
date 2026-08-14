import { describe, expect, it } from 'vitest';
import {
  gaussianPdf1D,
  mixtureDensity1D,
  mixtureMoments1D,
  responsibilities1D,
  type Gaussian1DComponent,
} from '@/lib/math/gmm';

const components: Gaussian1DComponent[] = [
  { weight: 0.25, mean: -1, sigma: 1 },
  { weight: 0.75, mean: 1, sigma: 1 },
];

describe('one-dimensional Gaussian mixture math', () => {
  it('normalizes posterior responsibilities and reconstructs the mixture density', () => {
    const x = 0.4;
    const responsibilities = responsibilities1D(x, components);
    const density = mixtureDensity1D(x, components);
    expect(responsibilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(density).toBeCloseTo(
      0.25 * gaussianPdf1D(x, -1, 1) + 0.75 * gaussianPdf1D(x, 1, 1),
      12,
    );
  });

  it('uses the mixing prior when the likelihoods are equal', () => {
    expect(responsibilities1D(0, components)).toEqual(expect.arrayContaining([
      expect.closeTo(0.25, 12),
      expect.closeTo(0.75, 12),
    ]));
  });

  it('computes moments with within-component and between-component variance', () => {
    const moments = mixtureMoments1D(components);
    expect(moments.mean).toBeCloseTo(0.5, 12);
    expect(moments.variance).toBeCloseTo(1.75, 12);
  });

  it('rejects invalid standard deviations', () => {
    expect(() => gaussianPdf1D(0, 0, 0)).toThrow(/positive/);
  });
});
