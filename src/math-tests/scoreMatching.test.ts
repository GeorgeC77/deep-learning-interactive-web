import { describe, it, expect } from 'vitest';
import {
  conditionalScore,
  scoreFromPredictedEpsilon,
  predictEpsilon,
  monteCarloMarginalScore,
  corrupt,
  sampleConditionalEpsilon,
  sampleConditionalEpsilons,
  l2Distance,
  l2NormSq,
  linearAlphaBar,
  cosineAlphaBar,
  generateCleanSamples,
  empiricalScoreMse,
  getAlphaBar,
} from '../lib/math/scoreMatching';
import { generateGaussianNoise } from '../lib/math/diffusion';

describe('scoreMatching', () => {
  it('conditionalScore matches the closed-form formula', () => {
    const x = [1.0, -0.5];
    const epsilon = [0.5, -0.3];
    const alphaBar = 0.36; // sqrt(1 - ab) = 0.8
    const score = conditionalScore(x, epsilon, 10, alphaBar);
    const expected = epsilon.map((e) => -e / Math.sqrt(1 - alphaBar));
    expect(score).toHaveLength(2);
    score.forEach((s, i) => expect(s).toBeCloseTo(expected[i], 10));
  });

  it('scoreFromPredictedEpsilon matches the formula', () => {
    const epsilonHat = [0.4, -0.6];
    const alphaBar = 0.64; // sqrt(1 - ab) = 0.6
    const score = scoreFromPredictedEpsilon(epsilonHat, 5, alphaBar);
    const expected = epsilonHat.map((e) => -e / Math.sqrt(1 - alphaBar));
    score.forEach((s, i) => expect(s).toBeCloseTo(expected[i], 10));
  });

  it('corrupt and sampleConditionalEpsilon are inverses for a fixed pair', () => {
    const x = [0.7, -1.2];
    const epsilon = [0.2, 0.9];
    const alphaBar = 0.49;
    const zt = corrupt(x, epsilon, alphaBar);
    const reconstructed = sampleConditionalEpsilon(zt, x, alphaBar);
    reconstructed.forEach((v, i) => expect(v).toBeCloseTo(epsilon[i], 10));
  });

  it('monteCarloMarginalScore converges to conditional score when the same (x, ε) pair is fixed', () => {
    const x = [0.5, -0.8];
    const epsilon = [-0.3, 0.6];
    const t = 20;
    const alphaBar = 0.25; // sqrt(1 - ab) = sqrt(0.75)
    const zt = corrupt(x, epsilon, alphaBar);
    const marginal = monteCarloMarginalScore(zt, t, alphaBar, 200, [x]);
    const expected = conditionalScore(x, epsilon, t, alphaBar);
    marginal.forEach((s, i) => expect(s).toBeCloseTo(expected[i], 10));
  });

  describe('MSE-optimal score prediction equals conditional expectation', () => {
    it('zero-mean noise: true marginal score is -z_t and minimises empirical MSE', () => {
      // Data: x ~ N(0, I), noise: ε ~ N(0, I).  For a fixed z_t the conditional
      // expectation is E[ε | z_t] = sqrt(1 - ᾱ_t) z_t, giving score(z_t) = -z_t.
      const z: number[] = [0.7, -0.4];
      const t = 15;
      const alphaBar = 0.49;
      const numSamples = 1500;

      const cleanSamples = generateGaussianNoise(3000, 2, 100);
      const sampleEpsilons = sampleConditionalEpsilons(
        z,
        alphaBar,
        numSamples,
        cleanSamples,
        123,
      );
      const sampleScores = sampleEpsilons.map((eps) =>
        scoreFromPredictedEpsilon(eps, t, alphaBar),
      );

      const empiricalMean = sampleScores
        .reduce((acc, s) => [acc[0] + s[0], acc[1] + s[1]], [0, 0])
        .map((v) => v / sampleScores.length);
      const trueScore = [-z[0], -z[1]];

      // The empirical mean of conditional scores should be close to the true score.
      expect(l2Distance(empiricalMean, trueScore)).toBeLessThan(0.15);

      const trueMse = empiricalScoreMse(trueScore, sampleScores);
      const biasedZero = [0, 0];
      const biasedScale = [-2 * z[0], -2 * z[1]];
      const mseZero = empiricalScoreMse(biasedZero, sampleScores);
      const mseScale = empiricalScoreMse(biasedScale, sampleScores);

      expect(trueMse).toBeLessThan(mseZero);
      expect(trueMse).toBeLessThan(mseScale);

      // The predicted-score path should also recover the true score at weight=1.
      const predictedEpsilon = predictEpsilon(z, t, alphaBar, 1.0);
      const predictedScore = scoreFromPredictedEpsilon(predictedEpsilon, t, alphaBar);
      expect(l2Distance(predictedScore, trueScore)).toBeCloseTo(0, 10);
    });
  });

  describe('score scale monotonicity and sign', () => {
    it('conditional score keeps the opposite sign of ε and shrinks as t grows', () => {
      const T = 50;
      const x = [0.0, 0.0];
      const epsilon = [0.8, -1.2];
      const magnitudes: number[] = [];
      for (let t = 1; t <= T; t++) {
        const ab = linearAlphaBar(t, T);
        const score = conditionalScore(x, epsilon, t, ab);
        // Opposite sign: dot product with ε must be negative.
        const dot = score[0] * epsilon[0] + score[1] * epsilon[1];
        expect(dot).toBeLessThan(0);
        magnitudes.push(Math.sqrt(l2NormSq(score)));
      }
      // As t grows, 1 - ᾱ_t grows, so |score| strictly decreases.
      for (let i = 0; i < magnitudes.length - 1; i++) {
        expect(magnitudes[i + 1]).toBeLessThan(magnitudes[i]);
      }
    });

    it('score scale blows up near t = 0 because 1 - ᾱ_t is tiny', () => {
      const T = 50;
      const x = [0.0, 0.0];
      const epsilon = [0.1, -0.1];
      const early = conditionalScore(x, epsilon, 1, linearAlphaBar(1, T));
      const late = conditionalScore(x, epsilon, T, linearAlphaBar(T, T));
      expect(Math.sqrt(l2NormSq(early))).toBeGreaterThan(
        Math.sqrt(l2NormSq(late)) * 10,
      );
    });
  });

  describe('noise schedules', () => {
    it('linear and cosine schedules start at ᾱ_0 = 1 and decrease', () => {
      const T = 50;
      expect(linearAlphaBar(0, T)).toBeCloseTo(1, 10);
      expect(cosineAlphaBar(0, T)).toBeCloseTo(1, 10);
      for (let t = 1; t <= T; t++) {
        expect(linearAlphaBar(t, T)).toBeLessThan(linearAlphaBar(t - 1, T));
        expect(cosineAlphaBar(t, T)).toBeLessThan(cosineAlphaBar(t - 1, T));
      }
      expect(linearAlphaBar(T, T)).toBeLessThan(0.7);
      expect(cosineAlphaBar(T, T)).toBeLessThan(0.05);
    });

    it('getAlphaBar returns the requested schedule', () => {
      const T = 20;
      const linear = getAlphaBar('linear', T);
      const cosine = getAlphaBar('cosine', T);
      expect(linear(0)).toBeCloseTo(1, 10);
      expect(cosine(0)).toBeCloseTo(1, 10);
      // The cosine schedule falls to near zero much faster than the linear one.
      expect(cosine(T)).toBeLessThan(linear(T));
    });
  });

  describe('data generation', () => {
    it('generateCleanSamples is deterministic and non-degenerate', () => {
      const a = generateCleanSamples(100, 7);
      const b = generateCleanSamples(100, 7);
      expect(a).toEqual(b);
      expect(a.length).toBe(100);
      const meanX = a.reduce((s, p) => s + p[0], 0) / a.length;
      const meanY = a.reduce((s, p) => s + p[1], 0) / a.length;
      expect(Math.abs(meanX)).toBeLessThan(2);
      expect(Math.abs(meanY)).toBeLessThan(3);
    });
  });
});
