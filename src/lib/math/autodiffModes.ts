export type AutodiffMode = 'forward' | 'reverse' | 'either';

export type AutodiffTrace = {
  values: [number, number, number, number, number, number, number];
  output: number;
};

export function autodiffPassCounts(inputDimension: number, outputDimension: number) {
  const D = Math.max(1, Math.floor(inputDimension));
  const K = Math.max(1, Math.floor(outputDimension));
  return { forward: D, reverse: K };
}

export function recommendAutodiffMode(
  inputDimension: number,
  outputDimension: number,
): AutodiffMode {
  const { forward, reverse } = autodiffPassCounts(inputDimension, outputDimension);
  if (forward < reverse) return 'forward';
  if (reverse < forward) return 'reverse';
  return 'either';
}

// Bishop §8.2 example: f(x1,x2)=x1*x2+exp(x1*x2)-sin(x2).
export function evaluateAutodiffTrace(x1: number, x2: number): AutodiffTrace {
  const v1 = x1;
  const v2 = x2;
  const v3 = v1 * v2;
  const v4 = Math.sin(v2);
  const v5 = Math.exp(v3);
  const v6 = v3 - v4;
  const v7 = v5 + v6;
  return { values: [v1, v2, v3, v4, v5, v6, v7], output: v7 };
}

export function forwardModeDirectionalDerivative(
  x1: number,
  x2: number,
  seed: [number, number],
): number {
  const { values } = evaluateAutodiffTrace(x1, x2);
  const [v1, v2, v3] = values;
  const dv1 = seed[0];
  const dv2 = seed[1];
  const dv3 = dv1 * v2 + v1 * dv2;
  const dv4 = dv2 * Math.cos(v2);
  const dv5 = dv3 * Math.exp(v3);
  const dv6 = dv3 - dv4;
  return dv5 + dv6;
}

export function reverseModeGradient(x1: number, x2: number): [number, number] {
  const { values } = evaluateAutodiffTrace(x1, x2);
  const [v1, v2, v3] = values;
  const barV7 = 1;
  const barV6 = barV7;
  const barV5 = barV7;
  const barV4 = -barV6;
  const barV3 = barV5 * Math.exp(v3) + barV6;
  const barV2 = barV3 * v1 + barV4 * Math.cos(v2);
  const barV1 = barV3 * v2;
  return [barV1, barV2];
}
