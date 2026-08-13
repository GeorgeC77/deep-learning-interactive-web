export function mean(values: number[]): number {
  return values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function populationStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const center = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - center) ** 2)));
}

export function standardError(standardDeviation: number, batchSize: number): number {
  return standardDeviation / Math.sqrt(Math.max(1, batchSize));
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function standardNormal(random: () => number): number {
  const u = Math.max(random(), 1e-12);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function generateGradientPopulation(
  count: number,
  center: number,
  spread: number,
  seed: number,
): number[] {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () => center + spread * standardNormal(random));
}

export function sampleMeanEstimates(
  population: number[],
  batchSize: number,
  repetitions: number,
  seed: number,
): number[] {
  if (population.length === 0) return [];
  const random = seededRandom(seed);
  return Array.from({ length: repetitions }, () => {
    let sum = 0;
    for (let index = 0; index < batchSize; index++) {
      sum += population[Math.floor(random() * population.length)];
    }
    return sum / batchSize;
  });
}

export function rootMeanSquaredError(values: number[], target: number): number {
  return Math.sqrt(mean(values.map((value) => (value - target) ** 2)));
}
