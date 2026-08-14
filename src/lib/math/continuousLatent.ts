export type Matrix2 = [[number, number], [number, number]];

export function pcaVarianceSummary(eigenvalues: number[], retained: number) {
  const safe = eigenvalues.map((value) => Math.max(0, value));
  const k = Math.max(0, Math.min(Math.floor(retained), safe.length));
  const total = safe.reduce((sum, value) => sum + value, 0);
  const kept = safe.slice(0, k).reduce((sum, value) => sum + value, 0);
  const discarded = total - kept;
  return {
    total,
    kept,
    discarded,
    retainedRatio: total > 0 ? kept / total : 1,
  };
}

export function factorAnalysisCovariance(
  loadings: [number, number],
  noiseVariances: [number, number],
): Matrix2 {
  const [w1, w2] = loadings;
  const [psi1, psi2] = noiseVariances.map((value) => Math.max(0, value)) as [number, number];
  return [
    [w1 * w1 + psi1, w1 * w2],
    [w1 * w2, w2 * w2 + psi2],
  ];
}

export function covarianceCorrelation(covariance: Matrix2): number {
  const denominator = Math.sqrt(Math.max(0, covariance[0][0] * covariance[1][1]));
  return denominator > 0 ? covariance[0][1] / denominator : 0;
}

export function scalarGaussianPosterior(loading: number, noiseVariance: number) {
  const sigma2 = Math.max(noiseVariance, Number.EPSILON);
  const precision = 1 + (loading * loading) / sigma2;
  const variance = 1 / precision;
  const meanCoefficient = (loading / sigma2) * variance;
  return { variance, meanCoefficient };
}

export type GenerativeApproachId = 'gan' | 'vae' | 'flow' | 'diffusion';

export type GenerativeApproach = {
  id: GenerativeApproachId;
  name: string;
  likelihood: 'none' | 'lower-bound' | 'exact' | 'indirect';
  fastSampling: boolean;
  compactLatent: boolean;
  trainingSignal: string;
};

export const generativeApproaches: GenerativeApproach[] = [
  { id: 'gan', name: 'GAN', likelihood: 'none', fastSampling: true, compactLatent: true, trainingSignal: '判别器提供对抗信号' },
  { id: 'vae', name: 'VAE', likelihood: 'lower-bound', fastSampling: true, compactLatent: true, trainingSignal: '优化 ELBO' },
  { id: 'flow', name: 'Normalizing Flow', likelihood: 'exact', fastSampling: true, compactLatent: false, trainingSignal: '精确最大似然' },
  { id: 'diffusion', name: 'Diffusion', likelihood: 'indirect', fastSampling: false, compactLatent: false, trainingSignal: '多噪声尺度去噪' },
];

export type GenerativeCriteria = {
  exactLikelihood: boolean;
  fastSampling: boolean;
  compactLatent: boolean;
};

export function rankGenerativeApproaches(criteria: GenerativeCriteria) {
  return generativeApproaches
    .map((approach) => {
      let score = 0;
      if (criteria.exactLikelihood && approach.likelihood === 'exact') score += 4;
      if (criteria.fastSampling && approach.fastSampling) score += 2;
      if (criteria.compactLatent && approach.compactLatent) score += 1;
      return { ...approach, score };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
