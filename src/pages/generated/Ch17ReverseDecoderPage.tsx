import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
  Undo2,
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
const SIGMA0 = 0.5;

export default function Ch17ReverseDecoderPage() {
  const sectionPath = '/ch17/reverse-decoder';
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
            <Undo2 className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '20.2 反向解码器'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          反向解码器学习从噪声恢复数据的条件分布。通过变分下界（ELBO）推导，可把训练目标简化为预测前向过程中加入的噪声。
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
            title="反向高斯转移"
            description="当 βₜ 足够小时，反向过程 q(xₜ₋₁|xₜ) 也可用高斯近似，其方差可由调度固定或可学习。"
          />
          <ConceptCard
            title="ELBO"
            description="通过 Jensen 不等式得到对数似然的下界，包含重构项、先验匹配项与每一步的 KL 散度。"
          />
          <ConceptCard
            title="噪声预测损失"
            description="将 ELBO 中的 KL 项进一步化简后，训练目标等价于神经网络预测前向噪声的均方误差。"
          />
          <ConceptCard
            title="采样过程"
            description="从标准高斯先验出发，交替使用神经网络预测噪声并采样下一步，最终得到干净数据。"
          />
        </div>
      </section>

      {/* Reverse process */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">反向过程参数化</h2>
        <p className="text-gray-700 mb-4">
          反向过程由神经网络 <KaTeX math={String.raw`\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,t)`} /> 参数化：
        </p>
        <FormulaCard
          title="反向转移"
          formula={String.raw`p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)=\mathcal{N}\!\left(\mathbf{x}_{t-1};\boldsymbol{\mu}_\theta(\mathbf{x}_t,t),\boldsymbol{\Sigma}_\theta(\mathbf{x}_t,t)\right)`}
          description="均值由网络预测决定，方差通常设为 βₜ 或学习得到的函数。"
        />
        <p className="text-gray-700 mt-4">
          若用噪声网络 <KaTeX math={String.raw`\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,t)`} /> 表达均值，则反向均值可写成：
        </p>
        <FormulaCard
          title="噪声参数化的均值"
          formula={String.raw`\boldsymbol{\mu}_\theta(\mathbf{x}_t,t)=\frac{1}{\sqrt{\alpha_t}}\left(\mathbf{x}_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,t)\right)`}
          description="此形式把去噪问题直接转化为噪声回归问题。"
        />
      </section>

      {/* ELBO & loss */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ELBO 与简化训练目标</h2>
        <p className="text-gray-700 mb-4">
          扩散模型把数据的对数似然 <KaTeX math={String.raw`\ln p_\theta(\mathbf{x}_0)`} /> 通过一个变分编码器来近似。
          相应的 ELBO 为：
        </p>
        <FormulaCard
          title="变分下界"
          formula={String.raw`\ln p_\theta(\mathbf{x}_0)\ge \mathbb{E}_q\!\left[\ln\frac{p_\theta(\mathbf{x}_{0:T})}{q(\mathbf{x}_{1:T}|\mathbf{x}_0)}\right]`}
          description="右侧包含先验匹配项与每一步反向转移相对于前向转移的 KL 散度。"
        />
        <p className="text-gray-700 mt-4">
          忽略不依赖 θ 的项，并将所有 KL 项合并化简后，得到最常用的简化目标：
        </p>
        <FormulaCard
          title="简化噪声预测损失"
          formula={String.raw`\mathcal{L}_{\text{simple}}=\mathbb{E}_{t,\mathbf{x}_0,\boldsymbol{\epsilon}}\!\left[\|\boldsymbol{\epsilon}-\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,t)\|^2\right]`}
          description="训练时只需随机采样 t、x₀ 与噪声 ε，计算 xₜ 后让网络输出 ε。"
        />
        <p className="text-gray-700 mt-4">
          实际实现中往往对每个样本在所有时间步上取平均，因此扩散训练非常稳定。
        </p>
      </section>

      {/* Sampling algorithm */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">采样算法</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
          <li>
            从先验采样 <KaTeX math={String.raw`\mathbf{x}_T\sim\mathcal{N}(\mathbf{0},\mathbf{I})`} />。
          </li>
          <li>
            对 <KaTeX math={String.raw`t=T,\dots,1`} />，用网络预测噪声 <KaTeX math={String.raw`\boldsymbol{\epsilon}_\theta(\mathbf{x}_t,t)`} />。
          </li>
          <li>
            计算均值 <KaTeX math={String.raw`\boldsymbol{\mu}_\theta`} />，并采样下一步：
          </li>
        </ol>
        <FormulaCard
          title="去噪采样步"
          formula={String.raw`\mathbf{x}_{t-1}=\boldsymbol{\mu}_\theta(\mathbf{x}_t,t)+\sqrt{\boldsymbol{\Sigma}_\theta(\mathbf{x}_t,t)}\,\mathbf{z},\quad \mathbf{z}\sim\mathcal{N}(\mathbf{0},\mathbf{I})`}
          description="当 t=1 时通常省略最后的噪声项，直接取均值作为生成结果。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：单步反向去噪">
        <ReverseDenoisingDemo />
      </InteractiveDemo>

      <SectionNavigation prevSection={prevSection} nextSection={nextSection} />
    </div>
  );
}

function ReverseDenoisingDemo() {
  const [t, setT] = useState(50);
  const [seed, setSeed] = useState(0);

  const { x0, xt, xPrev, betaT, alphaBarT } = useMemo(() => {
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

    const x0 = SIGMA0 * randn(rng);
    const eps = randn(rng);
    const ab = alphaBars[t];
    const xt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * eps;

    const beta = betas[t];
    const alpha = alphas[t];
    // Oracle noise prediction
    const mu = (xt - (beta / Math.sqrt(1 - ab)) * eps) / Math.sqrt(alpha);
    const sigma = Math.sqrt(beta);
    const z = randn(rng);
    const xPrev = mu + sigma * z;

    return { x0, xt, xPrev, betaT: beta, alphaBarT: ab };
  }, [t, seed]);

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        给定一个从干净数据 <KaTeX math={String.raw`x_0`} /> 前向加噪得到的 <KaTeX math={String.raw`x_t`} />，
        这里用“预言机”噪声预测来演示单步反向转移 <KaTeX math={String.raw`x_{t-1}`} /> 的计算。
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            时间步 t
          </label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{t}</span>
        </div>
        <Slider value={[t]} min={1} max={T} step={1} onValueChange={(v) => setT(v[0])} />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">干净数据 x₀</div>
          <div className="text-2xl font-bold text-blue-700">{x0.toFixed(3)}</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">当前噪声 xₜ</div>
          <div className="text-2xl font-bold text-indigo-700">{xt.toFixed(3)}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">反向采样 xₜ₋₁</div>
          <div className="text-2xl font-bold text-green-700">{xPrev.toFixed(3)}</div>
        </div>
      </div>

      <FormulaCard
        title="当前时刻的反向均值"
        formula={String.raw`\boldsymbol{\mu}_\theta=\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\boldsymbol{\epsilon}_\theta\right)`}
        description={
          <>
            当 <KaTeX math={String.raw`t=${t}`} /> 时，<KaTeX math={String.raw`\beta_t=${betaT.toFixed(5)}`} />，
            <KaTeX math={String.raw`\bar{\alpha}_t=${alphaBarT.toFixed(4)}`} />。
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
