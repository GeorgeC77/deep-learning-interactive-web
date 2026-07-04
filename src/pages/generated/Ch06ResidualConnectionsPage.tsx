import { useState } from 'react';
import { BookOpen, Layers, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import SectionNavigation from '@/components/SectionNavigation';
import { getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch06/residual-connections';
const ALPHA = 0.9;

export default function Ch06ResidualConnectionsPage() {
  const section = getSectionByPath(SECTION_PATH);
  const [depth, setDepth] = useState(10);

  const plain = ALPHA ** depth;
  const residual = 1 + plain;

  // Build per-layer magnitudes for a small chart
  const layers = Array.from({ length: depth }, (_, i) => i + 1);
  const plainSeries = layers.map((l) => ALPHA ** l);
  const residualSeries = layers.map((l) => 1 + ALPHA ** l);
  const maxVal = Math.max(...residualSeries, 1.5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Layers className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '残差连接'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          残差连接通过跳跃映射让网络学习残差函数 <KaTeX math={String.raw`\mathcal{F}(x)`} />，保留恒等梯度传播路径，从而缓解深层网络的梯度消失与退化问题。
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
            title="残差块"
            description="输出为输入与残差变换之和，网络只需学习输入到输出的残差部分，降低了学习目标难度。"
          />
          <ConceptCard
            title="恒等映射"
            description="即使残差分支的参数为零，块输出仍等于输入，深层网络至少不会差于浅层网络。"
          />
          <ConceptCard
            title="梯度高速公路"
            description="反向传播时梯度可以直接沿跳跃连接回传，避免被多个非线性层连续收缩。"
          />
          <ConceptCard
            title="深层训练"
            description="ResNet 等架构借助残差连接成功训练数百甚至上千层网络，推动了计算机视觉的发展。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">残差连接与梯度</h2>
        <FormulaCard
          title="残差块"
          formula={String.raw`\mathbf{y} = \mathcal{F}(\mathbf{x}, \{W_i\}) + \mathbf{x}`}
          description="\mathcal{F} 表示若干权重层实现的残差映射，x 通过跳跃连接直接相加。"
        />
        <FormulaCard
          title="反向传播梯度"
          formula={String.raw`\frac{\partial L}{\partial \mathbf{x}} = \frac{\partial L}{\partial \mathbf{y}}\left(1 + \frac{\partial \mathcal{F}}{\partial \mathbf{x}}\right)`}
          description="梯度中显式包含 1 这一项，即使 \partial\mathcal{F} 很小，梯度也不会消失。"
        />
        <FormulaCard
          title="深层衰减对比"
          formula={String.raw`\text{普通梯度} \propto \alpha^L,\quad \text{残差梯度} \approx 1 + \alpha^L`}
          description="假设每层梯度乘子为 \alpha，普通网络随深度 L 指数衰减，残差网络至少保留恒等路径。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：梯度流对比">
        <div className="space-y-6">
          <p className="text-gray-700">
            假设每层将梯度乘以 <KaTeX math={String.raw`\alpha=0.9`} />。拖动滑块改变网络深度，观察普通网络与残差网络的梯度幅度。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                网络深度 L
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{depth}</span>
            </div>
            <Slider value={[depth]} min={1} max={50} step={1} onValueChange={(v) => setDepth(v[0])} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-center">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">普通网络梯度</div>
              <div className="text-2xl font-bold text-red-700">{plain.toExponential(2)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">残差网络梯度</div>
              <div className="text-2xl font-bold text-green-700">{residual.toFixed(3)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">逐层梯度幅度</div>
            <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 p-2 flex items-end gap-1">
              {layers.map((l, i) => {
                const h1 = (plainSeries[i] / maxVal) * 100;
                const h2 = Math.max((residualSeries[i] / maxVal) * 100, 1);
                return (
                  <div key={l} className="flex-1 flex flex-col justify-end gap-0.5">
                    <div
                      className="w-full bg-green-400 rounded-t"
                      style={{ height: `${h2}%` }}
                      title={`残差 L=${l}: ${residualSeries[i].toFixed(3)}`}
                    />
                    <div
                      className="w-full bg-red-400 rounded-t"
                      style={{ height: `${Math.max(h1, 1)}%` }}
                      title={`普通 L=${l}: ${plainSeries[i].toExponential(2)}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>绿色：残差网络</span>
              <span>红色：普通网络</span>
            </div>
          </div>

          <FormulaCard
            title="当前深度对比"
            formula={String.raw`0.9^{${depth}}=${plain.toExponential(2)},\quad 1+0.9^{${depth}}=${residual.toFixed(3)}`}
            description="残差连接让深层网络始终保留一条不衰减的梯度路径。"
          />
        </div>
      </InteractiveDemo>

      <SectionNavigation sectionPath={SECTION_PATH} />
    </div>
  );
}
