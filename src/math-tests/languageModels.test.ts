import { describe, expect, it } from 'vitest';
import {
  autoregressiveJointProbability,
  bagOfWords,
  cosineSimilarity,
  dotProduct,
  euclideanDistance,
} from '@/lib/math/languageModels';

describe('languageModels', () => {
  it('computes dot product, distance, and cosine similarity', () => {
    expect(dotProduct([1, 2], [3, 4])).toBe(11);
    expect(euclideanDistance([0, 0], [3, 4])).toBe(5);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    expect(cosineSimilarity([1, 2], [2, 4])).toBeCloseTo(1);
  });

  it('makes bag-of-words invariant to token order', () => {
    const vocabulary = ['猫', '追', '狗'];
    expect(bagOfWords(['猫', '追', '狗'], vocabulary)).toEqual([1, 1, 1]);
    expect(bagOfWords(['狗', '追', '猫'], vocabulary)).toEqual([1, 1, 1]);
  });

  it('multiplies autoregressive conditional probabilities', () => {
    expect(autoregressiveJointProbability([0.5, 0.8, 0.25])).toBeCloseTo(0.1);
  });

  it('rejects vector dimension mismatches', () => {
    expect(() => dotProduct([1], [1, 2])).toThrow(/equal length/);
  });
});
