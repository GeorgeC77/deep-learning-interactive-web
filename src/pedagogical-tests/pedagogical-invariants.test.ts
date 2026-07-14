import { describe, it, expect } from 'vitest';
import { step, loss, generateNoiseSequence, type OptState, type Optimizer } from '../lib/math/optimizers';
import {
  makeBetaSchedule,
  alphaBar,
  forwardClosed,
  forwardIncremental,
  generateGaussianNoise,
  reverseStep,
  reverseChain,
  fitGaussianMixture2D,
  gaussianMixtureScore,
  epsilonFromScore,
  sampleMeanVector,
  sampleCovarianceMatrix,
  frobeniusDiff,
  mmdSquaredGaussian,
  makeSharedHistogram,
} from '../lib/math/diffusion';
import { emIteration, logLikelihood, runEM, kMeansInit, meanCenterError, labelInvariantMeanError } from '../lib/math/em';
import { multiHeadAttention } from '../lib/math/attention';
import { canStepBackward, forwardTape, backwardPass, stepForwardOnce, stepBackwardOnce, topoSort, type NodeSpec } from '../lib/math/backprop';

/* -------------------------------------------------------------------------- */
/* Optimization presets must match their pedagogical claims                 */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: optimization presets', () => {
  function runGDSteps(lr: number, steps: number, start: [number, number]): OptState {
    let state: OptState = { x: start[0], y: start[1], vx: 0, vy: 0, sx: 0, sy: 0, t: 0 };
    for (let i = 0; i < steps; i++) {
      const res = step(state, 'quadratic', 'GD', lr, 0, 0);
      state = res.newState;
      state.t = i + 1;
    }
    return state;
  }

  it('"一步到最优" preset actually reaches optimum in one step', () => {
    const state = runGDSteps(0.5, 1, [1.5, 1.5]);
    expect(state.x).toBeCloseTo(0, 10);
    expect(state.y).toBeCloseTo(0, 10);
    expect(loss(state.x, state.y, 'quadratic')).toBeCloseTo(0, 10);
  });

  it('"临界振荡" preset preserves distance from origin', () => {
    const state = runGDSteps(1.0, 1, [1.5, 1.5]);
    const r0 = Math.hypot(1.5, 1.5);
    const r1 = Math.hypot(state.x, state.y);
    expect(r1).toBeCloseTo(r0, 8);
  });

  it('"GD 发散" preset makes vanilla GD diverge', () => {
    const initialLoss = loss(1.5, 1.5, 'quadratic');
    const state = runGDSteps(1.2, 10, [1.5, 1.5]);
    const finalLoss = loss(state.x, state.y, 'quadratic');
    expect(finalLoss).toBeGreaterThan(initialLoss);
    expect(Math.hypot(state.x, state.y)).toBeGreaterThan(5);
  });
});

/* -------------------------------------------------------------------------- */
/* Diffusion score direction semantics                                        */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: diffusion score/denoiser', () => {
  it('analytic score points toward higher mixture density (toward the mean for a single Gaussian)', () => {
    // Single Gaussian centered at (2, -1).
    const gmm = {
      weights: [1],
      means: [[2, -1]],
      covs: [[[1, 0], [0, 1]]],
    };
    const betas = makeBetaSchedule(100, 1e-4, 0.02);
    const z: [number, number] = [5, 2];
    const score = gaussianMixtureScore(z, 50, betas, gmm);
    const towardMean = [gmm.means[0][0] - z[0], gmm.means[0][1] - z[1]];
    const dot = score[0] * towardMean[0] + score[1] * towardMean[1];
    expect(dot).toBeGreaterThan(0);
    expect(score.every(Number.isFinite)).toBe(true);
  });

  it('score-based reverse chain does not produce NaN or unbounded expansion', () => {
    const T = 100;
    const betas = makeBetaSchedule(T, 1e-4, 0.02);
    const z0 = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]];
    const gmm = fitGaussianMixture2D(z0, 3);
    const zT = generateGaussianNoise(z0.length, 2, 123);
    const path = reverseChain(zT, T, betas, (z, t) =>
      z.map((row) => epsilonFromScore(gaussianMixtureScore(row, t, betas, gmm), alphaBar(t, betas)))
    , false);
    const final = path[path.length - 1];
    expect(final.every((row) => row.every(Number.isFinite))).toBe(true);
    const norm0 = Math.hypot(...zT.flat());
    const norm1 = Math.hypot(...final.flat());
    expect(norm1).toBeLessThan(norm0 + 50);
  });

  it('closed-form and incremental forward produce the same distribution', () => {
    const T = 50;
    const betas = makeBetaSchedule(T, 1e-4, 0.02);
    const z0 = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]];
    const M = 200;
    const closedSamples: number[][] = [];
    const incrementalSamples: number[][] = [];
    for (let m = 0; m < M; m++) {
      const epsClosed = generateGaussianNoise(z0.length, 2, m + 1);
      closedSamples.push(...forwardClosed(z0, epsClosed, alphaBar(T, betas)));
      let zInc = z0.map((r) => [...r]);
      for (let t = 1; t <= T; t++) {
        const epsT = generateGaussianNoise(z0.length, 2, m * T + t);
        zInc = forwardIncremental(zInc, epsT, betas[t - 1]);
      }
      incrementalSamples.push(...zInc);
    }
    const meanDiff = Math.hypot(
      ...sampleMeanVector(closedSamples).map((v, i) => v - sampleMeanVector(incrementalSamples)[i]),
    );
    const covDiff = frobeniusDiff(sampleCovarianceMatrix(closedSamples), sampleCovarianceMatrix(incrementalSamples));
    const mmd = mmdSquaredGaussian(closedSamples, incrementalSamples);
    expect(meanDiff).toBeLessThan(0.3);
    expect(covDiff).toBeLessThan(0.5);
    expect(mmd).toBeLessThan(0.05);
  }, 30000);
});

/* -------------------------------------------------------------------------- */
/* EM non-decreasing likelihood                                               */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: EM', () => {
  it('full EM iteration never decreases observed-data log-likelihood from a poor init', () => {
    // Synthetic two-component data.
    const data: number[][] = [];
    for (let i = 0; i < 80; i++) data.push([Math.random() - 0.5, Math.random() - 0.5]);
    for (let i = 0; i < 80; i++) data.push([3 + Math.random() - 0.5, 3 + Math.random() - 0.5]);

    const poorInit = {
      means: [[10, 10], [-10, -10]],
      covs: [[[1, 0], [0, 1]], [[1, 0], [0, 1]]],
      pis: [0.5, 0.5],
    };
    let prev = logLikelihood(data, poorInit);
    let params = poorInit;
    for (let i = 0; i < 5; i++) {
      const result = emIteration(data, params);
      expect(result.logLikelihood).toBeGreaterThanOrEqual(prev - 1e-6);
      prev = result.logLikelihood;
      params = result.newParams;
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Attention equivariance must hold for every advertised permutation          */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: attention permutations', () => {
  function buildRandomWeights(dModel: number, numHeads: number) {
    const dK = dModel / numHeads;
    const randMat = (rows: number, cols: number) =>
      Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() - 0.5) * 0.5));
    return {
      allWQ: Array.from({ length: numHeads }, () => randMat(dModel, dK)),
      allWK: Array.from({ length: numHeads }, () => randMat(dModel, dK)),
      allWV: Array.from({ length: numHeads }, () => randMat(dModel, dK)),
      WO: randMat(dModel, dModel),
    };
  }

  function permReverse(n: number) { return Array.from({ length: n }, (_, i) => n - 1 - i); }
  function permCyclic(n: number) { return Array.from({ length: n }, (_, i) => (i + 1) % n); }
  function permSwap(n: number) { const p = Array.from({ length: n }, (_, i) => i); [p[0], p[1]] = [p[1], p[0]]; return p; }
  function permRandom(n: number) {
    const p = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    return p;
  }

  function applyPerm<T>(arr: T[], perm: number[]) { return perm.map((i) => arr[i]); }

  function maxAbsDiff(a: number[][], b: number[][]) {
    let max = 0;
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].length; j++) {
        max = Math.max(max, Math.abs(a[i][j] - b[i][j]));
      }
    }
    return max;
  }

  it.each([
    { name: 'reverse', perm: permReverse },
    { name: 'cyclic shift', perm: permCyclic },
    { name: 'swap', perm: permSwap },
    { name: 'random', perm: permRandom },
  ])('equivariance holds for $name permutation when PE and causal mask are off', ({ perm }) => {
    const dModel = 8;
    const numHeads = 2;
    const N = 5;
    const X = Array.from({ length: N }, () => Array.from({ length: dModel }, () => (Math.random() - 0.5)));
    const Ws = buildRandomWeights(dModel, numHeads);
    const r1 = multiHeadAttention(X, Ws.allWQ, Ws.allWK, Ws.allWV, Ws.WO, false);
    const permArr = perm(N);
    const XP = applyPerm(X, permArr);
    const r2 = multiHeadAttention(XP, Ws.allWQ, Ws.allWK, Ws.allWV, Ws.WO, false);
    const expected = applyPerm(r1.finalOutput, permArr);
    expect(maxAbsDiff(r2.finalOutput, expected)).toBeLessThan(1e-8);
  });
});


/* -------------------------------------------------------------------------- */
/* Diffusion seed and histogram semantics                                     */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: diffusion seed and histogram semantics', () => {
  it('resampling the reverse noise seed changes the denoised sample; same seed reproduces it', () => {
    const T = 50;
    const betas = makeBetaSchedule(T, 1e-4, 0.02);
    const zt = [[1, 2], [3, 4]];
    const eps = [[0.1, 0.2], [0.3, 0.4]];
    const r1 = reverseStep(zt, 25, eps, betas, false, 1);
    const r2 = reverseStep(zt, 25, eps, betas, false, 2);
    const r3 = reverseStep(zt, 25, eps, betas, false, 1);
    expect(JSON.stringify(r1)).not.toBe(JSON.stringify(r2));
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r3));
  });

  it('makeSharedHistogram produces aligned edges and total counts per dataset', () => {
    const a = [0.1, 0.5, 0.9, 1.5];
    const b = [-0.2, 0.4, 1.1, 1.8, 2.0];
    const h = makeSharedHistogram(a, b, 5);
    expect(h.sharedEdges.length).toBe(6);
    expect(h.countsA.reduce((s, v) => s + v, 0)).toBe(a.length);
    expect(h.countsB.reduce((s, v) => s + v, 0)).toBe(b.length);
    expect(h.sharedEdges[0]).toBeLessThanOrEqual(Math.min(...a, ...b));
    expect(h.sharedEdges[h.sharedEdges.length - 1]).toBeGreaterThanOrEqual(Math.max(...a, ...b));
  });

  it('conditional forward distribution has the predicted mean and covariance', () => {
    const T = 40;
    const betas = makeBetaSchedule(T, 1e-4, 0.02);
    const z0 = [[2.0, -1.0]];
    const M = 1000;
    const samples: number[][] = [];
    for (let m = 0; m < M; m++) {
      const eps = generateGaussianNoise(1, 2, m + 1);
      samples.push(...forwardClosed(z0, eps, alphaBar(T, betas)));
    }
    const mean = sampleMeanVector(samples);
    const ab = alphaBar(T, betas);
    const expectedMean = [Math.sqrt(ab) * z0[0][0], Math.sqrt(ab) * z0[0][1]];
    const meanDiff = Math.hypot(...mean.map((v, i) => v - expectedMean[i]));
    expect(meanDiff).toBeLessThan(0.15);

    const cov = sampleCovarianceMatrix(samples);
    const expectedVar = 1 - ab;
    const diagDiff = Math.abs((cov[0][0] + cov[1][1]) / 2 - expectedVar);
    expect(diagDiff).toBeLessThan(0.1);
    expect(Math.abs(cov[0][1])).toBeLessThan(0.1);
  }, 10000);
});

/* -------------------------------------------------------------------------- */
/* Optimization noise control                                                 */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: optimization noise control', () => {
  function rms(seq: [number, number][]): number {
    const flat = seq.flat();
    return Math.sqrt(flat.reduce((s, v) => s + v * v, 0) / flat.length);
  }

  it('generateNoiseSequence is deterministic and scales with sigma', () => {
    const seq1 = generateNoiseSequence(20, 0.5, 42);
    const seq2 = generateNoiseSequence(20, 0.5, 42);
    expect(seq1).toEqual(seq2);

    const zero = generateNoiseSequence(10, 0, 99);
    expect(zero.every((n) => n[0] === 0 && n[1] === 0)).toBe(true);

    const seq3 = generateNoiseSequence(20, 2.0, 42);
    expect(rms(seq3) / rms(seq1)).toBeCloseTo(4, 1);
  });

  it('commonNoise gives every optimizer the identical perturbation at the first step', () => {
    const optimizers: Optimizer[] = ['GD', 'Momentum', 'RMSProp', 'Adam'];
    const noiseSeq = generateNoiseSequence(5, 0.3, 7);
    const start: OptState = { x: 0, y: 0, vx: 0, vy: 0, sx: 0, sy: 0, t: 0 };

    const grads = optimizers.map((opt) =>
      step(start, 'quadratic', opt, 0.1, 0.9, 0.999, noiseSeq[0]).grad,
    );
    for (let i = 1; i < grads.length; i++) {
      expect(grads[i]).toEqual(grads[0]);
      expect(grads[i]).toEqual(noiseSeq[0]);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* EM diagnostics                                                             */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: EM diagnostics', () => {
  function twoBlobData(): number[][] {
    const pts: number[][] = [];
    for (let i = 0; i < 60; i++) {
      pts.push([i * 0.01 - 0.3 + Math.random() * 0.2, Math.random() * 0.2 - 0.1]);
    }
    for (let i = 0; i < 60; i++) {
      pts.push([2.5 + Math.random() * 0.2, 2.5 + Math.random() * 0.2]);
    }
    return pts;
  }

  it('meanCenterError equals total label-invariant error divided by K', () => {
    const trueMeans = [[0, 0], [3, 3]];
    const estMeans = [[0.1, -0.1], [2.9, 3.1]];
    const total = labelInvariantMeanError(trueMeans, estMeans).total;
    expect(meanCenterError(trueMeans, estMeans)).toBeCloseTo(total / trueMeans.length, 10);
  });

  it('runEM likelihood is non-decreasing and converges', () => {
    const data = twoBlobData();
    const init = kMeansInit(data, 2, 55);
    const { history, params } = runEM(data, init, { tol: 1e-3, maxIter: 100 });

    for (let i = 1; i < history.length; i++) {
      expect(history[i]).toBeGreaterThanOrEqual(history[i - 1] - 1e-6);
    }
    expect(history.length).toBeLessThanOrEqual(100);
    expect(params.means.length).toBe(2);
  });

  it('kMeansInit returns valid GMM parameters', () => {
    const data = twoBlobData();
    const params = kMeansInit(data, 3, 99);
    expect(params.means.length).toBe(3);
    expect(params.covs.length).toBe(3);
    expect(params.pis.reduce((s, p) => s + p, 0)).toBeCloseTo(1, 10);
    expect(params.pis.every((p) => p > 0)).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/* Backprop stepping semantics                                                */
/* -------------------------------------------------------------------------- */

describe('pedagogical invariants: backprop stepping', () => {
  const nodes: NodeSpec[] = [
    { id: 'w', op: 'weight', inputs: [], value: 2 },
    { id: 'x', op: 'input', inputs: [], value: 3 },
    { id: 'one', op: 'input', inputs: [], value: 1 },
    { id: 'y', op: 'multiply', inputs: ['w', 'x'], value: 0 },
    { id: 'z', op: 'add', inputs: ['y', 'one'], value: 0 },
  ];
  const order = topoSort(nodes);

  it('canStepBackward is false before forward, true after full forward', () => {
    expect(canStepBackward(null, null, order.length)).toBe(false);
    expect(canStepBackward(null, order.length - 1, order.length)).toBe(true);

    const { values } = forwardTape(nodes);
    expect(canStepBackward(values, null, order.length)).toBe(true);
  });

  it('forwardTape records every node with inputs and output', () => {
    const { tape } = forwardTape(nodes);
    expect(tape.length).toBe(nodes.length);

    const yEntry = tape.find((e) => e.nodeId === 'y')!;
    expect(yEntry.op).toBe('multiply');
    expect(yEntry.inputs).toEqual(['w', 'x']);
    expect(yEntry.output).toBeCloseTo(6, 10);

    const zEntry = tape.find((e) => e.nodeId === 'z')!;
    expect(zEntry.output).toBeCloseTo(7, 10);
  });

  it('stepForwardOnce and stepBackwardOnce produce the same gradients as full backwardPass', () => {
    const full = forwardTape(nodes);
    const { grads } = backwardPass(nodes, full.values);

    let stepFwdIdx: number | null = null;
    let stepFwdVals: Record<string, number> = {};
    while (true) {
      const r = stepForwardOnce(nodes, order, stepFwdIdx, stepFwdVals);
      if (!r) break;
      stepFwdIdx = r.stepFwdIdx;
      stepFwdVals = r.stepFwdVals;
    }
    expect(stepFwdIdx).toBe(order.length - 1);

    const revOrder = [...order].reverse();
    let stepBwdIdx: number | null = null;
    let stepBwdGrads: Record<string, number> = {};
    while (true) {
      const r = stepBackwardOnce(nodes, order, revOrder, stepBwdIdx, stepFwdVals, null, stepBwdGrads);
      if (!r) break;
      stepBwdIdx = r.stepBwdIdx;
      stepBwdGrads = r.stepBwdGrads;
    }

    expect(stepBwdGrads['w']).toBeCloseTo(grads['w'], 10);
    expect(stepBwdGrads['x']).toBeCloseTo(grads['x'], 10);
  });
});
