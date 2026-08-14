import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContinuousFlowLab from '@/components/demos/ContinuousFlowLab';
import DiscreteFlowChapterLab from '@/components/demos/DiscreteFlowChapterLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch15OverviewPage from '@/pages/generated/Ch15OverviewPage';
import Ch15AutoregressiveFlowsPage from '@/pages/generated/Ch15AutoregressiveFlowsPage';
import Ch15ContinuousFlowsPage from '@/pages/generated/Ch15ContinuousFlowsPage';
import Ch15CouplingFlowsPage from '@/pages/generated/Ch15CouplingFlowsPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 15 normalizing flows teaching-ready loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch15');
    expect(chapter).toBeTruthy();
    expect(chapter?.bishopChapter).toBe('Ch 18');
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, four-step derivations, and exact textbook ranges on all content pages', () => {
    const pages = [
      [<Ch15CouplingFlowsPage />, /pp\. 549–552/],
      [<Ch15AutoregressiveFlowsPage />, /pp\. 552–554/],
      [<Ch15ContinuousFlowsPage />, /pp\. 554–558/],
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

  it('gates the affine-coupling experiment and verifies the inverse calculation', () => {
    render(<DiscreteFlowChapterLab mode="coupling" />);
    expect(screen.queryByLabelText('仿射耦合可逆实验区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '恢复 z_B=2' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('仿射耦合可逆实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText('2.000')).toBeTruthy();
  });

  it('gates the MAF/IAF direction experiment and exposes the dependency reversal', () => {
    render(<DiscreteFlowChapterLab mode="autoregressive" />);
    expect(screen.queryByLabelText('MAF 与 IAF 方向实验区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'MAF：逆变换与密度评估' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('MAF 与 IAF 方向实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText('1 个依赖阶段')).toBeTruthy();
    expect(screen.getByText('8 个依赖阶段')).toBeTruthy();
  });

  it('requires an explicit prediction before revealing the continuous-flow boundary', () => {
    render(<ContinuousFlowLab />);
    expect(screen.queryByText(/答案：不一定/)).toBeNull();
    fireEvent.change(screen.getByPlaceholderText('写下你的预测或直觉...'), { target: { value: '不一定' } });
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    fireEvent.click(screen.getByRole('button', { name: '✨ 揭晓答案' }));
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText(/答案：不一定/)).toBeTruthy();
  });

  it('summarizes nine exercises and the complete textbook range on the overview', () => {
    render(<MemoryRouter><Ch15OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '归一化流掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/9 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成三节共 9 道原创练习/)).toBeTruthy();
    expect(screen.getAllByText(/pp\. 547–561/).length).toBeGreaterThan(0);
  });

  it('states the two Jacobian conventions without a sign ambiguity', () => {
    render(<MemoryRouter><Ch15OverviewPage /></MemoryRouter>);
    expect(screen.getAllByText(/逆映射 z=g\(x\) 时乘/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/正向映射 x=f\(z\).*除以/).length).toBeGreaterThan(0);
  });
});
