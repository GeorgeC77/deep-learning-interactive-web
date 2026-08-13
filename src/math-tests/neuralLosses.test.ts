import { describe, expect, it } from 'vitest';
import {
  binaryCrossEntropyLogitGradient,
  binarySquaredErrorLogitGradient,
  multiclassCrossEntropy,
  softmax,
} from '../lib/math/neuralLosses';

describe('neural-network error functions', () => {
  it('keeps a corrective cross-entropy gradient on a confident error', () => {
    const logit = -8;
    expect(Math.abs(binaryCrossEntropyLogitGradient(logit, 1))).toBeGreaterThan(0.99);
    expect(Math.abs(binarySquaredErrorLogitGradient(logit, 1))).toBeLessThan(0.001);
  });

  it('normalizes softmax and rewards the target logit', () => {
    const probabilities = softmax([1, 2, 3]);
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(multiclassCrossEntropy([1, 2, 5], 2)).toBeLessThan(
      multiclassCrossEntropy([1, 2, -1], 2),
    );
  });
});
