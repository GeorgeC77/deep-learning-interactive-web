import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch08/sequence-models';

const WIDTH = 600;
const HEIGHT = 260;
const MARGIN = { top: 30, right: 30, bottom: 40, left: 40 };

const STATES = [
  { id: 0, name: '晴天', color: '#f59e0b' },
  { id: 1, name: '雨天', color: '#3b82f6' },
];

/* Deterministic PRNG for reproducibility. */
function createRand(seed: number) {
  let s = seed || 12345;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateMarkovChain(length: number, pStay: number, seed: number): number[] {
  const rand = createRand(seed);
  const chain = [rand() > 0.5 ? 1 : 0];
  for (let t = 1; t < length; t++) {
    const prev = chain[t - 1];
    const p = prev === 0 ? pStay : 1 - pStay;
    chain.push(rand() < p ? prev : 1 - prev);
  }
  return chain;
}

function drawMarkovChain(
  svgEl: SVGSVGElement,
  chain: number[],
  pStay: number
) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  const xScale = d3
    .scaleLinear()
    .domain([0, chain.length - 1])
    .range([MARGIN.left, WIDTH - MARGIN.right]);
  const yScale = d3.scaleLinear().domain([-0.2, 1.2]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  // Axes
  svg
    .append('g')
    .attr('transform', `translate(0,${HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale).ticks(Math.min(chain.length, 10)).tickFormat((d) => `t=${d}`))
    .call((sel) => sel.select('.domain').attr('stroke', '#e5e7eb'))
    .call((sel) => sel.selectAll('.tick line').attr('stroke', '#e5e7eb'))
    .call((sel) => sel.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 11));

  svg
    .append('text')
    .attr('x', (WIDTH + MARGIN.left - MARGIN.right) / 2)
    .attr('y', HEIGHT - 8)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', '#374151')
    .text('时间步 t');

  // State labels
  svg
    .append('text')
    .attr('x', MARGIN.left - 10)
    .attr('y', yScale(0))
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 12)
    .attr('fill', STATES[0].color)
    .text(STATES[0].name);

  svg
    .append('text')
    .attr('x', MARGIN.left - 10)
    .attr('y', yScale(1))
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 12)
    .attr('fill', STATES[1].color)
    .text(STATES[1].name);

  // Transition line
  const line = d3
    .line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveStepAfter);

  svg
    .append('path')
    .datum(chain)
    .attr('fill', 'none')
    .attr('stroke', '#6b7280')
    .attr('stroke-width', 2)
    .attr('d', line);

  // Points
  svg
    .selectAll('.point')
    .data(chain)
    .enter()
    .append('circle')
    .attr('cx', (_, i) => xScale(i))
    .attr('cy', (d) => yScale(d))
    .attr('r', 5)
    .attr('fill', (d) => STATES[d].color)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2);

  // Legend / stats
  const sunnyCount = chain.filter((d) => d === 0).length;
  const legend = svg.append('g').attr('transform', `translate(${WIDTH - 180}, ${MARGIN.top})`);
  legend
    .append('rect')
    .attr('width', 160)
    .attr('height', 80)
    .attr('rx', 6)
    .attr('fill', 'white')
    .attr('stroke', '#e5e7eb');

  legend
    .append('circle')
    .attr('cx', 14)
    .attr('cy', 18)
    .attr('r', 5)
    .attr('fill', STATES[0].color);
  legend
    .append('text')
    .attr('x', 26)
    .attr('y', 22)
    .attr('font-size', 11)
    .attr('fill', '#374151')
    .text(`${STATES[0].name}: ${sunnyCount}`);

  legend
    .append('circle')
    .attr('cx', 14)
    .attr('cy', 40)
    .attr('r', 5)
    .attr('fill', STATES[1].color);
  legend
    .append('text')
    .attr('x', 26)
    .attr('y', 44)
    .attr('font-size', 11)
    .attr('fill', '#374151')
    .text(`${STATES[1].name}: ${chain.length - sunnyCount}`);

  legend
    .append('text')
    .attr('x', 14)
    .attr('y', 68)
    .attr('font-size', 11)
    .attr('fill', '#374151')
    .text(`保持概率 p=${pStay.toFixed(2)}`);
}

export default function Ch08SequenceModelsPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [length, setLength] = useState(30);
  const [pStay, setPStay] = useState(0.8);
  const [seed, setSeed] = useState(1);

  const chain = useMemo(() => generateMarkovChain(length, pStay, seed), [length, pStay, seed]);

  const chartRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (chartRef.current) {
      drawMarkovChain(chartRef.current, chain, pStay);
    }
  }, [chain, pStay]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Clock className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '11.3 序列模型'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          序列模型捕捉时间或顺序上的依赖；隐马尔可夫模型与线性动态系统是经典代表，现代则由 RNN 与 Transformer 扩展。
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
            title="马尔可夫假设"
            description="当前状态仅依赖有限历史，最常见的是一阶马尔可夫假设：x_t 只依赖 x_{t-1}。"
          />
          <ConceptCard
            title="隐马尔可夫模型"
            description="观测由隐状态生成，隐状态按马尔可夫链演化；前向-后向算法可高效推断隐状态。"
          />
          <ConceptCard
            title="转移矩阵"
            description='转移矩阵 A 的元素 A_{ij} 表示从状态 j 转移到状态 i 的概率，每列之和为 1。'
          />
          <ConceptCard
            title="线性动态系统"
            description="连续隐状态按线性高斯转移，观测也是线性高斯模型，可用卡尔曼滤波推断。"
          />
          <ConceptCard
            title="现代扩展"
            description="RNN、LSTM、Transformer 将序列模型扩展到高维、长程依赖与大规模语言建模。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="一阶马尔可夫链"
            formula={String.raw`p(x_1,\dots,x_T) = p(x_1) \prod_{t=2}^{T} p(x_t \mid x_{t-1})`}
            description="联合分布被分解为初始分布与一系列转移概率的乘积。"
          />
          <FormulaCard
            title="隐马尔可夫模型"
            formula={String.raw`p(\mathbf{X}, \mathbf{Z}) = p(z_1) \left[\prod_{t=2}^{T} p(z_t \mid z_{t-1})\right] \left[\prod_{t=1}^{T} p(x_t \mid z_t)\right]`}
            description="Z 为隐状态序列，X 为观测序列；转移与发射概率分别建模。"
          />
          <FormulaCard
            title="前向算法"
            formula={String.raw`\alpha(z_t) = p(x_t \mid z_t) \sum_{z_{t-1}} \alpha(z_{t-1}) p(z_t \mid z_{t-1})`}
            description="递归计算部分观测下的隐状态滤波分布，避免直接枚举所有隐状态序列。"
          />
        </div>
      </section>

      {/* Interactive demo: Markov chain */}
      <InteractiveDemo title="交互演示：简单马尔可夫链">
        <InteractivePanel
          hint="调整序列长度与状态保持概率，观察生成的状态序列。保持概率越高，序列中同一状态的连续段越长。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
              <svg ref={chartRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: 260 }} />
            </div>
          }
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>序列长度 T</span>
                  <span className="font-mono">{length}</span>
                </div>
                <Slider min={10} max={100} step={5} value={[length]} onValueChange={([v]) => setLength(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>保持概率 p</span>
                  <span className="font-mono">{pStay.toFixed(2)}</span>
                </div>
                <Slider min={0.5} max={0.99} step={0.01} value={[pStay]} onValueChange={([v]) => setPStay(v)} />
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSeed((s) => s + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新生成
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">晴天</div>
                  <div className="text-xl font-bold text-amber-600">
                    {chain.filter((d) => d === 0).length}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">雨天</div>
                  <div className="text-xl font-bold text-blue-600">
                    {chain.filter((d) => d === 1).length}
                  </div>
                </div>
              </div>
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
