import { ShieldAlert, Activity, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function ValuePolicyConnectionPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十五章 · 强化学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">值迭代与策略迭代的关系</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          值迭代和策略迭代看起来是两种不同的算法，但它们可以通过一个统一的框架联系起来。
          本节介绍这个联系，并解释何时应该选择哪一种算法。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">统一视角</h2>
        </div>
        <p className="text-gray-700 mb-4">
          回顾策略迭代：它交替执行两步——
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>策略评估：</strong>计算当前策略 π 的价值函数 V^π。</li>
          <li><strong>策略改进：</strong>根据 V^π 构造贪婪策略。</li>
        </ol>
        <p className="text-gray-700 mb-4">
          在策略迭代的策略评估步骤中，我们通常求解一个线性方程组来精确得到 V^π。但这不是唯一的选择：
          我们也可以用迭代的 Bellman 更新来近似 V^π，就像在值迭代中那样。
        </p>
        <FormulaCard
          title="迭代式策略评估"
          formula={
            <KaTeX
              math={String.raw`V(s) := \sum_{s'} P(s'|s,\pi(s)) \bigl[ R(s,\pi(s),s') + \gamma V(s') \bigr]`}
              display
            />
          }
          description="这里固定使用当前策略 π 的动作，而不是取 max。重复此更新 k 次，就得到 V^π 的一个近似。"
        />
        <p className="text-gray-700 mt-2 text-sm">
          {'文本形式：V(s) := Σ_{s\'} P(s\'|s,π(s))[R(s,π(s),s\') + γV(s\')]'}
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Algorithm 6：连接两者的桥梁</h2>
        <p className="text-gray-700 mb-4">
          引入一个过程 VE(π, k)：对当前策略 π 执行 k 次 Bellman 更新，然后用得到的价值函数构造贪婪策略。
          整个算法流程如下：
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
          <li>随机初始化策略 π。</li>
          <li>重复直到收敛：
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-gray-700">
              <li>V := VE(π, k)（对 π 做 k 次 Bellman 更新）。</li>
              <li>{"π(s) := argmax_a Σ_{s'} P(s'|s,a)[R(s,a,s') + γV(s')]"} <KaTeX math={String.raw`\pi(s) := \arg\max_a \sum_{s'} P(s'|s,a)\bigl[R(s,a,s') + \gamma V(s')\bigr]`} />（贪婪策略改进）。</li>
            </ul>
          </li>
        </ol>
        <p className="text-gray-700">
          这个算法族的行为取决于参数 k：
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">两个极端</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">k = 1：值迭代</h3>
            <p className="text-sm text-gray-700">
              当 k = 1 时，Algorithm 6 每次只做一次策略评估更新，然后就做策略改进。在常见同步 Bellman backup 和贪婪策略提取设定下，k=1 与值迭代非常接近，可视为值迭代的特例或等价实现；
              两者都在交替执行一次 Bellman 备份和一次贪婪策略提取。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">k = ∞：策略迭代</h3>
            <p className="text-sm text-gray-700">
              当 k 足够大（或用线性系统求解器精确求解）时，策略评估步骤给出精确的 V^π。
              这就退化为标准的策略迭代，每次策略改进都基于精确的价值函数。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">何时选择哪种算法？</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>策略迭代：</strong>当状态空间较小，能够高效求解线性方程组时，策略迭代通常收敛更快，并且能在有限步内得到精确最优策略。</li>
          <li><strong>值迭代：</strong>当状态空间较大但仍可枚举时，值迭代通常比精确策略评估更容易实现；当状态空间非常大或连续时，通常需要近似动态规划或基于采样的强化学习方法。</li>
          <li><strong>中间选择：</strong>理论上可以在 Algorithm 6 中取某个 k {'>'} 1，但如果 k 次 Bellman 更新不能显著快于 k 次值迭代，那么通常 k = 1 已经很好。</li>
        </ul>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>策略评估既可以用线性系统精确求解，也可以用迭代 Bellman 更新近似。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>Algorithm 6 统一了值迭代和策略迭代：k=1 对应值迭代，k=∞ 对应策略迭代。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>小状态空间可用精确动态规划；大状态空间通常需要近似动态规划或基于采样的强化学习方法。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
