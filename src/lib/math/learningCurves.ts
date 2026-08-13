export type LearningCurvePoint = { epoch: number; train: number; validation: number };

export function syntheticLearningCurves(maxEpoch: number, overfitRate: number): LearningCurvePoint[] {
  const epochs = Math.max(2, Math.floor(maxEpoch));
  return Array.from({ length: epochs + 1 }, (_, epoch) => {
    const train = 0.08 + 0.92 * Math.exp(-epoch / 18);
    const validation = 0.16 + 0.78 * Math.exp(-epoch / 14) + Math.max(0, epoch - 34) ** 2 * overfitRate;
    return { epoch, train, validation };
  });
}

export function bestValidationEpoch(points: LearningCurvePoint[]): LearningCurvePoint {
  if (points.length === 0) throw new Error('Learning curve must not be empty.');
  return points.reduce((best, point) => point.validation < best.validation ? point : best);
}

export function earlyStoppingEpoch(points: LearningCurvePoint[], patience: number): number {
  if (points.length === 0) throw new Error('Learning curve must not be empty.');
  const waitLimit = Math.max(0, Math.floor(patience));
  let best = points[0].validation;
  let bestEpoch = points[0].epoch;
  let stale = 0;
  for (const point of points.slice(1)) {
    if (point.validation < best) {
      best = point.validation;
      bestEpoch = point.epoch;
      stale = 0;
    } else {
      stale += 1;
      if (stale > waitLimit) return bestEpoch;
    }
  }
  return bestEpoch;
}

export function doubleDescentSchematic(complexity: number, threshold: number): number {
  const x = Math.max(0, complexity);
  const t = Math.max(1, threshold);
  const bias = 0.75 / (1 + x / (0.35 * t));
  const normalizedDistance = (x - t) / (0.14 * t);
  const interpolationPeak = 0.75 * Math.exp(-(normalizedDistance ** 2));
  const varianceFloor = 0.12 + 0.12 / (1 + x / t);
  return bias + interpolationPeak + varianceFloor;
}
