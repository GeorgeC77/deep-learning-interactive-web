import BishopSectionPage from '@/components/BishopSectionPage';
import { Mountain } from 'lucide-react';

export default function Ch04ErrorSurfacesPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/error-surfaces"
      heroIcon={<Mountain className="w-9 h-9 text-blue-600" />}
      summary={"误差曲面在极小值附近可用二次型近似；Hessian 矩阵的特征值与特征向量揭示了参数空间的曲率方向。"}
      concepts={[
    {
      title: "局部二次近似",
      description: "在驻点 w* 附近，损失变化由 Hessian 矩阵决定。",
      formula: String.raw`E(w) \approx E(w^*) + \frac{1}{2}(w-w^*)^{\!T} H (w-w^*)`,
    },
    {
      title: "Hessian 与曲率",
      description: "Hessian 特征值大的方向曲率大，小学习率易在这些方向发散。",
    },
    {
      title: "鞍点与 plateau",
      description: "高维空间中鞍点比局部极小值更常见，优化算法需要具备逃离鞍点的能力。",
    }
      ]}
      learningObjectives={[
      "理解 局部二次近似 的含义与作用。",
      "理解 Hessian 与曲率 的含义与作用。",
      "理解 鞍点与 plateau 的含义与作用。"
    ]}
      coreIntuition={"误差曲面在极小值附近可用二次型近似；Hessian 矩阵的特征值与特征向量揭示了参数空间的曲率方向。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“局部二次近似”，下列说法是否正确？",
        options: ["在驻点 w* 附近，损失变化由 Hessian 矩阵决定。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。在驻点 w* 附近，损失变化由 Hessian 矩阵决定。",
      },
      {
        question: "关于“Hessian 与曲率”，下列说法是否正确？",
        options: ["Hessian 特征值大的方向曲率大，小学习率易在这些方向发散。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。Hessian 特征值大的方向曲率大，小学习率易在这些方向发散。",
      },
      {
        question: "关于“鞍点与 plateau”，下列说法是否正确？",
        options: ["高维空间中鞍点比局部极小值更常见，优化算法需要具备逃离鞍点的能力。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。高维空间中鞍点比局部极小值更常见，优化算法需要具备逃离鞍点的能力。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "",
      pages: "",
    }}
          demo={{
      title: "二次损失随曲率变化",
      label: "Hessian 特征值 λ",
      param: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      compute: (lambda) => ({
        label: '最稳学习率',
        value: 2 / lambda,
        display: String.raw`\eta_{\max}=2/${lambda.toFixed(1)}=${(2 / lambda).toFixed(2)}`,
      }),
      formula: String.raw`\eta_{\max} = \frac{2}{\lambda}`,
    }}
    />
  );
}
