import BishopSectionPage from '@/components/BishopSectionPage';
import { Waves } from 'lucide-react';

export default function Ch15ContinuousFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/continuous-flows"
      heroIcon={<Waves className="w-9 h-9 text-blue-600" />}
      summary={"连续流将变换视为由神经网络定义的常微分方程，用 ODE 求解器前向与反向传播，实现任意精度的可逆变换。"}
      concepts={[
    {
      title: "神经 ODE",
      description: "隐藏状态随连续时间演化，由神经网络参数化的导数驱动。",
      formula: String.raw`\frac{dh(t)}{dt} = f(h(t), t, \theta)`,
    },
    {
      title: "伴随敏感性",
      description: "通过求解增广 ODE 反向传播梯度，避免存储中间状态。",
    },
    {
      title: "FFJORD",
      description: "用随机迹估计替代精确 Jacobian，扩展连续流到高维数据。",
    }
      ]}
      learningObjectives={[
      "理解 神经 ODE 的含义与作用。",
      "理解 伴随敏感性 的含义与作用。",
      "理解 FFJORD 的含义与作用。"
    ]}
      coreIntuition={"连续流将变换视为由神经网络定义的常微分方程，用 ODE 求解器前向与反向传播，实现任意精度的可逆变换。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“神经 ODE”的叙述，哪一项最准确？",
        options: ["隐藏状态随连续时间演化，由神经网络参数化的导数驱动。", "神经 ODE 与本节讨论的问题完全无关。", "神经 ODE 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。隐藏状态随连续时间演化，由神经网络参数化的导数驱动。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“伴随敏感性”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。伴随敏感性 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“FFJORD”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。FFJORD 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 18",
      section: "18.3",
      pages: "Ch 18",
      textbookSubsections: ["18.3.1 神经 ODE", "18.3.2 伴随敏感性", "18.3.3 FFJORD"],
      formulas: ["神经 ODE公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
