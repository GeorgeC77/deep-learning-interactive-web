import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Binary, ShieldAlert, ArrowRight, Calculator, Shuffle } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';
import InteractivePanel from '../../../components/InteractivePanel';
import KaTeX from '../../../components/KaTeX';
import { Slider } from '@/components/ui/slider';

function binaryEntropy(p: number) {
  if (p <= 0 || p >= 1) return 0;
  return -p * Math.log(p) - (1 - p) * Math.log(1 - p);
}

function binaryEntropyBits(p: number) {
  if (p <= 0 || p >= 1) return 0;
  return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
}

function EntropyPlot({ p }: { p: number }) {
  const width = 560;
  const height = 260;
  const pad = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xMin = 0;
  const xMax = 1;
  const yMax = Math.log(2);

  const xScale = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const yScale = (y: number) => pad.top + plotH - (y / (yMax * 1.1)) * plotH;

  const curvePoints: [number, number][] = [];
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    curvePoints.push([xScale(x), yScale(binaryEntropy(x))]);
  }
  const curvePath = curvePoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

  const currentX = xScale(p);
  const currentY = yScale(binaryEntropy(p));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#f8f9fa" stroke="#e5e7eb" />

      {[0, 0.35, Math.log(2)].map((t, i) => (
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

      <path d={curvePath} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />

      <line x1={currentX} y1={pad.top + plotH} x2={currentX} y2={currentY} stroke="#7c3aed" strokeWidth={2} strokeDasharray="5,5" />
      <circle cx={currentX} cy={currentY} r={5} fill="#7c3aed" stroke="white" strokeWidth={2} />

      <text x={pad.left + plotW / 2} y={height - 6} textAnchor="middle" fontSize={13} fill="#374151">
        p
      </text>
      <text x={16} y={height / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 16, ${height / 2})`}>
        H(p) [nats]
      </text>
    </svg>
  );
}

export default function PrerequisiteChapter02InformationPage() {
  const [p, setP] = useState(0.5);

  const entropy = useMemo(() => binaryEntropy(p), [p]);
  const entropyBits = useMemo(() => binaryEntropyBits(p), [p]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
            <Binary className="w-9 h-9 text-violet-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">2.4 信息论</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          信息论为不确定性提供了定量度量。熵描述分布的“惊讶程度”，KL 散度衡量两个分布之间的差异，
          互信息刻画变量之间的统计依赖。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
        </p>
      </section>

      {/* Entropy */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">熵</h2>
        </div>
        <FormulaCard
          title="离散熵"
          formula={String.raw`\mathrm{H}[x] = -\sum_{x} p(x) \ln p(x)`}
          description="熵越大，分布越不确定；均匀分布时熵达到最大。"
        />
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <FormulaCard
            title="微分熵"
            formula={String.raw`\mathrm{H}[x] = -\int p(x) \ln p(x) \, dx`}
            description="连续随机变量的熵，注意其值可以为负。"
          />
          <FormulaCard
            title="二元熵"
            formula={String.raw`\mathrm{H}[p] = -p \ln p - (1-p) \ln(1-p)`}
            description="Bernoulli 分布的熵，在 p=0.5 时达到最大 ln 2。"
          />
        </div>
      </section>

      {/* KL and mutual information */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shuffle className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">KL 散度与互信息</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="KL 散度"
            formula={String.raw`\mathrm{KL}(p \parallel q) = -\int p(x) \ln \frac{q(x)}{p(x)} \, dx`}
            description="衡量分布 q 近似分布 p 时损失的额外信息量，非负且不对称。"
          />
          <FormulaCard
            title="互信息"
            formula={String.raw`\mathrm{I}[x, y] = \mathrm{KL}\big(p(x,y) \parallel p(x)p(y)\big)`}
            description="度量两个变量共享的信息量；独立时互信息为 0。"
          />
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="KL ≥ 0"
            description="吉布斯不等式保证 KL 散度非负，当且仅当 p=q 时取等号。"
          />
          <ConceptCard
            title="互信息与熵"
            description={
              <>
                <KaTeX math={String.raw`\mathrm{I}[x,y] = \mathrm{H}[x] - \mathrm{H}[x \mid y] = \mathrm{H}[y] - \mathrm{H}[y \mid x]`} />
              </>
            }
          />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="互动演示：二元熵">
        <InteractivePanel
          hint="拖动滑块改变 Bernoulli 变量取 1 的概率 p，观察熵如何变化。当 p=0.5 时不确定性最大。"
          chart={<EntropyPlot p={p} />}
          controls={
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>
                    概率 <KaTeX math={String.raw`p(x=1) = p`} />
                  </span>
                  <span className="font-mono">{p.toFixed(2)}</span>
                </div>
                <Slider min={0} max={1} step={0.01} value={[p]} onValueChange={([v]) => setP(v)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-center">
                  <div className="text-sm text-gray-600 mb-1">熵（nats）</div>
                  <div className="text-2xl font-bold text-sky-700">{entropy.toFixed(3)}</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                  <div className="text-sm text-gray-600 mb-1">熵（bits）</div>
                  <div className="text-2xl font-bold text-indigo-700">{entropyBits.toFixed(3)}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
                <p>
                  <KaTeX math={String.raw`\mathrm{H}[p] = -${p.toFixed(2)} \ln ${p.toFixed(2)} - ${(1 - p).toFixed(2)} \ln ${(1 - p).toFixed(2)} = ${entropy.toFixed(3)}`} />
                </p>
              </div>
            </div>
          }
        />
      </InteractiveDemo>

      {/* Summary and navigation */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
        <h3 className="text-lg font-bold text-violet-900 mb-3">本节小结</h3>
        <p className="text-violet-800 text-sm mb-4">
          熵量化不确定性，KL 散度衡量分布差异，互信息衡量变量间的信息共享。它们共同构成信息论的基础，
          并广泛用于变分推断、决策树与表征学习。
        </p>
        <Link
          to="/prerequisite/ch02/bayesian"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          下一节：2.5 贝叶斯概率
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      {/* Why? */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">为什么？</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>为什么熵能度量不确定性？</strong>
            熵是“惊讶程度”的期望。分布越均匀，每次抽样的结果越难预测，熵就越大；分布越集中，熵就越小。
          </p>
          <p>
            <strong>为什么 KL 散度不对称？</strong>
            KL(p||q) 用 p 的期望衡量 q 对 p 的近似程度，方向性很重要。把它当成对称距离是常见错误。
          </p>
        </div>
      </section>

      {/* Counterexamples */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">反例</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>反例 1：认为熵越大信息量越大。</strong>
            熵度量的是不确定性，不是信息量。确定分布的熵为 0，但包含全部信息——说明熵和信息量不是同一概念。
          </p>
          <p>
            <strong>反例 2：认为 KL 散度是对称距离。</strong>
            KL(p||q) ≠ KL(q||p)，交换两个分布会得到完全不同的值——说明 KL 散度不是真正的距离度量。
          </p>
        </div>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 2"}
        bishopSection={"information"}
        learningObjectives={["理解 Information 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}
