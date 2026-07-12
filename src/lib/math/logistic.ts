/* -------------------------------------------------------------------------- */
/* Logistic regression math                                                   */
/* -------------------------------------------------------------------------- */

const EPS = 1e-12;

export type LineSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

/**
 * Numerically stable sigmoid.
 */
export function sigmoid(z: number): number {
  if (z >= 0) {
    const e = Math.exp(-z);
    return 1 / (1 + e);
  }
  const e = Math.exp(z);
  return e / (1 + e);
}

/**
 * Average binary cross-entropy loss for 2-D feature data.
 *
 *   X: N x 2 matrix of observations
 *   y: N vector of labels in {0, 1}
 *   w: [w0, w1, w2] weights (w0 is the bias)
 */
export function crossEntropyLoss(
  X: number[][],
  y: number[],
  w: number[],
): number {
  if (X.length === 0) return 0;

  let total = 0;
  for (let i = 0; i < X.length; i++) {
    const z = w[0] + w[1] * X[i][0] + w[2] * X[i][1];
    const p = sigmoid(z);
    const pClamped = Math.max(p, EPS);
    const oneMinusP = Math.max(1 - p, EPS);
    total += -(y[i] * Math.log(pClamped) + (1 - y[i]) * Math.log(oneMinusP));
  }

  return total / X.length;
}

/**
 * Classification accuracy using a 0.5 probability threshold.
 */
export function accuracy(X: number[][], y: number[], w: number[]): number {
  if (X.length === 0) return 0;

  const preds = predictClasses(X, w);
  let correct = 0;
  for (let i = 0; i < y.length; i++) {
    if (preds[i] === y[i]) correct++;
  }
  return correct / y.length;
}

/**
 * Predict classes in {0, 1} for each row of X.
 */
export function predictClasses(X: number[][], w: number[]): number[] {
  return X.map((x) => {
    const z = w[0] + w[1] * x[0] + w[2] * x[1];
    return sigmoid(z) >= 0.5 ? 1 : 0;
  });
}

/**
 * Mean confidence: average of max(p, 1 - p) across all samples.
 */
export function meanConfidence(X: number[][], w: number[]): number {
  if (X.length === 0) return 0;

  let total = 0;
  for (const x of X) {
    const z = w[0] + w[1] * x[0] + w[2] * x[1];
    const p = sigmoid(z);
    total += Math.max(p, 1 - p);
  }
  return total / X.length;
}

/**
 * Compute the decision-boundary segment visible inside the plot rectangle.
 *
 * The boundary is the line w0 + w1*x + w2*y = 0 clipped to
 * xRange × yRange.
 */
export function computeDecisionBoundary(
  w: number[],
  xRange: [number, number],
  yRange: [number, number],
): LineSegment | null {
  const w0 = w[0];
  const w1 = w[1];
  const w2 = w[2];

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  // Uniform classifier: no decision boundary.
  if (Math.abs(w1) < EPS && Math.abs(w2) < EPS) {
    return null;
  }

  // Vertical boundary.
  if (Math.abs(w2) < EPS && Math.abs(w1) >= EPS) {
    const x = -w0 / w1;
    if (x < xMin || x > xMax) return null;
    return { x1: x, y1: yMin, x2: x, y2: yMax };
  }

  // Non-vertical boundary: trace the line across xRange and clip to yRange.
  const xLeft = xMin;
  const yLeft = -(w0 + w1 * xLeft) / w2;
  const xRight = xMax;
  const yRight = -(w0 + w1 * xRight) / w2;

  // If the line is entirely above or below the plot, nothing is visible.
  if (
    (yLeft > yMax && yRight > yMax) ||
    (yLeft < yMin && yRight < yMin)
  ) {
    return null;
  }

  const dx = xRight - xLeft;
  const dy = yRight - yLeft;

  let tEnter = 0;
  let tExit = 1;

  if (Math.abs(dy) < EPS) {
    // Horizontal line.
    if (yLeft < yMin || yLeft > yMax) return null;
    return { x1: xLeft, y1: yLeft, x2: xRight, y2: yLeft };
  }

  if (dy > 0) {
    tEnter = Math.max(tEnter, (yMin - yLeft) / dy);
    tExit = Math.min(tExit, (yMax - yLeft) / dy);
  } else {
    tEnter = Math.max(tEnter, (yMax - yLeft) / dy);
    tExit = Math.min(tExit, (yMin - yLeft) / dy);
  }

  if (tEnter > tExit) return null;

  return {
    x1: xLeft + tEnter * dx,
    y1: yLeft + tEnter * dy,
    x2: xLeft + tExit * dx,
    y2: yLeft + tExit * dy,
  };
}

/**
 * Scale all weights by a positive constant.
 *
 * This leaves the decision boundary unchanged but changes predicted
 * probabilities and the cross-entropy loss.
 */
export function scaleWeights(w: number[], c: number): number[] {
  if (c <= 0) {
    throw new Error('scaleWeights requires a positive scalar');
  }
  return [w[0] * c, w[1] * c, w[2] * c];
}
