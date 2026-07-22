import SectionMetadata from '@/components/SectionMetadata';
import { ShieldAlert, BookOpen, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          正则化与模型选择
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">正则化与模型选择</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          正则化是控制模型复杂度、防止过拟合的核心技术；模型选择帮助我们在偏差与方差之间找到最佳平衡。
          本章还将介绍优化器带来的隐式正则化，以及贝叶斯视角下的正则化解释。
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
            <h3 className="font-semibold text-blue-800 mb-2">正则化</h3>
            <p className="text-sm text-gray-700">
              在损失函数中加入正则项，通过 L2（权重衰减）、L1（稀疏性）等方式控制模型复杂度。
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">隐式正则化</h3>
            <p className="text-sm text-gray-700">
              优化器、学习率、批量大小等训练超参数本身也会影响模型找到的解，带来隐式偏好。
            </p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">交叉验证</h3>
            <p className="text-sm text-gray-700">
              用留出法、k 折交叉验证和留一法估计泛化误差，选择最佳模型复杂度。
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">贝叶斯视角</h3>
            <p className="text-sm text-gray-700">
              从先验分布到 MAP 估计，理解 L2 正则化等价于高斯先验。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心思想</h2>
        <FormulaCard
          title="正则化损失函数"
          formula={
            <KaTeX
              math={String.raw`J_{\text{reg}}(\theta) = J(\theta) + \lambda R(\theta)`}
              display
            />
          }
          description="通过正则项 R(θ) 惩罚复杂模型，λ 控制拟合数据与控制复杂度之间的权衡。"
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
            <span>正则化通过惩罚模型复杂度来缓解过拟合。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>训练过程中的优化器选择也会带来隐式正则化效应。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>交叉验证提供了一种数据驱动的模型选择方法。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>从贝叶斯角度看，正则化等价于对参数引入先验分布。</span>
          </li>
        </ul>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 9"}
        bishopSection={"9.1"}
        learningObjectives={["理解 Overview 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
              />
</div>
  );
}
