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

/** Log of the 2D Gaussian PDF. */
export function logGaussian(x: number[], mean: number[], cov: number[][]): number {
  const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
  const inv = [[cov[1][1] / det, -cov[0][1] / det], [-cov[1][0] / det, cov[0][0] / det]];
  const dx = [x[0] - mean[0], x[1] - mean[1]];
  const quad = inv[0][0] * dx[0] * dx[0] + 2 * inv[0][1] * dx[0] * dx[1] + inv[1][1] * dx[1] * dx[1];
  return -Math.log(2 * Math.PI) - 0.5 * Math.log(Math.max(det, 1e-10)) - 0.5 * quad;
}

/** Stable log-sum-exp. */
export function logSumExp(logArr: number[]): number {
  const maxLog = Math.max(...logArr);
  const sumExp = logArr.reduce((s, v) => s + Math.exp(v - maxLog), 0);
  return maxLog + Math.log(sumExp);
}

/** E-step: compute responsibilities γ_nk = p(z_n=k | x_n, θ) */
export function eStep(data: number[][], params: GMMParams): number[][] {
  const K = params.means.length, N = data.length;
  const resp: number[][] = Array.from({ length: N }, () => Array(K).fill(0));
  for (let i = 0; i < N; i++) {
    const logPis = params.pis.map((p) => Math.log(Math.max(p, 1e-12)));
    const logComp = Array.from({ length: K }, (_, k) => logPis[k] + logGaussian(data[i], params.means[k], params.covs[k]));
    const logTotal = logSumExp(logComp);
    for (let k = 0; k < K; k++) {
      resp[i][k] = Math.exp(logComp[k] - logTotal);
    }
  }
  return resp;
}

/** Ensure a 2x2 covariance matrix is positive definite with eigenvalues >= floor. */
function regularizeCov(cov: number[][], floor: number): number[][] {
  const a = cov[0][0], b = cov[0][1], c = cov[1][1];
  const trace = a + c;
  const det = a * c - b * b;
  const disc = Math.sqrt(Math.max(trace * trace - 4 * det, 0));
  const lambdaMin = (trace - disc) / 2;
  if (lambdaMin >= floor) return cov;
  const delta = floor - lambdaMin + 1e-8;
  return [[a + delta, b], [b, c + delta]];
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
    const raw = [[s00 / Nk[k] + epsilon, s01 / Nk[k]], [s01 / Nk[k], s11 / Nk[k] + epsilon]] as number[][];
    return regularizeCov(raw, epsilon);
  });

  const floor = 1e-12;
  const rawPis = Nk.map((n) => Math.max(n / N, floor));
  const sumRaw = rawPis.reduce((a, b) => a + b, 0);
  const newPis = rawPis.map((p) => p / sumRaw);
  return { means: newMeans, covs: newCovs, pis: newPis };
}

/** Compute log-likelihood log p(X|θ) */
export function logLikelihood(data: number[][], params: GMMParams): number {
  let ll = 0;
  const logPis = params.pis.map((p) => Math.log(Math.max(p, 1e-12)));
  for (const x of data) {
    const logComp = params.means.map((mean, k) => logPis[k] + logGaussian(x, mean, params.covs[k]));
    ll += logSumExp(logComp);
  }
  return ll;
}

/** ELBO = E_q[log p(x,z|θ)] + H(q) */
export function elbo(data: number[][], params: GMMParams, q: number[][]): number {
  const N = data.length, K = params.means.length;
  const logPis = params.pis.map((p) => Math.log(Math.max(p, 1e-12)));
  let elbo = 0;
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < K; k++) {
      if (q[i][k] < 1e-12) continue;
      const logJoint = logPis[k] + logGaussian(data[i], params.means[k], params.covs[k]);
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
  return { responsibilities, newMeans: newParams.means, newCovs: newParams.covs, newPis: newParams.pis, newParams, logLikelihood: ll };
}

/** Hungarian algorithm for a square cost matrix.
 *  Returns an array `assignment` where `assignment[i] = j` means row i is matched to column j.
 */
export function solveAssignment(cost: number[][]): number[] {
  const n = cost.length;
  if (n === 0) return [];
  // The matching code below assumes a square matrix; callers build KxK costs.
  const u = Array(n + 1).fill(0);
  const v = Array(n + 1).fill(0);
  const p = Array(n + 1).fill(0);
  const way = Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = Array(n + 1).fill(Infinity);
    const used = Array(n + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= n; j++) {
        if (used[j]) continue;
        const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
        if (cur < minv[j]) {
          minv[j] = cur;
          way[j] = j0;
        }
        if (minv[j] < delta) {
          delta = minv[j];
          j1 = j;
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);

    // Augmenting: update the matching along the alternating path.
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0);
  }

  const assignment = Array(n).fill(-1);
  for (let j = 1; j <= n; j++) {
    if (p[j] !== 0) assignment[p[j] - 1] = j - 1;
  }
  return assignment;
}

/** Label-invariant mean error using a min-cost (Hungarian) assignment over mean distances. */
export function labelInvariantMeanError(trueMeans: number[][], estMeans: number[][]) {
  const cost = trueMeans.map((tm) => estMeans.map((em) => Math.hypot(tm[0] - em[0], tm[1] - em[1])));
  const assignment = solveAssignment(cost);
  const perComponent = assignment.map((estIdx, trueIdx) => cost[trueIdx][estIdx]);
  const total = perComponent.reduce((a, b) => a + b, 0);
  return { assignment, perComponent, total };
}

/** Eigen decomposition for 2x2 covariance — returns {vals, vecs} for ellipse.
 *  vals[0] = sqrt(λ_min), vals[1] = sqrt(λ_max).
 *  vecs[0] is the eigenvector for λ_min, vecs[1] for λ_max.
 */
export function eigen2x2(cov: number[][]): { vals: [number, number]; vecs: [number, number][] } {
  const a = cov[0][0], b = cov[0][1], c = cov[1][1];
  const trace = a + c, det = a * c - b * b;
  const disc = Math.sqrt(Math.max(trace * trace - 4 * det, 0));
  const lambdaSmall = (trace - disc) / 2;
  const lambdaLarge = (trace + disc) / 2;

  let vecSmall: [number, number] = [0, 1];
  let vecLarge: [number, number] = [1, 0];

  if (Math.abs(b) > 1e-10) {
    // (A - λI) v = 0  ⇒  (a - λ) v_x + b v_y = 0
    const vLx = b;
    const vLy = lambdaLarge - a;
    const nL = Math.hypot(vLx, vLy);
    vecLarge = nL > 1e-10 ? [vLx / nL, vLy / nL] : [1, 0];

    const vSx = b;
    const vSy = lambdaSmall - a;
    const nS = Math.hypot(vSx, vSy);
    vecSmall = nS > 1e-10 ? [vSx / nS, vSy / nS] : [0, 1];
  } else {
    // Diagonal matrix: pick axes in the order of the eigenvalues.
    if (a < c) {
      vecSmall = [1, 0];
      vecLarge = [0, 1];
    } else {
      vecSmall = [0, 1];
      vecLarge = [1, 0];
    }
  }

  return {
    vals: [Math.sqrt(Math.max(lambdaSmall, 1e-10)), Math.sqrt(Math.max(lambdaLarge, 1e-10))],
    vecs: [vecSmall, vecLarge],
  };
}
