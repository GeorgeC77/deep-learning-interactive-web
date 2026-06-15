import { ShieldAlert, BookOpen, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十二章 · 主成分分析
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">主成分分析</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          主成分分析（PCA）是最常用的线性降维技术。它通过协方差矩阵的特征分解，
          找到数据变化最大的方向，把高维数据压缩到低维子空间。
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
            <h3 className="font-semibold text-blue-800 mb-2">12.1 主成分分析</h3>
            <p className="text-sm text-gray-700">
              从降维动机出发，介绍数据预处理、最大化投影方差、协方差矩阵特征分解、低维表示与应用。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">交互演示</h3>
            <p className="text-sm text-gray-700">
              在二维相关数据上实时计算主成分，比较 PCA 方向与任意手动方向的投影方差。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心思想</h2>
        <FormulaCard
          title="PCA 优化目标"
          formula={
            <KaTeX
              math={String.raw`\max_{\|u\|=1} u^T \Sigma u \quad \text{其中 } \Sigma = \frac{1}{n}\sum_{i=1}^n x^{(i)} (x^{(i)})^T`}
              display
            />
          }
          description="最优投影方向 u 是样本协方差矩阵 Σ 的最大特征值对应的特征向量。"
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
            <span>PCA 是一种无监督线性降维方法。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>主成分是协方差矩阵的特征向量。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>保留前 k 个主成分可同时最大化方差并最小化重构误差。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
