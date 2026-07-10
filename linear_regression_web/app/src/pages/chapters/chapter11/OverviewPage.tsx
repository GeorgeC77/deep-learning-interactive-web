import { ShieldAlert, BookOpen, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十一章 · EM 算法
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">EM 算法</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          期望最大化（EM）算法是处理含有隐变量模型的强大工具。它通过交替执行 E-step 和 M-step，
          逐步最大化观测数据的对数似然。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">本章内容</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">11.1 高斯混合模型的 EM</h3>
            <p className="text-sm text-gray-700">
              以高斯混合模型为例，直观理解 E-step 与 M-step 的具体更新公式。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">11.2 Jensen 不等式</h3>
            <p className="text-sm text-gray-700">
              EM 收敛性证明的核心数学工具。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">11.3 一般 EM 算法</h3>
            <p className="text-sm text-gray-700">
              通过证据下界（ELBO）理解一般形式的 EM。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">11.4 高斯混合模型再探</h3>
            <p className="text-sm text-gray-700">
              用一般 EM 框架重新推导高斯混合模型的参数更新。
            </p>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-200 md:col-span-2">
            <h3 className="font-semibold text-rose-800 mb-2">11.5 变分推断与变分自编码器（可选）</h3>
            <p className="text-sm text-gray-700">
              将 EM 思想推广到由神经网络参数化的复杂模型，介绍变分自编码器（VAE）的基本思想。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心思想</h2>
        <FormulaCard
          title="EM 算法"
          formula={
            <KaTeX
              math={String.raw`\text{E-step: } Q_i(z^{(i)}) := p\bigl(z^{(i)}|x^{(i)};\theta\bigr) \quad \text{M-step: } \theta := \arg\max_\theta \sum_i \sum_{z^{(i)}} Q_i(z^{(i)}) \log \frac{p(x^{(i)},z^{(i)};\theta)}{Q_i(z^{(i)})}`}
              display
            />
          }
          description="E-step 计算隐变量的后验分布，M-step 最大化基于该分布的期望完全数据对数似然。"
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
            <span>EM 算法用于含有隐变量的最大似然估计。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>E-step 推断隐变量，M-step 更新模型参数。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>Jensen 不等式保证了 EM 每次迭代不降低观测似然。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
