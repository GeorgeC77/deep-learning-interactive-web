import { ShieldAlert, GitBranch, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function GeneralEMPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十一章 · EM 算法
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">一般 EM 算法</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          一般形式的 EM 算法适用于任何含有隐变量的模型。它通过构造并优化观测似然的下界——证据下界（ELBO），
          将困难的边际化问题转化为更容易的交替优化问题。
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
          <GitBranch className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">问题设置</h2>
        </div>
        <p className="text-gray-700 mb-4">
          假设我们有一个隐变量模型 p(x, z; θ)，其中 x 是观测变量，z 是隐变量。我们的目标是最大化观测数据的对数似然：
        </p>
        <FormulaCard
          title="观测对数似然"
          formula={
            <KaTeX
              math={String.raw`\ell(\theta) = \sum_{i=1}^n \log p\bigl(x^{(i)};\theta\bigr) = \sum_{i=1}^n \log \sum_{z^{(i)}} p\bigl(x^{(i)}, z^{(i)};\theta\bigr)`}
              display
            />
          }
          description="直接对 θ 最大化这个表达式通常很困难，因为求和对数内部有求和。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">证据下界 ELBO</h2>
        <p className="text-gray-700 mb-4">
          引入任意分布 Q_i(z^(i))，利用对数函数的凹性和 Jensen 不等式，可以得到：
        </p>
        <FormulaCard
          title="ELBO"
          formula={
            <KaTeX
              math={String.raw`\log p(x;\theta) \ge \sum_z Q(z) \log \frac{p(x,z;\theta)}{Q(z)} = \mathbb{E}_{z\sim Q}\left[\log \frac{p(x,z;\theta)}{Q(z)}\right]`}
              display
            />
          }
          description="右边的表达式称为证据下界（Evidence Lower BOund，ELBO），它对任意 Q 都是 log p(x;θ) 的下界。"
        />

        <p className="text-gray-700 mt-4">
          为了让下界尽可能紧，我们在 E-step 选择 Q_i 为当前参数下的后验分布：
        </p>
        <FormulaCard
          title="E-step：使下界紧致"
          formula={
            <KaTeX
              math={String.raw`Q_i\bigl(z^{(i)}\bigr) := p\bigl(z^{(i)}|x^{(i)};\theta\bigr)`}
              display
            />
          }
          description="此时 Jensen 不等式取等号，ELBO 恰好等于当前对数似然。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">一般 EM 算法流程</h2>
        <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 space-y-4">
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">E-step</h3>
            <p className="text-sm text-gray-700">
              对每个样本，计算隐变量的后验分布：Q_i(z^(i)) = p(z^(i)|x^(i); θ)
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">M-step</h3>
            <p className="text-sm text-gray-700">
              固定 Q_i，最大化 ELBO 得到新的参数 θ：
            </p>
            <KaTeX
              math={String.raw`\theta := \arg\max_\theta \sum_{i=1}^n \sum_{z^{(i)}} Q_i\bigl(z^{(i)}\bigr) \log \frac{p\bigl(x^{(i)}, z^{(i)};\theta\bigr)}{Q_i\bigl(z^{(i)}\bigr)}`}
              display
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">收敛性保证</h2>
        <p className="text-gray-700 mb-4">
          设 θ^(t) 和 θ^(t+1) 是 EM 连续两次迭代得到的参数。通过 ELBO 的构造可以证明：
        </p>
        <FormulaCard
          title="单调性"
          formula={
            <KaTeX
              math={String.raw`\ell\bigl(\theta^{(t)}\bigr) \le \ell\bigl(\theta^{(t+1)}\bigr)`}
              display
            />
          }
          description="EM 每次迭代都不会降低观测对数似然，因此必然收敛（到局部最优）。"
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
            <span>一般 EM 算法适用于任意含隐变量的模型。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>E-step 设 Q 为隐变量后验，使 ELBO 紧致。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>M-step 固定 Q 并最大化 ELBO 更新参数。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>EM 保证观测似然单调不减，因此收敛。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
