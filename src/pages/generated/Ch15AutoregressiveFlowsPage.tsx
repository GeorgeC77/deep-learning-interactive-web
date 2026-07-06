import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowRight } from 'lucide-react';

export default function Ch15AutoregressiveFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/autoregressive-flows"
      heroIcon={<ArrowRight className="w-9 h-9 text-blue-600" />}
      summary={"自回归流按顺序对每个维度做条件变换，天然具有三角 Jacobian，是 MAF 与 IAF 等模型的基础。"}
      concepts={[
    {
      title: "自回归分解",
      description: "联合分布分解为各维度的条件分布乘积。",
      formula: String.raw`p(x) = \prod_{i} p(x_i \mid x_{<i})`,
    },
    {
      title: "MAF 与 IAF",
      description: "MAF 便于密度估计，IAF 便于快速采样，两者在自回归方向上互补。",
    },
    {
      title: " masked 自回归网络",
      description: "通过掩码保证每个输出只依赖前面维度，维持自回归结构。",
    }
      ]}
      learningObjectives={[
      "理解 自回归分解 的含义与作用。",
      "理解 MAF 与 IAF 的含义与作用。",
      "理解  masked 自回归网络 的含义与作用。"
    ]}
      coreIntuition={"自回归流按顺序对每个维度做条件变换，天然具有三角 Jacobian，是 MAF 与 IAF 等模型的基础。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“自回归分解”的叙述，哪一项最准确？",
        options: ["联合分布分解为各维度的条件分布乘积。", "自回归分解 与本节讨论的问题完全无关。", "自回归分解 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。联合分布分解为各维度的条件分布乘积。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“MAF 与 IAF”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。MAF 与 IAF 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“ masked 自回归网络”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。 masked 自回归网络 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 18",
      section: "18.2",
      pages: "Ch 18",
      textbookSubsections: ["18.2.1 自回归分解", "18.2.2 MAF 与 IAF", "18.2.3  masked 自回归网络"],
      formulas: ["自回归分解公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
