export interface Pos {
  r: number;
  c: number;
}

export interface GridWorldConfig {
  rows: number;
  cols: number;
  start: Pos;
  goal: Pos;
  traps: Pos[];
  obstacles: Pos[];
  slipProb: number;
  gamma: number;
}

export const ACTIONS = [
  { name: '上', dr: -1, dc: 0 },
  { name: '下', dr: 1, dc: 0 },
  { name: '左', dr: 0, dc: -1 },
  { name: '右', dr: 0, dc: 1 },
];

export function defaultConfig(): GridWorldConfig {
  return {
    rows: 4,
    cols: 4,
    start: { r: 3, c: 0 },
    goal: { r: 0, c: 3 },
    traps: [{ r: 1, c: 1 }, { r: 2, c: 2 }],
    obstacles: [{ r: 1, c: 2 }],
    slipProb: 0.2,
    gamma: 0.95,
  };
}

export function stateIndex(pos: Pos, cols: number): number {
  return pos.r * cols + pos.c;
}

export function indexToState(idx: number, cols: number): Pos {
  return { r: Math.floor(idx / cols), c: idx % cols };
}

export function isSamePos(a: Pos, b: Pos): boolean {
  return a.r === b.r && a.c === b.c;
}

export function isTerminal(idx: number, config: GridWorldConfig): boolean {
  const pos = indexToState(idx, config.cols);
  return isSamePos(pos, config.goal) || config.traps.some((t) => isSamePos(pos, t));
}

export function isObstacle(idx: number, config: GridWorldConfig): boolean {
  const pos = indexToState(idx, config.cols);
  return config.obstacles.some((o) => isSamePos(pos, o));
}

export function rewardOf(idx: number, config: GridWorldConfig): number {
  const pos = indexToState(idx, config.cols);
  if (isSamePos(pos, config.goal)) return 1;
  if (config.traps.some((t) => isSamePos(pos, t))) return -1;
  return 0;
}

function clampMove(pos: Pos, action: { dr: number; dc: number }, config: GridWorldConfig): Pos {
  const next = { r: pos.r + action.dr, c: pos.c + action.dc };
  if (next.r < 0 || next.r >= config.rows || next.c < 0 || next.c >= config.cols) {
    return pos;
  }
  if (config.obstacles.some((o) => isSamePos(next, o))) {
    return pos;
  }
  return next;
}

export function getTransitions(
  idx: number,
  actionIdx: number,
  config: GridWorldConfig
): { nextIdx: number; prob: number }[] {
  const pos = indexToState(idx, config.cols);
  const intended = ACTIONS[actionIdx];
  const result = new Map<number, number>();

  // 预期方向
  const intendedPos = clampMove(pos, intended, config);
  const intendedIdx = stateIndex(intendedPos, config.cols);
  result.set(intendedIdx, (result.get(intendedIdx) || 0) + 1 - config.slipProb);

  // 滑向两侧（垂直于预期方向的左右）
  const leftDr = intended.dc;
  const leftDc = -intended.dr;
  const rightDr = -intended.dc;
  const rightDc = intended.dr;
  const left = clampMove(pos, { dr: leftDr, dc: leftDc }, config);
  const right = clampMove(pos, { dr: rightDr, dc: rightDc }, config);

  const leftIdx = stateIndex(left, config.cols);
  const rightIdx = stateIndex(right, config.cols);

  if (leftIdx === rightIdx) {
    result.set(leftIdx, (result.get(leftIdx) || 0) + config.slipProb);
  } else {
    result.set(leftIdx, (result.get(leftIdx) || 0) + config.slipProb / 2);
    result.set(rightIdx, (result.get(rightIdx) || 0) + config.slipProb / 2);
  }

  return Array.from(result.entries()).map(([nextIdx, prob]) => ({ nextIdx, prob }));
}

export function valueIterationStep(V: number[], config: GridWorldConfig): number[] {
  const n = config.rows * config.cols;
  const nextV = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    if (isObstacle(s, config)) {
      nextV[s] = 0;
      continue;
    }
    const r = rewardOf(s, config);
    if (isTerminal(s, config)) {
      nextV[s] = r;
      continue;
    }
    let best = -Infinity;
    for (let a = 0; a < ACTIONS.length; a++) {
      const trans = getTransitions(s, a, config);
      const q = trans.reduce((sum, t) => sum + t.prob * V[t.nextIdx], 0);
      if (q > best) best = q;
    }
    nextV[s] = r + config.gamma * best;
  }
  return nextV;
}

export function extractPolicy(V: number[], config: GridWorldConfig): number[] {
  const n = config.rows * config.cols;
  const policy = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    if (isObstacle(s, config) || isTerminal(s, config)) {
      policy[s] = -1;
      continue;
    }
    let bestA = 0;
    let bestQ = -Infinity;
    for (let a = 0; a < ACTIONS.length; a++) {
      const trans = getTransitions(s, a, config);
      const q = trans.reduce((sum, t) => sum + t.prob * V[t.nextIdx], 0);
      if (q > bestQ) {
        bestQ = q;
        bestA = a;
      }
    }
    policy[s] = bestA;
  }
  return policy;
}

export function policyEvaluationStep(V: number[], policy: number[], config: GridWorldConfig): number[] {
  const n = config.rows * config.cols;
  const nextV = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    if (isObstacle(s, config)) {
      nextV[s] = 0;
      continue;
    }
    const r = rewardOf(s, config);
    if (isTerminal(s, config)) {
      nextV[s] = r;
      continue;
    }
    const a = policy[s];
    const trans = getTransitions(s, a, config);
    const q = trans.reduce((sum, t) => sum + t.prob * V[t.nextIdx], 0);
    nextV[s] = r + config.gamma * q;
  }
  return nextV;
}

export function simulateTrajectory(
  policy: number[],
  config: GridWorldConfig,
  maxSteps: number,
  seed: number
): number[] {
  let s = stateIndex(config.start, config.cols);
  const traj = [s];
  let rand = seed;
  for (let step = 0; step < maxSteps; step++) {
    if (isTerminal(s, config)) break;
    const a = policy[s];
    const trans = getTransitions(s, a, config);
    rand = (rand * 9301 + 49297) % 233280;
    let u = rand / 233280;
    let cum = 0;
    let nextS = s;
    for (const t of trans) {
      cum += t.prob;
      if (u <= cum) {
        nextS = t.nextIdx;
        break;
      }
    }
    s = nextS;
    traj.push(s);
  }
  return traj;
}

export function maxAbsDiff(a: number[], b: number[]): number {
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    const d = Math.abs(a[i] - b[i]);
    if (d > diff) diff = d;
  }
  return diff;
}
