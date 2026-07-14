import { describe, it, expect } from 'vitest';
import {
  rotationField,
  sinField,
  blowUpField,
  eulerStep,
  rk4Step,
  flowMapForward,
  flowMapInverse,
  traceJacobian,
  logDensityChange,
  distance,
} from '../lib/math/continuousFlow';

describe('continuousFlow', () => {
  const start: [number, number] = [1.2, -0.7];

  it('forward then backward integration recovers the initial point (RK4)', () => {
    const t0 = 0;
    const t1 = 1;
    const dt = 0.01;
    const forward = flowMapForward(start, rotationField, t0, t1, dt, 'rk4');
    const backward = flowMapInverse(forward.final, rotationField, t1, t0, dt, 'rk4');
    expect(distance(start, backward.final)).toBeLessThan(1e-5);
  });

  it('forward then backward integration recovers the initial point (Euler)', () => {
    const t0 = 0;
    const t1 = 0.5;
    const dt = 0.005;
    const forward = flowMapForward(start, rotationField, t0, t1, dt, 'euler');
    const backward = flowMapInverse(forward.final, rotationField, t1, t0, dt, 'euler');
    expect(distance(start, backward.final)).toBeLessThan(5e-3);
  });

  it('volume-preserving rotation field has trace ≈ 0', () => {
    const point: [number, number] = [0.8, 1.3];
    const tr = traceJacobian(rotationField, point, 0, 1e-5);
    expect(tr).toBeCloseTo(0, 8);
  });

  it('RK4 is more accurate than Euler for the same step count on a known rotation trajectory', () => {
    // Integrate rotation for a quarter turn. Exact solution from [1, 0] is [0, 1].
    const p0: [number, number] = [1, 0];
    const t1 = Math.PI / 2;
    const steps = 32;
    const dt = t1 / steps;

    const eulerFinal = flowMapForward(p0, rotationField, 0, t1, dt, 'euler').final;
    const rk4Final = flowMapForward(p0, rotationField, 0, t1, dt, 'rk4').final;

    // Exact rotation from [1, 0] for time π/2 ends at [0, -1].
    const eulerError = distance(eulerFinal, [0, -1]);
    const rk4Error = distance(rk4Final, [0, -1]);

    expect(eulerError).toBeGreaterThan(1e-4);
    expect(rk4Error).toBeLessThan(eulerError / 10);
  });

  it('flow map is invertible even when f is non-bijective', () => {
    const t0 = 0;
    const t1 = 1;
    const dt = 0.01;
    const forward = flowMapForward(start, sinField, t0, t1, dt, 'rk4');
    const backward = flowMapInverse(forward.final, sinField, t1, t0, dt, 'rk4');
    expect(distance(start, backward.final)).toBeLessThan(1e-4);
  });

  it('sin field is also divergence-free (trace ≈ 0)', () => {
    const point: [number, number] = [0.5, 0.5];
    const tr = traceJacobian(sinField, point, 0, 1e-5);
    expect(tr).toBeCloseTo(0, 8);
  });

  it('log-density change stays near zero for a volume-preserving field', () => {
    const { final, trajectory } = flowMapForward(start, rotationField, 0, 2, 0.02, 'rk4');
    expect(final.length).toBe(2);
    const { cumulative } = logDensityChange(rotationField, trajectory, 0.02);
    const last = cumulative[cumulative.length - 1];
    expect(Math.abs(last)).toBeLessThan(1e-4);
  });

  it('single Euler step matches closed form for constant field', () => {
    const f = () => [2, -1];
    const h = [0, 0];
    expect(eulerStep(h, f, 0, 0.1)).toEqual([0.2, -0.1]);
  });

  it('single RK4 step is exact for linear fields', () => {
    // For linear ODEs RK4 is exact up to floating point when using one step.
    const h: [number, number] = [1, 0];
    const result = rk4Step(h, rotationField, 0, 0.1);
    expect(result[0]).toBeCloseTo(Math.cos(0.1), 6);
    expect(result[1]).toBeCloseTo(-Math.sin(0.1), 6);
  });

  it('locally Lipschitz field x² can blow up in finite time', () => {
    // dx/dt = x^2 has exact solution x(t) = x0 / (1 - x0 t), blow-up at t = 1/x0.
    const x0 = 1.0;
    const tBlowUp = 1 / x0;
    const forward = flowMapForward([x0, 0], blowUpField, 0, tBlowUp + 0.1, 0.01, 'rk4');
    const lastFinite = forward.trajectory.filter(
      (p) => Number.isFinite(p[0]) && Number.isFinite(p[1]),
    );
    expect(lastFinite.length).toBeLessThan(forward.trajectory.length);
  });

  it('global Lipschitz rotation field remains invertible over long horizons', () => {
    const t0 = 0;
    const t1 = 5;
    const dt = 0.01;
    const forward = flowMapForward(start, rotationField, t0, t1, dt, 'rk4');
    const backward = flowMapInverse(forward.final, rotationField, t1, t0, dt, 'rk4');
    expect(distance(start, backward.final)).toBeLessThan(1e-4);
  });
});
