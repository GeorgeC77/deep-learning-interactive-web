import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChartSpline, ShieldAlert, ArrowRight, Calculator, TrendingUp } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';
import KaTeX from '../../../components/KaTeX';
import { Slider } from '@/components/ui/slider';

function gaussianPdf(x: number, mu: number, sigma: number) {
  const z = (x - mu) / sigma;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

function GaussianPlot({ mu, sigma }: { mu: number; sigma: number }) {
  const width = 560;
  const height = 260;
  const pad = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xMin = -10;
  const xMax = 10;
  const fixedYMax = 1.4;

  const xScale = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const yScale = (y: number) => pad.top + plotH - (y / (fixedYMax * 1.1)) * plotH;

  const points: [number, number][] = [];
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const x = xMin + (i / n) * (xMax - xMin);
    points.push([xScale(x), yScale(gaussianPdf(x, mu, sigma))]);
  }

  const curvePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

  const regionPath = (a: number, b: number) => {
    const regionPoints: [number, number][] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = a + (i / steps) * (b - a);
      regionPoints.push([xScale(x), yScale(gaussianPdf(x, mu, sigma))]);
    }
    regionPoints.push([xScale(b), yScale(0)]);
    regionPoints.push([xScale(a), yScale(0)]);
    return regionPoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' Z';
  };

  const xTicks = [-8, -4, 0, 4, 8];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <clipPath id="gaussian-plot-area">
          <rect x={pad.left} y={pad.top} width={plotW} height={plotH} />
        </clipPath>
      </defs>
      <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#f8f9fa" stroke="#e5e7eb" />

      {[0, 0.5 * fixedYMax, fixedYMax].map((t, i) => (
        <g key={`y-${i}`}>
          <line
            x1={pad.left}
            y1={yScale(t)}
            x2={pad.left + plotW}
            y2={yScale(t)}
            stroke="#e5e7eb"
            strokeDasharray="3,3"
          />
          <text x={pad.left - 8} y={yScale(t) + 4} textAnchor="end" fontSize={11} fill="#6b7280">
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {xTicks.map((t, i) => (
        <g key={`x-${i}`}>
          <line
            x1={xScale(t)}
            y1={pad.top}
            x2={xScale(t)}
            y2={pad.top + plotH}
            stroke="#e5e7eb"
            strokeDasharray="3,3"
          />
          <text x={xScale(t)} y={pad.top + plotH + 18} textAnchor="middle" fontSize={11} fill="#6b7280">
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      <g clipPath="url(#gaussian-plot-area)">
        <path d={regionPath(mu - 2 * sigma, mu + 2 * sigma)} fill="#c7d2fe" opacity={0.5} />
        <path d={regionPath(mu - sigma, mu + sigma)} fill="#a5b4fc" opacity={0.6} />
        <path d={curvePath} fill="none" stroke="#4f46e5" strokeWidth={2.5} />
        <line
          x1={xScale(mu)}
          y1={pad.top}
          x2={xScale(mu)}
          y2={pad.top + plotH}
          stroke="#7c3aed"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      </g>
      <text x={xScale(mu) + 6} y={pad.top + 16} fontSize={12} fill="#7c3aed" fontWeight={600}>
        μ
      </text>

      <text x={xScale(mu + sigma)} y={yScale(gaussianPdf(mu + sigma, mu, sigma)) - 8} textAnchor="middle" fontSize={12} fill="#4f46e5">
        ±1σ
      </text>
      <text x={xScale(mu + 2 * sigma)} y={yScale(gaussianPdf(mu + 2 * sigma, mu, sigma)) - 8} textAnchor="middle" fontSize={12} fill="#4f46e5">
        ±2σ
      </text>

      <text x={pad.left + plotW / 2} y={height - 6} textAnchor="middle" fontSize={13} fill="#374151">
        x
      </text>
      <text x={16} y={height / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 16, ${height / 2})`}>
        N(x|μ,σ²)
      </text>
    </svg>
  );
}

export default function PrerequisiteChapter02GaussianPage() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  const probabilityOneSigma = useMemo(() => {
    return 2 * (0.5 * (1 + erf(1 / Math.sqrt(2))) - 0.5);
  }, []);

  const probabilityTwoSigma = useMemo(() => {
    return 2 * (0.5 * (1 + erf(2 / Math.sqrt(2))) - 0.5);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
            <ChartSpline className="w-9 h-9 text-violet-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">2.3 高斯分布</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          高斯分布（正态分布）是机器学习中最常用的连续分布。中心极限定理保证了许多独立随机变量之和
          近似服从高斯分布，使其在噪声建模与推断中具有核心地位。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
        </p>
      </section>

      {/* Univariate Gaussian */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">一元高斯分布</h2>
        </div>
        <FormulaCard
          title="概率密度函数"
          formula={String.raw`\mathcal{N}(x \mid \mu, \sigma^2) = \frac{1}{(2\pi\sigma^2)^{1/2}} \exp\left\{ -\frac{1}{2\sigma^2}(x - \mu)^2 \right\}`}
          description="由均值 μ 与方差 σ² 完全刻画，钟形曲线关于 μ 对称。"
        />
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <ConceptCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="均值 μ"
            description="分布的位置参数，决定曲线的中心。"
          />
          <ConceptCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="方差 σ²"
            description="分布的尺度参数，决定曲线的胖瘦；σ 越大曲线越扁平。"
          />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="互动演示：高斯分布的形状">
        <InteractivePanel
          hint="拖动滑块改变均值 μ 和标准差 σ，观察 PDF 曲线以及 μ±σ、μ±2σ 区域。约 68% 的质量落在 ±σ 内，约 95% 落在 ±2σ 内。"
          chart={<GaussianPlot mu={mu} sigma={sigma} />}
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>均值 μ</span>
                  <span className="font-mono">{mu.toFixed(1)}</span>
                </div>
                <Slider min={-5} max={5} step={0.1} value={[mu]} onValueChange={([v]) => setMu(v)} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>标准差 σ</span>
                  <span className="font-mono">{sigma.toFixed(2)}</span>
                </div>
                <Slider min={0.3} max={3} step={0.05} value={[sigma]} onValueChange={([v]) => setSigma(v)} />
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm space-y-2">
                <p>
                  <span className="inline-block w-3 h-3 rounded-full bg-indigo-400 mr-2" />
                  <KaTeX math={String.raw`p(\mu - \sigma < x < \mu + \sigma) \approx ${(probabilityOneSigma * 100).toFixed(1)}\%`} />
                </p>
                <p>
                  <span className="inline-block w-3 h-3 rounded-full bg-indigo-300 mr-2" />
                  <KaTeX math={String.raw`p(\mu - 2\sigma < x < \mu + 2\sigma) \approx ${(probabilityTwoSigma * 100).toFixed(1)}\%`} />
                </p>
              </div>
            </div>
          }
        />
      </InteractiveDemo>

      {/* MLE */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">最大似然估计</h2>
        </div>
        <p className="text-gray-700 mb-4">
          给定独立同分布样本{' '}
          <KaTeX math={String.raw`\mathbf{x} = (x_1, \dots, x_N)^T`} />，高斯分布的似然函数为：
        </p>
        <FormulaCard
          title="似然函数"
          formula={String.raw`p(\mathbf{x} \mid \mu, \sigma^2) = \prod_{n=1}^{N} \mathcal{N}(x_n \mid \mu, \sigma^2)`}
          description="对数似然对参数求导并令其为零，可得到闭式解。"
        />
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <FormulaCard
            title="MLE 均值"
            formula={String.raw`\mu_{\mathrm{ML}} = \frac{1}{N} \sum_{n=1}^{N} x_n`}
            description="样本均值，是真实均值的无偏估计。"
          />
          <FormulaCard
            title="MLE 方差"
            formula={String.raw`\sigma^2_{\mathrm{ML}} = \frac{1}{N} \sum_{n=1}^{N} (x_n - \mu_{\mathrm{ML}})^2`}
            description="此估计是有偏的；无偏版本用 N-1 代替 N。"
          />
        </div>
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-900">
          <strong>注意：</strong>
          最大似然估计的方差低估了真实方差，因为它使用样本均值而不是真实均值。无偏估计为{' '}
          <KaTeX math={String.raw`\tilde{\sigma}^2 = \frac{1}{N-1} \sum_{n=1}^{N} (x_n - \mu_{\mathrm{ML}})^2`} />。
        </div>
      </section>

      {/* Summary and navigation */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
        <h3 className="text-lg font-bold text-violet-900 mb-3">本节小结</h3>
        <p className="text-violet-800 text-sm mb-4">
          高斯分布由均值和方差完全决定，其钟形曲线具有优良的解析性质。在最大似然估计中，
          样本均值是无偏的，但样本方差需要除以 N−1 才是真实方差的无偏估计。
        </p>
        <Link
          to="/prerequisite/ch02/information"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          下一节：2.4 信息论
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 2"}
        bishopSection={"gaussian"}
        learningObjectives={["理解 Gaussian 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}

// Error function approximation (Abramowitz & Stegun)
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}
