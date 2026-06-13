import { useState, useMemo } from 'react';
import { ShieldAlert, Network, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

const ACTIVATIONS = [
  { name: 'Sigmoid', fn: (z: number) => 1 / (1 + Math.exp(-z)) },
  { name: 'ReLU', fn: (z: number) => Math.max(0, z) },
  { name: 'Tanh', fn: (z: number) => Math.tanh(z) },
];

export default function NeuralNetworksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第七章 · 深度学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">神经网络</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          神经网络由大量相互连接的神经元组成。通过堆叠多层非线性变换，
          神经网络可以学习从简单特征到复杂概念的层次化表示。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Neuron */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Network className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">神经元与激活函数</h2>
        </div>
        <p className="text-gray-700 mb-4">
          神经网络的基本计算单元是神经元。它接收输入、计算加权和，再通过激活函数输出：
        </p>

        <FormulaCard
          title="神经元输出"
          formula={
            <KaTeX
              math={String.raw`a = f\left(\sum_{j=1}^{n} w_j x_j + b\right) = f(z)`}
              display
            />
          }
          description="f 是非线性激活函数，没有它多层网络将退化为线性模型。"
        />

        <p className="text-gray-700 mb-4">常见的激活函数包括：</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Sigmoid</h3>
            <KaTeX math={String.raw`\sigma(z) = \frac{1}{1 + e^{-z}}`} display />
            <p className="text-xs text-gray-600 mt-2">输出在 0 到 1 之间，适合二分类概率。</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">ReLU</h3>
            <KaTeX math={String.raw`f(z) = \max(0, z)`} display />
            <p className="text-xs text-gray-600 mt-2">计算简单，缓解梯度消失，最常用。</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">Tanh</h3>
            <KaTeX math={String.raw`\tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}}`} display />
            <p className="text-xs text-gray-600 mt-2">输出在 -1 到 1 之间，零中心化。</p>
          </div>
        </div>
      </section>

      {/* Activation function demo */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：激活函数对比</h2>
        <p className="text-gray-700 mb-4">
          点击切换不同的激活函数，观察它们的形状差异。
        </p>
        <ActivationFunctionDemo />
      </section>

      {/* Multi-layer network */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">多层前馈网络</h2>
        <p className="text-gray-700 mb-4">
          将多个神经元组织成层，就得到了多层前馈神经网络。信息从输入层经过隐藏层传递到输出层：
        </p>

        <FormulaCard
          title="第 l 层的输出"
          formula={
            <KaTeX
              math={String.raw`z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}, \quad a^{[l]} = f(z^{[l]})`}
              display
            />
          }
          description="上标 [l] 表示第 l 层。网络通过层与层之间的矩阵运算完成前向传播。"
        />

        <div className="bg-violet-50 rounded-lg p-4 border border-violet-200 mt-4">
          <h3 className="font-semibold text-violet-800 mb-2">为什么深度有效？</h3>
          <p className="text-sm text-gray-700">
            浅层网络可能需要指数级数量的神经元才能表示某些函数，而深层网络可以通过层次化组合，
            用更少的神经元学习复杂模式。例如底层检测边缘，中层检测纹理，高层检测物体部件。
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>神经元是神经网络的基本计算单元。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>激活函数引入非线性，使网络能学习复杂映射。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>深层网络通过层次化表示提高表达能力。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function ActivationFunctionDemo() {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = ACTIVATIONS[activeIndex];

  const width = 520;
  const height = 280;
  const padding = 40;
  const xMin = -5;
  const xMax = 5;
  const yMin = -1.2;
  const yMax = 1.2;

  const xScale = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const yScale = (y: number) => padding + (1 - (y - yMin) / (yMax - yMin)) * (height - 2 * padding);

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = xMin; x <= xMax; x += 0.05) {
      pts.push({ x, y: active.fn(x) });
    }
    return pts;
  }, [active]);

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
      <div className="flex justify-center gap-2">
        {ACTIVATIONS.map((a, i) => (
          <button
            key={a.name}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeIndex === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg border border-gray-200" style={{ maxHeight: 280 }}>
        {/* grid */}
        {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((x) => (
          <line key={`v-${x}`} x1={xScale(x)} y1={yScale(yMin)} x2={xScale(x)} y2={yScale(yMax)} stroke="#e5e7eb" />
        ))}
        {[-1, -0.5, 0, 0.5, 1].map((y) => (
          <line key={`h-${y}`} x1={xScale(xMin)} y1={yScale(y)} x2={xScale(xMax)} y2={yScale(y)} stroke="#e5e7eb" />
        ))}
        {/* axes */}
        <line x1={padding} y1={yScale(0)} x2={width - padding} y2={yScale(0)} stroke="#6b7280" strokeWidth={1.5} />
        <line x1={xScale(0)} y1={yScale(yMin)} x2={xScale(0)} y2={yScale(yMax)} stroke="#6b7280" strokeWidth={1.5} />
        {/* curve */}
        <path d={path} fill="none" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
      </svg>

      <div className="text-sm text-gray-600 text-center">
        当前激活函数：<strong>{active.name}</strong>
      </div>
    </div>
  );
}
