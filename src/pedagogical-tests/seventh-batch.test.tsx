import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Ch01DecisionTheoryPage from '@/pages/generated/Ch01DecisionTheoryPage';
import Ch02DecisionTheoryPage from '@/pages/generated/Ch02DecisionTheoryPage';
import Ch02DiscriminativeClassifiersPage from '@/pages/generated/Ch02DiscriminativeClassifiersPage';
import Ch03MixtureDensityNetworksPage from '@/pages/generated/Ch03MixtureDensityNetworksPage';
import Ch06ModelAveragingPage from '@/pages/generated/Ch06ModelAveragingPage';
import Ch06ParameterSharingPage from '@/pages/generated/Ch06ParameterSharingPage';
import Ch04ConvergencePage from '@/pages/generated/Ch04ConvergencePage';

function renderWithRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('pedagogical invariants: seventh batch (Ch01-Ch09 foundational pages)', () => {
  it('Ch01 regression decision theory no longer contains false-positive/false-negative wording', () => {
    const { container } = renderWithRouter(<Ch01DecisionTheoryPage />);
    const text = container.textContent || '';
    expect(text).not.toContain('假阳性');
    expect(text).not.toContain('假阴性');
    expect(text).not.toContain('false positive');
    expect(text).not.toContain('false negative');
    expect(text).not.toContain('Delta=0.5');
  });

  it('Ch02 classification decision theory states the correct cost threshold', () => {
    const { container } = renderWithRouter(<Ch02DecisionTheoryPage />);
    const text = container.textContent || '';
    expect(text).toContain('C_FP/(C_FP+C_FN)');
    expect(text).toContain('cost-sensitive threshold');
  });

  it('Ch02 discriminative classifiers no longer claim probit is more robust due to thinner tails', () => {
    const { container } = renderWithRouter(<Ch02DiscriminativeClassifiersPage />);
    const text = container.textContent || '';
    expect(text).not.toContain('probit 对异常值比逻辑回归更鲁棒');
    expect(text).not.toContain('异常值的反传梯度更小');
    expect(text).toContain('不能仅凭概率尾部');
  });

  it('MDN page shows the normalized p(t=0) with 1/sqrt(2π)', () => {
    const { container } = renderWithRouter(<Ch03MixtureDensityNetworksPage />);
    const text = container.textContent || '';
    expect(text).toContain('1/√(2π');
    expect(text).not.toContain('介绍 Robot kinematics example 的定义');
  });

  it('ModelAveraging page includes correlation-aware ensemble variance formula', () => {
    const { container } = renderWithRouter(<Ch06ModelAveragingPage />);
    const text = container.textContent || '';
    expect(text).toContain('ρ + (1−ρ)/M');
    expect(text).toContain('近似模型平均');
    expect(text).toContain('ρ=0 ⇒ σ²/M');
    expect(text).toContain('ρ=1 ⇒ σ²');
  });

  it('ParameterSharing page distinguishes dense/conv/locally-connected parameter counts', () => {
    const { container } = renderWithRouter(<Ch06ParameterSharingPage />);
    const text = container.textContent || '';
    expect(text).toContain('Kh Kw Cin Cout + Cout');
    expect(text).toContain('Hout Wout Kh Kw Cin Cout');
    expect(text).toContain('Hin Win Cin Hout Wout Cout');
    expect(text).toContain('平移等变性');
  });

  it('Convergence page qualifies the 1/(1-μ) factor with constant-gradient condition', () => {
    const { container } = renderWithRouter(<Ch04ConvergencePage />);
    const text = container.textContent || '';
    expect(text).toContain('恒定梯度');
    expect(text).toContain('1/(1−μ)');
    expect(text).toContain('Classical momentum');
    expect(text).toContain('EMA momentum');
    expect(text).not.toContain('保证理论上收敛到局部极小值附近');
  });
});
