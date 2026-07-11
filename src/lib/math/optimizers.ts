/* -------------------------------------------------------------------------- */
/* Optimizer math                                                              */
/* -------------------------------------------------------------------------- */

export type Optimizer = 'GD' | 'Momentum' | 'RMSProp' | 'Adam';
export type Landscape = 'quadratic' | 'illcond' | 'saddle' | 'rosenbrock';

export function loss(x: number, y: number, landscape: Landscape): number {
  switch (landscape) {
    case 'quadratic': return x * x + y * y;
    case 'illcond': return 0.05 * x * x + 5 * y * y;
    case 'saddle': return x * x - y * y + 0.05 * x * x * x * x + 0.05 * y * y * y * y;
    case 'rosenbrock': return Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2);
  }
}

/** Analytical gradients where possible; fallback to finite difference */
export function analyticalGrad(x: number, y: number, landscape: Landscape): [number, number] {
  switch (landscape) {
    case 'quadratic': return [2 * x, 2 * y];
    case 'illcond': return [0.1 * x, 10 * y];
    case 'saddle': return [2 * x + 0.2 * x * x * x, -2 * y + 0.2 * y * y * y];
    case 'rosenbrock':
      return [
        -2 * (1 - x) - 400 * x * (y - x * x),
        200 * (y - x * x),
      ];
  }
}

export function stationaryPoint(landscape: Landscape): [number, number] {
  switch (landscape) {
    case 'quadratic': return [0, 0];
    case 'illcond': return [0, 0];
    case 'saddle': return [0, 0]; // saddle point — minima at (0, ±√5)
    case 'rosenbrock': return [1, 1];
  }
}

export function hessianEigen(landscape: Landscape, x: number, y: number): { vals: [number, number]; vecs: [number, number][] } {
  switch (landscape) {
    case 'quadratic': return { vals: [2, 2], vecs: [[1, 0], [0, 1]] };
    case 'illcond': return { vals: [0.1, 10], vecs: [[1, 0], [0, 1]] };
    case 'saddle': {
      const hxx = 2 + 0.6 * x * x, hyy = -2 + 0.6 * y * y;
      return { vals: [hxx, hyy], vecs: [[1, 0], [0, 1]] };
    }
    case 'rosenbrock': {
      // Approximation
      const a = 1200 * x * x - 400 * y + 2;
      return { vals: [a / 10, a], vecs: [[1, 0], [0, 1]] };
    }
  }
}

/** Classical momentum: v_t = β v_{t-1} + g_t */
export function stepMomentum(g: number, vPrev: number, beta: number): number {
  return beta * vPrev + g;
}

export type OptState = { x: number; y: number; vx: number; vy: number; sx: number; sy: number; t: number };

export function step(
  state: OptState,
  landscape: Landscape,
  opt: Optimizer,
  lr: number,
  beta1: number,
  beta2: number,
): { newState: OptState; dx: number; dy: number } {
  const [gx, gy] = analyticalGrad(state.x, state.y, landscape);
  const { x, y, vx, vy, sx, sy, t } = state;
  let dx = 0, dy = 0, nvx = vx, nvy = vy, nsx = sx, nsy = sy;

  switch (opt) {
    case 'GD':
      dx = -lr * gx; dy = -lr * gy;
      break;
    case 'Momentum': {
      // Classical: v = βv + g (not EMA)
      nvx = beta1 * vx + gx;
      nvy = beta1 * vy + gy;
      dx = -lr * nvx; dy = -lr * nvy;
      break;
    }
    case 'RMSProp': {
      nsx = beta2 * sx + (1 - beta2) * gx * gx;
      nsy = beta2 * sy + (1 - beta2) * gy * gy;
      dx = -(lr / (Math.sqrt(nsx) + 1e-8)) * gx;
      dy = -(lr / (Math.sqrt(nsy) + 1e-8)) * gy;
      break;
    }
    case 'Adam': {
      nvx = beta1 * vx + (1 - beta1) * gx;
      nvy = beta1 * vy + (1 - beta1) * gy;
      nsx = beta2 * sx + (1 - beta2) * gx * gx;
      nsy = beta2 * sy + (1 - beta2) * gy * gy;
      const vxc = nvx / (1 - Math.pow(beta1, t + 1));
      const vyc = nvy / (1 - Math.pow(beta1, t + 1));
      const sxc = nsx / (1 - Math.pow(beta2, t + 1));
      const syc = nsy / (1 - Math.pow(beta2, t + 1));
      dx = -(lr / (Math.sqrt(sxc) + 1e-8)) * vxc;
      dy = -(lr / (Math.sqrt(syc) + 1e-8)) * vyc;
      break;
    }
  }

  return {
    newState: { x: x + dx, y: y + dy, vx: nvx, vy: nvy, sx: nsx, sy: nsy, t: t + 1 },
    dx, dy,
  };
}
