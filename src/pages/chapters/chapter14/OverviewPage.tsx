import { ShieldAlert, BookOpen, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十四章 · 自监督学习与基础模型
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">自监督学习与基础模型</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          本章介绍基础模型与自监督学习的核心思想：预训练 + 适配。我们将分别讨论视觉中的对比学习，
          以及自然语言处理中的自回归语言模型。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">本章内容</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">14.1 预训练与适配</h3>
            <p className="text-sm text-gray-700">基础模型范式、线性探测、微调、零样本与少样本学习。</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">14.2 计算机视觉中的预训练</h3>
            <p className="text-sm text-gray-700">监督预训练与对比学习，含 SIMCLR 损失。</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">14.3 预训练大语言模型</h3>
            <p className="text-sm text-gray-700">自回归 Transformer、交叉熵损失、温度采样与上下文学习。</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">核心思想</h2>
        <FormulaCard
          title="预训练 + 适配"
          formula={
            <KaTeX
              math={String.raw`L_{\text{pre}}(\theta) = \frac{1}{n}\sum_{i=1}^n \ell_{\text{pre}}(\theta, x^{(i)})`}
              display
            />
          }
          description="先在大规模无标注数据上最小化自监督损失，再在下游任务上微调或接一个线性头。"
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
            <span>基础模型通过预训练获得通用表示，再适配到下游任务。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>视觉中常用监督预训练或对比学习。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>语言模型通过 next-token 预测进行自回归预训练。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
