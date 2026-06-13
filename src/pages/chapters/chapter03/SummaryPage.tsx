import { ShieldAlert, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function SummaryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第三章 · 广义线性模型
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">本章总结</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          回顾 GLM 的核心思想：通过指数族分布和三个简单假设，把线性回归、逻辑回归、Softmax 回归统一在一个框架下。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Core formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心公式回顾</h2>
        </div>

        <FormulaCard
          title="指数族分布"
          formula={
            <KaTeX
              math={String.raw`p(y; \eta) = b(y) \exp\bigl(\eta^T T(y) - a(\eta)\bigr)`}
              display
            />
          }
          description="所有 GLM 都从这个统一形式出发。"
        />

        <FormulaCard
          title="GLM 预测函数"
          formula={
            <KaTeX
              math={String.raw`h(x) = g(\theta^T x) = \mathbb{E}[T(y) \mid x; \theta]`}
              display
            />
          }
          description="响应函数 g 是对数配分函数 a(η) 的导数。"
        />

        <FormulaCard
          title="最大似然梯度"
          formula={
            <KaTeX
              math={String.raw`\nabla_\theta \ell(\theta) = \sum_{i=1}^{m} \bigl(y^{(i)} - h_\theta(x^{(i)})\bigr) x^{(i)}`}
              display
            />
          }
          description="不同 GLM 的区别只在于 h(x) 的选择。"
        />
      </section>

      {/* Comparison table */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">模型对比</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left px-4 py-3 text-blue-800 font-semibold border-b border-gray-200">模型</th>
                <th className="text-left px-4 py-3 text-blue-800 font-semibold border-b border-gray-200">分布</th>
                <th className="text-left px-4 py-3 text-blue-800 font-semibold border-b border-gray-200">响应函数 g</th>
                <th className="text-left px-4 py-3 text-blue-800 font-semibold border-b border-gray-200">预测 h(x)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">线性回归</td>
                <td className="px-4 py-3 border-b border-gray-200">高斯分布</td>
                <td className="px-4 py-3 border-b border-gray-200">恒等函数</td>
                <td className="px-4 py-3 border-b border-gray-200"><KaTeX math={String.raw`\theta^T x`} /></td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">逻辑回归</td>
                <td className="px-4 py-3 border-b border-gray-200">伯努利分布</td>
                <td className="px-4 py-3 border-b border-gray-200">Sigmoid</td>
                <td className="px-4 py-3 border-b border-gray-200"><KaTeX math={String.raw`\frac{1}{1 + e^{-\theta^T x}}`} /></td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 border-b border-gray-200 font-medium">Softmax 回归</td>
                <td className="px-4 py-3 border-b border-gray-200">多项分布</td>
                <td className="px-4 py-3 border-b border-gray-200">Softmax</td>
                <td className="px-4 py-3 border-b border-gray-200"><KaTeX math={String.raw`\frac{e^{\theta_j^T x}}{\sum_l e^{\theta_l^T x}}`} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Takeaways */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">关键收获</h2>
        <div className="space-y-3">
          <TakeawayItem text="GLM 把监督学习中的回归与分类问题统一到一个框架下。" />
          <TakeawayItem text="选择不同的指数族分布，就能得到不同的模型：高斯→线性回归，伯努利→逻辑回归，多项→Softmax。" />
          <TakeawayItem text="响应函数由对数配分函数决定，不是人为规定的。" />
          <TakeawayItem text="最大似然估计给出了统一的梯度形式，便于实现和扩展。" />
        </div>
      </section>

      {/* Next chapter preview */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">下一章预告</h3>
        <p className="text-sm text-blue-800 leading-relaxed mb-4">
          第四章将进入<strong>生成学习算法</strong>。与逻辑回归等判别式方法不同，生成模型会对每个类别的数据分布进行建模，
          然后通过贝叶斯定理进行分类。我们将学习高斯判别分析（GDA）和朴素贝叶斯算法。
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          返回目录 <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

function TakeawayItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
