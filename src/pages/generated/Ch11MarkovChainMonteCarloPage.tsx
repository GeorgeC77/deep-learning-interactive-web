import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Route, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch11/markov-chain-monte-carlo';
const WIDTH = 600;
const HEIGHT = 360;
const MARGIN = { top: 20, right: 30, bottom: 45, left: 50 };

/* Target: mixture of two Gaussians on [-3, 3]. */
function targetPdf(x: number) {
  const mu1 = -1.2;
  const mu2 = 1.2;
  const s = 0.4;
  const g1 = Math.exp(-0.5 * ((x - mu1) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  const g2 = Math.exp(-0.5 * ((x - mu2) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  return 0.5 * g1 + 0.5 * g2;
}

function metropolisHastings(
  steps: number,
  proposalStd: number,
  burnIn: number,
  seed = 0
): { chain: number[]; accepted: number } {
  let s = seed || 98765;
  const randn = () => {
    // Box-Muller
    const u1 = (s = (s * 9301 + 49297) % 233280) / 233280 || 1e-10;
    const u2 = (s = (s * 9301 + 49297) % 233280) / 233280;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  const uniform = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  let x = 0;
  const chain: number[] = [];
  let accepted = 0;

  for (let i = 0; i < steps + burnIn; i++) {
    const xp = x + proposalStd * randn();
    const a = Math.min(1, targetPdf(xp) / targetPdf(x));
    if (uniform() < a) {
      x = xp;
      if (i >= burnIn) accepted++;
    }
    if (i >= burnIn) chain.push(x);
  }
  return { chain, accepted };
}

function drawMCMC(
  svgEl: SVGSVGElement,
  chain: number[],
  _burnIn: number,
  _proposalStd: number,
  showHistogram: boolean
) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  const xMin = -3.5;
  const xMax = 3.5;
  const xScale = d3.scaleLinear().domain([xMin, xMax]).range([MARGIN.left, WIDTH - MARGIN.right]);

  // Target curve
  const lineData = d3.range(xMin, xMax + 0.02, 0.02).map((x) => [x, targetPdf(x)] as [number, number]);
  const yMax = d3.max(lineData, (d) => d[1])! * 1.2;
  const yScale = d3.scaleLinear().domain([0, yMax]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const g = svg.append('g');

  // Grid
  g.append('g')
    .attr('transform', `translate(0,${HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale).ticks(8).tickSize(-(HEIGHT - MARGIN.top - MARGIN.bottom)))
    .call((sel) => sel.select('.domain').remove())
    .call((sel) => sel.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'))
    .call((sel) => sel.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 11));

  g.append('g')
    .attr('transform', `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-(WIDTH - MARGIN.left - MARGIN.right)))
    .call((sel) => sel.select('.domain').remove())
    .call((sel) => sel.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'))
    .call((sel) => sel.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 11));

  g.append('text')
    .attr('x', (WIDTH + MARGIN.left - MARGIN.right) / 2)
    .attr('y', HEIGHT - 8)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', '#374151')
    .text('x');

  g.append('text')
    .attr('x', 18)
    .attr('y', HEIGHT / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', '#374151')
    .attr('transform', `rotate(-90, 18, ${HEIGHT / 2})`)
    .text('密度');

  // Target curve
  const line = d3
    .line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveBasis);

  g.append('path')
    .datum(lineData)
    .attr('fill', 'none')
    .attr('stroke', '#2563eb')
    .attr('stroke-width', 3)
    .attr('d', line);

  // Histogram of samples
  if (showHistogram && chain.length > 0) {
    const bins = d3.bin().domain([xMin, xMax]).thresholds(40)(chain);
    const binWidth = xScale(bins[0].x1!) - xScale(bins[0].x0!);
    const histScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (b) => b.length) || 1])
      .range([0, HEIGHT - MARGIN.top - MARGIN.bottom]);

    g.selectAll('.hist-bar')
      .data(bins)
      .enter()
      .append('rect')
      .attr('class', 'hist-bar')
      .attr('x', (d) => xScale(d.x0!))
      .attr('y', (d) => yScale(0) - histScale(d.length))
      .attr('width', Math.max(1, binWidth - 1))
      .attr('height', (d) => histScale(d.length))
      .attr('fill', '#10b981')
      .attr('opacity', 0.35);
  }

  // Trace path of first 150 samples (post burn-in) to visualize Markov chain
  const traceSamples = chain.slice(0, Math.min(200, chain.length));
  const traceY = HEIGHT - MARGIN.bottom + 28; // small trace area at bottom
  const traceScale = d3.scaleLinear().domain([0, traceSamples.length]).range([MARGIN.left, WIDTH - MARGIN.right]);
  const traceXScale = d3.scaleLinear().domain([xMin, xMax]).range([traceY, traceY - 28]);

  g.append('line')
    .attr('x1', MARGIN.left)
    .attr('y1', traceY)
    .attr('x2', WIDTH - MARGIN.right)
    .attr('y2', traceY)
    .attr('stroke', '#9ca3af')
    .attr('stroke-width', 1);

  const traceLine = d3
    .line<number>()
    .x((_, i) => traceScale(i))
    .y((d) => traceXScale(d))
    .curve(d3.curveStepAfter);

  g.append('path')
    .datum(traceSamples)
    .attr('fill', 'none')
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 1.5)
    .attr('d', traceLine);

  // Legend
  const legend = g.append('g').attr('transform', `translate(${WIDTH - 150}, ${MARGIN.top})`);
  legend.append('rect').attr('width', 135).attr('height', 78).attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
  legend.append('line').attr('x1', 10).attr('y1', 18).attr('x2', 30).attr('y2', 18).attr('stroke', '#2563eb').attr('stroke-width', 3);
  legend.append('text').attr('x', 36).attr('y', 22).attr('font-size', 10).attr('fill', '#374151').text('目标分布');
  legend.append('rect').attr('x', 10).attr('y', 32).attr('width', 20).attr('height', 10).attr('fill', '#10b981').attr('opacity', 0.35);
  legend.append('text').attr('x', 36).attr('y', 41).attr('font-size', 10).attr('fill', '#374151').text('样本直方图');
  legend.append('line').attr('x1', 10).attr('y1', 56).attr('x2', 30).attr('y2', 56).attr('stroke', '#f59e0b').attr('stroke-width', 1.5);
  legend.append('text').attr('x', 36).attr('y', 60).attr('font-size', 10).attr('fill', '#374151').text('链轨迹');

  g.append('text')
    .attr('x', MARGIN.left)
    .attr('y', traceY + 12)
    .attr('font-size', 10)
    .attr('fill', '#6b7280')
    .text('前 200 步链轨迹');
}

export default function Ch11MarkovChainMonteCarloPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [proposalStd, setProposalStd] = useState(0.5);
  const [burnIn, setBurnIn] = useState(200);
  const [totalSteps, setTotalSteps] = useState(2000);
  const [showHistogram, setShowHistogram] = useState(true);
  const [seed, setSeed] = useState(1);

  const { chain, accepted } = useMemo(
    () => metropolisHastings(totalSteps, proposalStd, burnIn, seed),
    [totalSteps, proposalStd, burnIn, seed]
  );
  const acceptanceRate = chain.length ? accepted / chain.length : 0;
  const postBurnIn = chain;

  const mcmcRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (mcmcRef.current) {
      drawMCMC(mcmcRef.current, postBurnIn, burnIn, proposalStd, showHistogram);
    }
  }, [postBurnIn, burnIn, proposalStd, showHistogram]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Route className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '14.2 马尔可夫链蒙特卡洛'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          MCMC 通过构建马尔可夫链产生相关样本，使得链的平稳分布等于目标分布。Metropolis-Hastings 与 Gibbs 采样是最常用的两类算法。
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
            title="Metropolis 算法"
            description="按对称提议分布扰动当前样本，以接受概率决定是否转移到新状态。接受概率只依赖目标分布比值，无需归一化常数。"
          />
          <ConceptCard
            title="细致平衡"
            description="转移核满足细致平衡条件时，链的平稳分布即为目标分布。Metropolis-Hastings 通过校正因子保证非对称提议也满足该条件。"
          />
          <ConceptCard
            title="Gibbs 采样"
            description="逐个变量依条件分布采样，特别适用于条件分布易采样的图模型。每次更新都可视为 Metropolis-Hastings 中接受率为 1 的特殊情形。"
          />
          <ConceptCard
            title="祖先采样"
            description="对有向图模型，按拓扑顺序从根节点到叶节点依次采样，利用条件概率分解直接生成联合样本。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="Metropolis-Hastings 接受概率"
            formula={String.raw`A(x^* \mid x) = \min\left(1, \frac{\tilde{p}(x^*) q(x \mid x^*)}{\tilde{p}(x) q(x^* \mid x)}\right)`}
            description="x* 为候选点，q 为提议分布。对于对称提议，退化为 Metropolis 比率 p̃(x*)/p̃(x)。"
          />
          <FormulaCard
            title="细致平衡条件"
            formula={String.raw`p^*(x) T(x \to x') = p^*(x') T(x' \to x)`}
            description="其中 T 为转移概率，p* 为平稳分布。满足该条件可保证链收敛到 p*。"
          />
          <FormulaCard
            title="Gibbs 采样更新"
            formula={String.raw`x_i^{(\tau+1)} \sim p\left(x_i \mid x_{\setminus i}^{(\tau)}\right)`}
            description="每次只更新一个变量，其他变量保持不变，条件分布通常更易于采样。"
          />
        </div>
      </section>

      {/* Metropolis-Hastings demo */}
      <InteractiveDemo title="交互演示：Metropolis-Hastings">
        <InteractivePanel
          hint="调整提议分布的标准差与 burn-in 步数，观察链如何探索双峰目标分布。提议方差过大导致拒绝率升高，过小则混合缓慢。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
              <svg ref={mcmcRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: 400 }} />
            </div>
          }
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>提议标准差 σ</span>
                  <span className="font-mono">{proposalStd.toFixed(2)}</span>
                </div>
                <Slider min={0.05} max={2.0} step={0.05} value={[proposalStd]} onValueChange={([v]) => setProposalStd(v)} />
                <p className="text-xs text-gray-500 mt-1">控制每步跳转幅度</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Burn-in 步数</span>
                  <span className="font-mono">{burnIn}</span>
                </div>
                <Slider min={0} max={1000} step={50} value={[burnIn]} onValueChange={([v]) => setBurnIn(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>总采样步数</span>
                  <span className="font-mono">{totalSteps}</span>
                </div>
                <Slider min={500} max={5000} step={250} value={[totalSteps]} onValueChange={([v]) => setTotalSteps(v)} />
              </div>
              <div className="flex items-center gap-3">
                <Button variant={showHistogram ? 'default' : 'outline'} size="sm" onClick={() => setShowHistogram(true)}>
                  显示直方图
                </Button>
                <Button variant={!showHistogram ? 'default' : 'outline'} size="sm" onClick={() => setShowHistogram(false)}>
                  隐藏直方图
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSeed((s) => s + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新运行链
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">接受率</div>
                  <div className="text-xl font-bold text-blue-700">{(acceptanceRate * 100).toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">有效样本数</div>
                  <div className="text-xl font-bold text-gray-700">{postBurnIn.length}</div>
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
