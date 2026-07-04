import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Network, BookOpen, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import KaTeX from '@/components/KaTeX';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch08OverviewPage() {
  const sectionPath = '/ch08/overview';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const concepts = useMemo(
    () => [
      {
        title: '联合分布的分解',
        description:
          '利用变量间的条件独立关系，将高维联合分布写成局部条件概率的乘积，显著降低参数数量。',
      },
      {
        title: '有向与无向图',
        description:
          '贝叶斯网络用有向边表达生成关系，马尔可夫随机场用无向边表达变量间的软约束。',
      },
      {
        title: '条件独立性',
        description:
          'd-分离给出基于图结构判断条件独立的系统规则，是图模型推断与学习的理论基础。',
      },
      {
        title: '序列结构',
        description:
          '链、树等结构适合建模时间或空间顺序数据，隐马尔可夫模型与线性动态系统是典型代表。',
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
            <Network className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '课程概览'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          结构化分布利用变量间的依赖关系进行紧凑建模；图模型与序列模型为复杂联合分布提供可解释框架。
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

      {/* Factorization formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">图模型中的概率分解</h2>
        <p className="text-gray-700 mb-4">
          对于随机向量 <KaTeX math={String.raw`\mathbf{x}`} />，若其依赖结构由有向无环图（DAG）刻画，则联合分布可分解为每个节点给定其父节点的条件概率乘积。
        </p>
        <FormulaCard
          title="贝叶斯网络分解"
          formula={String.raw`p(\mathbf{x}) = \prod_{i=1}^{D} p(x_i \mid \text{pa}_i)`}
          description="pa_i 表示节点 x_i 在图中的父节点集合。该分解是图模型推断、学习与采样的出发点。"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <ConceptCard
            title="11.1 图模型"
            description="有向图、因子分解、离散/高斯变量与贝叶斯定理。"
          />
          <ConceptCard
            title="11.2 条件独立"
            description="三种示例图、解释消除、d-分离、朴素贝叶斯与马尔可夫毯。"
          />
          <ConceptCard
            title="11.3 序列模型"
            description="隐变量与序列建模，包括隐马尔可夫模型与线性动态系统。"
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
