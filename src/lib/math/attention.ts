/* -------------------------------------------------------------------------- */
/* Attention math                                                              */
/* -------------------------------------------------------------------------- */

export function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length, n = B[0].length, inner = A[0].length;
  return Array.from({ length: m }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      let s = 0;
      for (let k = 0; k < inner; k++) s += A[i][k] * B[k][j];
      return s;
    }),
  );
}

export type MultiHeadResult = {
  headOutputs: {
    Q: number[][];
    K: number[][];
    V: number[][];
    scores: number[][];
    attention: number[][];
    headOut: number[][];
  }[];
  concat: number[][];
  finalOutput: number[][];
};

/**
 * Full multi-head attention with per-head projection matrices.
 *
 * Column convention (standard):
 *   X: N x dModel
 *   W_Q^h, W_K^h, W_V^h: dModel x dK
 *   W_O: dModel x dModel
 *
 * For each head:
 *   Q_h = X W_Q^h
 *   K_h = X W_K^h
 *   V_h = X W_V^h
 *   scores_h[i][j] = (Q_h[i] · K_h[j]) / sqrt(dK)
 *   attention_h = softmax_rows(scores_h)
 *   headOut_h = attention_h V_h
 *
 * Finally:
 *   concat = [headOut_0 | ... | headOut_{H-1}]
 *   Y = concat W_O
 */
export function multiHeadAttention(
  X: number[][],
  allWQ: number[][][],
  allWK: number[][][],
  allWV: number[][][],
  WO: number[][],
  causalMask: boolean,
): MultiHeadResult {
  const H = allWQ.length;
  const N = X.length;
  if (N === 0) {
    return { headOutputs: [], concat: [], finalOutput: [] };
  }
  const dModel = X[0].length;
  const dK = dModel / H;

  const headOutputs = Array.from({ length: H }, (_, h) => {
    const Q = matMul(X, allWQ[h]);
    const K = matMul(X, allWK[h]);
    const V = matMul(X, allWV[h]);

    const scores = Array.from({ length: N }, (_, i) =>
      Array.from({ length: N }, (_, j) => {
        let s = 0;
        for (let k = 0; k < dK; k++) s += Q[i][k] * K[j][k];
        return s / Math.sqrt(dK) - (causalMask && j > i ? 1e9 : 0);
      }),
    );

    const attention = scores.map((row) => softmax(row));
    const headOut = matMul(attention, V);
    return { Q, K, V, scores, attention, headOut };
  });

  // Concat: N x (H * dK) = N x dModel
  const concat = Array.from({ length: N }, (_, i) => {
    const row: number[] = [];
    for (let h = 0; h < H; h++) row.push(...headOutputs[h].headOut[i]);
    return row;
  });

  const finalOutput = matMul(concat, WO);
  return { headOutputs, concat, finalOutput };
}

export function divisors(n: number): number[] {
  const result: number[] = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) result.push(i);
  return result;
}

export function sinusoidalPE(pos: number, dModel: number): number[] {
  return Array.from({ length: dModel }, (_, i) => {
    const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dModel);
    return i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
  });
}
