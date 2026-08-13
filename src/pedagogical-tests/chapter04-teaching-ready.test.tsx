import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MiniBatchGradientLab from '@/components/demos/MiniBatchGradientLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch04OverviewPage from '@/pages/generated/Ch04OverviewPage';
import Ch04ErrorSurfacesPage from '@/pages/generated/Ch04ErrorSurfacesPage';
import Ch04GradientDescentOptimizationPage from '@/pages/generated/Ch04GradientDescentOptimizationPage';
import Ch04ConvergencePage from '@/pages/generated/Ch04ConvergencePage';
import Ch04NormalizationPage from '@/pages/generated/Ch04NormalizationPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 4 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest
      .flatMap((part) => part.chapters)
      .find((item) => item.id === 'ch04');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice, a derivation, and textbook mapping on all content pages', () => {
    const pages = [
      <Ch04ErrorSurfacesPage key="surfaces" />,
      <Ch04GradientDescentOptimizationPage key="gradient" />,
      <Ch04ConvergencePage key="convergence" />,
      <Ch04NormalizationPage key="normalization" />,
    ];

    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步(推导|对比)/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the mini-batch experiment until a prediction is submitted', () => {
    render(<MiniBatchGradientLab />);
    expect(screen.queryByLabelText('mini-batch 梯度实验控制区')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: '缩小 10 倍' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('mini-batch 梯度实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes twelve exercises on the overview page', () => {
    render(
      <MemoryRouter>
        <Ch04OverviewPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('progressbar', { name: '第四章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/12 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成四节共 12 道原创练习/)).toBeTruthy();
  });
});
