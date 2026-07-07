import BishopSectionPage from '@/components/BishopSectionPage';
import { Compass } from 'lucide-react';

export default function Ch06InductiveBiasPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/inductive-bias"
      heroIcon={<Compass className="w-9 h-9 text-blue-600" />}
      summary={"归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。"}
      concepts={[
    {
      title: "逆问题与欠定性",
      description: "训练数据通常无法唯一确定模型，需要偏置选择可泛化解。",
    },
    {
      title: "无免费午餐定理",
      description: "没有通用学习器能在所有任务上同时最优，偏置必须匹配任务结构。",
    },
    {
      title: "对称性、不变性与等变性",
      description: "卷积的平移等变性、池化的平移不变性都是结构化偏置的成功例子。",
    }
      ]}
      learningObjectives={[
      "理解 逆问题与欠定性 的含义与作用。",
      "理解 无免费午餐定理 的含义与作用。",
      "理解 对称性、不变性与等变性 的含义与作用。"
    ]}
      coreIntuition={"归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“逆问题与欠定性”的叙述，哪一项最准确？",
        options: ["训练数据通常无法唯一确定模型，需要偏置选择可泛化解。", "逆问题与欠定性 只是术语，没有独立建模意义。", "逆问题与欠定性 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。训练数据通常无法唯一确定模型，需要偏置选择可泛化解。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“无免费午餐定理”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。无免费午餐定理 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“对称性、不变性与等变性”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。对称性、不变性与等变性 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "9.1",
      pages: "Ch 9",
      textbookSubsections: ["9.1.1 逆问题与欠定性", "9.1.2 无免费午餐定理", "9.1.3 对称性、不变性与等变性"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}

    />
  );
}
