import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AttentionMatrixVsOutputLab from '@/components/demos/AttentionMatrixVsOutputLab';
import AttentionScalingLab from '@/components/demos/AttentionScalingLab';
import ResidualIdentityPathLab from '@/components/demos/ResidualIdentityPathLab';
import PCAReconstructionLab from '@/components/demos/PCAReconstructionLab';
import FeatureHierarchyLab from '@/components/demos/FeatureHierarchyLab';
import EmbeddingGeometryLab from '@/components/demos/EmbeddingGeometryLab';
import Ch13PrincipalComponentAnalysisPage from '@/pages/generated/Ch13PrincipalComponentAnalysisPage';
import Ch06ResidualConnectionsPage from '@/pages/generated/Ch06ResidualConnectionsPage';

afterEach(() => cleanup());

describe('pedagogical quality: tenth batch (Why? / counterexample / new labs)', () => {
  it('AttentionMatrixVsOutputLab distinguishes attention matrix from output', () => {
    render(<AttentionMatrixVsOutputLab />);
    expect(screen.getByText(/Attention Matrix 决定/)).toBeTruthy();
    // Experiment 1 default: fixed Q,K -> heatmap identical, output changes.
    expect(screen.getByText(/Attention Heatmap 完全一样/)).toBeTruthy();
    // Switch to experiment 2: fixed V, change Q,K -> matrix changes.
    fireEvent.click(screen.getByRole('button', { name: /固定 V，只改 Q、K/ }));
    expect(screen.getByText(/Attention Matrix 改变了/)).toBeTruthy();
  });

  it('AttentionScalingLab shows variance stays ~1 after sqrt(d) scaling', () => {
    render(<AttentionScalingLab />);
    expect(screen.getByText(/为什么要除以 √d/)).toBeTruthy();
    expect(screen.getByText(/q·k \/ √d（缩放）/)).toBeTruthy();
    expect(screen.getByText(/q·k \/ d（除太多）/)).toBeTruthy();
    expect(screen.getByText(/Var\(q·k\) = d/)).toBeTruthy();
  });

  it('ResidualIdentityPathLab conveys identity mapping fallback', () => {
    render(<ResidualIdentityPathLab />);
    expect(screen.getByText(/Identity Path/)).toBeTruthy();
    expect(screen.getByText(/Residual Branch 强度/)).toBeTruthy();
    expect(screen.getByText(/最坏情况下还能学习 Identity Mapping/)).toBeTruthy();
  });

  it('PCAReconstructionLab shows reconstruction error and discarded eigenvalues', () => {
    render(<PCAReconstructionLab />);
    expect(screen.getAllByText(/Reconstruction Error/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Discarded Eigenvalues/)).toBeTruthy();
    expect(screen.getByText(/Min Reconstruction Error/)).toBeTruthy();
    expect(screen.getByText(/保留维度 k/)).toBeTruthy();
  });

  it('FeatureHierarchyLab labels shallow vs deep abstraction', () => {
    render(<FeatureHierarchyLab />);
    expect(screen.getByText(/为什么越深越抽象/)).toBeTruthy();
    expect(screen.getAllByText(/Edges/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Semantic Regions/).length).toBeGreaterThan(0);
    expect(screen.getByText(/逐层组合/)).toBeTruthy();
  });

  it('EmbeddingGeometryLab shows geometry metrics', () => {
    render(<EmbeddingGeometryLab />);
    expect(screen.getAllByText(/几何空间/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Cosine Similarity/)).toBeTruthy();
    expect(screen.getByText(/Euclidean Distance/)).toBeTruthy();
    expect(screen.getByText(/Dot Product/)).toBeTruthy();
    // Switch to dissimilar pair.
    fireEvent.click(screen.getByRole('button', { name: /Apple ↔ Car/ }));
    expect(screen.getByText(/语义无关/)).toBeTruthy();
  });

  it('PCA page renders Why? cards and counterexamples', () => {
    render(
      <MemoryRouter>
        <Ch13PrincipalComponentAnalysisPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/为什么？/);
    expect(text).toMatch(/为什么最大方差意味着最小重构误差/);
    expect(text).toMatch(/反例/);
    expect(text).toMatch(/最大方差方向不一定是最佳分类方向/);
  });

  it('Residual page renders Why? cards and counterexamples', () => {
    render(
      <MemoryRouter>
        <Ch06ResidualConnectionsPage />
      </MemoryRouter>,
    );
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/为什么 Identity 能帮助训练/);
    expect(text).toMatch(/残差分支学到 F≈-x/);
  });
});
