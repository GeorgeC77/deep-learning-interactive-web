/* -------------------------------------------------------------------------- */
/* EM algorithm math                                                           */
/* -------------------------------------------------------------------------- */

export function gaussianPdf(x: number[], mean: number[], cov: number[][]): number {
  const d = x.length;
  // Determinant and inverse for 2x2
  const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
  const inv = [
    [cov[1][1] / det, -cov[0][1] / det],
    [-cov[1][0] / det, cov[0][0] / det],
  ];
  const dx = [x[0] - mean[0], x[1] - mean[1]];
  let quad = 0;
  for (let i = 0; i < d; i++)
    for (let j = 0; j < d; j++)
      quad += dx[i] * inv[i][j] * dx[j];
  return Math.exp(-0.5 * quad) / (2 * Math.PI * Math.sqrt(Math.max(det, 1e-10)));
}

export type GMMParams = {
  means: number[][];   // K x 2
  covs: number[][][];  // K x 2 x 2
  pis: number[];       // K
};

export type EMResult = {
  responsibilities: number[][];  // N x K
  newMeans: number[][];
  newCovs: number[][][];
  newPis: number[];
  logLikelihood: number;
};

/**
 * Single EM iteration with full covariance estimation.
 * Does NOT change the input data.
 */
export function emIteration(
  data: number[][],           // N x 2
  params: GMMParams,
  epsilon: number = 1e-6,
): EMResult {
  const K = params.means.length;
  const N = data.length;

  // E-step
  const resp: number[][] = Array.from({ length: N }, () => Array(K).fill(0));
  let logLik = 0;
  for (let i = 0; i < N; i++) {
    let total = 0;
    for (let k = 0; k < K; k++) {
      resp[i][k] = params.pis[k] * gaussianPdf(data[i], params.means[k], params.covs[k]);
      total += resp[i][k];
    }
    logLik += Math.log(Math.max(total, 1e-12));
    if (total > 1e-12)
      for (let k = 0; k < K; k++) resp[i][k] /= total;
  }

  // M-step
  const Nk = resp.reduce((s, r) => { for (let k = 0; k < K; k++) s[k] += r[k]; return s; }, Array(K).fill(0));
  const newMeans = Array.from({ length: K }, (_, k) => {
    if (Nk[k] < 1e-12) return [...params.means[k]];
    const mu = [0, 0] as [number, number];
    for (let i = 0; i < N; i++) { mu[0] += resp[i][k] * data[i][0]; mu[1] += resp[i][k] * data[i][1]; }
    mu[0] /= Nk[k]; mu[1] /= Nk[k];
    return mu;
  });

  // Full covariance
  const newCovs = Array.from({ length: K }, (_, k) => {
    if (Nk[k] < 1e-12) return [[1, 0], [0, 1]] as number[][];
    const mu = newMeans[k];
    let s00 = 0, s01 = 0, s11 = 0;
    for (let i = 0; i < N; i++) {
      const dx = data[i][0] - mu[0], dy = data[i][1] - mu[1];
      s00 += resp[i][k] * dx * dx;
      s01 += resp[i][k] * dx * dy;
      s11 += resp[i][k] * dy * dy;
    }
    s00 = s00 / Nk[k] + epsilon;
    s01 /= Nk[k];
    s11 = s11 / Nk[k] + epsilon;
    return [[s00, s01], [s01, s11]];
  });

  const newPis = Nk.map((n) => Math.max(n / N, 1e-12));

  return { responsibilities: resp, newMeans, newCovs, newPis, logLikelihood: logLik };
}
