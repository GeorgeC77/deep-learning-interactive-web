import BishopSectionPage from '@/components/BishopSectionPage';
import { Unlink } from 'lucide-react';

export default function Ch08ConditionalIndependencePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/conditional-independence"
      heroIcon={<Unlink className="w-9 h-9 text-blue-600" />}
      summary={"条件独立性是图模型的核心；d-分离提供了一套基于图结构判断独立性的完备规则。"}
      concepts={[
    {
      title: "三种基本结构",
      description: "链式、分岔与汇聚会以不同方式决定条件独立关系。",
    },
    {
      title: "解释消除",
      description: "观测到共同结果时，两个原本独立的父节点可能变得相关。",
    },
    {
      title: "d-分离",
      description: "若所有路径都被某个观测节点阻断，则称两变量在给定条件下 d-分离。",
    }
      ]}
      learningObjectives={[
      "理解 三种基本结构 的含义与作用。",
      "理解 解释消除 的含义与作用。",
      "理解 d-分离 的含义与作用。"
    ]}
      coreIntuition={"条件独立性是图模型的核心；d-分离提供了一套基于图结构判断独立性的完备规则。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“三种基本结构”的叙述，哪一项最准确？",
        options: ["链式、分岔与汇聚会以不同方式决定条件独立关系。", "三种基本结构 与本节讨论的问题完全无关。", "三种基本结构 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。链式、分岔与汇聚会以不同方式决定条件独立关系。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“解释消除”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。解释消除 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“d-分离”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。d-分离 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "11.2",
      pages: "Ch 11",
      textbookSubsections: ["11.2.1 三种基本结构", "11.2.2 解释消除", "11.2.3 d-分离"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
