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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“局部二次近似”的叙述，哪一项最准确？",
        options: ["在驻点 w* 附近，损失变化由 Hessian 矩阵决定。", "局部二次近似 只是术语，没有独立建模意义。", "局部二次近似 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。在驻点 w* 附近，损失变化由 Hessian 矩阵决定。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“Hessian 与曲率”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。Hessian 与曲率 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“鞍点与 plateau”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。鞍点与 plateau 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "7.1",
      pages: "Ch 7",
      textbookSubsections: [
          "7.1 Error Surfaces",
          "7.1.1 Local quadratic approximation"
        ],
      formulas: ["局部二次近似公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
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
