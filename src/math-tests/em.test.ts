import { describe, it, expect } from 'vitest';
import { gaussianPdf, emIteration, type GMMParams } from '../lib/math/em';

function generateGMMData(N: number, params: GMMParams, seed: number): number[][] {
  const rng = mulberry32(seed);
  const pts: number[][] = [];
  for (let i = 0; i < N; i++) {
    let u = rng(), k = 0, cum = 0;
    for (; k < params.pis.length; k++) { cum += params.pis[k]; if (u < cum) break; }
    const [mx, my] = params.means[k];
    const [[sx, sxy], [_, sy]] = params.covs[k];
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

  it('responsibilities sum to 1', () => {
    const result = emIteration(data, trueParams);
    for (const row of result.responsibilities) {
      expect(row.reduce((a, b) => a + b)).toBeCloseTo(1, 8);
    }
  });

  it('covariance is symmetric positive definite', () => {
    const result = emIteration(data, trueParams);
    for (const cov of result.newCovs) {
      expect(cov[0][1]).toBeCloseTo(cov[1][0], 10);
      const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
      expect(det).toBeGreaterThan(0);
    }
  });

  it('complete EM iteration does not decrease likelihood', () => {
    const result = emIteration(data, trueParams);
    const result2 = emIteration(data, { means: result.newMeans, covs: result.newCovs, pis: result.newPis });
    expect(result2.logLikelihood).toBeGreaterThanOrEqual(result.logLikelihood - 0.1);
  });

  it('recovered means approach true clusters', () => {
    let params = { ...trueParams, means: [[1, 1], [2, 2]] }; // bad init
    for (let t = 0; t < 10; t++) {
      const r = emIteration(data, params);
      params = { means: r.newMeans, covs: r.newCovs, pis: r.newPis };
    }
    // means should be closer to true means [0,0] and [3,3]
    const d1 = Math.hypot(params.means[0][0], params.means[0][1]);
    const d2 = Math.hypot(params.means[1][0] - 3, params.means[1][1] - 3);
    expect(d1 + d2).toBeLessThan(2);
  });

  it('data do not change when estimated parameters change', () => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    const result = emIteration(dataCopy, trueParams);
    // Data should be unchanged
    for (let i = 0; i < data.length; i++)
      for (let j = 0; j < 2; j++)
        expect(dataCopy[i][j]).toBe(data[i][j]);
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
