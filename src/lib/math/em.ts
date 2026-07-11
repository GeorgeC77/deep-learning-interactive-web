/* -------------------------------------------------------------------------- */
/* EM algorithm math — split API                                              */
/* -------------------------------------------------------------------------- */

export type GMMParams = {
  means: number[][];   // K x 2
  covs: number[][][];  // K x 2 x 2
  pis: number[];       // K
};

export function gaussianPdf(x: number[], mean: number[], cov: number[][]): number {
  const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
  const inv = [[cov[1][1] / det, -cov[0][1] / det], [-cov[1][0] / det, cov[0][0] / det]];
  const dx = [x[0] - mean[0], x[1] - mean[1]];
  const quad = inv[0][0] * dx[0] * dx[0] + 2 * inv[0][1] * dx[0] * dx[1] + inv[1][1] * dx[1] * dx[1];
  return Math.exp(-0.5 * quad) / (2 * Math.PI * Math.sqrt(Math.max(det, 1e-10)));
}

/** E-step: compute responsibilities γ_nk = p(z_n=k | x_n, θ) */
export function eStep(data: number[][], params: GMMParams): number[][] {
  const K = params.means.length, N = data.length;
  const resp: number[][] = Array.from({ length: N }, () => Array(K).fill(0));
  for (let i = 0; i < N; i++) {
    let total = 0;
    for (let k = 0; k < K; k++) {
      resp[i][k] = params.pis[k] * gaussianPdf(data[i], params.means[k], params.covs[k]);
      total += resp[i][k];
    }
    if (total > 1e-12) for (let k = 0; k < K; k++) resp[i][k] /= total;
  }
  return resp;
}

/** M-step: update μ, Σ, π from responsibilities */
export function mStep(data: number[][], responsibilities: number[][], epsilon: number = 1e-6): GMMParams {
  const K = responsibilities[0].length, N = data.length;

  const Nk = responsibilities.reduce((s, r) => { for (let k = 0; k < K; k++) s[k] += r[k]; return s; }, Array(K).fill(0));

  const newMeans = Array.from({ length: K }, (_, k) => {
    if (Nk[k] < 1e-12) return [0, 0];
    const mu = [0, 0];
    for (let i = 0; i < N; i++) { mu[0] += responsibilities[i][k] * data[i][0]; mu[1] += responsibilities[i][k] * data[i][1]; }
    return [mu[0] / Nk[k], mu[1] / Nk[k]];
  });

  const newCovs = Array.from({ length: K }, (_, k) => {
    if (Nk[k] < 1e-12) return [[1, 0], [0, 1]] as number[][];
    const mu = newMeans[k];
    let s00 = 0, s01 = 0, s11 = 0;
    for (let i = 0; i < N; i++) {
      const dx = data[i][0] - mu[0], dy = data[i][1] - mu[1];
      s00 += responsibilities[i][k] * dx * dx;
      s01 += responsibilities[i][k] * dx * dy;
      s11 += responsibilities[i][k] * dy * dy;
    }
    return [[s00 / Nk[k] + epsilon, s01 / Nk[k]], [s01 / Nk[k], s11 / Nk[k] + epsilon]];
  });

  const newPis = Nk.map((n) => Math.max(n / N, 1e-12));
  return { means: newMeans, covs: newCovs, pis: newPis };
}

/** Compute log-likelihood log p(X|θ) */
export function logLikelihood(data: number[][], params: GMMParams): number {
  let ll = 0;
  for (const x of data) {
    let total = 0;
    for (let k = 0; k < params.means.length; k++)
      total += params.pis[k] * gaussianPdf(x, params.means[k], params.covs[k]);
    ll += Math.log(Math.max(total, 1e-12));
  }
  return ll;
}

/** ELBO = E_q[log p(x,z|θ)] + H(q) */
export function elbo(data: number[][], params: GMMParams, q: number[][]): number {
  const N = data.length, K = params.means.length;
  let elbo = 0;
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < K; k++) {
      if (q[i][k] < 1e-12) continue;
      const logJoint = Math.log(Math.max(params.pis[k] * gaussianPdf(data[i], params.means[k], params.covs[k]), 1e-12));
      elbo += q[i][k] * (logJoint - Math.log(Math.max(q[i][k], 1e-12)));
    }
  }
  return elbo;
}

/** KL(q || posterior): KL divergence from q to p(z|x,θ) */
export function klResponsibilities(q: number[][], posterior: number[][]): number {
  let kl = 0;
  for (let i = 0; i < q.length; i++) {
    for (let k = 0; k < q[i].length; k++) {
      if (q[i][k] < 1e-12) continue;
      kl += q[i][k] * Math.log(q[i][k] / Math.max(posterior[i][k], 1e-12));
    }
  }
  return kl;
}

/** Full EM iteration (E + M) — convenience composition */
export function emIteration(data: number[][], params: GMMParams, epsilon: number = 1e-6) {
  const responsibilities = eStep(data, params);
  const newParams = mStep(data, responsibilities, epsilon);
  const ll = logLikelihood(data, newParams);
  return { responsibilities, newParams, logLikelihood: ll };
}

/** Eigen decomposition for 2x2 covariance — returns {vals, vecs} for ellipse */
export function eigen2x2(cov: number[][]): { vals: [number, number]; vecs: [number, number][] } {
  const a = cov[0][0], b = cov[0][1], c = cov[1][1];
  const trace = a + c, det = a * c - b * b;
  const disc = Math.sqrt(Math.max(trace * trace - 4 * det, 0));
  const v1 = (trace + disc) / 2, v2 = (trace - disc) / 2;
  // Eigenvectors
  let vec1: [number, number] = [1, 0], vec2: [number, number] = [0, 1];
  if (Math.abs(b) > 1e-10) {
    vec1 = [b, v1 - a];
    vec2 = [b, v2 - a];
  }
  // Normalize
  [vec1, vec2].forEach((v) => {
    const norm = Math.hypot(v[0], v[1]);
    if (norm > 1e-10) { v[0] /= norm; v[1] /= norm; }
  });
  return { vals: [Math.sqrt(Math.max(v2, 1e-10)), Math.sqrt(Math.max(v1, 1e-10))], vecs: [vec1, vec2] };
}
