import { useState } from 'react';
import { BookOpen, GitMerge, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import SectionNavigation from '@/components/SectionNavigation';
import { getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch05/overview';

export default function Ch05OverviewPage() {
  const section = getSectionByPath(SECTION_PATH);
  const [x, setX] = useState(1.0);

  const fx = Math.sin(x * x);
  const dfx = 2 * x * Math.cos(x * x);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <GitMerge className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '反向传播'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          反向传播是计算图上的链式法则实现，能够高效求出任意可微网络中损失对每一层参数的梯度，是现代深度学习框架训练大规模网络的基础。
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
            title="计算图"
            description="将前向计算分解为基本运算节点，每个节点只执行简单的算术或函数操作，便于系统化地求导。"
          />
          <ConceptCard
            title="链式法则"
            description="上游梯度与局部 Jacobian 相乘即可得到对更早节点的梯度，是反向传播算法的数学核心。"
          />
          <ConceptCard
            title="反向传播算法"
            description="先执行前向计算保存中间激活，再按逆拓扑序反向传播伴随向量，一次遍历即可得到所有参数梯度。"
          />
          <ConceptCard
            title="前向与反向模式"
            description="反向模式以一次前向、一次反向得到所有输入梯度，适合参数维度远高于输出维度的神经网络。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">关键公式</h2>
        <FormulaCard
          title="链式法则"
          formula={String.raw`\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\frac{\partial y}{\partial x}`}
          description="损失对输入 x 的梯度等于损失对输出 y 的梯度乘以 y 对 x 的局部导数。"
        />
        <FormulaCard
          title="向量-雅可比积"
          formula={String.raw`\bar{x}^{\!T} = \bar{y}^{\!T} \frac{\partial y}{\partial x}`}
          description="反向传播中每个节点接收上游伴随向量 \bar{y}，并把它与局部 Jacobian 相乘得到 \bar{x}。"
        />
        <FormulaCard
          title="参数梯度"
          formula={String.raw`\frac{\partial L}{\partial w} = \frac{\partial L}{\partial z}\frac{\partial z}{\partial w}`}
          description="对于权重 w，只需知道它直接影响的活动 z 以及损失对 z 的伴随即可。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="交互演示：复合函数求导">
        <div className="space-y-6">
          <p className="text-gray-700">
            考虑函数 <KaTeX math={String.raw`f(x)=\sin(x^2)`} />，拖动滑块观察函数值与导数如何随输入变化。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                输入 x
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{x.toFixed(2)}</span>
            </div>
            <Slider value={[x]} min={-2} max={2} step={0.1} onValueChange={(v) => setX(v[0])} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">函数值 f(x)</div>
              <div className="text-2xl font-bold text-blue-700">{fx.toFixed(3)}</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">导数 f'(x)</div>
              <div className="text-2xl font-bold text-indigo-700">{dfx.toFixed(3)}</div>
            </div>
          </div>
          <FormulaCard
            title="当前导数"
            formula={String.raw`\frac{d}{dx}\sin(x^2)=2x\cos(x^2)=2\cdot${x.toFixed(2)}\cdot\cos(${x.toFixed(2)}^2)=${dfx.toFixed(3)}`}
          />
        </div>
      </InteractiveDemo>

      <SectionNavigation sectionPath={SECTION_PATH} />
    </div>
  );
}
