import { describe, expect, it } from 'vitest';
import {
  iteratedTentMap,
  linearRegionCount,
  shallowReluUnitsForExactRepresentation,
  tentMap,
} from '../lib/math/depthComposition';

describe('tent-map composition', () => {
  it('evaluates the base map and its composition', () => {
    expect(tentMap(0.25)).toBeCloseTo(0.5, 12);
    expect(iteratedTentMap(0.25, 2)).toBeCloseTo(1, 12);
  });

  it('doubles linear regions at every depth', () => {
    expect(linearRegionCount(6)).toBe(64);
    expect(shallowReluUnitsForExactRepresentation(6)).toBe(63);
  });
});
