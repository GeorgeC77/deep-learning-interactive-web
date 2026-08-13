import { describe, expect, it } from 'vitest';
import {
  autodiffPassCounts,
  evaluateAutodiffTrace,
  forwardModeDirectionalDerivative,
  recommendAutodiffMode,
  reverseModeGradient,
} from '@/lib/math/autodiffModes';

describe('automatic differentiation modes', () => {
  it('counts full-Jacobian passes by input and output dimensions', () => {
    expect(autodiffPassCounts(1_000_000, 1)).toEqual({ forward: 1_000_000, reverse: 1 });
    expect(recommendAutodiffMode(1_000_000, 1)).toBe('reverse');
    expect(recommendAutodiffMode(2, 100)).toBe('forward');
    expect(recommendAutodiffMode(4, 4)).toBe('either');
  });

  it('evaluates the Bishop §8.2 primal trace', () => {
    const x1 = 0.7;
    const x2 = -0.4;
    const expected = x1 * x2 + Math.exp(x1 * x2) - Math.sin(x2);
    expect(evaluateAutodiffTrace(x1, x2).output).toBeCloseTo(expected, 12);
  });

  it('makes forward tangent columns agree with one reverse gradient', () => {
    const x1 = 0.7;
    const x2 = -0.4;
    const reverse = reverseModeGradient(x1, x2);
    expect(forwardModeDirectionalDerivative(x1, x2, [1, 0])).toBeCloseTo(reverse[0], 12);
    expect(forwardModeDirectionalDerivative(x1, x2, [0, 1])).toBeCloseTo(reverse[1], 12);
  });

  it('computes a JVP as the gradient dot the seed direction', () => {
    const gradient = reverseModeGradient(0.25, 0.8);
    const seed: [number, number] = [2, -3];
    const expected = gradient[0] * seed[0] + gradient[1] * seed[1];
    expect(forwardModeDirectionalDerivative(0.25, 0.8, seed)).toBeCloseTo(expected, 12);
  });
});
