import { describe, it, expect } from 'vitest';
import {
  standardize,
  batchNorm,
  layerNorm,
} from '../lib/math/normalization';

describe('normalization', () => {
  it('standardize produces zero mean and unit std in the normalized values', () => {
    const values = [1, 2, 3, 4, 5];
    const { normalized, mean, std } = standardize(values);
    const normMean = normalized.reduce((s, v) => s + v, 0) / normalized.length;
    const normVar = normalized.reduce((s, v) => s + (v - normMean) * (v - normMean), 0) / normalized.length;
    expect(normMean).toBeCloseTo(0, 10);
    expect(Math.sqrt(normVar)).toBeCloseTo(1, 6);
    const recovered = normalized.map((v) => v * std + mean);
    recovered.forEach((v, i) => expect(v).toBeCloseTo(values[i], 10));
  });

  it('batchNorm zero-centers and unit-scales each feature (population statistics)', () => {
    const x = [
      [1, 10],
      [2, 20],
      [3, 30],
      [4, 40],
    ];
    const gamma = [1, 1];
    const beta = [0, 0];
    const { out, mean } = batchNorm(x, gamma, beta);
    expect(mean[0]).toBeCloseTo(2.5, 10);
    expect(mean[1]).toBeCloseTo(25, 10);
    // Check that normalized values have zero mean and unit population variance.
    for (let c = 0; c < 2; c++) {
      const col = out.map((row) => row[c]);
      const colMean = col.reduce((s, v) => s + v, 0) / col.length;
      const colVar = col.reduce((s, v) => s + v * v, 0) / col.length;
      expect(colMean).toBeCloseTo(0, 10);
      expect(colVar).toBeCloseTo(1, 6);
    }
  });

  it('batchNorm gamma/beta scale and shift the output', () => {
    const x = [[0], [0], [0]];
    const gamma = [2];
    const beta = [5];
    const { out } = batchNorm(x, gamma, beta);
    out.forEach((row) => expect(row[0]).toBeCloseTo(5, 10));
  });

  it('layerNorm zero-centers and unit-scales within a sample', () => {
    const x = [1, 2, 3, 4, 5];
    const gamma = x.map(() => 1);
    const beta = x.map(() => 0);
    const { out, mean } = layerNorm(x, gamma, beta);
    expect(mean).toBeCloseTo(3, 10);
    expect(out.reduce((s, v) => s + v, 0)).toBeCloseTo(0, 10);
    expect(
      out.reduce((s, v) => s + v * v, 0) / out.length,
    ).toBeCloseTo(1, 5);
  });
});
