import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shuffle, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch11/basic-sampling-algorithms';
const WIDTH = 600;
const HEIGHT = 360;
const MARGIN = { top: 20, right: 30, bottom: 45, left: 50 };

/* Target distribution: mixture of two Gaussians scaled to [0, 1]. */
function targetPdf(x: number) {
  const mu1 = 0.35;
  const mu2 = 0.7;
  const s1 = 0.06;
  const s2 = 0.08;
  const w1 = 0.55;
  const w2 = 0.45;
  const g1 = w1 * Math.exp(-0.5 * ((x - mu1) / s1) ** 2) / (s1 * Math.sqrt(2 * Math.PI));
  const g2 = w2 * Math.exp(-0.5 * ((x - mu2) / s2) ** 2) / (s2 * Math.sqrt(2 * Math.PI));
  return g1 + g2;
}

/* Proposal: uniform on [0, 1] -> pdf = 1. */
function proposalPdf() {
  return 1;
}

function findMaxTarget(samples = 1000) {
  let m = 0;
  for (let i = 0; i <= samples; i++) {
    m = Math.max(m, targetPdf(i / samples));
  }
  return m;
}

interface RejectionPoint {
  x: number;
  y: number;
  accepted: boolean;
}

function runRejectionSampling(count: number, k: number, seed = 0): RejectionPoint[] {
  // Simple deterministic pseudo-random for reproducibility across re-renders.
  let s = seed || 12345;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const points: RejectionPoint[] = [];
  for (let i = 0; i < count; i++) {
    const x = rand();
    const y = rand() * k * proposalPdf();
    const p = targetPdf(x);
    points.push({ x, y, accepted: y <= p });
  }
  return points;
}

function drawRejectionSampling(
  svgEl: SVGSVGElement,
  points: RejectionPoint[],
  k: number
) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  const xScale = d3.scaleLinear().domain([0, 1]).range([MARGIN.left, WIDTH - MARGIN.right]);
  const yScale = d3.scaleLinear().domain([0, k * 1.15]).range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const g = svg.append('g');

  // Grid
  g.append('g')
    .attr('transform', `translate(0,${HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale).ticks(6).tickSize(-(HEIGHT - MARGIN.top - MARGIN.bottom)))
    .call((sel) => sel.select('.domain').remove())
    .call((sel) => sel.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'))
    .call((sel) => sel.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 11));

  g.append('g')
    .attr('transform', `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-(WIDTH - MARGIN.left - MARGIN.right)))
    .call((sel) => sel.select('.domain').remove())
    .call((sel) => sel.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'))
    .call((sel) => sel.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 11));

  // Axis labels
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
    .text('概率密度');

  // Proposal line (uniform envelope)
  g.append('line')
    .attr('x1', xScale(0))
    .attr('y1', yScale(k))
    .attr('x2', xScale(1))
    .attr('y2', yScale(k))
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,4');

  // Target curve
  const lineData = d3.range(0, 1.001, 0.005).map((x) => [x, targetPdf(x)] as [number, number]);
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

  // Points
  g.selectAll('.point')
    .data(points)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', (d) => (d.accepted ? 4 : 3))
    .attr('fill', (d) => (d.accepted ? '#10b981' : '#ef4444'))
    .attr('opacity', (d) => (d.accepted ? 0.85 : 0.5))
    .attr('stroke', (d) => (d.accepted ? '#059669' : '#b91c1c'))
    .attr('stroke-width', 1);

  // Legend
  const legend = g.append('g').attr('transform', `translate(${WIDTH - 160}, ${MARGIN.top})`);
  legend
    .append('rect')
    .attr('width', 150)
    .attr('height', 78)
    .attr('rx', 6)
    .attr('fill', 'white')
    .attr('stroke', '#e5e7eb');

  legend.append('line').attr('x1', 10).attr('y1', 18).attr('x2', 30).attr('y2', 18).attr('stroke', '#2563eb').attr('stroke-width', 3);
  legend.append('text').attr('x', 36).attr('y', 22).attr('font-size', 10).attr('fill', '#374151').text('目标分布 p(x)');

  legend
    .append('line')
    .attr('x1', 10)
    .attr('y1', 38)
    .attr('x2', 30)
    .attr('y2', 38)
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '4,3');
  legend.append('text').attr('x', 36).attr('y', 42).attr('font-size', 10).attr('fill', '#374151').text('提议包络 kq(x)');

  legend.append('circle').attr('cx', 20).attr('cy', 58).attr('r', 4).attr('fill', '#10b981');
  legend.append('text').attr('x', 36).attr('y', 62).attr('font-size', 10).attr('fill', '#374151').text('接受');

  legend.append('circle').attr('cx', 20).attr('cy', 74).attr('r', 3).attr('fill', '#ef4444').attr('opacity', 0.5);
  legend.append('text').attr('x', 36).attr('y', 78).attr('font-size', 10).attr('fill', '#374151').text('拒绝');
}

/* Importance sampling demo utilities. Target N(0,1), proposal N(mu, 1). */
function stdNormalPdf(x: number) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function proposalNormalPdf(x: number, mu: number) {
  return Math.exp(-0.5 * (x - mu) ** 2) / Math.sqrt(2 * Math.PI);
}

export default function Ch11BasicSamplingAlgorithmsPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [sampleCount, setSampleCount] = useState(300);
  const [k, setK] = useState(2.5);
  const [rejectionSeed, setRejectionSeed] = useState(1);
  const [importanceMu, setImportanceMu] = useState(1.2);
  const [importanceSeed, setImportanceSeed] = useState(1);

  const maxTarget = useMemo(() => findMaxTarget(), []);

  const rejectionPoints = useMemo(
    () => runRejectionSampling(sampleCount, k, rejectionSeed),
    [sampleCount, k, rejectionSeed]
  );
  const acceptedCount = rejectionPoints.filter((p) => p.accepted).length;
  const acceptanceRate = rejectionPoints.length ? acceptedCount / rejectionPoints.length : 0;
  const theoreticalRate = maxTarget / k;

  const rejectionRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (rejectionRef.current) {
      drawRejectionSampling(rejectionRef.current, rejectionPoints, k);
    }
  }, [rejectionPoints, k]);

  /* Importance sampling estimate of E[x^2] under N(0,1). */
  const importanceResult = useMemo(() => {
    let s = importanceSeed || 42;
    const rand = () => {
      // Box-Muller for N(mu, 1)
      const u1 = (s = (s * 9301 + 49297) % 233280) / 233280 || 1e-10;
      const u2 = (s = (s * 9301 + 49297) % 233280) / 233280;
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return z + importanceMu;
    };
    const n = 500;
    let weightedSum = 0;
    let weightSum = 0;
    for (let i = 0; i < n; i++) {
      const x = rand();
      const w = stdNormalPdf(x) / proposalNormalPdf(x, importanceMu);
      weightedSum += w * x * x;
      weightSum += w;
    }
    const estimate = weightedSum / weightSum; // self-normalized
    const trueValue = 1; // E[x^2] for N(0,1)
    return { estimate, trueValue, effectiveSampleSize: n / (1 + importanceMu * importanceMu) };
  }, [importanceMu, importanceSeed]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Shuffle className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '14.1 基本采样算法'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          基本采样算法从简单分布生成样本：逆变换、拒绝采样、自适应拒绝采样、重要性采样与采样-重要性重采样（SIR）构成了蒙特卡洛方法的基础。
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
            title="逆变换采样"
            description="对均匀随机变量应用累积分布函数的逆函数，得到目标分布样本。适用于 CDF 可解析求逆的分布。"
          />
          <ConceptCard
            title="拒绝采样"
            description="需要提议分布 q 满足 kq(x) ≥ p(x)。在高维空间中，常数 k 会急剧增大，导致接受率极低。"
          />
          <ConceptCard
            title="自适应拒绝采样"
            description="对 log-concave 分布，用切线构造逐段指数包络，随着拒绝点增加不断收紧包络，提高效率。"
          />
          <ConceptCard
            title="采样-重要性重采样 (SIR)"
            description="先用重要性采样获得加权样本，再按权重重采样生成近似服从目标分布的无权重样本。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="蒙特卡洛期望"
            formula={String.raw`\mathbb{E}_{p}[f] = \int f(x) p(x) \, dx \approx \frac{1}{N} \sum_{n=1}^{N} f(x_n)`}
            description="当 x_n 独立来自 p(x) 时，该估计几乎必然收敛到真实期望。"
          />
          <FormulaCard
            title="拒绝采样接受概率"
            formula={String.raw`A = \min\left(1, \frac{\tilde{p}(x)}{kq(x)}\right)`}
            description="若 kq(x) 处处覆盖目标分布的未归一化版本 p̃(x)，则接受样本服从 p(x)。"
          />
          <FormulaCard
            title="重要性采样"
            formula={String.raw`\mathbb{E}_{p}[f] = \mathbb{E}_{q}\left[ f(x) \frac{p(x)}{q(x)} \right] \approx \frac{1}{N} \sum_{n=1}^{N} f(x_n) \frac{p(x_n)}{q(x_n)}`}
            description="即使只能从 q(x) 采样，也可用重要性权重 p/q 校正分布差异。"
          />
        </div>
      </section>

      {/* Rejection sampling demo */}
      <InteractiveDemo title="交互演示：拒绝采样">
        <InteractivePanel
          hint="调整包络常数 k 与样本数量，观察接受率的变化。k 越接近目标峰值，接受率越高，但包络必须始终覆盖目标分布。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
              <svg ref={rejectionRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: 400 }} />
            </div>
          }
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>包络常数 k</span>
                  <span className="font-mono">{k.toFixed(2)}</span>
                </div>
                <Slider min={maxTarget * 1.05} max={maxTarget * 4} step={0.05} value={[k]} onValueChange={([v]) => setK(v)} />
                <p className="text-xs text-gray-500 mt-1">kq(x) 必须覆盖 p(x)</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>样本数量</span>
                  <span className="font-mono">{sampleCount}</span>
                </div>
                <Slider min={50} max={1000} step={50} value={[sampleCount]} onValueChange={([v]) => setSampleCount(v)} />
              </div>
              <Button variant="outline" className="w-full" onClick={() => setRejectionSeed((s) => s + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新采样
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">接受率</div>
                  <div className="text-xl font-bold text-blue-700">{(acceptanceRate * 100).toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">理论上限</div>
                  <div className="text-xl font-bold text-gray-700">{(theoreticalRate * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          }
        />
      </InteractiveDemo>

      {/* Importance sampling demo */}
      <InteractiveDemo title="交互演示：重要性采样权重">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[65%] space-y-4">
            <p className="text-sm text-gray-700">
              目标分布 <KaTeX math={String.raw`p(x)=\mathcal{N}(0,1)`} />，提议分布{' '}
              <KaTeX math={String.raw`q(x)=\mathcal{N}(\mu,1)`} />。我们用重要性采样估计{' '}
              <KaTeX math={String.raw`\mathbb{E}_p[x^2]`} />。当 q 与 p 差异越大（|μ| 越大），权重越不均匀，有效样本量越少。
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-xs text-gray-600">估计值</div>
                <div className="text-xl font-bold text-blue-700">{importanceResult.estimate.toFixed(3)}</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg text-center">
                <div className="text-xs text-gray-600">真实值</div>
                <div className="text-xl font-bold text-emerald-700">{importanceResult.trueValue.toFixed(3)}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <div className="text-xs text-gray-600">近似有效样本</div>
                <div className="text-xl font-bold text-amber-700">{importanceResult.effectiveSampleSize.toFixed(0)}</div>
              </div>
            </div>
            <FormulaCard
              title="重要性权重"
              formula={String.raw`w(x) = \frac{p(x)}{q(x)} = \exp\left(-\mu x + \frac{\mu^2}{2}\right)`}
              description="权重随 x 与 μ 的相对位置变化；q 偏离 p 越远，方差越大。"
            />
          </div>
          <div className="w-full lg:w-[35%] space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>提议均值 μ</span>
                <span className="font-mono">{importanceMu.toFixed(2)}</span>
              </div>
              <Slider min={-3} max={3} step={0.1} value={[importanceMu]} onValueChange={([v]) => setImportanceMu(v)} />
            </div>
            <Button variant="outline" className="w-full" onClick={() => setImportanceSeed((s) => s + 1)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新采样
            </Button>
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
