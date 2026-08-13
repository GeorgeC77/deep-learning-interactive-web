export type FeatureMatrix = number[][];

function assertRectangular(matrix: FeatureMatrix): void {
  const width = matrix[0]?.length ?? 0;
  if (width === 0 || matrix.some((row) => row.length !== width)) {
    throw new Error('feature matrix must be non-empty and rectangular');
  }
}

export function gramMatrix(features: FeatureMatrix): number[][] {
  assertRectangular(features);
  return features.map((left) =>
    features.map((right) => left.reduce((sum, value, index) => sum + value * right[index], 0)),
  );
}

export function squaredFeatureLoss(left: FeatureMatrix, right: FeatureMatrix): number {
  assertRectangular(left);
  assertRectangular(right);
  if (left.length !== right.length || left[0].length !== right[0].length) {
    throw new Error('feature matrices must have the same shape');
  }
  return left.reduce(
    (sum, row, channel) => sum + row.reduce(
      (rowSum, value, position) => rowSum + (value - right[channel][position]) ** 2,
      0,
    ),
    0,
  );
}

export function styleMatrixLoss(generated: FeatureMatrix, style: FeatureMatrix): number {
  const generatedGram = gramMatrix(generated);
  const styleGram = gramMatrix(style);
  const channels = generated.length;
  const spatialPositions = generated[0].length;
  return squaredFeatureLoss(generatedGram, styleGram)
    / (2 * (spatialPositions * channels) ** 2);
}

export function interpolateFeatures(
  content: FeatureMatrix,
  style: FeatureMatrix,
  styleAmount: number,
): FeatureMatrix {
  return content.map((row, channel) => row.map(
    (value, position) => (1 - styleAmount) * value + styleAmount * style[channel][position],
  ));
}

export function permuteSpatialPositions(features: FeatureMatrix, order: number[]): FeatureMatrix {
  assertRectangular(features);
  if (order.length !== features[0].length) throw new Error('permutation length mismatch');
  return features.map((row) => order.map((position) => row[position]));
}
