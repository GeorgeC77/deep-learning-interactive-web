/* -------------------------------------------------------------------------- */
/* 1D convolution helpers                                                      */
/* -------------------------------------------------------------------------- */

export interface SamePaddingResult {
  left: number;
  right: number;
  total: number;
  outputSize: number;
}

/**
 * Standard convolution output size formula.
 *   O = floor((I + 2P - K) / S) + 1
 */
export function computeOutputSize(I: number, K: number, P: number, S: number): number {
  return Math.floor((I + 2 * P - K) / S) + 1;
}

export const outputSizeFormulaLatex = String.raw`O = \left\lfloor \frac{I + 2P - K}{S} \right\rfloor + 1`;

/**
 * "Classic" SAME convolution: stride 1 and output equals input.
 * This is the mathematical special case, not the framework convention.
 */
export const classicSameFormulaLatex = String.raw`O = I \quad (S=1,\ P = \frac{K-1}{2}\ \text{当 } K \text{ 为奇数})`;

/**
 * TensorFlow / PyTorch SAME padding for 1D convolution.
 *   O = ceil(I / S)
 *   Ptotal = max((O - 1) * S + K - I, 0)
 *   Pleft = floor(Ptotal / 2)
 *   Pright = Ptotal - Pleft
 */
export function computeSamePadding(I: number, K: number, S: number): SamePaddingResult {
  const outputSize = Math.ceil(I / S);
  const total = Math.max((outputSize - 1) * S + K - I, 0);
  const left = Math.floor(total / 2);
  const right = total - left;
  return { left, right, total, outputSize };
}

export const frameworkSameFormulaLatex = String.raw`O = \left\lceil \frac{I}{S} \right\rceil`;

export function frameworkSamePaddingFormulaLatex(I: number, K: number, S: number): string {
  const { outputSize, total, left, right } = computeSamePadding(I, K, S);
  return String.raw`O=${outputSize},\ P_{\text{total}}=${total},\ P_{\text{left}}=${left},\ P_{\text{right}}=${right}`;
}

export interface CustomPadding {
  left: number;
  right: number;
}

/**
 * Apply a 1D convolution with the chosen padding mode.
 * Stride defaults to 1; pass a value > 1 to slide the kernel by that amount.
 */
export function applyConvolution(
  input: number[],
  kernel: number[],
  paddingMode: 'valid' | 'same' | 'custom',
  customPad?: CustomPadding,
  stride = 1,
): number[] {
  const I = input.length;
  const K = kernel.length;

  let left = 0;
  let right = 0;

  if (paddingMode === 'valid') {
    left = 0;
    right = 0;
  } else if (paddingMode === 'same') {
    const pad = computeSamePadding(I, K, stride);
    left = pad.left;
    right = pad.right;
  } else if (paddingMode === 'custom') {
    if (!customPad) {
      throw new Error('custom padding mode requires customPad with left/right values');
    }
    left = customPad.left;
    right = customPad.right;
  }

  const padded = Array<number>(left).fill(0).concat(input, Array<number>(right).fill(0));
  const O = Math.floor((I + left + right - K) / stride) + 1;

  const output: number[] = [];
  for (let i = 0; i < O; i++) {
    let sum = 0;
    const start = i * stride;
    for (let k = 0; k < K; k++) {
      sum += padded[start + k] * kernel[k];
    }
    output.push(sum);
  }
  return output;
}
