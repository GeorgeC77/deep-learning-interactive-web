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
          title: "参数初始化",
          description: "合适的初始化能打破对称性并保持前向激活与反向梯度的尺度稳定；过大或过小都会导致梯度消失或爆炸。",
        },
      ]}
      learningObjectives={[
        "理解批量、随机、小批量梯度下降的差异与适用场景。",
        "能解释为什么参数初始化对深度网络训练至关重要。",
      ]}
      coreIntuition={"梯度下降通过沿负梯度方向更新参数来降低损失；不同变体在数据使用方式、计算成本与收敛稳定性之间取舍。"}
      commonMistakes={[
        "认为批量梯度下降总是最稳定的——单步计算昂贵且容易陷入局部极小值。",
        "认为随机梯度下降噪声大就不好——噪声有时能帮助逃离局部极小值。",
        "忽视参数初始化对深度网络的影响——不当初始化会导致梯度消失或爆炸。",
      ]}
      whyCards={[
        {
          question: "为什么小批量梯度下降最常用？",
          answer: "它比单样本梯度下降更稳定，比批量梯度下降更快，还能利用 GPU 的矩阵运算效率。",
        },
        {
          question: "为什么参数初始化不能全为零？",
          answer: "所有权重相同时，所有隐藏单元输出完全相同，反向传播梯度也相同，网络无法学习不同的特征。",
        },
      ]}
      counterexamples={[
        "用批量梯度下降训练深度网络，虽然每步方向精确，但容易陷入局部极小值且单步计算极慢——说明精确并不等于高效。",
        "把深度网络所有权重初始化为零，所有隐藏单元永远输出相同值——说明初始化是训练的前提。",
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
        exercises: ["比较批量、随机、小批量梯度下降在二次损失上的收敛轨迹。", "讨论 Xavier/He 初始化的设计动机。"]
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
