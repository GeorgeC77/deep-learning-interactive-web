import { describe, it, expect } from 'vitest';
import {
  sigmoid,
  minimaxLoss,
  nonSaturatingLoss,
  gradMinimaxLogit,
  gradNonSaturatingLogit,
  gradMinimaxD,
  gradNonSaturatingD,
} from '../lib/math/gan';

describe('gan', () => {
  it('sigmoid maps logits to probabilities', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 10);
    expect(sigmoid(-5)).toBeCloseTo(0.0066928507, 6);
    expect(sigmoid(5)).toBeCloseTo(0.9933071493, 6);
  });

  it('loss values are correct at D=0.1, D=0.5, D=0.9', () => {
    expect(minimaxLoss(0.1)).toBeCloseTo(Math.log(0.9), 10);
    expect(nonSaturatingLoss(0.1)).toBeCloseTo(-Math.log(0.1), 10);

    expect(minimaxLoss(0.5)).toBeCloseTo(Math.log(0.5), 10);
    expect(nonSaturatingLoss(0.5)).toBeCloseTo(-Math.log(0.5), 10);

    expect(minimaxLoss(0.9)).toBeCloseTo(Math.log(0.1), 10);
    expect(nonSaturatingLoss(0.9)).toBeCloseTo(-Math.log(0.9), 10);
  });

  it('non-saturating gradient w.r.t. logit is -(1 - D)', () => {
    for (const D of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(gradNonSaturatingLogit(D)).toBeCloseTo(-(1 - D), 10);
    }
  });

  it('minimax gradient w.r.t. logit is -D', () => {
    for (const D of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(gradMinimaxLogit(D)).toBeCloseTo(-D, 10);
    }
  });

  it('gradients w.r.t. D match analytic forms', () => {
    for (const D of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(gradMinimaxD(D)).toBeCloseTo(1 / (1 - D), 10);
      expect(gradNonSaturatingD(D)).toBeCloseTo(-1 / D, 10);
    }
  });

  it('as D -> 0, minimax generator gradient vanishes and non-saturating approaches -1', () => {
    const D = 1e-8;
    expect(gradMinimaxLogit(D)).toBeCloseTo(0, 6);
    expect(gradNonSaturatingLogit(D)).toBeCloseTo(-1, 6);
  });

  it('negative derivative increases logit a and D under gradient descent', () => {
    // For a logit a, gradient descent a_new = a - eta * dL/da.
    // When dL/da < 0, a_new > a, so D_new = sigmoid(a_new) > D.
    const a = -1.0;
    const D = sigmoid(a);
    const eta = 0.1;

    const dMinimax = gradMinimaxLogit(D);
    const dNonSaturating = gradNonSaturatingLogit(D);

    expect(dMinimax).toBeLessThan(0);
    expect(dNonSaturating).toBeLessThan(0);

    const aNewMm = a - eta * dMinimax;
    const aNewNs = a - eta * dNonSaturating;
    expect(sigmoid(aNewMm)).toBeGreaterThan(D);
    expect(sigmoid(aNewNs)).toBeGreaterThan(D);
  });
});
