import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dices, BookOpen, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import KaTeX from '@/components/KaTeX';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch11OverviewPage() {
  const sectionPath = '/ch11/overview';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const concepts = useMemo(
    () => [
      {
        title: '蒙特卡洛估计',
        description:
          '从目标分布中抽取独立样本，用样本均值近似期望。方差随样本量以 1/N 下降，是复杂积分估计的核心工具。',
      },
      {
        title: '拒绝采样',
        description:
          '用一个易于采样的提议分布包裹目标分布，通过接受-拒绝机制产生服从目标分布的样本。高维空间中接受率会急剧下降。',
      },
      {
        title: '马尔可夫链蒙特卡洛 (MCMC)',
        description:
          '构造一条马尔可夫链，使其平稳分布恰好为目标分布。适用于高维、复杂且难以直接采样的分布。',
      },
      {
        title: 'Langevin 采样',
        description:
          '在采样过程中引入能量函数梯度信息，结合随机噪声引导样本向高概率区域移动，是现代能量模型与分数匹配的基础。',
      },
    ],
    []
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Dices className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '课程概览'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          采样是从复杂概率分布中获取样本的技术，广泛应用于蒙特卡洛估计、隐变量推断与生成模型训练。
          本章将介绍从基础采样算法到 MCMC 与 Langevin 动力学的完整路线图。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Core concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">本章核心思想</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {concepts.map((c, idx) => (
            <ConceptCard key={idx} title={c.title} description={c.description} />
          ))}
        </div>
      </section>

      {/* Monte Carlo formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">蒙特卡洛估计基础</h2>
        <p className="text-gray-700 mb-4">
          对于服从分布 <KaTeX math={String.raw`p(x)`} /> 的随机变量，函数 <KaTeX math={String.raw`f(x)`} /> 的期望可以通过样本均值近似：
        </p>
        <FormulaCard
          title="蒙特卡洛估计"
          formula={String.raw`\mathbb{E}_{x \sim p}[f(x)] = \int f(x) p(x) \, dx \approx \frac{1}{N} \sum_{n=1}^{N} f(x_n)`}
          description="当样本独立同分布时，估计量的方差为 Var[f]/N，随样本量增加而下降。"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <ConceptCard
            title="14.1 基本采样算法"
            description="逆变换采样、拒绝采样、自适应拒绝采样、重要性采样与采样-重要性重采样。"
          />
          <ConceptCard
            title="14.2 MCMC"
            description="Metropolis、Metropolis-Hastings、Gibbs 采样与祖先采样。"
          />
          <ConceptCard
            title="14.3 Langevin 采样"
            description="能量模型、似然最大化与 Langevin 动力学。"
          />
        </div>
      </section>

      {/* Navigation */}
      <section className="flex flex-wrap justify-between gap-4">
        {prevSection ? (
          <Link
            to={prevSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevSection.title}
          </Link>
        ) : (
          <div />
        )}
        {nextSection && (
          <Link
            to={nextSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {nextSection.title}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </section>
    </div>
  );
}
