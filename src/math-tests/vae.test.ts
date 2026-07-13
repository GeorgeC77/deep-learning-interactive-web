import { describe, it, expect } from 'vitest';
import {
  klDivergenceDiagonalGaussian,
  betaObjective,
  sampleLatent,
  latentStatistics,
} from '../lib/math/vae';

const EPS = 1e-10;

describe('vae', () => {
  it('KL equals 0 when mu=0 and sigma=1', () => {
    expect(klDivergenceDiagonalGaussian([0, 0], [1, 1])).toBeCloseTo(0, 10);
  });

  it('KL increases with |mu|', () => {
    const kl0 = klDivergenceDiagonalGaussian([0, 0], [1, 1]);
    const kl1 = klDivergenceDiagonalGaussian([1, 0], [1, 1]);
    const kl2 = klDivergenceDiagonalGaussian([2, 0], [1, 1]);
    expect(kl1).toBeGreaterThan(kl0 + EPS);
    expect(kl2).toBeGreaterThan(kl1 + EPS);
  });

  it('KL increases as sigma deviates from 1', () => {
    const base = klDivergenceDiagonalGaussian([0, 0], [1, 1]);
    const narrow = klDivergenceDiagonalGaussian([0, 0], [0.5, 0.5]);
    const wide = klDivergenceDiagonalGaussian([0, 0], [2, 2]);
    expect(narrow).toBeGreaterThan(base + EPS);
    expect(wide).toBeGreaterThan(base + EPS);
  });

  it('beta-objective with beta=1 equals ELBO', () => {
    const kl = klDivergenceDiagonalGaussian([0.5, -0.3], [0.8, 1.2]);
    const recon = -10;
    const elbo = betaObjective(recon, kl, 1);
    expect(elbo).toBeCloseTo(recon - kl, 10);
  });

  it('beta-objective with beta<1 exceeds the standard ELBO and can break the lower bound', () => {
    const recon = -10;
    const kl = 8;
    const standardElbo = betaObjective(recon, kl, 1);
    const objective = betaObjective(recon, kl, 0.5);
    // With 0 < β < 1 the KL penalty is under-weighted, so the objective is
    // larger than the standard ELBO (recon - kl). If the ELBO is tight, this
    // can overshoot the marginal log-likelihood and cease to be a lower bound.
    expect(objective).toBeGreaterThan(standardElbo);
  });

  it('reparameterization samples have mean ~ mu and std ~ sigma', () => {
    const mu = [1.5, -0.8];
    const sigma = [0.6, 1.4];
    const points = sampleLatent(mu, sigma, 42, 5000);
    const stats = latentStatistics(points);

    for (let i = 0; i < 2; i++) {
      expect(stats.mean[i]).toBeCloseTo(mu[i], 1);
      expect(Math.sqrt(stats.cov[i][i])).toBeCloseTo(sigma[i], 1);
    }
  });

  it('KL with a wider prior variance can decrease when q matches the new scale', () => {
    const mu = [2, 1];
    const sigma = [2, 2];
    const kl1 = klDivergenceDiagonalGaussian(mu, sigma, 1);
    const kl4 = klDivergenceDiagonalGaussian(mu, sigma, 4);
    expect(Number.isFinite(kl1)).toBe(true);
    expect(Number.isFinite(kl4)).toBe(true);
    // Here q is already matched to the wider prior (σ=2 = √4), so the
    // reduction in mean penalty dominates and KL decreases.
    expect(kl4).toBeLessThan(kl1);
  });
});
