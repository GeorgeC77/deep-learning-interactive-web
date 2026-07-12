import { describe, it, expect } from 'vitest';
import {
  computeOutputSize,
  computeSamePadding,
  applyConvolution,
} from '../lib/math/conv';

describe('conv', () => {
  it('SAME padding output equals ceil(I / S)', () => {
    const cases = [
      { I: 7, K: 3, S: 1 },
      { I: 7, K: 3, S: 2 },
      { I: 8, K: 4, S: 3 },
      { I: 10, K: 5, S: 4 },
    ];
    for (const { I, K, S } of cases) {
      const result = computeSamePadding(I, K, S);
      expect(result.outputSize).toBe(Math.ceil(I / S));
      expect(result.left + result.right).toBe(result.total);
    }
  });

  it('asymmetric SAME padding for even kernel with stride 1', () => {
    const result = computeSamePadding(7, 4, 1);
    expect(result.left).not.toBe(result.right);
    expect(result.total).toBeGreaterThan(0);
  });

  it('valid convolution matches floor formula', () => {
    const input = [1, 2, 3, 4, 5];
    const kernel = [1, 0, -1];
    const output = applyConvolution(input, kernel, 'valid');
    const expectedLength = computeOutputSize(input.length, kernel.length, 0, 1);
    expect(output.length).toBe(expectedLength);

    // Hand compute: positions 0..2
    // 1*1 + 2*0 + 3*-1 = -2
    // 2*1 + 3*0 + 4*-1 = -2
    // 3*1 + 4*0 + 5*-1 = -2
    expect(output).toEqual([-2, -2, -2]);
  });

  it('custom padding produces expected output length', () => {
    const input = [1, 1, 1, 1];
    const kernel = [1, 1];
    const customPad = { left: 1, right: 2 };
    const output = applyConvolution(input, kernel, 'custom', customPad);
    const expectedLength = Math.floor(
      (input.length + customPad.left + customPad.right - kernel.length) / 1,
    ) + 1;
    expect(output.length).toBe(expectedLength);
    // Padded input: [0, 1, 1, 1, 1, 0, 0]
    // Output: [1, 2, 2, 2, 1, 0]
    expect(output).toEqual([1, 2, 2, 2, 1, 0]);
  });

  it('stride-2 valid convolution skips every other position', () => {
    const input = [1, 2, 3, 4, 5, 6, 7];
    const kernel = [1, 0, -1];
    const output = applyConvolution(input, kernel, 'valid', undefined, 2);
    expect(output).toEqual([-2, -2, -2]);
  });
});
