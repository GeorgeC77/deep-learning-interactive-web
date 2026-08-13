import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VisionTaskLab from '@/components/demos/VisionTaskLab';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import Ch07OverviewPage from '@/pages/generated/Ch07OverviewPage';
import Ch07ComputerVisionPage from '@/pages/generated/Ch07ComputerVisionPage';
import Ch07ConvolutionalFiltersPage from '@/pages/generated/Ch07ConvolutionalFiltersPage';
import Ch07VisualizingTrainedCnnsPage from '@/pages/generated/Ch07VisualizingTrainedCnnsPage';
import Ch07ObjectDetectionPage from '@/pages/generated/Ch07ObjectDetectionPage';
import Ch07ImageSegmentationPage from '@/pages/generated/Ch07ImageSegmentationPage';
import Ch07StyleTransferPage from '@/pages/generated/Ch07StyleTransferPage';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('chapter 7 teaching-ready learning loop', () => {
  it('marks every route and the aggregate chapter as teaching-ready', () => {
    const chapter = courseManifest.flatMap((part) => part.chapters).find((item) => item.id === 'ch07');
    expect(chapter).toBeTruthy();
    expect(chapter?.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
    expect(getChapterStatus(chapter!)).toBe('teaching-ready');
  });

  it('provides practice, derivation, and textbook page mapping on all content pages', () => {
    const pages = [<Ch07ComputerVisionPage />, <Ch07ConvolutionalFiltersPage />, <Ch07VisualizingTrainedCnnsPage />, <Ch07ObjectDetectionPage />, <Ch07ImageSegmentationPage />, <Ch07StyleTransferPage />];
    for (const page of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/教材映射/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/pp\. (288|290|302|308|315|320)/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('gates the output-granularity experiment until a prediction is submitted', () => {
    render(<VisionTaskLab />);
    expect(screen.queryByLabelText('视觉任务输出粒度实验控制区')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '图像分割' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(screen.getByLabelText('视觉任务输出粒度实验控制区')).toBeTruthy();
    expect(screen.getByText(/回答正确/)).toBeTruthy();
  });

  it('summarizes eighteen exercises on the overview', () => {
    render(<MemoryRouter><Ch07OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '第七章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/18 · 0%')).toBeTruthy();
    expect(screen.getByText(/完成六节共 18 道原创练习/)).toBeTruthy();
  });
});
