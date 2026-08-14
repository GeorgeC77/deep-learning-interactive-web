import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GANGradientLab from '@/components/demos/GANGradientLab';
import CycleGANTradeoffLab from '@/components/demos/CycleGANTradeoffLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch14OverviewPage from '@/pages/generated/Ch14OverviewPage';
import Ch14AdversarialTrainingPage from '@/pages/generated/Ch14AdversarialTrainingPage';
import Ch14ImageGansPage from '@/pages/generated/Ch14ImageGansPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 14 generative adversarial networks teaching-ready loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch14');
    expect(chapter).toBeTruthy();
    expect(chapter?.bishopChapter).toBe('Ch 17');
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, four-step derivations, and exact textbook ranges on both content pages', () => {
    const pages = [
      [<Ch14AdversarialTrainingPage />, /pp\. 534–538/],
      [<Ch14ImageGansPage />, /pp\. 539–543/],
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

  it('keeps the non-saturating gradient explanation behind a prediction gate', () => {
    render(<GANGradientLab />);
    expect(screen.queryByText(/生成器几乎学不到信号/)).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'non-saturating' }));
    fireEvent.click(screen.getAllByRole('button', { name: '提交预测' })[0]);
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText(/生成器几乎学不到信号/)).toBeTruthy();
  });

  it('gates the CycleGAN weight experiment until the candidate prediction is submitted', () => {
    render(<CycleGANTradeoffLab />);
    expect(screen.queryByLabelText('CycleGAN 损失权衡实验区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '可逆捷径映射' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('CycleGAN 损失权衡实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
  });

  it('summarizes six exercises and the full chapter range on the overview', () => {
    render(<MemoryRouter><Ch14OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '生成对抗网络掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/6 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成两节共 6 道原创练习/)).toBeTruthy();
    expect(screen.getAllByText(/pp\. 533–545/).length).toBeGreaterThan(0);
  });

  it('states the semantic limit of cycle consistency explicitly', () => {
    render(<MemoryRouter><Ch14ImageGansPage /></MemoryRouter>);
    expect(screen.getAllByText(/不保证语义正确/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('radio', { name: '可逆捷径映射' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByText(/循环一致性保证“能回来”，不保证“翻译对了”/)).toBeTruthy();
  });
});
