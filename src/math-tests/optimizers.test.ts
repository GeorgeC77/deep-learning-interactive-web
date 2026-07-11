import { describe, it, expect } from 'vitest';
import { loss, analyticalGrad, stationaryPoint, hessianEigen, step, type OptState } from '../lib/math/optimizers';

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

  it('Rosenbrock Hessian at (1,1) has correct eigenvalues and eigenvectors', () => {
    const h = hessianEigen('rosenbrock', 1, 1);
    // True eigenvalues of [[802, -400], [-400, 200]]
    const lambda1 = 501 - Math.sqrt(501 * 501 - 400); // ~0.399
    const lambda2 = 501 + Math.sqrt(501 * 501 - 400); // ~1001.601
    expect(h.vals[0]).toBeCloseTo(lambda1, 3);
    expect(h.vals[1]).toBeCloseTo(lambda2, 3);

    // Verify eigen-decomposition: H v = λ v and eigenvectors are orthonormal
    const H = [
      [2 + 1200 * 1 * 1 - 400 * 1, -400 * 1],
      [-400 * 1, 200],
    ];
    const [hxx, hxy] = H[0];
    const hyy = H[1][1];
    for (let i = 0; i < 2; i++) {
      const [vx, vy] = h.vecs[i];
      const λ = h.vals[i];
      expect(hxx * vx + hxy * vy).toBeCloseTo(λ * vx, 5);
      expect(hxy * vx + hyy * vy).toBeCloseTo(λ * vy, 5);
    }
    // Orthonormal
    const [v1x, v1y] = h.vecs[0];
    const [v2x, v2y] = h.vecs[1];
    expect(v1x * v2x + v1y * v2y).toBeCloseTo(0, 5);
    expect(v1x * v1x + v1y * v1y).toBeCloseTo(1, 5);
    expect(v2x * v2x + v2y * v2y).toBeCloseTo(1, 5);
  });

  it('Hessian eigen-decomposition matches finite-difference Hessian on quadratic', () => {
    const h = 1e-5;
    const x0 = 1.2, y0 = -0.8;
    const hxx = (loss(x0 + h, y0, 'quadratic') - 2 * loss(x0, y0, 'quadratic') + loss(x0 - h, y0, 'quadratic')) / (h * h);
    const hyy = (loss(x0, y0 + h, 'quadratic') - 2 * loss(x0, y0, 'quadratic') + loss(x0, y0 - h, 'quadratic')) / (h * h);
    const hxy = (loss(x0 + h, y0 + h, 'quadratic') - loss(x0 + h, y0 - h, 'quadratic')
      - loss(x0 - h, y0 + h, 'quadratic') + loss(x0 - h, y0 - h, 'quadratic')) / (4 * h * h);
    const eig = hessianEigen('quadratic', x0, y0);
    expect(eig.vals[0]).toBeCloseTo(2, 5);
    expect(eig.vals[1]).toBeCloseTo(2, 5);
    expect(hxx).toBeCloseTo(2, 5);
    expect(hyy).toBeCloseTo(2, 5);
    expect(hxy).toBeCloseTo(0, 5);
  });
});
