import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AutodiffModeLab from '@/components/demos/AutodiffModeLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch05OverviewPage from '@/pages/generated/Ch05OverviewPage';
import Ch05EvaluationOfGradientsPage from '@/pages/generated/Ch05EvaluationOfGradientsPage';
import Ch05AutomaticDifferentiationPage from '@/pages/generated/Ch05AutomaticDifferentiationPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 5 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest
      .flatMap((part) => part.chapters)
      .find((item) => item.id === 'ch05');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice, a derivation, and exact textbook mapping on both content pages', () => {
    const pages = [
      <Ch05EvaluationOfGradientsPage key="gradient" />,
      <Ch05AutomaticDifferentiationPage key="autodiff" />,
    ];

    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步(推导|对比)/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the autodiff cost experiment until a prediction is submitted', () => {
    render(<AutodiffModeLab />);
    expect(screen.queryByLabelText('自动微分模式实验控制区')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: '反向模式' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('自动微分模式实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes six exercises and the chapter distinctions on the overview', () => {
    render(
      <MemoryRouter>
        <Ch05OverviewPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('progressbar', { name: '第五章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/6 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成两节共 6 道原创练习/)).toBeTruthy();
    expect(screen.getByText('先区分三件事')).toBeTruthy();
  });
});
