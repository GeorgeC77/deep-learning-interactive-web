import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ImportanceSamplingDemo from '@/components/demos/ImportanceSamplingDemo';
import LangevinSamplingLab from '@/components/demos/LangevinSamplingLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch11OverviewPage from '@/pages/generated/Ch11OverviewPage';
import Ch11BasicSamplingAlgorithmsPage from '@/pages/generated/Ch11BasicSamplingAlgorithmsPage';
import Ch11MarkovChainMonteCarloPage from '@/pages/generated/Ch11MarkovChainMonteCarloPage';
import Ch11LangevinSamplingPage from '@/pages/generated/Ch11LangevinSamplingPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 11 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch11');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice and worked derivations on all three content pages', () => {
    const pages = [
      <Ch11BasicSamplingAlgorithmsPage />,
      <Ch11MarkovChainMonteCarloPage />,
      <Ch11LangevinSamplingPage />,
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
      [<Ch11BasicSamplingAlgorithmsPage />, /pp\. 430/],
      [<Ch11MarkovChainMonteCarloPage />, /pp\. 440/],
      [<Ch11LangevinSamplingPage />, /pp\. 451/],
    ] as const;
    for (const [page, pagePattern] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getAllByText(pagePattern).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the importance sampling lab until an ESS prediction is submitted', () => {
    render(<ImportanceSamplingDemo />);
    expect(screen.queryByLabelText('重要性采样实验控制区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'ESS 显著下降，少数权重占主导' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('重要性采样实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes nine exercises on the overview', () => {
    render(<MemoryRouter><Ch11OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '第十一章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/9 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成三节共 9 道原创练习/)).toBeTruthy();
  });

  it('keeps every Langevin trajectory point inside the plot area', () => {
    render(<LangevinSamplingLab />);
    const points = screen.getByLabelText('Langevin 样本轨迹').getAttribute('points') ?? '';
    const coordinates = points.split(' ').map((point) => point.split(',').map(Number));
    expect(coordinates.length).toBeGreaterThan(100);
    for (const [x, y] of coordinates) {
      expect(x).toBeGreaterThanOrEqual(50);
      expect(x).toBeLessThanOrEqual(550);
      expect(y).toBeGreaterThanOrEqual(10);
      expect(y).toBeLessThanOrEqual(200);
    }
  });
});
