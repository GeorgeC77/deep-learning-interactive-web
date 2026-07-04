import { useState } from 'react';
import { BookOpen, Compass, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import SectionNavigation from '@/components/SectionNavigation';
import { getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch06/inductive-bias';

export default function Ch06InductiveBiasPage() {
  const section = getSectionByPath(SECTION_PATH);
  const [shift, setShift] = useState(1);

  const input = [1, 2, 3, 4, 5];
  const shifted = input.map((_, i) => input[(i + shift) % input.length]);
  const invariant = input.reduce((a, b) => a + b, 0);
  const equivariant = shifted;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Compass className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '归纳偏置'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          归纳偏置是模型对学习问题的先验假设；合理的偏置能缩小搜索空间、提升泛化，而错误的偏置会导致模型无法捕捉真实数据结构。
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
            title="逆问题与欠定性"
            description="训练数据通常无法唯一确定模型，必须引入额外假设才能从众多解释中选择可泛化的解。"
          />
          <ConceptCard
            title="无免费午餐定理"
            description="不存在在所有任务上同时最优的通用学习器，偏置必须与任务结构相匹配才能取得好效果。"
          />
          <ConceptCard
            title="对称性与先验"
            description="卷积的平移等变性、池化的平移不变性等结构化偏置，能让模型自动继承数据中的对称性。"
          />
          <ConceptCard
            title="稀疏性与平滑性"
            description="权重衰减、dropout 等正则化同样是一种偏置，鼓励解空间中的简单、平滑函数。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">不变性与等变性</h2>
        <FormulaCard
          title="不变性"
          formula={String.raw`f(g(\mathbf{x})) = f(\mathbf{x})`}
          description="对输入施加某种变换 g 后，函数输出保持不变，例如图像分类对平移的不变性。"
        />
        <FormulaCard
          title="等变性"
          formula={String.raw`f(g(\mathbf{x})) = g(f(\mathbf{x}))`}
          description="输出随输入以相同方式变换，例如语义分割中像素标签随图像平移而平移。"
        />
        <FormulaCard
          title="卷积的平移等变性"
          formula={String.raw`[\mathbf{K} * g(\mathbf{X})]_i = [g(\mathbf{K} * \mathbf{X})]_i`}
          description="卷积核在输入平移后，特征图也相应平移，这是参数共享带来的结构化偏置。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：不变性与等变性">
        <div className="space-y-6">
          <p className="text-gray-700">
            将输入序列循环平移，观察不变函数（求和）与等变函数（恒等映射）输出的变化规律。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                平移步数
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{shift}</span>
            </div>
            <Slider value={[shift]} min={0} max={4} step={1} onValueChange={(v) => setShift(v[0])} />
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">原始输入</div>
              <div className="font-mono text-lg">[{input.join(', ')}]</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">平移后输入</div>
              <div className="font-mono text-lg">[{shifted.join(', ')}]</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">等变输出</div>
              <div className="font-mono text-lg">[{equivariant.join(', ')}]</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">不变函数：求和</div>
              <div className="text-2xl font-bold text-blue-700">{invariant}</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">等变函数输出</div>
              <div className="text-2xl font-bold text-indigo-700">[{equivariant.join(', ')}]</div>
            </div>
          </div>
        </div>
      </InteractiveDemo>

      <SectionNavigation sectionPath={SECTION_PATH} />
    </div>
  );
}
