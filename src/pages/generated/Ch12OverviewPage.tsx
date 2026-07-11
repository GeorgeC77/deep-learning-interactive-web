import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, Target } from 'lucide-react';
import SectionMetadata from '@/components/SectionMetadata';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch12OverviewPage() {
  const sectionPath = '/ch12/overview';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const concepts = useMemo(
    () => [
      {
        title: 'K-means 聚类',
        description:
          '通过交替执行“分配样本到最近质心”与“更新质心为簇内均值”两步，最小化失真函数。它是硬分配的极限情况。',
      },
      {
        title: '高斯混合模型 (GMM)',
        description:
          '用有限个高斯分布的加权叠加建模复杂数据分布。隐变量指示每个样本来自哪个分量，从而引入软分配。',
      },
      {
        title: 'EM 算法',
        description:
          '期望最大化算法通过 E-step 计算隐变量后验、M-step 最大化期望完全数据似然，迭代求解含隐变量的最大似然问题。',
      },
      {
        title: '证据下界 (ELBO)',
        description:
          'ELBO 是观测数据对数似然的下界。EM 的 E-step 选择最紧的下界，M-step 则在该下界上最大化参数。',
      },
    ],
    []
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Layers className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十二章 · Bishop 第 15 章
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {section?.title ?? '离散隐变量'}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          离散隐变量模型通过引入未观测的类别变量来解释数据的内在结构。从 K-means 的硬聚类到高斯混合模型的软分配，
          再到 EM 算法与证据下界，本章建立处理隐变量模型的核心框架。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。教材原文、原图及习题解答版权归原作者和出版方所有。
        </p>
      </section>

      {/* Core concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">本章核心思想</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {concepts.map((c, idx) => (
            <ConceptCard key={idx} title={c.title} description={c.description} />
          ))}
        </div>
      </section>

      {/* Formula cards */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心公式</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">15.1 K-means 聚类</h3>
            <p className="text-sm text-gray-700">硬聚类：初始化质心、分配样本、更新质心，直到收敛。</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">15.2 高斯混合模型</h3>
            <p className="text-sm text-gray-700">用隐变量表示分量归属，建立似然函数并理解不可识别性。</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">15.3 期望最大化算法</h3>
            <p className="text-sm text-gray-700">E-step 与 M-step 的交替更新，以及与 K-means 的极限联系。</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">15.4 证据下界</h3>
            <p className="text-sm text-gray-700">从 Jensen 不等式导出 ELBO，重新理解 EM 的收敛保证。</p>
          </div>
        </div>

        <FormulaCard
          title="K-means 失真函数"
          formula={String.raw`J = \sum_{i=1}^n \bigl\| x^{(i)} - \mu_{c^{(i)}} \bigr\|^2`}
          description="最小化所有样本到其所属簇质心的欧氏距离平方和。"
        />
        <FormulaCard
          title="高斯混合模型"
          formula={String.raw`p(x) = \sum_{k=1}^K \pi_k \, \mathcal{N}\bigl(x; \mu_k, \Sigma_k\bigr)`}
          description="混合系数 π_k 满足 Σ_k π_k = 1，每个分量都是高斯分布。"
        />
        <FormulaCard
          title="EM 算法与证据下界"
          formula={String.raw`\text{E-step: } \gamma_{ik} = \frac{\pi_k \, \mathcal{N}(x_i;\mu_k,\Sigma_k)}{\sum_j \pi_j \, \mathcal{N}(x_i;\mu_j,\Sigma_j)} \quad \text{M-step: } \theta^{\text{new}} = \arg\max_\theta \mathcal{L}(q,\theta)`}
          description="E-step 计算责任度并收紧 ELBO，M-step 最大化该下界以更新参数。"
        />
      </section>

      {/* Interactive demo */}
      <GMMResponsibilityDemo />

      <SectionMetadata
        bishopChapter="Ch 15"
        bishopSection=""
        learningObjectives={[
          '理解离散隐变量模型的动机与应用场景。',
          '掌握 K-means、高斯混合模型与 EM 算法的核心思想。',
          '理解证据下界 ELBO 与 EM 算法收敛性之间的关系。',
        ]}
        commonMistakes={[
          '把 K-means 的硬分配与 GMM 的软分配混淆。',
          '忽视隐变量模型中的不可识别性问题。',
          '认为 EM 算法一定收敛到全局最优。',
        ]}
        quiz={[
          {
            question: 'K-means 与高斯混合模型最本质的区别是什么？',
            options: ['优化目标不同', 'K-means 是硬分配，GMM 是软分配', 'K-means 需要更多内存', 'GMM 不能处理多维数据'],
            correctIndex: 1,
            explanation: 'K-means 将每个样本分配到一个簇，而 GMM 通过责任度给出属于每个分量的概率。',
          },
          {
            question: 'EM 算法中的 E 步做什么？',
            options: ['更新模型参数', '计算隐变量的后验分布', '随机初始化参数', '计算梯度'],
            correctIndex: 1,
            explanation: 'E 步固定当前参数，计算隐变量的后验分布（责任度），为 M 步做准备。',
          },
        ]}
      />

      {/* Navigation */}
      <section className="flex flex-wrap justify-between gap-4">
        {prevSection ? (
          <Button variant="outline" asChild>
            <Link to={prevSection.path}>
              <ChevronLeft className="w-4 h-4" />
              {prevSection.title}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {nextSection && (
          <Button asChild>
            <Link to={nextSection.path}>
              {nextSection.title}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </section>
    </div>
  );
}

function gaussian1D(x: number, mu: number, sigma: number): number {
  const denom = sigma * Math.sqrt(2 * Math.PI);
  const exp = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  return exp / denom;
}

function GMMResponsibilityDemo() {
  const [x, setX] = useState(0);
  const [mu1, setMu1] = useState(-2);
  const [mu2, setMu2] = useState(2);
  const [sigma1, setSigma1] = useState(1);
  const [sigma2, setSigma2] = useState(1);
  const [pi1, setPi1] = useState(0.5);

  const pi2 = 1 - pi1;
  const p1 = pi1 * gaussian1D(x, mu1, sigma1);
  const p2 = pi2 * gaussian1D(x, mu2, sigma2);
  const total = p1 + p2;
  const gamma1 = total > 0 ? p1 / total : 0.5;
  const gamma2 = total > 0 ? p2 / total : 0.5;

  return (
    <InteractiveDemo title="GMM 责任度交互演示">
      <div className="space-y-6">
        <p className="text-gray-700">
          调整数据点位置、两个高斯分量的均值/标准差以及混合系数，观察 E-step 计算的后验责任度
          <KaTeX math={String.raw`\gamma_{ik}`} /> 如何变化。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <SliderRow
              label={`数据点 x: ${x.toFixed(1)}`}
              value={x}
              min={-6}
              max={6}
              step={0.1}
              onChange={setX}
            />
            <SliderRow
              label={`分量 1 均值 μ₁: ${mu1.toFixed(1)}`}
              value={mu1}
              min={-5}
              max={5}
              step={0.1}
              onChange={setMu1}
            />
            <SliderRow
              label={`分量 2 均值 μ₂: ${mu2.toFixed(1)}`}
              value={mu2}
              min={-5}
              max={5}
              step={0.1}
              onChange={setMu2}
            />
            <SliderRow
              label={`分量 1 标准差 σ₁: ${sigma1.toFixed(1)}`}
              value={sigma1}
              min={0.3}
              max={3}
              step={0.1}
              onChange={setSigma1}
            />
            <SliderRow
              label={`分量 2 标准差 σ₂: ${sigma2.toFixed(1)}`}
              value={sigma2}
              min={0.3}
              max={3}
              step={0.1}
              onChange={setSigma2}
            />
            <SliderRow
              label={`混合系数 π₁: ${pi1.toFixed(2)}`}
              value={pi1}
              min={0.05}
              max={0.95}
              step={0.05}
              onChange={setPi1}
            />
          </div>

          <div className="space-y-5">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="text-sm text-gray-600 mb-3">后验责任度</div>
              <div className="h-8 flex rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 text-white text-xs flex items-center justify-center transition-all duration-200"
                  style={{ width: `${gamma1 * 100}%` }}
                >
                  {gamma1 > 0.12 && `${(gamma1 * 100).toFixed(1)}%`}
                </div>
                <div
                  className="bg-emerald-500 text-white text-xs flex items-center justify-center transition-all duration-200"
                  style={{ width: `${gamma2 * 100}%` }}
                >
                  {gamma2 > 0.12 && `${(gamma2 * 100).toFixed(1)}%`}
                </div>
              </div>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-blue-600 font-medium">γ₁ = {gamma1.toFixed(3)}</span>
                <span className="text-emerald-600 font-medium">γ₂ = {gamma2.toFixed(3)}</span>
              </div>
            </div>

            <FormulaCard
              title="责任度公式"
              formula={String.raw`\gamma_{ik} = \frac{\pi_k \, \mathcal{N}(x_i; \mu_k, \sigma_k^2)}{\sum_{j=1}^K \pi_j \, \mathcal{N}(x_i; \mu_j, \sigma_j^2)}`}
              description="分子越大（数据点离分量越近、分量权重越高），该分量对样本的责任度越大。"
            />

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-sm text-blue-800">
              <strong>提示：</strong>当某个高斯分量更窄、更接近数据点时，它的责任度会迅速上升；
              而混合系数 π 则反映了整体先验偏好。
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}
