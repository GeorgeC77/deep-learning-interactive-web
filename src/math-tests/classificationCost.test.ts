import { describe, it, expect } from 'vitest';
import {
  riskPositive,
  riskNegative,
  optimalThreshold,
  logOddsThreshold,
  optimalAction,
} from '../lib/math/classificationCost';

describe('classificationCost', () => {
  it('optimal action follows the threshold rule', () => {
    const cFP = 3;
    const cFN = 1;
    const threshold = optimalThreshold(cFP, cFN);

    expect(optimalAction(threshold + 0.1, cFP, cFN)).toBe('positive');
    expect(optimalAction(threshold - 0.1, cFP, cFN)).toBe('negative');
  });

  it('risks are equal exactly at the optimal threshold', () => {
    const cFP = 2;
    const cFN = 3;
    const pStar = optimalThreshold(cFP, cFN);

    expect(riskPositive(pStar, cFP, cFN)).toBeCloseTo(
      riskNegative(pStar, cFP, cFN),
      10,
    );
  });

  it('log-odds threshold equals log(cFP / cFN)', () => {
    const cFP = 4;
    const cFN = 2;
    expect(logOddsThreshold(cFP, cFN)).toBeCloseTo(Math.log(cFP / cFN), 10);
  });

  it('predicts positive when false-negative cost dominates', () => {
    expect(optimalAction(0.3, 1, 9)).toBe('positive');
  });

  it('predicts negative when false-positive cost dominates', () => {
    expect(optimalAction(0.7, 9, 1)).toBe('negative');
  });
});
