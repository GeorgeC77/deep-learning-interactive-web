import { describe, it, expect } from 'vitest';
import {
  mlpForward,
  mlpJacobian,
  residualForward,
  residualJacobian,
  backpropGradient,
  matMul,
  identityMat,
} from '../lib/math/residual';

describe('residual', () => {
  const params = {
    W1: [
      [0.5, -0.3],
      [0.2, 0.4],
    ] as [[number, number], [number, number]],
    b1: [0.1, -0.1] as [number, number],
    W2: [
      [0.3, 0.1],
      [-0.2, 0.6],
    ] as [[number, number], [number, number]],
    b2: [0.0, 0.0] as [number, number],
  };

  it('residual forward equals x + F(x)', () => {
    const x: [number, number] = [1, -0.5];
    const y = residualForward(x, params);
    const fx = mlpForward(x, params);
    expect(y[0]).toBeCloseTo(x[0] + fx[0], 10);
    expect(y[1]).toBeCloseTo(x[1] + fx[1], 10);
  });

  it('residual Jacobian equals I + MLP Jacobian', () => {
    const x: [number, number] = [0.5, -0.2];
    const Jf = mlpJacobian(x, params);
    const Jr = residualJacobian(x, params);
    expect(Jr[0][0]).toBeCloseTo(1 + Jf[0][0], 10);
    expect(Jr[0][1]).toBeCloseTo(Jf[0][1], 10);
    expect(Jr[1][0]).toBeCloseTo(Jf[1][0], 10);
    expect(Jr[1][1]).toBeCloseTo(1 + Jf[1][1], 10);
  });

  it('stacking residual blocks keeps gradient norms near identity', () => {
    const x: [number, number] = [0.1, 0.2];
    const blocks = 5;
    const jacobians: [[number, number], [number, number]][] = [];
    for (let i = 0; i < blocks; i++) {
      jacobians.push(residualJacobian(x, params));
    }
    const grad = backpropGradient([1, 0], jacobians);
    const norm = Math.sqrt(grad[0] * grad[0] + grad[1] * grad[1]);
    // The residual blocks here are small; gradient norm should not vanish.
    expect(norm).toBeGreaterThan(0.1);
  });

  it('degenerate F ≈ -x makes residual Jacobian degenerate', () => {
    // Choose W1, b1 such that ReLU derivative is active and W2*W1 ≈ -I
    const degenerate = {
      W1: [
        [1, 0],
        [0, 1],
      ] as [[number, number], [number, number]],
      b1: [1, 1] as [number, number], // keep ReLU on for positive x
      W2: [
        [-1, 0],
        [0, -1],
      ] as [[number, number], [number, number]],
      b2: [0, 0] as [number, number],
    };
    const x: [number, number] = [1, 1];
    const J = residualJacobian(x, degenerate);
    // J ≈ I + (-I) = 0
    expect(Math.abs(J[0][0])).toBeLessThan(0.1);
    expect(Math.abs(J[1][1])).toBeLessThan(0.1);
  });

  it('identity matrix multiplication is neutral', () => {
    const A: [[number, number], [number, number]] = [
      [2, 3],
      [4, 5],
    ];
    expect(matMul(identityMat(), A)).toEqual(A);
    expect(matMul(A, identityMat())).toEqual(A);
  });
});
