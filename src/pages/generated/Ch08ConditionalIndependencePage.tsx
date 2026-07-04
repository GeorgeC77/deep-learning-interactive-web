import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Unlink, BookOpen, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';

import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch08/conditional-independence';

type StructureKind = 'chain' | 'fork' | 'collider';

const WIDTH = 360;
const HEIGHT = 220;

const STRUCTURES: Record<StructureKind, { label: string; desc: string; edges: [string, string][] }> = {
  chain: {
    label: '链式结构 A → C → B',
    desc: 'C 是 A 与 B 之间的中间节点。未观测 C 时 A、B 相关；观测 C 后 A、B 条件独立。',
    edges: [
      ['A', 'C'],
      ['C', 'B'],
    ],
  },
  fork: {
    label: '分岔结构 A ← C → B',
    desc: 'C 是 A 与 B 的共同原因。未观测 C 时 A、B 相关；观测 C 后 A、B 条件独立。',
    edges: [
      ['C', 'A'],
      ['C', 'B'],
    ],
  },
  collider: {
    label: '汇聚结构 A → C ← B',
    desc: 'C 是 A 与 B 的共同结果。未观测 C 时 A、B 独立；观测 C 后 A、B 变得相关（解释消除）。',
    edges: [
      ['A', 'C'],
      ['B', 'C'],
    ],
  },
};

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 80, y: 110 },
  B: { x: 280, y: 110 },
  C: { x: 180, y: 110 },
};

function drawDSepGraph(svgEl: SVGSVGElement, kind: StructureKind, observed: Set<string>) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  const defs = svg.append('defs');
  defs
    .append('marker')
    .attr('id', 'darrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 28)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#6b7280');

  const edges = STRUCTURES[kind].edges;
  edges.forEach(([src, tgt]) => {
    const s = NODE_POSITIONS[src];
    const t = NODE_POSITIONS[tgt];
    svg
      .append('line')
      .attr('x1', s.x)
      .attr('y1', s.y)
      .attr('x2', t.x)
      .attr('y2', t.y)
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#darrow)');
  });

  Object.entries(NODE_POSITIONS).forEach(([id, pos]) => {
    const isObs = observed.has(id);
    svg
      .append('circle')
      .attr('cx', pos.x)
      .attr('cy', pos.y)
      .attr('r', 22)
      .attr('fill', isObs ? '#2563eb' : '#ffffff')
      .attr('stroke', isObs ? '#2563eb' : '#4b5563')
      .attr('stroke-width', 2);

    svg
      .append('text')
      .attr('x', pos.x)
      .attr('y', pos.y + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .attr('fill', isObs ? '#ffffff' : '#1f2937')
      .text(id);
  });
}

function isDSeparated(kind: StructureKind, observed: Set<string>): boolean {
  const oC = observed.has('C');
  const oA = observed.has('A');
  const oB = observed.has('B');
  if (kind === 'chain' || kind === 'fork') {
    // A and B are d-separated iff C is observed (or either endpoint observed, trivially)
    return oC || oA || oB;
  }
  // collider: A and B are d-separated unless C or its descendants are observed
  return !(oC || oA || oB);
}

export default function Ch08ConditionalIndependencePage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [kind, setKind] = useState<StructureKind>('chain');
  const [observed, setObserved] = useState<Set<string>>(new Set());

  const graphRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (graphRef.current) {
      drawDSepGraph(graphRef.current, kind, observed);
    }
  }, [kind, observed]);

  const toggleObserved = (id: string) => {
    setObserved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dSepResult = useMemo(() => isDSeparated(kind, observed), [kind, observed]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Unlink className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '11.2 条件独立'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          条件独立性是图模型的核心；d-分离提供了一套基于图结构判断独立性的完备规则。
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
            title="链式结构"
            description="A → C → B 中，C 传递 A 与 B 之间的影响；给定 C 后该路径被阻断。"
          />
          <ConceptCard
            title="分岔结构"
            description="A ← C → B 中，C 是共同原因；给定 C 后 A 与 B 条件独立。"
          />
          <ConceptCard
            title="汇聚结构"
            description="A → C ← B 中，C 是共同结果；未观测 C 时 A 与 B 独立，观测 C 后反而相关。"
          />
          <ConceptCard
            title="解释消除"
            description="在汇聚结构中，已知共同结果会打开两个父节点之间的依赖通路。"
          />
          <ConceptCard
            title="d-分离"
            description="若 A 与 B 之间的所有无向路径都被阻断，则称它们在给定观测集下 d-分离。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="条件独立定义"
            formula={String.raw`A \perp\!\!\!\perp B \mid C \quad \Longleftrightarrow \quad p(A,B \mid C) = p(A \mid C) p(B \mid C)`}
            description="给定 C 后，A 与 B 的联合条件分布可分解为各自条件分布的乘积。"
          />
          <FormulaCard
            title="链式结构的因子分解"
            formula={String.raw`p(A,B,C) = p(A) p(C \mid A) p(B \mid C)`}
            description="该分解直接蕴含 A 与 B 在给定 C 时条件独立。"
          />
          <FormulaCard
            title="朴素贝叶斯"
            formula={String.raw`p(\mathbf{x}, y) = p(y) \prod_{i=1}^{D} p(x_i \mid y)`}
            description="给定类别 y 后，所有特征条件独立，是典型的分岔结构应用。"
          />
        </div>
      </section>

      {/* Interactive demo: d-separation */}
      <InteractiveDemo title="交互演示：d-分离与三种基本结构">
        <InteractivePanel
          hint="选择结构并点击节点设置观测状态，判断 A 与 B 是否 d-分离。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden flex justify-center">
              <svg ref={graphRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-[360px] h-auto" style={{ maxHeight: 220 }} />
            </div>
          }
          controls={
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STRUCTURES) as StructureKind[]).map((k) => (
                  <Button
                    key={k}
                    variant={kind === k ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setKind(k);
                      setObserved(new Set());
                    }}
                  >
                    {k === 'chain' ? '链式' : k === 'fork' ? '分岔' : '汇聚'}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-700">{STRUCTURES[kind].desc}</p>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">点击节点切换观测状态</div>
                <div className="flex flex-wrap gap-2">
                  {['A', 'B', 'C'].map((id) => (
                    <Button
                      key={id}
                      variant={observed.has(id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleObserved(id)}
                    >
                      {observed.has(id) ? '已观测' : '未观测'} {id}
                    </Button>
                  ))}
                </div>
              </div>
              <div
                className={`p-4 rounded-lg text-center border ${
                  dSepResult ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">判定结果</div>
                <div className={`text-lg font-bold ${dSepResult ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {dSepResult ? 'A 与 B d-分离（条件独立）' : 'A 与 B 不 d-分离（可能相关）'}
                </div>
              </div>
            </div>
          }
        />
      </InteractiveDemo>

      {/* Markov blanket */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">马尔可夫毯</h2>
        <p className="text-gray-700 mb-4">
          一个节点的马尔可夫毯由其父节点、子节点以及子节点的其他父节点组成。给定马尔可夫毯后，该节点与图中所有其他变量条件独立。
        </p>
        <FormulaCard
          title="马尔可夫毯条件独立"
          formula={String.raw`x_i \perp\!\!\!\perp \mathbf{x}_{\setminus \{i\} \cup \text{MB}(i)} \mid \text{MB}(i)`}
          description="MB(i) 表示节点 x_i 的马尔可夫毯。该性质在推断与特征选择中非常实用。"
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
