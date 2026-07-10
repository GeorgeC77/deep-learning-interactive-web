import { ShieldAlert, Brain, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function ImplicitRegularizationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第九章 · 正则化与模型选择
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">隐式正则化效应</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          除了显式地加入 L1/L2 正则项，训练过程中使用的优化器、学习率、批量大小等选择
          也会隐式地影响模型最终收敛到的解，这种现象被称为隐式正则化。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">优化器也是有偏好的</h2>
        </div>
        <p className="text-gray-700 mb-4">
          在经典统计学习中，损失函数通常有唯一全局最小值，因此优化器的选择只影响收敛速度。
          但在深度学习中，损失函数往往有许多（近似）全局最小值，它们的训练损失相近，泛化性能却可能差异巨大。
          此时，优化器不再只是“最小化训练损失”的工具，它还会偏好某些类型的解。
        </p>

        <FormulaCard
          title="损失景观中的多个极小值"
          formula={
            <KaTeX
              math={String.raw`\theta^* = \arg\min_\theta J(\theta) \quad \text{可能有多个 } \theta^* \text{ 使得 } J(\theta^*) \approx 0`}
              display
            />
          }
          description="这些全局最小值可能对应平坦的或尖锐的解，其中平坦解通常更鲁棒、泛化更好。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">影响隐式正则化的因素</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">初始学习率</h3>
            <p className="text-sm text-gray-700">
              较大的初始学习率往往有助于优化器跳出尖锐的局部最小值，偏向更平坦、泛化更好的区域。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">批量大小</h3>
            <p className="text-sm text-gray-700">
              较小的批量大小引入更多梯度噪声，这种随机性可能帮助模型找到更平坦的最小值。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">初始化尺度</h3>
            <p className="text-sm text-gray-700">
              较小的初始化可能与优化轨迹相互作用，使最终解具有更小的范数或更简单的结构。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">动量</h3>
            <p className="text-sm text-gray-700">
              动量可以加速优化并改变收敛方向，在某些情况下偏向更稳定的解。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">平坦最小值 vs 尖锐最小值</h2>
        <p className="text-gray-700 mb-4">
          一个直观的理解是：平坦最小值附近的损失变化缓慢，即使输入数据或参数有微小扰动，预测结果也不会剧烈变化；
          而尖锐最小值对扰动非常敏感。因此，平坦最小值对应的模型通常更鲁棒、泛化更好。
        </p>
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <svg viewBox="0 0 640 240" className="w-full" style={{ maxHeight: 240 }}>
            {/* 平坦最小值 */}
            <text x={160} y={30} textAnchor="middle" fontSize={14} fill="#374151">平坦最小值</text>
            <path d="M 40 180 Q 160 80 280 180" fill="none" stroke="#2563eb" strokeWidth={3} />
            <circle cx={160} cy={130} r={5} fill="#2563eb" />
            <line x1={100} y1={180} x2={220} y2={180} stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3" />
            <text x={160} y={210} textAnchor="middle" fontSize={12} fill="#4b5563">损失变化缓慢，泛化好</text>

            {/* 尖锐最小值 */}
            <text x={480} y={30} textAnchor="middle" fontSize={14} fill="#374151">尖锐最小值</text>
            <path d="M 400 180 L 470 60 L 490 60 L 560 180" fill="none" stroke="#ef4444" strokeWidth={3} />
            <circle cx={480} cy={60} r={5} fill="#ef4444" />
            <line x1={450} y1={180} x2={510} y2={180} stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3" />
            <text x={480} y={210} textAnchor="middle" fontSize={12} fill="#4b5563">损失变化剧烈，泛化差</text>
          </svg>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>优化器的选择不仅影响训练速度，还会影响最终解的性质。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>大学习率、小批量、小初始化等因素往往有助于找到更平坦的最小值。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>隐式正则化是深度学习理论研究的前沿课题。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
