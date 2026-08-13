import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CurseOfDimensionalityLab from '@/components/demos/CurseOfDimensionalityLab';
import DepthVsWidthLab from '@/components/demos/DepthVsWidthLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch03OverviewPage from '@/pages/generated/Ch03OverviewPage';
import Ch03LimitationsOfFixedBasisFunctionsPage from '@/pages/generated/Ch03LimitationsOfFixedBasisFunctionsPage';
import Ch03MultilayerNetworksPage from '@/pages/generated/Ch03MultilayerNetworksPage';
import Ch03DeepNetworksPage from '@/pages/generated/Ch03DeepNetworksPage';
import Ch03ErrorFunctionsPage from '@/pages/generated/Ch03ErrorFunctionsPage';
import Ch03MixtureDensityNetworksPage from '@/pages/generated/Ch03MixtureDensityNetworksPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 3 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest
      .flatMap((part) => part.chapters)
      .find((item) => item.id === 'ch03');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice and textbook mapping on all content pages', () => {
    const pages = [
      <Ch03LimitationsOfFixedBasisFunctionsPage key="limitations" />,
      <Ch03MultilayerNetworksPage key="multilayer" />,
      <Ch03DeepNetworksPage key="deep" />,
      <Ch03ErrorFunctionsPage key="error" />,
      <Ch03MixtureDensityNetworksPage key="mdn" />,
    ];

    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('includes worked derivations for composition, losses, and density constraints', () => {
    const derivationPages = [
      <Ch03MultilayerNetworksPage key="multilayer" />,
      <Ch03ErrorFunctionsPage key="error" />,
      <Ch03MixtureDensityNetworksPage key="mdn" />,
    ];

    for (const page of derivationPages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText(/分步(检查|推导|构造)/)).toBeTruthy();
      unmount();
    }
  });

  it('gates the distance experiment until a prediction is submitted', () => {
    render(<CurseOfDimensionalityLab />);
    expect(screen.queryByLabelText('高维距离实验控制区')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: /下降，距离相对更集中/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('高维距离实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('gates the depth-composition experiment until a prediction is submitted', () => {
    render(<DepthVsWidthLab />);
    expect(screen.queryByLabelText('层次组合实验控制区')).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: '16 个' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));

    expect(screen.getByLabelText('层次组合实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes fifteen exercises on the overview page', () => {
    render(
      <MemoryRouter>
        <Ch03OverviewPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('progressbar', { name: '第三章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/15 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成五节共 15 道原创练习/)).toBeTruthy();
  });
});
