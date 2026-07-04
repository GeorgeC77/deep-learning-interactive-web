import { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, ShieldAlert, SlidersHorizontal, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch04OverviewPage() {
  const sectionPath = '/ch04/overview';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [eta, setEta] = useState(0.3);

  const stepsNeeded = useMemo(() => {
    const w0 = 2;
    const target = 0.01;
    if (eta <= 0 || eta >= 1) return Infinity;
    const ratio = 1 - 2 * eta;
    if (Math.abs(ratio) >= 1) return Infinity;
    return Math.ceil(Math.log(target / Math.abs(w0)) / Math.log(Math.abs(ratio)));
  }, [eta]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <TrendingDown className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          本章介绍训练深度网络的核心优化方法：从误差曲面的局部结构到批量、随机、动量、自适应学习率等实用算法。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="误差曲面"
            description="损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度与收敛行为。"
          />
          <ConceptCard
            title="梯度下降族"
            description="批量 GD、SGD 与小批量 SGD 在计算效率、内存占用与梯度方差之间权衡。"
          />
          <ConceptCard
            title="自适应方法"
            description="动量、RMSProp 与 Adam 通过累积历史梯度信息加速收敛并减少震荡。"
          />
          <ConceptCard
            title="学习率调度"
            description="随训练进程降低学习率，兼顾快速收敛与精细逼近局部极小值。"
          />
          <ConceptCard
            title="归一化"
            description="数据与中间激活的归一化稳定分布、允许更大学习率，并降低对初始化的敏感。"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">关键公式</h2>
        </div>
        <FormulaCard
          title="梯度下降基本更新"
          formula={String.raw`\mathbf{w}^{(\tau+1)} = \mathbf{w}^{(\tau)} - \eta \nabla E\bigl(\mathbf{w}^{(\tau)}\bigr)`}
          description="沿负梯度方向以学习率 η 更新参数。"
        />
        <FormulaCard
          title="小批量梯度估计"
          formula={String.raw`\nabla E \approx \frac{1}{M} \sum_{n=1}^{M} \nabla E_n`}
          description="用大小为 M 的 mini-batch 近似整体梯度，平衡效率与方差。"
        />
      </section>

      <InteractiveDemo title="学习率与收敛步数">
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            对简单二次损失 <KaTeX math={String.raw`E(w)=w^2`} />，从 <KaTeX math={String.raw`w_0=2`} /> 出发，
            观察学习率 <KaTeX math={String.raw`\eta`} /> 如何影响到达 <KaTeX math={String.raw`|w|<0.01`} /> 所需步数。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                学习率 η
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{eta.toFixed(2)}</span>
            </div>
            <Slider value={[eta]} min={0.05} max={1.0} step={0.05} onValueChange={(v) => setEta(v[0])} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">到达阈值所需步数</div>
              <div className="text-2xl font-bold text-blue-700">
                {stepsNeeded === Infinity ? '发散' : stepsNeeded}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`w^{(\tau+1)} = w^{(\tau)} - 2\eta w^{(\tau)}`} />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            当 η 接近 1 时算法在收敛与发散之间震荡；过大则无法收敛。
          </p>
        </div>
      </InteractiveDemo>

      <nav className="flex flex-wrap justify-between gap-4">
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
      </nav>
    </div>
  );
}
