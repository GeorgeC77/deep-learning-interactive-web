import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GitCommitHorizontal,
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

export default function Ch15CouplingFlowsPage() {
  const sectionPath = '/ch15/coupling-flows';
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
            <GitCommitHorizontal className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '18.1 耦合流'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          耦合流将输入分成两部分，用其中一部分作为条件对另一部分做可逆仿射变换，使 Jacobian 行列式易于计算，是 RealNVP 等高效流模型的基础。
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
            title="仿射耦合层"
            description={
              <>
                输入被划分为 <KaTeX math={String.raw`\boldsymbol{z}_{1:d}`} /> 与
                <KaTeX math={String.raw`\boldsymbol{z}_{d+1:D}`} />。前半部分保持不变，后半部分由神经网络预测的缩放
                <KaTeX math={String.raw`s`} /> 与平移 <KaTeX math={String.raw`t`} /> 做仿射变换。
              </>
            }
          />
          <ConceptCard
            title="RealNVP"
            description="堆叠多个耦合层并交替划分维度，使每个变量都有机会被直接变换，从而表达复杂的非线性映射。"
          />
          <ConceptCard
            title="三角 Jacobian"
            description="由于未变化部分对变换部分没有依赖，Jacobian 矩阵呈三角结构，其行列式等于对角缩放因子的乘积。"
          />
          <ConceptCard
            title="可逆性"
            description={
              <>
                仿射耦合层的逆变换只需将输出减平移再除以缩放：
                <KaTeX math={String.raw`\boldsymbol{z}_{d+1:D} = (\boldsymbol{x}_{d+1:D} - t) \odot e^{-s}`} />。
              </>
            }
          />
        </div>
      </section>

      {/* Coupling layer formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">耦合层变换</h2>
        <p className="text-gray-700 mb-4">
          设神经网络 <KaTeX math={String.raw`g`} /> 以不变部分为输入，输出缩放与平移参数，则正向与反向变换分别为：
        </p>
        <FormulaCard
          title="仿射耦合层（正向）"
          formula={String.raw`
            \begin{cases}
              \boldsymbol{x}_{1:d} = \boldsymbol{z}_{1:d}, \\[6pt]
              \boldsymbol{x}_{d+1:D} = \boldsymbol{z}_{d+1:D} \odot \exp\bigl(s(\boldsymbol{z}_{1:d})\bigr) + t(\boldsymbol{z}_{1:d}).
            \end{cases}
          `}
          description="未变化部分作为条件，决定了变化部分的仿射参数。"
        />
        <FormulaCard
          title="log-det-Jacobian"
          formula={String.raw`\ln \left| \det \frac{\partial \boldsymbol{x}}{\partial \boldsymbol{z}} \right| = \sum_{i=d+1}^{D} s_i(\boldsymbol{z}_{1:d})`}
          description="对角块为单位矩阵，下三角块为零，行列式仅由右下角缩放对角线贡献。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：二维仿射耦合流变换">
        <CouplingFlowDemo />
      </InteractiveDemo>

      {/* Navigation */}
      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function CouplingFlowDemo() {
  const [angle, setAngle] = useState(30);
  const [scaleY, setScaleY] = useState(1.5);
  const [shear, setShear] = useState(0.5);
  const [seed, setSeed] = useState(0);

  const basePoints = useMemo(() => generate2DGaussianCloud(400, seed), [seed]);

  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Affine transformation: rotate, scale y, then shear x based on y (coupling-like)
  const transformed = basePoints.map(([x, y]) => {
    const rx = cos * x - sin * y;
    const ry = sin * x + cos * y;
    const sx = rx + shear * ry;
    const sy = scaleY * ry;
    return [sx, sy] as [number, number];
  });

  const det = scaleY; // simplified determinant for this transform
  const logDet = Math.log(Math.abs(det) + 1e-8);

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        左侧为二维标准高斯点云，右侧为经过旋转、y 轴缩放与 x 方向剪切（耦合式条件变换）后的结果。
        观察 Jacobian 行列式如何量化面积元的伸缩。
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <PointCloudCanvas points={basePoints} title="基分布 z" color="#60a5fa" />
        <PointCloudCanvas points={transformed} title="变换后 x" color="#6366f1" />
      </div>

      <div className="space-y-5 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <ControlRow label={`旋转角度 θ: ${angle}°`}>
          <Slider value={[angle]} min={-90} max={90} step={1} onValueChange={(v) => setAngle(v[0])} />
        </ControlRow>
        <ControlRow label={`y 轴缩放 s: ${scaleY.toFixed(2)}`}>
          <Slider value={[scaleY]} min={0.3} max={2.5} step={0.05} onValueChange={(v) => setScaleY(v[0])} />
        </ControlRow>
        <ControlRow label={`x 方向剪切 a: ${shear.toFixed(2)}`}>
          <Slider value={[shear]} min={-1.0} max={1.0} step={0.05} onValueChange={(v) => setShear(v[0])} />
        </ControlRow>
      </div>

      <FormulaCard
        title="当前变换的 Jacobian 行列式"
        formula={String.raw`\det J = s_y = ${scaleY.toFixed(2)}`}
        description={
          <>
            因此 <KaTeX math={String.raw`\ln |\det J| \approx ${logDet.toFixed(3)}`} />。
            缩放因子越大，变换后区域面积越大，密度越低。
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
  const size = 280;
  const padding = 20;
  const scale = 45;
  const center = size / 2;

  const dots = points.map(([x, y], i) => {
    const px = center + x * scale;
    const py = center - y * scale;
    return <circle key={i} cx={px} cy={py} r={2} fill={color} opacity={0.65} />;
  });

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 text-center">{title}</div>
      <svg
        width={size}
        height={size}
        className="mx-auto bg-white border border-gray-200 rounded-lg"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* grid */}
        <line x1={padding} y1={center} x2={size - padding} y2={center} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={center} y1={padding} x2={center} y2={size - padding} stroke="#e5e7eb" strokeWidth={1} />
        {dots}
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
