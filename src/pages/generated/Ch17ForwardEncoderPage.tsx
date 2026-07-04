import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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

const T = 100;
const BETA_START = 1e-4;
const BETA_END = 0.02;
const SIGMA0 = 0.5; // std of clean data
const N_SAMPLES = 500;

export default function Ch17ForwardEncoderPage() {
  const sectionPath = '/ch17/forward-encoder';
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '20.1 前向编码器'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          前向编码器是一个固定的马尔可夫链，它在多个时间步内向数据样本注入高斯噪声，最终把复杂的数据分布转化为简单的先验分布。
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
            title="马尔可夫扩散核"
            description="每一步的转移分布都是高斯，均值对前一步样本做收缩，方差由当前步的噪声水平决定。"
          />
          <ConceptCard
            title="闭式前向分布"
            description="由于所有转移都是高斯，任意时刻 t 的分布可以直接从初始数据 x₀ 采样，无需逐步行进。"
          />
          <ConceptCard
            title="重参数技巧"
            description="通过一次性采样标准高斯噪声，即可得到任意 t 对应的加噪样本，极大简化了训练。"
          />
          <ConceptCard
            title="噪声调度"
            description="βₜ 的选择决定扩散速度。常用线性调度、余弦调度等，使前向过程平稳收敛到先验。"
          />
        </div>
      </section>

      {/* Forward kernel formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">前向扩散核</h2>
        <p className="text-gray-700 mb-4">
          设时间步集合为 <KaTeX math={String.raw`t=1,\dots,T`} />，噪声方差序列为 <KaTeX math={String.raw`\beta_1,\dots,\beta_T`} />。
          前向转移概率定义为：
        </p>
        <FormulaCard
          title="单步扩散核"
          formula={String.raw`q(\mathbf{x}_t|\mathbf{x}_{t-1})=\mathcal{N}\!\left(\mathbf{x}_t;\sqrt{1-\beta_t}\,\mathbf{x}_{t-1},\beta_t\mathbf{I}\right)`}
          description="均值对前一步样本进行收缩，协方差与噪声方差 βₜ 成正比。"
        />
        <p className="text-gray-700 mt-4">
          引入 <KaTeX math={String.raw`\alpha_t=1-\beta_t`} /> 与累积乘积 <KaTeX math={String.raw`\bar{\alpha}_t=\prod_{s=1}^{t}\alpha_s`} />，
          可得到从初始数据直接采样的闭式表达式：
        </p>
        <FormulaCard
          title="t 步联合分布"
          formula={String.raw`q(\mathbf{x}_t|\mathbf{x}_0)=\mathcal{N}\!\left(\mathbf{x}_t;\sqrt{\bar{\alpha}_t}\,\mathbf{x}_0,(1-\bar{\alpha}_t)\mathbf{I}\right)`}
          description="当 t 增大时，均值项衰减、方差项趋于 1，分布接近标准高斯。"
        />
        <FormulaCard
          title="重参数采样"
          formula={String.raw`\mathbf{x}_t=\sqrt{\bar{\alpha}_t}\,\mathbf{x}_0+\sqrt{1-\bar{\alpha}_t}\,\boldsymbol{\epsilon},\quad \boldsymbol{\epsilon}\sim\mathcal{N}(\mathbf{0},\mathbf{I})`}
          description="一次采样 ε 即可得到对应时刻的加噪样本，是训练 minibatch 的关键。"
        />
      </section>

      {/* Noise schedule */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">噪声调度</h2>
        <p className="text-gray-700 mb-4">
          扩散模型的表现对 <KaTeX math={String.raw`\beta_t`} /> 的选取非常敏感。典型选择包括：
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>
            <strong>线性调度：</strong>
            <KaTeX math={String.raw`\beta_t=\beta_{\min}+\frac{t-1}{T-1}(\beta_{\max}-\beta_{\min})`} />
          </li>
          <li>
            <strong>余弦调度：</strong>让 <KaTeX math={String.raw`\bar{\alpha}_t`} /> 按余弦曲线缓慢衰减，通常在图像生成中能获得更高质量。
          </li>
        </ul>
        <p className="text-gray-700">
          无论采用何种调度，只要 <KaTeX math={String.raw`\bar{\alpha}_T\approx 0`} />，前向过程最终都会把数据分布变成近似标准高斯。
        </p>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：一维高斯前向扩散">
        <ForwardDiffusionDemo />
      </InteractiveDemo>

      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function ForwardDiffusionDemo() {
  const [t, setT] = useState(0);
  const [seed, setSeed] = useState(0);

  const { alphaBars, x0, epsT } = useMemo(() => {
    const rng = mulberry32(seed);
    const betas: number[] = [];
    const alphas: number[] = [];
    const alphaBars: number[] = [];
    let prod = 1;
    for (let i = 0; i <= T; i++) {
      const beta = i === 0 ? 0 : BETA_START + ((BETA_END - BETA_START) * (i - 1)) / (T - 1);
      const alpha = 1 - beta;
      prod *= alpha;
      betas.push(beta);
      alphas.push(alpha);
      alphaBars.push(i === 0 ? 1 : prod);
    }
    const x0: number[] = [];
    for (let i = 0; i < N_SAMPLES; i++) {
      x0.push(SIGMA0 * randn(rng));
    }
    // Pre-generate noise for every timestep to keep the distribution stable when moving the slider
    const epsT: number[][] = Array.from({ length: T + 1 }, () => []);
    for (let step = 0; step <= T; step++) {
      for (let i = 0; i < N_SAMPLES; i++) {
        epsT[step].push(randn(rng));
      }
    }
    return { betas, alphas, alphaBars, x0, epsT };
  }, [seed]);

  const alphaBar = alphaBars[t];
  const xt = useMemo(() => {
    const sAb = Math.sqrt(alphaBar);
    const sOm = Math.sqrt(1 - alphaBar);
    return x0.map((x, i) => sAb * x + sOm * epsT[t][i]);
  }, [x0, epsT, alphaBar, t]);

  const hist0 = histogram(x0, -4, 4, 30);
  const histT = histogram(xt, -4, 4, 30);
  const maxCount = Math.max(
    ...hist0.map((b) => b.count),
    ...histT.map((b) => b.count),
    1
  );

  const theoreticalVariance = alphaBar * SIGMA0 * SIGMA0 + (1 - alphaBar) * 1;

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        下面展示一个标准差 <KaTeX math={String.raw`\sigma_0=0.5`} /> 的一维高斯数据如何随时间步增加而逐渐变为标准高斯噪声。
        拖动滑块观察分布变化。
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            时间步 t
          </label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{t}</span>
        </div>
        <Slider value={[t]} min={0} max={T} step={1} onValueChange={(v) => setT(v[0])} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 text-center">干净数据 p(x₀)</div>
          <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 p-2 flex items-end gap-0.5">
            {hist0.map((b, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-400 rounded-t"
                style={{ height: `${(b.count / maxCount) * 100}%` }}
                title={`[${b.start.toFixed(2)}, ${b.end.toFixed(2)}]: ${b.count}`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 text-center">加噪后 q(xₜ|x₀)</div>
          <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 p-2 flex items-end gap-0.5">
            {histT.map((b, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-500 rounded-t"
                style={{ height: `${(b.count / maxCount) * 100}%` }}
                title={`[${b.start.toFixed(2)}, ${b.end.toFixed(2)}]: ${b.count}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">理论方差</div>
          <div className="text-2xl font-bold text-blue-700">{theoreticalVariance.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
          <KaTeX math={String.raw`\bar{\alpha}_{${t}}=${alphaBar.toFixed(4)}`} />
        </div>
      </div>

      <FormulaCard
        title="当前时刻的采样公式"
        formula={String.raw`\mathbf{x}_{${t}}=\sqrt{\bar{\alpha}_{${t}}}\,\mathbf{x}_0+\sqrt{1-\bar{\alpha}_{${t}}}\,\boldsymbol{\epsilon}`}
        description="随着时间步增加，x₀ 的贡献逐渐衰减，噪声项占据主导。"
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

function randn(rng: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
