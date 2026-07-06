import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowLeftRight } from 'lucide-react';

export default function Ch15OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/overview"
      heroIcon={<ArrowLeftRight className="w-9 h-9 text-blue-600" />}
      summary={"归一化流（Normalizing Flows）通过可逆神经网络将简单分布变换为复杂分布，同时保持精确的似然计算。"}
      concepts={[
    {
      title: "可逆变换",
      description: "每一层都是双射，使得采样与密度评估都能高效进行。",
    },
    {
      title: "变量替换公式",
      description: "对数密度随 Jacobian 行列式变化，保证归一化。",
      formula: String.raw`\ln p_x(x) = \ln p_z(z) - \ln \left| \det \frac{\partial f}{\partial z} \right|`,
    },
    {
      title: "流架构",
      description: "耦合流、自回归流与连续流在表达能力与计算成本之间各有取舍。",
    }
      ]}
      learningObjectives={[
      "理解 可逆变换 的含义与作用。",
      "理解 变量替换公式 的含义与作用。",
      "理解 流架构 的含义与作用。"
    ]}
      coreIntuition={"归一化流（Normalizing Flows）通过可逆神经网络将简单分布变换为复杂分布，同时保持精确的似然计算。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“可逆变换”的叙述，哪一项最准确？",
        options: ["每一层都是双射，使得采样与密度评估都能高效进行。", "可逆变换 与本节讨论的问题完全无关。", "可逆变换 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。每一层都是双射，使得采样与密度评估都能高效进行。 这体现了本节的核心思想。",
      },
      {
        question: "在“变量替换公式”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。变量替换公式 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“流架构”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。流架构 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 18",
      pages: "Ch 18",
      textbookSubsections: ["可逆变换", "变量替换公式", "流架构"],
      formulas: ["变量替换公式公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
