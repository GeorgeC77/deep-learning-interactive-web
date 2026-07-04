import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch15AutoregressiveFlowsPage() {
  const sectionPath = '/ch15/autoregressive-flows';
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
            <ArrowRight className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '18.2 自回归流'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          自回归流按顺序对每个维度做条件变换，天然具有三角 Jacobian，是 MAF、IAF 与 PixelCNN 等模型在连续变量上的扩展基础。
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
            title="自回归分解"
            description={
              <>
                任何联合分布都可以按链式法则分解为条件分布的乘积：
                <KaTeX math={String.raw`p(\boldsymbol{x}) = \prod_{i=1}^{D} p(x_i \mid \boldsymbol{x}_{<i})`} />。
              </>
            }
          />
          <ConceptCard
            title="MAF"
            description="Masked Autoregressive Flow 按自回归顺序从数据维度变换到基分布，便于密度估计，但采样需要逐维迭代。"
          />
          <ConceptCard
            title="IAF"
            description="Inverse Autoregressive Flow 反向进行：从基分布采样后按自回归顺序生成数据，采样并行但密度估计需要迭代。"
          />
          <ConceptCard
            title="掩码自回归网络"
            description="通过精心设计的连接掩码，保证每个输出单元只依赖前面的输入维度，无需显式循环。"
          />
        </div>
      </section>

      {/* Autoregressive formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">自回归变换</h2>
        <p className="text-gray-700 mb-4">
          在自回归流中，第 <KaTeX math={String.raw`i`} /> 维的缩放与平移由前面所有维度共同决定：
        </p>
        <FormulaCard
          title="逐维仿射变换"
          formula={String.raw`
            x_i = z_i \cdot \exp\bigl(s_i(\boldsymbol{x}_{<i})\bigr) + t_i(\boldsymbol{x}_{<i}), \quad i=1,\dots,D
          `}
          description="每个维度只能依赖前面的维度，保证 Jacobian 是下三角矩阵。"
        />
        <FormulaCard
          title="三角 Jacobian 的行列式"
          formula={String.raw`\ln \left| \det \frac{\partial \boldsymbol{x}}{\partial \boldsymbol{z}} \right| = \sum_{i=1}^{D} s_i(\boldsymbol{x}_{<i})`}
          description="下三角矩阵的行列式等于对角线元素的乘积，因此只需累加各维度的对数缩放。"
        />
        <FormulaCard
          title="MAF 与 IAF 的权衡"
          formula={String.raw`
            \text{MAF}: \boldsymbol{x} \to \boldsymbol{z} \;\;\text{（密度估计快）}, \qquad
            \text{IAF}: \boldsymbol{z} \to \boldsymbol{x} \;\;\text{（采样快）}
          `}
          description="两者共享同一参数族，只是推断方向相反。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：二维顺序变换与三角 Jacobian">
        <AutoregressiveDemo />
      </InteractiveDemo>

      {/* Navigation */}
      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function AutoregressiveDemo() {
  const [scale1, setScale1] = useState(1.0);
  const [scale2, setScale2] = useState(1.0);
  const [shift2, setShift2] = useState(0.0);
  const [seed, setSeed] = useState(0);

  const basePoints = useMemo(() => generate2DGaussianCloud(400, seed), [seed]);

  // x1 = s1 * z1, x2 = s2 * z2 + shift2 * x1
  const transformed = basePoints.map(([z1, z2]) => {
    const x1 = scale1 * z1;
    const x2 = scale2 * z2 + shift2 * x1;
    return [x1, x2] as [number, number];
  });

  const logDet = Math.log(Math.abs(scale1 * scale2) + 1e-8);

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        先变换第一维 <KaTeX math={String.raw`x_1 = s_1 z_1`} />，再以第一维为条件变换第二维
        <KaTeX math={String.raw`x_2 = s_2 z_2 + a \, x_1`} />。这正是自回归流的结构：Jacobian 为下三角矩阵。
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <PointCloudCanvas points={basePoints} title="基分布 z" color="#60a5fa" />
        <PointCloudCanvas points={transformed} title="自回归变换后 x" color="#10b981" />
      </div>

      <div className="space-y-5 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <ControlRow label={`第一维缩放 s₁: ${scale1.toFixed(2)}`}>
          <Slider value={[scale1]} min={0.3} max={2.0} step={0.05} onValueChange={(v) => setScale1(v[0])} />
        </ControlRow>
        <ControlRow label={`第二维缩放 s₂: ${scale2.toFixed(2)}`}>
          <Slider value={[scale2]} min={0.3} max={2.0} step={0.05} onValueChange={(v) => setScale2(v[0])} />
        </ControlRow>
        <ControlRow label={`条件平移系数 a: ${shift2.toFixed(2)}`}>
          <Slider value={[shift2]} min={-2.0} max={2.0} step={0.05} onValueChange={(v) => setShift2(v[0])} />
        </ControlRow>
      </div>

      <FormulaCard
        title="当前变换的 Jacobian"
        formula={String.raw`
          J = \begin{pmatrix} s_1 & 0 \\ a & s_2 \end{pmatrix}, \quad
          \det J = s_1 s_2 = ${(scale1 * scale2).toFixed(3)}
        `}
        description={
          <>
            下三角结构保证行列式易计算：
            <KaTeX math={String.raw`\ln |\det J| = ${logDet.toFixed(3)}`} />。
          </>
        }
      />

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="w-4 h-4 mr-2" />
          重新生成点云
        </Button>
      </div>
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
  const scale = 40;
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
