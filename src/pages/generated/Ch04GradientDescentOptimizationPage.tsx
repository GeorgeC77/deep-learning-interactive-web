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
    }
      ]}
      learningObjectives={[
      "理解 批量梯度下降 的含义与作用。",
      "理解 随机梯度下降 的含义与作用。",
      "理解 小批量梯度下降 的含义与作用。"
    ]}
      coreIntuition={"梯度下降通过沿负梯度方向更新参数来降低损失；不同变体在数据使用方式、计算成本与收敛稳定性之间取舍。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“批量梯度下降”，下列说法是否正确？",
        options: ["每次更新使用全部训练数据，梯度精确但单步计算昂贵。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。每次更新使用全部训练数据，梯度精确但单步计算昂贵。",
      },
      {
        question: "关于“随机梯度下降”，下列说法是否正确？",
        options: ["每次仅用一个样本估计梯度，噪声大但逃离局部极小值能力强。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。每次仅用一个样本估计梯度，噪声大但逃离局部极小值能力强。",
      },
      {
        question: "关于“小批量梯度下降”，下列说法是否正确？",
        options: ["折中方案，利用矩阵运算效率并降低梯度方差，是深度学习中最常用的形式。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。折中方案，利用矩阵运算效率并降低梯度方差，是深度学习中最常用的形式。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "",
      pages: "",
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
