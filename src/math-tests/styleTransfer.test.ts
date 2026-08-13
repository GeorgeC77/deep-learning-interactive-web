import { describe, expect, it } from 'vitest';
import {
  gramMatrix,
  interpolateFeatures,
  permuteSpatialPositions,
  squaredFeatureLoss,
  styleMatrixLoss,
} from '@/lib/math/styleTransfer';

const content = [[1, 0, 1, 0], [0, 1, 0, 1]];
const style = [[1, 0, 1, 0], [1, 0, 1, 0]];

describe('style-transfer objectives', () => {
  it('computes the channel cross-correlation matrix', () => {
    expect(gramMatrix(content)).toEqual([[2, 0], [0, 2]]);
    expect(gramMatrix(style)).toEqual([[2, 2], [2, 2]]);
  });

  it('is invariant to a shared permutation of spatial positions', () => {
    const permuted = permuteSpatialPositions(style, [2, 0, 3, 1]);
    expect(gramMatrix(permuted)).toEqual(gramMatrix(style));
    expect(styleMatrixLoss(permuted, style)).toBe(0);
    expect(squaredFeatureLoss(permuted, style)).toBeGreaterThan(0);
  });

  it('interpolates exactly between content and style features', () => {
    expect(interpolateFeatures(content, style, 0)).toEqual(content);
    expect(interpolateFeatures(content, style, 1)).toEqual(style);
  });
});
