export function positiveTestPosterior(
  prevalence: number,
  sensitivity: number,
  falsePositiveRate: number,
): number {
  const evidence = sensitivity * prevalence + falsePositiveRate * (1 - prevalence);
  if (evidence <= 0) return 0;
  return (sensitivity * prevalence) / evidence;
}

export function gaussianKdeAt(samples: number[], x: number, bandwidth: number): number {
  if (samples.length === 0) return 0;
  if (!(bandwidth > 0)) throw new Error('bandwidth must be positive');
  const normalizer = samples.length * bandwidth * Math.sqrt(2 * Math.PI);
  return samples.reduce((sum, sample) => {
    const z = (x - sample) / bandwidth;
    return sum + Math.exp(-0.5 * z * z);
  }, 0) / normalizer;
}

export function trapezoidIntegral(values: number[], step: number): number {
  if (values.length < 2) return 0;
  return values.slice(1).reduce(
    (sum, value, index) => sum + 0.5 * (values[index] + value) * step,
    0,
  );
}
