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
  rotationMatrix,
  rotateW,
  ppcaCovariance,
  posteriorMean,
} from '../lib/math/ppca';

const N = 200;
const SEED = 123;
const TRUE_W = [[2], [1]];
const TRUE_SIGMA = 0.4;

function matMulVec(M: number[][], v: number[]): number[] {
  return M.map((row) => row.reduce((s, a, i) => s + a * v[i], 0));
}

function vecDot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

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

  it('rotation preserves W W^T, covariance, likelihood and reconstruction', () => {
    const data = generatePPCAData(80, 123, [[2], [1]], 0.4);
    const mean = sampleMean(data);
    const centered = data.map((row) => row.map((v, i) => v - mean[i]));
    const S = sampleCovariance(centered);
    const ml = ppcaClosedFormML(S, 1);

    const angles = [-1.2, -0.5, 0, 0.7, 2.1];
    for (const phi of angles) {
      const R = rotationMatrix(1, phi);
      const Wrot = rotateW(ml.Wml, R);

      // R^T R = I
      expect(R[0][0] * R[0][0]).toBeCloseTo(1, 10);

      // W W^T invariant
      const Cbase = ppcaCovariance(ml.Wml, ml.sigma2ml);
      const Crot = ppcaCovariance(Wrot, ml.sigma2ml);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          expect(Cbase[i][j]).toBeCloseTo(Crot[i][j], 10);
        }
      }

      // Likelihood invariant
      expect(ppcaLogLikelihood(S, Wrot, ml.sigma2ml, 1)).toBeCloseTo(
        ppcaLogLikelihood(S, ml.Wml, ml.sigma2ml, 1),
        10,
      );

      // Reconstruction invariant
      const rBase = posteriorReconstruction(data[0], ml.Wml, ml.sigma2ml, mean);
      const rRot = posteriorReconstruction(data[0], Wrot, ml.sigma2ml, mean);
      expect(Math.hypot(rBase[0] - rRot[0], rBase[1] - rRot[1])).toBeCloseTo(0, 10);
    }
  });

  it('M=1 sign flip does not change the model', () => {
    const data = generatePPCAData(80, 123, [[2], [1]], 0.4);
    const mean = sampleMean(data);
    const centered = data.map((row) => row.map((v, i) => v - mean[i]));
    const S = sampleCovariance(centered);
    const ml = ppcaClosedFormML(S, 1);

    const R = [[-1]];
    const Wneg = rotateW(ml.Wml, R);

    // Latent coordinate flips sign
    const x = [data[0][0] - mean[0], data[0][1] - mean[1]];
    const zPos = posteriorMean(x, ml.Wml, ml.sigma2ml);
    const zNeg = posteriorMean(x, Wneg, ml.sigma2ml);
    expect(zPos[0] + zNeg[0]).toBeCloseTo(0, 10);

    // Observed reconstruction unchanged
    const rPos = posteriorReconstruction(data[0], ml.Wml, ml.sigma2ml, mean);
    const rNeg = posteriorReconstruction(data[0], Wneg, ml.sigma2ml, mean);
    expect(Math.hypot(rPos[0] - rNeg[0], rPos[1] - rNeg[1])).toBeCloseTo(0, 10);
  });

  it('M=2 rotation preserves W W^T', () => {
    const S = [
      [3, 1],
      [1, 2],
    ];
    const ml = ppcaClosedFormML(S, 2);
    const phi = Math.PI / 7;
    const R = rotationMatrix(2, phi);
    const Wrot = rotateW(ml.Wml, R);

    // R^T R = I
    const RtR = [
      [R[0][0] * R[0][0] + R[1][0] * R[1][0], R[0][0] * R[0][1] + R[1][0] * R[1][1]],
      [R[0][1] * R[0][0] + R[1][1] * R[1][0], R[0][1] * R[0][1] + R[1][1] * R[1][1]],
    ];
    expect(RtR[0][0]).toBeCloseTo(1, 10);
    expect(RtR[1][1]).toBeCloseTo(1, 10);
    expect(RtR[0][1]).toBeCloseTo(0, 10);

    // At the M = D boundary the standard noise estimator is undefined; use
    // sigma^2 = 0 so that C = W W^T and the invariance under rotation is exact.
    const sigma2 = 0;
    const Cbase = ppcaCovariance(ml.Wml, sigma2);
    const Crot = ppcaCovariance(Wrot, sigma2);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        expect(Cbase[i][j]).toBeCloseTo(Crot[i][j], 10);
      }
    }
  });

  describe('eig2x2', () => {
    it('returns correct eigenpairs for diag(4,1)', () => {
      const { eigenvalues, eigenvectors } = eig2x2([
        [4, 0],
        [0, 1],
      ]);
      expect(eigenvalues[0]).toBeCloseTo(4, 12);
      expect(eigenvalues[1]).toBeCloseTo(1, 12);
      expect(Math.abs(eigenvectors[0][0])).toBeCloseTo(1, 12);
      expect(Math.abs(eigenvectors[1][1])).toBeCloseTo(1, 12);
    });

    it('returns correct eigenpairs for diag(1,4)', () => {
      const { eigenvalues, eigenvectors } = eig2x2([
        [1, 0],
        [0, 4],
      ]);
      expect(eigenvalues[0]).toBeCloseTo(4, 12);
      expect(eigenvalues[1]).toBeCloseTo(1, 12);
      expect(Math.abs(eigenvectors[0][1])).toBeCloseTo(1, 12);
      expect(Math.abs(eigenvectors[1][0])).toBeCloseTo(1, 12);
    });

    it('returns correct eigenpairs for diag(2,2)', () => {
      const { eigenvalues, eigenvectors } = eig2x2([
        [2, 0],
        [0, 2],
      ]);
      expect(eigenvalues[0]).toBeCloseTo(2, 12);
      expect(eigenvalues[1]).toBeCloseTo(2, 12);
      expect(vecDot(eigenvectors[0], eigenvectors[1])).toBeCloseTo(0, 12);
    });

    it('returns correct eigenpairs for a rotated covariance', () => {
      // Rotate diag(5,1) by 30 degrees.
      const c = Math.cos(Math.PI / 6);
      const s = Math.sin(Math.PI / 6);
      const R = [
        [c, -s],
        [s, c],
      ];
      const D = [
        [5, 0],
        [0, 1],
      ];
      // S = R D R^T
      const Rt = [
        [c, s],
        [-s, c],
      ];
      const RD = [
        [R[0][0] * D[0][0], R[0][1] * D[1][1]],
        [R[1][0] * D[0][0], R[1][1] * D[1][1]],
      ];
      const S = [
        [RD[0][0] * Rt[0][0] + RD[0][1] * Rt[1][0], RD[0][0] * Rt[0][1] + RD[0][1] * Rt[1][1]],
        [RD[1][0] * Rt[0][0] + RD[1][1] * Rt[1][0], RD[1][0] * Rt[0][1] + RD[1][1] * Rt[1][1]],
      ];

      const { eigenvalues, eigenvectors } = eig2x2(S);
      expect(eigenvalues[0]).toBeCloseTo(5, 10);
      expect(eigenvalues[1]).toBeCloseTo(1, 10);

      for (let i = 0; i < 2; i++) {
        const v = eigenvectors[i];
        const len = Math.hypot(v[0], v[1]);
        expect(len).toBeCloseTo(1, 12);
        const Sv = matMulVec(S, v);
        const lambdaV = [eigenvalues[i] * v[0], eigenvalues[i] * v[1]];
        expect(Math.hypot(Sv[0] - lambdaV[0], Sv[1] - lambdaV[1])).toBeCloseTo(0, 10);
      }
    });

    it('eigenvectors are unit length and mutually orthogonal', () => {
      const S = [
        [3, 1],
        [1, 2],
      ];
      const { eigenvectors } = eig2x2(S);
      expect(Math.hypot(eigenvectors[0][0], eigenvectors[0][1])).toBeCloseTo(1, 12);
      expect(Math.hypot(eigenvectors[1][0], eigenvectors[1][1])).toBeCloseTo(1, 12);
      expect(vecDot(eigenvectors[0], eigenvectors[1])).toBeCloseTo(0, 12);
    });

    it('never returns a zero eigenvector', () => {
      const cases = [
        [
          [4, 0],
          [0, 1],
        ],
        [
          [1, 0],
          [0, 4],
        ],
        [
          [2, 0],
          [0, 2],
        ],
        [
          [3, 1],
          [1, 2],
        ],
      ];
      for (const M of cases) {
        const { eigenvectors } = eig2x2(M);
        for (const v of eigenvectors) {
          expect(Math.hypot(v[0], v[1])).toBeGreaterThan(0.99);
        }
      }
    });
  });
});
