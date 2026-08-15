import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppendixFoundationsLab from '@/components/demos/AppendixFoundationsLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import AppendixAOverviewPage from '@/pages/generated/AppendixAOverviewPage';
import AppendixBOverviewPage from '@/pages/generated/AppendixBOverviewPage';
import AppendixCOverviewPage from '@/pages/generated/AppendixCOverviewPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('appendices A–C teaching-ready learning loops', () => {
  it('marks every appendix route and aggregate chapter as teaching-ready', () => {
    const chapters = courseManifest
      .flatMap((part) => part.chapters)
      .filter((chapter) => ['appendix-a', 'appendix-b', 'appendix-c'].includes(chapter.id));

    expect(chapters).toHaveLength(3);
    for (const chapter of chapters) {
      expect(chapter.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
      expect(getChapterStatus(chapter)).toBe('teaching-ready');
    }
  });

  it('provides practice, four-step derivations, and exact textbook ranges on all appendix pages', () => {
    const pages = [
      [<AppendixAOverviewPage />, /pp\. 609–615/],
      [<AppendixBOverviewPage />, /pp\. 617–619/],
      [<AppendixCOverviewPage />, /pp\. 621–624/],
    ] as const;

    for (const [page, range] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      expect(screen.getByText('1 / 4')).toBeTruthy();
      expect(screen.getAllByText(range).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('requires a prediction before exposing the trace counterexample', () => {
    render(<AppendixFoundationsLab appendix="a" />);
    expect(screen.queryByLabelText('迹循环置换实验区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '否，只有循环置换恒保持' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('迹循环置换实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText(/Tr\(ABC\)=Tr\(BCA\)=Tr\(CAB\)=3\.00/)).toBeTruthy();
    expect(screen.getByText(/Tr\(BAC\)=5\.00/)).toBeTruthy();
  });

  it('makes the fixed-boundary assumption observable before the variational residual', () => {
    render(<AppendixFoundationsLab appendix="b" />);
    expect(screen.queryByLabelText('Euler-Lagrange 残差实验区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'η 在边界必须为 0' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('Euler-Lagrange 残差实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText('残差为零：该候选满足微分方程。')).toBeTruthy();
  });

  it('checks the textbook constrained optimum along the feasible line', () => {
    render(<AppendixFoundationsLab appendix="c" />);
    expect(screen.queryByLabelText('拉格朗日约束实验区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '(x₁,x₂)=(1/2,1/2)' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('拉格朗日约束实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText(/x₁=0\.50，x₂=0\.50/)).toBeTruthy();
    expect(screen.getByText('0.500')).toBeTruthy();
  });

  it('maps all four numbered linear-algebra sections one-to-one onto concept cards', () => {
    render(<MemoryRouter><AppendixAOverviewPage /></MemoryRouter>);
    for (const title of ['A.1 矩阵恒等式', 'A.2 迹与行列式', 'A.3 矩阵导数', 'A.4 特征向量']) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }
  });

  it('states the boundary and multiplier sign conventions explicitly', () => {
    const appendixB = render(<MemoryRouter><AppendixBOverviewPage /></MemoryRouter>);
    expect(screen.getAllByText(/固定端点时 η 才在边界为零/).length).toBeGreaterThan(0);
    appendixB.unmount();

    render(<MemoryRouter><AppendixCOverviewPage /></MemoryRouter>);
    expect(screen.getAllByText(/等式约束的 λ 必须非负.*λ 没有固定符号/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/互补松弛 λg=0.*至少一个为零/).length).toBeGreaterThan(0);
  });
});
