import { describe, it, expect } from 'vitest';
import {
  generateImage,
  generateMask,
  globalMeanBaseline,
  maskedMSE,
  allPatchMSE,
} from '../lib/math/mae';

describe('mae', () => {
  it('resampling mask does not change the generated image', () => {
    const imgA = generateImage(8, 'stripes', 1);
    const imgB = generateImage(8, 'stripes', 1);
    expect(imgA).toEqual(imgB);
  });

  it('masked MSE only counts masked patches', () => {
    const original = [1, 0.2, 0.3, 0.4];
    const mask = [true, false, false, false];
    const reconstruction = [0.5, 0.2, 0.3, 0.4];
    expect(maskedMSE(original, reconstruction, mask)).toBeCloseTo(0.25, 10);
    expect(maskedMSE(original, original, [false, false, false, false])).toBe(0);
  });

  it('all-patch MSE equals masked-patch MSE for a perfect reconstruction', () => {
    const original = generateImage(6, 'circle', 3);
    const mask = generateMask(original.length, 0.5, 7);
    const reconstruction = [...original];
    expect(allPatchMSE(original, reconstruction)).toBeCloseTo(
      maskedMSE(original, reconstruction, mask),
      10,
    );
    expect(allPatchMSE(original, reconstruction)).toBeGreaterThanOrEqual(
      maskedMSE(original, reconstruction, mask),
    );
  });

  it('global mean baseline has finite MSE', () => {
    const original = generateImage(6, 'gradient', 2);
    const mask = generateMask(original.length, 0.75, 5);
    const reconstruction = globalMeanBaseline(original, mask);
    const masked = maskedMSE(original, reconstruction, mask);
    const all = allPatchMSE(original, reconstruction);
    expect(Number.isFinite(masked)).toBe(true);
    expect(Number.isFinite(all)).toBe(true);
  });
});
