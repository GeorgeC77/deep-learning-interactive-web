import { describe, expect, it } from 'vitest';
import { bestValidationEpoch, doubleDescentSchematic, earlyStoppingEpoch, syntheticLearningCurves } from '@/lib/math/learningCurves';

describe('learning curves and early stopping', () => {
  it('finds the minimum validation checkpoint before the final epoch', () => {
    const curve = syntheticLearningCurves(100, 0.0002);
    const best = bestValidationEpoch(curve);
    expect(best.epoch).toBeGreaterThan(20);
    expect(best.epoch).toBeLessThan(100);
    expect(best.validation).toBeLessThan(curve.at(-1)!.validation);
  });

  it('returns the best checkpoint rather than the detection epoch', () => {
    const curve = syntheticLearningCurves(100, 0.0002);
    expect(earlyStoppingEpoch(curve, 5)).toBe(bestValidationEpoch(curve).epoch);
  });

  it('has an interpolation peak followed by a second descent', () => {
    const threshold = 40;
    const peak = doubleDescentSchematic(threshold, threshold);
    expect(peak).toBeGreaterThan(doubleDescentSchematic(20, threshold));
    expect(peak).toBeGreaterThan(doubleDescentSchematic(100, threshold));
  });
});
