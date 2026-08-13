import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SequenceModelsLab from '@/components/demos/SequenceModelsLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch08OverviewPage from '@/pages/generated/Ch08OverviewPage';
import Ch08GraphicalModelsPage from '@/pages/generated/Ch08GraphicalModelsPage';
import Ch08ConditionalIndependencePage from '@/pages/generated/Ch08ConditionalIndependencePage';
import Ch08SequenceModelsPage from '@/pages/generated/Ch08SequenceModelsPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 8 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch08');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, derivation, and exact textbook mapping on all content pages', () => {
    const pages = [
      <Ch08GraphicalModelsPage />,
      <Ch08ConditionalIndependencePage />,
      <Ch08SequenceModelsPage />,
    ];
    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/pp\. (326|337|349)/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the hidden-state filtering experiment until a prediction is submitted', () => {
    render(<SequenceModelsLab />);
    expect(screen.queryByLabelText('隐状态序列过滤实验控制区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '隐状态序列 z₁,z₂,…' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('隐状态序列过滤实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes nine exercises on the overview', () => {
    render(<MemoryRouter><Ch08OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '第八章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/9 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成三节共 9 道原创练习/)).toBeTruthy();
  });
});
