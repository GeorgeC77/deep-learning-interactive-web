import { describe, it, expect } from 'vitest';
import {
  sigmoid,
  normalCDF,
  normalPdf,
  scaledProbit,
  logisticGradient,
  probitGradient,
} from '../lib/math/probit';

describe('probit', () => {
  it('sigmoid maps large positive to 1, large negative to 0, and 0 to 0.5', () => {
    expect(sigmoid(10)).toBeCloseTo(1, 4);
    expect(sigmoid(-10)).toBeCloseTo(0, 4);
    expect(sigmoid(0)).toBeCloseTo(0.5, 5);
  });

  it('logistic gradient for y=1 approaches -1 as a -> -infty', () => {
    const g = logisticGradient(1, -10);
    expect(g).toBeCloseTo(-1, 4);
    expect(Math.abs(g)).toBeLessThanOrEqual(1.0001);
  });

  it('probit gradient for y=1 grows without bound for large negative a', () => {
    const a = -6;
    const g = probitGradient(1, a);
    expect(Math.abs(g)).toBeGreaterThan(1);
    expect(Math.abs(g)).toBeGreaterThan(Math.abs(logisticGradient(1, a)));
    // Mills ratio: φ(a)/Φ(a) ≈ |a| for large negative a.
    expect(Math.abs(Math.abs(g) - Math.abs(a))).toBeLessThan(1);
  });

  it('probit gradient at a=-8 is even larger and still approximately |a|', () => {
    const a = -8;
    const g = probitGradient(1, a);
    expect(Math.abs(g)).toBeGreaterThan(Math.abs(probitGradient(1, -6)));
    expect(Math.abs(Math.abs(g) - Math.abs(a))).toBeLessThan(1);
  });

  it('scaled probit slope at a=0 matches sigmoid slope at a=0', () => {
    const h = 1e-5;
    const sigmoidSlope = (sigmoid(h) - sigmoid(-h)) / (2 * h);
    const probitSlope = (scaledProbit(h) - scaledProbit(-h)) / (2 * h);
    expect(probitSlope).toBeCloseTo(sigmoidSlope, 3);
    expect(probitSlope).toBeCloseTo(0.25, 3);
  });

  it('normalCDF is monotonic and within [0, 1]', () => {
    const xs = Array.from({ length: 41 }, (_, i) => -4 + i * 0.2);
    let prev = -Infinity;
    for (const x of xs) {
      const p = normalCDF(x);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
      expect(p).toBeGreaterThanOrEqual(prev - 1e-12);
      prev = p;
    }
    expect(normalCDF(-6)).toBeCloseTo(0, 4);
    expect(normalCDF(6)).toBeCloseTo(1, 4);
  });

  it('normalPdf is symmetric and integrates approximately to 1', () => {
    expect(normalPdf(1.5)).toBeCloseTo(normalPdf(-1.5), 8);

    const dx = 0.001;
    let total = 0;
    for (let x = -6; x <= 6; x += dx) {
      total += normalPdf(x) * dx;
    }
    expect(total).toBeCloseTo(1, 3);
  });
});
