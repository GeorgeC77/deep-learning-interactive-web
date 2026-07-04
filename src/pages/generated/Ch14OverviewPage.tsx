import { useMemo, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swords, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import * as d3 from 'd3';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch14/overview';
const PLOT_WIDTH = 560;
const PLOT_HEIGHT = 320;
const MARGIN = { top: 20, right: 20, bottom: 45, left: 55 };

/* Target distribution: mixture of two Gaussians on [0, 1]. */
function targetPdf(x: number) {
  const mu1 = 0.35;
  const mu2 = 0.7;
  const s1 = 0.07;
  const s2 = 0.08;
  const w1 = 0.5;
  const w2 = 0.5;
  const g1 = (w1 / (s1 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu1) / s1) ** 2);
  const g2 = (w2 / (s2 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu2) / s2) ** 2);
  return g1 + g2;
}

/* Generator distribution: single Gaussian on [0, 1]. */
function generatorPdf(x: number, mu: number, sigma = 0.1) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

/* Optimal discriminator for given densities. */
function optimalDiscriminator(x: number, muG: number) {
  const p = targetPdf(x);
  const q = generatorPdf(x, muG);
  return p + q === 0 ? 0.5 : p / (p + q);
}

/* Numerical JS divergence between p_data and p_g on [0, 1]. */
function jsDivergence(muG: number, steps = 401) {
  let klP = 0;
  let klQ = 0;
  const dx = 1 / (steps - 1);
  for (let i = 0; i < steps; i++) {
    const x = i * dx;
    const p = targetPdf(x);
    const q = generatorPdf(x, muG);
    const m = 0.5 * (p + q);
    if (p > 1e-12 && m > 1e-12) klP += p * Math.log(p / m) * dx;
    if (q > 1e-12 && m > 1e-12) klQ += q * Math.log(q / m) * dx;
  }
  return 0.5 * (klP + klQ);
}

/* Generator non-saturating loss approximated by Simpson samples. */
function generatorLoss(muG: number, steps = 401) {
  let total = 0;
  const dx = 1 / (steps - 1);
  for (let i = 0; i < steps; i++) {
    const x = i * dx;
    const d = optimalDiscriminator(x, muG);
    const q = generatorPdf(x, muG);
    total += -Math.log(Math.max(d, 1e-12)) * q * dx;
  }
  return total;
}

function drawGanDemo(svgEl: SVGSVGElement, muG: number) {
  const svg = d3.select(svgEl);
  svg.selectAll('*').remove();
  svg.attr('font-family', 'Inter, sans-serif');

  const xScale = d3.scaleLinear().domain([0, 1]).range([MARGIN.left, PLOT_WIDTH - MARGIN.right]);
  const yMax = 6;
  const yScale = d3.scaleLinear().domain([0, yMax]).range([PLOT_HEIGHT - MARGIN.bottom, MARGIN.top]);

  const g = svg.append('g');

  // Grid + axes
  g.append('g')
    .attr('transform', `translate(0,${PLOT_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale).ticks(6).tickSize(-(PLOT_HEIGHT - MARGIN.top - MARGIN.bottom)))
    .call((sel) => sel.select('.domain').remove())
    .call((sel) => sel.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'))
    .call((sel) => sel.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 11));

  g.append('g')
    .attr('transform', `translate(${MARGIN.left},0)`)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-(PLOT_WIDTH - MARGIN.left - MARGIN.right)))
    .call((sel) => sel.select('.domain').remove())
    .call((sel) => sel.selectAll('.tick line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'))
    .call((sel) => sel.selectAll('.tick text').attr('fill', '#6b7280').attr('font-size', 11));

  g.append('text')
    .attr('x', (PLOT_WIDTH + MARGIN.left - MARGIN.right) / 2)
    .attr('y', PLOT_HEIGHT - 8)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', '#374151')
    .text('x');

  g.append('text')
    .attr('x', 18)
    .attr('y', PLOT_HEIGHT / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('fill', '#374151')
    .attr('transform', `rotate(-90, 18, ${PLOT_HEIGHT / 2})`)
    .text('概率密度 / 判别分数');

  const line = d3
    .line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveBasis);

  const xs = d3.range(0, 1.001, 0.005);

  // Target density
  g.append('path')
    .datum(xs.map((x) => [x, targetPdf(x)] as [number, number]))
    .attr('fill', 'none')
    .attr('stroke', '#2563eb')
    .attr('stroke-width', 3)
    .attr('d', line);

  // Generator density
  g.append('path')
    .datum(xs.map((x) => [x, generatorPdf(x, muG)] as [number, number]))
    .attr('fill', 'none')
    .attr('stroke', '#10b981')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '5,4')
    .attr('d', line);

  // Optimal discriminator (scaled to secondary axis visually by factor yMax)
  const dLine = d3
    .line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1] * yMax))
    .curve(d3.curveBasis);

  g.append('path')
    .datum(xs.map((x) => [x, optimalDiscriminator(x, muG)] as [number, number]))
    .attr('fill', 'none')
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 2)
    .attr('d', dLine);

  // Legend
  const legend = g.append('g').attr('transform', `translate(${PLOT_WIDTH - 180}, ${MARGIN.top})`);
  legend.append('rect').attr('width', 170).attr('height', 92).attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');

  legend.append('line').attr('x1', 10).attr('y1', 18).attr('x2', 30).attr('y2', 18).attr('stroke', '#2563eb').attr('stroke-width', 3);
  legend.append('text').attr('x', 36).attr('y', 22).attr('font-size', 10).attr('fill', '#374151').text('真实分布 p_data');

  legend
    .append('line')
    .attr('x1', 10)
    .attr('y1', 40)
    .attr('x2', 30)
    .attr('y2', 40)
    .attr('stroke', '#10b981')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '4,3');
  legend.append('text').attr('x', 36).attr('y', 44).attr('font-size', 10).attr('fill', '#374151').text('生成分布 p_g');

  legend.append('line').attr('x1', 10).attr('y1', 62).attr('x2', 30).attr('y2', 62).attr('stroke', '#f59e0b').attr('stroke-width', 2);
  legend.append('text').attr('x', 36).attr('y', 66).attr('font-size', 10).attr('fill', '#374151').text('最优判别器 D*');

  legend.append('text').attr('x', 10).attr('y', 84).attr('font-size', 10).attr('fill', '#6b7280').text('D* 范围 0–1，按左侧刻度缩放');
}

export default function Ch14OverviewPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [muG, setMuG] = useState(0.15);
  const svgRef = useRef<SVGSVGElement>(null);

  const js = useMemo(() => jsDivergence(muG), [muG]);
  const loss = useMemo(() => generatorLoss(muG), [muG]);

  useEffect(() => {
    if (svgRef.current) drawGanDemo(svgRef.current, muG);
  }, [muG]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Swords className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '课程概览'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          生成对抗网络（GAN）通过生成器与判别器的双人零和博弈学习真实数据的隐式分布，
          无需显式建模似然即可合成高质量样本，是深度学习生成模型的重要范式。
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
          <h2 className="text-2xl font-bold text-gray-900">核心思想</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="生成器 G"
            description="从一个简单先验噪声 z 学习映射到数据空间，目标是让生成的样本与真实数据难以区分。"
          />
          <ConceptCard
            title="判别器 D"
            description="二分类网络，输出样本来自真实分布的概率；目标是尽可能准确地区分真假样本。"
          />
          <ConceptCard
            title="极小极大博弈"
            description="生成器希望提升 D(G(z))，判别器希望提升 D(x) 并降低 D(G(z))，二者交替优化形成纳什均衡。"
          />
          <ConceptCard
            title="训练挑战"
            description="损失曲面非凸、梯度不稳定、模式崩溃与评估困难是 GAN 从理论到实践的核心难题。"
          />
        </div>
      </section>

      {/* Minimax objective */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">极小极大目标</h2>
        <p className="text-gray-700 mb-4">
          原始 GAN 将训练形式化为一个价值函数 <KaTeX math={String.raw`V(D, G)`} />：
          判别器最大化对真实样本与生成样本的对数似然，生成器则最小化该价值。
        </p>
        <FormulaCard
          title="GAN 极小极大损失"
          formula={String.raw`\min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}} [\ln D(x)] + \mathbb{E}_{z \sim p_z} [\ln (1 - D(G(z)))]`}
          description="当 D 达到最优 D*(x)=p_data(x)/(p_data(x)+p_g(x)) 时，对 G 的优化等价于最小化 p_data 与 p_g 之间的 JS 散度。"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <ConceptCard title="17.1 对抗训练" description="GAN 损失函数、JS 散度问题、模式 collapse 与实践训练技巧。" />
          <ConceptCard title="17.2 图像 GAN" description="DCGAN、条件生成与 CycleGAN 图像域转换。" />
          <ConceptCard title="先修提示" description="理解 KL/JS 散度、神经网络训练与卷积网络有助于掌握本章内容。" />
        </div>
      </section>

      {/* Interactive 1D GAN toy demo */}
      <InteractiveDemo title="一维 GAN 玩具演示">
        <div className="space-y-6">
          <p className="text-gray-700">
            拖动滑块改变生成器高斯分布的均值 <KaTeX math={String.raw`\mu_g`} />，
            观察生成分布与真实混合高斯分布的重合程度，以及最优判别器
            <KaTeX math={String.raw`D^*(x)=p_{\text{data}}(x)/(p_{\text{data}}(x)+p_g(x))`} /> 的变化。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                生成器均值 <KaTeX math={String.raw`\mu_g`} />
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{muG.toFixed(2)}</span>
            </div>
            <Slider value={[muG]} min={0.1} max={0.9} step={0.01} onValueChange={(v) => setMuG(v[0])} />
          </div>
          <div className="flex justify-center">
            <svg ref={svgRef} width={PLOT_WIDTH} height={PLOT_HEIGHT} className="border border-gray-200 rounded-lg bg-white" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">JS 散度估计</div>
              <div className="text-2xl font-bold text-blue-700">{js.toFixed(3)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">生成器非饱和损失</div>
              <div className="text-2xl font-bold text-green-700">{loss.toFixed(3)}</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">最优 D 在 μ_g 处</div>
              <div className="text-2xl font-bold text-amber-700">
                {optimalDiscriminator(muG, muG).toFixed(3)}
              </div>
            </div>
          </div>
          <FormulaCard
            title="最优判别器"
            formula={String.raw`D^*(x) = \frac{p_{\text{data}}(x)}{p_{\text{data}}(x) + p_g(x)}`}
            description="当生成分布与真实分布重合时，D*(x)≈0.5，判别器无法区分真假。"
          />
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
