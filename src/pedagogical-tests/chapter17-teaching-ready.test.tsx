import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DiffusionTimelineLab from '@/components/demos/DiffusionTimelineLab';
import ScoreMatchingLab from '@/components/demos/ScoreMatchingLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch17OverviewPage from '@/pages/generated/Ch17OverviewPage';
import Ch17ForwardEncoderPage from '@/pages/generated/Ch17ForwardEncoderPage';
import Ch17ReverseDecoderPage from '@/pages/generated/Ch17ReverseDecoderPage';
import Ch17ScoreMatchingPage from '@/pages/generated/Ch17ScoreMatchingPage';
import Ch17GuidedDiffusionPage from '@/pages/generated/Ch17GuidedDiffusionPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 17 diffusion models teaching-ready loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch17');
    expect(chapter).toBeTruthy();
    expect(chapter?.bishopChapter).toBe('Ch 20');
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, four-step derivations, and exact textbook ranges on all content pages', () => {
    const pages = [
      [<Ch17ForwardEncoderPage />, /pp\. 582–585/],
      [<Ch17ReverseDecoderPage />, /pp\. 585–594/],
      [<Ch17ScoreMatchingPage />, /pp\. 594–599/],
      [<Ch17GuidedDiffusionPage />, /pp\. 599–603/],
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

  it('makes the closed and incremental forward processes comparable as distributions', () => {
    render(<DiffusionTimelineLab />);
    fireEvent.click(screen.getByRole('button', { name: '条件分布一致性' }));
    expect(screen.getByText(/固定单个 z₀/)).toBeTruthy();
    expect(screen.getByText(/same distribution, not same realization/)).toBeTruthy();
    expect(screen.getByText('mean err 闭式')).toBeTruthy();
    expect(screen.getByText('cov err 增量')).toBeTruthy();
  });

  it('requires a prediction before distinguishing a sampled epsilon from the marginal score', () => {
    render(<ScoreMatchingLab />);
    expect(screen.queryByText(/神经网络的 MSE 目标/)).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '否' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    fireEvent.click(screen.getByRole('button', { name: '✨ 揭晓答案' }));
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText(/神经网络的 MSE 目标/)).toBeTruthy();
    expect(screen.getAllByText(/条件期望/).length).toBeGreaterThan(0);
  });

  it('summarizes twelve exercises and the complete chapter range on the overview', () => {
    render(<MemoryRouter><Ch17OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '扩散模型掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/12 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成四节共 12 道原创练习/)).toBeTruthy();
    expect(screen.getAllByText(/pp\. 581–608/).length).toBeGreaterThan(0);
  });

  it('states the simplified-noise-loss and guidance extrapolation boundaries explicitly', () => {
    const reverse = render(<MemoryRouter><Ch17ReverseDecoderPage /></MemoryRouter>);
    expect(screen.getAllByText(/输入 z_t 并非始终为标准高斯/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/不再逐项等于原.*ELBO/).length).toBeGreaterThan(0);
    reverse.unmount();

    render(<MemoryRouter><Ch17GuidedDiffusionPage /></MemoryRouter>);
    expect(screen.getAllByText(/w>1.*外推/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/牺牲.*多样性/).length).toBeGreaterThan(0);
  });

  it('maps the four score-matching leaf sections one-to-one onto concept cards', () => {
    render(<MemoryRouter><Ch17ScoreMatchingPage /></MemoryRouter>);
    for (const title of [
      '20.3.1 分数损失函数',
      '20.3.2 修正后的分数损失',
      '20.3.3 噪声方差',
      '20.3.4 随机微分方程',
    ]) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }
  });
});
