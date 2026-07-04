import { useMemo, useState } from 'react';
import { Maximize, RotateCcw, ToggleLeft, ToggleRight } from 'lucide-react';
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

type Mode = 'circle' | 'ellipse';

export default function AppendixCOverviewPage() {
  const [mode, setMode] = useState<Mode>('circle');
  const [c, setC] = useState(1);

  const problem = useMemo(() => {
    if (mode === 'circle') {
      return {
        objective: String.raw`f(x,y)=x^2+y^2`,
        constraint: String.raw`g(x,y)=x+y-c=0`,
        xOpt: c / 2,
        yOpt: c / 2,
        lambda: c,
        fMin: (c * c) / 2,
        levelFn: (t: number) => {
          const r = Math.sqrt(Math.max(0, (c * c) / 2));
          return [r * Math.cos(t), r * Math.sin(t)] as [number, number];
        },
        formula: String.raw`x^*=y^*=\frac{c}{2},\quad \lambda^*=c,\quad f^*=\frac{c^2}{2}`,
      };
    }
    return {
      objective: String.raw`f(x,y)=x^2+2y^2`,
      constraint: String.raw`g(x,y)=x+y-c=0`,
      xOpt: (2 * c) / 3,
      yOpt: c / 3,
      lambda: (-4 * c) / 3,
      fMin: (2 * c * c) / 3,
      levelFn: (t: number) => {
        const r = Math.sqrt(Math.max(0, (2 * c * c) / 3));
        return [r * Math.cos(t), (r / Math.sqrt(2)) * Math.sin(t)] as [number, number];
      },
      formula: String.raw`x^*=\frac{2c}{3},\;y^*=\frac{c}{3},\;\lambda^*=-\frac{4c}{3},\;f^*=\frac{2c^2}{3}`,
    };
  }, [mode, c]);

  const CENTER = 160;
  const SCALE = 40;
  const toSvg = (wx: number, wy: number) => ({
    x: CENTER + wx * SCALE,
    y: CENTER - wy * SCALE,
  });

  // Constraint line: x+y=c  => y = c - x
  const lineStart = toSvg(-4, c + 4);
  const lineEnd = toSvg(4, c - 4);

  // Level set path (param t)
  const levelPath = useMemo(() => {
    const r = Math.sqrt(Math.max(0, problem.fMin));
    if (r === 0) return '';
    let d = '';
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      const [lx, ly] = problem.levelFn(t);
      const p = toSvg(lx, ly);
      d += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
    }
    d += ' Z';
    return d;
  }, [problem]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Maximize className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">附录 C：拉格朗日乘子</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          拉格朗日乘子法把带等式约束的优化问题转化为无约束问题。通过引入乘子 λ，约束条件被并入拉格朗日函数，从而可用梯度条件求解。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Maximize className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="等式约束优化"
            description={
              <>
                问题形式为 <KaTeX math={String.raw`\min_x f(x)\;\text{s.t.}\;g(x)=0`} />。
                几何上，最优解处目标函数等值线与约束曲线相切。
              </>
            }
          />
          <ConceptCard
            title="拉格朗日函数"
            description={
              <>
                构造 <KaTeX math={String.raw`\mathcal{L}(x,\lambda)=f(x)+\lambda g(x)`} />，
                把约束惩罚项并入目标，λ 称为拉格朗日乘子。
              </>
            }
          />
          <ConceptCard
            title="梯度条件"
            description={
              <>
                稳定点满足 <KaTeX math={String.raw`\nabla_x\mathcal{L}=0`} /> 与
                <KaTeX math={String.raw`\nabla_\lambda\mathcal{L}=g(x)=0`} />。
                前者说明 <KaTeX math={String.raw`\nabla f`} /> 与 <KaTeX math={String.raw`\nabla g`} /> 共线。
              </>
            }
          />
          <ConceptCard
            title="机器学习中的应用"
            description={
              <>
                最大熵模型、支持向量机对偶问题、变分推断中的 ELBO 约束都可通过拉格朗日乘子导出。
              </>
            }
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">核心公式</h2>
        <FormulaCard
          title="拉格朗日函数"
          formula={String.raw`\mathcal{L}(x,\lambda)=f(x)+\lambda g(x)`}
          description="对等式约束 g(x)=0 引入乘子 λ。"
        />
        <FormulaCard
          title="稳定点条件"
          formula={String.raw`\nabla_x\mathcal{L}=\nabla f(x)+\lambda\nabla g(x)=0,\qquad g(x)=0`}
          description="联立方程求解 x 与 λ。"
        />
        <FormulaCard
          title="不等式约束与 KKT 条件"
          formula={String.raw`g_i(x)\le0,\quad \lambda_i\ge0,\quad \lambda_i g_i(x)=0`}
          description="对不等式约束，还需满足互补松弛条件。"
        />
      </section>

      {/* Interactive Demo */}
      <InteractiveDemo title="等式约束下的二维优化">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={mode === 'circle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('circle')}
              >
                {mode === 'circle' ? <ToggleRight className="w-4 h-4 mr-1" /> : <ToggleLeft className="w-4 h-4 mr-1" />}
                f = x² + y²
              </Button>
              <Button
                variant={mode === 'ellipse' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('ellipse')}
              >
                {mode === 'ellipse' ? <ToggleRight className="w-4 h-4 mr-1" /> : <ToggleLeft className="w-4 h-4 mr-1" />}
                f = x² + 2y²
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              目标函数 <KaTeX math={problem.objective} />，约束条件 <KaTeX math={problem.constraint} />。
              拖动滑块改变约束值 c，观察最优解如何在约束直线上移动。
            </p>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>约束值 c</span>
                <span className="font-mono bg-gray-100 px-2 rounded">{fmt(c)}</span>
              </label>
              <Slider value={[c]} min={-3} max={3} step={0.1} onValueChange={(v) => setC(v[0])} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => setC(0)}>
                <RotateCcw className="w-4 h-4 mr-1" />
                重置 c=0
              </Button>
            </div>

            <FormulaCard title="解析解" formula={problem.formula} />
          </div>

          <div className="space-y-3">
            <svg viewBox="0 0 320 320" className="w-full h-64 border rounded-lg bg-white">
              {/* grid */}
              {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <line x1={toSvg(i, -4).x} y1={toSvg(i, -4).y} x2={toSvg(i, 4).x} y2={toSvg(i, 4).y} stroke="#e5e7eb" strokeWidth={1} />
                  <line x1={toSvg(-4, i).x} y1={toSvg(-4, i).y} x2={toSvg(4, i).x} y2={toSvg(4, i).y} stroke="#e5e7eb" strokeWidth={1} />
                </g>
              ))}
              {/* axes */}
              <line x1={toSvg(-4, 0).x} y1={toSvg(-4, 0).y} x2={toSvg(4, 0).x} y2={toSvg(4, 0).y} stroke="#6b7280" strokeWidth={2} />
              <line x1={toSvg(0, -4).x} y1={toSvg(0, -4).y} x2={toSvg(0, 4).x} y2={toSvg(0, 4).y} stroke="#6b7280" strokeWidth={2} />
              {/* level set */}
              {levelPath && (
                <path d={levelPath} fill="rgba(59,130,246,0.12)" stroke="#2563eb" strokeWidth={2} />
              )}
              {/* constraint line */}
              <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" />
              {/* optimal point */}
              {(() => {
                const p = toSvg(problem.xOpt, problem.yOpt);
                return <circle cx={p.x} cy={p.y} r={5} fill="#dc2626" stroke="white" strokeWidth={2} />;
              })()}
            </svg>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-gray-500">最优 x*</div>
                <div className="font-mono font-semibold">{fmt(problem.xOpt)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-gray-500">最优 y*</div>
                <div className="font-mono font-semibold">{fmt(problem.yOpt)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-gray-500">乘子 λ*</div>
                <div className="font-mono font-semibold">{fmt(problem.lambda)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-gray-500">最小值 f*</div>
                <div className="font-mono font-semibold">{fmt(problem.fMin)}</div>
              </div>
            </div>
          </div>
        </div>
      </InteractiveDemo>

      {/* Navigation */}
      <SectionNavigation sectionPath="/appendix/c/overview" />
    </div>
  );
}
