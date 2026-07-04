import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
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

export default function Ch15OverviewPage() {
  const sectionPath = '/ch15/overview';
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
            <ArrowLeftRight className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '课程概览'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          标准化流通过可逆神经网络将简单分布变换为复杂分布，同时保持精确的似然计算，是生成模型中唯一能同时高效采样与精确评估密度的方法族之一。
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
            title="可逆变换"
            description={
              <>
                流的每一层都是双射 <KaTeX math={String.raw`f: oldsymbol{z} 	o oldsymbol{x}`} />
                ，使得前向采样与反向推断都能高效进行。训练完成后，既可以从基分布采样再前向变换得到数据样本，也可以将数据反向映射回基分布计算似然。
              </>
            }
          />
          <ConceptCard
            title="变量替换公式"
            description={
              <>
                变换后的密度由原密度与 Jacobian 行列式共同决定。对数形式避免了数值下溢，是流模型损失函数的核心。
              </>
            }
          />
          <ConceptCard
            title="标准化流架构"
            description="耦合流、自回归流与连续流在表达能力、并行度与计算成本之间各有取舍，适用于图像、音频、分子生成等多种任务。"
          />
          <ConceptCard
            title="训练目标"
            description="最大化数据在模型下的对数似然，等价于最小化模型分布与数据分布之间的 KL 散度。"
          />
        </div>
      </section>

      {/* Change of variables formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">变量替换公式</h2>
        <p className="text-gray-700 mb-4">
          设 <KaTeX math={String.raw`\boldsymbol{z} \sim p_z(\boldsymbol{z})`} /> 为简单基分布（通常是标准高斯），
          <KaTeX math={String.raw`\boldsymbol{x} = f(\boldsymbol{z})`} /> 是一个可逆且可微的变换，则
          <KaTeX math={String.raw`\boldsymbol{x}`} /> 的密度为：
        </p>
        <FormulaCard
          title="多元变量替换"
          formula={String.raw`p_x(\boldsymbol{x}) = p_z\bigl(f^{-1}(\boldsymbol{x})\bigr) \left| \det \frac{\partial f^{-1}}{\partial \boldsymbol{x}} \right|`}
          description="Jacobian 行列式的绝对值刻画了变换对体积元的局部伸缩。"
        />
        <p className="text-gray-700 mt-4">
          若用正向变换 <KaTeX math={String.raw`\boldsymbol{x} = f(\boldsymbol{z})`} /> 表示，并记
          <KaTeX math={String.raw`J_f(\boldsymbol{z}) = \partial f / \partial \boldsymbol{z}`} />，则对数密度常写成：
        </p>
        <FormulaCard
          title="对数密度"
          formula={String.raw`\ln p_x(\boldsymbol{x}) = \ln p_z(\boldsymbol{z}) - \ln \left| \det J_f(\boldsymbol{z}) \right|`}
          description="第二项称为 log-det-Jacobian，是流模型训练与推断的关键。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：一维线性缩放改变密度">
        <DensityScalingDemo />
      </InteractiveDemo>

      {/* Navigation */}
      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function DensityScalingDemo() {
  const [scale, setScale] = useState(1.0);
  const [seed, setSeed] = useState(0);

  const points = useMemo(() => {
    const rng = mulberry32(seed);
    const xs: number[] = [];
    for (let i = 0; i < 300; i++) {
      // Box-Muller for standard normal
      const u1 = rng();
      const u2 = rng();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      xs.push(z);
    }
    return xs;
  }, [seed]);

  const transformed = points.map((z) => z * scale);
  const baseHist = histogram(points, -3, 3, 20);
  const transHist = histogram(transformed, -3 * Math.max(scale, 0.2), 3 * Math.max(scale, 0.2), 20);
  const maxBase = Math.max(...baseHist.map((b) => b.count), 1);
  const maxTrans = Math.max(...transHist.map((b) => b.count), 1);

  const densityAtOne = (Math.exp(-Math.pow(1 / scale, 2) / 2) / Math.sqrt(2 * Math.PI)) / Math.abs(scale);

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        调整缩放因子 <KaTeX math={String.raw`s`} />，观察标准高斯经过线性变换
        <KaTeX math={String.raw`x = s \cdot z`} /> 后样本分布与密度的变化。缩放越大，分布越“扁平”，
        密度峰值越低。
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            缩放因子 s
          </label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{scale.toFixed(2)}</span>
        </div>
        <Slider value={[scale]} min={0.3} max={2.5} step={0.05} onValueChange={(v) => setScale(v[0])} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 text-center">基分布 p(z)</div>
          <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 p-2 flex items-end gap-1">
            {baseHist.map((b, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-400 rounded-t"
                style={{ height: `${(b.count / maxBase) * 100}%` }}
                title={`[${b.start.toFixed(1)}, ${b.end.toFixed(1)}]: ${b.count}`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 text-center">变换后 p(x)</div>
          <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 p-2 flex items-end gap-1">
            {transHist.map((b, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-500 rounded-t"
                style={{ height: `${(b.count / maxTrans) * 100}%` }}
                title={`[${b.start.toFixed(1)}, ${b.end.toFixed(1)}]: ${b.count}`}
              />
            ))}
          </div>
        </div>
      </div>

      <FormulaCard
        title="变换后的密度"
        formula={String.raw`p_x(x) = p_z\left(\frac{x}{s}\right) \frac{1}{|s|}`}
        description={
          <>
            当 <KaTeX math={String.raw`s=${scale.toFixed(2)}`} /> 时，
            <KaTeX math={String.raw`p_x(1)\approx ${densityAtOne.toFixed(3)}`} />。
          </>
        }
      />

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="w-4 h-4 mr-2" />
          重新采样
        </Button>
      </div>
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

function histogram(values: number[], min: number, max: number, bins: number) {
  const step = (max - min) / bins;
  const counts = Array.from({ length: bins }, (_, i) => ({
    start: min + i * step,
    end: min + (i + 1) * step,
    count: 0,
  }));
  for (const v of values) {
    if (v < min || v > max) continue;
    const idx = Math.min(Math.floor((v - min) / step), bins - 1);
    counts[idx].count += 1;
  }
  return counts;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
