import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Waves,
} from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import KaTeX from '@/components/KaTeX';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch17OverviewPage() {
  const sectionPath = '/ch17/overview';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Waves className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '第 20 章 扩散模型'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          扩散模型通过前向过程把数据分布逐渐转化为噪声，再训练神经网络执行反向去噪，从而学习高质量生成模型。本章介绍前向编码器、反向解码器、分数匹配与条件引导生成。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="前向扩散（20.1）"
            description="在 T 步内按马尔可夫链向数据逐步加入高斯噪声，任意时刻的分布都有闭式表达，便于采样与训练。"
          />
          <ConceptCard
            title="反向解码器（20.2）"
            description="训练神经网络预测噪声或分数，通过变分下界 ELBO 把目标简化为均方误差，采样时逐步恢复干净数据。"
          />
          <ConceptCard
            title="分数匹配（20.3）"
            description="扩散训练等价于学习加噪数据分布的分数函数；NCSN 在多个噪声水平上估计分数并用 Langevin 动力学采样。"
          />
          <ConceptCard
            title="引导扩散（20.4）"
            description="分类器引导与无分类器引导在采样时注入条件信息，使生成结果与类别、文本等语义对齐。"
          />
        </div>
      </section>

      {/* Chapter map */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">本章结构</h2>
        <p className="text-gray-700 mb-4">
          Bishop 第 20 章的扩散模型可以概括为一条“先破坏、再修复”的生成路径：
        </p>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
          <li>
            <strong>前向编码器：</strong>用固定的核 <KaTeX math={String.raw`q(\mathbf{x}_t|\mathbf{x}_{t-1})`} /> 把数据变为噪声。
          </li>
          <li>
            <strong>反向解码器：</strong>学习 <KaTeX math={String.raw`p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)`} />，最小化噪声预测损失。
          </li>
          <li>
            <strong>分数匹配：</strong>从分数函数角度重新理解噪声预测网络。
          </li>
          <li>
            <strong>引导扩散：</strong>用条件信号控制采样方向，实现可控生成。
          </li>
        </ol>
        <FormulaCard
          title="前向闭式分布"
          formula={String.raw`q(\mathbf{x}_t|\mathbf{x}_0)=\mathcal{N}\!\left(\mathbf{x}_t;\sqrt{\bar{\alpha}_t}\,\mathbf{x}_0,(1-\bar{\alpha}_t)\mathbf{I}\right)`}
          description="这是本章许多推导与训练目标的基础。"
        />
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
