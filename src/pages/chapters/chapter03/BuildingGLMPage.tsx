import type { ReactNode } from 'react';
import { ShieldAlert, Sparkles, GitBranch, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function BuildingGLMPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第三章 · 广义线性模型
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">构建 GLM</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          GLM 通过三个简单假设，把输入特征、自然参数和响应变量的分布联系起来。一旦接受这三个假设，
          具体的预测函数和优化目标就会自动推导出来。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Three assumptions */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">GLM 的三个假设</h2>
        </div>
        <p className="text-gray-700 mb-6">
          假设我们有一个训练集，输入为 <KaTeX math={String.raw`x \in \mathbb{R}^n`} />，输出为 <KaTeX math={String.raw`y`} />，参数为 <KaTeX math={String.raw`\theta`} />。
          GLM 对 <KaTeX math={String.raw`y \mid x; \theta`} /> 做出如下假设：
        </p>

        <div className="space-y-6">
          <AssumptionCard
            number={1}
            title="条件分布属于指数族"
            content={
              <>
                <KaTeX math={String.raw`y \mid x; \theta \sim \text{ExponentialFamily}(\eta)`} />。
                即给定 x 和 θ，响应变量服从某个以 η 为自然参数的指数族分布。
              </>
            }
          />
          <AssumptionCard
            number={2}
            title="预测目标是充分统计量的期望"
            content={
              <>
                我们要预测 <KaTeX math={String.raw`h(x) = \mathbb{E}[T(y) \mid x; \theta]`} />。
                对于普通回归 <KaTeX math={String.raw`T(y) = y`} />；对于 k 类分类 <KaTeX math={String.raw`T(y)`} /> 是 k 维 one-hot 指示向量。
              </>
            }
          />
          <AssumptionCard
            number={3}
            title="自然参数与输入线性相关"
            content={
              <>
                <KaTeX math={String.raw`\eta = \theta^T x`} />。
                这是 GLM 中"线性"的来源：自然参数是输入特征的线性组合。
              </>
            }
          />
        </div>
      </section>

      {/* Derivation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">从假设到预测函数</h2>
        </div>
        <p className="text-gray-700 mb-4">
          由指数族分布的性质可知，对数配分函数 a(η) 的导数等于充分统计量的期望：
        </p>

        <FormulaCard
          title="期望与对数配分函数的关系"
          formula={
            <KaTeX
              math={String.raw`\mathbb{E}[T(y) \mid x; \theta] = \frac{\partial a(\eta)}{\partial \eta}`}
              display
            />
          }
          description="这个等式是 GLM 推导的关键一步。"
        />

        <p className="text-gray-700 mb-4">
          结合第三个假设 <KaTeX math={String.raw`\eta = \theta^T x`} />，我们得到 GLM 的预测函数：
        </p>

        <FormulaCard
          title="GLM 预测函数"
          formula={
            <KaTeX
              math={String.raw`h(x) = \mathbb{E}[T(y) \mid x; \theta] = g(\theta^T x)`}
              display
            />
          }
          description={
            <>
              其中 <KaTeX math={String.raw`g(\eta) = a'(\eta)`} /> 称为<strong>响应函数</strong>（response function），
              它的反函数 <KaTeX math={String.raw`g^{-1}`} /> 称为<strong>连接函数</strong>（link function）。
            </>
          }
        />

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">响应函数 g</h3>
            <p className="text-sm text-gray-700">
              把自然参数 η 映射为预测目标 <KaTeX math={String.raw`\mathbb{E}[T(y)]`} />。
              例如 Sigmoid、恒等函数、softmax。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">连接函数 g⁻¹</h3>
            <p className="text-sm text-gray-700">
              把预测目标映射回自然参数 η。例如 logit 函数 <KaTeX math={String.raw`\log\frac{\phi}{1-\phi}`} /> 是 Sigmoid 的反函数。
            </p>
          </div>
        </div>
      </section>

      {/* Learning objective */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">参数估计：最大似然</h2>
        <p className="text-gray-700 mb-4">
          GLM 的参数通常通过最大似然估计得到。给定 m 个独立同分布的训练样本，对数似然为：
        </p>

        <FormulaCard
          title="GLM 的对数似然"
          formula={
            <KaTeX
              math={String.raw`\ell(\theta) = \sum_{i=1}^{m} \log p\bigl(y^{(i)} \mid x^{(i)}; \theta\bigr)`}
              display
            />
          }
          description="对于指数族分布，这个对数似然通常是凹函数，可以用梯度上升或牛顿法求解。"
        />

        <p className="text-gray-700 mb-4">梯度为：</p>

        <FormulaCard
          title="GLM 的梯度"
          formula={
            <KaTeX
              math={String.raw`\nabla_\theta \ell(\theta) = \sum_{i=1}^{m} \bigl(y^{(i)} - h_\theta(x^{(i)})\bigr) x^{(i)}`}
              display
            />
          }
          description="这个形式与逻辑回归完全一致！这也是 GLM 统一框架的美妙之处。"
        />
      </section>

      {/* Design recipe */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">GLM 设计 recipe</h2>
        <p className="text-gray-700 mb-4">
          当你遇到一个新的监督学习问题时，可以按下面步骤选择 GLM：
        </p>

        <div className="space-y-3">
          <RecipeStep number={1} text="确定响应变量 y 的类型：连续值、二分类、多分类、计数等。" />
          <RecipeStep number={2} text="为 y 选择合适的指数族分布：高斯、伯努利、多项、泊松等。" />
          <RecipeStep number={3} text="根据分布确定响应函数 g 和连接函数 g⁻¹。" />
          <RecipeStep number={4} text="假设 η = θᵀx，写出预测函数 h(x) = g(θᵀx)。" />
          <RecipeStep number={5} text="用最大似然估计或梯度法求解参数 θ。" />
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>GLM 的三个假设把分布选择、预测目标和线性建模联系在一起。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>响应函数 g 是对数配分函数 a(η) 的导数。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">●</span>
            <span>最大似然估计的梯度形式统一为 (y − h)x，便于统一实现和理解。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function AssumptionCard({ number, title, content }: { number: number; title: string; content: ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
        <p className="text-gray-700 mt-1 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function RecipeStep({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
        {number}
      </div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
