const MIN_SD = 1e-9;

export type BinaryGaussianModel = {
  mean0: number;
  mean1: number;
  sd0: number;
  sd1: number;
  prior1: number;
};

export type BinaryGaussianPosterior = {
  likelihood0: number;
  likelihood1: number;
  evidence: number;
  posterior0: number;
  posterior1: number;
};

function clampPrior(prior: number): number {
  return Math.min(1 - 1e-12, Math.max(1e-12, prior));
}

export function gaussianPdf(x: number, mean: number, sd: number): number {
  const safeSd = Math.max(Math.abs(sd), MIN_SD);
  const z = (x - mean) / safeSd;
  return Math.exp(-0.5 * z * z) / (safeSd * Math.sqrt(2 * Math.PI));
}

export function binaryGaussianPosterior(
  x: number,
  model: BinaryGaussianModel,
): BinaryGaussianPosterior {
  const prior1 = clampPrior(model.prior1);
  const prior0 = 1 - prior1;
  const likelihood0 = gaussianPdf(x, model.mean0, model.sd0);
  const likelihood1 = gaussianPdf(x, model.mean1, model.sd1);
  const joint0 = likelihood0 * prior0;
  const joint1 = likelihood1 * prior1;
  const evidence = joint0 + joint1;

  return {
    likelihood0,
    likelihood1,
    evidence,
    posterior0: joint0 / evidence,
    posterior1: joint1 / evidence,
  };
}

/**
 * The unique decision threshold for two one-dimensional Gaussian classes with
 * a shared standard deviation. Class 1 is preferred on the side of mean1.
 */
export function sharedVarianceBoundary(
  mean0: number,
  mean1: number,
  sd: number,
  prior1: number,
): number {
  if (mean0 === mean1) return Number.NaN;
  const safeSd = Math.max(Math.abs(sd), MIN_SD);
  const p1 = clampPrior(prior1);
  const p0 = 1 - p1;
  return (
    (mean0 + mean1) / 2 +
    (safeSd * safeSd * Math.log(p0 / p1)) / (mean1 - mean0)
  );
}
