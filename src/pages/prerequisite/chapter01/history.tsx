import SectionMetadata from '@/components/SectionMetadata';
import {
  History,
  Cpu,
  GitBranch,
  Layers,
  TrendingUp,
  Globe,
  ShieldAlert,
  BookOpen,
  Lightbulb,
  Brain,
} from 'lucide-react';
import KaTeX from '../../../components/KaTeX';
import FormulaCard from '../../../components/FormulaCard';
import ConceptCard from '../../../components/ConceptCard';

const milestones = [
  {
    year: '1943–1958',
    title: '神经网络的黎明与感知机',
    icon: <Cpu className="w-5 h-5" />,
    description:
      'McCulloch 与 Pitts 提出神经元数学模型；Rosenblatt 的感知机（Perceptron）证明线性可分问题可以通过简单学习规则求解，开启了对“学习机器”的系统研究。',
  },
  {
    year: '1960–1986',
    title: '低谷、理论与反向传播',
    icon: <GitBranch className="w-5 h-5" />,
    description:
      'Minsky 与 Papert 指出单层感知机的局限；多层网络与反向传播算法（Backpropagation）的出现让人们能够训练具有隐藏层的网络，为深度学习奠定算法基础。',
  },
  {
    year: '2006–2012',
    title: '深度网络的复兴',
    icon: <Layers className="w-5 h-5" />,
    description:
      'Hinton 等人通过逐层预训练（如 RBM、自编码器）让深层网络可训练；ImageNet 2012 上 AlexNet 的巨大成功标志着深度学习在计算机视觉中的爆发。',
  },
  {
    year: '2012–2020',
    title: '规模化与通用表示',
    icon: <TrendingUp className="w-5 h-5" />,
    description:
      '更大的数据集、更深的网络、更强的算力推动性能持续提升。ResNet、Transformer、BERT、GPT 等架构相继出现，预训练 + 微调成为主流范式。',
  },
  {
    year: '2020–至今',
    title: '基础模型时代',
    icon: <Globe className="w-5 h-5" />,
    description:
      '大语言模型、多模态模型与科学基础模型展现出惊人的涌现能力。深度学习的关注点从单一任务转向通用智能、可解释性与安全对齐。',
  },
];

export default function PrerequisiteChapter01HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
            <History className="w-9 h-9 text-amber-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">1.3 机器学习简史</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          从早期感知机到现代基础模型，机器学习经历了多次起伏。理解这段历史，
          有助于我们看清当前技术的发展脉络与未来方向。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          仅供教学与非商业学习使用。
        </p>
      </section>

      {/* Timeline */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">发展历程</h2>
        </div>

        <div className="relative border-l-2 border-amber-200 ml-3 space-y-10">
          {milestones.map((item) => (
            <div key={item.year} className="relative pl-10">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm" />
              <div className="text-sm font-bold text-amber-700 mb-1">{item.year}</div>
              <ConceptCard icon={item.icon} title={item.title} description={item.description} />
            </div>
          ))}
        </div>
      </section>

      {/* Key ideas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">贯穿始终的核心思想</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <ConceptCard
            icon={<Brain className="w-5 h-5" />}
            title="从数据中自动学习"
            description="与其手写规则，不如让模型从大量样本中自动发现规律。这一思想是机器学习区别于传统编程的本质特征。"
          />
          <ConceptCard
            icon={<Layers className="w-5 h-5" />}
            title="层次化表示"
            description="深度网络通过多层非线性变换，逐步从原始像素、字符或信号中提取越来越抽象的特征表示。"
          />
          <ConceptCard
            icon={<GitBranch className="w-5 h-5" />}
            title="端到端梯度学习"
            description="反向传播让复杂网络中的所有参数都可以根据最终误差进行联合优化，实现端到端的学习。"
          />
          <ConceptCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="规模即能力"
            description="当模型、数据与计算规模同时扩大时，深度学习往往能展现出定性上的新能力，这一规律被称为规模法则。"
          />
        </div>
      </section>

      {/* Perceptron formula */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">感知机：起点</h2>
        </div>
        <p className="text-gray-700 mb-5">
          感知机是最简单的可学习神经元模型之一。它计算输入的加权和，并通过阶跃函数输出类别标签。
          虽然它只能解决线性可分问题，但它奠定了现代神经网络的基本计算单元。
        </p>
        <FormulaCard
          title="感知机输出"
          formula={
            <KaTeX
              math={String.raw`y(x) = f\left(\sum_{j=1}^{D} w_j x_j + b\right)`}
              display
            />
          }
          description={
            <span>
              其中 <KaTeX math={String.raw`f`} /> 是激活函数，
              <KaTeX math={String.raw`w_j`} /> 是权重，<KaTeX math={String.raw`b`} /> 是偏置。
            </span>
          }
        />
      </section>

      {/* Future outlook */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">展望未来</h2>
        </div>
        <p className="text-gray-700 mb-4">
          今天的深度学习仍在快速发展：可解释性、鲁棒性、效率、隐私保护与可控生成成为新的研究前沿。
          无论未来架构如何变化，概率建模、优化、表示学习与泛化理论始终是理解这些系统的基石。
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard
            icon={<Brain className="w-5 h-5" />}
            title="更可靠的模型"
            description="提升可解释性、校准不确定性与对抗鲁棒性。"
          />
          <ConceptCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="更高效的训练"
            description="降低计算与能耗成本，让小团队也能使用大模型。"
          />
          <ConceptCard
            icon={<Globe className="w-5 h-5" />}
            title="更广泛的应用"
            description="推动科学研究、教育、医疗与可持续发展。"
          />
        </div>
      </section>
    
      <SectionMetadata
        bishopChapter={"Ch 1"}
        bishopSection={"history"}
        learningObjectives={["理解 History 的核心概念与直观含义。", "掌握与本小节相关的关键公式与算法流程。", "能够在简单示例中应用所学方法并识别常见误区。"]}
        commonMistakes={["只记忆公式而忽略其背后的概率或优化假设。", "混淆相近概念的定义与适用场景。", "在应用时忽视数据分布与模型假设的匹配。"]}
        quiz={[
      {
        question: "关于“History”，下列说法最准确的是？",
        options: ["它是本小节需要掌握的核心主题。", "它与当前章节完全无关。", "它只适用于无限大数据集。", "它不需要任何数学基础。"],
        correctIndex: 0,
        explanation: "History 是本小节的核心内容，理解其动机、公式与应用场景是学习目标。",
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
