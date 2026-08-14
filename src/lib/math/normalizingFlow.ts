export type AffineCouplingResult = {
  first: number[];
  second: number[];
  logAbsDet: number;
};

function validateVectors(vectors: number[][]): number {
  const length = vectors[0]?.length ?? 0;
  if (length === 0 || vectors.some((vector) => vector.length !== length)) {
    throw new RangeError('All coupling vectors must have the same non-zero length.');
  }
  if (vectors.some((vector) => vector.some((value) => !Number.isFinite(value)))) {
    throw new RangeError('Coupling vectors must contain only finite values.');
  }
  return length;
}

/** Forward affine coupling: x_A=z_A, x_B=exp(s)⊙z_B+b. */
export function affineCouplingForward(
  zA: number[],
  zB: number[],
  logScale: number[],
  shift: number[],
): AffineCouplingResult {
  const length = validateVectors([zA, zB, logScale, shift]);
  const xB = Array.from(
    { length },
    (_, index) => Math.exp(logScale[index]) * zB[index] + shift[index],
  );
  return {
    first: [...zA],
    second: xB,
    logAbsDet: logScale.reduce((sum, value) => sum + value, 0),
  };
}

/** Inverse affine coupling: z_A=x_A, z_B=exp(-s)⊙(x_B-b). */
export function affineCouplingInverse(
  xA: number[],
  xB: number[],
  logScale: number[],
  shift: number[],
): AffineCouplingResult {
  const length = validateVectors([xA, xB, logScale, shift]);
  const zB = Array.from(
    { length },
    (_, index) => Math.exp(-logScale[index]) * (xB[index] - shift[index]),
  );
  return {
    first: [...xA],
    second: zB,
    logAbsDet: -logScale.reduce((sum, value) => sum + value, 0),
  };
}

/** Change of variables using the forward Jacobian K=∂f/∂z. */
export function transformedLogDensity(baseLogDensity: number, forwardLogAbsDet: number): number {
  if (!Number.isFinite(baseLogDensity) || !Number.isFinite(forwardLogAbsDet)) {
    throw new RangeError('Log densities and log-determinants must be finite.');
  }
  return baseLogDensity - forwardLogAbsDet;
}

export type AutoregressiveDirection = 'maf' | 'iaf';

export type AutoregressiveSchedule = {
  densitySequentialSteps: number;
  samplingSequentialSteps: number;
  densityParallel: boolean;
  samplingParallel: boolean;
};

/**
 * Idealized dependency-depth comparison from Bishop Fig. 18.4.
 * A value of 1 denotes one parallel pass; D denotes a sequential chain.
 */
export function autoregressiveSchedule(
  direction: AutoregressiveDirection,
  dimension: number,
): AutoregressiveSchedule {
  if (!Number.isInteger(dimension) || dimension < 1) {
    throw new RangeError('Dimension must be a positive integer.');
  }
  if (direction === 'maf') {
    return {
      densitySequentialSteps: 1,
      samplingSequentialSteps: dimension,
      densityParallel: true,
      samplingParallel: false,
    };
  }
  return {
    densitySequentialSteps: dimension,
    samplingSequentialSteps: 1,
    densityParallel: false,
    samplingParallel: true,
  };
}
