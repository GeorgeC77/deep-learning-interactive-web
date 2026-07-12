import { describe, it, expect } from 'vitest';
import {
  bimodalTarget,
  metropolisHastings,
  computeESS,
  modeOccupancy,
  repeatedStatePct,
} from '../lib/math/mcmc';

describe('mcmc', () => {
  it('small proposal ESS is lower than balanced proposal ESS', () => {
    const small = metropolisHastings(bimodalTarget, 0.15, 2000, 42);
    const balanced = metropolisHastings(bimodalTarget, 1.0, 2000, 42);
    expect(computeESS(small.samples)).toBeLessThan(computeESS(balanced.samples));
  });

  it('acceptance rate decreases when proposal std increases', () => {
    const narrow = metropolisHastings(bimodalTarget, 0.2, 1000, 1);
    const wide = metropolisHastings(bimodalTarget, 2.5, 1000, 1);
    const rateNarrow = narrow.accepted / 1000;
    const rateWide = wide.accepted / 1000;
    expect(rateWide).toBeLessThan(rateNarrow);
  });

  it('mode occupancy sums to approximately 1 for a long chain', () => {
    const chain = metropolisHastings(bimodalTarget, 1.0, 5000, 7);
    const occupancy = modeOccupancy(chain.samples);
    const sum = occupancy.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 1);
  });

  it('repeated-state percentage is between 0 and 1', () => {
    const chain = metropolisHastings(bimodalTarget, 0.5, 1000, 99);
    const pct = repeatedStatePct(chain.samples);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(1);
  });
});
