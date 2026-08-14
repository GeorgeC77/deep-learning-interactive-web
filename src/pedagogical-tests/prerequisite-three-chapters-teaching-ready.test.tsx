import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { courseManifest, getChapterStatus } from '@/course/manifest';
import PrerequisiteChapter02OverviewPage from '@/pages/prerequisite/chapter02/OverviewPage';
import PrerequisiteChapter02RulesPage from '@/pages/prerequisite/chapter02/rules';
import PrerequisiteChapter02DensitiesPage from '@/pages/prerequisite/chapter02/densities';
import PrerequisiteChapter02GaussianPage from '@/pages/prerequisite/chapter02/gaussian';
import PrerequisiteCh02TransformationPage from '@/pages/generated/PrerequisiteCh02TransformationPage';
import PrerequisiteChapter02InformationPage from '@/pages/prerequisite/chapter02/information';
import PrerequisiteChapter02BayesianPage from '@/pages/prerequisite/chapter02/bayesian';
import PrerequisiteChapter03OverviewPage from '@/pages/prerequisite/chapter03/OverviewPage';
import DiscreteDistributionsPage from '@/pages/prerequisite/chapter03/discrete';
import MultivariateGaussianPage from '@/pages/prerequisite/chapter03/mvgaussian';
import PrerequisiteCh03PeriodicPage from '@/pages/generated/PrerequisiteCh03PeriodicPage';
import ExponentialFamilyPage from '@/pages/prerequisite/chapter03/exponential';
import NonparametricMethodsPage from '@/pages/prerequisite/chapter03/nonparametric';

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe('three prerequisite chapters teaching-ready learning loop', () => {
  it('marks every route in all three prerequisite chapters as teaching-ready', () => {
    const prerequisiteChapters = courseManifest
      .flatMap((part) => part.chapters)
      .filter((chapter) => ['pre-ch01', 'pre-ch02', 'pre-ch03'].includes(chapter.id));
    expect(prerequisiteChapters).toHaveLength(3);
    for (const chapter of prerequisiteChapters) {
      expect(chapter.sections.every((section) => section.status === 'teaching-ready')).toBe(true);
      expect(getChapterStatus(chapter)).toBe('teaching-ready');
    }
  });

  it('provides active practice, four-step derivations, and exact page ranges on all eleven new content pages', () => {
    const pages = [
      [<PrerequisiteChapter02RulesPage />, /pp\. 25–32/, '2.1 概率规则'],
      [<PrerequisiteChapter02DensitiesPage />, /pp\. 32–36/, '2.2 概率密度'],
      [<PrerequisiteChapter02GaussianPage />, /pp\. 36–42/, '2.3 高斯分布'],
      [<PrerequisiteCh02TransformationPage />, /pp\. 42–46/, '2.4 密度变换'],
      [<PrerequisiteChapter02InformationPage />, /pp\. 46–54/, '2.5 信息论'],
      [<PrerequisiteChapter02BayesianPage />, /pp\. 54–58/, '2.6 贝叶斯概率'],
      [<DiscreteDistributionsPage />, /pp\. 66–70/, '3.1 离散变量'],
      [<MultivariateGaussianPage />, /pp\. 70–89/, '3.2 多元高斯'],
      [<PrerequisiteCh03PeriodicPage />, /pp\. 89–94/, '3.3 周期变量'],
      [<ExponentialFamilyPage />, /pp\. 94–98/, '3.4 指数族'],
      [<NonparametricMethodsPage />, /pp\. 98–105/, '3.5 非参数方法'],
    ] as const;

    for (const [page, pageRange, title] of pages) {
      const { unmount } = render(<MemoryRouter>{page}</MemoryRouter>);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeTruthy();
      expect(screen.getByText('主动练习')).toBeTruthy();
      expect(screen.getAllByText(/分步推导/).length).toBeGreaterThan(0);
      expect(screen.getByText('1 / 4')).toBeTruthy();
      expect(screen.getAllByText(pageRange).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('summarizes all 33 new exercises on the two overview pages', () => {
    const chapter02 = render(<MemoryRouter><PrerequisiteChapter02OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '先修第二章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/18 · 0%')).toBeTruthy();
    expect(screen.getByText(/六节共 18 道原创练习/)).toBeTruthy();
    chapter02.unmount();

    render(<MemoryRouter><PrerequisiteChapter03OverviewPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar', { name: '先修第三章掌握进度' })).toBeTruthy();
    expect(screen.getByText('0/15 · 0%')).toBeTruthy();
    expect(screen.getByText(/五节共 15 道原创练习/)).toBeTruthy();
  });

  it('requires and evaluates a medical-screening prediction before revealing the posterior', async () => {
    render(<MemoryRouter><PrerequisiteChapter02RulesPage /></MemoryRouter>);
    expect(screen.queryByText(/p\(患病\|阳性\)=90/)).toBeNull();
    expect(screen.queryByText('互动演示：医学筛查中的贝叶斯更新')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '约 23%' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(await screen.findByText(/p\(患病\|阳性\)=90/)).toBeTruthy();
    expect(screen.getByText('互动演示：医学筛查中的贝叶斯更新')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
  });

  it('unlocks a bandwidth experiment only after the KDE prediction', async () => {
    render(<MemoryRouter><NonparametricMethodsPage /></MemoryRouter>);
    expect(screen.queryByLabelText(/验证带宽/)).toBeNull();
    expect(screen.queryByText('交互演示：一维核密度估计')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '更平滑，方差降低但偏差可能升高' }));
    fireEvent.click(screen.getByRole('button', { name: '提交预测' }));
    expect(await screen.findByText(/拖动 h/)).toBeTruthy();
    expect(screen.getByText('交互演示：一维核密度估计')).toBeTruthy();
    expect(screen.getByTestId('evaluation-feedback').textContent).toContain('回答正确');
  });
});
