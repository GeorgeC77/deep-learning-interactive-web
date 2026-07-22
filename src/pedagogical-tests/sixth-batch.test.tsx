import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Ch15ContinuousFlowsPage from '../pages/generated/Ch15ContinuousFlowsPage';
import Ch16VariationalAutoencodersPage from '../pages/generated/Ch16VariationalAutoencodersPage';
import Ch17ScoreMatchingPage from '../pages/generated/Ch17ScoreMatchingPage';
import Ch17GuidedDiffusionPage from '../pages/generated/Ch17GuidedDiffusionPage';
import Ch14AdversarialTrainingPage from '../pages/generated/Ch14AdversarialTrainingPage';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

afterEach(() => {
  cleanup();
});

describe('pedagogical invariants: sixth batch (conceptual copy)', () => {
  it('CNF page does not say f itself must be invertible and explains flow map', () => {
    const { container } = renderWithRouter(<Ch15ContinuousFlowsPage />);
    const text = container.textContent || '';
    expect(text).not.toContain('f 仍需要可逆');
    expect(text).not.toContain('非可逆会破坏流的定义');
    expect(text).toContain('流映射');
    expect(text).toContain('f 本身不必');
    expect(text).toContain('FFJORD');
    expect(text).toContain('自由形式');
  });

  it('VAE page correctly explains β=1, β>1 and 0<β<1', () => {
    const { container } = renderWithRouter(<Ch16VariationalAutoencodersPage />);
    const text = container.textContent || '';
    expect(text).toContain('β=1');
    expect(text).toContain('β>1');
    expect(text).toContain('0<β<1');
    expect(text).toContain('故意修改目标函数');
    expect(text).toContain('不再保证是下界');
  });

  it('Score Matching page distinguishes conditional and marginal score', () => {
    const { container } = renderWithRouter(<Ch17ScoreMatchingPage />);
    const text = container.textContent || '';
    expect(text).toContain('条件腐蚀分数');
    expect(text).toContain('边缘噪声分数');
    expect(text).toContain('E[ε|z_t]');
    expect(text).toContain('随机训练目标');
  });

  it('Guided Diffusion page uses interpolation/extrapolation language and drops mode collapse', () => {
    const { container } = renderWithRouter(<Ch17GuidedDiffusionPage />);
    const text = container.textContent || '';
    expect(text).toContain('0≤w≤1');
    expect(text).toContain('插值');
    expect(text).toContain('w=1');
    expect(text).toContain('普通条件预测');
    expect(text).toContain('w>1');
    expect(text).toContain('外推');
    expect(text).not.toContain('模式坍塌');
    expect(text).toContain('降低多样性');
  });

  it('GAN page describes non-saturating loss via D(G(z))', () => {
    const { container } = renderWithRouter(<Ch14AdversarialTrainingPage />);
    const text = container.textContent || '';
    expect(text).toContain('非饱和损失');
    expect(text).toContain('D(G(z))');
    expect(text).toContain('non-saturating');
  });
});
