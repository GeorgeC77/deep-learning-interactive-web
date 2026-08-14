import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContinuousLatentChapterLab from '@/components/demos/ContinuousLatentChapterLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch13OverviewPage from '@/pages/generated/Ch13OverviewPage';
import Ch13PrincipalComponentAnalysisPage from '@/pages/generated/Ch13PrincipalComponentAnalysisPage';
import Ch13ProbabilisticLatentVariablesPage from '@/pages/generated/Ch13ProbabilisticLatentVariablesPage';
import Ch13EvidenceLowerBoundPage from '@/pages/generated/Ch13EvidenceLowerBoundPage';
import Ch13NonlinearLatentVariableModelsPage from '@/pages/generated/Ch13NonlinearLatentVariableModelsPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 13 continuous latent variables teaching-ready loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch13');
    expect(chapter).toBeTruthy();
    expect(chapter?.bishopChapter).toBe('Ch 16');
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, four-step derivations, and exact textbook ranges on all content pages', () => {
    const pages = [
      [<Ch13PrincipalComponentAnalysisPage />, /pp\. 497–505/],
      [<Ch13ProbabilisticLatentVariablesPage />, /pp\. 506–515/],
      [<Ch13EvidenceLowerBoundPage />, /pp\. 516–521/],
      [<Ch13NonlinearLatentVariableModelsPage />, /pp\. 522–527/],
    ] as const;

    for (const [page, range] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      expect(screen.getByText('1 / 4')).toBeTruthy();
      expect(screen.getAllByText(range).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it.each([
    ['pca', '被丢弃的 D−M 个特征值之和', 'PCA 方差实验区'],
    ['probabilistic', 'Cov(x₁,x₂) 不变，但 |Corr(x₁,x₂)| 下降', '因子分析协方差实验区'],
    ['elbo', '后验均值向 0 收缩，后验方差增大', 'PPCA 后验收缩实验区'],
    ['nonlinear', 'Normalizing Flow', '四类生成方法权衡实验区'],
  ] as const)('gates the %s lab until a prediction is submitted', (mode, answer, region) => {
    render(<ContinuousLatentChapterLab mode={mode} />);
    expect(screen.queryByLabelText(region)).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: answer }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText(region)).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
  });

  it('summarizes twelve exercises and the full chapter range on the overview', () => {
    render(<MemoryRouter><Ch13OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '连续隐变量掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/12 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成四节共 12 道原创练习/)).toBeTruthy();
    expect(screen.getAllByText(/pp\. 495–532/).length).toBeGreaterThan(0);
  });

  it('corrects the textbook model family list to include diffusion, not autoregressive models', () => {
    render(<MemoryRouter><Ch13NonlinearLatentVariableModelsPage /></MemoryRouter>);
    expect(screen.getAllByText(/Diffusion/).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain('Autoregressive models');
  });
});
