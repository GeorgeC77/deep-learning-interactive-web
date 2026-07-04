import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Mountain, Play, RotateCcw, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

function runGradientDescent(lambda1: number, lambda2: number, eta: number, steps = 40) {
  const path = [{ w1: 2, w2: 1 }];
  for (let i = 0; i < steps; i++) {
    const { w1, w2 } = path[path.length - 1];
    const g1 = lambda1 * w1;
    const g2 = lambda2 * w2;
    const nw1 = w1 - eta * g1;
    const nw2 = w2 - eta * g2;
    if (!Number.isFinite(nw1) || !Number.isFinite(nw2) || Math.abs(nw1) > 1e3 || Math.abs(nw2) > 1e3) {
      break;
    }
    path.push({ w1: nw1, w2: nw2 });
  }
  return path;
}

export default function Ch04ErrorSurfacesPage() {
  const sectionPath = '/ch04/error-surfaces';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [lambda1, setLambda1] = useState(1);
  const [lambda2, setLambda2] = useState(4);
  const [eta, setEta] = useState(0.4);
  const [runKey, setRunKey] = useState(0);

  const { contours, pathD, finalPoint, stableEta } = useMemo(() => {
    const W = 400;
    const H = 320;
    const margin = { top: 10, right: 20, bottom: 40, left: 50 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;
    const w1Min = -2.5, w1Max = 2.5;
    const w2Min = -2, w2Max = 2;

    const sx = (w1: number) => margin.left + ((w1 - w1Min) / (w1Max - w1Min)) * innerW;
    const sy = (w2: number) => margin.top + innerH - ((w2 - w2Min) / (w2Max - w2Min)) * innerH;

    const levels = [0.5, 2, 5, 10];
    const contours = levels.map((c) => {
      const a = Math.sqrt(Math.max(0, 2 * c) / lambda1);
      const b = Math.sqrt(Math.max(0, 2 * c) / lambda2);
      let d = '';
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * 2 * Math.PI;
        const x = a * Math.cos(t);
        const y = b * Math.sin(t);
        d += `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(y).toFixed(1)} `;
      }
      return d;
    });

    const path = runGradientDescent(lambda1, lambda2, eta);
    let pathD = '';
    path.forEach((p, i) => {
      pathD += `${i === 0 ? 'M' : 'L'} ${sx(p.w1).toFixed(1)} ${sy(p.w2).toFixed(1)} `;
    });

    return { contours, pathD, finalPoint: path[path.length - 1], stableEta: 2 / Math.max(lambda1, lambda2) };
  }, [lambda1, lambda2, eta, runKey]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Mountain className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          误差曲面在极小值附近可用二次型近似；Hessian 矩阵的特征值与特征向量揭示了参数空间的曲率方向。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="局部二次近似"
            description="在驻点 w* 附近，损失变化由 Hessian 矩阵决定，可近似为二次型。"
          />
          <ConceptCard
            title="Hessian 与曲率"
            description="Hessian 特征值大的方向曲率大，需要较小学习率；小特征值方向则收敛缓慢。"
          />
          <ConceptCard
            title="条件数"
            description="最大与最小特征值之比决定误差曲面的狭长程度，影响梯度下降收敛速度。"
          />
          <ConceptCard
            title="鞍点与 plateau"
            description="高维空间中鞍点比局部极小值更常见，优化算法需要具备逃离鞍点的能力。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="局部二次近似"
          formula={String.raw`E(\mathbf{w}) \approx E(\mathbf{w}^*) + \frac{1}{2}(\mathbf{w}-\mathbf{w}^*)^{\!T} H (\mathbf{w}-\mathbf{w}^*)`}
          description="H 为 Hessian 矩阵，在极小值处半正定。"
        />
        <FormulaCard
          title="最稳学习率"
          formula={String.raw`\eta_{\max} = \frac{2}{\lambda_{\max}}`}
          description="λ_max 为 Hessian 最大特征值；超过该值梯度下降在对应方向发散。"
        />
      </section>

      <InteractiveDemo title="二次误差曲面与梯度下降路径">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            调节 Hessian 特征值 <KaTeX math={String.raw`\lambda_1, \lambda_2`} /> 与学习率 <KaTeX math={String.raw`\eta`} />，
            观察梯度下降在二次碗面上的轨迹与稳定性。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  λ₁
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{lambda1.toFixed(1)}</span>
              </div>
              <Slider value={[lambda1]} min={0.5} max={5} step={0.1} onValueChange={(v) => setLambda1(v[0])} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  λ₂
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{lambda2.toFixed(1)}</span>
              </div>
              <Slider value={[lambda2]} min={0.5} max={8} step={0.1} onValueChange={(v) => setLambda2(v[0])} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  η
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{eta.toFixed(2)}</span>
              </div>
              <Slider value={[eta]} min={0.05} max={1.2} step={0.05} onValueChange={(v) => setEta(v[0])} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setRunKey((k) => k + 1)} className="gap-2">
              <Play className="w-4 h-4" /> 运行 GD
            </Button>
            <Button variant="outline" onClick={() => { setLambda1(1); setLambda2(4); setEta(0.4); setRunKey((k) => k + 1); }} className="gap-2">
              <RotateCcw className="w-4 h-4" /> 重置
            </Button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <svg viewBox="0 0 400 320" className="w-full h-auto">
              <rect x={50} y={10} width={330} height={270} fill="#f8fafc" />
              <text x={215} y={315} textAnchor="middle" fontSize={10} fill="#6b7280">w₁</text>
              <text x={20} y={150} textAnchor="middle" fontSize={10} fill="#6b7280" transform="rotate(-90 20 150)">w₂</text>
              {contours.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#bfdbfe" strokeWidth={1.5} />
              ))}
              <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={(50 + ((finalPoint.w1 + 2.5) / 5) * 330).toFixed(1)} cy={(10 + (1 - (finalPoint.w2 + 2) / 4) * 270).toFixed(1)} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />
              <circle cx={(50 + 2.5 / 5 * 330).toFixed(1)} cy={(10 + (1 - 1 / 4) * 270).toFixed(1)} r={4} fill="#10b981" />
            </svg>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 起点</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> 终点</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500" /> GD 轨迹</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">最稳学习率</div>
              <div className="text-2xl font-bold text-blue-700">{stableEta.toFixed(3)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`E(\mathbf{w}) = \frac{1}{2}(\lambda_1 w_1^2 + \lambda_2 w_2^2)`} />
            </div>
          </div>
        </div>
      </InteractiveDemo>

      <nav className="flex flex-wrap justify-between gap-4">
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
      </nav>
    </div>
  );
}
