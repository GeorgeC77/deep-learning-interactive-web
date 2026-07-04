import { useMemo, useState } from 'react';
import { ArrowDownCircle, BookOpen, ChevronLeft, ChevronRight, Play, RotateCcw, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

function runNoisyGD(eta: number, batchSize: number, steps = 50) {
  const a1 = 1;
  const a2 = 5;
  const path = [{ w1: 2, w2: 1 }];
  const noiseScale = 0.6 / Math.sqrt(batchSize);
  for (let i = 0; i < steps; i++) {
    const { w1, w2 } = path[path.length - 1];
    const g1 = a1 * w1 + (Math.random() - 0.5) * noiseScale;
    const g2 = a2 * w2 + (Math.random() - 0.5) * noiseScale;
    const nw1 = w1 - eta * g1;
    const nw2 = w2 - eta * g2;
    if (!Number.isFinite(nw1) || !Number.isFinite(nw2) || Math.abs(nw1) > 1e3 || Math.abs(nw2) > 1e3) {
      break;
    }
    path.push({ w1: nw1, w2: nw2 });
  }
  return path;
}

export default function Ch04GradientDescentOptimizationPage() {
  const sectionPath = '/ch04/gradient-descent-optimization';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [eta, setEta] = useState(0.3);
  const [batchSize, setBatchSize] = useState(1);
  const [runKey, setRunKey] = useState(0);

  const { contours, pathD, finalPoint, finalLoss } = useMemo(() => {
    const W = 400;
    const H = 320;
    const margin = { top: 10, right: 20, bottom: 40, left: 50 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;
    const w1Min = -2.5, w1Max = 2.5;
    const w2Min = -2, w2Max = 2;

    const sx = (w1: number) => margin.left + ((w1 - w1Min) / (w1Max - w1Min)) * innerW;
    const sy = (w2: number) => margin.top + innerH - ((w2 - w2Min) / (w2Max - w2Min)) * innerH;

    const a1 = 1, a2 = 5;
    const levels = [0.5, 2, 5, 10];
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

    const path = runNoisyGD(eta, batchSize);
    let pathD = '';
    path.forEach((p, i) => {
      pathD += `${i === 0 ? 'M' : 'L'} ${sx(p.w1).toFixed(1)} ${sy(p.w2).toFixed(1)} `;
    });
    const final = path[path.length - 1];
    const loss = 0.5 * (a1 * final.w1 * final.w1 + a2 * final.w2 * final.w2);

    return { contours, pathD, finalPoint: final, finalLoss: loss };
  }, [eta, batchSize, runKey]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <ArrowDownCircle className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          梯度下降通过沿负梯度方向更新参数来降低损失；不同变体在数据使用方式、计算成本与收敛稳定性之间取舍。
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
            title="批量梯度下降"
            description="每次更新使用全部训练数据，梯度精确但单步计算昂贵，适合小数据集。"
          />
          <ConceptCard
            title="随机梯度下降"
            description="每次仅用一个样本估计梯度，噪声大但逃离局部极小值能力强，计算效率高。"
          />
          <ConceptCard
            title="小批量梯度下降"
            description="折中方案，利用矩阵运算效率并降低梯度方差，是深度学习中最常用的形式。"
          />
          <ConceptCard
            title="参数初始化"
            description="初始参数决定优化起点，不当初始化可能导致收敛缓慢或陷入差的局部极小值。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="批量梯度下降"
          formula={String.raw`\mathbf{w}^{(\tau+1)} = \mathbf{w}^{(\tau)} - \eta \nabla E\bigl(\mathbf{w}^{(\tau)}\bigr)`}
          description="使用全部数据的总梯度更新参数。"
        />
        <FormulaCard
          title="小批量梯度估计"
          formula={String.raw`\nabla E \approx \frac{1}{M}\sum_{n=1}^{M} \nabla E_n`}
          description="M 为 batch size；方差随 M 增大而降低。"
        />
      </section>

      <InteractiveDemo title="带梯度噪声的误差曲面优化">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            在二维二次碗面 <KaTeX math={String.raw`E=\frac12(w_1^2+5w_2^2)`} /> 上，
            调节学习率 <KaTeX math={String.raw`\eta`} /> 与小批量大小，观察梯度下降（带估计噪声）的轨迹。
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
              <Slider value={[eta]} min={0.05} max={0.8} step={0.05} onValueChange={(v) => setEta(v[0])} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  小批量大小 M
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{batchSize}</span>
              </div>
              <Slider value={[batchSize]} min={1} max={50} step={1} onValueChange={(v) => setBatchSize(v[0])} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setRunKey((k) => k + 1)} className="gap-2">
              <Play className="w-4 h-4" /> 运行 GD
            </Button>
            <Button variant="outline" onClick={() => { setEta(0.3); setBatchSize(1); setRunKey((k) => k + 1); }} className="gap-2">
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
              <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={(50 + ((finalPoint.w1 + 2.5) / 5) * 330).toFixed(1)} cy={(10 + (1 - (finalPoint.w2 + 2) / 4) * 270).toFixed(1)} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />
              <circle cx={(50 + 2.5 / 5 * 330).toFixed(1)} cy={(10 + (1 - 1 / 4) * 270).toFixed(1)} r={4} fill="#10b981" />
            </svg>
            <div className="flex justify-center gap-6 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 起点</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> 终点</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500" /> 轨迹</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">终点损失</div>
              <div className="text-2xl font-bold text-blue-700">{finalLoss.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`\text{梯度方差} \propto \frac{1}{M}`} />
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
