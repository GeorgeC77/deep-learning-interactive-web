export type ProbabilityVector = number[];
export type ProbabilityMatrix = number[][];

const assertProbabilityVector = (values: ProbabilityVector, label: string) => {
  if (values.length === 0 || values.some((value) => value < 0 || !Number.isFinite(value))) {
    throw new Error(`${label} must contain finite non-negative probabilities`);
  }
};

export function normalize(values: ProbabilityVector): ProbabilityVector {
  assertProbabilityVector(values, 'values');
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) throw new Error('probabilities must have positive total mass');
  return values.map((value) => value / total);
}

export function predictState(
  posterior: ProbabilityVector,
  transition: ProbabilityMatrix,
): ProbabilityVector {
  assertProbabilityVector(posterior, 'posterior');
  if (
    transition.length !== posterior.length ||
    transition.some((row) => row.length !== posterior.length)
  ) {
    throw new Error('transition matrix dimensions must match the state vector');
  }
  return posterior.map((_, nextState) =>
    posterior.reduce(
      (sum, probability, previousState) =>
        sum + probability * transition[previousState][nextState],
      0,
    ),
  );
}

export function updateState(
  prior: ProbabilityVector,
  likelihood: ProbabilityVector,
): ProbabilityVector {
  if (prior.length !== likelihood.length) {
    throw new Error('prior and likelihood dimensions must match');
  }
  return normalize(prior.map((value, state) => value * likelihood[state]));
}

export function filterHiddenStates(
  initial: ProbabilityVector,
  transition: ProbabilityMatrix,
  emission: ProbabilityMatrix,
  observations: number[],
): ProbabilityVector[] {
  let posterior = normalize(initial);
  return observations.map((observation, index) => {
    const prior = index === 0 ? posterior : predictState(posterior, transition);
    const likelihood = emission.map((row) => {
      const value = row[observation];
      if (value === undefined) throw new Error('observation is outside the emission table');
      return value;
    });
    posterior = updateState(prior, likelihood);
    return posterior;
  });
}

export function markovChainJointProbability(
  initial: ProbabilityVector,
  transition: ProbabilityMatrix,
  states: number[],
): number {
  if (states.length === 0) return 1;
  let probability = initial[states[0]] ?? 0;
  for (let index = 1; index < states.length; index += 1) {
    probability *= transition[states[index - 1]]?.[states[index]] ?? 0;
  }
  return probability;
}

export function stateSpaceJointProbability(
  initial: ProbabilityVector,
  transition: ProbabilityMatrix,
  emission: ProbabilityMatrix,
  states: number[],
  observations: number[],
): number {
  if (states.length !== observations.length) {
    throw new Error('states and observations must have equal length');
  }
  return markovChainJointProbability(initial, transition, states) *
    states.reduce(
      (probability, state, index) => probability * (emission[state]?.[observations[index]] ?? 0),
      1,
    );
}
