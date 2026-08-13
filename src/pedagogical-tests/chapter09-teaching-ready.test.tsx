import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MultimodalTokenLab from '@/components/demos/MultimodalTokenLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch09OverviewPage from '@/pages/generated/Ch09OverviewPage';
import Ch09AttentionPage from '@/pages/generated/Ch09AttentionPage';
import Ch09NaturalLanguagePage from '@/pages/generated/Ch09NaturalLanguagePage';
import Ch09TransformerLanguageModelsPage from '@/pages/generated/Ch09TransformerLanguageModelsPage';
import Ch09MultimodalTransformersPage from '@/pages/generated/Ch09MultimodalTransformersPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 9 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch09');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides active practice and worked derivations on all four content pages', () => {
    const pages = [
      <Ch09AttentionPage />,
      <Ch09NaturalLanguagePage />,
      <Ch09TransformerLanguageModelsPage />,
      <Ch09MultimodalTransformersPage />,
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
      [<Ch09AttentionPage />, /pp\. 358/],
      [<Ch09NaturalLanguagePage />, /pp\. 374/],
      [<Ch09TransformerLanguageModelsPage />, /pp\. 382/],
      [<Ch09MultimodalTransformersPage />, /pp\. 394/],
    ] as const;
    for (const [page, pagePattern] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getAllByText(pagePattern).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the multimodal token experiment until a prediction is submitted', () => {
    render(<MultimodalTokenLab />);
    expect(screen.queryByLabelText('多模态 token 化实验控制区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '1/16' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('多模态 token 化实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes twelve exercises on the overview', () => {
    render(<MemoryRouter><Ch09OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '第九章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/12 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成四节共 12 道原创练习/)).toBeTruthy();
  });
});
