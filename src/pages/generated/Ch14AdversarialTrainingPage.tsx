import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch14/adversarial-training';

export default function Ch14AdversarialTrainingPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  const [iter, setIter] = useState(0);

  /* Simulate generator improving over iterations. */
  const improvedScore = useMemo(() => {
    const target = 0.5 + 0.45 * Math.min(iter / 50, 1);
    return 0.05 + (target - 0.05) * (1 - Math.exp(-iter / 15));
  }, [iter]);

  const nonSaturatingLoss = useMemo(() => -Math.log(Math.max(improvedScore, 1e-6)), [improvedScore]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Scale className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '对抗训练'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          GAN 的对抗训练将生成建模转化为双人博弈。理解损失函数的几何意义、JS 散度的局限性以及常见稳定技巧，
          是成功训练 GAN 的关键。
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
            title="极小极大损失"
            description="判别器最大化真实样本与生成样本的对数似然；生成器最小化被判别为假的概率。"
          />
          <ConceptCard
            title="非饱和损失"
            description="早期生成器梯度较弱，改用最小化 -ln D(G(z)) 可提供更强劲的更新信号。"
          />
          <ConceptCard
            title="JS 散度困境"
            description="当真实分布与生成分布支撑集几乎不重叠时，JS 散度趋于常数，判别器梯度消失。"
          />
          <ConceptCard
            title="模式崩溃"
            description="生成器只覆盖真实分布的少数模式，导致输出多样性严重不足。"
          />
        </div>
      </section>

      {/* Loss functions */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">损失函数与理论分析</h2>
        <p className="text-gray-700">
          给定生成器 <KaTeX math={String.raw`G`} />，最优判别器为 <KaTeX math={String.raw`D^*(x)=p_{\text{data}}/(p_{\text{data}}+p_g)`} />。
          将其代入价值函数，对生成器的优化等价于最小化 JS 散度。
        </p>
        <FormulaCard
          title="原始极小极大损失"
          formula={String.raw`\min_G \max_D \mathbb{E}_{x\sim p_{\text{data}}} [\ln D(x)] + \mathbb{E}_{z\sim p_z} [\ln (1 - D(G(z)))]`}
          description="D 越接近最优，G 的梯度越弱；当 D 完美时，早期 G 几乎得不到更新。"
        />
        <FormulaCard
          title="非饱和生成器损失"
          formula={String.raw`\min_G -\mathbb{E}_{z\sim p_z} [\ln D(G(z))]`}
          description="与原始损失具有相同不动点，但在训练初期提供更稳定的梯度。"
        />
        <FormulaCard
          title="最优判别器下的等价目标"
          formula={String.raw`C(G) = 2\ln 2 - 2 \, \text{JS}(p_{\text{data}} \parallel p_g)`}
          description="最大化 C(G) 即最小化 JS 散度，全局最优在 p_g = p_data 处取得。"
        />
      </section>

      {/* JS divergence issue */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">JS 散度的问题</h2>
        <p className="text-gray-700 mb-4">
          JS 散度要求两个分布的支撑集有重叠。在高维空间中，真实分布与任意初始生成分布往往几乎不相交，
          导致判别器可以轻易达到完美分类，生成器梯度随即消失。
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard title="梯度消失" description="最优判别器给出 D(x)=1 对真实样本、D(G(z))=0 对生成样本，log 梯度接近零。" />
          <ConceptCard title="支撑集不重叠" description="高维流形上的分布几乎处处正交，JS 散度失去对生成器位置的有效指引。" />
          <ConceptCard title="替代距离" description="Wasserstein 距离、MMD 与基于积分概率度量的方法可缓解该问题。" />
        </div>
      </section>

      {/* Mode collapse */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">模式崩溃与训练技巧</h2>
        <p className="text-gray-700 mb-4">
          模式 collapse 指生成器发现少量能够欺骗当前判别器的“捷径”样本，从而忽略真实分布的其他模式。
          以下是实践中常用的缓解策略。
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard title="标签平滑" description="将真实标签从 1 降到 0.9、虚假标签从 0 升到 0.1，防止判别器过度自信。" />
          <ConceptCard title="噪声输入" description="向判别器输入添加噪声，平滑决策边界，为生成器提供有用梯度。" />
          <ConceptCard title="多步更新" description="让判别器每次迭代更新多次，保持 D 接近最优，从而给出稳定的梯度信号。" />
          <ConceptCard title="梯度惩罚" description="在 WGAN-GP 中限制判别器梯度的 L2 范数，提升训练的 Lipschitz 稳定性。" />
          <ConceptCard title="Mini-batch 判别" description="利用整个 batch 的统计信息，鼓励生成样本之间的多样性。" />
          <ConceptCard title="经验回放" description="混合历史生成样本与当前样本训练判别器，防止判别器只关注当前生成器的弱点。" />
        </div>
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="生成器迭代与判别器分数">
        <div className="space-y-6">
          <p className="text-gray-700">
            该简化演示模拟生成器质量随迭代提升：判别器对生成样本的平均分数从接近 0 逐渐上升到 0.5。
            当 <KaTeX math={String.raw`D(G(z)) \to 0.5`} /> 时，生成样本与真实样本对判别器而言不可区分。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                生成器迭代次数
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{iter}</span>
            </div>
            <Slider value={[iter]} min={0} max={100} step={1} onValueChange={(v) => setIter(v[0])} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">D(G(z)) 估计</div>
              <div className="text-2xl font-bold text-blue-700">{improvedScore.toFixed(3)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">非饱和损失 -ln D(G(z))</div>
              <div className="text-2xl font-bold text-green-700">{nonSaturatingLoss.toFixed(3)}</div>
            </div>
          </div>
          <FormulaCard title="当前损失" formula={String.raw`L_G = -\ln D(G(z)) = -\ln ${improvedScore.toFixed(3)} = ${nonSaturatingLoss.toFixed(3)}`} />
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIter(0)}>
              <RefreshCcw className="w-4 h-4 mr-1" />
              重置迭代
            </Button>
          </div>
        </div>
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
