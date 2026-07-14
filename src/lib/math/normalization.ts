/* -------------------------------------------------------------------------- */
/* Normalization helpers: data standardization, BatchNorm, LayerNorm           */
/* -------------------------------------------------------------------------- */

export interface StandardizeResult {
  normalized: number[];
  mean: number;
  std: number;
}

/**
 * Standardize a 1-D vector to zero mean and unit standard deviation.
 * Uses population std (1/N) to match typical neural-network normalization.
 */
export function standardize(values: number[], eps = 1e-8): StandardizeResult {
  const n = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / (n || 1);
  const variance =
    values.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (n || 1);
  const std = Math.sqrt(variance + eps);
  const normalized = values.map((v) => (v - mean) / std);
  return { normalized, mean, std };
}

/**
 * Batch normalization over a mini-batch of 1-D activations.
 *
 * x: shape [N, C]
 * gamma, beta: length C
 * Returns normalized + scaled/shifted output and batch statistics.
 */
export interface BatchNormResult {
  out: number[][];
  mean: number[];
  std: number[];
  runningMean: number[];
  runningStd: number[];
}

export function batchNorm(
  x: number[][],
  gamma: number[],
  beta: number[],
  eps = 1e-8,
  training = true,
  momentum = 0.9,
  runningMean?: number[],
  runningStd?: number[],
): BatchNormResult {
  const N = x.length;
  const C = gamma.length;
  const mean: number[] = new Array(C).fill(0);
  const std: number[] = new Array(C).fill(0);
  const out: number[][] = [];

  if (training) {
    for (let c = 0; c < C; c++) {
      let sum = 0;
      for (let n = 0; n < N; n++) sum += x[n][c];
      mean[c] = sum / (N || 1);
      let varSum = 0;
      for (let n = 0; n < N; n++) {
        const d = x[n][c] - mean[c];
        varSum += d * d;
      }
      std[c] = Math.sqrt(varSum / (N || 1) + eps);
    }
  } else {
    // inference: use running statistics
    for (let c = 0; c < C; c++) {
      mean[c] = runningMean?.[c] ?? 0;
      std[c] = (runningStd?.[c] ?? 1) + eps;
    }
  }

  for (let n = 0; n < N; n++) {
    const row: number[] = [];
    for (let c = 0; c < C; c++) {
      const hat = (x[n][c] - mean[c]) / std[c];
      row.push(gamma[c] * hat + beta[c]);
    }
    out.push(row);
  }

  const newRunningMean = new Array(C).fill(0);
  const newRunningStd = new Array(C).fill(0);
  for (let c = 0; c < C; c++) {
    if (training && runningMean && runningStd) {
      newRunningMean[c] = momentum * runningMean[c] + (1 - momentum) * mean[c];
      // Running variance: keep std for simplicity in the demo
      newRunningStd[c] = momentum * runningStd[c] + (1 - momentum) * std[c];
    } else if (training) {
      newRunningMean[c] = mean[c];
      newRunningStd[c] = std[c];
    } else {
      newRunningMean[c] = runningMean?.[c] ?? 0;
      newRunningStd[c] = runningStd?.[c] ?? 1;
    }
  }

  return { out, mean, std, runningMean: newRunningMean, runningStd: newRunningStd };
}

/**
 * Layer normalization over a single feature vector.
 *
 * x: length D
 * gamma, beta: length D
 */
export interface LayerNormResult {
  out: number[];
  mean: number;
  std: number;
}

export function layerNorm(
  x: number[],
  gamma: number[],
  beta: number[],
  eps = 1e-8,
): LayerNormResult {
  const D = x.length;
  const mean = x.reduce((s, v) => s + v, 0) / (D || 1);
  const variance = x.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (D || 1);
  const std = Math.sqrt(variance + eps);
  const out = x.map((v, i) => (gamma[i] ?? 1) * ((v - mean) / std) + (beta[i] ?? 0));
  return { out, mean, std };
}
