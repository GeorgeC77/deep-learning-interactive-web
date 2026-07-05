import SectionMetadata from '@/components/SectionMetadata';
import { Link } from 'react-router-dom';
import { BookOpen, Scale, Calculator, ArrowRight, ShieldAlert } from 'lucide-react';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';

const sections = [
  { label: '2.1 概率规则', path: '/prerequisite/ch02/rules', desc: '和规则、积规则、贝叶斯定理' },
  { label: '2.2 概率密度', path: '/prerequisite/ch02/densities', desc: '连续随机变量、期望与协方差' },
  { label: '2.3 高斯分布', path: '/prerequisite/ch02/gaussian', desc: '均值、方差、最大似然与线性回归' },
  { label: '2.4 信息论', path: '/prerequisite/ch02/information', desc: '熵、KL 散度、互信息' },
  { label: '2.5 贝叶斯概率', path: '/prerequisite/ch02/bayesian', desc: '参数、正则化与贝叶斯机器学习' },
];

export default function PrerequisiteChapter02OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
            <Scale className="w-9 h-9 text-violet-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">先修 Ch 2. 概率论</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          机器学习无处不在地处理不确定性。概率论提供了一套一致的数学语言，用于量化并操纵不确定性，
          是理解现代深度学习模型与决策理论的基石。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          仅供教学与非商业学习使用。
        </p>
      </section>

      {/* Two kinds of uncertainty */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">两种不确定性</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            icon={<Scale className="w-5 h-5" />}
            title="认知不确定性（Epistemic）"
            description="源于数据有限。随着观测样本增多，这种不确定性可以降低。"
          />
          <ConceptCard
            icon={<Calculator className="w-5 h-5" />}
            title="偶然不确定性（Aleatoric）"
            description="源于系统内在的随机性或我们只能观测到部分信息。即使无限数据也无法完全消除。"
          />
        </div>
      </section>

      {/* Core rules */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">概率的两条基本规则</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormulaCard
            title="和规则（Sum Rule）"
            formula={String.raw`p(X) = \sum_Y p(X, Y)`}
            description="边缘概率由联合概率求和得到。"
          />
          <FormulaCard
            title="积规则（Product Rule）"
            formula={String.raw`p(X, Y) = p(Y|X)p(X)`}
            description="联合概率可分解为条件概率与边缘概率的乘积。"
          />
        </div>
        <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
          <p className="text-violet-900 text-sm">
            <strong>贝叶斯定理</strong>是积规则与和规则直接导出的结果，它告诉我们如何在观测到新数据后更新信念：
          </p>
          <div className="text-center text-lg my-3">
            <span className="font-mono text-violet-900">p(假设 | 数据) ∝ p(数据 | 假设) · p(假设)</span>
          </div>
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
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors">{s.label}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* Next chapter */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-6">
        <h3 className="text-lg font-bold text-violet-900 mb-3">下一章</h3>
        <p className="text-violet-800 text-sm mb-4">
          概率规则与具体分布结合，才能解决实际问题。下一章将介绍 Bernoulli、高斯、指数族等标准分布。
        </p>
        <Link
          to="/prerequisite/ch03/overview"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          进入 先修 Ch 3：标准分布
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 2"}
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
