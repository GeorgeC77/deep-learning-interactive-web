/**
 * Continuous normalizing flows and ODE-based flow maps.
 *
 * The key pedagogical point: the vector field f does **not** need to be
 * bijective. As long as it is regular enough (locally Lipschitz), the induced
 * flow map is invertible on a finite time horizon by integrating the same
 * field backwards.
 */

export type Vector2D = [number, number];
export type VectorField = (h: number[], t: number) => number[];
export type Solver = 'euler' | 'rk4';

/** Rotation field: f([x, y]) = [y, -x]. Linear, volume-preserving, tr(J)=0. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function rotationField(h: number[], _t: number): number[] {
  const [x, y] = h;
  return [y, -x];
}

/** Non-linear, non-bijective field: f([x, y]) = [sin(y), x]. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function sinField(h: number[], _t: number): number[] {
  const [x, y] = h;
  return [Math.sin(y), x];
}

/** A small catalogue of fields for the lab UI. */
export const FLOW_PRESETS = [
  {
    id: 'rotation',
    name: '旋转场 (Rotation)',
    latex: 'f([x,y]) = [y, -x]',
    field: rotationField,
    volumePreserving: true,
  },
  {
    id: 'sin',
    name: '非线性非双射场 (Sin)',
    latex: 'f([x,y]) = [\\sin(y), x]',
    field: sinField,
    volumePreserving: false,
  },
] as const;

export type FlowPresetId = (typeof FLOW_PRESETS)[number]['id'];

/**
 * One explicit Euler step:
 *   h_{n+1} = h_n + dt * f(h_n, t_n)
 */
export function eulerStep(
  h: number[],
  f: VectorField,
  t: number,
  dt: number,
): number[] {
  const fh = f(h, t);
  return h.map((hi, i) => hi + dt * fh[i]);
}

/**
 * One classical RK4 step.
 */
export function rk4Step(
  h: number[],
  f: VectorField,
  t: number,
  dt: number,
): number[] {
  const add = (a: number[], b: number[]) => a.map((v, i) => v + b[i]);
  const scale = (a: number[], s: number) => a.map((v) => v * s);

  const k1 = f(h, t);
  const k2 = f(add(h, scale(k1, dt / 2)), t + dt / 2);
  const k3 = f(add(h, scale(k2, dt / 2)), t + dt / 2);
  const k4 = f(add(h, scale(k3, dt)), t + dt);

  return h.map((hi, i) => hi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

function chooseStep(solver: Solver) {
  return solver === 'euler' ? eulerStep : rk4Step;
}

function makeSteps(t0: number, t1: number, dt: number): { n: number; step: number } {
  const span = t1 - t0;
  // Use a fixed number of steps and adjust the last step to land exactly on t1.
  const rawSteps = Math.max(1, Math.round(Math.abs(span) / Math.abs(dt)));
  const step = span / rawSteps;
  return { n: rawSteps, step };
}

/**
 * Integrate the ODE dh/dt = f(h,t) from t0 to t1.
 * Returns the full trajectory (including the starting point) and the final point.
 */
export function flowMapForward(
  point: number[],
  f: VectorField,
  t0: number,
  t1: number,
  dt: number,
  solver: Solver = 'rk4',
): { final: number[]; trajectory: number[][] } {
  const step = chooseStep(solver);
  const { n, step: h } = makeSteps(t0, t1, dt);
  const trajectory: number[][] = [point.slice()];
  let current = point.slice();
  let t = t0;

  for (let i = 0; i < n; i++) {
    current = step(current, f, t, h);
    t += h;
    trajectory.push(current.slice());
  }

  return { final: current, trajectory };
}

/**
 * Inverse flow map: integrate backwards.
 * For autonomous fields this is simply integrating with -f; for time-dependent
 * fields we negate time as well so that the backward ODE is dh/dτ = -f(h, t1-τ).
 */
export function flowMapInverse(
  point: number[],
  f: VectorField,
  t1: number,
  t0: number,
  dt: number,
  solver: Solver = 'rk4',
): { final: number[]; trajectory: number[][] } {
  const backwardField: VectorField = (h, tau) => {
    const t = t1 - tau;
    const fh = f(h, t);
    return fh.map((v) => -v);
  };
  return flowMapForward(point, backwardField, 0, t1 - t0, Math.abs(dt), solver);
}

/**
 * Approximate the trace of the Jacobian of f at (point, t) with central
 * finite differences.
 */
export function traceJacobian(
  f: VectorField,
  point: number[],
  t: number,
  eps: number,
): number {
  let trace = 0;
  const dim = point.length;

  for (let i = 0; i < dim; i++) {
    const plus = point.slice();
    const minus = point.slice();
    plus[i] += eps;
    minus[i] -= eps;
    trace += (f(plus, t)[i] - f(minus, t)[i]) / (2 * eps);
  }

  return trace;
}

/**
 * Approximate the instantaneous change of log-density along a trajectory.
 *
 * For the ODE dh/dt = f(h,t), the probability density transforms as
 *   d/dt log p(h(t)) = -∇·f(h(t), t) = -tr(J_f).
 *
 * Returns both the instantaneous rates and the cumulative log-density change
 * relative to the starting point.
 */
export function logDensityChange(
  f: VectorField,
  trajectory: number[][],
  dt: number,
  eps = 1e-5,
): { rates: number[]; cumulative: number[] } {
  const rates: number[] = [];
  const cumulative: number[] = [0];
  let acc = 0;

  for (let i = 0; i < trajectory.length; i++) {
    const point = trajectory[i];
    const t = 0; // presets are autonomous; t is not needed for the trace
    const tr = traceJacobian(f, point, t, eps);
    const rate = -tr;
    rates.push(rate);

    if (i < trajectory.length - 1) {
      acc += rate * dt;
      cumulative.push(acc);
    }
  }

  return { rates, cumulative };
}

/** Euclidean distance between two points. */
export function distance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}
