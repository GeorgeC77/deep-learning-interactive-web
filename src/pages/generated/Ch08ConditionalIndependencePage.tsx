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
    },
      
    {
      title: "Three example graphs",
      description: "介绍 Three example graphs 的定义、关键公式与典型应用场景。",
    },
    {
      title: "Explaining away",
      description: "介绍 Explaining away 的定义、关键公式与典型应用场景。",
    },
    {
      title: "D-separation",
      description: "介绍 D-separation 的定义、关键公式与典型应用场景。",
    },
    {
      title: "Naive Bayes",
      description: "介绍 Naive Bayes 的定义、关键公式与典型应用场景。",
    },
  ]}
      learningObjectives={[
      "理解 三种基本结构 的含义与作用。",
      "理解 解释消除 的含义与作用。",
      "理解 d-分离 的含义与作用。"
    ]}
      coreIntuition={"条件独立性是图模型的核心；d-分离提供了一套基于图结构判断独立性的完备规则。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“三种基本结构”的叙述，哪一项最准确？",
        options: ["链式、分岔与汇聚会以不同方式决定条件独立关系。", "三种基本结构 只是术语，没有独立建模意义。", "三种基本结构 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。链式、分岔与汇聚会以不同方式决定条件独立关系。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“解释消除”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。解释消除 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“d-分离”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。d-分离 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "11.2",
      pages: "Ch 11",
      textbookSubsections: [
          "11.2 Conditional Independence",
          "11.2.1 Three example graphs",
          "11.2.2 Explaining away",
          "11.2.3 D-separation",
          "11.2.4 Naive Bayes",
          "11.2.5 Generative models",
          "11.2.6 Markov blanket",
          "11.2.7 Graphs as filters"
        ],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
