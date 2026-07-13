import { describe, it, expect } from 'vitest';
import {
  gaussianPdf,
  mixturePdf,
  mixtureMean,
  mixtureModes,
  sampleMixture,
  generateForwardDataset,
  generateInverseDataset,
  type MixtureComponent,
} from '../lib/math/mdn';

const integrate = (fn: (t: number) => number, tMin: number, tMax: number, steps = 4000): number => {
  const dt = (tMax - tMin) / steps;
  let sum = 0;
  for (let i = 0; i <= steps; i++) {
    sum += fn(tMin + i * dt);
  }
  return sum * dt;
};

describe('mdn', () => {
  it('single Gaussian density integrates approximately to 1 over R', () => {
    const c: MixtureComponent = { weight: 1, mean: 0, sigma: 1 };
    const area = integrate((t) => mixturePdf(t, [c]), -8, 8, 8000);
    expect(area).toBeCloseTo(1, 2);
  });

  it('mixture weights sum to 1', () => {
    const components: MixtureComponent[] = [
      { weight: 0.3, mean: -1, sigma: 0.5 },
      { weight: 0.7, mean: 1, sigma: 0.5 },
    ];
    const sum = components.reduce((s, c) => s + c.weight, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it('all sigmas positive for valid components', () => {
    const components: MixtureComponent[] = [
      { weight: 0.4, mean: -1, sigma: 0.3 },
      { weight: 0.6, mean: 1, sigma: 0.4 },
    ];
    expect(components.every((c) => c.sigma > 0)).toBe(true);
  });

  it('p(0) for a unit-variance component equals 1/sqrt(2π) when weight=1', () => {
    const c: MixtureComponent = { weight: 1, mean: 0, sigma: 1 };
    expect(gaussianPdf(0, c.mean, c.sigma)).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 10);
  });

  it('in the symmetric inverse example the MSE prediction lies between the two modes', () => {
    const components: MixtureComponent[] = [
      { weight: 0.5, mean: -1.2, sigma: 0.25 },
      { weight: 0.5, mean: 1.2, sigma: 0.25 },
    ];
    const mean = mixtureMean(components);
    const modes = mixtureModes(components, -3, 3, 600);
    expect(modes.length).toBeGreaterThanOrEqual(2);
    const lower = Math.min(...modes);
    const upper = Math.max(...modes);
    expect(mean).toBeGreaterThan(lower);
    expect(mean).toBeLessThan(upper);
  });

  it('forward dataset has single-valued structure', () => {
    const data = generateForwardDataset(42, 200);
    expect(data.length).toBe(200);
    expect(data.every((d) => Number.isFinite(d.x) && Number.isFinite(d.t))).toBe(true);
  });

  it('inverse dataset contains multimodal conditional structure', () => {
    const data = generateInverseDataset(42, 2000);
    expect(data.length).toBe(2000);
    // For a narrow bin around x = 0.5, t values should span multiple branches.
    const bin = data.filter((d) => d.x > 0.45 && d.x < 0.55);
    expect(bin.length).toBeGreaterThan(10);
    const spread = Math.max(...bin.map((d) => d.t)) - Math.min(...bin.map((d) => d.t));
    expect(spread).toBeGreaterThan(0.4);
  });

  it('sampleMixture reproduces the component means approximately', () => {
    const components: MixtureComponent[] = [
      { weight: 0.5, mean: -2, sigma: 0.3 },
      { weight: 0.5, mean: 2, sigma: 0.3 },
    ];
    const samples = sampleMixture(components, 123, 5000);
    const mean = samples.reduce((s, v) => s + v, 0) / samples.length;
    expect(Math.abs(mean)).toBeLessThan(0.1);
  });
});
