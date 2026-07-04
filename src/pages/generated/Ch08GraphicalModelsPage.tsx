import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch08/graphical-models';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  parents: string[];
}

const NODES: GraphNode[] = [
  { id: 'a', label: 'a', x: 100, y: 80, parents: [] },
  { id: 'b', label: 'b', x: 220, y: 80, parents: [] },
  { id: 'c', label: 'c', x: 160, y: 180, parents: ['a', 'b'] },
  { id: 'd', label: 'd', x: 160, y: 290, parents: ['c'] },
];

const WIDTH = 320;
const HEIGHT = 380;

function drawGraph(
  svgEl: SVGSVGElement,
  activeNode: string | null,
  onNodeClick: (id: string) => void
) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  // Background click to reset
  svg
    .append('rect')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .attr('fill', 'transparent')
    .style('cursor', 'default')
    .on('click', () => onNodeClick(''));

  // Arrows
  const defs = svg.append('defs');
  defs
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 28)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#6b7280');

  // Edges
  NODES.forEach((target) => {
    target.parents.forEach((pid) => {
      const source = NODES.find((n) => n.id === pid)!;
      svg
        .append('line')
        .attr('x1', source.x)
        .attr('y1', source.y)
        .attr('x2', target.x)
        .attr('y2', target.y)
        .attr('stroke', '#9ca3af')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    });
  });

  // Nodes
  svg
    .selectAll('.node')
    .data(NODES)
    .enter()
    .append('circle')
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .attr('r', 22)
    .attr('fill', (d) => (activeNode === d.id ? '#dbeafe' : '#ffffff'))
    .attr('stroke', (d) => (activeNode === d.id ? '#2563eb' : '#4b5563'))
    .attr('stroke-width', (d) => (activeNode === d.id ? 3 : 2))
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation();
      onNodeClick(d.id);
    });

  svg
    .selectAll('.label')
    .data(NODES)
    .enter()
    .append('text')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y + 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', 16)
    .attr('font-weight', 600)
    .attr('fill', '#1f2937')
    .style('pointer-events', 'none')
    .text((d) => d.label);
}

export default function Ch08GraphicalModelsPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [paramCount, setParamCount] = useState(2);
  const [seed, setSeed] = useState(1);

  const graphRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (graphRef.current) {
      drawGraph(graphRef.current, activeNode, (id) => setActiveNode(id || null));
    }
  }, [activeNode, seed]);

  const factorization = useMemo(() => {
    if (activeNode) {
      const node = NODES.find((n) => n.id === activeNode)!;
      const parents = node.parents.map((p) => NODES.find((n) => n.id === p)!.label).join(',');
      const cond = parents ? String.raw`\mid ${parents}` : '';
      return String.raw`p(${node.label}${cond})`;
    }
    return String.raw`p(a,b,c,d)=p(a)p(b)p(c\mid a,b)p(d\mid c)`;
  }, [activeNode]);

  const conceptCards = useMemo(
    () => [
      {
        title: '贝叶斯网络',
        description: '用有向无环图表示变量间的生成关系，联合分布等于各节点给定父节点的条件概率乘积。',
      },
      {
        title: '局部条件概率',
        description: '每个节点只需要建模给定父节点后的分布，父节点集合为空时退化为先验分布。',
      },
      {
        title: '离散变量',
        description: '离散节点的条件概率可用条件概率表（CPT）表示，参数随父节点数指数增长。',
      },
      {
        title: '线性高斯模型',
        description: '连续节点服从以父节点线性组合为均值的高斯分布，参数数量随父节点数线性增长。',
      },
      {
        title: '贝叶斯定理',
        description: '观测部分变量后，可沿图中的依赖路径更新其余变量的后验分布。',
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
            <GitBranch className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '11.1 图模型'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          图模型用节点表示随机变量、边表示依赖；有向图的因子分解直观编码变量间的生成关系。
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
            title="有向图因子分解"
            formula={String.raw`p(\mathbf{x}) = \prod_{i=1}^{D} p(x_i \mid \text{pa}_i)`}
            description="pa_i 为节点 x_i 的父节点集合。该式是贝叶斯网络的通用表示形式。"
          />
          <FormulaCard
            title="链式法则"
            formula={String.raw`p(x_1,\dots,x_D) = p(x_1) \prod_{i=2}^{D} p(x_i \mid x_1,\dots,x_{i-1})`}
            description="图模型通过图结构省略链式法则中实际不存在的条件依赖，从而得到更紧凑的分解。"
          />
          <FormulaCard
            title="线性高斯条件分布"
            formula={String.raw`p(x_i \mid \text{pa}_i) = \mathcal{N}\left(x_i \mid \sum_{j \in \text{pa}_i} w_{ij} x_j + b_i, \sigma_i^2\right)`}
            description="连续节点的均值是其父节点的线性组合，联合分布仍然是高斯分布。"
          />
        </div>
      </section>

      {/* Interactive demo: directed graph factorization */}
      <InteractiveDemo title="交互演示：有向图因子分解">
        <InteractivePanel
          hint="点击节点查看其对应的局部条件概率因子，点击空白处恢复完整联合分解。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden flex justify-center">
              <svg ref={graphRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-[320px] h-auto" style={{ maxHeight: 380 }} />
            </div>
          }
          controls={
            <div className="space-y-6">
              <p className="text-sm text-gray-700">
                下图包含四个节点。点击节点可高亮其局部条件概率；右侧显示当前选中的因子或完整分解。
              </p>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-xs text-gray-600 mb-1">当前因子</div>
                <div className="text-lg font-bold text-blue-700">
                  <KaTeX math={factorization} />
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSeed((s) => s + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重绘图
              </Button>
              <div className="text-xs text-gray-500">
                结构说明：a、b 共同影响 c，c 再影响 d。
              </div>
            </div>
          }
        />
      </InteractiveDemo>

      {/* Interactive demo: parameter count */}
      <InteractiveDemo title="交互演示：条件概率表参数数量">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            对于一个取 <KaTeX math={String.raw`K`} /> 个值的离散节点，若其父母也各有 <KaTeX math={String.raw`K`} /> 个取值，则条件概率表（CPT）的参数数量随父母数指数增长。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">父节点数量 m</label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{paramCount}</span>
            </div>
            <Slider min={0} max={5} step={1} value={[paramCount]} onValueChange={([v]) => setParamCount(v)} />
          </div>
          <FormulaCard
            title="CPT 参数数量"
            formula={String.raw`(K-1) K^{m}`}
            description="K 为每个变量的取值数，m 为父节点数。当 K=2 时，参数数为 2^m。"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">参数数量</div>
              <div className="text-2xl font-bold text-blue-700">{Math.pow(2, paramCount)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">假设 K=2</div>
              <div className="text-2xl font-bold text-gray-700">2^{paramCount}</div>
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
