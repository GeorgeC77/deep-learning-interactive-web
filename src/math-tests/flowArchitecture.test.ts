import { describe, it, expect } from 'vitest';
import {
  isLowerTriangular,
  isTriangular,
  logDetTriangular,
  hutchinsonTraceEstimate,
  trace,
  buildRepresentativeJacobian,
  type FlowArchitecture,
} from '../lib/math/flowArchitecture';

const ARCHITECTURES: FlowArchitecture[] = ['coupling', 'autoregressive', 'continuous'];

describe('flowArchitecture', () => {
  it('coupling Jacobian is lower triangular', () => {
    const J = buildRepresentativeJacobian('coupling', 6);
    expect(isLowerTriangular(J)).toBe(true);
    expect(isTriangular(J)).toBe(true);
  });

  it('autoregressive Jacobian is triangular', () => {
    const J = buildRepresentativeJacobian('autoregressive', 6);
    expect(isTriangular(J)).toBe(true);
    expect(isLowerTriangular(J)).toBe(true);
  });

  it('continuous Jacobian is not triangular in general', () => {
    const J = buildRepresentativeJacobian('continuous', 6);
    expect(isTriangular(J)).toBe(false);
    expect(isLowerTriangular(J)).toBe(false);
  });

  it('logDetTriangular equals sum of log diagonal entries', () => {
    const J = buildRepresentativeJacobian('autoregressive', 5);
    const expected = J.reduce((acc, row, i) => acc + Math.log(Math.abs(row[i])), 0);
    expect(logDetTriangular(J)).toBeCloseTo(expected, 10);
  });

  it('logDetTriangular is invariant to off-diagonal entries', () => {
    const J = buildRepresentativeJacobian('coupling', 4);
    const expected = logDetTriangular(J);
    // Adding small off-diagonal entries should not change the triangular log-det.
    J[1][0] += 0.3;
    J[2][1] -= 0.1;
    expect(logDetTriangular(J)).toBeCloseTo(expected, 10);
  });

  it.each(ARCHITECTURES)('Hutchinson trace estimate is unbiased for %s', (arch) => {
    const J = buildRepresentativeJacobian(arch, 5);
    const trueTr = trace(J);
    const estimate = hutchinsonTraceEstimate(J, 5000);
    expect(estimate).toBeCloseTo(trueTr, 1);
  });

  it('Hutchinson estimate improves with more samples', () => {
    const J = buildRepresentativeJacobian('continuous', 6);
    const trueTr = trace(J);
    const few = hutchinsonTraceEstimate(J, 10);
    const many = hutchinsonTraceEstimate(J, 2000);
    expect(Math.abs(many - trueTr)).toBeLessThan(Math.abs(few - trueTr));
  });

  it('trace is the sum of diagonal entries', () => {
    const J = buildRepresentativeJacobian('continuous', 4);
    const expected = J.reduce((acc, row, i) => acc + row[i], 0);
    expect(trace(J)).toBeCloseTo(expected, 10);
  });
});
