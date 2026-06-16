import { ShieldAlert, Cpu, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function VariationalInferencePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十一章 · EM 算法
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">变分推断与变分自编码器</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          变分推断将 EM 的思想推广到复杂模型。当隐变量后验无法解析计算时，
          我们用一族参数化的分布去近似它，并通过优化 ELBO 来同时学习模型参数和近似后验。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">从精确后验到近似后验</h2>
        </div>
        <p className="text-gray-700 mb-4">
          在经典 EM 中，E-step 要求能精确计算后验 p(z|x;θ)。对于很多复杂模型（尤其是由神经网络参数化的模型），
          这个后验是无法解析计算的。变分推断引入一个近似分布 Q(z)，并最小化 Q 与真实后验之间的 KL 散度。
        </p>

        <FormulaCard
          title="ELBO 的另一种形式"
          formula={
            <KaTeX
              math={String.raw`\text{ELBO}(x; Q, \theta) = \log p(x;\theta) - D_{KL}\bigl(Q(z) \| p(z|x;\theta)\bigr)`}
              display
            />
          }
          description="最大化 ELBO 相当于同时提高模型似然，并让近似后验 Q 接近真实后验。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">变分自编码器（VAE）</h2>
        <p className="text-gray-700 mb-4">
          变分自编码器是变分推断与深度学习的结合。它用神经网络参数化：
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>编码器（推断网络）</strong>：输入 x，输出近似后验 Q(z|x) 的均值和方差。</li>
          <li><strong>解码器（生成网络）</strong>：输入 z，输出数据分布 p(x|z) 的参数。</li>
        </ul>

        <FormulaCard
          title="VAE 目标函数"
          formula={
            <KaTeX
              math={String.raw`\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{z \sim q_\phi(z|x)}\left[\log p_\theta(x|z)\right] - D_{KL}\bigl(q_\phi(z|x) \| p(z)\bigr)`}
              display
            />
          }
          description="第一项是重构似然，第二项让近似后验接近先验。"
        />

        <p className="text-gray-700 mt-4">
          为了让梯度能够穿过采样过程，VAE 使用<strong>重参数化技巧</strong>：
        </p>
        <FormulaCard
          title="重参数化技巧"
          formula={
            <KaTeX
              math={String.raw`z = \mu(x) + \sigma(x) \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)`}
              display
            />
          }
          description="这样 z 对参数的依赖变成确定性变换，随机性来自与参数无关的 ε，从而可以使用标准反向传播。"
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
            <span>变分推断用可计算的近似后验代替复杂模型的真实后验。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>VAE 用神经网络参数化编码器和解码器。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>重参数化技巧使 VAE 可以通过反向传播端到端训练。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
