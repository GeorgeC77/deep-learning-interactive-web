import { describe, it, expect } from 'vitest';
import {
  generatePPCAData,
  sampleMean,
  sampleCovariance,
  eig2x2,
  ppcaClosedFormML,
  posteriorReconstruction,
  pcaOrthogonalProjection,
  ppcaLogLikelihood,
} from '../lib/math/ppca';

const N = 200;
const SEED = 123;
const TRUE_W = [[2], [1]];
const TRUE_SIGMA = 0.4;

describe('ppca', () => {
  const data = generatePPCAData(N, SEED, TRUE_W, TRUE_SIGMA);
  const mean = sampleMean(data);
  const centered = data.map((row) => row.map((v, i) => v - mean[i]));
  const S = sampleCovariance(centered);
  const { eigenvalues } = eig2x2(S);

  it('M=1 closed-form σ²_ML equals average discarded eigenvalue', () => {
    const ml = ppcaClosedFormML(S, 1);
    const expected = eigenvalues[1];
    expect(ml.sigma2ml).toBeCloseTo(expected, 5);
    expect(ml.boundary).toBe(false);
  });

  it('PPCA reconstruction error is close to PCA reconstruction error', () => {
    const M = 1;
    const ml = ppcaClosedFormML(S, M);

    let ppcaMse = 0;
    let pcaMse = 0;
    const { eigenvectors } = eig2x2(S);
    const D = TRUE_W.length;
    const Wml: number[][] = Array.from({ length: D }, () => []);
    for (let i = 0; i < M; i++) {
      const scale = Math.sqrt(Math.max(0, eigenvalues[i] - ml.sigma2ml));
      for (let d = 0; d < D; d++) {
        Wml[d][i] = eigenvectors[i][d] * scale;
      }
    }

    for (let i = 0; i < data.length; i++) {
      const rPPCA = posteriorReconstruction(data[i], Wml, ml.sigma2ml, mean);
      const rPCA = pcaOrthogonalProjection(data[i], eigenvectors, M, mean);
      const dxP = data[i][0] - rPPCA[0];
      const dyP = data[i][1] - rPPCA[1];
      const dxC = data[i][0] - rPCA[0];
      const dyC = data[i][1] - rPCA[1];
      ppcaMse += dxP * dxP + dyP * dyP;
      pcaMse += dxC * dxC + dyC * dyC;
    }
    ppcaMse /= N;
    pcaMse /= N;

    // PPCA is a regularised projection and therefore slightly larger than PCA;
    // the two should be very close.
    expect(ppcaMse).toBeLessThanOrEqual(pcaMse + 0.05);
    expect(ppcaMse).toBeCloseTo(pcaMse, 1);
  });

  it('log-likelihood at ML parameters is at least that at a random σ²', () => {
    const M = 1;
    const ml = ppcaClosedFormML(S, M);
    const llML = ml.logLikelihood(S);
    const llRandom = ppcaLogLikelihood(S, ml.Wml, 0.5, 1);
    expect(llML).toBeGreaterThanOrEqual(llRandom - 1e-6);
  });

  it('rejects M = D as a boundary case for standard ML formulas', () => {
    const ml = ppcaClosedFormML(S, 2);
    expect(ml.boundary).toBe(true);
    expect(Number.isNaN(ml.sigma2ml)).toBe(true);
  });

  it('M=0 gives isotropic ML noise and zero loading matrix', () => {
    const ml = ppcaClosedFormML(S, 0);
    expect(ml.Wml[0]).toHaveLength(0);
    expect(ml.Wml[1]).toHaveLength(0);
    expect(ml.sigma2ml).toBeCloseTo((eigenvalues[0] + eigenvalues[1]) / 2, 5);
    expect(ml.boundary).toBe(false);
  });
});
