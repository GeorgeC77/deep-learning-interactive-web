export type Gaussian1DComponent = {
  weight: number;
  mean: number;
  sigma: number;
};

function validateComponents(components: Gaussian1DComponent[]): void {
  if (components.length === 0) throw new Error('A Gaussian mixture needs at least one component.');
  if (components.some((component) => component.weight < 0 || component.sigma <= 0)) {
    throw new Error('Mixture weights must be non-negative and standard deviations must be positive.');
  }
  if (components.every((component) => component.weight === 0)) {
    throw new Error('At least one mixture weight must be positive.');
  }
}

export function gaussianPdf1D(x: number, mean: number, sigma: number): number {
  if (sigma <= 0) throw new Error('Standard deviation must be positive.');
  const standardized = (x - mean) / sigma;
  return Math.exp(-0.5 * standardized * standardized) / (sigma * Math.sqrt(2 * Math.PI));
}

export function normalizedComponents(
  components: Gaussian1DComponent[],
): Gaussian1DComponent[] {
  validateComponents(components);
  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  return components.map((component) => ({
    ...component,
    weight: component.weight / totalWeight,
  }));
}

export function componentContributions(
  x: number,
  components: Gaussian1DComponent[],
): number[] {
  return normalizedComponents(components).map(
    (component) => component.weight * gaussianPdf1D(x, component.mean, component.sigma),
  );
}

export function mixtureDensity1D(
  x: number,
  components: Gaussian1DComponent[],
): number {
  return componentContributions(x, components).reduce((sum, value) => sum + value, 0);
}

export function responsibilities1D(
  x: number,
  components: Gaussian1DComponent[],
): number[] {
  const contributions = componentContributions(x, components);
  const density = contributions.reduce((sum, value) => sum + value, 0);
  if (density <= 0 || !Number.isFinite(density)) {
    throw new Error('The mixture density is numerically zero at the requested point.');
  }
  return contributions.map((value) => value / density);
}

export function mixtureMoments1D(
  components: Gaussian1DComponent[],
): { mean: number; variance: number } {
  const normalized = normalizedComponents(components);
  const mean = normalized.reduce(
    (sum, component) => sum + component.weight * component.mean,
    0,
  );
  const secondMoment = normalized.reduce(
    (sum, component) =>
      sum + component.weight * (component.sigma ** 2 + component.mean ** 2),
    0,
  );
  return { mean, variance: Math.max(0, secondMoment - mean ** 2) };
}
