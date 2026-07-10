import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowDownCircle } from 'lucide-react';

export default function Ch04GradientDescentOptimizationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/gradient-descent-optimization"
      heroIcon={<ArrowDownCircle className="w-9 h-9 text-blue-600" />}
      summary={"梯度下降通过沿负梯度方向更新参数来降低损失；不同变体在数据使用方式、计算成本与收敛稳定性之间取舍。"}
      concepts={[
    {
      title: "批量梯度下降",
      description: "每次更新使用全部训练数据，梯度精确但单步计算昂贵。",
      formula: String.raw`w^{(\tau+1)} = w^{(\tau)} - \eta \nabla E(w^{(\tau)})`,
    },
    {
      title: "随机梯度下降",
      description: "每次仅用一个样本估计梯度，噪声大但逃离局部极小值能力强。",
    },
    {
      title: "小批量梯度下降",
      description: "折中方案，利用矩阵运算效率并降低梯度方差，是深度学习中最常用的形式。",
    },
      
    {
      title: "Use of gradient information",
      description: "介绍 Use of gradient information 的定义、关键公式与典型应用场景。",
    },
    {
      title: "Batch gradient descent",
      description: "介绍 Batch gradient descent 的定义、关键公式与典型应用场景。",
    },
  ]}
      learningObjectives={[
      "理解 批量梯度下降 的含义与作用。",
      "理解 随机梯度下降 的含义与作用。",
      "理解 小批量梯度下降 的含义与作用。"
    ]}
      coreIntuition={"梯度下降通过沿负梯度方向更新参数来降低损失；不同变体在数据使用方式、计算成本与收敛稳定性之间取舍。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“批量梯度下降”的叙述，哪一项最准确？",
        options: ["每次更新使用全部训练数据，梯度精确但单步计算昂贵。", "批量梯度下降 只是术语，没有独立建模意义。", "批量梯度下降 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。每次更新使用全部训练数据，梯度精确但单步计算昂贵。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“随机梯度下降”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。随机梯度下降 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“小批量梯度下降”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。小批量梯度下降 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "7.2",
      pages: "Ch 7",
      textbookSubsections: [
          "7.2 Gradient Descent Optimization",
          "7.2.1 Use of gradient information",
          "7.2.2 Batch gradient descent",
          "7.2.3 Stochastic gradient descent",
          "7.2.4 Mini-batches",
          "7.2.5 Parameter initialization"
        ],
      formulas: ["批量梯度下降公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}
          demo={{
      title: "梯度下降单步损失下降",
      label: "当前参数 w",
      param: 2,
      min: -3,
      max: 3,
      step: 0.1,
      compute: (w) => ({
        label: 'E(w)=w²',
        value: w * w,
        display: String.raw`E(${w.toFixed(1)})=${(w * w).toFixed(2)}`,
      }),
      formula: String.raw`E(w) = w^2`,
    }}
    />
  );
}
