import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, ShieldAlert, Shrink } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import KaTeX from '@/components/KaTeX';
import { getAllSections, getSectionByPath } from '@/course/manifest';
import type { Section } from '@/course/manifest';

const SECTION_PATH = '/ch16/overview';

export default function Ch16OverviewPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection: Section | null = allSections[currentIndex - 1] ?? null;
  const nextSection: Section | null = allSections[currentIndex + 1] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Shrink className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '课程概览'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          自编码器通过编码器–解码器结构把高维输入压缩到低维隐空间，再尽可能重构原始输入。
          它既可作为降维与特征学习工具，也可扩展为概率生成模型——变分自编码器（VAE）。
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
            title="编码器与解码器"
            description={
              <>
                编码器 <KaTeX math={String.raw`\boldsymbol{z} = g(\boldsymbol{x};\boldsymbol{\theta}_g)`} /> 把输入映射到隐向量；
                解码器 <KaTeX math={String.raw`\hat{\boldsymbol{x}} = f(\boldsymbol{z};\boldsymbol{\theta}_f)`} /> 再从隐向量恢复数据。
                当隐空间维度低于输入维度时，称为欠完备（undercomplete）自编码器，可学习数据的压缩表示。
              </>
            }
          />
          <ConceptCard
            title="重构损失"
            description={
              <>
                训练目标是让重构 <KaTeX math={String.raw`\hat{\boldsymbol{x}}`} /> 尽量接近输入 <KaTeX math={String.raw`\boldsymbol{x}`} />。
                常用均方误差（连续数据）或交叉熵（二元/离散数据）衡量差距。
              </>
            }
          />
          <ConceptCard
            title="隐表示与正则化"
            description="仅靠欠完备约束可能学到恒等映射。通过稀疏性、去噪或掩码等额外约束，可让隐表示更鲁棒、更可解释，并学到对下游任务有用的特征。"
          />
          <ConceptCard
            title="生成视角：VAE"
            description="变分自编码器把编码器输出解释为后验分布参数，在隐空间施加先验，使解码器成为可采样的生成模型。"
          />
        </div>
      </section>

      {/* Autoencoder objective */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">自编码器训练目标</h2>
        <p className="text-gray-700 mb-4">
          给定数据集 <KaTeX math={String.raw`\{\boldsymbol{x}^{(n)}\}`} />，自编码器最小化重构损失：
        </p>
        <FormulaCard
          title="重构风险"
          formula={String.raw`\mathcal{L}(\boldsymbol{\theta}_g,\boldsymbol{\theta}_f) = \frac{1}{N}\sum_{n=1}^{N} \ell\bigl(\boldsymbol{x}^{(n)}, f(g(\boldsymbol{x}^{(n)};\boldsymbol{\theta}_g);\boldsymbol{\theta}_f)\bigr)`}
          description="其中 ℓ 可以是平方误差或交叉熵。通过反向传播同时更新编码器与解码器参数。"
        />
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <ConceptCard title="19.1 确定性自编码器" description="线性、深度、稀疏、去噪与掩码自编码器的结构与学习目标。" />
          <ConceptCard title="19.2 变分自编码器" description="摊销变分推断、重参数化技巧与 ELBO。" />
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
