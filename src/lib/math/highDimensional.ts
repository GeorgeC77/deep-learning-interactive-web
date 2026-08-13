export type DistanceSummary = {
  mean: number;
  standardDeviation: number;
  coefficientOfVariation: number;
  minimum: number;
  maximum: number;
};

export function seededRandom(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function standardNormal(random: () => number): number {
  const u1 = Math.max(random(), 1e-12);
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function gaussianPoints(
  dimension: number,
  count: number,
  seed: number,
): number[][] {
  const random = seededRandom(seed);
  return Array.from({ length: count }, () =>
    Array.from({ length: dimension }, () => standardNormal(random)),
  );
}

export function summarizePairwiseDistances(points: number[][]): DistanceSummary {
  const distances: number[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const squared = points[i].reduce(
        (sum, value, index) => sum + (value - points[j][index]) ** 2,
        0,
      );
      distances.push(Math.sqrt(squared));
    }
  }

  if (distances.length === 0) {
    return {
      mean: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      minimum: 0,
      maximum: 0,
    };
  }

  const mean = distances.reduce((sum, value) => sum + value, 0) / distances.length;
  const variance =
    distances.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    distances.length;
  const standardDeviation = Math.sqrt(variance);
  return {
    mean,
    standardDeviation,
    coefficientOfVariation: standardDeviation / mean,
    minimum: Math.min(...distances),
    maximum: Math.max(...distances),
  };
}

