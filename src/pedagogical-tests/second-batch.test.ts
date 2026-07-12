import { describe, it, expect } from 'vitest';
import { genScores, theoreticalAUC, empiricalAUC } from '../lib/math/roc';
import {
  computeDecisionBoundary,
  predictClasses,
  crossEntropyLoss,
  scaleWeights,
} from '../lib/math/logistic';
import { messagePassing, permutationEquivarianceError } from '../lib/math/gnn';
import { biasVarianceDecomposition } from '../lib/math/biasVariance';
import { softmax, topKFilter, nucleusFilter } from '../lib/math/autoregressive';
import {
  gaussian,
  sampleProposal,
  importanceEstimate,
  analyticTruth,
} from '../lib/math/importanceSampling';
import { metropolisHastings, computeESS } from '../lib/math/mcmc';
import { generateImage, generateMask, maskedMSE, allPatchMSE } from '../lib/math/mae';
import { computeSamePadding } from '../lib/math/conv';

describe('pedagogical invariants: second batch', () => {
  /* ---------------------------------------------------------------------- */
  /* ROC: overlap increases → AUC decreases                                 */
  /* ---------------------------------------------------------------------- */
  it('ROC: AUC decreases monotonically as overlap increases', () => {
    const aucs = [0, 0.5, 1].map((overlap) => {
      const { negScores, posScores } = genScores(2000, 42, overlap);
      return empiricalAUC(negScores, posScores);
    });
    expect(aucs[0]).toBeGreaterThan(aucs[1]);
    expect(aucs[1]).toBeGreaterThan(aucs[2]);
    expect(Math.abs(aucs[2] - 0.5)).toBeLessThan(0.1);
  });

  it('ROC: theoretical AUC matches empirical AUC', () => {
    const { negScores, posScores } = genScores(5000, 7, 0.5);
    expect(Math.abs(theoreticalAUC(0.5) - empiricalAUC(negScores, posScores))).toBeLessThan(0.05);
  });

  /* ---------------------------------------------------------------------- */
  /* Logistic: vertical boundary & scaling invariance                       */
  /* ---------------------------------------------------------------------- */
  it('logistic: w2=0 renders a vertical boundary', () => {
    const w = [0, 1, 0];
    const b = computeDecisionBoundary(w, [-4, 4], [-4, 4]);
    expect(b).not.toBeNull();
    expect(b!.x1).toBeCloseTo(b!.x2, 10);
    expect(b!.y1).toBeCloseTo(-4, 10);
    expect(b!.y2).toBeCloseTo(4, 10);
  });

  it('logistic: positive scaling preserves predicted classes', () => {
    const X = [
      [1, 1],
      [-1, -1],
      [2, -1],
    ];
    const w = [0, 1, 1];
    const preds = predictClasses(X, w);
    const scaled = predictClasses(X, scaleWeights(w, 3));
    expect(scaled).toEqual(preds);
    expect(crossEntropyLoss(X, [1, 0, 1], w)).not.toBeCloseTo(
      crossEntropyLoss(X, [1, 0, 1], scaleWeights(w, 3)),
      6,
    );
  });

  /* ---------------------------------------------------------------------- */
  /* GNN: rounds change output & permutation equivariance                   */
  /* ---------------------------------------------------------------------- */
  it('GNN: message passing rounds change node representations', () => {
    const adj = [
      [0, 1, 1, 0],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [0, 1, 1, 0],
    ];
    const features = [1, 2, 3, 0.5];
    const h0 = messagePassing(adj, features, 0, 0.5, 0.5, 'relu');
    const h2 = messagePassing(adj, features, 2, 0.5, 0.5, 'relu');
    expect(h0.length).toBe(1);
    expect(h2.length).toBe(3);
    expect(JSON.stringify(h0[0])).not.toBe(JSON.stringify(h2[2]));
  });

  it('GNN: permutation equivariance error is numerically zero', () => {
    const adj = [
      [0, 1, 1, 0],
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      [0, 1, 1, 0],
    ];
    const features = [1, 2, 3, 0.5];
    const perm = [3, 1, 0, 2];
    const err = permutationEquivarianceError(adj, features, perm, 2, 0.5, 0.5, 'relu');
    expect(err).toBeLessThan(1e-10);
  });

  /* ---------------------------------------------------------------------- */
  /* Bias-variance decomposition                                            */
  /* ---------------------------------------------------------------------- */
  it('bias-variance: expected test error ≈ bias² + variance + noise', () => {
    const result = biasVarianceDecomposition(40, 5, 0.3, 0, 100, 123);
    const ratio =
      (result.avgExpectedError + 1e-6) /
      (result.avgBias2 + result.avgVariance + result.noise + 1e-6);
    expect(ratio).toBeCloseTo(1, 1);
  });

  it('bias-variance: noise variance label matches actual distribution', () => {
    const sigma = 0.4;
    const result = biasVarianceDecomposition(40, 3, sigma, 0, 50, 99);
    expect(result.noise).toBeCloseTo(sigma * sigma, 6);
  });

  /* ---------------------------------------------------------------------- */
  /* Autoregressive: filtered probabilities sum to 1                        */
  /* ---------------------------------------------------------------------- */
  it('autoregressive: top-k and top-p filtered probabilities sum to 1', () => {
    const probs = softmax([0.2, 1.5, -0.3, 2.0, 0.1, 0.4]);
    const topk = topKFilter(probs, 3);
    const topp = nucleusFilter(probs, 0.7);
    expect(topk.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(topp.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  /* ---------------------------------------------------------------------- */
  /* Importance sampling                                                    */
  /* ---------------------------------------------------------------------- */
  it('importance sampling: estimate is close to analytic truth when q ≈ p', () => {
    const p = (x: number) => gaussian(x, 0, 1);
    const q = (x: number) => gaussian(x, 0, 1);
    const samples = sampleProposal(0, 1, 2000, 55);
    const { estimate } = importanceEstimate(samples, (x) => x * x, p, q);
    expect(Math.abs(estimate - analyticTruth('x2'))).toBeLessThan(0.1);
  });

  /* ---------------------------------------------------------------------- */
  /* MCMC: small proposal has lower ESS than balanced proposal              */
  /* ---------------------------------------------------------------------- */
  it('MCMC: small proposal ESS is lower than balanced proposal ESS', () => {
    const target = (x: number) =>
      0.5 * Math.exp(-0.5 * (x - 2) ** 2) + 0.5 * Math.exp(-0.5 * (x + 2) ** 2);
    const small = metropolisHastings(target, 0.1, 2000, 1, 500);
    const balanced = metropolisHastings(target, 1.0, 2000, 1, 500);
    expect(computeESS(small.samples)).toBeLessThan(computeESS(balanced.samples));
  });

  /* ---------------------------------------------------------------------- */
  /* Masked autoencoder                                                     */
  /* ---------------------------------------------------------------------- */
  it('MAE: resampling mask does not change the image', () => {
    const img = generateImage(16, 'stripes', 1);
    const mask1 = generateMask(16, 0.5, 10);
    const mask2 = generateMask(16, 0.5, 20);
    expect(mask1).not.toEqual(mask2);
    expect(generateImage(16, 'stripes', 1)).toEqual(img);
  });

  it('MAE: masked MSE only counts masked patches', () => {
    const img = generateImage(16, 'circle', 3);
    const mask = generateMask(16, 0.5, 5);
    const recon = img.map((v, i) => (mask[i] ? 0 : v));
    const mMasked = maskedMSE(img, recon, mask);
    const mAll = allPatchMSE(img, recon);
    expect(mMasked).toBeGreaterThan(0);
    expect(mAll).not.toBeCloseTo(mMasked, 6);
  });

  /* ---------------------------------------------------------------------- */
  /* Convolution SAME padding                                               */
  /* ---------------------------------------------------------------------- */
  it('convolution: SAME padding output equals ceil(I / S)', () => {
    for (const [I, K, S] of [
      [7, 3, 1],
      [7, 3, 2],
      [8, 4, 1],
      [8, 4, 2],
      [10, 5, 3],
    ]) {
      const { outputSize } = computeSamePadding(I, K, S);
      expect(outputSize).toBe(Math.ceil(I / S));
    }
  });
});
