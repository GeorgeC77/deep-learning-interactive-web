import { describe, expect, it } from 'vitest';
import { ACTIVATIONS } from '../lib/math/activations';

describe('hidden-unit activations', () => {
  it('matches key values and gradients', () => {
    expect(ACTIVATIONS.relu.fn(-1)).toBe(0);
    expect(ACTIVATIONS.relu.grad(2)).toBe(1);
    expect(ACTIVATIONS.sigmoid.fn(0)).toBeCloseTo(0.5, 12);
    expect(ACTIVATIONS.sigmoid.grad(0)).toBeCloseTo(0.25, 12);
    expect(ACTIVATIONS.tanh.grad(0)).toBeCloseTo(1, 12);
  });

  it('keeps leaky ReLU and ELU active on the negative side', () => {
    expect(ACTIVATIONS.leakyRelu.grad(-2)).toBe(0.01);
    expect(ACTIVATIONS.elu.grad(-2)).toBeGreaterThan(0);
  });
});
