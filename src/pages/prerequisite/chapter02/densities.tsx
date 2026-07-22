import SectionMetadata from '@/components/SectionMetadata';
import { Link } from 'react-router-dom';
import { Waves, ShieldAlert, ArrowRight, Calculator, Ruler } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import KaTeX from '../../../components/KaTeX';

function PdfSvg() {
  const width = 560;
  const height = 220;
  const pad = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xMin = -0.5;
  const xMax = 3;
  const yMax = 1.1;

  const xScale = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const yScale = (y: number) => pad.top + plotH - (y / yMax) * plotH;

  const uniformPath = [
    `M ${xScale(-0.5)} ${yScale(0)}`,
    `L ${xScale(0)} ${yScale(0)}`,
    `L ${xScale(0)} ${yScale(1)}`,
    `L ${xScale(1)} ${yScale(1)}`,
    `L ${xScale(1)} ${yScale(0)}`,
    `L ${xScale(3)} ${yScale(0)}`,
  ].join(' ');

  const exponentialPoints: [number, number][] = [];
  const lambda = 1;
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    const y = x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
    exponentialPoints.push([xScale(x), yScale(y)]);
  }
  const exponentialPath = exponentialPoints
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ');

  const xTicks = [0, 1, 2, 3];
  const yTicks = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#f8f9fa" stroke="#e5e7eb" />

      {yTicks.map((t) => (
        <g key={`y-${t}`}>
          <line
            x1={pad.left}
            y1={yScale(t)}
            x2={pad.left + plotW}
            y2={yScale(t)}
            stroke="#e5e7eb"
            strokeDasharray="3,3"
          />
          <text x={pad.left - 8} y={yScale(t) + 4} textAnchor="end" fontSize={12} fill="#6b7280">
            {t}
          </text>
        </g>
      ))}

      {xTicks.map((t) => (
        <g key={`x-${t}`}>
          <line
            x1={xScale(t)}
            y1={pad.top}
            x2={xScale(t)}
            y2={pad.top + plotH}
            stroke="#e5e7eb"
            strokeDasharray="3,3"
          />
          <text x={xScale(t)} y={pad.top + plotH + 20} textAnchor="middle" fontSize={12} fill="#6b7280">
            {t}
          </text>
        </g>
      ))}

      <path d={uniformPath} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
      <path d={exponentialPath} fill="none" stroke="#ef4444" strokeWidth={2.5} />

      <text x={xScale(0.5)} y={yScale(0.85)} textAnchor="middle" fontSize={13} fill="#3b82f6" fontWeight={600}>
        Uniform(0,1)
      </text>
      <text x={xScale(1.6)} y={yScale(0.45)} textAnchor="middle" fontSize={13} fill="#ef4444" fontWeight={600}>
        Exp(1)
      </text>

      <text x={pad.left + plotW / 2} y={height - 6} textAnchor="middle" fontSize={13} fill="#374151">
        x
      </text>
      <text x={16} y={height / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 16, ${height / 2})`}>
        p(x)
      </text>
    </svg>
  );
}

export default function PrerequisiteChapter02DensitiesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
            <Waves className="w-9 h-9 text-violet-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">2.2 概率密度</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          当随机变量取连续值时，我们用概率密度函数（PDF）描述其分布。PDF 本身不是概率，
          只有对区间积分后才给出概率。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
        </p>
      </section>

      {/* PDF and CDF */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">概率密度函数与累积分布函数</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="概率密度函数（PDF）"
            formula={String.raw`p(x) \ge 0, \quad \int_{-\infty}^{\infty} p(x) \, dx = 1`}
            description="PDF 非负，且在整个空间上的积分为 1。变量取某一点的概率为 0。"
          />
          <FormulaCard
            title="累积分布函数（CDF）"
            formula={String.raw`P(z) = \int_{-\infty}^{z} p(x) \, dx`}
            description="CDF 给出随机变量不超过 z 的概率，是单调不减函数。"
          />
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 text-sm">
            对于连续变量，区间概率由积分给出：
            <span className="mx-2">
              <KaTeX math={String.raw`p(a < x \le b) = \int_{a}^{b} p(x) \, dx = P(b) - P(a)`} />
            </span>
            。注意 PDF 值可以大于 1，只要总面积为 1 即可。
          </p>
        </div>
      </section>

      {/* Expectation, variance, covariance */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">期望、方差与协方差</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <FormulaCard
            title="期望"
            formula={String.raw`\mathbb{E}[f(x)] = \int p(x) f(x) \, dx`}
            description="函数 f(x) 在分布 p(x) 下的加权平均。"
          />
          <FormulaCard
            title="方差"
            formula={String.raw`\mathrm{var}[f(x)] = \mathbb{E}\big[(f(x) - \mathbb{E}[f(x)])^2\big]`}
            description="衡量随机变量围绕均值的离散程度。"
          />
          <FormulaCard
            title="协方差"
            formula={String.raw`\mathrm{cov}[x, y] = \mathbb{E}_{x,y}\big[(x - \bar{x})(y - \bar{y})\big]`}
            description="描述两个随机变量的线性相关程度。"
          />
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="方差恒等式"
            description={
              <>
                <KaTeX math={String.raw`\mathrm{var}[x] = \mathbb{E}[x^2] - \mathbb{E}[x]^2`} />
              </>
            }
          />
          <ConceptCard
            title="协方差矩阵"
            description={
              <>
                对向量 <KaTeX math={String.raw`\mathbf{x}`} />，协方差矩阵{' '}
                <KaTeX math={String.raw`\mathrm{cov}[\mathbf{x}] = \mathbb{E}\big[(\mathbf{x} - \boldsymbol{\mu})(\mathbf{x} - \boldsymbol{\mu})^T\big]`} />
                的对角线元素是各分量的方差。
              </>
            }
          />
        </div>
      </section>

      {/* Standard continuous distributions */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Waves className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">常见连续分布</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <FormulaCard
            title="均匀分布 Uniform(a,b)"
            formula={String.raw`p(x) = \begin{cases} \frac{1}{b-a} & a \le x \le b \\ 0 & \text{otherwise} \end{cases}`}
            description="在区间 [a,b] 内概率密度恒定，区间外为 0。"
          />
          <FormulaCard
            title="指数分布 Exp(\lambda)"
            formula={String.raw`p(x) = \begin{cases} \lambda e^{-\lambda x} & x \ge 0 \\ 0 & x < 0 \end{cases}`}
            description={
              <>
                均值 <KaTeX math={String.raw`\mathbb{E}[x] = 1/\lambda`} />，常用于建模等待时间。
              </>
            }
          />
          <FormulaCard
            title="拉普拉斯分布 Laplace(\mu, b)"
            formula={String.raw`p(x) = \frac{1}{2b} \exp\left(-\frac{|x - \mu|}{b}\right)`}
            description="以 μ 为中心的双边指数分布，尾部比高斯分布更厚。"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">均匀分布与指数分布示例</h3>
          <div className="bg-white border border-border-gray rounded-xl p-4 overflow-hidden">
            <PdfSvg />
          </div>
        </div>
      </section>

      {/* Summary and navigation */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
        <h3 className="text-lg font-bold text-violet-900 mb-3">本节小结</h3>
        <p className="text-violet-800 text-sm mb-4">
          连续随机变量用 PDF 描述，PDF 的积分给出概率。期望、方差与协方差是刻画分布特征的
          基本工具，也是推导机器学习损失函数与优化目标时反复出现的量。
        </p>
        <Link
          to="/prerequisite/ch02/gaussian"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          下一节：2.3 高斯分布
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 2"}
        bishopSection={"densities"}
        learningObjectives={["理解 Densities 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}
