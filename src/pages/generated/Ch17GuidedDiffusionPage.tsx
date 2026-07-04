import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const K_STEPS = 50;
const ETA = 0.08;
const N_SAMPLES = 300;
const MU0 = -1.5;
const MU1 = 1.5;
const SIGMA_DATA = 0.5;

export default function Ch17GuidedDiffusionPage() {
  const sectionPath = '/ch17/guided-diffusion';
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
            <Sparkles className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '20.4 引导扩散'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          引导扩散通过在采样过程中引入条件信息，控制生成结果与类别、文本或其他语义对齐。主要包括分类器引导与无分类器引导两种范式。
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
            title="分类器引导"
            description="在反向采样时，额外引入训练好的分类器对条件类别 log 概率的梯度，把样本推向分类器置信度更高的区域。"
          />
          <ConceptCard
            title="无分类器引导"
            description="不依赖额外分类器，而是同时训练条件与无条件模型，在采样时用二者的差值控制生成方向。"
          />
          <ConceptCard
            title="引导尺度"
            description="指导尺度 w 越大，生成结果越贴合条件但多样性下降；w=0 退化为无条件生成。"
          />
          <ConceptCard
            title="条件生成"
            description="条件可以是类别标签、文本嵌入或其他结构化信息，通过交叉注意力或嵌入注入到噪声网络中。"
          />
        </div>
      </section>

      {/* Classifier guidance */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">分类器引导</h2>
        <p className="text-gray-700 mb-4">
          假设已经训练好一个条件分类器 <KaTeX math={String.raw`p_\phi(c|\mathbf{x}_t)`} />，
          则在反向转移中可以通过贝叶斯定理引入类别信息：
        </p>
        <FormulaCard
          title="分类器引导下的反向转移"
          formula={String.raw`p(\mathbf{x}_t|\mathbf{x}_{t+1},c)\propto p(\mathbf{x}_t|\mathbf{x}_{t+1})\,p_\phi(c|\mathbf{x}_t)^w`}
          description="w 为引导尺度，控制分类器梯度的影响强度。"
        />
        <p className="text-gray-700 mt-4">
          对应到分数形式，条件分数等于无条件分数加上分类器分数的加权梯度：
        </p>
        <FormulaCard
          title="分数视角"
          formula={String.raw`\nabla_{\mathbf{x}_t}\ln p(\mathbf{x}_t|c)=\nabla_{\mathbf{x}_t}\ln p(\mathbf{x}_t)+w\,\nabla_{\mathbf{x}_t}\ln p_\phi(c|\mathbf{x}_t)`}
          description="分类器梯度把样本推向更可能属于类别 c 的区域。"
        />
      </section>

      {/* Classifier-free guidance */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">无分类器引导</h2>
        <p className="text-gray-700 mb-4">
          无分类器引导在训练时以一定概率丢弃条件标签，使同一个网络既能做条件预测也能做无条件预测。
          采样时，将条件分数向远离无条件分数的方向推进：
        </p>
        <FormulaCard
          title="无分类器引导分数"
          formula={String.raw`\tilde{\mathbf{s}}(\mathbf{x},y)=\mathbf{s}(\mathbf{x},y)+w\bigl(\mathbf{s}(\mathbf{x},y)-\mathbf{s}(\mathbf{x})\bigr)`}
          description="w 为指导尺度；w=1 时等价于纯条件采样。"
        />
        <p className="text-gray-700 mt-4">
          在扩散模型的噪声预测形式下，同样的公式写作：
        </p>
        <FormulaCard
          title="噪声预测形式"
          formula={String.raw`\tilde{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t,y)=\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,y)+w\bigl(\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,y)-\boldsymbol{\epsilon}_\theta(\mathbf{x}_t)\bigr)`}
          description="增加 w 会放大条件信号，使生成结果更清晰、语义更强。"
        />
      </section>

      {/* Conditional generation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">条件生成实践</h2>
        <p className="text-gray-700 mb-4">
          条件信息 y 可以通过多种方式注入噪声网络：
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>类别嵌入：</strong>将类别索引映射为向量后与时间嵌入相加。
          </li>
          <li>
            <strong>注意力机制：</strong>使用交叉注意力把文本或图像条件引入去噪网络。
          </li>
          <li>
            <strong>自适应归一化：</strong>通过 AdaGN 等结构把条件作为缩放与偏置注入特征图。
          </li>
        </ul>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：无分类器引导的一维采样">
        <GuidanceDemo />
      </InteractiveDemo>

      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function GuidanceDemo() {
  const [cls, setCls] = useState<0 | 1>(1);
  const [w, setW] = useState(1.0);
  const [seed, setSeed] = useState(0);

  const { finalSamples } = useMemo(() => {
    const rng = mulberry32(seed);
    const init: number[] = [];
    const noises: number[][] = Array.from({ length: K_STEPS }, () => []);
    for (let i = 0; i < N_SAMPLES; i++) {
      init.push(randn(rng));
      for (let k = 0; k < K_STEPS; k++) {
        noises[k].push(randn(rng));
      }
    }
    const targetMu = cls === 0 ? MU0 : MU1;
    const final = init.map((x, i) => {
      let xi = x;
      for (let k = 0; k < K_STEPS; k++) {
        const sCond = -(xi - targetMu) / (SIGMA_DATA * SIGMA_DATA);
        const sUncond = mixtureScore(xi);
        const sGuided = sCond + w * (sCond - sUncond);
        xi += ETA * sGuided + Math.sqrt(2 * ETA) * noises[k][i];
      }
      return xi;
    });
    return { finalSamples: final };
  }, [cls, w, seed]);

  const hist = histogram(finalSamples, -4, 4, 30);
  const maxCount = Math.max(...hist.map((b) => b.count), 1);
  const targetMu = cls === 0 ? MU0 : MU1;
  const targetX = ((targetMu - -4) / (4 - -4)) * 100; // percent within [-4,4]

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        数据分布是两个高斯的混合。选择目标类别后，调整无分类器引导尺度 w，观察采样分布如何向目标模态集中。
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">目标类别：</span>
          <Button variant={cls === 0 ? 'default' : 'outline'} size="sm" onClick={() => setCls(0)}>
            类别 0（μ=-1.5）
          </Button>
          <Button variant={cls === 1 ? 'default' : 'outline'} size="sm" onClick={() => setCls(1)}>
            类别 1（μ=+1.5）
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            引导尺度 w
          </label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{w.toFixed(2)}</span>
        </div>
        <Slider value={[w]} min={0} max={4} step={0.1} onValueChange={(v) => setW(v[0])} />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 text-center">采样分布</div>
        <div className="relative h-40 bg-gray-50 rounded-lg border border-gray-200 p-2 flex items-end gap-0.5">
          {hist.map((b, i) => (
            <div
              key={i}
              className="flex-1 bg-indigo-500 rounded-t"
              style={{ height: `${(b.count / maxCount) * 100}%` }}
              title={`[${b.start.toFixed(2)}, ${b.end.toFixed(2)}]: ${b.count}`}
            />
          ))}
          {/* target mean marker */}
          <div
            className="absolute bottom-0 w-0.5 h-full bg-red-400 opacity-70"
            style={{ left: `${Math.max(0, Math.min(100, targetX))}%` }}
          />
        </div>
        <div className="text-xs text-center text-gray-500">红色竖线为目标类别均值</div>
      </div>

      <FormulaCard
        title="当前使用的引导分数"
        formula={String.raw`\tilde{s}(x)=s(x,y=${cls})+${w.toFixed(1)}\bigl(s(x,y=${cls})-s(x)\bigr)`}
        description="w 越大，采样分布越集中在目标类别附近，但与另一类重叠越少。"
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

function mixtureScore(x: number) {
  const mus = [MU0, MU1];
  const weights = [0.5, 0.5];
  const variance = SIGMA_DATA * SIGMA_DATA;
  const densities = mus.map((mu, i) => weights[i] * normalDensity(x, mu, variance));
  const total = densities.reduce((a, b) => a + b, 0);
  if (total < 1e-12) return 0;
  let score = 0;
  for (let i = 0; i < mus.length; i++) {
    score += densities[i] * (-(x - mus[i]) / variance);
  }
  return score / total;
}

function normalDensity(x: number, mu: number, variance: number) {
  const z = (x - mu) / Math.sqrt(variance);
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI * variance);
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
