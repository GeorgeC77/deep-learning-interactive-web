/* -------------------------------------------------------------------------- */
/* Residual block Jacobian / gradient-flow helpers (2-D)                       */
/* -------------------------------------------------------------------------- */

export type Vec2 = [number, number];
export type Mat2 = [[number, number], [number, number]];

export function addVec(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function scaleVec(s: number, v: Vec2): Vec2 {
  return [s * v[0], s * v[1]];
}

export function matVec(M: Mat2, v: Vec2): Vec2 {
  return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
}

export function matMul(A: Mat2, B: Mat2): Mat2 {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1],
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1],
    ],
  ];
}

export function transpose(M: Mat2): Mat2 {
  return [
    [M[0][0], M[1][0]],
    [M[0][1], M[1][1]],
  ];
}

export function identityMat(): Mat2 {
  return [
    [1, 0],
    [0, 1],
  ];
}

/** ReLU and its derivative (1 if x>0, 0 otherwise; x=0 maps to 0). */
export function relu(x: number): number {
  return x > 0 ? x : 0;
}

export function reluDeriv(x: number): number {
  return x > 0 ? 1 : 0;
}

/**
 * A tiny two-layer MLP: F(x) = W2 * ReLU(W1 x + b1) + b2.
 * All objects are 2-D.
 */
export interface MLPParams {
  W1: Mat2;
  b1: Vec2;
  W2: Mat2;
  b2: Vec2;
}

export function mlpForward(x: Vec2, params: MLPParams): Vec2 {
  const { W1, b1, W2, b2 } = params;
  const z = addVec(matVec(W1, x), b1);
  const h: Vec2 = [relu(z[0]), relu(z[1])];
  return addVec(matVec(W2, h), b2);
}

/**
 * Jacobian of the MLP F with respect to x.
 *
 * ∂F/∂x = W2 * diag(ReLU'(W1 x + b1)) * W1
 */
export function mlpJacobian(x: Vec2, params: MLPParams): Mat2 {
  const { W1, b1, W2 } = params;
  const z = addVec(matVec(W1, x), b1);
  const d0 = reluDeriv(z[0]);
  const d1 = reluDeriv(z[1]);
  // J = W2 * diag(d) * W1
  const M: Mat2 = [
    [
      W2[0][0] * d0 * W1[0][0] + W2[0][1] * d1 * W1[1][0],
      W2[0][0] * d0 * W1[0][1] + W2[0][1] * d1 * W1[1][1],
    ],
    [
      W2[1][0] * d0 * W1[0][0] + W2[1][1] * d1 * W1[1][0],
      W2[1][0] * d0 * W1[0][1] + W2[1][1] * d1 * W1[1][1],
    ],
  ];
  return M;
}

/** Residual block forward: y = x + F(x). */
export function residualForward(x: Vec2, params: MLPParams): Vec2 {
  return addVec(x, mlpForward(x, params));
}

/** Residual block Jacobian: I + ∂F/∂x. */
export function residualJacobian(x: Vec2, params: MLPParams): Mat2 {
  const J = mlpJacobian(x, params);
  return [
    [1 + J[0][0], J[0][1]],
    [J[1][0], 1 + J[1][1]],
  ];
}

/** Plain network Jacobian: product of per-block Jacobians. */
export function chainJacobian(jacobians: Mat2[]): Mat2 {
  return jacobians.reduce((acc, J) => matMul(J, acc), identityMat());
}

/**
 * Backpropagate a gradient `g` (dL/dy) through a chain of blocks.
 * Returns dL/dx = J_total^T g.
 */
export function backpropGradient(
  g: Vec2,
  jacobians: Mat2[],
): Vec2 {
  const J = chainJacobian(jacobians);
  return matVec(transpose(J), g);
}

/** Frobenius norm of a 2x2 matrix. */
export function matNorm(M: Mat2): number {
  return Math.sqrt(
    M[0][0] * M[0][0] +
      M[0][1] * M[0][1] +
      M[1][0] * M[1][0] +
      M[1][1] * M[1][1],
  );
}
