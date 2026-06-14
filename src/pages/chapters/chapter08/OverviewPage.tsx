import { ShieldAlert, BookOpen, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第八章 · 泛化
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">泛化</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          训练误差最小化只是手段，真正的目标是让模型在未见过的新数据上表现良好。
          本章介绍偏差-方差权衡、过拟合与欠拟合，以及现代深度学习中的双下降现象。
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">为什么泛化重要？</h2>
        </div>
        <p className="text-gray-700 mb-4">
          机器学习模型通过最小化训练损失来学习参数。然而，训练误差小并不保证测试误差也小。
          当模型在训练集上表现很好、但在测试集上表现很差时，我们称它发生了<strong>过拟合</strong>；
          当模型连训练集都无法很好拟合时，我们称它发生了<strong>欠拟合</strong>。
        </p>

        <FormulaCard
          title="测试误差（泛化误差）"
          formula={
            <KaTeX
              math={String.raw`L(\theta) = \mathbb{E}_{(x,y)\sim D}\left[\bigl(y - h_\theta(x)\bigr)^2\right]`}
              display
            />
          }
          description="测试误差是模型在未见过的新样本上的期望损失，是衡量模型好坏的最终标准。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">本章内容</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">偏差-方差权衡</h3>
            <p className="text-sm text-gray-700">
              把测试误差分解为偏差、方差与不可约噪声，理解模型复杂度如何影响泛化。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">双下降现象</h3>
            <p className="text-sm text-gray-700">
              当模型参数超过样本数后，测试误差可能再次下降，挑战经典的 U 型曲线。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">样本复杂度</h3>
            <p className="text-sm text-gray-700">
              用 Hoeffding 不等式与联合界等工具，定量刻画训练样本数与泛化误差的关系。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>泛化能力指模型在未见过数据上的表现。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>过拟合：训练误差小，测试误差大；欠拟合：训练误差也大。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>偏差-方差权衡帮助我们理解并选择合适的模型复杂度。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
