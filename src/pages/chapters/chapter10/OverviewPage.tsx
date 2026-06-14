import { ShieldAlert, BookOpen, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十章 · 聚类
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">聚类与 K-means 算法</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          聚类是无监督学习中最基础的问题之一：在没有标签的情况下，把数据分成若干组，
          使得同一组内的样本彼此相似。K-means 算法通过迭代优化失真函数来实现这一目标。
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
          <h2 className="text-2xl font-bold text-gray-900">本章内容</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">10.1 K-means 算法</h3>
            <p className="text-sm text-gray-700">
              初始化质心，反复执行分配与更新两个步骤，直到收敛。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">失真函数</h3>
            <p className="text-sm text-gray-700">
              K-means 目标是最小化每个样本到其所属质心的距离平方和。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">坐标下降视角</h3>
            <p className="text-sm text-gray-700">
              分配步骤固定质心优化类别，更新步骤固定类别优化质心。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">局部最优</h3>
            <p className="text-sm text-gray-700">
              K-means 可能陷入局部最优，常用多次随机初始化来缓解。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心思想</h2>
        <FormulaCard
          title="失真函数"
          formula={
            <KaTeX
              math={String.raw`J(c, \mu) = \sum_{i=1}^n \bigl\|x^{(i)} - \mu_{c^{(i)}}\bigr\|^2`}
              display
            />
          }
          description="其中 c^(i) 表示第 i 个样本所属的簇，μ_j 表示第 j 个簇的质心。K-means 通过交替优化使 J 单调下降。"
        />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>聚类是无监督学习，目标是把相似样本分到同一组。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>K-means 通过分配和更新两个步骤迭代优化失真函数。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>算法可能收敛到局部最优，多次初始化可改善结果。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
