import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const GRID_MIN = -4;
const GRID_MAX = 4;
const GRID_STEP = 0.1;

export default function Ch17ScoreMatchingPage() {
  const sectionPath = '/ch17/score-matching';
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
            <TrendingUp className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '20.3 分数匹配'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          分数匹配直接估计数据分布的对数密度梯度，而不是密度本身。扩散模型中的噪声预测目标可以被理解为对加噪数据分布的分数估计。
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
            title="分数函数"
            description="分数是 log 密度对输入的梯度，指向密度增长最快的方向，是生成采样中常用的导航信号。"
          />
          <ConceptCard
            title="去噪分数匹配"
            description="用加噪后的数据分布定义分数，避免直接对真实数据密度求导，训练更稳定。"
          />
          <ConceptCard
            title="噪声条件分数网络"
            description="NCSN 在多个噪声水平上训练单一网络，通过退火 Langevin 动力学完成高质量采样。"
          />
          <ConceptCard
            title="与扩散模型的联系"
            description="扩散模型中的噪声预测网络与分数网络只相差一个缩放系数，二者目标本质相同。"
          />
        </div>
      </section>

      {/* Score definitions */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">分数函数与匹配目标</h2>
        <p className="text-gray-700 mb-4">
          给定数据分布 <KaTeX math={String.raw`p(\mathbf{x})`} />，其分数函数定义为：
        </p>
        <FormulaCard
          title="分数定义"
          formula={String.raw`\mathbf{s}(\mathbf{x})=\nabla_{\mathbf{x}}\ln p(\mathbf{x})`}
          description="分数指向局部密度上升的方向，其模长反映密度变化的快慢。"
        />
        <p className="text-gray-700 mt-4">
          显式分数匹配直接用神经网络 <KaTeX math={String.raw`\mathbf{s}_\theta`} /> 逼近真实分数：
        </p>
        <FormulaCard
          title="显式分数匹配"
          formula={String.raw`\mathcal{L}_{\text{sm}}=\frac{1}{2}\mathbb{E}_{p(\mathbf{x})}\!\left[\|\mathbf{s}_\theta(\mathbf{x})-\nabla_{\mathbf{x}}\ln p(\mathbf{x})\|^2\right]`}
          description="需要知道真实分数，通常不直接可用。"
        />
        <p className="text-gray-700 mt-4">
          更实用的是对加噪分布 <KaTeX math={String.raw`q_\sigma(\mathbf{x})`} /> 做去噪分数匹配：
        </p>
        <FormulaCard
          title="去噪分数匹配"
          formula={String.raw`\mathcal{L}_{\text{dsm}}=\frac{1}{2}\mathbb{E}_{q_\sigma(\mathbf{x})}\!\left[\|\mathbf{s}_\theta(\mathbf{x})-\nabla_{\mathbf{x}}\ln q_\sigma(\mathbf{x})\|^2\right]`}
          description="等价于训练网络从加噪样本中预测原始干净样本，与扩散训练目标密切相关。"
        />
      </section>

      {/* NCSN */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">噪声条件分数网络</h2>
        <p className="text-gray-700 mb-4">
          单一分数网络难以同时覆盖低噪声细节与高噪声全局结构。NCSN 把噪声水平 σ 作为额外输入：
        </p>
        <FormulaCard
          title="噪声条件分数网络"
          formula={String.raw`\mathbf{s}_\theta(\mathbf{x},\sigma)\approx\nabla_{\mathbf{x}}\ln q_\sigma(\mathbf{x})`}
          description="对多个 σ 同时训练，网络学会在不同扰动尺度下估计分数。"
        />
        <p className="text-gray-700 mt-4">
          采样时使用退火 Langevin 动力学：从较大 σ 开始，逐步减小噪声水平，在每一步执行：
        </p>
        <FormulaCard
          title="退火 Langevin 动力学"
          formula={String.raw`\mathbf{x}_{k+1}=\mathbf{x}_k+\eta_i\,\mathbf{s}_\theta(\mathbf{x}_k,\sigma_i)+\sqrt{2\eta_i}\,\mathbf{z}_k`}
          description="ηᵢ 为第 i 个噪声水平对应的学习率，zₖ 为标准高斯噪声。"
        />
      </section>

      {/* Connection to diffusion */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">与扩散模型的等价关系</h2>
        <p className="text-gray-700 mb-4">
          扩散前向分布 <KaTeX math={String.raw`q(\mathbf{x}_t|\mathbf{x}_0)`} /> 是条件高斯，其分数为：
        </p>
        <FormulaCard
          title="扩散分数"
          formula={String.raw`\nabla_{\mathbf{x}_t}\ln q(\mathbf{x}_t|\mathbf{x}_0)=-\frac{\boldsymbol{\epsilon}}{\sqrt{1-\bar{\alpha}_t}}`}
          description="其中 ε 是生成 xₜ 时使用的标准高斯噪声。"
        />
        <p className="text-gray-700 mt-4">
          因此噪声预测网络与分数网络之间只相差一个已知的时间相关缩放：
        </p>
        <FormulaCard
          title="噪声–分数对应"
          formula={String.raw`\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,t)=-\sqrt{1-\bar{\alpha}_t}\,\mathbf{s}_\theta(\mathbf{x}_t,t)`}
          description="扩散模型训练噪声网络，本质上就是在学习加噪数据分布的分数函数。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：一维分数场随噪声水平变化">
        <ScoreFieldDemo />
      </InteractiveDemo>

      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function ScoreFieldDemo() {
  const [sigma, setSigma] = useState(0.5);

  const points = useMemo(() => {
    const xs: number[] = [];
    for (let x = GRID_MIN; x <= GRID_MAX + 1e-9; x += GRID_STEP) xs.push(x);
    const scores = xs.map((x) => noisyMixtureScore(x, sigma));
    const minS = Math.min(...scores);
    const maxS = Math.max(...scores);
    const range = Math.max(maxS - minS, 1e-6);
    return xs.map((x, i) => ({
      x,
      score: scores[i],
      svgX: ((x - GRID_MIN) / (GRID_MAX - GRID_MIN)) * 400,
      svgY: 180 - ((scores[i] - minS) / range) * 160,
    }));
  }, [sigma]);

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.svgX.toFixed(1)} ${p.svgY.toFixed(1)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        数据分布是两个高斯的等权混合（均值 <KaTeX math={String.raw`\pm 1.5`} />，标准差 <KaTeX math={String.raw`0.5`} />）。
        拖动 σ 改变加噪程度，观察分数场如何从清晰的“推向最近模态”逐渐变平坦。
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            噪声水平 σ
          </label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{sigma.toFixed(2)}</span>
        </div>
        <Slider value={[sigma]} min={0.1} max={2.0} step={0.05} onValueChange={(v) => setSigma(v[0])} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-2">
        <svg viewBox="0 0 400 200" className="w-full h-48">
          {/* x-axis */}
          <line x1="0" y1="180" x2="400" y2="180" stroke="#d1d5db" strokeWidth="1" />
          {/* mean markers */}
          <circle cx="125" cy="180" r="3" fill="#3b82f6" />
          <circle cx="275" cy="180" r="3" fill="#3b82f6" />
          <text x="125" y="195" fontSize="10" textAnchor="middle" fill="#6b7280">
            -1.5
          </text>
          <text x="275" y="195" fontSize="10" textAnchor="middle" fill="#6b7280">
            1.5
          </text>
          {/* score curve */}
          <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="2" />
        </svg>
      </div>

      <FormulaCard
        title="加噪混合分布的分数"
        formula={String.raw`\nabla_x \ln q_\sigma(x)=\frac{\sum_i \pi_i\,\mathcal{N}(x;\mu_i,\sigma_i^2+\sigma^2)\,\frac{-(x-\mu_i)}{\sigma_i^2+\sigma^2}}{\sum_i \pi_i\,\mathcal{N}(x;\mu_i,\sigma_i^2+\sigma^2)}`}
        description="σ 越大，各高斯越重叠，分数场的峰值和谷值越不明显。"
      />
    </div>
  );
}

function noisyMixtureScore(x: number, sigma: number) {
  const mus = [-1.5, 1.5];
  const s = 0.5;
  const weights = [0.5, 0.5];
  const variances = mus.map(() => s * s + sigma * sigma);
  const densities = mus.map((mu, i) => weights[i] * normalDensity(x, mu, variances[i]));
  const total = densities.reduce((a, b) => a + b, 0);
  if (total < 1e-12) return 0;
  let score = 0;
  for (let i = 0; i < mus.length; i++) {
    score += densities[i] * (-(x - mus[i]) / variances[i]);
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
