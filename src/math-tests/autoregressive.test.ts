import { describe, it, expect } from 'vitest';
import {
  softmax,
  applyTemperature,
  topKFilter,
  nucleusFilter,
  sampleNextToken,
  createRng,
} from '../lib/math/autoregressive';

describe('autoregressive', () => {
  it('softmax sums to 1', () => {
    const s = softmax([2, 1, 0.1]);
    expect(s.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it('top-k filtered probabilities sum to 1 (for k>0)', () => {
    const probs = [0.1, 0.2, 0.3, 0.4];
    expect(topKFilter(probs, 1).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(topKFilter(probs, 3).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(topKFilter(probs, 4).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it('top-p filtered probabilities sum to 1 (for p>0)', () => {
    const probs = [0.1, 0.2, 0.3, 0.4];
    expect(nucleusFilter(probs, 0.3).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(nucleusFilter(probs, 0.8).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(nucleusFilter(probs, 1.0).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it('same seed gives deterministic samples', () => {
    const probs = [0.1, 0.2, 0.3, 0.4];
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const a = sampleNextToken(probs, rng1);
    const b = sampleNextToken(probs, rng2);
    expect(a).toBe(b);
  });

  it('temperature scales logits (higher temperature → more uniform)', () => {
    const logits = [2, 1, 0];
    const lowT = softmax(applyTemperature(logits, 0.5));
    const highT = softmax(applyTemperature(logits, 2.0));
    const spreadLow = Math.max(...lowT) - Math.min(...lowT);
    const spreadHigh = Math.max(...highT) - Math.min(...highT);
    expect(spreadHigh).toBeLessThan(spreadLow);
  });
});
