import { describe, it, expect } from 'vitest';
import {
  symmetricGaussian,
  skewedMixture,
  squaredLoss,
  absoluteLoss,
  asymmetricAbsoluteLoss,
  zeroOneIntervalLoss,
  expectedRisk,
  optimalY,
  posteriorMean,
  posteriorMedian,
  posteriorMode,
} from '../lib/math/decisionTheory';

const T_MIN = -8;
const T_MAX = 8;

describe('decisionTheory', () => {
  it('squared-loss optimum approximates the posterior mean for a Gaussian', () => {
    const mean = 2.5;
    const sigma = 1.2;
    const posterior = symmetricGaussian(mean, sigma).density;

    const yOpt = optimalY(
      posterior,
      squaredLoss,
      T_MIN,
      T_MAX,
      T_MIN,
      T_MAX,
      2000,
    );
    const mu = posteriorMean(posterior, T_MIN, T_MAX);

    expect(yOpt).toBeCloseTo(mu, 2);
    expect(yOpt).toBeCloseTo(mean, 2);
  });

  it('absolute-loss optimum approximates the posterior median for a Gaussian', () => {
    const mean = 1.0;
    const sigma = 1.5;
    const posterior = symmetricGaussian(mean, sigma).density;

    const yOpt = optimalY(
      posterior,
      absoluteLoss,
      T_MIN,
      T_MAX,
      T_MIN,
      T_MAX,
      2000,
    );
    const med = posteriorMedian(posterior, T_MIN, T_MAX);

    // For absolute loss the risk minimum is flat near the median, so we
    // check both that the optimal risk matches the median risk and that
    // the returned prediction is close to the median.
    const riskOpt = expectedRisk(posterior, yOpt, absoluteLoss, T_MIN, T_MAX);
    const riskMed = expectedRisk(posterior, med, absoluteLoss, T_MIN, T_MAX);
    expect(riskOpt).toBeCloseTo(riskMed, 4);
    expect(Math.abs(yOpt - med)).toBeLessThan(0.05);
  });

  it('for a skewed mixture mean, median and mode are distinct', () => {
    const posterior = skewedMixture(-2, 0.8, 3, 1.5, 0.35).density;

    const mean = posteriorMean(posterior, T_MIN, T_MAX);
    const median = posteriorMedian(posterior, T_MIN, T_MAX);
    const mode = posteriorMode(posterior, T_MIN, T_MAX);

    expect(Math.abs(mean - median)).toBeGreaterThan(0.05);
    expect(Math.abs(mean - mode)).toBeGreaterThan(0.05);
    expect(Math.abs(median - mode)).toBeGreaterThan(0.05);
  });

  it('asymmetric loss shifts the optimum away from the median', () => {
    const posterior = symmetricGaussian(0, 1).density;
    const medianOpt = optimalY(
      posterior,
      (t, y) => asymmetricAbsoluteLoss(t, y, 1),
      T_MIN,
      T_MAX,
    );
    const shiftedOpt = optimalY(
      posterior,
      (t, y) => asymmetricAbsoluteLoss(t, y, 4),
      T_MIN,
      T_MAX,
    );

    expect(shiftedOpt).toBeGreaterThan(medianOpt + 0.1);
  });

  it('zero-one interval risk is bounded between 0 and 1', () => {
    const posterior = symmetricGaussian(0, 1).density;
    const risk = expectedRisk(
      posterior,
      0,
      (t, y) => zeroOneIntervalLoss(t, y, 0.5),
      T_MIN,
      T_MAX,
    );
    expect(risk).toBeGreaterThanOrEqual(0);
    expect(risk).toBeLessThanOrEqual(1);
  });
});
