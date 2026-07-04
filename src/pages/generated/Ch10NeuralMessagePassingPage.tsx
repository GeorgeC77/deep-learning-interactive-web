import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch10/neural-message-passing';

interface GraphNode {
  id: number;
  x: number;
  y: number;
  value: number;
}

const NODES: GraphNode[] = [
  { id: 0, x: 100, y: 80, value: 1.0 },
  { id: 1, x: 260, y: 80, value: 0.5 },
  { id: 2, x: 180, y: 200, value: 0.2 },
  { id: 3, x: 60, y: 260, value: 0.8 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 3],
];

const WIDTH = 360;
const HEIGHT = 360;

function drawMessagePassing(
  svgEl: SVGSVGElement,
  nodeValues: number[],
  step: number,
  edgeWeight: number
) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  // Compute updated values after 'step' rounds of mean aggregation with self-loop.
  const updated = [...nodeValues];
  const adj: number[][] = NODES.map(() => []);
  EDGES.forEach(([u, v]) => {
    adj[u].push(v);
    adj[v].push(u);
  });
  for (let s = 0; s < step; s++) {
    const next = updated.map((val, i) => {
      const neighbors = adj[i];
      const sum = val + neighbors.reduce((acc, j) => acc + edgeWeight * updated[j], 0);
      return sum / (1 + neighbors.length * edgeWeight);
    });
    for (let i = 0; i < updated.length; i++) updated[i] = next[i];
  }

  const maxVal = Math.max(...updated.map(Math.abs), 0.01);
  const colorScale = d3.scaleSequential(d3.interpolateRdYlBu).domain([maxVal, -maxVal]);
  const radiusScale = d3.scaleLinear().domain([0, maxVal]).range([18, 30]);

  // Edges
  EDGES.forEach(([u, v]) => {
    const a = NODES[u];
    const b = NODES[v];
    svg
      .append('line')
      .attr('x1', a.x)
      .attr('y1', a.y)
      .attr('x2', b.x)
      .attr('y2', b.y)
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 2);
  });

  // Nodes
  NODES.forEach((node, i) => {
    const val = updated[i];
    svg
      .append('circle')
      .attr('cx', node.x)
      .attr('cy', node.y)
      .attr('r', radiusScale(Math.abs(val)))
      .attr('fill', colorScale(val))
      .attr('stroke', '#374151')
      .attr('stroke-width', 2);

    svg
      .append('text')
      .attr('x', node.x)
      .attr('y', node.y + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', '#ffffff')
      .text(val.toFixed(2));

    svg
      .append('text')
      .attr('x', node.x)
      .attr('y', node.y + 42)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#4b5563')
      .text(`v${i}`);
  });

  // Legend
  const legend = svg.append('g').attr('transform', `translate(${WIDTH - 120}, 20)`);
  legend
    .append('rect')
    .attr('width', 110)
    .attr('height', 58)
    .attr('rx', 6)
    .attr('fill', 'white')
    .attr('stroke', '#e5e7eb');
  legend.append('text').attr('x', 8).attr('y', 18).attr('font-size', 10).attr('fill', '#374151').text('颜色：值大小');
  legend.append('text').attr('x', 8).attr('y', 34).attr('font-size', 10).attr('fill', '#374151').text('半径：绝对值');
  legend.append('text').attr('x', 8).attr('y', 50).attr('font-size', 10).attr('fill', '#374151').text(`步数：${step}`);
}

export default function Ch10NeuralMessagePassingPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [step, setStep] = useState(1);
  const [edgeWeight, setEdgeWeight] = useState(1.0);
  const [nodeValues, setNodeValues] = useState<number[]>(NODES.map((n) => n.value));
  const [seed, setSeed] = useState(1);

  const chartRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (chartRef.current) {
      drawMessagePassing(chartRef.current, nodeValues, step, edgeWeight);
    }
  }, [nodeValues, step, edgeWeight, seed]);

  const resetValues = () => {
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    setNodeValues(NODES.map(() => rand() * 2 - 1));
    setSeed((v) => v + 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '13.2 神经消息传递'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          神经消息传递框架统一了 GCN、GAT 等变体：聚合邻居消息、更新节点状态、迭代传播至全图。
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
            title="消息函数"
            description="根据源节点、目标节点与边特征计算要传递的消息，常见形式包括拼接后经过 MLP。"
          />
          <ConceptCard
            title="聚合函数"
            description="对邻居消息做求和、平均或最大值聚合，保证结果对邻居顺序不敏感，满足置换不变性。"
          />
          <ConceptCard
            title="GCN 更新"
            description='归一化邻接矩阵与特征矩阵相乘，实现谱域图卷积的一阶近似。'
          />
          <ConceptCard
            title="边特征"
            description='消息传递可同时利用边特征，使模型能够区分不同类型的关系或距离。'
          />
          <ConceptCard
            title="多层传播"
            description='每增加一层，节点感受野扩展一跳邻居；层数过多会导致过平滑。'
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="GCN 层更新"
            formula={String.raw`H^{(l+1)} = \sigma\left(\tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2} H^{(l)} W^{(l)}\right)`}
            description="Ã = A + I 加入自环，D̃ 为度矩阵。该式等价于对归一化邻居特征做线性变换。"
          />
          <FormulaCard
            title="MPNN 通用形式"
            formula={String.raw`\mathbf{m}_v^{(l)} = \sum_{u \in \mathcal{N}(v)} M^{(l)}(\mathbf{h}_v^{(l)}, \mathbf{h}_u^{(l)}, \mathbf{e}_{uv}), \quad \mathbf{h}_v^{(l+1)} = U^{(l)}(\mathbf{h}_v^{(l)}, \mathbf{m}_v^{(l)})`}
            description="消息函数 M 与更新函数 U 的具体选择定义了不同 GNN 变体。"
          />
          <FormulaCard
            title="均值聚合"
            formula={String.raw`\mathbf{h}_v^{(l+1)} = \sigma\left(W \cdot \frac{1}{|\mathcal{N}(v)|} \sum_{u \in \mathcal{N}(v)} \mathbf{h}_u^{(l)}\right)`}
            description="均值聚合是最简单的置换不变聚合之一，对应均值池化图卷积。"
          />
        </div>
      </section>

      {/* Interactive demo: message passing */}
      <InteractiveDemo title="交互演示：消息传递迭代">
        <InteractivePanel
          hint="调整消息传递步数与边权重，观察节点表示如何在图上扩散。节点颜色表示值大小，半径表示绝对值。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden flex justify-center">
              <svg ref={chartRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-[360px] h-auto" style={{ maxHeight: 360 }} />
            </div>
          }
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>传播步数 L</span>
                  <span className="font-mono">{step}</span>
                </div>
                <Slider min={0} max={5} step={1} value={[step]} onValueChange={([v]) => setStep(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>边权重 w</span>
                  <span className="font-mono">{edgeWeight.toFixed(2)}</span>
                </div>
                <Slider min={0} max={2} step={0.1} value={[edgeWeight]} onValueChange={([v]) => setEdgeWeight(v)} />
              </div>
              <Button variant="outline" className="w-full" onClick={resetValues}>
                <RefreshCw className="w-4 h-4 mr-2" />
                随机初始化节点值
              </Button>
              <p className="text-xs text-gray-500">
                更新规则：每个新值 = (自身值 + w × 邻居值之和) / (1 + w × 邻居数)。
              </p>
            </div>
          }
        />
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
