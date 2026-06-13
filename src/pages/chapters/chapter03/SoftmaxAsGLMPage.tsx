import { ShieldAlert, Layers, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function SoftmaxAsGLMPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第三章 · 广义线性模型
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Softmax 回归作为 GLM</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          多分类问题可以看作伯努利分布向多个类别的推广——多项分布。选择多项分布作为 GLM 的指数族，
          就能导出 Softmax 回归。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Multinomial */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">选择分布：多项分布</h2>
        </div>
        <p className="text-gray-700 mb-4">
          对于 k 类分类问题，标签用一个 k 维 one-hot 向量表示：
          <KaTeX math={String.raw`y \in \{0, 1\}^k`} />，且 <KaTeX math={String.raw`\sum_{j=1}^{k} y_j = 1`} />。
          多项分布描述这种多元离散结果：
        </p>

        <FormulaCard
          title="多项分布"
          formula={
            <KaTeX
              math={String.raw`p(y; \phi) = \prod_{j=1}^{k} \phi_j^{y_j}`}
              display
            />
          }
          description="φⱼ 是样本属于第 j 类的概率。"
        />

        <p className="text-gray-700 mb-4">
          由于 <KaTeX math={String.raw`\sum_j \phi_j = 1`} />，k 个参数中只有 k−1 个是自由的。我们可以用 k−1 个自然参数表示：
        </p>

        <FormulaCard
          title="自然参数"
          formula={
            <KaTeX
              math={String.raw`\eta_j = \log\frac{\phi_j}{\phi_k}, \quad j = 1, \dots, k-1`}
              display
            />
          }
          description="以第 k 类为参照类别。"
        />
      </section>

      {/* Softmax */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">导出 Softmax 函数</h2>
        <p className="text-gray-700 mb-4">
          从自然参数反解概率 φ，得到：
        </p>

        <FormulaCard
          title="Softmax 概率"
          formula={
            <KaTeX
              math={String.raw`\phi_j = \frac{e^{\eta_j}}{\sum_{l=1}^{k} e^{\eta_l}}`}
              display
            />
          }
          description="这就是 Softmax 函数。"
        />

        <p className="text-gray-700 mb-4">
          在 GLM 中，我们假设每一类有自己的参数向量 θⱼ，因此：
        </p>

        <FormulaCard
          title="Softmax 回归假设"
          formula={
            <KaTeX
              math={String.raw`P(y = j \mid x; \theta) = \frac{e^{\theta_j^T x}}{\sum_{l=1}^{k} e^{\theta_l^T x}}`}
              display
            />
          }
          description="每个类别对应一个线性得分 θⱼᵀx，Softmax 把这些得分转换为概率。"
        />
      </section>

      {/* Cross entropy */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">多分类交叉熵损失</h2>
        <p className="text-gray-700 mb-4">
          与逻辑回归类似，Softmax 回归也可以用最大似然估计。对数似然为：
        </p>

        <FormulaCard
          title="Softmax 对数似然"
          formula={
            <KaTeX
              math={String.raw`\ell(\theta) = \sum_{i=1}^{m} \sum_{j=1}^{k} y_j^{(i)} \log P(y^{(i)} = j \mid x^{(i)}; \theta)`}
              display
            />
          }
          description="只有真实类别对应的 yⱼ = 1 才会贡献一项。"
        />

        <p className="text-gray-700 mb-4">
          取负号后得到多分类交叉熵损失：
        </p>

        <FormulaCard
          title="Softmax 代价函数"
          formula={
            <KaTeX
              math={String.raw`J(\theta) = -\frac{1}{m} \sum_{i=1}^{m} \sum_{j=1}^{k} y_j^{(i)} \log \frac{e^{\theta_j^T x^{(i)}}}{\sum_{l=1}^{k} e^{\theta_l^T x^{(i)}}}`}
              display
            />
          }
          description="与第二章多分类中的 Softmax 损失一致。"
        />
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            <span>Softmax 回归对应 GLM 中的多项分布假设。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            <span>自然参数 ηⱼ 是相对于参照类别的 log-odds。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            <span>Softmax 函数是多项分布的响应函数，把线性得分转换为类别概率。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
