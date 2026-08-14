import { describe, expect, it } from 'vitest';
import {
  gaussianKdeAt,
  positiveTestPosterior,
  trapezoidIntegral,
} from '@/lib/math/prerequisiteProbability';

describe('prerequisite probability math', () => {
  it('computes the classic medical-screening posterior', () => {
    expect(positiveTestPosterior(0.01, 0.9, 0.03)).toBeCloseTo(0.232558, 5);
  });

  it('keeps a Gaussian KDE approximately normalized', () => {
    const samples = [-1.2, -0.8, 0.9, 1.3];
    const step = 0.01;
    const xs = Array.from({ length: 1201 }, (_, index) => -6 + index * step);
    const density = xs.map((x) => gaussianKdeAt(samples, x, 0.45));
    expect(trapezoidIntegral(density, step)).toBeCloseTo(1, 4);
  });

  it('rejects a non-positive KDE bandwidth', () => {
    expect(() => gaussianKdeAt([0], 0, 0)).toThrow(/positive/);
  });
});
