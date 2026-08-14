import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PolynomialRegressionDemo from '@/components/demos/PolynomialRegressionDemo';
import RegressionDecisionTheoryLab from '@/components/demos/RegressionDecisionTheoryLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch01OverviewPage from '@/pages/generated/Ch01OverviewPage';
import Ch01LinearRegressionPage from '@/pages/generated/Ch01LinearRegressionPage';
import Ch01DecisionTheoryPage from '@/pages/generated/Ch01DecisionTheoryPage';
import Ch01BiasVariancePage from '@/pages/generated/Ch01BiasVariancePage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('Bishop chapter 4 regression teaching-ready learning loop', () => {
  it('marks every route and the aggregate regression chapter as teaching-ready', () => {
    const chapter = courseManifest
      .flatMap((part) => part.chapters)
      .find((item) => item.id === 'ch01');
    expect(chapter).toBeTruthy();
    expect(chapter?.bishopChapter).toBe('Ch 4');
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice, four-step derivations, and textbook mapping on all content pages', () => {
    const pages = [
      [<Ch01LinearRegressionPage />, /pp\. 112–119/],
      [<Ch01DecisionTheoryPage />, /pp\. 120–122/],
      [<Ch01BiasVariancePage />, /pp\. 123–128/],
    ] as const;

    for (const [page, pageRange] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      expect(screen.getByText('1 / 4')).toBeTruthy();
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(pageRange).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the polynomial experiment until a complexity prediction is submitted', () => {
    render(<PolynomialRegressionDemo />);
    expect(screen.queryByLabelText('偏差方差实验区')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: /训练误差通常下降/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('偏差方差实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
  });

  it('gates the decision experiment until a loss-function prediction is submitted', () => {
    render(<RegressionDecisionTheoryLab />);
    expect(screen.queryByLabelText('回归决策实验区')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: /转向更稳健的中位数/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('回归决策实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
  });

  it('summarizes all nine original exercises on the overview page', () => {
    render(<MemoryRouter><Ch01OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '回归章节掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/9 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成三节共 9 道原创练习/)).toBeTruthy();
  });
});
