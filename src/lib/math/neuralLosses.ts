const EPS = 1e-12;

export function sigmoidFromLogit(logit: number): number {
  if (logit >= 0) {
    const exp = Math.exp(-logit);
    return 1 / (1 + exp);
  }
  const exp = Math.exp(logit);
  return exp / (1 + exp);
}

export function binaryCrossEntropy(probability: number, target: 0 | 1): number {
  const p = Math.min(1 - EPS, Math.max(EPS, probability));
  return -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
}

export function binaryCrossEntropyLogitGradient(
  logit: number,
  target: 0 | 1,
): number {
  return sigmoidFromLogit(logit) - target;
}

export function binarySquaredError(probability: number, target: 0 | 1): number {
  return 0.5 * (probability - target) ** 2;
}

export function binarySquaredErrorLogitGradient(
  logit: number,
  target: 0 | 1,
): number {
  const p = sigmoidFromLogit(logit);
  return (p - target) * p * (1 - p);
}

export function softmax(logits: number[]): number[] {
  if (logits.length === 0) return [];
  const maximum = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

export function multiclassCrossEntropy(logits: number[], targetIndex: number): number {
  const probabilities = softmax(logits);
  return -Math.log(Math.max(probabilities[targetIndex] ?? 0, EPS));
}

