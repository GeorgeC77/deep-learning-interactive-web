import { describe, expect, it } from 'vitest';
import {
  coefficientNorm,
  fitPolynomial,
  predictPolynomial,
  rmsError,
  type RegressionPoint,
} from '@/lib/math/polynomialRegression';

describe('polynomial regression tutorial math', () => {
  it('recovers an exact quadratic from noiseless samples', () => {
    const points: RegressionPoint[] = [-2, -1, 0, 1, 2].map((x) => ({
      x,
      t: 1 + 2 * x - 0.5 * x * x,
    }));
    const coefficients = fitPolynomial(points, 2);

    expect(coefficients[0]).toBeCloseTo(1, 10);
    expect(coefficients[1]).toBeCloseTo(2, 10);
    expect(coefficients[2]).toBeCloseTo(-0.5, 10);
    expect(rmsError(points, coefficients)).toBeCloseTo(0, 10);
  });

  it('weight decay reduces coefficient norm for a high-degree fit', () => {
    const points: RegressionPoint[] = Array.from({ length: 10 }, (_, index) => {
      const x = index / 9;
      const deterministicNoise = index % 2 === 0 ? 0.2 : -0.2;
      return { x, t: Math.sin(2 * Math.PI * x) + deterministicNoise };
    });
    const unregularized = fitPolynomial(points, 9, 0);
    const regularized = fitPolynomial(points, 9, 0.1);

    expect(coefficientNorm(regularized)).toBeLessThan(coefficientNorm(unregularized));
    expect(regularized.every(Number.isFinite)).toBe(true);
  });

  it('predicts by evaluating coefficients in ascending power order', () => {
    expect(predictPolynomial(2, [1, 3, 4])).toBe(23);
  });
});
