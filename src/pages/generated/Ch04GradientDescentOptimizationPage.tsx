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
