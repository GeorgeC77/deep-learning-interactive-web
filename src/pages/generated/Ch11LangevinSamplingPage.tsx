import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wind, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch11/langevin-sampling';
const WIDTH = 600;
const HEIGHT = 360;
const MARGIN = { top: 20, right: 30, bottom: 45, left: 50 };

/* 1D energy function: double-well with a small barrier. */
function energy(x: number) {
  return 0.25 * x ** 4 - 0.5 * x ** 2 + 0.1 * x;
}

function gradEnergy(x: number) {
  return x ** 3 - x + 0.1;
}

function langevinDynamics(
  steps: number,
  eta: number,
  noiseStd: number,
  seed = 0
): { trajectory: number[]; accepted: number } {
  let s = seed || 54321;
  const randn = () => {
    const u1 = (s = (s * 9301 + 49297) % 233280) / 233280 || 1e-10;
    const u2 = (s = (s * 9301 + 49297) % 233280) / 233280;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  const trajectory: number[] = [];
  let x = -1.5; // start in left well
  for (let i = 0; i < steps; i++) {
    x = x - (eta / 2) * gradEnergy(x) + noiseStd * randn();
    trajectory.push(x);
  }
  return { trajectory, accepted: 0 };
}

function drawLangevin(
  svgEl: SVGSVGElement,
  trajectory: number[],
  _eta: number,
  _noiseStd: number,
  showTrajectory: boolean
) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  const xMin = -2.5;
  const xMax = 2.5;
  const xScale = d3.scaleLinear().domain([xMin, xMax]).range([MARGIN.left, WIDTH - MARGIN.right]);

  const energyData = d3.range(xMin, xMax + 0.02, 0.02).map((x) => [x, energy(x)] as [number, number]);
  const eMin = d3.min(energyData, (d) => d[1])!;
  const eMax = d3.max(energyData, (d) => d[1])!;
  const yScale = d3.scaleLinear().domain([eMin - 0.2, eMax + 0.3]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);

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
    .text('能量 E(x)');

  // Energy curve
  const line = d3
    .line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveBasis);

  g.append('path')
    .datum(energyData)
    .attr('fill', 'none')
    .attr('stroke', '#2563eb')
    .attr('stroke-width', 3)
    .attr('d', line);

  // Equilibrium distribution visualization via histogram of trajectory
  if (showTrajectory && trajectory.length > 0) {
    const bins = d3.bin().domain([xMin, xMax]).thresholds(40)(trajectory);
    const binWidth = xScale(bins[0].x1!) - xScale(bins[0].x0!);
    const maxCount = d3.max(bins, (b) => b.length) || 1;
    const histScale = d3.scaleLinear().domain([0, maxCount]).range([0, (HEIGHT - MARGIN.top - MARGIN.bottom) * 0.55]);

    g.selectAll('.hist-bar')
      .data(bins)
      .enter()
      .append('rect')
      .attr('class', 'hist-bar')
      .attr('x', (d) => xScale(d.x0!))
      .attr('y', (d) => yScale(eMin - 0.2) - histScale(d.length))
      .attr('width', Math.max(1, binWidth - 1))
      .attr('height', (d) => histScale(d.length))
      .attr('fill', '#10b981')
      .attr('opacity', 0.35);

    // Trajectory path at bottom
    const traceY = HEIGHT - MARGIN.bottom + 28;
    const traceScale = d3.scaleLinear().domain([0, trajectory.length]).range([MARGIN.left, WIDTH - MARGIN.right]);
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
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(trajectory)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.2)
      .attr('d', traceLine);

    g.append('text')
      .attr('x', MARGIN.left)
      .attr('y', traceY + 12)
      .attr('font-size', 10)
      .attr('fill', '#6b7280')
      .text('Langevin 轨迹');
  }

  // Current / final position marker
  if (trajectory.length) {
    const xf = trajectory[trajectory.length - 1];
    g.append('circle')
      .attr('cx', xScale(xf))
      .attr('cy', yScale(energy(xf)))
      .attr('r', 6)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);
  }

  // Legend
  const legend = g.append('g').attr('transform', `translate(${WIDTH - 140}, ${MARGIN.top})`);
  legend.append('rect').attr('width', 125).attr('height', 74).attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
  legend.append('line').attr('x1', 10).attr('y1', 18).attr('x2', 30).attr('y2', 18).attr('stroke', '#2563eb').attr('stroke-width', 3);
  legend.append('text').attr('x', 36).attr('y', 22).attr('font-size', 10).attr('fill', '#374151').text('能量 E(x)');
  legend.append('rect').attr('x', 10).attr('y', 32).attr('width', 20).attr('height', 10).attr('fill', '#10b981').attr('opacity', 0.35);
  legend.append('text').attr('x', 36).attr('y', 41).attr('font-size', 10).attr('fill', '#374151').text('轨迹直方图');
  legend.append('circle').attr('cx', 20).attr('cy', 60).attr('r', 4).attr('fill', '#ef4444');
    legend.append('text').attr('x', 36).attr('y', 64).attr('font-size', 10).attr('fill', '#374151').text('终点');
}

export default function Ch11LangevinSamplingPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [eta, setEta] = useState(0.05);
  const [noiseStd, setNoiseStd] = useState(0.15);
  const [steps, setSteps] = useState(1500);
  const [seed, setSeed] = useState(1);
  const [showTrajectory, setShowTrajectory] = useState(true);

  const { trajectory } = useMemo(() => langevinDynamics(steps, eta, noiseStd, seed), [steps, eta, noiseStd, seed]);

  const langevinRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (langevinRef.current) {
      drawLangevin(langevinRef.current, trajectory, eta, noiseStd, showTrajectory);
    }
  }, [trajectory, eta, noiseStd, showTrajectory]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Wind className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '14.3 Langevin 采样'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Langevin 动力学结合梯度信息与随机噪声，从能量模型中采样；是分数匹配、能量模型与扩散模型的理论基础。
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
            title="基于能量的模型"
            description="概率密度由能量函数通过 Boltzmann 分布定义。低能量区域对应高概率区域。"
          />
          <ConceptCard
            title="似然最大化"
            description="训练能量模型需最大化似然，对数似然梯度包含正相（数据）与负相（模型样本）两个期望。"
          />
          <ConceptCard
            title="Langevin 更新"
            description="沿能量下降方向移动并注入高斯噪声，在探索与利用之间取得平衡，使样本趋向于目标分布。"
          />
          <ConceptCard
            title="与分数匹配的联系"
            description="能量梯度对应分数函数。Langevin 采样可视为沿分数场移动，这与现代扩散模型一脉相承。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="Boltzmann 分布"
            formula={String.raw`p(x) = \frac{1}{Z} \exp(-E(x))`}
            description="Z 为配分函数，通常难以计算；Langevin 采样只需能量梯度，无需归一化常数。"
          />
          <FormulaCard
            title="Langevin 离散更新"
            formula={String.raw`x^{(\tau+1)} = x^{(\tau)} - \frac{\eta}{2} \nabla_x E(x^{(\tau)}) + \sqrt{\eta} \, \epsilon`}
            description="ε ∼ N(0, I)。梯度项使粒子滑向低能量，噪声项保证遍历性。"
          />
          <FormulaCard
            title="对数似然梯度"
            formula={String.raw`\nabla_\theta \ln p(x \mid \theta) = -\nabla_\theta E(x, \theta) + \mathbb{E}_{p(x \mid \theta)}\left[\nabla_\theta E(x, \theta)\right]`}
            description="负相期望通常通过 Langevin 采样从当前模型中生成样本来近似。"
          />
        </div>
      </section>

      {/* Langevin demo */}
      <InteractiveDemo title="交互演示：Langevin 动力学">
        <InteractivePanel
          hint="调整学习率 η 与噪声强度，观察粒子在双势阱能量面上的演化。η 过大可能不稳定，噪声过小则难以跨越势垒。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
              <svg ref={langevinRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: 400 }} />
            </div>
          }
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>学习率 η</span>
                  <span className="font-mono">{eta.toFixed(3)}</span>
                </div>
                <Slider min={0.005} max={0.2} step={0.005} value={[eta]} onValueChange={([v]) => setEta(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>噪声标准差</span>
                  <span className="font-mono">{noiseStd.toFixed(3)}</span>
                </div>
                <Slider min={0.01} max={0.5} step={0.01} value={[noiseStd]} onValueChange={([v]) => setNoiseStd(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>迭代步数</span>
                  <span className="font-mono">{steps}</span>
                </div>
                <Slider min={200} max={3000} step={100} value={[steps]} onValueChange={([v]) => setSteps(v)} />
              </div>
              <div className="flex items-center gap-3">
                <Button variant={showTrajectory ? 'default' : 'outline'} size="sm" onClick={() => setShowTrajectory(true)}>
                  显示轨迹
                </Button>
                <Button variant={!showTrajectory ? 'default' : 'outline'} size="sm" onClick={() => setShowTrajectory(false)}>
                  隐藏轨迹
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSeed((s) => s + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新运行
              </Button>
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                终点位置：{trajectory.length ? trajectory[trajectory.length - 1].toFixed(3) : '--'}
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
