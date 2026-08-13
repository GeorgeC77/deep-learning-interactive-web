export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('vectors must have equal length');
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

export function vectorNorm(vector: number[]): number {
  return Math.sqrt(dotProduct(vector, vector));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const denominator = vectorNorm(a) * vectorNorm(b);
  return denominator === 0 ? 0 : dotProduct(a, b) / denominator;
}

export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('vectors must have equal length');
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

export function bagOfWords(tokens: string[], vocabulary: string[]): number[] {
  const indices = new Map(vocabulary.map((token, index) => [token, index]));
  const counts = new Array(vocabulary.length).fill(0);
  tokens.forEach((token) => {
    const index = indices.get(token);
    if (index !== undefined) counts[index] += 1;
  });
  return counts;
}

export function autoregressiveJointProbability(conditionals: number[]): number {
  return conditionals.reduce((product, probability) => product * probability, 1);
}
