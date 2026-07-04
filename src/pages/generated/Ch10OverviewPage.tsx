import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Share2, BookOpen, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import KaTeX from '@/components/KaTeX';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch10OverviewPage() {
  const sectionPath = '/ch10/overview';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const concepts = useMemo(
    () => [
      {
        title: '图数据表示',
        description:
          '图由节点集合、边集合以及可选的节点/边/全局特征组成，是社交网络、分子、知识图谱等数据的自然抽象。',
      },
      {
        title: '置换等变性',
        description:
          '节点重新编号时，输出表示应相应置换；这是图神经网络必须满足的基本对称性。',
      },
      {
        title: '消息传递范式',
        description:
          '每个节点聚合邻居信息并更新自身表示，迭代多层后获得包含结构语义的节点嵌入。',
      },
      {
        title: '几何深度学习',
        description:
          '在具有几何结构的图（如分子三维构象）上，模型需要同时保持旋转、平移等对称性。',
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
            <Share2 className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '课程概览'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          图神经网络将神经网络推广到不规则图结构，通过消息传递聚合邻域信息并满足置换等变性。
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

      {/* Message passing formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">消息传递神经网络框架</h2>
        <p className="text-gray-700 mb-4">
          在每一层，节点 <KaTeX math={String.raw`v`} /> 先聚合邻居消息，再用更新函数得到新的表示。
        </p>
        <FormulaCard
          title="MPNN 通用形式"
          formula={String.raw`\mathbf{m}_v^{(l)} = \sum_{u \in \mathcal{N}(v)} M^{(l)}\left(\mathbf{h}_v^{(l)}, \mathbf{h}_u^{(l)}, \mathbf{e}_{uv}\right), \quad \mathbf{h}_v^{(l+1)} = U^{(l)}\left(\mathbf{h}_v^{(l)}, \mathbf{m}_v^{(l)}\right)`}
          description="消息函数 M 与更新函数 U 的具体形式定义了 GCN、GAT 等不同变体。"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <ConceptCard
            title="13.1 图上的机器学习"
            description="图性质、邻接矩阵与置换等变性。"
          />
          <ConceptCard
            title="13.2 神经消息传递"
            description="卷积滤波器、GCN、聚合/更新算子与节点/边/图分类。"
          />
          <ConceptCard
            title="13.3 通用图网络"
            description="图注意力网络、边嵌入、图嵌入、过平滑、正则化与几何深度学习。"
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
