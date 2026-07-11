import { describe, it, expect } from 'vitest';
import {
  makeBetaSchedule, alphaBar, boxMuller, generateGaussianNoise,
  forwardClosed, forwardIncremental, sampleStats,
} from '../lib/math/diffusion';

describe('diffusion', () => {
  const T = 1000;
  const betas = makeBetaSchedule(T, 1e-4, 0.02);

  it('Gaussian sample mean approximately 0', () => {
    const rng = mulberry32(42);
    let sum = 0;
    for (let i = 0; i < 1000; i++) sum += boxMuller(rng);
    expect(Math.abs(sum / 1000)).toBeLessThan(0.1);
  });

  it('Gaussian sample variance approximately 1', () => {
    const noise = generateGaussianNoise(100, 10, 42);
    const stats = sampleStats(noise);
    expect(stats.variance).toBeGreaterThan(0.9);
    expect(stats.variance).toBeLessThan(1.1);
  });

  it('alphaBar(0) = 1', () => {
    expect(alphaBar(0, betas)).toBeCloseTo(1, 10);
  });

  it('alphaBar decreases monotonically', () => {
    for (let t = 1; t < T; t++) {
      expect(alphaBar(t, betas)).toBeLessThan(alphaBar(t - 1, betas));
    }
  });

  it('alphaBar(T) < 0.01', () => {
    expect(alphaBar(T - 1, betas)).toBeLessThan(0.01);
  });

  it('perfect epsilonHat reconstructs z0', () => {
    const z0 = [[1, 2], [3, 4]];
    const epsilon = [[0.1, 0.2], [0.3, 0.4]];
    const ab = 0.36; // sqrt=0.6, sqrt1mAb=0.8
    const zt = forwardClosed(z0, epsilon, ab);
    // ẑ₀ = (z_t - sqrt(1-ab)*ε) / sqrt(ab)
    const sqrtAb = Math.sqrt(ab), sqrt1mAb = Math.sqrt(1 - ab);
    const z0Hat = zt.map((row, i) =>
      row.map((v, j) => (v - sqrt1mAb * epsilon[i][j]) / sqrtAb),
    );
    for (let i = 0; i < z0.length; i++)
      for (let j = 0; j < z0[i].length; j++)
        expect(z0Hat[i][j]).toBeCloseTo(z0[i][j], 10);
  });

  it('closed-form and incremental generate same distribution', () => {
    // Verify they have similar mean/variance, not identical samples
    const z0 = generateGaussianNoise(50, 2, 1);
    const epsAll = generateGaussianNoise(50, 2, 2);
    const abT = alphaBar(9, betas);
    const closed = forwardClosed(z0, epsAll, abT);

    let incremental = z0;
    for (let t = 0; t < 10; t++) {
      const epsT = generateGaussianNoise(50, 2, 100 + t);
      incremental = forwardIncremental(incremental, epsT, betas[t]);
    }

    const cStats = sampleStats(closed);
    const iStats = sampleStats(incremental);
    // Means and variances should be similar
    expect(Math.abs(cStats.mean - iStats.mean)).toBeLessThan(0.5);
    expect(Math.abs(cStats.variance - iStats.variance)).toBeLessThan(0.5);
  });
});

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
