import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GaussianMixtureLab from '@/components/demos/GaussianMixtureLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch12OverviewPage from '@/pages/generated/Ch12OverviewPage';
import Ch12KMeansClusteringPage from '@/pages/generated/Ch12KMeansClusteringPage';
import Ch12MixturesOfGaussiansPage from '@/pages/generated/Ch12MixturesOfGaussiansPage';
import Ch12ExpectationMaximizationPage from '@/pages/generated/Ch12ExpectationMaximizationPage';
import Ch12EvidenceLowerBoundPage from '@/pages/generated/Ch12EvidenceLowerBoundPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 12 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch12');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice and worked derivations on all four content pages', () => {
    const pages = [
      <Ch12KMeansClusteringPage />,
      <Ch12MixturesOfGaussiansPage />,
      <Ch12ExpectationMaximizationPage />,
      <Ch12EvidenceLowerBoundPage />,
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
      [<Ch12KMeansClusteringPage />, /pp\. 460/],
      [<Ch12MixturesOfGaussiansPage />, /pp\. 466/],
      [<Ch12ExpectationMaximizationPage />, /pp\. 474/],
      [<Ch12EvidenceLowerBoundPage />, /pp\. 485/],
    ] as const;
    for (const [page, pattern] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getAllByText(pattern).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates GMM responsibilities until a component prediction is submitted', () => {
    render(<GaussianMixtureLab />);
    expect(screen.queryByText(/责任度之和为/)).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '分量 1 的责任度更大' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByText(/责任度之和为/)).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback')).toBeTruthy();
  });

  it('summarizes twelve exercises on the overview', () => {
    render(<MemoryRouter><Ch12OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '第十二章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/12 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成四节共 12 道原创练习/)).toBeTruthy();
  });

  it('keeps the GMM lab responsibility calculation normalized', () => {
    render(<GaussianMixtureLab />);
    fireEvent.click(screen.getByRole('radio', { name: '分量 2 的责任度更大' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByText('责任度之和为 1.000000。改变标签编号不会改变混合密度，这正是 GMM 的标签不可识别性。')).toBeTruthy();
  });
});
