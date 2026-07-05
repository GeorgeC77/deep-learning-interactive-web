import SectionMetadata from '@/components/SectionMetadata';
import { Link } from 'react-router-dom';
import { BookOpen, Activity, Brain, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';

const sections = [
  { label: '1.1 深度学习的影响', path: '/prerequisite/ch01/impact', desc: '医疗、蛋白质、图像合成、大语言模型' },
  { label: '1.2 Tutorial：多项式曲线拟合', path: '/prerequisite/ch01/tutorial', desc: '合成数据、误差函数、正则化与模型选择' },
  { label: '1.3 机器学习简史', path: '/prerequisite/ch01/history', desc: '单层网络、反向传播与深度网络' },
];

export default function PrerequisiteChapter01OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">先修 Ch 1. 深度学习革命</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          深度学习正在改变科学、工程与日常生活的方方面面。本章先建立对深度学习的整体认知，
          并通过经典的多项式曲线拟合示例，引出模型、误差、复杂度与正则化等核心概念。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          仅供教学与非商业学习使用。
        </p>
      </section>

      {/* Why it matters */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">为什么先学这一章？</h2>
        </div>
        <p className="text-gray-700 mb-4">
          在进入数学与算法细节之前，我们需要回答一个更根本的问题：<strong>深度学习为什么有效？</strong>
          它并不是某个特定技巧，而是一种基于数据、可扩展的通用学习框架。同样的神经网络架构，
          稍加改造就能处理图像、文本、分子结构甚至控制系统。
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <ConceptCard
            icon={<Brain className="w-5 h-5" />}
            title="表示学习"
            description="深度网络自动学习数据的层次化表示，把原始输入转化为更易解决任务的特征。"
          />
          <ConceptCard
            icon={<Activity className="w-5 h-5" />}
            title="规模的力量"
            description="更大的数据、更大的模型、更多的算力，往往能带来性能的质的提升，这一现象被称为规模法则。"
          />
        </div>
      </section>

      {/* Core concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Tutorial 示例中的关键概念</h2>
        </div>
        <p className="text-gray-700 mb-6">
          1.2 节用一个简单的正弦曲线加噪声问题，演示了机器学习的完整流程：
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <FormulaCard
            title="模型"
            formula={String.raw`y(x, w) = \sum_{j=0}^{M} w_j x^j`}
            description="用多项式函数拟合数据，M 控制模型复杂度。"
          />
          <FormulaCard
            title="误差函数"
            formula={String.raw`E(w) = \frac{1}{2}\sum_{n=1}^{N}\{y(x_n,w)-t_n\}^2`}
            description="衡量预测与真实目标之间的差距。"
          />
          <FormulaCard
            title="正则化"
            formula={String.raw`\tilde{E}(w) = E(w) + \frac{\lambda}{2}\|w\|^2`}
            description="通过惩罚大系数来缓解过拟合。"
          />
        </div>
      </section>

      {/* Section roadmap */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">本章内容</h2>
        <div className="space-y-3">
          {sections.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{s.label}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* Next chapter */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">下一章</h3>
        <p className="text-blue-800 text-sm mb-4">
          理解深度学习需要概率论作为语言。下一章将介绍和规则、积规则、贝叶斯定理、高斯分布与信息论。
        </p>
        <Link
          to="/prerequisite/ch02/overview"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          进入 先修 Ch 2：概率论
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 1"}
        bishopSection={"overview"}
        learningObjectives={["理解 Overview 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“Overview”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "Overview 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
      },
      {
        question: "学习本小节时，最重要的提醒是什么？",
        options: ["只看结论，忽略推导。", "理解概念背后的直觉与假设。", "直接套用代码，不必关心理论。", "只记忆英文术语。"],
        correctIndex: 1,
        explanation: "理解直觉和假设有助于在遇到新问题时正确选择与扩展方法。",
      }
        ]}
      />
</div>
  );
}
