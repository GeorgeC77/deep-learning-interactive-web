import { ShieldAlert, GitBranch, Activity, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function LogisticAsGLMPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第三章 · 广义线性模型
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">逻辑回归作为 GLM</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          在第二章中，我们直接引入 Sigmoid 函数进行二分类。现在从 GLM 的视角来看：
          只要选择伯努利分布，Sigmoid 就会自然出现。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Bernoulli choice */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-6 h-6 text-rose-600" />
          <h2 className="text-2xl font-bold text-gray-900">选择分布：伯努利分布</h2>
        </div>
        <p className="text-gray-700 mb-4">
          二分类问题的标签 <KaTeX math={String.raw`y \in \{0, 1\}`} />。伯努利分布恰好描述这种二元结果：
        </p>

        <FormulaCard
          title="伯努利分布"
          formula={
            <KaTeX
              math={String.raw`p(y; \phi) = \phi^y (1 - \phi)^{1-y}`}
              display
            />
          }
          description="φ 是 y = 1 的概率。"
        />

        <p className="text-gray-700 mb-4">
          把它改写成指数族形式：
        </p>

        <FormulaCard
          title="伯努利分布的指数族参数"
          formula={
            <KaTeX
              math={String.raw`\eta = \log\frac{\phi}{1 - \phi}, \quad T(y) = y, \quad a(\eta) = \log(1 + e^{\eta}), \quad b(y) = 1`}
              display
            />
          }
          description="这里的 η 就是 log-odds，也称为 logit。"
        />
      </section>

      {/* Response function */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">响应函数：Sigmoid</h2>
        </div>
        <p className="text-gray-700 mb-4">
          对数配分函数 <KaTeX math={String.raw`a(\eta) = \log(1 + e^{\eta})`} />，求导得到响应函数：
        </p>

        <FormulaCard
          title="Sigmoid 响应函数"
          formula={
            <KaTeX
              math={String.raw`g(\eta) = \frac{\partial a(\eta)}{\partial \eta} = \frac{1}{1 + e^{-\eta}}`}
              display
            />
          }
          description="这正是 Sigmoid 函数！"
        />

        <p className="text-gray-700 mb-4">
          因此逻辑回归的预测函数为：
        </p>

        <FormulaCard
          title="逻辑回归假设函数"
          formula={
            <KaTeX
              math={String.raw`h_\theta(x) = \frac{1}{1 + e^{-\theta^T x}}`}
              display
            />
          }
          description="与第二章中的逻辑回归假设完全一致。"
        />

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">连接函数</h3>
            <p className="text-sm text-gray-700">
              Sigmoid 的反函数是 logit：
              <KaTeX math={String.raw`\eta = \log\frac{\phi}{1 - \phi}`} />。
              它把概率映射到整个实数轴。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">概率解释</h3>
            <p className="text-sm text-gray-700">
              <KaTeX math={String.raw`h_\theta(x) = P(y = 1 \mid x; \theta)`} />，
              输出直接是类别的概率。
            </p>
          </div>
        </div>
      </section>

      {/* Cross entropy */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">导出交叉熵损失</h2>
        <p className="text-gray-700 mb-4">
          在伯努利假设下，对数似然为：
        </p>

        <FormulaCard
          title="伯努利假设下的对数似然"
          formula={
            <KaTeX
              math={String.raw`\ell(\theta) = \sum_{i=1}^{m} \Bigl(y^{(i)} \log h_\theta(x^{(i)}) + (1 - y^{(i)}) \log\bigl(1 - h_\theta(x^{(i)})\bigr)\Bigr)`}
              display
            />
          }
          description="最大化这个对数似然，就是最小化交叉熵损失。"
        />

        <p className="text-gray-700 mb-4">
          取负号并除以 m，得到我们熟悉的逻辑回归代价函数：
        </p>

        <FormulaCard
          title="逻辑回归代价函数"
          formula={
            <KaTeX
              math={String.raw`J(\theta) = -\frac{1}{m} \sum_{i=1}^{m} \Bigl(y^{(i)} \log h_\theta(x^{(i)}) + (1 - y^{(i)}) \log\bigl(1 - h_\theta(x^{(i)})\bigr)\Bigr)`}
              display
            />
          }
          description="这就是第二章中的交叉熵损失。"
        />
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-rose-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-rose-800">
          <li className="flex items-start gap-2">
            <span className="text-rose-500 mt-0.5">●</span>
            <span>逻辑回归对应 GLM 中的伯努利分布假设。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 mt-0.5">●</span>
            <span>伯努利分布的对数配分函数求导后自然得到 Sigmoid 函数。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose-500 mt-0.5">●</span>
            <span>最大似然估计导出交叉熵损失，与第二章完全一致。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
