import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, BookOpen, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';

import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch10/machine-learning-on-graphs';

export default function Ch10MachineLearningOnGraphsPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [nodes, setNodes] = useState(5);
  const [edges, setEdges] = useState(6);

  const density = useMemo(() => {
    const maxEdges = (nodes * (nodes - 1)) / 2;
    return maxEdges > 0 ? edges / maxEdges : 0;
  }, [nodes, edges]);

  const avgDegree = useMemo(() => (nodes > 0 ? (2 * edges) / nodes : 0), [nodes, edges]);

  const conceptCards = useMemo(
    () => [
      {
        title: '图的基本组成',
        description: '图 G=(V,E) 由节点集合 V 与边集合 E 组成，可附带节点特征 X 与边特征 E。',
      },
      {
        title: '邻接矩阵',
        description: 'A_{ij}=1 表示节点 i 与 j 之间有边。邻接矩阵对称于无向图，稀疏存储适合大规模图。',
      },
      {
        title: '节点/边/图级任务',
        description: '节点分类预测单个节点标签，链接预测判断边是否存在，图分类预测整张图标签。',
      },
      {
        title: '置换等变性',
        description: '对节点重新编号相当于对邻接矩阵做同步行列置换，图模型输出应相应置换而不改变语义。',
      },
      {
        title: '图拉普拉斯',
        description: 'L=D-A 编码图的光滑结构，是谱图理论与谱域 GNN 的基础。',
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
            <Globe className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '13.1 图上的机器学习'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          图机器学习利用邻接矩阵与节点特征完成任务；理解图性质与置换对称性是设计模型先验的关键。
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
          {conceptCards.map((c, idx) => (
            <ConceptCard key={idx} title={c.title} description={c.description} />
          ))}
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="邻接矩阵"
            formula={String.raw`A_{ij} = \begin{cases} 1 & (i,j) \in E \\ 0 & \text{otherwise} \end{cases}`}
            description="无向图的邻接矩阵是对称矩阵，带权图中可用边权代替 0/1。"
          />
          <FormulaCard
            title="度矩阵"
            formula={String.raw`D_{ii} = \sum_{j} A_{ij}`}
            description="度矩阵是对角矩阵，记录每个节点的邻居数量（或加权度）。"
          />
          <FormulaCard
            title="归一化图拉普拉斯"
            formula={String.raw`L_{\text{sym}} = I - D^{-1/2} A D^{-1/2}`}
            description="对称归一化拉普拉斯在谱聚类与 GCN 的归一化邻接矩阵中均有应用。"
          />
        </div>
      </section>

      {/* Interactive demo: graph statistics */}
      <InteractiveDemo title="交互演示：图的基本统计量">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            调整节点数 N 与边数 M，观察图的密度与平均度变化。注意边数不能超过简单图的最大可能边数。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>节点数 N</span>
                <span className="font-mono">{nodes}</span>
              </div>
              <Slider min={3} max={20} step={1} value={[nodes]} onValueChange={([v]) => {
                setNodes(v);
                const maxEdges = (v * (v - 1)) / 2;
                setEdges((e) => Math.min(e, maxEdges));
              }} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>边数 M</span>
                <span className="font-mono">{edges}</span>
              </div>
              <Slider
                min={0}
                max={(nodes * (nodes - 1)) / 2}
                step={1}
                value={[edges]}
                onValueChange={([v]) => setEdges(v)}
              />
            </div>
          </div>
          <FormulaCard
            title="图密度"
            formula={String.raw`\rho = \frac{2M}{N(N-1)}`}
            description="简单无向图的密度范围是 [0,1]，稀疏真实图通常 ρ 远小于 1。"
          />
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">密度 ρ</div>
              <div className="text-2xl font-bold text-blue-700">{density.toFixed(3)}</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">平均度</div>
              <div className="text-2xl font-bold text-emerald-700">{avgDegree.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">最大边数</div>
              <div className="text-2xl font-bold text-gray-700">{(nodes * (nodes - 1)) / 2}</div>
            </div>
          </div>
        </div>
      </InteractiveDemo>

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
