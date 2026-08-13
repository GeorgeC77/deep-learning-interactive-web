import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Ch02OverviewPage from '@/pages/generated/Ch02OverviewPage';
import Ch02DiscriminantFunctionsPage from '@/pages/generated/Ch02DiscriminantFunctionsPage';
import Ch02DecisionTheoryPage from '@/pages/generated/Ch02DecisionTheoryPage';
import Ch02GenerativeClassifiersPage from '@/pages/generated/Ch02GenerativeClassifiersPage';
import Ch02DiscriminativeClassifiersPage from '@/pages/generated/Ch02DiscriminativeClassifiersPage';
import GaussianClassifierLab from '@/components/demos/GaussianClassifierLab';
import { getChapterStatus, courseManifest } from '@/course/manifest';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 2 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest
      .flatMap((part) => part.chapters)
      .find((item) => item.id === 'ch02');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('shows all four exercise sets and derivations across content pages', () => {
    const pages = [
      <Ch02DiscriminantFunctionsPage key="discriminant" />,
      <Ch02DecisionTheoryPage key="decision" />,
      <Ch02GenerativeClassifiersPage key="generative" />,
      <Ch02DiscriminativeClassifiersPage key="discriminative" />,
    ];

    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the Gaussian experiment until a prediction is submitted', () => {
    render(<GaussianClassifierLab />);
    expect(screen.queryByLabelText('高斯分类器实验控制区')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: /向左移动/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('高斯分类器实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes twelve exercises on the overview page', () => {
    render(
      <MemoryRouter>
        <Ch02OverviewPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('progressbar', { name: '第二章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/12 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成四节共 12 道原创练习/)).toBeTruthy();
  });
});
