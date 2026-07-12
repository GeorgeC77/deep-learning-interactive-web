/* -------------------------------------------------------------------------- */
/* Optimizer math                                                              */
/* -------------------------------------------------------------------------- */

export type Optimizer = 'GD' | 'Momentum' | 'RMSProp' | 'Adam';
export type Landscape = 'quadratic' | 'illcond' | 'saddle' | 'rosenbrock';
export type NoiseSequence = [number, number][];

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

/** True Hessian of the Rosenbrock function at (x, y). */
function rosenbrockHessian(x: number, y: number): [[number, number], [number, number]] {
  return [
    [2 + 1200 * x * x - 400 * y, -400 * x],
    [-400 * x, 200],
  ];
}

/** Eigen-decomposition of a symmetric 2x2 matrix [[a,b],[b,c]]. */
function eigen2x2Symmetric(
  a: number,
  b: number,
  c: number,
): { vals: [number, number]; vecs: [[number, number], [number, number]] } {
  const trace = a + c;
  const det = a * c - b * b;
  const disc = Math.sqrt(Math.max(trace * trace - 4 * det, 0));
  const v1 = (trace - disc) / 2;
  const v2 = (trace + disc) / 2;

  let vec1: [number, number] = [1, 0];
  let vec2: [number, number] = [0, 1];

  if (Math.abs(b) > 1e-10) {
    // (A - λI) v = 0  ⇒  (a - λ) v_x + b v_y = 0
    // Pick the formulation with the larger coefficient to avoid cancellation.
    const v1x = b;
    const v1y = v1 - a;
    const n1 = Math.hypot(v1x, v1y);
    vec1 = n1 > 1e-10 ? [v1x / n1, v1y / n1] : [1, 0];
    // Second eigenvector is orthogonal to the first.
    vec2 = [-vec1[1], vec1[0]];
  } else {
    // Diagonal matrix: eigenvectors are the coordinate axes.
    if (Math.abs(a - c) < 1e-10) {
      // Repeated eigenvalue; any basis works.
      vec1 = [1, 0];
      vec2 = [0, 1];
    } else if (a > c) {
      // λ2 = a (larger), λ1 = c (smaller)
      vec1 = [0, 1];
      vec2 = [1, 0];
    }
  }

  return { vals: [v1, v2], vecs: [vec1, vec2] };
}

export function stationaryPoint(landscape: Landscape): [number, number] {
  switch (landscape) {
    case 'quadratic': return [0, 0];
    case 'illcond': return [0, 0];
    case 'saddle': return [0, 0]; // saddle point — minima at (0, ±√10)
    case 'rosenbrock': return [1, 1];
  }
}

export function hessianEigen(
  landscape: Landscape,
  x: number,
  y: number,
): { vals: [number, number]; vecs: [number, number][] } {
  switch (landscape) {
    case 'quadratic': return { vals: [2, 2], vecs: [[1, 0], [0, 1]] };
    case 'illcond': return { vals: [0.1, 10], vecs: [[1, 0], [0, 1]] };
    case 'saddle': {
      const hxx = 2 + 0.6 * x * x;
      const hyy = -2 + 0.6 * y * y;
      return eigen2x2Symmetric(hxx, 0, hyy);
    }
    case 'rosenbrock': {
      const H = rosenbrockHessian(x, y);
      return eigen2x2Symmetric(H[0][0], H[0][1], H[1][1]);
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
  noise?: [number, number],
): { newState: OptState; dx: number; dy: number; grad: [number, number] } {
  let [gx, gy] = analyticalGrad(state.x, state.y, landscape);
  if (noise) {
    gx += noise[0];
    gy += noise[1];
  }
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
    grad: [gx, gy],
  };
}

/** Deterministic seeded PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pre-generate a deterministic [step][dimension] noise sequence. */
export function generateNoiseSequence(
  steps: number,
  scale: number,
  seed: number,
): NoiseSequence {
  const seq: NoiseSequence = [];
  if (scale === 0) {
    for (let i = 0; i < steps; i++) seq.push([0, 0]);
    return seq;
  }

  const rand = mulberry32(seed);
  for (let i = 0; i < steps; i++) {
    // Box-Muller transform for two independent standard normals.
    const u = 1 - rand();
    const v = rand();
    const r = Math.sqrt(-2 * Math.log(u));
    const z0 = r * Math.cos(2 * Math.PI * v);
    const z1 = r * Math.sin(2 * Math.PI * v);
    seq.push([z0 * scale, z1 * scale]);
  }
  return seq;
}
