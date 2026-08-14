import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MaskedAutoencoderDemo from '@/components/demos/MaskedAutoencoderDemo';
import VAELatentCloudLab from '@/components/demos/VAELatentCloudLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch16OverviewPage from '@/pages/generated/Ch16OverviewPage';
import Ch16DeterministicAutoencodersPage from '@/pages/generated/Ch16DeterministicAutoencodersPage';
import Ch16VariationalAutoencodersPage from '@/pages/generated/Ch16VariationalAutoencodersPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 16 autoencoders teaching-ready loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch16');
    expect(chapter).toBeTruthy();
    expect(chapter?.bishopChapter).toBe('Ch 19');
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, four-step derivations, and exact textbook ranges on both content pages', () => {
    const pages = [
      [<Ch16DeterministicAutoencodersPage />, /pp\. 564–568/],
      [<Ch16VariationalAutoencodersPage />, /pp\. 569–578/],
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

  it('gates the MAE reconstruction experiment behind the masked-patch prediction', () => {
    render(<MaskedAutoencoderDemo />);
    expect(screen.queryByLabelText('MAE 遮罩重建实验区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '只在被遮罩的 patch 上' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('MAE 遮罩重建实验区')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText('Masked-patch MSE')).toBeTruthy();
  });

  it('requires a VAE judgment before explaining the beta-objective boundary', () => {
    render(<VAELatentCloudLab />);
    expect(screen.queryByText(/标准 ELBO 严格对应/)).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '否' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
    expect(screen.getByText(/标准 ELBO 严格对应/)).toBeTruthy();
    expect(screen.getByText(/不再保证是下界/)).toBeTruthy();
  });

  it('summarizes six exercises and the complete chapter range on the overview', () => {
    render(<MemoryRouter><Ch16OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '自编码器掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/6 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成两节共 6 道原创练习/)).toBeTruthy();
    expect(screen.getAllByText(/pp\. 563–579/).length).toBeGreaterThan(0);
  });

  it('states the deterministic and variational failure modes explicitly', () => {
    const deterministic = render(<MemoryRouter><Ch16DeterministicAutoencodersPage /></MemoryRouter>);
    expect(screen.getAllByText(/恒等映射/).length).toBeGreaterThan(0);
    deterministic.unmount();

    render(<MemoryRouter><Ch16VariationalAutoencodersPage /></MemoryRouter>);
    expect(screen.getAllByText(/posterior collapse/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0<β<1.*不再保证/).length).toBeGreaterThan(0);
  });
});
