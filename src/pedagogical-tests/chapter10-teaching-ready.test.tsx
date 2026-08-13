import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GraphPermutationLab from '@/components/demos/GraphPermutationLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch10OverviewPage from '@/pages/generated/Ch10OverviewPage';
import Ch10MachineLearningOnGraphsPage from '@/pages/generated/Ch10MachineLearningOnGraphsPage';
import Ch10NeuralMessagePassingPage from '@/pages/generated/Ch10NeuralMessagePassingPage';
import Ch10GeneralGraphNetworksPage from '@/pages/generated/Ch10GeneralGraphNetworksPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 10 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch10');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice and worked derivations on all three content pages', () => {
    const pages = [
      <Ch10MachineLearningOnGraphsPage />,
      <Ch10NeuralMessagePassingPage />,
      <Ch10GeneralGraphNetworksPage />,
    ];
    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('shows exact textbook page ranges across all content pages', () => {
    const pages = [
      [<Ch10MachineLearningOnGraphsPage />, /pp\. 409/],
      [<Ch10NeuralMessagePassingPage />, /pp\. 412/],
      [<Ch10GeneralGraphNetworksPage />, /pp\. 420/],
    ] as const;
    for (const [page, pagePattern] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getAllByText(pagePattern).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the graph relabelling experiment until a prediction is submitted', () => {
    render(<GraphPermutationLab />);
    expect(screen.queryByLabelText('图置换实验控制区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '度数向量按同一置换重排，边数不变' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('图置换实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes nine exercises on the overview', () => {
    render(<MemoryRouter><Ch10OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '第十章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/9 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成三节共 9 道原创练习/)).toBeTruthy();
  });
});
