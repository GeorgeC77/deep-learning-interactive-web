import { describe, it, expect } from 'vitest';
import { step, loss, type OptState } from '../lib/math/optimizers';
import {
  makeBetaSchedule,
  alphaBar,
  forwardClosed,
  forwardIncremental,
  generateGaussianNoise,
  reverseChain,
  fitGaussianMixture2D,
  gaussianMixtureScore,
  epsilonFromScore,
  sampleMeanVector,
  sampleCovarianceMatrix,
  frobeniusDiff,
  mmdSquaredGaussian,
} from '../lib/math/diffusion';
import { emIteration, logLikelihood } from '../lib/math/em';
import { multiHeadAttention } from '../lib/math/attention';

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
  });
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
