import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, RefreshCw } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import InteractivePanel from '@/components/InteractivePanel';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch13/evidence-lower-bound';
const D = 10;
const WIDTH = 600;
const HEIGHT = 320;
const MARGIN = { top: 24, right: 24, bottom: 48, left: 56 };

function generateEigenvalues(seed: number): number[] {
  let s = seed || 12345;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const values = Array.from({ length: D }, (_, i) => {
    const base = 12 * Math.exp(-0.35 * i);
    return base + 0.6 * rand();
  });
  return values.sort((a, b) => b - a);
}

function scale(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export default function Ch13EvidenceLowerBoundPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [seed, setSeed] = useState(1);
  const [dim, setDim] = useState(3);

  const eigenvalues = useMemo(() => generateEigenvalues(seed), [seed]);
  const total = useMemo(() => eigenvalues.reduce((a, b) => a + b, 0), [eigenvalues]);
  const reconstructionError = useMemo(
    () => eigenvalues.slice(dim).reduce((a, b) => a + b, 0) / total,
    [eigenvalues, dim, total]
  );
  const explainedVariance = useMemo(() => 1 - reconstructionError, [reconstructionError]);

  const xMin = 0;
  const xMax = D - 1;
  const yMin = 0;
  const yMax = Math.max(...eigenvalues) * 1.1;

  const bars = eigenvalues.map((lambda, i) => {
    const x = scale(i, xMin - 0.5, xMax + 0.5, MARGIN.left, WIDTH - MARGIN.right);
    const barWidth = (WIDTH - MARGIN.left - MARGIN.right) / D * 0.7;
    const yTop = scale(lambda, yMin, yMax, HEIGHT - MARGIN.bottom, MARGIN.top);
    const yBottom = HEIGHT - MARGIN.bottom;
    const retained = i < dim;
    return { x, barWidth, yTop, yBottom, retained, lambda };
  });

  const cumulativePoints = eigenvalues
    .reduce<number[]>((acc, lambda, i) => {
      const prev = i === 0 ? 0 : acc[i - 1];
      acc.push(prev + lambda / total);
      return acc;
    }, [])
    .map((value, i) => {
      const x = scale(i, xMin, xMax, MARGIN.left, WIDTH - MARGIN.right);
      const y = scale(value, 0, 1, HEIGHT - MARGIN.bottom, MARGIN.top);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Scale className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {section?.title ?? '16.3 证据下界'}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          在连续隐变量模型中，直接计算边缘似然通常涉及难以求解的积分。证据下界（ELBO）为对数似然提供了一个可优化的下界，
          EM 算法则通过交替优化 ELBO 来学习模型参数。
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
            title="证据下界（ELBO）"
            description={
              <>
                引入变分分布 <KaTeX math={String.raw`q(oldsymbol{z})`} /> 后，对数似然可分解为 ELBO 与
                KL 散度之和。优化 ELBO 等价于在提高数据似然的同时让 <KaTeX math={String.raw`q`} />{' '}
                逼近真实后验。
              </>
            }
          />
          <ConceptCard
            title="EM 算法"
            description={
              <>
                E 步固定参数，令 <KaTeX math={String.raw`q(oldsymbol{z})=p(oldsymbol{z}\mid\boldsymbol{x},\boldsymbol{\theta}^{\text{old}})`} />；
                M 步固定 <KaTeX math={String.raw`q`} />，最大化期望完全数据对数似然。
              </>
            }
          />
          <ConceptCard
            title="PCA 的 EM 算法"
            description="概率 PCA 的 EM 形式避免了直接计算高维协方差矩阵的特征分解，可扩展到高维数据与缺失数据场景。"
          />
          <ConceptCard
            title="因子分析的 EM 算法"
            description="因子分析中每个观测维度有独立的噪声方差，EM 同时估计载荷矩阵与噪声协方差。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键公式</h2>
        <div className="space-y-4">
          <FormulaCard
            title="连续隐变量模型的 ELBO"
            formula={String.raw`
              \ln p(\boldsymbol{x}) \ge \mathcal{L}(q)
              = \mathbb{E}_{q(\boldsymbol{z})}\bigl[\ln p(\boldsymbol{x},\boldsymbol{z})\bigr]
              - \mathbb{E}_{q(\boldsymbol{z})}\bigl[\ln q(\boldsymbol{z})\bigr]
            `}
            description="等号成立当且仅当 q(z) 等于真实后验 p(z|x)。"
          />
          <FormulaCard
            title="ELBO 的另一种分解"
            formula={String.raw`
              \mathcal{L}(q)
              = \mathbb{E}_{q(\boldsymbol{z})}\bigl[\ln p(\boldsymbol{x}\mid\boldsymbol{z})\bigr]
              - D_{\mathrm{KL}}\bigl(q(\boldsymbol{z})\,\|\,p(\boldsymbol{z})\bigr)
            `}
            description="重建项鼓励模型解释数据，KL 项约束隐变量接近先验。"
          />
          <FormulaCard
            title="EM 更新"
            formula={String.raw`
              \text{E 步: } q^{\text{new}}(\boldsymbol{z})=p(\boldsymbol{z}\mid\boldsymbol{x},\boldsymbol{\theta}^{\text{old}});
              \quad
              \text{M 步: } \boldsymbol{\theta}^{\text{new}}
              = \arg\max_{\boldsymbol{\theta}}\,\mathbb{E}_{q^{\text{new}}}\bigl[\ln p(\boldsymbol{x},\boldsymbol{z}\mid\boldsymbol{\theta})\bigr]
            `}
            description="EM 保证似然单调不减，直到收敛到局部最优。"
          />
          <FormulaCard
            title="概率 PCA 的完整数据似然"
            formula={String.raw`
              p(\boldsymbol{x},\boldsymbol{z}\mid\boldsymbol{\theta})
              = \mathcal{N}(\boldsymbol{z}\mid\boldsymbol{0},\boldsymbol{I})\,
                \mathcal{N}\bigl(\boldsymbol{x}\mid\boldsymbol{W}\boldsymbol{z}+\boldsymbol{\mu},\sigma^2\boldsymbol{I}\bigr)
            `}
            description="EM 迭代估计载荷矩阵 W、均值 μ 与噪声方差 σ²。"
          />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：PCA 隐变量维度与重建误差">
        <InteractivePanel
          hint="调整保留的潜在维度 M，观察保留的特征值（蓝色）与丢弃的方差（灰色）如何变化。维度越高，重建误差越小，但模型越复杂。"
          chart={
            <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden">
              <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: 360 }}>
                {/* Grid lines for y */}
                {Array.from({ length: 5 }, (_, i) => {
                  const y = scale(i / 4, 0, 1, HEIGHT - MARGIN.bottom, MARGIN.top);
                  return (
                    <line
                      key={`grid-${i}`}
                      x1={MARGIN.left}
                      y1={y}
                      x2={WIDTH - MARGIN.right}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeDasharray="3,3"
                    />
                  );
                })}
                {/* Y axis */}
                <line
                  x1={MARGIN.left}
                  y1={MARGIN.top}
                  x2={MARGIN.left}
                  y2={HEIGHT - MARGIN.bottom}
                  stroke="#9ca3af"
                />
                {/* X axis */}
                <line
                  x1={MARGIN.left}
                  y1={HEIGHT - MARGIN.bottom}
                  x2={WIDTH - MARGIN.right}
                  y2={HEIGHT - MARGIN.bottom}
                  stroke="#9ca3af"
                />
                {/* Bars */}
                {bars.map((bar, i) => (
                  <rect
                    key={`bar-${i}`}
                    x={bar.x - bar.barWidth / 2}
                    y={bar.yTop}
                    width={bar.barWidth}
                    height={bar.yBottom - bar.yTop}
                    rx={3}
                    fill={bar.retained ? '#3b82f6' : '#d1d5db'}
                  />
                ))}
                {/* Cumulative explained variance line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  points={cumulativePoints}
                />
                {/* Axis labels */}
                <text x={(WIDTH + MARGIN.left - MARGIN.right) / 2} y={HEIGHT - 12} textAnchor="middle" fontSize={12} fill="#374151">
                  主成分索引
                </text>
                <text
                  x={18}
                  y={HEIGHT / 2}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#374151"
                  transform={`rotate(-90, 18, ${HEIGHT / 2})`}
                >
                  特征值 / 方差
                </text>
                {/* Legend */}
                <g transform={`translate(${WIDTH - 180}, ${MARGIN.top})`}>
                  <rect width={160} height={66} rx={6} fill="white" stroke="#e5e7eb" />
                  <rect x={10} y={12} width={16} height={12} rx={2} fill="#3b82f6" />
                  <text x={32} y={22} fontSize={10} fill="#374151">保留维度</text>
                  <rect x={10} y={34} width={16} height={12} rx={2} fill="#d1d5db" />
                  <text x={32} y={44} fontSize={10} fill="#374151">丢弃方差</text>
                  <line x1={10} y1={58} x2={26} y2={58} stroke="#10b981" strokeWidth={2} />
                  <text x={32} y={62} fontSize={10} fill="#374151">累计解释比</text>
                </g>
              </svg>
            </div>
          }
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>保留维度 M</span>
                  <span className="font-mono">{dim}</span>
                </div>
                <Slider min={0} max={D} step={1} value={[dim]} onValueChange={([v]) => setDim(v ?? 0)} />
                <p className="text-xs text-gray-500 mt-1">M = 0 表示只使用均值重建</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSeed((s) => s + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新生成协方差特征值
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">重建误差</div>
                  <div className="text-xl font-bold text-blue-700">{(reconstructionError * 100).toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-center">
                  <div className="text-xs text-gray-600">解释方差</div>
                  <div className="text-xl font-bold text-emerald-700">{(explainedVariance * 100).toFixed(1)}%</div>
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
