import SectionMetadata from '@/components/SectionMetadata';
import { useState, useMemo } from 'react';
import { FunctionSquare, BookOpen, ShieldAlert, Layers } from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';
import InteractiveDemo from '../../../components/InteractiveDemo';

export default function ExponentialFamilyPage() {
  const [dist, setDist] = useState<'bernoulli' | 'gaussian'>('bernoulli');
  const [eta, setEta] = useState(0);

  const bernoulliPhi = useMemo(() => 1 / (1 + Math.exp(-eta)), [eta]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
            <FunctionSquare className="w-9 h-9 text-violet-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">3.3 指数族</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          指数族把许多看似不同的分布统一在同一个框架下。理解它的参数化方式，是学习广义线性模型（GLM）与变分推断的关键一步。
        </p>
        <p className="mt-6 text-sm text-amber-800 flex items-center justify-center gap-1">
          <ShieldAlert className="w-4 h-4" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* General form */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">指数族的一般形式</h2>
        </div>
        <FormulaCard
          title="指数族分布"
          formula={
            <KaTeX
              math={String.raw`p(\mathbf{x}\mid\boldsymbol{\eta})=h(\mathbf{x})\,g(\boldsymbol{\eta})\,\exp\!\left\{\boldsymbol{\eta}^{\!T}\mathbf{u}(\mathbf{x})\right\}`}
              display
            />
          }
          description={
            <>
              也常写成 <KaTeX math={String.raw`\exp\!\left\{\boldsymbol{\eta}^T\mathbf{u}(\mathbf{x})-a(\boldsymbol{\eta})\right\}`} />，
              其中 <KaTeX math={String.raw`g(\boldsymbol{\eta})=\exp(-a(\boldsymbol{\eta}))`} /> 保证归一化。
            </>
          }
        />
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <ConceptCard
            icon={<FunctionSquare className="w-5 h-5" />}
            title="自然参数 η"
            description={
              <>
                分布的“核心旋钮”。在 GLM 中常假设 <KaTeX math={String.raw`\eta=\boldsymbol{\theta}^T\mathbf{x}`} />。
              </>
            }
          />
          <ConceptCard
            icon={<Layers className="w-5 h-5" />}
            title="充分统计量 u(x)"
            description={
              <>
                包含了数据中对参数估计所需的全部信息，例如 Bernoulli 中的 <KaTeX math={String.raw`x`} />。
              </>
            }
          />
          <ConceptCard
            icon={<FunctionSquare className="w-5 h-5" />}
            title="配分函数 a(η)"
            description={
              <>
                对数配分函数 <KaTeX math={String.raw`a(\eta)`} /> 保证分布归一化，其导数给出充分统计量的期望。
              </>
            }
          />
          <ConceptCard
            icon={<Layers className="w-5 h-5" />}
            title="基准函数 h(x)"
            description={
              <>
                仅依赖于数据 <KaTeX math={String.raw`\mathbf{x}`} /> 的函数，例如高斯分布中的 exp(−x²/2) 项。
              </>
            }
          />
        </div>
      </section>

      {/* Bernoulli */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">例一：Bernoulli 分布</h2>
        </div>
        <FormulaCard
          title="原始形式"
          formula={
            <KaTeX
              math={String.raw`p(x\mid\mu)=\mu^x(1-\mu)^{1-x},\quad x\in\{0,1\}`}
              display
            />
          }
          description="其中 μ 是成功的概率。"
        />
        <FormulaCard
          title="指数族形式"
          formula={
            <KaTeX
              math={String.raw`p(x\mid\eta)=\exp\!\left\{x\eta-\log(1+e^{\eta})\right\}`}
              display
            />
          }
          description={
            <>
              因此 <KaTeX math={String.raw`\eta=\log\frac{\mu}{1-\mu}`} />，
              <KaTeX math={String.raw`\mathbf{u}(x)=x`} />，
              <KaTeX math={String.raw`a(\eta)=\log(1+e^{\eta})`} />，
              <KaTeX math={String.raw`h(x)=1`} />。
              均值映射 <KaTeX math={String.raw`\mu=\sigma(\eta)=\frac{1}{1+e^{-\eta}}`} /> 正是 Sigmoid 函数。
            </>
          }
        />
      </section>

      {/* Gaussian */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">例二：单变量高斯分布（固定方差）</h2>
        </div>
        <FormulaCard
          title="原始形式（σ² 固定）"
          formula={
            <KaTeX
              math={String.raw`p(x\mid\mu)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left\{-\frac{1}{2\sigma^2}(x-\mu)^2\right\}`}
              display
            />
          }
          description="在 GLM 中通常把方差 σ² 视为已知常数，只让均值 μ 随输入变化。"
        />
        <FormulaCard
          title="指数族形式"
          formula={
            <KaTeX
              math={String.raw`p(x\mid\eta)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left\{-\frac{\eta^2\sigma^2}{2}\right\}\exp\!\left\{\eta x-\frac{x^2}{2\sigma^2}\right\}`}
              display
            />
          }
          description={
            <>
              其中 <KaTeX math={String.raw`\eta=\frac{\mu}{\sigma^2}`} />，
              <KaTeX math={String.raw`\mathbf{u}(x)=x`} />，
              <KaTeX math={String.raw`g(\eta)=\exp\!\left\{-\frac{\eta^2\sigma^2}{2}\right\}`} />。
              当 <KaTeX math={String.raw`\sigma^2=1`} /> 时，
              <KaTeX math={String.raw`\eta=\mu`} />，
              <KaTeX math={String.raw`a(\eta)=\frac{1}{2}\eta^2`} />。
            </>
          }
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：自然参数 η 如何控制分布">
        <p className="text-gray-700 mb-4">
          选择一种分布并拖动 η，观察自然参数与常见参数（Bernoulli 的 μ 或高斯的 μ）之间的对应关系。
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'bernoulli', label: 'Bernoulli' },
            { key: 'gaussian', label: 'Gaussian（固定 σ²=1）' },
          ].map((d) => (
            <button
              key={d.key}
              onClick={() => {
                setDist(d.key as typeof dist);
                setEta(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dist === d.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            自然参数 η = <span className="font-mono text-violet-700">{eta.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={eta}
            onChange={(e) => setEta(Number(e.target.value))}
            className="w-full accent-violet-600"
          />

          {dist === 'bernoulli' ? (
            <BernoulliComparison eta={eta} phi={bernoulliPhi} />
          ) : (
            <GaussianComparison eta={eta} />
          )}
        </div>
      </InteractiveDemo>
    
      <SectionMetadata
        bishopChapter={"Ch 3"}
        bishopSection={"exponential"}
        learningObjectives={["理解 Exponential 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“Exponential”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "Exponential 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
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

function BernoulliComparison({ eta: _eta, phi }: { eta: number; phi: number }) {
  const p0 = 1 - phi;
  const p1 = phi;
  return (
    <div className="mt-6">
      <div className="text-center text-sm text-gray-600 mb-2">
        <KaTeX math={String.raw`\mu=\sigma(\eta)`} /> = {phi.toFixed(4)}
      </div>
      <div className="flex items-end justify-center gap-12 h-40">
        <div className="flex flex-col items-center">
          <div
            className="w-20 bg-blue-400 rounded-t transition-all duration-200"
            style={{ height: `${p0 * 140}px` }}
          />
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-700">x = 0</div>
            <div className="text-lg font-bold text-blue-700">{p0.toFixed(4)}</div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className="w-20 bg-emerald-500 rounded-t transition-all duration-200"
            style={{ height: `${p1 * 140}px` }}
          />
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-700">x = 1</div>
            <div className="text-lg font-bold text-emerald-700">{p1.toFixed(4)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GaussianComparison({ eta }: { eta: number }) {
  const mu = eta;
  const sigma = 1;
  const points = [] as { x: number; y: number }[];
  for (let x = mu - 4; x <= mu + 4; x += 0.1) {
    const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
    points.push({ x, y });
  }

  const width = 520;
  const height = 200;
  const pad = { top: 15, right: 25, bottom: 35, left: 45 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const xMin = mu - 4;
  const xMax = mu + 4;
  const yMax = 0.45;

  const xScale = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * innerW;
  const yScale = (y: number) => pad.top + innerH - (y / yMax) * innerH;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');

  return (
    <div className="mt-6">
      <div className="text-center text-sm text-gray-600 mb-2">
        均值 μ = η = {mu.toFixed(2)}，方差 σ² = 1
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxHeight: 260 }}>
        <line x1={pad.left} y1={pad.top + innerH} x2={pad.left + innerW} y2={pad.top + innerH} stroke="#9ca3af" strokeWidth={1.5} />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + innerH} stroke="#9ca3af" strokeWidth={1.5} />
        {[mu - 3, mu - 2, mu - 1, mu, mu + 1, mu + 2, mu + 3].map((x) => (
          <g key={x}>
            <line x1={xScale(x)} y1={pad.top + innerH} x2={xScale(x)} y2={pad.top + innerH + 5} stroke="#9ca3af" />
            <text x={xScale(x)} y={pad.top + innerH + 17} textAnchor="middle" fontSize={10} fill="#6b7280">
              {x.toFixed(0)}
            </text>
          </g>
        ))}
        {[0, 0.2, 0.4].map((y) => (
          <g key={y}>
            <line x1={pad.left - 5} y1={yScale(y)} x2={pad.left} y2={yScale(y)} stroke="#9ca3af" />
            <text x={pad.left - 8} y={yScale(y) + 3} textAnchor="end" fontSize={10} fill="#6b7280">
              {y.toFixed(1)}
            </text>
          </g>
        ))}
        <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <line x1={xScale(mu)} y1={pad.top} x2={xScale(mu)} y2={pad.top + innerH} stroke="#6d28d9" strokeWidth={1.5} strokeDasharray="6,4" />
      </svg>
    </div>
  );
}
