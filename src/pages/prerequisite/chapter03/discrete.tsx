import { useState, useMemo } from 'react';
import { Dice5, Layers, ChartSpline, ShieldAlert, BookOpen } from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';

function binomialPmf(N: number, mu: number, m: number): number {
  if (m < 0 || m > N) return 0;
  let coeff = 1;
  const k = Math.min(m, N - m);
  for (let i = 1; i <= k; i++) {
    coeff = (coeff * (N - k + i)) / i;
  }
  return coeff * Math.pow(mu, m) * Math.pow(1 - mu, N - m);
}

export default function DiscreteDistributionsPage() {
  const [N, setN] = useState(10);
  const [mu, setMu] = useState(0.5);

  const pmf = useMemo(() => {
    const arr: { m: number; p: number }[] = [];
    for (let m = 0; m <= N; m++) arr.push({ m, p: binomialPmf(N, mu, m) });
    return arr;
  }, [N, mu]);

  const mean = N * mu;
  const variance = N * mu * (1 - mu);

  const width = 560;
  const height = 280;
  const pad = { top: 20, right: 20, bottom: 50, left: 50 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxP = Math.max(...pmf.map((d) => d.p), 1e-6);

  const xScale = (m: number) => pad.left + (m / N) * innerW;
  const yScale = (p: number) => pad.top + innerH - (p / maxP) * innerH;
  const barW = innerW / (N + 1) * 0.7;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Dice5 className="w-9 h-9 text-emerald-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">3.1 离散变量</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          离散随机变量只取有限或可数多个值。第 3 章从 Bernoulli、二项、多项三种离散分布出发，
          它们是分类模型与生成模型的基础。
        </p>
        <p className="mt-6 text-sm text-amber-800 flex items-center justify-center gap-1">
          <ShieldAlert className="w-4 h-4" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concept cards */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">三种离散分布</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard
            icon={<Dice5 className="w-5 h-5" />}
            title="Bernoulli 分布"
            description={
              <>
                单次二元试验，例如抛硬币。只取 0 或 1，由单一参数 <KaTeX math={String.raw`\mu`} /> 控制成功概率。
              </>
            }
          />
          <ConceptCard
            icon={<Layers className="w-5 h-5" />}
            title="Binomial 分布"
            description={
              <>
                N 次独立 Bernoulli 试验的成功次数。均值 <KaTeX math={String.raw`N\mu`} />，方差 <KaTeX math={String.raw`N\mu(1-\mu)`} />。
              </>
            }
          />
          <ConceptCard
            icon={<ChartSpline className="w-5 h-5" />}
            title="Multinomial 分布"
            description={
              <>
                二项分布向 K 个类别的推广。描述 N 次试验中各类别出现次数的联合分布。
              </>
            }
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">公式一览</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="Bernoulli 分布"
            formula={
              <KaTeX
                math={String.raw`p(x\mid\mu)=\mu^x(1-\mu)^{1-x},\quad x\in\{0,1\}`}
                display
              />
            }
            description={
              <>
                均值 <KaTeX math={String.raw`\mathbb{E}[x]=\mu`} />，方差{' '}
                <KaTeX math={String.raw`\mathrm{var}[x]=\mu(1-\mu)`} />。
              </>
            }
          />
          <FormulaCard
            title="Binomial 分布"
            formula={
              <KaTeX
                math={String.raw`p(m\mid N,\mu)=\binom{N}{m}\mu^m(1-\mu)^{N-m}`}
                display
              />
            }
            description={
              <>
                N 次独立试验中成功 m 次的概率；均值 <KaTeX math={String.raw`N\mu`} />，方差{' '}
                <KaTeX math={String.raw`N\mu(1-\mu)`} />。
              </>
            }
          />
        </div>
        <div className="mt-4">
          <FormulaCard
            title="Multinomial 分布"
            formula={
              <KaTeX
                math={String.raw`p(m_1,\dots,m_K\mid\boldsymbol{\mu},N)=\frac{N!}{m_1!\cdots m_K!}\prod_{k=1}^K\mu_k^{m_k}`}
                display
              />
            }
            description={
              <>
                满足 <KaTeX math={String.raw`\sum_k m_k=N`} />、<KaTeX math={String.raw`\sum_k\mu_k=1`} />。
                当 K=2 时退化为二项分布。
              </>
            }
          />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：二项分布 PMF">
        <p className="text-gray-700 mb-4">
          拖动滑块改变试验次数 N 与单次成功概率 μ，观察概率质量函数（PMF）的变化。
        </p>
        <InteractivePanel
          hint="每个 bar 的高度表示 P(m = 次成功数)；所有 bar 的概率之和为 1。"
          chart={
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxHeight: 320 }}>
              {/* axes */}
              <line
                x1={pad.left}
                y1={pad.top + innerH}
                x2={pad.left + innerW}
                y2={pad.top + innerH}
                stroke="#9ca3af"
                strokeWidth={1.5}
              />
              <line
                x1={pad.left}
                y1={pad.top}
                x2={pad.left}
                y2={pad.top + innerH}
                stroke="#9ca3af"
                strokeWidth={1.5}
              />
              {/* x ticks */}
              {Array.from({ length: N + 1 }, (_, i) => i)
                .filter((m) => N <= 20 || m % Math.ceil((N + 1) / 10) === 0)
                .map((m) => (
                  <g key={m}>
                    <line
                      x1={xScale(m)}
                      y1={pad.top + innerH}
                      x2={xScale(m)}
                      y2={pad.top + innerH + 5}
                      stroke="#9ca3af"
                    />
                    <text
                      x={xScale(m)}
                      y={pad.top + innerH + 20}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#6b7280"
                    >
                      {m}
                    </text>
                  </g>
                ))}
              {/* y ticks */}
              {[0, maxP / 2, maxP].map((p, i) => (
                <g key={i}>
                  <line
                    x1={pad.left - 5}
                    y1={yScale(p)}
                    x2={pad.left}
                    y2={yScale(p)}
                    stroke="#9ca3af"
                  />
                  <text
                    x={pad.left - 8}
                    y={yScale(p) + 3}
                    textAnchor="end"
                    fontSize={10}
                    fill="#6b7280"
                  >
                    {p.toFixed(3)}
                  </text>
                </g>
              ))}
              {/* bars */}
              {pmf.map(({ m, p }) => (
                <rect
                  key={m}
                  x={xScale(m) - barW / 2}
                  y={yScale(p)}
                  width={barW}
                  height={pad.top + innerH - yScale(p)}
                  fill="#10b981"
                  opacity={0.85}
                  rx={3}
                />
              ))}
              <text
                x={pad.left + innerW / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={12}
                fill="#374151"
              >
                成功次数 m
              </text>
            </svg>
          }
          controls={
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  试验次数 N = <span className="font-mono text-blue-700">{N}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={N}
                  onChange={(e) => setN(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  成功概率 μ = <span className="font-mono text-blue-700">{mu.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={mu}
                  onChange={(e) => setMu(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                <p className="text-sm text-emerald-900">
                  均值 <KaTeX math={String.raw`\mathbb{E}[m]=N\mu`} /> ={' '}
                  <span className="font-mono font-semibold">{mean.toFixed(2)}</span>
                </p>
                <p className="text-sm text-emerald-900">
                  方差 <KaTeX math={String.raw`\mathrm{var}[m]=N\mu(1-\mu)`} /> ={' '}
                  <span className="font-mono font-semibold">{variance.toFixed(3)}</span>
                </p>
              </div>
            </div>
          }
        />
      </InteractiveDemo>
    </div>
  );
}
