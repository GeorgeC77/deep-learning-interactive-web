import { describe, it, expect } from 'vitest';
import {
  isLowerTriangular,
  isTriangular,
  logDetTriangular,
  hutchinsonTraceEstimate,
  trace,
  buildRepresentativeJacobian,
  totalEntries,
  nonzeroCount,
  diagonalEntries,
  maxTriangularNonzeros,
  maxCouplingNonzeros,
  densityEvalCost,
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

  it('full Jacobian has D² entries regardless of architecture', () => {
    for (const arch of ARCHITECTURES) {
      const J = buildRepresentativeJacobian(arch, 6);
      expect(totalEntries(J)).toBe(36);
      expect(diagonalEntries(J)).toBe(6);
    }
  });

  it('coupling and autoregressive Jacobians can have O(D²) non-zeros', () => {
    const dim = 8;
    const coupling = buildRepresentativeJacobian('coupling', dim);
    const autoregressive = buildRepresentativeJacobian('autoregressive', dim);

    // The representative matrices are sparse, but the maximum allowed non-zeros
    // for these structured forms scale quadratically with D.
    expect(nonzeroCount(coupling)).toBeLessThanOrEqual(maxCouplingNonzeros(dim));
    expect(nonzeroCount(autoregressive)).toBeLessThanOrEqual(maxTriangularNonzeros(dim));
    expect(maxCouplingNonzeros(dim)).toBeGreaterThan(dim);
    expect(maxTriangularNonzeros(dim)).toBe((dim * (dim + 1)) / 2);
  });

  it('Hutchinson toy implementation with explicit J costs O(M·D²)', () => {
    const dim = 10;
    const J = buildRepresentativeJacobian('continuous', dim);
    const M = 20;
    const estimate = hutchinsonTraceEstimate(J, M);
    // The estimator is unbiased; the toy cost here is M matrix-vector products,
    // each O(D²). Real autodiff implementations cost O(M·C_f) instead.
    expect(Number.isFinite(estimate)).toBe(true);
  });

  it('densityEvalCost description does not claim only O(D) non-zeros', () => {
    const c = densityEvalCost('coupling', 8);
    const a = densityEvalCost('autoregressive', 8);
    expect(c.description).not.toContain('only O(D)');
    expect(a.description).not.toContain('only O(D)');
  });
});
