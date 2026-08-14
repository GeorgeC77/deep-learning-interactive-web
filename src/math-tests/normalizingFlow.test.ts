import { describe, expect, it } from 'vitest';
import {
  affineCouplingForward,
  affineCouplingInverse,
  autoregressiveSchedule,
  transformedLogDensity,
} from '@/lib/math/normalizingFlow';

describe('normalizing-flow chapter calculations', () => {
  it('round-trips a multidimensional affine coupling transform', () => {
    const zA = [1.5, -0.25];
    const zB = [2, -3];
    const logScale = [Math.log(2), Math.log(0.5)];
    const shift = [1, -2];

    const forward = affineCouplingForward(zA, zB, logScale, shift);
    const inverse = affineCouplingInverse(forward.first, forward.second, logScale, shift);

    expect(inverse.first).toEqual(zA);
    expect(inverse.second[0]).toBeCloseTo(zB[0], 12);
    expect(inverse.second[1]).toBeCloseTo(zB[1], 12);
  });

  it('uses opposite log-determinants for the forward and inverse maps', () => {
    const logScale = [0.7, -0.2, 0.4];
    const forward = affineCouplingForward([1, 2, 3], [4, 5, 6], logScale, [0, 0, 0]);
    const inverse = affineCouplingInverse(forward.first, forward.second, logScale, [0, 0, 0]);

    expect(forward.logAbsDet).toBeCloseTo(0.9, 12);
    expect(inverse.logAbsDet).toBeCloseTo(-0.9, 12);
  });

  it('subtracts the forward log-determinant from the base log density', () => {
    expect(transformedLogDensity(-1, Math.log(2))).toBeCloseTo(-1 - Math.log(2), 12);
  });

  it('models the MAF and IAF dependency-depth reversal', () => {
    expect(autoregressiveSchedule('maf', 8)).toEqual({
      densitySequentialSteps: 1,
      samplingSequentialSteps: 8,
      densityParallel: true,
      samplingParallel: false,
    });
    expect(autoregressiveSchedule('iaf', 8)).toEqual({
      densitySequentialSteps: 8,
      samplingSequentialSteps: 1,
      densityParallel: false,
      samplingParallel: true,
    });
  });

  it('rejects malformed coupling vectors and invalid dimensions', () => {
    expect(() => affineCouplingForward([1], [2, 3], [0], [0])).toThrow(RangeError);
    expect(() => transformedLogDensity(Number.NaN, 0)).toThrow(RangeError);
    expect(() => autoregressiveSchedule('maf', 0)).toThrow(RangeError);
  });
});
