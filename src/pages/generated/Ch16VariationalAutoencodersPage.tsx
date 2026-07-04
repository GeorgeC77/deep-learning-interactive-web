import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';
import type { Section } from '@/course/manifest';

const SECTION_PATH = '/ch16/variational-autoencoders';

export default function Ch16VariationalAutoencodersPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection: Section | null = allSections[currentIndex - 1] ?? null;
  const nextSection: Section | null = allSections[currentIndex + 1] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '19.2 变分自编码器'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          变分自编码器把编码器输出解释为数据相关的后验分布，通过重参数化技巧端到端地优化证据下界（ELBO）。
          它既能学习紧致的隐表示，又能作为生成模型从先验中采样合成新数据。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Core concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="概率生成模型"
            description={
              <>
                VAE 假设数据由隐变量生成：先验 <KaTeX math={String.raw`p(\boldsymbol{z})`} /> 通常是标准高斯，
                似然 <KaTeX math={String.raw`p_\theta(\boldsymbol{x}\mid\boldsymbol{z})`} /> 由深度解码器参数化。
              </>
            }
          />
          <ConceptCard
            title="摊销推断"
            description={
              <>
                编码器（推断网络）同时输出每个数据点的变分后验参数，
                如 <KaTeX math={String.raw`q_\phi(\boldsymbol{z}\mid\boldsymbol{x})=\mathcal{N}(\boldsymbol{z}\mid\boldsymbol{\mu}_\phi(\boldsymbol{x}),\operatorname{diag}\{\boldsymbol{\sigma}_\phi^2(\boldsymbol{x})\})`} />，
                避免逐点优化变分参数。
              </>
            }
          />
          <ConceptCard
            title="重参数化技巧"
            description={
              <>
                从标准高斯采样 <KaTeX math={String.raw`\boldsymbol{\epsilon}`} />，
                通过 <KaTeX math={String.raw`\boldsymbol{z}=\boldsymbol{\mu}+\boldsymbol{\sigma}\odot\boldsymbol{\epsilon}`} /> 得到样本。
                这样随机性来自输入噪声，梯度可反向传播到 μ 与 σ。
              </>
            }
          />
          <ConceptCard
            title="证据下界 ELBO"
            description="ELBO 是难解对数似然的下界，包含重构项与 KL 正则项，最大化它同时保证好的重构与接近先验的隐分布。"
          />
        </div>
      </section>

      {/* ELBO and formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ELBO 与 KL 散度</h2>
        <p className="text-gray-700 mb-4">
          对单个数据点 <KaTeX math={String.raw`\boldsymbol{x}`} />，对数似然可分解为：
        </p>
        <FormulaCard
          title="对数似然分解"
          formula={String.raw`\ln p_\theta(\boldsymbol{x}) = \mathcal{L}(\boldsymbol{x};\theta,\phi) + D_{KL}\bigl(q_\phi(\boldsymbol{z}\mid\boldsymbol{x}) \| p_\theta(\boldsymbol{z}\mid\boldsymbol{x})\bigr)`}
          description="KL 项非负，因此 ELBO ℒ 是对数似然的下界。"
        />
        <p className="text-gray-700 mt-4 mb-4">ELBO 的常用形式把重构与正则显式分开：</p>
        <FormulaCard
          title="ELBO"
          formula={String.raw`\mathcal{L} = \underbrace{\mathbb{E}_{q_\phi(\boldsymbol{z}\mid\boldsymbol{x})}\bigl[\ln p_\theta(\boldsymbol{x}\mid\boldsymbol{z})\bigr]}_{\text{重构项}} - \underbrace{D_{KL}\bigl(q_\phi(\boldsymbol{z}\mid\boldsymbol{x}) \| p(\boldsymbol{z})\bigr)}_{\text{正则项}}`}
          description="重构项鼓励解码器准确恢复输入，KL 项让后验接近先验，使采样有意义。"
        />
        <p className="text-gray-700 mt-4 mb-4">
          当先验与后验都是对角高斯 <KaTeX math={String.raw`\mathcal{N}(0,\boldsymbol{I})`} /> 与
          <KaTeX math={String.raw`\mathcal{N}(\boldsymbol{\mu},\operatorname{diag}\{\boldsymbol{\sigma}^2\})`} /> 时，
          KL 散度有闭式解：
        </p>
        <FormulaCard
          title="对角高斯的 KL 散度"
          formula={String.raw`D_{KL}(q\|p) = \frac{1}{2}\sum_{j=1}^{J}\bigl(\sigma_j^2 + \mu_j^2 - 1 - \ln \sigma_j^2\bigr)`}
          description="当 μ=0 且 σ=1 时 KL 为 0；σ 偏离 1 或 μ 偏离 0 都会增大 KL。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：β-VAE 的 KL/重构权衡">
        <BetaVaeTradeOffDemo />
      </InteractiveDemo>

      {/* Navigation */}
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
    </div>
  );
}

function BetaVaeTradeOffDemo() {
  const [mu, setMu] = useState(1.2);
  const [sigma, setSigma] = useState(0.8);
  const [beta, setBeta] = useState(1.0);

  const target = 2.0;

  const { recon, kl, total } = useMemo(() => {
    const r = 0.5 * (target - mu) ** 2;
    const k = 0.5 * (sigma * sigma + mu * mu - 1 - Math.log(sigma * sigma));
    return { recon: r, kl: k, total: r + beta * k };
  }, [mu, sigma, beta]);

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        设观测目标 <KaTeX math={String.raw`x=${target.toFixed(1)}`} />，解码器均值由隐变量均值
        <KaTeX math={String.raw`\mu`} /> 决定，KL 项衡量后验 <KaTeX math={String.raw`\mathcal{N}(\mu,\sigma^2)`} /> 与标准先验的差距。
        调节 <KaTeX math={String.raw`\beta`} /> 观察重构误差与 KL 正则之间的权衡。
      </p>

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              后验均值 <KaTeX math={String.raw`\mu`} />
            </label>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{mu.toFixed(2)}</span>
          </div>
          <Slider value={[mu]} min={-2} max={3} step={0.1} onValueChange={(v) => setMu(v[0])} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              后验标准差 <KaTeX math={String.raw`\sigma`} />
            </label>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{sigma.toFixed(2)}</span>
          </div>
          <Slider value={[sigma]} min={0.2} max={2} step={0.05} onValueChange={(v) => setSigma(v[0])} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              正则权重 <KaTeX math={String.raw`\beta`} />
            </label>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{beta.toFixed(2)}</span>
          </div>
          <Slider value={[beta]} min={0} max={5} step={0.1} onValueChange={(v) => setBeta(v[0])} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">重构误差</div>
          <div className="text-2xl font-bold text-blue-700">{recon.toFixed(3)}</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">KL 散度</div>
          <div className="text-2xl font-bold text-amber-700">{kl.toFixed(3)}</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600">总损失</div>
          <div className="text-2xl font-bold text-indigo-700">{total.toFixed(3)}</div>
        </div>
      </div>

      <FormulaCard
        title="β-VAE 目标"
        formula={String.raw`\mathcal{L}_\beta = \mathbb{E}_{q(z|x)}[\ln p(x|z)] - \beta \, D_{KL}(q(z|x)\|p(z))`}
        description="增大 β 会强化隐分布向先验收缩，可能牺牲重构精度；β=1 即为标准 VAE。"
      />
    </div>
  );
}
