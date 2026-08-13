import { describe, expect, it } from 'vitest';
import {
  filterHiddenStates,
  markovChainJointProbability,
  normalize,
  stateSpaceJointProbability,
} from '@/lib/math/sequenceModels';

describe('sequenceModels', () => {
  it('normalizes non-negative probability masses', () => {
    expect(normalize([2, 3])).toEqual([0.4, 0.6]);
  });

  it('computes a first-order Markov path probability', () => {
    const probability = markovChainJointProbability(
      [0.6, 0.4],
      [[0.7, 0.3], [0.2, 0.8]],
      [0, 1, 1],
    );
    expect(probability).toBeCloseTo(0.6 * 0.3 * 0.8);
  });

  it('includes both transition and emission factors in the state-space joint', () => {
    const probability = stateSpaceJointProbability(
      [0.6, 0.4],
      [[0.7, 0.3], [0.2, 0.8]],
      [[0.9, 0.1], [0.25, 0.75]],
      [0, 1],
      [0, 1],
    );
    expect(probability).toBeCloseTo(0.6 * 0.3 * 0.9 * 0.75);
  });

  it('retains earlier evidence in the hidden-state filtering posterior', () => {
    const transition = [[0.9, 0.1], [0.1, 0.9]];
    const emission = [[0.85, 0.15], [0.15, 0.85]];
    const afterNoUmbrellaThenUmbrella = filterHiddenStates(
      [0.5, 0.5], transition, emission, [0, 1],
    )[1][1];
    const afterTwoUmbrellas = filterHiddenStates(
      [0.5, 0.5], transition, emission, [1, 1],
    )[1][1];
    expect(afterTwoUmbrellas).toBeGreaterThan(afterNoUmbrellaThenUmbrella);
  });
});
