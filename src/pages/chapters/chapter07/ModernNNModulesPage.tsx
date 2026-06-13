import { useState } from 'react';
import { ShieldAlert, Layers, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

const IMAGE = [
  [2, 1, 0, 1, 2],
  [1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1],
  [2, 1, 0, 1, 2],
];

const KERNEL = [
  [0, 1, 0],
  [1, -4, 1],
  [0, 1, 0],
];

export default function ModernNNModulesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第七章 · 深度学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">现代神经网络模块</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          除了全连接层，现代神经网络还包含卷积层、池化层、Dropout、批归一化等模块。
          这些模块让网络更适合处理图像、序列等结构化数据。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Fully connected */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">全连接层</h2>
        </div>
        <p className="text-gray-700 mb-4">
          全连接层（Dense / Linear）中，每个输入神经元都与每个输出神经元相连：
        </p>

        <FormulaCard
          title="全连接层"
          formula={
            <KaTeX
              math={String.raw`a^{[l]} = f\bigl(W^{[l]} a^{[l-1]} + b^{[l]}\bigr)`}
              display
            />
          }
          description="参数量大，适合处理特征向量，但会忽略空间结构。"
        />
      </section>

      {/* Convolution */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">卷积层</h2>
        <p className="text-gray-700 mb-4">
          卷积层使用可学习的卷积核在输入上滑动，提取局部特征。它通过权重共享大幅减少参数量，
          并保留空间结构。
        </p>

        <FormulaCard
          title="卷积操作"
          formula={
            <KaTeX
              math={String.raw`(I * K)_{i,j} = \sum_{m}\sum_{n} I_{i+m, j+n} \, K_{m,n}`}
              display
            />
          }
          description="卷积核 K 在输入 I 上滑动，逐元素相乘再求和。"
        />

        {/* Interactive demo */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">交互演示：卷积核滑动</h3>
          <p className="text-gray-600 text-sm mb-4">
            点击网格中的位置，观察 3×3 卷积核在该位置计算出的输出值。
          </p>
          <ConvolutionDemo />
        </div>
      </section>

      {/* Other modules */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">其他常见模块</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">池化层（Pooling）</h3>
            <p className="text-sm text-gray-700">
              通过取局部最大值或平均值降低特征图尺寸，减少计算量并提供一定平移不变性。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">Dropout</h3>
            <p className="text-sm text-gray-700">
              训练时随机丢弃部分神经元，防止网络过度依赖某些特征，减少过拟合。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">批归一化（BatchNorm）</h3>
            <p className="text-sm text-gray-700">
              对每个小批量数据做归一化，稳定训练过程，允许使用更大的学习率。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">残差连接（Residual）</h3>
            <p className="text-sm text-gray-700">
              让网络学习残差映射 <KaTeX math={String.raw`F(x) = H(x) - x`} />，缓解深层网络的梯度消失问题。
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">●</span>
            <span>全连接层适合向量输入，但参数量大。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">●</span>
            <span>卷积层通过局部连接和权重共享高效处理图像等网格数据。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">●</span>
            <span>池化、Dropout、批归一化、残差连接等模块进一步提升网络性能。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function ConvolutionDemo() {
  const [row, setRow] = useState(1);
  const [col, setCol] = useState(1);

  const outputValue = computeConvolution(IMAGE, KERNEL, row, col);

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">输入图像（点击选择卷积核中心位置）</p>
          <div className="inline-grid grid-cols-5 gap-1">
            {IMAGE.map((rowArr, r) =>
              rowArr.map((val, c) => {
                const inKernel = Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1;
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => {
                      if (r >= 1 && r <= 3 && c >= 1 && c <= 3) {
                        setRow(r);
                        setCol(c);
                      }
                    }}
                    className={`w-10 h-10 flex items-center justify-center text-xs font-medium rounded transition-colors ${
                      inKernel ? 'bg-blue-300 text-blue-900' : 'bg-white text-gray-700 border border-gray-200'
                    } ${r >= 1 && r <= 3 && c >= 1 && c <= 3 ? 'cursor-pointer hover:bg-blue-100' : 'cursor-default'}`}
                  >
                    {val}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">卷积核（边缘检测）</p>
            <div className="inline-grid grid-cols-3 gap-1">
              {KERNEL.map((rowArr, r) =>
                rowArr.map((val, c) => (
                  <div
                    key={`k-${r}-${c}`}
                    className="w-10 h-10 flex items-center justify-center text-xs font-medium rounded bg-violet-100 text-violet-900"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">中心位置：({row}, {col})</p>
            <p className="text-sm text-gray-600">卷积输出：</p>
            <p className="text-2xl font-mono font-bold text-blue-700">{outputValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function computeConvolution(image: number[][], kernel: number[][], centerRow: number, centerCol: number): number {
  let sum = 0;
  for (let kr = 0; kr < 3; kr++) {
    for (let kc = 0; kc < 3; kc++) {
      const r = centerRow + kr - 1;
      const c = centerCol + kc - 1;
      sum += image[r][c] * kernel[kr][kc];
    }
  }
  return sum;
}
