import SectionMetadata from '@/components/SectionMetadata';
import { Link } from 'react-router-dom';
import { BookOpen, Dice5, ChartSpline, Layers, ArrowRight, ShieldAlert } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';

const sections = [
  { label: '3.1 离散变量', path: '/prerequisite/ch03/discrete', desc: 'Bernoulli、Binomial、Multinomial' },
  { label: '3.2 多元高斯', path: '/prerequisite/ch03/mvgaussian', desc: '几何、条件分布、边缘分布' },
  { label: '3.3 指数族', path: '/prerequisite/ch03/exponential', desc: '统一形式与充分统计量' },
  { label: '3.4 非参数方法', path: '/prerequisite/ch03/nonparametric', desc: '直方图、核密度、最近邻' },
];

export default function PrerequisiteChapter03OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Dice5 className="w-9 h-9 text-emerald-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">先修 Ch 3. 标准分布</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          标准分布是构建概率模型的积木。本章介绍离散分布、高斯分布、指数族与非参数方法，
          为后续理解线性回归、分类、聚类与生成模型做好准备。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          仅供教学与非商业学习使用。
        </p>
      </section>

      {/* Distribution families */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">分布的三大类别</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard
            icon={<Dice5 className="w-5 h-5" />}
            title="离散分布"
            description="描述取有限或可数多个值的随机变量，如 Bernoulli、二项、多项分布。"
          />
          <ConceptCard
            icon={<ChartSpline className="w-5 h-5" />}
            title="连续分布"
            description="高斯分布是其中最常用的，具有良好的解析性质和中心极限定理支持。"
          />
          <ConceptCard
            icon={<Layers className="w-5 h-5" />}
            title="非参数方法"
            description="不假设固定的参数化形式，让数据自己决定分布形状，如核密度估计。"
          />
        </div>
      </section>

      {/* Exponential family */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">指数族：统一框架</h2>
        </div>
        <FormulaCard
          title="指数族分布"
          formula={String.raw`p(x \mid \eta) = h(x) g(\eta) \exp\{\eta^T u(x)\}`}
          description="许多常见分布（高斯、伯努利、多项、泊松）都可写成这一统一形式，u(x) 称为充分统计量。"
        />
        <p className="text-gray-700 mt-4">
          指数族的重要性在于它把看似不同的分布纳入同一数学框架。后续学习广义线性模型（GLM）时，
          我们会发现：选择不同的指数族分布，就能导出线性回归、逻辑回归、Softmax 回归等不同算法。
        </p>
      </section>

      {/* Section roadmap */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">本章内容</h2>
        <div className="space-y-3">
          {sections.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{s.label}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* Next chapter */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
        <h3 className="text-lg font-bold text-emerald-900 mb-3">进入正式课程</h3>
        <p className="text-emerald-800 text-sm mb-4">
          先修知识已经铺垫完毕。接下来从第 4 章开始，把线性回归重新理解为最简单的单层神经网络。
        </p>
        <Link
          to="/ch01/overview"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          进入 Ch 1：单层网络 · 回归
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 3"}
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
