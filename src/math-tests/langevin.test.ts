import { describe, it, expect } from 'vitest';
import {
  gaussianScore,
  mixtureScore,
  langevinChain,
  chainStats,
} from '../lib/math/langevin';

describe('langevin', () => {
  it('Gaussian score equals -(x - mean) / sigma^2', () => {
    expect(gaussianScore(2, 0, 1)).toBeCloseTo(-2, 10);
    expect(gaussianScore(1, 3, 2)).toBeCloseTo(-(1 - 3) / 4, 10);
  });

  it('small step size chain approximates target mean for a Gaussian', () => {
    const traj = langevinChain(5, (x) => gaussianScore(x, 0, 1), 0.01, 5000, 42);
    const { mean, variance } = chainStats(traj.slice(1000));
    expect(Math.abs(mean)).toBeLessThan(0.5);
    expect(variance).toBeGreaterThan(0.3);
    expect(variance).toBeLessThan(2.0);
  });

  it('large step size causes instability / exploding variance', () => {
    const traj = langevinChain(0, (x) => gaussianScore(x, 0, 1), 2.0, 100, 7);
    const { variance } = chainStats(traj);
    expect(variance).toBeGreaterThan(10);
  });

  it('mixture score is zero where density is zero', () => {
    const score = mixtureScore(100, [
      { weight: 0.5, mean: 0, sigma: 1 },
      { weight: 0.5, mean: 10, sigma: 1 },
    ]);
    expect(score).toBeCloseTo(0, 5);
  });

  it('mixture score near a mode points toward that mode', () => {
    const score = mixtureScore(12, [
      { weight: 0.5, mean: 0, sigma: 1 },
      { weight: 0.5, mean: 10, sigma: 1 },
    ]);
    expect(score).toBeLessThan(0); // pushes left toward the mixture center
  });
});
