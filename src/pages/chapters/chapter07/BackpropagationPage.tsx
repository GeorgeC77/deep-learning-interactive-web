import { useState } from 'react';
import { ShieldAlert, GitBranch, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function BackpropagationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第七章 · 深度学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">反向传播</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          反向传播是训练神经网络的核心算法。它利用链式法则高效计算损失函数对每一层参数的梯度，
          从而指导参数更新。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Chain rule */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">链式法则</h2>
        </div>
        <p className="text-gray-700 mb-4">
          神经网络的损失 <KaTeX math={String.raw`L`} /> 对某一层参数 <KaTeX math={String.raw`w`} /> 的梯度，
          可以通过链式法则分解为各层之间的局部梯度乘积：
        </p>

        <FormulaCard
          title="链式法则"
          formula={
            <KaTeX
              math={String.raw`\frac{\partial L}{\partial w} = \frac{\partial L}{\partial a} \cdot \frac{\partial a}{\partial z} \cdot \frac{\partial z}{\partial w}`}
              display
            />
          }
          description="其中 z = wx + b，a = f(z)，L 是最终损失。"
        />

        <p className="text-gray-700 mb-4">
          反向传播的关键在于：先做一次前向传播计算所有中间值，然后从输出层开始，
          逐层将梯度反向传递回输入层。
        </p>
      </section>

      {/* Interactive demo */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：计算图与梯度流动</h2>
        <p className="text-gray-700 mb-4">
          下面是一个简单的计算图：<KaTeX math={String.raw`z = w x + b`} />，<KaTeX math={String.raw`a = \sigma(z)`} />，
          <KaTeX math={String.raw`L = (a - y)^2`} />。调整输入 <KaTeX math={String.raw`x`} />、权重 <KaTeX math={String.raw`w`} />、
          偏置 <KaTeX math={String.raw`b`} /> 和标签 <KaTeX math={String.raw`y`} />，观察损失和梯度如何变化。
        </p>
        <BackpropDemo />
      </section>

      {/* Why efficient */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">为什么反向传播高效？</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">复用中间结果</h3>
            <p className="text-sm text-gray-700">
              前向传播时保存的激活值和线性输出，在反向传播时直接复用，避免重复计算。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">逐层传递</h3>
            <p className="text-sm text-gray-700">
              每层的梯度只依赖于后一层的梯度和本层的局部梯度，计算复杂度与网络层数线性相关。
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-violet-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-violet-800">
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>反向传播利用链式法则计算梯度。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>先前向传播保存中间结果，再反向传递梯度。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>它是神经网络能够高效训练的关键。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function BackpropDemo() {
  const [x, setX] = useState(2.0);
  const [w, setW] = useState(1.5);
  const [b, setB] = useState(-1.0);
  const [y, setY] = useState(0.8);

  const z = w * x + b;
  const a = 1 / (1 + Math.exp(-z));
  const loss = Math.pow(a - y, 2);

  // Gradients
  const dL_da = 2 * (a - y);
  const da_dz = a * (1 - a);
  const dz_dw = x;
  const dz_db = 1;

  const dL_dw = dL_da * da_dz * dz_dw;
  const dL_db = dL_da * da_dz * dz_db;

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            输入 x = <span className="font-mono">{x.toFixed(2)}</span>
          </label>
          <input type="range" min={-3} max={3} step={0.1} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            权重 w = <span className="font-mono">{w.toFixed(2)}</span>
          </label>
          <input type="range" min={-3} max={3} step={0.1} value={w} onChange={(e) => setW(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            偏置 b = <span className="font-mono">{b.toFixed(2)}</span>
          </label>
          <input type="range" min={-3} max={3} step={0.1} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签 y = <span className="font-mono">{y.toFixed(2)}</span>
          </label>
          <input type="range" min={0} max={1} step={0.05} value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">z = wx + b</p>
            <p className="text-lg font-mono font-bold text-blue-700">{z.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">a = σ(z)</p>
            <p className="text-lg font-mono font-bold text-blue-700">{a.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">L = (a - y)²</p>
            <p className="text-lg font-mono font-bold text-rose-700">{loss.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">∂L/∂a</p>
            <p className="text-lg font-mono font-bold text-violet-700">{dL_da.toFixed(3)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">∂L/∂w</p>
            <p className="text-lg font-mono font-bold text-emerald-700">{dL_dw.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">∂L/∂b</p>
            <p className="text-lg font-mono font-bold text-emerald-700">{dL_db.toFixed(3)}</p>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        梯度表示当 w 或 b 增加一点点时，损失会如何变化。反向传播就是把这些梯度从输出层传回输入层。
      </div>
    </div>
  );
}
