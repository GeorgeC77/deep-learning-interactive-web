import BishopSectionPage from '@/components/BishopSectionPage';
import { Network } from 'lucide-react';

export default function Ch08OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/overview"
      heroIcon={<Network className="w-9 h-9 text-blue-600" />}
      summary={"结构化分布利用变量间的依赖关系进行紧凑建模；图模型与序列模型为复杂联合分布提供可解释框架。"}
      concepts={[
    {
      title: "联合分布的分解",
      description: "利用条件独立将高维分布分解为局部因子的乘积，降低表示与推断成本。",
    },
    {
      title: "有向与无向图",
      description: "贝叶斯网络用有向边表示因果关系，马尔可夫随机场用无向边表示软约束。",
    },
    {
      title: "序列结构",
      description: "时间或空间上的相邻变量相互依赖，适合用链或树结构建模。",
    }
      ]}
      learningObjectives={[
      "理解 联合分布的分解 的含义与作用。",
      "理解 有向与无向图 的含义与作用。",
      "理解 序列结构 的含义与作用。"
    ]}
      coreIntuition={"结构化分布利用变量间的依赖关系进行紧凑建模；图模型与序列模型为复杂联合分布提供可解释框架。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“联合分布的分解”的叙述，哪一项最准确？",
        options: ["利用条件独立将高维分布分解为局部因子的乘积，降低表示与推断成本。", "联合分布的分解 只是术语，没有独立建模意义。", "联合分布的分解 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。利用条件独立将高维分布分解为局部因子的乘积，降低表示与推断成本。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“有向与无向图”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。有向与无向图 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“序列结构”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。序列结构 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      pages: "Ch 11",
      textbookSubsections: [],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}

    />
  );
}
