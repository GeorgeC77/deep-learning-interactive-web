import { describe, it, expect } from 'vitest';
import {
  sigmoid,
  crossEntropyLoss,
  accuracy,
  predictClasses,
  meanConfidence,
  computeDecisionBoundary,
  scaleWeights,
} from '../lib/math/logistic';

const XRANGE: [number, number] = [-4, 4];
const YRANGE: [number, number] = [-3.5, 3.5];

const X: number[][] = [
  [-1, -1],
  [1, 1],
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
];
const y = [0, 1, 0, 1, 0, 1];

describe('logistic', () => {
  it('sigmoid maps large positive to 1 and large negative to 0', () => {
    expect(sigmoid(10)).toBeCloseTo(1, 4);
    expect(sigmoid(-10)).toBeCloseTo(0, 4);
    expect(sigmoid(0)).toBeCloseTo(0.5, 5);
  });

  it('vertical boundary is rendered when w2 = 0', () => {
    const w = [0, 1, 0];
    const boundary = computeDecisionBoundary(w, XRANGE, YRANGE);
    expect(boundary).not.toBeNull();
    expect(boundary!.x1).toBeCloseTo(boundary!.x2, 10);
    expect(boundary!.y1).toBeCloseTo(YRANGE[0], 10);
    expect(boundary!.y2).toBeCloseTo(YRANGE[1], 10);
  });

  it('positive scaling preserves predicted classes', () => {
    const w = [0, 1, 1];
    const c = 2;
    const scaled = scaleWeights(w, c);

    const preds = predictClasses(X, w);
    const scaledPreds = predictClasses(X, scaled);

    expect(scaledPreds).toEqual(preds);
  });

  it('positive scaling changes cross-entropy and confidence', () => {
    const w = [0, 1, 1];
    const c = 2;
    const scaled = scaleWeights(w, c);

    const loss = crossEntropyLoss(X, y, w);
    const scaledLoss = crossEntropyLoss(X, y, scaled);

    const conf = meanConfidence(X, w);
    const scaledConf = meanConfidence(X, scaled);

    expect(scaledLoss).not.toBeCloseTo(loss, 4);
    expect(scaledConf).not.toBeCloseTo(conf, 4);
  });

  it('w1 = w2 = 0 produces uniform predictions', () => {
    const positive = predictClasses(X, [2, 0, 0]);
    expect(positive.every((v) => v === 1)).toBe(true);

    const negative = predictClasses(X, [-1, 0, 0]);
    expect(negative.every((v) => v === 0)).toBe(true);

    const zero = predictClasses(X, [0, 0, 0]);
    const first = zero[0];
    expect(zero.every((v) => v === first)).toBe(true);
  });

  it('accuracy is 1 for a perfect separator', () => {
    const w = [0, 1, 1];
    expect(accuracy(X, y, w)).toBe(1);
  });

  it('decision boundary is invariant to positive scaling', () => {
    const w = [1, 1, 1];
    const scaled = scaleWeights(w, 3);
    const b1 = computeDecisionBoundary(w, XRANGE, YRANGE);
    const b2 = computeDecisionBoundary(scaled, XRANGE, YRANGE);
    expect(b1).not.toBeNull();
    expect(b2).not.toBeNull();
    expect(b1!.x1).toBeCloseTo(b2!.x1, 8);
    expect(b1!.y1).toBeCloseTo(b2!.y1, 8);
    expect(b1!.x2).toBeCloseTo(b2!.x2, 8);
    expect(b1!.y2).toBeCloseTo(b2!.y2, 8);
  });
});
