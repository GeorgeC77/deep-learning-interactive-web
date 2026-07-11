import { describe, it, expect } from 'vitest';
import {
  emIteration,
  eStep,
  mStep,
  logLikelihood,
  eigen2x2,
  type GMMParams,
} from '../lib/math/em';

function generateGMMData(N: number, params: GMMParams, seed: number): number[][] {
  const rng = mulberry32(seed);
  const pts: number[][] = [];
  for (let i = 0; i < N; i++) {
    const u = rng(); let k = 0, cum = 0;
    for (; k < params.pis.length; k++) { cum += params.pis[k]; if (u < cum) break; }
    const [mx, my] = params.means[k];
    const [[sx, sxy], [, sy]] = params.covs[k];
    const bm1 = Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-10))) * Math.cos(2 * Math.PI * rng());
    const bm2 = Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-10))) * Math.sin(2 * Math.PI * rng());
    pts.push([mx + Math.sqrt(sx) * bm1, my + sxy / Math.sqrt(Math.max(sx, 1e-10)) * bm1 + Math.sqrt(Math.max(sy - sxy * sxy / sx, 0)) * bm2]);
  }
  return pts;
}

describe('em', () => {
  const trueParams: GMMParams = {
    means: [[0, 0], [3, 3]],
    covs: [[[1, 0], [0, 1]], [[1, 0], [0, 1]]],
    pis: [0.5, 0.5],
  };
  const data = generateGMMData(200, trueParams, 42);

  it('eStep responsibilities sum to 1', () => {
    const resp = eStep(data, trueParams);
    for (const row of resp) {
      expect(row.reduce((a, b) => a + b)).toBeCloseTo(1, 8);
    }
  });

  it('mStep produces valid parameters', () => {
    const resp = eStep(data, trueParams);
    const updated = mStep(data, resp);
    expect(updated.means.length).toBe(trueParams.means.length);
    expect(updated.covs.length).toBe(trueParams.covs.length);
    expect(updated.pis.reduce((a, b) => a + b)).toBeCloseTo(1, 8);
  });

  it('logLikelihood increases after one EM iteration', () => {
    const ll0 = logLikelihood(data, trueParams);
    const result = emIteration(data, trueParams);
    expect(result.logLikelihood).toBeGreaterThanOrEqual(ll0 - 0.1);
  });

  it('complete EM iteration does not decrease likelihood', () => {
    const result = emIteration(data, trueParams);
    const result2 = emIteration(data, { means: result.newMeans, covs: result.newCovs, pis: result.newPis });
    expect(result2.logLikelihood).toBeGreaterThanOrEqual(result.logLikelihood - 0.1);
  });

  it('data do not change when estimated parameters change', () => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    emIteration(dataCopy, trueParams);
    // Data should be unchanged
    for (let i = 0; i < data.length; i++)
      for (let j = 0; j < 2; j++)
        expect(dataCopy[i][j]).toBe(data[i][j]);
  });

  it('mStep covariances are symmetric positive definite', () => {
    const resp = eStep(data, trueParams);
    const updated = mStep(data, resp);
    for (const cov of updated.covs) {
      expect(cov[0][1]).toBeCloseTo(cov[1][0], 8);
      const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
      expect(det).toBeGreaterThan(0);
      const trace = cov[0][0] + cov[1][1];
      expect(trace).toBeGreaterThan(0);
    }
  });

  it('eigen2x2 returns orthonormal eigenvectors matching eigenvalues', () => {
    const cov: number[][] = [[4, 2], [2, 3]];
    const { vals, vecs } = eigen2x2(cov);
    const trace = cov[0][0] + cov[1][1];
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
    const disc = Math.sqrt(trace * trace - 4 * det);
    const lambdaSmall = (trace - disc) / 2;
    const lambdaLarge = (trace + disc) / 2;
    expect(vals[0]).toBeCloseTo(Math.sqrt(lambdaSmall), 5);
    expect(vals[1]).toBeCloseTo(Math.sqrt(lambdaLarge), 5);

    // Orthonormal
    const [v1x, v1y] = vecs[0];
    const [v2x, v2y] = vecs[1];
    expect(v1x * v1x + v1y * v1y).toBeCloseTo(1, 5);
    expect(v2x * v2x + v2y * v2y).toBeCloseTo(1, 5);
    expect(v1x * v2x + v1y * v2y).toBeCloseTo(0, 5);

    // Eigenvector check: H v = λ v
    for (let i = 0; i < 2; i++) {
      const [vx, vy] = vecs[i];
      const λ = i === 0 ? lambdaSmall : lambdaLarge;
      expect(cov[0][0] * vx + cov[0][1] * vy).toBeCloseTo(λ * vx, 5);
      expect(cov[1][0] * vx + cov[1][1] * vy).toBeCloseTo(λ * vy, 5);
    }
  });

  it('handles data point far from all means', () => {
    const farPoint = [[1e6, 1e6]];
    const params: GMMParams = {
      means: [[0, 0], [3, 3]],
      covs: [[[1, 0], [0, 1]], [[1, 0], [0, 1]]],
      pis: [0.5, 0.5],
    };
    const resp = eStep(farPoint, params);
    expect(resp[0].reduce((a, b) => a + b)).toBeCloseTo(1, 8);
    expect(resp[0].some(Number.isNaN)).toBe(false);
  });

  it('handles covariance with very small determinant', () => {
    const point = [[0.1, 0.1]];
    const params: GMMParams = {
      means: [[0, 0], [3, 3]],
      covs: [[[1e-8, 0], [0, 1e-8]], [[1, 0], [0, 1]]],
      pis: [0.5, 0.5],
    };
    const resp = eStep(point, params);
    expect(resp[0].reduce((a, b) => a + b)).toBeCloseTo(1, 8);
    expect(resp[0].some(Number.isNaN)).toBe(false);
  });

  it('handles mixture component with very small weight', () => {
    const point = [[0.1, 0.1]];
    const params: GMMParams = {
      means: [[0, 0], [3, 3]],
      covs: [[[1, 0], [0, 1]], [[1, 0], [0, 1]]],
      pis: [1e-12, 1 - 1e-12],
    };
    const resp = eStep(point, params);
    expect(resp[0].reduce((a, b) => a + b)).toBeCloseTo(1, 8);
    expect(resp[0].some(Number.isNaN)).toBe(false);
  });
});

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
