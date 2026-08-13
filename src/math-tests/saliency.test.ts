import { describe, expect, it } from 'vitest';
import {
  inputGradient,
  integratedGradients,
  linearSigmoidScore,
  occlusionAttribution,
  softmax,
} from '@/lib/math/saliency';

describe('saliency helpers', () => {
  it('makes integrated gradients approximately complete', () => {
    const input = [0.5, 1, -0.2];
    const weights = [1, 0.8, -0.5];
    const attributions = integratedGradients(input, weights, 0.1, 2000);
    const outputDifference = linearSigmoidScore(input, weights, 0.1)
      - linearSigmoidScore([0, 0, 0], weights, 0.1);
    expect(attributions.reduce((sum, value) => sum + value, 0)).toBeCloseTo(outputDifference, 3);
  });

  it('exposes saturation as a small-gradient counterexample', () => {
    const weights = [2, 2];
    const saturated = inputGradient([10, 10], weights, 0);
    expect(Math.max(...saturated.map(Math.abs))).toBeLessThan(1e-12);
    expect(occlusionAttribution([10, 10], weights, 0).every(Number.isFinite)).toBe(true);
  });

  it('normalizes softmax probabilities', () => {
    expect(softmax([2, -2]).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
  });
});
