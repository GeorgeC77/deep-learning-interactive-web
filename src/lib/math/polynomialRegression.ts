export type RegressionPoint = {
  x: number;
  t: number;
};

export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented = A.map((row, index) => [...row, b[index]]);

  for (let column = 0; column < n; column++) {
    let pivotRow = column;
    let pivotMagnitude = Math.abs(augmented[column][column]);
    for (let row = column + 1; row < n; row++) {
      const candidateMagnitude = Math.abs(augmented[row][column]);
      if (candidateMagnitude > pivotMagnitude) {
        pivotMagnitude = candidateMagnitude;
        pivotRow = row;
      }
    }

    if (pivotMagnitude < 1e-12) continue;
    [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];

    const pivot = augmented[column][column];
    for (let j = column; j <= n; j++) augmented[column][j] /= pivot;

    for (let row = 0; row < n; row++) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let j = column; j <= n; j++) {
        augmented[row][j] -= factor * augmented[column][j];
      }
    }
  }

  return augmented.map((row) => row[n]);
}

export function fitPolynomial(
  train: RegressionPoint[],
  degree: number,
  lambda = 0,
): number[] {
  if (train.length === 0) throw new Error('Training data must not be empty.');
  if (!Number.isInteger(degree) || degree < 0) {
    throw new Error('Polynomial degree must be a non-negative integer.');
  }
  if (!Number.isFinite(lambda) || lambda < 0) {
    throw new Error('Regularization strength must be a non-negative number.');
  }

  const design = train.map((point) => {
    const row: number[] = [];
    let power = 1;
    for (let j = 0; j <= degree; j++) {
      row.push(power);
      power *= point.x;
    }
    return row;
  });

  const normalMatrix = Array.from({ length: degree + 1 }, (_, i) =>
    Array.from({ length: degree + 1 }, (_, j) =>
      design.reduce((sum, row) => sum + row[i] * row[j], 0) +
      (i === j ? lambda : 0),
    ),
  );
  const normalTarget = Array.from({ length: degree + 1 }, (_, i) =>
    train.reduce((sum, point, index) => sum + design[index][i] * point.t, 0),
  );

  return solveLinearSystem(normalMatrix, normalTarget);
}

export function predictPolynomial(x: number, coefficients: number[]): number {
  let prediction = 0;
  let power = 1;
  for (const coefficient of coefficients) {
    prediction += coefficient * power;
    power *= x;
  }
  return prediction;
}

export function rmsError(
  points: RegressionPoint[],
  coefficients: number[],
): number {
  if (points.length === 0) throw new Error('Evaluation data must not be empty.');
  const squaredError = points.reduce(
    (sum, point) => sum + (predictPolynomial(point.x, coefficients) - point.t) ** 2,
    0,
  );
  return Math.sqrt(squaredError / points.length);
}

export function coefficientNorm(coefficients: number[]): number {
  return Math.sqrt(coefficients.reduce((sum, coefficient) => sum + coefficient ** 2, 0));
}
