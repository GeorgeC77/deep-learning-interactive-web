import BishopSectionPage from '@/components/BishopSectionPage';
import { Clock } from 'lucide-react';

export default function Ch08SequenceModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/sequence-models"
      heroIcon={<Clock className="w-9 h-9 text-blue-600" />}
      summary={"序列模型捕捉时间或顺序上的依赖；隐马尔可夫模型与线性动态系统是经典代表，现代则由 RNN 与 Transformer 扩展。"}
      concepts={[
    {
      title: "马尔可夫假设",
      description: "当前状态仅依赖有限历史，使建模与推断大大简化。",
    },
    {
      title: "隐变量",
      description: "隐状态 summarises 过去信息，用于预测未来观测。",
    },
    {
      title: "前向-后向算法",
      description: "利用动态规划高效计算隐状态后验与模型似然。",
    }
      ]}
      learningObjectives={[
      "理解 马尔可夫假设 的含义与作用。",
      "理解 隐变量 的含义与作用。",
      "理解 前向-后向算法 的含义与作用。"
    ]}
      coreIntuition={"序列模型捕捉时间或顺序上的依赖；隐马尔可夫模型与线性动态系统是经典代表，现代则由 RNN 与 Transformer 扩展。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“马尔可夫假设”的叙述，哪一项最准确？",
        options: ["当前状态仅依赖有限历史，使建模与推断大大简化。", "马尔可夫假设 只是术语，没有独立建模意义。", "马尔可夫假设 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。当前状态仅依赖有限历史，使建模与推断大大简化。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“隐变量”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。隐变量 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“前向-后向算法”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。前向-后向算法 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "11.3",
      pages: "Ch 11",
      textbookSubsections: [
          "11.3 Sequence Models",
          "11.3.1 Hidden variables"
        ],
      algorithms: ["前向-后向算法"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
