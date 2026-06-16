import { ShieldAlert, BookOpen, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十五章 · 强化学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">强化学习</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          强化学习研究智能体如何在环境中通过奖励信号学习决策策略。与监督学习不同，
          强化学习没有显式的正确答案，而是通过长期累积奖励来评估行为。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">本章内容</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">15.1 马尔可夫决策过程</h3>
            <p className="text-sm text-gray-700">MDP 的形式化定义、策略、价值函数与 Bellman 最优方程。</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">15.2 值迭代与策略迭代</h3>
            <p className="text-sm text-gray-700">两种经典的动态规划求解算法及其对比。</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">15.3 学习 MDP 模型</h3>
            <p className="text-sm text-gray-700">从交互经验估计转移概率与奖励，以及连续状态 MDP 的初步处理。</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心思想</h2>
        <FormulaCard
          title="Bellman 最优方程"
          formula={
            <KaTeX
              math={String.raw`V^*(s) = R(s) + \gamma \max_{a \in A} \sum_{s' \in S} P_{sa}(s') V^*(s')`}
              display
            />
          }
          description="最优价值函数满足这一自洽方程，值迭代和策略迭代都围绕它展开。"
        />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>强化学习通过奖励信号指导智能体学习最优策略。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>MDP 是强化学习的标准数学模型。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>值迭代和策略迭代是已知模型时的求解算法。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>模型未知时，可以从经验中估计转移概率和奖励。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
