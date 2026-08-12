import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ExercisePanel from '@/components/ExercisePanel';
import ChapterProgressCard from '@/components/ChapterProgressCard';
import PrerequisiteChapter01OverviewPage from '@/pages/prerequisite/chapter01/OverviewPage';
import PrerequisiteChapter01ImpactPage from '@/pages/prerequisite/chapter01/impact';
import PrerequisiteChapter01TutorialPage from '@/pages/prerequisite/chapter01/tutorial';
import PrerequisiteChapter01HistoryPage from '@/pages/prerequisite/chapter01/history';
import { chapter01ImpactExercises } from '@/course/chapter01Exercises';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 1 teaching-ready learning loop', () => {
  it('requires a prediction before revealing the impact experiment', () => {
    render(<PrerequisiteChapter01ImpactPage />);
    expect(screen.queryByLabelText('模型容量')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: /训练表现继续提高/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('模型容量')).toBeTruthy();
    expect(screen.getByLabelText('数据覆盖')).toBeTruthy();
    expect(screen.getByText(/概念模型，不是经验缩放定律/)).toBeTruthy();
  });

  it('persists mastered exercises only after a correct answer', () => {
    render(
      <ExercisePanel
        exerciseSetId="chapter01-impact"
        exercises={[chapter01ImpactExercises[0]]}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /无监督学习/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交答案' }));
    expect(screen.getByText('还差一步')).toBeTruthy();
    const incorrectProgress = JSON.parse(
      window.localStorage.getItem('deep-learning-course:exercise:chapter01-impact') ?? '{}',
    ) as { masteredExerciseIds?: string[]; attempts?: Record<string, number> };
    expect(incorrectProgress.masteredExerciseIds).toEqual([]);
    expect(incorrectProgress.attempts?.['impact-supervision']).toBe(1);

    fireEvent.click(screen.getByRole('button', { name: /再试一次/ }));
    fireEvent.click(screen.getByRole('radio', { name: /监督学习：输入和目标标签/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交答案' }));
    expect(screen.getByText('本节已掌握')).toBeTruthy();
    expect(window.localStorage.getItem('deep-learning-course:exercise:chapter01-impact')).toMatch(
      /impact-supervision/,
    );
  });

  it('renders textbook-specific objectives and active learning on all chapter pages', () => {
    const pages = [
      <PrerequisiteChapter01OverviewPage key="overview" />,
      <PrerequisiteChapter01ImpactPage key="impact" />,
      <PrerequisiteChapter01TutorialPage key="tutorial" />,
      <PrerequisiteChapter01HistoryPage key="history" />,
    ];

    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      const text = document.body.textContent ?? '';
      expect(text).toMatch(/教材映射/);
      expect(text).toMatch(/学习目标/);
      expect(text).not.toMatch(/理解 (Overview|Impact|Tutorial|History) 的核心概念/);
      unmount();
    }
  });

  it('summarizes stored section mastery on the overview card', () => {
    window.localStorage.setItem(
      'deep-learning-course:exercise:chapter01-impact',
      JSON.stringify({
        masteredExerciseIds: ['a', 'b', 'c'],
        attempts: {},
      }),
    );
    render(
      <MemoryRouter>
        <ChapterProgressCard
          title="第一章掌握进度"
          sections={[
            {
              exerciseSetId: 'chapter01-impact',
              label: '1.1 深度学习的影响',
              path: '/impact',
              exerciseCount: 3,
            },
          ]}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('3/3 · 100%')).toBeTruthy();
    expect(screen.getByText('已掌握 3/3 题')).toBeTruthy();
  });
});
