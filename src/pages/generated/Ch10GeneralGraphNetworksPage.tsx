import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch10/general-graph-networks';

interface Neighbor {
  id: number;
  value: number;
}

const WIDTH = 520;
const HEIGHT = 280;

function computeAggregation(values: number[], agg: 'sum' | 'mean' | 'max'): number {
  if (values.length === 0) return 0;
  if (agg === 'sum') return values.reduce((a, b) => a + b, 0);
  if (agg === 'mean') return values.reduce((a, b) => a + b, 0) / values.length;
  return Math.max(...values);
}

function drawAggregation(
  svgEl: SVGSVGElement,
  neighbors: Neighbor[],
  agg: 'sum' | 'mean' | 'max'
) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;
  const radius = 90;

  // Center node
  svg
    .append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 32)
    .attr('fill', '#2563eb')
    .attr('stroke', '#1e40af')
    .attr('stroke-width', 2);
  svg
    .append('text')
    .attr('x', centerX)
    .attr('y', centerY + 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .attr('font-weight', 600)
    .attr('fill', '#ffffff')
    .text('v');

  const angleStep = (2 * Math.PI) / Math.max(neighbors.length, 1);
  neighbors.forEach((n, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const nx = centerX + radius * Math.cos(angle);
    const ny = centerY + radius * Math.sin(angle);

    svg
      .append('line')
      .attr('x1', nx)
      .attr('y1', ny)
      .attr('x2', centerX)
      .attr('y2', centerY)
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 2);

    const color = n.value > 0 ? '#10b981' : '#ef4444';
    svg
      .append('circle')
      .attr('cx', nx)
      .attr('cy', ny)
      .attr('r', 20 + Math.abs(n.value) * 8)
      .attr('fill', color)
      .attr('stroke', '#374151')
      .attr('stroke-width', 2);

    svg
      .append('text')
      .attr('x', nx)
      .attr('y', ny + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('fill', '#ffffff')
      .text(n.value.toFixed(1));
  });

  const result = computeAggregation(neighbors.map((n) => n.value), agg);
  const resultColor = result > 0 ? '#059669' : result < 0 ? '#dc2626' : '#4b5563';

  svg
    .append('text')
    .attr('x', centerX)
    .attr('y', centerY + 55)
    .attr('text-anchor', 'middle')
    .attr('font-size', 13)
    .attr('fill', '#374151')
    .text(`${agg === 'sum' ? '求和' : agg === 'mean' ? '均值' : '最大值'}聚合`);

  svg
    .append('text')
    .attr('x', centerX)
    .attr('y', centerY + 75)
    .attr('text-anchor', 'middle')
    .attr('font-size', 16)
    .attr('font-weight', 700)
    .attr('fill', resultColor)
    .text(result.toFixed(2));
}

export default function Ch10GeneralGraphNetworksPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [agg, setAgg] = useState<'sum' | 'mean' | 'max'>('mean');
  const [neighborCount, setNeighborCount] = useState(5);
  const [seed, setSeed] = useState(1);

  const neighbors = useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: neighborCount }, (_, i) => ({
      id: i,
      value: Math.round((rand() * 2 - 1) * 10) / 10,
    }));
  }, [neighborCount, seed]);

  const chartRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (chartRef.current) {
      drawAggregation(chartRef.current, neighbors, agg);
    }
  }, [neighbors, agg]);

  const result = useMemo(() => computeAggregation(neighbors.map((n) => n.value), agg), [neighbors, agg]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Hexagon className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '13.3 通用图网络'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          通用图网络同时处理节点、边与全局特征；图注意力、几何深度学习等扩展提升了表达能力与物理一致性。
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
            title="边与全局更新"
            description="通用图网络同时更新节点、边与全局表示，使模型能够表达更丰富的图级推理。"
          />
          <ConceptCard
            title="图注意力网络"
            description="GAT 为不同邻居学习自适应权重，避免 GCN 固定归一化带来的表达能力限制。"
          />
          <ConceptCard
            title="过平滑问题"
            description="深层 GNN 中节点表示趋于一致，可通过残差连接、DropEdge 或深层网络设计缓解。"
          />
          <ConceptCard
            title="几何深度学习"
            description="在具有几何结构的图（如分子、点云）上，模型需保持旋转、平移、置换等对称性。"
          />
          <ConceptCard
            title="聚合函数选择"
            description="求和、均值、最大值聚合各有优劣；求和保留计数信息，最大值突出显著特征。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="图注意力系数"
            formula={String.raw`\alpha_{uv} = \frac{\exp\left(\text{LeakyReLU}\left(\mathbf{a}^{\top} [W \mathbf{h}_u \| W \mathbf{h}_v]\right)\right)}{\sum_{k \in \mathcal{N}(u)} \exp\left(\text{LeakyReLU}\left(\mathbf{a}^{\top} [W \mathbf{h}_u \| W \mathbf{h}_k]\right)\right)}`}
            description="注意力系数衡量邻居对当前节点的重要性，Softmax 保证权重归一化。"
          />
          <FormulaCard
            title="通用图网络更新"
            formula={String.raw`\mathbf{e}'_{uv} = \phi^e(\mathbf{e}_{uv}, \mathbf{h}_u, \mathbf{h}_v, \mathbf{u}), \quad \mathbf{h}'_v = \phi^h\left(\mathbf{h}_v, \sum_{u \in \mathcal{N}(v)} \mathbf{e}'_{uv}, \mathbf{u}\right)`}
            description="φ^e 与 φ^h 为 MLP，u 为全局特征；该框架统一了多种 GNN 变体。"
          />
          <FormulaCard
            title="求和 vs 均值 vs 最大值"
            formula={String.raw`\text{sum} = \sum_{u} \mathbf{m}_{uv}, \quad \text{mean} = \frac{1}{|\mathcal{N}(v)|}\sum_{u} \mathbf{m}_{uv}, \quad \text{max} = \max_{u} \mathbf{m}_{uv}`}
            description="三种聚合都是置换不变的，但对邻居分布的敏感性不同。"
          />
        </div>
      </section>

      {/* Interactive demo: aggregation comparison */}
      <InteractiveDemo title="交互演示：聚合函数对比">
        <InteractivePanel
          hint="选择聚合方式并调整邻居数量，观察同一组邻居值在 sum、mean、max 下的不同结果。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden flex justify-center">
              <svg ref={chartRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full max-w-[520px] h-auto" style={{ maxHeight: 280 }} />
            </div>
          }
          controls={
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {(['sum', 'mean', 'max'] as const).map((a) => (
                  <Button
                    key={a}
                    variant={agg === a ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAgg(a)}
                  >
                    {a === 'sum' ? '求和' : a === 'mean' ? '均值' : '最大值'}
                  </Button>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>邻居数量</span>
                  <span className="font-mono">{neighborCount}</span>
                </div>
                <Slider min={3} max={12} step={1} value={[neighborCount]} onValueChange={([v]) => setNeighborCount(v)} />
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSeed((s) => s + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                随机邻居值
              </Button>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-xs text-gray-600">聚合结果</div>
                <div className="text-2xl font-bold text-blue-700">{result.toFixed(2)}</div>
              </div>
              <p className="text-xs text-gray-500">
                红色节点为负值，绿色节点为正值。求和对邻居数量敏感，最大值只关注最显著信号。
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
