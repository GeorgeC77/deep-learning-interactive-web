import { describe, it, expect } from 'vitest';
import {
  genScores,
  computeROC,
  computeAUC,
  theoreticalAUC,
  empiricalAUC,
} from '../lib/math/roc';

function estimateAUC(overlap: number, seed = 42): number {
  const { negScores, posScores } = genScores(10000, seed, overlap);
  return empiricalAUC(negScores, posScores);
}

describe('roc', () => {
  it('AUC decreases as overlap increases', () => {
    const auc0 = estimateAUC(0);
    const aucHalf = estimateAUC(0.5);
    const auc1 = estimateAUC(1);

    expect(auc0).toBeGreaterThan(aucHalf);
    expect(aucHalf).toBeGreaterThan(auc1);
  });

  it('full overlap gives AUC close to 0.5', () => {
    const auc = estimateAUC(1);
    expect(Math.abs(auc - 0.5)).toBeLessThan(0.1);
  });

  it('theoretical AUC matches empirical AUC within 0.05', () => {
    const overlaps = [0, 0.25, 0.5, 0.75, 1];
    for (const overlap of overlaps) {
      const empirical = estimateAUC(overlap);
      const theoretical = theoreticalAUC(overlap);
      expect(Math.abs(theoretical - empirical)).toBeLessThan(0.05);
    }
  });

  it('computeAUC approximates empiricalAUC', () => {
    const { negScores, posScores } = genScores(500, 42, 0.5);
    const roc = computeROC(negScores, posScores, 200);
    expect(Math.abs(computeAUC(roc) - empiricalAUC(negScores, posScores))).toBeLessThan(0.05);
  });

  it('theoretical AUC endpoints are sensible', () => {
    expect(theoreticalAUC(0)).toBeGreaterThan(0.95);
    expect(theoreticalAUC(1)).toBeLessThan(0.6);
    expect(theoreticalAUC(1)).toBeGreaterThan(0.45);
  });
});
