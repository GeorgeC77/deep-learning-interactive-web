import { describe, it, expect } from 'vitest';
import {
  momentumTrajectory,
  finiteTimeVelocity,
  steadyStateFactor,
  constantGradient,
  alternatingGradient,
  noisyGradient,
  narrowValleyGradients,
  type MomentumConvention,
} from '../lib/math/momentum';

describe('momentum trajectory', () => {
  it('classical momentum reaches steady-state velocity -ηg/(1-μ) for constant gradient', () => {
    const g = 1.0;
    const mu = 0.9;
    const eta = 0.1;
    const T = 120;
    const convention: MomentumConvention = 'classical';
    const gradients = constantGradient(g, T);
    const { w } = momentumTrajectory(gradients, mu, eta, convention);

    const expected = -eta * g / (1 - mu);
    const tail = w.slice(-5);
    const deltas = tail.slice(1).map((val, i) => val - tail[i]);
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;

    expect(avgDelta).toBeCloseTo(expected, 3);
  });

  it('EMA momentum reaches steady-state velocity -ηg for constant gradient', () => {
    const g = 1.0;
    const mu = 0.9;
    const eta = 0.1;
    const T = 80;
    const convention: MomentumConvention = 'ema';
    const gradients = constantGradient(g, T);
    const { w } = momentumTrajectory(gradients, mu, eta, convention);

    const expected = -eta * g;
    const tail = w.slice(-10);
    const deltas = tail.slice(1).map((val, i) => val - tail[i]);
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;

    expect(avgDelta).toBeCloseTo(expected, 3);
  });

  it('finite-time velocity formula matches trajectory simulation', () => {
    const mu = 0.85;
    const eta = 0.2;
    const T = 25;
    const gradients = alternatingGradient(1.5, T);

    for (const convention of ['classical', 'ema'] as MomentumConvention[]) {
      const { w } = momentumTrajectory(gradients, mu, eta, convention);
      for (let t = 1; t <= T; t++) {
        const expectedDelta = w[t] - w[t - 1];
        expect(finiteTimeVelocity(gradients, mu, eta, t, convention)).toBeCloseTo(expectedDelta, 10);
      }
    }
  });

  it('alternating gradients produce bounded oscillations', () => {
    const g = 1.0;
    const mu = 0.9;
    const eta = 0.1;
    const T = 200;
    const gradients = alternatingGradient(g, T);
    const { w, v } = momentumTrajectory(gradients, mu, eta, 'classical');

    const maxV = Math.max(...v.map(Math.abs));
    const rangeW = Math.max(...w) - Math.min(...w);

    // Internal velocity is bounded by the first gradient g (transient) and
    // by the alternating-series sum g / (1 + μ) after the first step.
    expect(maxV).toBeLessThanOrEqual(g + 1e-9);
    expect(rangeW).toBeLessThan(eta * g / (1 - mu));
  });

  it('noisy gradients produce bounded velocity oscillations', () => {
    const g = 1.0;
    const mu = 0.9;
    const eta = 0.1;
    const T = 200;
    const seed = 42;
    const gradients = noisyGradient(g, T, seed);

    const maxAbsGradient = Math.max(...gradients.map(Math.abs));
    const { v } = momentumTrajectory(gradients, mu, eta, 'classical');
    const maxV = Math.max(...v.map(Math.abs));

    expect(maxV).toBeLessThan((maxAbsGradient / (1 - mu)) * 1.01);
  });

  it('steady-state factor matches analytical values', () => {
    expect(steadyStateFactor(0.9, 'classical')).toBeCloseTo(10, 6);
    expect(steadyStateFactor(0.5, 'classical')).toBeCloseTo(2, 6);
    expect(steadyStateFactor(0.9, 'ema')).toBe(1);
    expect(steadyStateFactor(0.5, 'ema')).toBe(1);
  });
  it('narrow valley gradients alternate between large and small values', () => {
    const T = 10;
    const grads = narrowValleyGradients(T);
    expect(grads.length).toBe(T);
    expect(grads[0]).toBe(1.0);
    expect(grads[1]).toBe(0.02);
    expect(grads[2]).toBe(1.0);
    expect(grads[3]).toBe(0.02);
  });
});
