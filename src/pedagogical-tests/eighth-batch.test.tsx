import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Ch08ConditionalIndependencePage from '@/pages/generated/Ch08ConditionalIndependencePage';
import Ch08GraphicalModelsPage from '@/pages/generated/Ch08GraphicalModelsPage';
import Ch10GeneralGraphNetworksPage from '@/pages/generated/Ch10GeneralGraphNetworksPage';
import Ch11LangevinSamplingPage from '@/pages/generated/Ch11LangevinSamplingPage';
import Ch13PrincipalComponentAnalysisPage from '@/pages/generated/Ch13PrincipalComponentAnalysisPage';
import Ch04NormalizationPage from '@/pages/generated/Ch04NormalizationPage';
import Ch06ResidualConnectionsPage from '@/pages/generated/Ch06ResidualConnectionsPage';
import KMeansPage from '@/pages/chapters/chapter10/KMeansPage';

function renderWithRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('pedagogical invariants: eighth batch (conditional independence / factorization / GAT / Langevin / PCA / K-means / normalization / residual)', () => {
  it('Ch08 conditional independence page covers chain, fork, collider and descendant rule', () => {
    const { container } = renderWithRouter(<Ch08ConditionalIndependencePage />);
    const text = container.textContent || '';
    expect(text).toContain('链式结构');
    expect(text).toContain('分岔结构');
    expect(text).toContain('汇聚结构');
    expect(text).toContain('解释消除');
    expect(text).toContain('d-分离判定规则');
    expect(text).toContain('子孙');
    expect(text).not.toContain('介绍 Three example graphs 的定义');
  });

  it('Ch08 graphical models page uses general DAG factorization, not only chain factorization', () => {
    const { container } = renderWithRouter(<Ch08GraphicalModelsPage />);
    const text = container.textContent || '';
    expect(text).toContain('p(x)');
    expect(text).toContain('不仅限于链式结构');
    expect(text).not.toContain('链式联合分布分解');
    expect(text).not.toContain('介绍 Factorization 的定义');
  });

  it('Ch10 GAT page normalizes attention scores around the center node v', () => {
    const { container } = renderWithRouter(<Ch10GeneralGraphNetworksPage />);
    const text = container.textContent || '';
    expect(text).toContain('中心节点 v');
    expect(text).toContain('softmax 归一化');
    expect(text).not.toContain('介绍 Graph attention networks 的定义');
  });

  it('Ch11 Langevin page qualifies approximate sampling and convergence assumptions', () => {
    const { container } = renderWithRouter(<Ch11LangevinSamplingPage />);
    const text = container.textContent || '';
    expect(text).not.toContain('最终覆盖整个目标分布');
    expect(text).toContain('近似');
    expect(text).toContain('正则性假设');
    expect(text).toContain('Euler–Maruyama');
  });

  it('Ch13 PCA page frames PCA as maximizing variance, not sample discriminability', () => {
    const { container } = renderWithRouter(<Ch13PrincipalComponentAnalysisPage />);
    const text = container.textContent || '';
    expect(text).toContain('方差最大');
    expect(text).not.toContain('最能区分样本');
    expect(text).not.toContain('最大样本区分度');
  });

  it('K-means page uses assign-then-update order and convergence detection', () => {
    const { container } = renderWithRouter(<KMeansPage />);
    const text = container.textContent || '';
    expect(text).toContain('分配样本到最近质心');
    expect(text).toContain('更新质心为簇内均值');
    expect(text).toMatch(/[已未]收敛/);
  });

  it('Ch04 normalization page qualifies effects and uses the new NormalizationLab', () => {
    const { container } = renderWithRouter(<Ch04NormalizationPage />);
    const text = container.textContent || '';
    expect(text).toContain('效果依赖网络结构');
    expect(text).toContain('移动统计量');
    expect(text).toContain('BatchNorm');
    expect(text).toContain('LayerNorm');
    expect(text).not.toContain('标准化后的取值');
  });

  it('Ch06 residual connections page includes residual Jacobian and removes the 0.9^L toy demo', () => {
    const { container } = renderWithRouter(<Ch06ResidualConnectionsPage />);
    const text = container.textContent || '';
    expect(text).toContain('残差 Jacobian');
    expect(text).toContain('I +');
    expect(text).toContain('∂F/∂x');
    expect(text).not.toContain('0.9^L');
    expect(text).not.toContain('普通梯度');
  });
});
