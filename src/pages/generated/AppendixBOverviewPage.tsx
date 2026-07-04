import { useMemo, useState } from 'react';
import { FunctionSquare, RotateCcw, Target } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import SectionNavigation from '@/components/SectionNavigation';

const fmt = (n: number) => {
  const s = n.toFixed(3);
  return s === '-0.000' ? '0.000' : s;
};

export default function AppendixBOverviewPage() {
  const [a, setA] = useState(0);
  const [q, setQ] = useState(0);

  // Functional J[y] = ∫_0^1 [(y')^2 + q y^2] dx
  // Trial family: y_a(x) = x + a x(1-x)
  const J = useMemo(() => {
    return 1 + (a * a) / 3 + q * (1 / 3 + a / 6 + (a * a) / 30);
  }, [a, q]);

  const optimalA = useMemo(() => {
    if (10 + q === 0) return 0;
    const val = -(5 * q) / (2 * (10 + q));
    return Math.max(-2, Math.min(2, val));
  }, [q]);

  const plotWidth = 300;
  const plotHeight = 220;
  const padLeft = 30;
  const padBottom = 30;
  const toSvg = (x: number, y: number) => ({
    x: padLeft + x * plotWidth,
    y: padBottom + (1 - y) * plotHeight,
  });

  const trialPath = useMemo(() => {
    let d = '';
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      const y = x + a * x * (1 - x);
      const p = toSvg(x, y);
      d += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
    }
    return d;
  }, [a]);

  const exactPath = useMemo(() => {
    let d = '';
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      const y =
        q === 0
          ? x
          : Math.sinh(Math.sqrt(q) * x) / Math.sinh(Math.sqrt(q));
      const p = toSvg(x, y);
      d += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
    }
    return d;
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <FunctionSquare className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">附录 B：变分法</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          变分法研究泛函的极值问题。通过引入泛函导数，可将“寻找使积分最小的函数”转化为求解欧拉-拉格朗日方程。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FunctionSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="泛函"
            description={
              <>
                泛函是以函数为自变量、输出实数的映射，例如
                <KaTeX math={String.raw`F[y]=\int_a^b L(x,y,y')\,dx`} />。
                机器学习中的许多目标（如高斯过程、能量模型）都可写成泛函。
              </>
            }
          />
          <ConceptCard
            title="泛函导数"
            description={
              <>
                类似于多元函数的梯度，泛函导数 <KaTeX math={String.raw`\frac{\delta F}{\delta y(x)}`} /> 描述了
                函数 <KaTeX math={String.raw`y(x)`} /> 在某一点发生微小扰动时泛函的变化率。
              </>
            }
          />
          <ConceptCard
            title="欧拉-拉格朗日方程"
            description={
              <>
                泛函取极值的必要条件是
                <KaTeX math={String.raw`\frac{\partial L}{\partial y}-\frac{d}{dx}\frac{\partial L}{\partial y'}=0`} />。
                它是最优函数必须满足的微分方程。
              </>
            }
          />
          <ConceptCard
            title="在深度学习中的应用"
            description={
              <>
                变分推断、分数匹配、路径积分控制与连续归一化流中的某些推导都依赖变分法思想。
              </>
            }
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">核心公式</h2>
        <FormulaCard
          title="泛函导数定义"
          formula={String.raw`\frac{\delta F}{\delta y(x)}=\lim_{\varepsilon\to0}\frac{F[y+\varepsilon\delta_x]-F[y]}{\varepsilon}`}
          description="其中 δ_x 为集中在 x 处的扰动。"
        />
        <FormulaCard
          title="欧拉-拉格朗日方程"
          formula={String.raw`\frac{\partial L}{\partial y}-\frac{d}{dx}\frac{\partial L}{\partial y'}=0`}
          description="适用于固定端点的泛函极值问题。"
        />
        <FormulaCard
          title="示例：最短路径"
          formula={String.raw`L=\sqrt{1+(y')^2}\quad\Rightarrow\quad y''=0`}
          description="在平面上，两点间的最短曲线是直线。"
        />
      </section>

      {/* Interactive Demo */}
      <InteractiveDemo title="带二次惩罚的泛函极小化">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              考虑泛函
              <KaTeX math={String.raw`J[y]=\int_0^1\bigl[(y')^2+q\,y^2\bigr]dx`} />
              ，边界条件 <KaTeX math={String.raw`y(0)=0,\;y(1)=1`} />。试函数族取
              <KaTeX math={String.raw`y_a(x)=x+a\,x(1-x)`} />。
            </p>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>试函数参数 a</span>
                <span className="font-mono bg-gray-100 px-2 rounded">{fmt(a)}</span>
              </label>
              <Slider value={[a]} min={-2} max={2} step={0.05} onValueChange={(v) => setA(v[0])} />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>惩罚权重 q</span>
                <span className="font-mono bg-gray-100 px-2 rounded">{fmt(q)}</span>
              </label>
              <Slider value={[q]} min={0} max={20} step={0.5} onValueChange={(v) => setQ(v[0])} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => { setA(0); setQ(0); }}>
                <RotateCcw className="w-4 h-4 mr-1" />
                重置
              </Button>
              <Button variant="outline" size="sm" onClick={() => setA(optimalA)}>
                <Target className="w-4 h-4 mr-1" />
                设为当前 q 下的最优近似
              </Button>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">泛函值 J[y_a]</div>
              <div className="text-2xl font-bold text-blue-700">{fmt(J)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <svg viewBox="0 0 360 260" className="w-full h-64 border rounded-lg bg-white">
              {/* axes */}
              <line x1={padLeft} y1={padBottom} x2={padLeft + plotWidth} y2={padBottom} stroke="#6b7280" strokeWidth={2} />
              <line x1={padLeft} y1={padBottom} x2={padLeft} y2={padBottom - plotHeight} stroke="#6b7280" strokeWidth={2} />
              <text x={padLeft + plotWidth - 10} y={padBottom + 18} fontSize={12} fill="#6b7280">x</text>
              <text x={padLeft - 14} y={padBottom - plotHeight + 12} fontSize={12} fill="#6b7280">y</text>
              {/* exact solution */}
              <path d={exactPath} fill="none" stroke="#16a34a" strokeWidth={2} strokeDasharray="4 4" />
              {/* trial solution */}
              <path d={trialPath} fill="none" stroke="#2563eb" strokeWidth={3} />
              {/* legend */}
              <g transform={`translate(${padLeft + 10}, ${padBottom - plotHeight + 24})`}>
                <line x1={0} y1={0} x2={20} y2={0} stroke="#2563eb" strokeWidth={3} />
                <text x={26} y={4} fontSize={12} fill="#374151">试函数 y_a</text>
                <line x1={0} y1={18} x2={20} y2={18} stroke="#16a34a" strokeWidth={2} strokeDasharray="4 4" />
                <text x={26} y={22} fontSize={12} fill="#374151">精确解（q=0 时为 y=x）</text>
              </g>
            </svg>
            <p className="text-xs text-gray-500">
              精确解满足 <KaTeX math={String.raw`y''-q\,y=0`} /> 与边界条件；绿色虚线仅供 q&gt;0 时参考。
            </p>
          </div>
        </div>
      </InteractiveDemo>

      {/* Navigation */}
      <SectionNavigation sectionPath="/appendix/b/overview" />
    </div>
  );
}
