import { useState } from 'react';
import { BookOpen, Share2, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import SectionNavigation from '@/components/SectionNavigation';
import { getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch06/parameter-sharing';

export default function Ch06ParameterSharingPage() {
  const section = getSectionByPath(SECTION_PATH);
  const [h, setH] = useState(16);
  const [k, setK] = useState(3);

  const fcParams = h * h * h * h; // single layer, input H^2 -> output H^2
  const convParams = k * k;
  const ratio = fcParams / convParams;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Share2 className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '参数共享'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          参数共享让同一组权重在多个位置复用，显著减少参数量并强制定义不变性或局部性等结构化先验，是卷积、循环等架构的核心设计。
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
            title="硬参数共享"
            description="不同位置或不同时间步使用完全相同的权重，例如卷积核在整张特征图上滑动。"
          />
          <ConceptCard
            title="软权重共享"
            description="通过正则化鼓励参数彼此接近而非强制相等，保留一定的柔性。"
          />
          <ConceptCard
            title="统计效率"
            description="共享使每个参数在更多数据上获得更新，降低过拟合风险并减少所需训练样本。"
          />
          <ConceptCard
            title="结构偏置"
            description="参数共享往往与等变性或局部连接耦合，把领域知识直接编码进模型结构。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">共享形式与正则化</h2>
        <FormulaCard
          title="软权重共享正则项"
          formula={String.raw`\Omega = \frac{\lambda}{2}\sum_{i,j}(w_i - w_j)^2`}
          description="通过惩罚参数之间的差异来鼓励它们趋于一致，是一种柔性的参数共享。"
        />
        <FormulaCard
          title="卷积输出尺寸"
          formula={String.raw`O = \left\lfloor \frac{I + 2P - K}{S} \right\rfloor + 1`}
          description="同一个卷积核在输入各个位置复用，输出尺寸由输入大小 I、核大小 K、填充 P 与步幅 S 决定。"
        />
        <FormulaCard
          title="卷积参数量"
          formula={String.raw`\text{params}_{\text{conv}} = K^2 \, C_{\text{in}} \, C_{\text{out}}`}
          description="与特征图空间尺寸无关，只取决于核大小与输入输出通道数。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：全连接 vs 卷积参数量">
        <div className="space-y-6">
          <p className="text-gray-700">
            比较单层高分辨率特征图下，全连接层与单个卷积核的参数量差异。卷积通过参数共享大幅压缩模型规模。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  特征图边长 H
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{h}</span>
              </div>
              <Slider value={[h]} min={4} max={64} step={4} onValueChange={(v) => setH(v[0])} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  卷积核大小 K
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{k}</span>
              </div>
              <Slider value={[k]} min={1} max={7} step={2} onValueChange={(v) => setK(v[0])} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">全连接参数</div>
              <div className="text-xl font-bold text-gray-900">{fcParams.toLocaleString()}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">卷积参数</div>
              <div className="text-xl font-bold text-gray-900">{convParams.toLocaleString()}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">压缩比例</div>
              <div className="text-xl font-bold text-blue-700">{ratio.toFixed(0)}×</div>
            </div>
          </div>

          <FormulaCard
            title="参数量对比"
            formula={String.raw`\frac{\text{全连接}}{\text{卷积}} = \frac{H^4}{K^2} = ${ratio.toFixed(0)}`}
            description="特征图越大，参数共享带来的压缩效果越显著。"
          />
        </div>
      </InteractiveDemo>

      <SectionNavigation sectionPath={SECTION_PATH} />
    </div>
  );
}
