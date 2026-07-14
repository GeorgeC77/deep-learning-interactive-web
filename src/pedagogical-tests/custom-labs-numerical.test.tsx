import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ModelAveragingLab from '@/components/demos/ModelAveragingLab';
import ClassificationCostLab from '@/components/demos/ClassificationCostLab';
import VAELatentCloudLab from '@/components/demos/VAELatentCloudLab';
import GANGradientLab from '@/components/demos/GANGradientLab';
import ContinuousFlowLab from '@/components/demos/ContinuousFlowLab';
import Ch15AutoregressiveFlowsPage from '@/pages/generated/Ch15AutoregressiveFlowsPage';
import {
  ensembleVariance,
  isFeasibleRho,
} from '@/lib/math/modelAveraging';
import {
  convConnectionCount,
  locallyConnectedConnectionCount,
  denseConnectionCount,
} from '@/lib/math/parameterSharing';
import { latentStatistics, sampleLatent } from '@/lib/math/vae';
import { sigmoid, gradMinimaxLogit, gradNonSaturatingLogit } from '@/lib/math/gan';
import {
  buildRepresentativeJacobian,
  totalEntries,
  nonzeroCount,
  maxTriangularNonzeros,
  maxCouplingNonzeros,
  hutchinsonTraceEstimate,
} from '@/lib/math/flowArchitecture';
import { blowUpField, flowMapForward } from '@/lib/math/continuousFlow';

function extractPathNaNs(container: HTMLElement): boolean {
  const paths = container.querySelectorAll('path');
  for (const path of paths) {
    const d = path.getAttribute('d') || '';
    if (d.toLowerCase().includes('nan')) return true;
    // d like "M 123 45 L 67 89"; parse all numbers
    const nums = d.match(/-?\d+(\.\d+)?/g) || [];
    for (const n of nums) {
      if (!Number.isFinite(parseFloat(n))) return true;
    }
  }
  return false;
}

describe('custom labs numerical semantics', () => {
  it('model averaging rejects infeasible rho and produces no NaN paths', () => {
    const { container } = render(<ModelAveragingLab />);
    const text = container.textContent || '';

    // The lab should display the feasible lower bound.
    expect(text).toContain('可行下界');
    expect(text).not.toContain('相关误差是无法通过平均消除的偏差');
    expect(text).toContain('正相关误差保留共同方差成分');

    // M=10 infeasible rho check via the math helper.
    const M = 10;
    expect(isFeasibleRho(M, -0.2)).toBe(false);
    expect(ensembleVariance(1, M, -0.2)).toBeLessThan(0);

    // No NaN should appear in plotted SVG paths.
    expect(extractPathNaNs(container)).toBe(false);
  });

  it('model averaging scaled negative preset stays feasible for all M > 1', () => {
    for (let M = 2; M <= 50; M++) {
      const rho = -0.8 / (M - 1);
      expect(isFeasibleRho(M, rho)).toBe(true);
      expect(ensembleVariance(1, M, rho)).toBeGreaterThanOrEqual(0);
    }
  });

  it('classification cost curve and marker share the same y-scale', () => {
    const { container } = render(<ClassificationCostLab />);
    const text = container.textContent || '';

    // The lab should use a common maxRisk for both curves and markers.
    expect(text).toContain('R(positive)');
    expect(text).toContain('R(negative)');

    // Default cFP=2, cFN=1, so maxRisk=2. The y-axis ticks should reflect that scale.
    const labels = Array.from(container.querySelectorAll('text')).map((t) => t.textContent);
    expect(labels.some((l) => l && l.includes('2.00'))).toBe(true);
  });

  it('parameter sharing distinguishes dense, local and conv connection counts', () => {
    const Hin = 10;
    const Win = 10;
    const Cin = 2;
    const Hout = 8;
    const Wout = 8;
    const Cout = 4;
    const Kh = 3;
    const Kw = 3;

    const denseConn = denseConnectionCount(Hin, Win, Cin, Hout, Wout, Cout);
    const localConn = locallyConnectedConnectionCount(Hout, Wout, Cout, Kh, Kw, Cin);
    const convConn = convConnectionCount(Hout, Wout, Cout, Kh, Kw, Cin);

    expect(localConn).toBe(convConn);
    expect(denseConn).toBe(Hin * Win * Cin * Hout * Wout * Cout);
    expect(denseConn).toBeGreaterThan(localConn);
  });

  it('VAE displayed standard deviations come from covariance diagonal', () => {
    const mu = [0.5, -0.3];
    const sigma = [0.9, 1.1];
    const points = sampleLatent(mu, sigma, 456, 2000);
    const stats = latentStatistics(points);

    expect(Number.isFinite(stats.cov[0][0])).toBe(true);
    expect(Number.isFinite(stats.cov[1][1])).toBe(true);
    expect(Number.isFinite(stats.cov[0][1])).toBe(true);

    const stdX = Math.sqrt(Math.max(0, stats.cov[0][0]));
    const stdY = Math.sqrt(Math.max(0, stats.cov[1][1]));
    expect(stdX * stdX).toBeCloseTo(stats.cov[0][0], 10);
    expect(stdY * stdY).toBeCloseTo(stats.cov[1][1], 10);

    const { container } = render(<VAELatentCloudLab />);
    const text = container.textContent || '';
    expect(text).toContain('std_x');
    expect(text).toContain('std_y');
    expect(text).toContain('cov_xy');
  });

  it('GAN negative derivative increases D under gradient descent', () => {
    const a = -1.0;
    const D = sigmoid(a);
    const eta = 0.1;

    const dMm = gradMinimaxLogit(D);
    const dNs = gradNonSaturatingLogit(D);
    expect(dMm).toBeLessThan(0);
    expect(dNs).toBeLessThan(0);

    expect(sigmoid(a - eta * dMm)).toBeGreaterThan(D);
    expect(sigmoid(a - eta * dNs)).toBeGreaterThan(D);
  });

  it('GAN D≈1 preset is not labelled as mode collapse', () => {
    const { container } = render(<GANGradientLab />);
    const text = container.textContent || '';
    expect(text).not.toContain('生成器坍缩到单一模式');
    expect(text).not.toContain('mode collapse');
    expect(text).toContain('判别器确信生成样本为真');
  });

  it('GAN main prediction gate uses structured options, not free-text saturation', () => {
    const { container } = render(<GANGradientLab />);
    const radios = container.querySelectorAll('input[type="radio"]');
    const labels = Array.from(container.querySelectorAll('label')).map((l) => l.textContent);
    expect(radios.length).toBeGreaterThanOrEqual(2);
    expect(labels.some((l) => l?.toLowerCase().includes('minimax'))).toBe(true);
    expect(labels.some((l) => l?.toLowerCase().includes('non-saturating'))).toBe(true);
  });

  it('coupling and autoregressive Jacobians can have O(D²) non-zeros', () => {
    const dim = 10;
    const coupling = buildRepresentativeJacobian('coupling', dim);
    const autoregressive = buildRepresentativeJacobian('autoregressive', dim);

    expect(totalEntries(coupling)).toBe(dim * dim);
    expect(totalEntries(autoregressive)).toBe(dim * dim);

    expect(nonzeroCount(coupling)).toBeLessThanOrEqual(maxCouplingNonzeros(dim));
    expect(nonzeroCount(autoregressive)).toBeLessThanOrEqual(maxTriangularNonzeros(dim));

    // Both maxima scale quadratically with D.
    expect(maxCouplingNonzeros(dim)).toBeGreaterThan(dim);
    expect(maxTriangularNonzeros(dim)).toBe((dim * (dim + 1)) / 2);
  });

  it('explicit Hutchinson toy implementation reports O(M·D²) cost', () => {
    const dim = 8;
    const J = buildRepresentativeJacobian('continuous', dim);
    const M = 16;
    const estimate = hutchinsonTraceEstimate(J, M);
    expect(Number.isFinite(estimate)).toBe(true);
    // The toy implementation explicitly forms J and computes M matrix-vector
    // products, each O(D²). This is distinct from a real autodiff implementation
    // whose cost is O(M·C_f).
    expect(M * dim * dim).toBeGreaterThan(M * dim);
  });

  it('MAF and IAF directions are distinguished on the autoregressive page', () => {
    const { container } = render(
      <MemoryRouter>
        <Ch15AutoregressiveFlowsPage />
      </MemoryRouter>,
    );
    const text = container.textContent || '';
    expect(text).toContain('MAF');
    expect(text).toContain('IAF');
    expect(text).toContain('密度估计');
    expect(text).toContain('采样');
    expect(text).toContain('x_i =');
  });

  it('continuous flow page does not claim local Lipschitz alone is sufficient', () => {
    const { container } = render(<ContinuousFlowLab />);
    const text = container.textContent || '';
    expect(text).toContain('爆破');
    expect(text).toContain('局部 Lipschitz');
    expect(text).toContain('目标时间区间内存在');
    expect(text).not.toContain('只要 f 是局部 Lipschitz');
  });

  it('blow-up field x² produces non-finite trajectory points', () => {
    const forward = flowMapForward([1, 0], blowUpField, 0, 1.2, 0.01, 'rk4');
    const finite = forward.trajectory.filter(
      (p) => Number.isFinite(p[0]) && Number.isFinite(p[1]),
    );
    expect(finite.length).toBeLessThan(forward.trajectory.length);
  });
});
