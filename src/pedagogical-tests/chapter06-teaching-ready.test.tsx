import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LearningCurvesLab from '@/components/demos/LearningCurvesLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch06OverviewPage from '@/pages/generated/Ch06OverviewPage';
import Ch06InductiveBiasPage from '@/pages/generated/Ch06InductiveBiasPage';
import Ch06WeightDecayPage from '@/pages/generated/Ch06WeightDecayPage';
import Ch06LearningCurvesPage from '@/pages/generated/Ch06LearningCurvesPage';
import Ch06ParameterSharingPage from '@/pages/generated/Ch06ParameterSharingPage';
import Ch06ResidualConnectionsPage from '@/pages/generated/Ch06ResidualConnectionsPage';
import Ch06ModelAveragingPage from '@/pages/generated/Ch06ModelAveragingPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 6 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch06');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, derivation, and textbook mapping on all six content pages', () => {
    const pages = [<Ch06InductiveBiasPage/>,<Ch06WeightDecayPage/>,<Ch06LearningCurvesPage/>,<Ch06ParameterSharingPage/>,<Ch06ResidualConnectionsPage/>,<Ch06ModelAveragingPage/>];
    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步(推导|对比)/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the early-stopping experiment until a prediction is submitted', () => {
    render(<LearningCurvesLab/>);
    expect(screen.queryByLabelText('学习曲线与早停实验控制区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '验证误差最低时的 checkpoint' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('学习曲线与早停实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes eighteen exercises on the overview', () => {
    render(<MemoryRouter><Ch06OverviewPage/></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '第六章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/18 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成六节共 18 道原创练习/)).toBeTruthy();
  });
});
