import SectionMetadata from '@/components/SectionMetadata';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw, ShieldAlert, ArrowRight, Scale, Dices, RotateCcw } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';
import KaTeX from '../../../components/KaTeX';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function logGamma(z: number): number {
  // Lanczos approximation
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) {
    x += p[i] / (z + i);
  }
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function betaPdf(x: number, a: number, b: number): number {
  if (x <= 0 || x >= 1) {
    if (a > 1 && b > 1) return 0;
    return 0;
  }
  const logBeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logBeta);
}

function BetaPlot({ a, b }: { a: number; b: number }) {
  const width = 560;
  const height = 260;
  const pad = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const samples = 200;
  let maxY = 0;
  const points: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const x = i / samples;
    const y = betaPdf(x, a, b);
    if (y > maxY) maxY = y;
    points.push([x, y]);
  }
  maxY = Math.max(maxY, 1);

  const xScale = (x: number) => pad.left + x * plotW;
  const yScale = (y: number) => pad.top + plotH - (y / (maxY * 1.1)) * plotH;

  const path = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${xScale(x)} ${yScale(y)}`)
    .join(' ');

  const mean = a / (a + b);
  const mode = a > 1 && b > 1 ? (a - 1) / (a + b - 2) : null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#f8f9fa" stroke="#e5e7eb" />

      {[0, maxY * 0.5, maxY].map((t, i) => (
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
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
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
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke="#8b5cf6" strokeWidth={2.5} />

      <line
        x1={xScale(mean)}
        y1={pad.top}
        x2={xScale(mean)}
        y2={pad.top + plotH}
        stroke="#059669"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
      <text x={xScale(mean) + 6} y={pad.top + 16} fontSize={12} fill="#059669" fontWeight={600}>
        mean
      </text>

      {mode !== null && (
        <>
          <line
            x1={xScale(mode)}
            y1={pad.top}
            x2={xScale(mode)}
            y2={pad.top + plotH}
            stroke="#d97706"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
          <text x={xScale(mode) + 6} y={pad.top + 32} fontSize={12} fill="#d97706" fontWeight={600}>
            mode
          </text>
        </>
      )}

      <text x={pad.left + plotW / 2} y={height - 6} textAnchor="middle" fontSize={13} fill="#374151">
        θ
      </text>
      <text x={16} y={height / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 16, ${height / 2})`}>
        Beta(θ|α,β)
      </text>
    </svg>
  );
}

export default function PrerequisiteChapter02BayesianPage() {
  const [alpha, setAlpha] = useState(1);
  const [beta, setBeta] = useState(1);
  const [headsInput, setHeadsInput] = useState('');
  const [tailsInput, setTailsInput] = useState('');

  const heads = Math.max(0, alpha - 1);
  const tails = Math.max(0, beta - 1);
  const total = heads + tails;

  const flipHeads = () => setAlpha((a) => a + 1);
  const flipTails = () => setBeta((b) => b + 1);
  const reset = () => {
    setAlpha(1);
    setBeta(1);
  };

  const applyCounts = () => {
    const h = parseInt(headsInput, 10) || 0;
    const t = parseInt(tailsInput, 10) || 0;
    setAlpha(1 + Math.max(0, h));
    setBeta(1 + Math.max(0, t));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
            <RefreshCcw className="w-9 h-9 text-violet-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">2.5 贝叶斯概率</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          贝叶斯方法把模型参数也视为随机变量。通过先验分布与似然函数相乘并归一化，
          我们得到后验分布，从而对参数的不确定性给出完整描述。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Bayes' rule for parameters */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">参数视角的贝叶斯定理</h2>
        </div>
        <FormulaCard
          title="后验 ∝ 先验 × 似然"
          formula={String.raw`p(\boldsymbol{\theta} \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \boldsymbol{\theta}) \, p(\boldsymbol{\theta})}{p(\mathcal{D})}`}
          description="观测数据后，我们对模型参数的信念从先验更新为后验。"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <ConceptCard
            title="先验 p(θ)"
            description="在观测数据前对参数的初始信念，可融入领域知识或选择无信息先验。"
          />
          <ConceptCard
            title="似然 p(D|θ)"
            description="在给定参数下，数据出现的概率；决定不同参数相对数据的契合程度。"
          />
          <ConceptCard
            title="后验 p(θ|D)"
            description="综合先验与数据后的完整信念分布，可用于预测与决策。"
          />
        </div>
        <FormulaCard
          className="mt-6"
          title="边际似然（证据）"
          formula={String.raw`p(\mathcal{D}) = \int p(\mathcal{D} \mid \boldsymbol{\theta}) \, p(\boldsymbol{\theta}) \, d\boldsymbol{\theta}`}
          description="对参数积分得到观测数据的总体概率，常用于模型比较。"
        />
      </section>

      {/* Beta-Bernoulli interactive demo */}
      <InteractiveDemo title="互动演示：Beta-Bernoulli 后验更新">
        <InteractivePanel
          hint="Beta 分布是 Bernoulli 似然的共轭先验。从 Beta(1,1) 均匀先验开始，每次观测到正面 α 加 1，反面 β 加 1。"
          chart={
            <div className="space-y-4">
              <BetaPlot a={alpha} b={beta} />
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-violet-50 rounded-lg border border-violet-100 text-center">
                  <div className="text-xs text-gray-600">先验 / 后验</div>
                  <div className="text-lg font-bold text-violet-700">
                    Beta({alpha}, {beta})
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                  <div className="text-xs text-gray-600">观测正面</div>
                  <div className="text-lg font-bold text-emerald-700">{heads}</div>
                </div>
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 text-center">
                  <div className="text-xs text-gray-600">观测反面</div>
                  <div className="text-lg font-bold text-rose-700">{tails}</div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
                <p className="mb-1">
                  <strong>后验均值：</strong>
                  <KaTeX math={String.raw`\mathbb{E}[\theta] = \frac{\alpha}{\alpha + \beta} = ${(alpha / (alpha + beta)).toFixed(3)}`} />
                </p>
                <p>
                  <strong>MAP 估计：</strong>
                  <KaTeX
                    math={String.raw`\hat{\theta}_{\mathrm{MAP}} = \frac{\alpha - 1}{\alpha + \beta - 2} = ${
                      alpha > 1 && beta > 1 ? ((alpha - 1) / (alpha + beta - 2)).toFixed(3) : '—'
                    }`}
                  />
                </p>
              </div>
            </div>
          }
          controls={
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={flipHeads} className="bg-emerald-600 hover:bg-emerald-700">
                  <Dices className="w-4 h-4 mr-2" />
                  抛一次正面
                </Button>
                <Button onClick={flipTails} variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-50">
                  <Dices className="w-4 h-4 mr-2" />
                  抛一次反面
                </Button>
              </div>

              <div className="space-y-3">
                <Label className="text-sm">批量设置观测次数</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500">正面数</Label>
                    <Input
                      type="number"
                      min={0}
                      value={headsInput}
                      onChange={(e) => setHeadsInput(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">反面数</Label>
                    <Input
                      type="number"
                      min={0}
                      value={tailsInput}
                      onChange={(e) => setTailsInput(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <Button onClick={applyCounts} variant="secondary" className="w-full">
                  应用观测次数
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAlpha(11);
                    setBeta(11);
                  }}
                >
                  10 正 10 反
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAlpha(21);
                    setBeta(6);
                  }}
                >
                  20 正 5 反
                </Button>
              </div>

              <Button onClick={reset} variant="ghost" className="w-full text-gray-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                重置为 Beta(1,1)
              </Button>

              {total > 0 && (
                <p className="text-sm text-gray-600">
                  已观测 {total} 次，频率估计 <KaTeX math={String.raw`\hat{\theta} = ${(heads / total).toFixed(3)}`} />。
                  随着数据增多，后验分布越来越集中在真实参数附近。
                </p>
              )}
            </div>
          }
        />
      </InteractiveDemo>

      {/* Conjugate prior note */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCcw className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">共轭先验</h2>
        </div>
        <p className="text-gray-700 mb-4">
          当先验与似然属于同一族分布时，后验也具有相同形式，称为共轭先验。这大大简化了贝叶斯更新：
          只需更新超参数即可。
        </p>
        <FormulaCard
          title="Beta 先验 + Bernoulli 似然"
          formula={String.raw`p(\theta \mid \mathcal{D}) \propto \theta^{\alpha_0 + N_1 - 1} (1 - \theta)^{\beta_0 + N_0 - 1}`}
          description="其中 N₁、N₀ 分别为正面与反面观测次数，后验为 Beta(α₀+N₁, β₀+N₀)。"
        />
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <ConceptCard
            title="先验等价样本量"
            description="α₀+β₀−2 可视为先验所对应的“虚拟观测数”，影响后验受数据影响的速度。"
          />
          <ConceptCard
            title="大数据极限"
            description="当 N 很大时，后验均值趋近于最大似然估计，不确定性逐渐消失。"
          />
        </div>
      </section>

      {/* Summary and navigation */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
        <h3 className="text-lg font-bold text-violet-900 mb-3">本节小结</h3>
        <p className="text-violet-800 text-sm mb-4">
          贝叶斯概率把推断视为信念的更新：先验与似然相乘并归一化得到后验。Beta-Bernoulli 示例
          展示了共轭先验如何让我们通过简单的超参数更新完成贝叶斯学习。
        </p>
        <Link
          to="/prerequisite/ch03/overview"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          进入先修 Ch 3：标准分布
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 2"}
        bishopSection={"bayesian"}
        learningObjectives={["理解 Bayesian 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“Bayesian”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "Bayesian 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
      },
      {
        question: "学习本小节时，最重要的提醒是什么？",
        options: ["只看结论，忽略推导。", "理解概念背后的直觉与假设。", "直接套用代码，不必关心理论。", "只记忆英文术语。"],
        correctIndex: 1,
        explanation: "理解直觉和假设有助于在遇到新问题时正确选择与扩展方法。",
      }
        ]}
      />
</div>
  );
}
