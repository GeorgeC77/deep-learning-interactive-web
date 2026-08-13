import { describe, expect, it } from 'vitest';
import {
  activeCellCount,
  circularTranslateGrid,
  gridsEqual,
  rotateGrid90,
} from '@/lib/math/symmetry';

const grid = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

describe('symmetry helpers', () => {
  it('preserves a transformation-invariant cell count', () => {
    const transformed = circularTranslateGrid(rotateGrid90(grid), 2, -1);
    expect(activeCellCount(transformed)).toBe(activeCellCount(grid));
  });

  it('implements a cyclic translation without boundary loss', () => {
    expect(circularTranslateGrid([[1, 0], [0, 0]], -1, 0)).toEqual([[0, 1], [0, 0]]);
  });

  it('makes the identity mask exactly equivariant', () => {
    const transformedInput = circularTranslateGrid(grid, 1, 0);
    const transformedMask = circularTranslateGrid(grid, 1, 0);
    expect(gridsEqual(transformedInput, transformedMask)).toBe(true);
  });
});
