import { describe, it, expect } from 'vitest';
import { loss, analyticalGrad, stationaryPoint, hessianEigen, step, type Landscape, type Optimizer, type OptState } from '../lib/math/optimizers';

describe('optimizers', () => {
  it('gradient vs central difference (quadratic)', () => {
    const [gx, gy] = analyticalGrad(1, 2, 'quadratic');
    const h = 1e-5;
    const fx = (loss(1+h, 2, 'quadratic') - loss(1-h, 2, 'quadratic')) / (2*h);
    const fy = (loss(1, 2+h, 'quadratic') - loss(1, 2-h, 'quadratic')) / (2*h);
    expect(gx).toBeCloseTo(fx, 5);
    expect(gy).toBeCloseTo(fy, 5);
  });

  it('saddle Hessian at origin has one positive and one negative eigenvalue', () => {
    const h = hessianEigen('saddle', 0, 0);
    expect(h.vals[0] * h.vals[1]).toBeLessThan(0); // one positive, one negative (2, -2)
  });

  it('Rosenbrock grad(1,1) = 0', () => {
    const [gx, gy] = analyticalGrad(1, 1, 'rosenbrock');
    expect(gx).toBeCloseTo(0, 8);
    expect(gy).toBeCloseTo(0, 8);
  });

  it('Rosenbrock stationary point', () => {
    const sp = stationaryPoint('rosenbrock');
    expect(sp[0]).toBe(1);
    expect(sp[1]).toBe(1);
  });

  it('saddle stationary type is saddle, not minimum', () => {
    const sp = stationaryPoint('saddle');
    // (0,0) is a saddle point
    const h = hessianEigen('saddle', sp[0], sp[1]);
    expect(h.vals[0] * h.vals[1]).toBeLessThan(0); // different signs
  });

  it('GD step reduces loss on quadratic', () => {
    const st: OptState = { x: 1, y: 1, vx: 0, vy: 0, sx: 0, sy: 0, t: 0 };
    const { newState } = step(st, 'quadratic', 'GD', 0.1, 0.9, 0.999);
    expect(loss(newState.x, newState.y, 'quadratic')).toBeLessThan(loss(1, 1, 'quadratic'));
  });

  it('Momentum uses classical v=βv+g (not EMA averaging)', () => {
    // Classical momentum: v_t = β v_{t-1} + g_t
    // Our implementation: stepMomentum = beta * vPrev + grad
    const st1: OptState = { x: 1, y: 0, vx: 0, vy: 0, sx: 0, sy: 0, t: 0 };
    const { newState: ns1 } = step(st1, 'quadratic', 'Momentum', 0.1, 0.9, 0.999);
    // First step: v = 0.9*0 + g(=2) = 2, dx = -0.1*2 = -0.2
    expect(ns1.x).toBeCloseTo(0.8, 5);
    // Second step: v = 0.9*2 + g(0.8,0) = 1.8+1.6=3.4
    const ns2 = step(ns1, 'quadratic', 'Momentum', 0.1, 0.9, 0.999).newState;
    expect(ns2.x).toBeCloseTo(0.8 - 0.1 * 3.4, 5);
  });
});
