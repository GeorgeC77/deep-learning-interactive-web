import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Waves,
} from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch15ContinuousFlowsPage() {
  const sectionPath = '/ch15/continuous-flows';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Waves className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '18.3 连续流'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          连续流将变换视为由神经网络定义的常微分方程，用 ODE 求解器前向与反向传播，实现任意精度的可逆变换，并自然支持自由形式的网络架构。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="神经 ODE"
            description={
              <>
                隐藏状态 <KaTeX math={String.raw`h(t)`} /> 随连续时间演化，其导数由神经网络参数化：
                <KaTeX math={String.raw`dh(t)/dt = f(h(t), t, \theta)`} />。
              </>
            }
          />
          <ConceptCard
            title="连续标准化流"
            description="将数据映射看作从 t=0 到 t=1 的ODE流。前向与反向只需调用ODE求解器，无需显式构造可逆层。"
          />
          <ConceptCard
            title="瞬时变化率"
            description={
              <>
                密度的演化由向量场的散度控制：
                <KaTeX math={String.raw`\frac{\partial \ln p}{\partial t} = -\nabla \cdot f`} />。
              </>
            }
          />
          <ConceptCard
            title="FFJORD"
            description="用 Hutchinson 迹估计替代精确 Jacobian，使连续流可扩展到高维图像等复杂数据。"
          />
        </div>
      </section>

      {/* Continuous flow formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">连续流公式</h2>
        <p className="text-gray-700 mb-4">
          在连续流中，样本 <KaTeX math={String.raw`\boldsymbol{x}(t)`} /> 随时间演化。设初始时刻
          <KaTeX math={String.raw`t=0`} /> 为基分布，<KaTeX math={String.raw`t=1`} /> 为数据分布，则：
        </p>
        <FormulaCard
          title="常微分方程"
          formula={String.raw`\frac{d \boldsymbol{x}(t)}{dt} = f\bigl(\boldsymbol{x}(t), t, \theta\bigr)`}
          description="f 是任意神经网络，ODE 求解器保证变换的可逆性与精度。"
        />
        <FormulaCard
          title="对数密度的连续性方程"
          formula={String.raw`\frac{d \ln p(\boldsymbol{x}(t), t)}{dt} = -\operatorname{tr}\left( \frac{\partial f}{\partial \boldsymbol{x}(t)} \right)`}
          description="密度变化由向量场散度的负值给出，无需计算整个 Jacobian 行列式。"
        />
        <FormulaCard
          title="FFJORD 的随机迹估计"
          formula={String.raw`\operatorname{tr}\left( \frac{\partial f}{\partial \boldsymbol{x}} \right) \approx \mathbb{E}_{\boldsymbol{\epsilon}}\left[ \boldsymbol{\epsilon}^{\!T} \frac{\partial f}{\partial \boldsymbol{x}} \boldsymbol{\epsilon} \right]`}
          description="用随机向量与 Jacobian-向量乘积估计迹，避免显式存储完整 Jacobian。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：向量场驱动的粒子演化">
        <ContinuousFlowDemo />
      </InteractiveDemo>

      {/* Navigation */}
      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function ContinuousFlowDemo() {
  const [strength, setStrength] = useState(0.8);
  const [time, setTime] = useState(0.5);
  const [seed, setSeed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setTime((t) => (t >= 1 ? 0 : Math.min(1, t + 0.01)));
    }, 50);
    return () => clearInterval(id);
  }, [isPlaying]);

  const basePoints = useMemo(() => generate2DGaussianCloud(350, seed), [seed]);

  // Simple vector field: rotate + squeeze toward a saddle-like shape
  const evolved = basePoints.map(([x, y]) => {
    const t = time;
    const s = strength;
    // dx/dt = s*(y - x^3), dy/dt = s*(-x - y)
    const dx = s * (y - x * x * x) * t;
    const dy = s * (-x - y) * t;
    return [x + dx, y + dy] as [number, number];
  });

  // Approximate log density change using divergence of the field
  // divergence = ∂dx/∂x + ∂dy/∂y = s*(-3x^2) + s*(-1) = -s(3x^2 + 1)
  const avgDiv =
    -strength * basePoints.reduce((sum, [x]) => sum + (3 * x * x + 1), 0) / basePoints.length;
  const approxLogDetChange = avgDiv * time;

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        将每个样本视为流体微元，沿神经网络定义的向量场演化。拖动“演化时间”观察基分布如何被连续地推送到目标区域，
        并注意散度与密度变化的关系。
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <PointCloudCanvas points={basePoints} title="t = 0 基分布" color="#60a5fa" />
        <PointCloudCanvas points={evolved} title={`t = ${time.toFixed(2)} 演化后`} color="#8b5cf6" />
      </div>

      <div className="space-y-5 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <ControlRow label={`向量场强度: ${strength.toFixed(2)}`}>
          <Slider value={[strength]} min={0.1} max={1.5} step={0.05} onValueChange={(v) => setStrength(v[0])} />
        </ControlRow>
        <ControlRow label={`演化时间 t: ${time.toFixed(2)}`}>
          <Slider value={[time]} min={0} max={1} step={0.01} onValueChange={(v) => setTime(v[0])} />
        </ControlRow>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setIsPlaying((p) => !p)}>
          {isPlaying ? <RotateCcw className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? '暂停' : '播放'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重新生成点云
        </Button>
      </div>

      <FormulaCard
        title="连续流的密度演化"
        formula={String.raw`\frac{d \ln p(\boldsymbol{x}(t))}{dt} = -\nabla \cdot f \approx ${avgDiv.toFixed(3)}`}
        description={
          <>
            在 <KaTeX math={String.raw`t=${time.toFixed(2)}`} /> 内，对数密度累计变化约
            <KaTeX math={String.raw`${approxLogDetChange.toFixed(3)}`} />。
            散度为负意味着粒子聚集、密度上升。
          </>
        }
      />
    </div>
  );
}

function PointCloudCanvas({
  points,
  title,
  color,
}: {
  points: [number, number][];
  title: string;
  color: string;
}) {
  const size = 260;
  const scale = 35;
  const center = size / 2;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 text-center">{title}</div>
      <svg
        width={size}
        height={size}
        className="mx-auto bg-white border border-gray-200 rounded-lg"
        viewBox={`0 0 ${size} ${size}`}
      >
        <line x1={20} y1={center} x2={size - 20} y2={center} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={center} y1={20} x2={center} y2={size - 20} stroke="#e5e7eb" strokeWidth={1} />
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={center + x * scale}
            cy={center - y * scale}
            r={2}
            fill={color}
            opacity={0.65}
          />
        ))}
      </svg>
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4" />
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionNavigation({
  prevSection,
  nextSection,
}: {
  prevSection: { path: string; title: string } | null;
  nextSection: { path: string; title: string } | null;
}) {
  return (
    <section className="flex flex-wrap justify-between gap-4">
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
    </section>
  );
}

function generate2DGaussianCloud(n: number, seed: number): [number, number][] {
  const rng = mulberry32(seed);
  const points: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const u1 = rng();
    const u2 = rng();
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    points.push([z1, z2]);
  }
  return points;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
