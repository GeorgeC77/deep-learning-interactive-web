import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Play, RotateCcw, ShieldAlert, SlidersHorizontal, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

function optimize(eta: number, mu: number, steps = 60) {
  const a1 = 1;
  const a2 = 8;
  const start = { w1: 2, w2: 1 };

  // Plain GD
  const gdPath = [start];
  for (let i = 0; i < steps; i++) {
    const { w1, w2 } = gdPath[gdPath.length - 1];
    const nw1 = w1 - eta * a1 * w1;
    const nw2 = w2 - eta * a2 * w2;
    if (!Number.isFinite(nw1) || !Number.isFinite(nw2) || Math.abs(nw1) > 1e3 || Math.abs(nw2) > 1e3) break;
    gdPath.push({ w1: nw1, w2: nw2 });
  }

  // Momentum GD
  const momPath = [start];
  let v1 = 0, v2 = 0;
  for (let i = 0; i < steps; i++) {
    const { w1, w2 } = momPath[momPath.length - 1];
    v1 = mu * v1 - eta * a1 * w1;
    v2 = mu * v2 - eta * a2 * w2;
    const nw1 = w1 + v1;
    const nw2 = w2 + v2;
    if (!Number.isFinite(nw1) || !Number.isFinite(nw2) || Math.abs(nw1) > 1e3 || Math.abs(nw2) > 1e3) break;
    momPath.push({ w1: nw1, w2: nw2 });
  }

  return { gdPath, momPath };
}

export default function Ch04ConvergencePage() {
  const sectionPath = '/ch04/convergence';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [eta, setEta] = useState(0.15);
  const [mu, setMu] = useState(0.85);
  const [runKey, setRunKey] = useState(0);

  const { contours, gdPathD, momPathD, gdLoss, momLoss } = useMemo(() => {
    const W = 400;
    const H = 320;
    const margin = { top: 10, right: 20, bottom: 40, left: 50 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;
    const w1Min = -2.5, w1Max = 2.5;
    const w2Min = -2, w2Max = 2;

    const sx = (w1: number) => margin.left + ((w1 - w1Min) / (w1Max - w1Min)) * innerW;
    const sy = (w2: number) => margin.top + innerH - ((w2 - w2Min) / (w2Max - w2Min)) * innerH;

    const a1 = 1, a2 = 8;
    const levels = [0.5, 2, 5, 15];
    const contours = levels.map((c) => {
      const r1 = Math.sqrt(2 * c / a1);
      const r2 = Math.sqrt(2 * c / a2);
      let d = '';
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * 2 * Math.PI;
        const x = r1 * Math.cos(t);
        const y = r2 * Math.sin(t);
        d += `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(y).toFixed(1)} `;
      }
      return d;
    });

    const { gdPath, momPath } = optimize(eta, mu);
    const pathToD = (path: { w1: number; w2: number }[]) =>
      path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.w1).toFixed(1)} ${sy(p.w2).toFixed(1)}`).join(' ');

    const loss = (p: { w1: number; w2: number }) => 0.5 * (a1 * p.w1 * p.w1 + a2 * p.w2 * p.w2);

    return {
      contours,
      gdPathD: pathToD(gdPath),
      momPathD: pathToD(momPath),
      gdLoss: loss(gdPath[gdPath.length - 1]),
      momLoss: loss(momPath[momPath.length - 1]),
    };
  }, [eta, mu, runKey]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Zap className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          加速收敛需要利用梯度历史：动量累积速度、自适应方法按维度缩放步长，学习率调度控制长期精细搜索。
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
            title="动量法"
            description="引入速度变量，使更新方向平滑并加速穿越一致梯度方向，抑制高曲率方向的震荡。"
          />
          <ConceptCard
            title="Nesterov 加速梯度"
            description="先按动量方向前看一步再计算梯度，对强凸问题有更优的理论收敛率。"
          />
          <ConceptCard
            title="RMSProp / Adam"
            description="维护梯度平方的指数移动平均，为每个参数自适应调整学习率，适合非平稳目标。"
          />
          <ConceptCard
            title="学习率衰减"
            description="步长随 epoch 递减，保证理论上收敛到局部极小值附近，同时兼顾前期速度与后期精度。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="动量更新"
          formula={String.raw`\mathbf{v}^{(\tau+1)} = \mu \mathbf{v}^{(\tau)} - \eta \nabla E \quad ; \quad \mathbf{w}^{(\tau+1)} = \mathbf{w}^{(\tau)} + \mathbf{v}^{(\tau+1)}`}
          description="μ 为动量系数，速度在一致方向上累积，在震荡方向上相互抵消。"
        />
        <FormulaCard
          title="Adam 更新（简化）"
          formula={String.raw`m \leftarrow \beta_1 m + (1-\beta_1)g \quad ; \quad v \leftarrow \beta_2 v + (1-\beta_2)g^2 \quad ; \quad w \leftarrow w - \eta \frac{m}{\sqrt{v}+\epsilon}`}
          description="同时维护一阶与二阶矩估计，并按维度缩放步长。"
        />
      </section>

      <InteractiveDemo title="动量 vs 普通梯度下降">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            在狭长山谷 <KaTeX math={String.raw`E=\frac12(w_1^2+8w_2^2)`} /> 上，
            比较普通 GD（蓝）与动量法（橙）的轨迹。动量通常能更快沿谷底前进。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  学习率 η
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{eta.toFixed(2)}</span>
              </div>
              <Slider value={[eta]} min={0.05} max={0.4} step={0.05} onValueChange={(v) => setEta(v[0])} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  动量系数 μ
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{mu.toFixed(2)}</span>
              </div>
              <Slider value={[mu]} min={0} max={0.95} step={0.05} onValueChange={(v) => setMu(v[0])} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setRunKey((k) => k + 1)} className="gap-2">
              <Play className="w-4 h-4" /> 运行对比
            </Button>
            <Button variant="outline" onClick={() => { setEta(0.15); setMu(0.85); setRunKey((k) => k + 1); }} className="gap-2">
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
              <path d={gdPathD} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path d={momPathD} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={(50 + 2.5 / 5 * 330).toFixed(1)} cy={(10 + (1 - 1 / 4) * 270).toFixed(1)} r={4} fill="#10b981" />
            </svg>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600" /> 普通 GD</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500" /> 动量法</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 起点</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">普通 GD 终点损失</div>
              <div className="text-2xl font-bold text-blue-700">{gdLoss.toFixed(4)}</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">动量法终点损失</div>
              <div className="text-2xl font-bold text-amber-700">{momLoss.toFixed(4)}</div>
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
