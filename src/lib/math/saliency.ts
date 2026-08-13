export function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

export function linearSigmoidScore(input: number[], weights: number[], bias: number): number {
  return sigmoid(input.reduce((sum, value, index) => sum + value * weights[index], bias));
}

export function inputGradient(input: number[], weights: number[], bias: number): number[] {
  const score = linearSigmoidScore(input, weights, bias);
  return weights.map((weight) => weight * score * (1 - score));
}

export function integratedGradients(
  input: number[],
  weights: number[],
  bias: number,
  steps = 100,
): number[] {
  const accumulated = Array<number>(input.length).fill(0);
  for (let step = 1; step <= steps; step += 1) {
    const alpha = step / steps;
    const point = input.map((value) => alpha * value);
    const gradient = inputGradient(point, weights, bias);
    gradient.forEach((value, index) => { accumulated[index] += value; });
  }
  return accumulated.map((value, index) => value * input[index] / steps);
}

export function occlusionAttribution(input: number[], weights: number[], bias: number): number[] {
  const score = linearSigmoidScore(input, weights, bias);
  return input.map((_, occludedIndex) => {
    const occluded = input.map((value, index) => index === occludedIndex ? 0 : value);
    return score - linearSigmoidScore(occluded, weights, bias);
  });
}

export function softmax(values: number[]): number[] {
  const maximum = Math.max(...values);
  const exponentials = values.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}
