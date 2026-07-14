import { describe, it, expect } from 'vitest';
import {
  assignStep,
  updateStep,
  lloydStep,
  computeDistortion,
  kMeansLloyd,
  squaredDistance,
  hasConverged,
} from '../lib/math/kmeans';

describe('kmeans', () => {
  it('assignStep gives every point the closest centroid', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ];
    const cents = [{ x: 1, y: 0 }, { x: 9, y: 0 }];
    const assigned = assignStep(points, cents);
    expect(assigned[0].cluster).toBe(0);
    expect(assigned[1].cluster).toBe(1);
  });

  it('updateStep moves centroids to the mean of their cluster', () => {
    const points = [
      { x: 0, y: 0, cluster: 0 },
      { x: 2, y: 0, cluster: 0 },
      { x: 10, y: 0, cluster: 1 },
    ];
    const cents = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    const updated = updateStep(points, cents);
    expect(updated[0].x).toBeCloseTo(1, 10);
    expect(updated[1].x).toBeCloseTo(10, 10);
  });

  it('one assign-then-update step does not increase distortion', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
    ];
    const cents = [{ x: 0, y: 0 }, { x: 11, y: 0 }];
    const before = computeDistortion(assignStep(points, cents), cents);
    const { distortion: after } = lloydStep(points, cents);
    expect(after).toBeLessThanOrEqual(before + 1e-9);
  });

  it('hasConverged detects stable assignments and centroids', () => {
    expect(
      hasConverged([0, 1], [0, 1], [{ x: 0, y: 0 }], [{ x: 0, y: 0 }]),
    ).toBe(true);
    expect(
      hasConverged([0, 1], [0, 0], [{ x: 0, y: 0 }], [{ x: 0, y: 0 }]),
    ).toBe(false);
    expect(
      hasConverged([0, 1], [0, 1], [{ x: 0, y: 0 }], [{ x: 1, y: 0 }]),
    ).toBe(false);
  });

  it('kMeansLloyd converges on a simple two-cluster dataset', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 0.2, y: 0 },
      { x: 10, y: 0 },
      { x: 10.2, y: 0 },
    ];
    const result = kMeansLloyd(points, 2, 123, 100, 1e-9);
    expect(result.converged).toBe(true);
    expect(result.iterations).toBeLessThan(20);
    // Final distortion should be small
    expect(result.distortion).toBeLessThan(0.1);
  });

  it('squaredDistance is symmetric and non-negative', () => {
    expect(squaredDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(25);
    expect(squaredDistance({ x: 3, y: 4 }, { x: 0, y: 0 })).toBe(25);
  });
});
