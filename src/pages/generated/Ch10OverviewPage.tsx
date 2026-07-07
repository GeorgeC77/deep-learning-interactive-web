import BishopSectionPage from '@/components/BishopSectionPage';
import { Share2 } from 'lucide-react';

export default function Ch10OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/overview"
      heroIcon={<Share2 className="w-9 h-9 text-blue-600" />}
      summary={"图神经网络将神经网络推广到不规则图结构，通过消息传递聚合邻域信息并满足置换等变性。"}
      concepts={[
    {
      title: "图数据",
      description: "节点、边与全局特征构成非欧数据，无法用常规网格卷积直接处理。",
    },
    {
      title: "消息传递",
      description: "每个节点收集并变换邻居信息，再更新自身表示。",
    },
    {
      title: "置换等变性",
      description: "节点编号改变时，GNN 输出仅相应置换，保持图结构语义不变。",
    }
      ]}
      learningObjectives={[
      "理解 图数据 的含义与作用。",
      "理解 消息传递 的含义与作用。",
      "理解 置换等变性 的含义与作用。"
    ]}
      coreIntuition={"图神经网络将神经网络推广到不规则图结构，通过消息传递聚合邻域信息并满足置换等变性。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“图数据”的叙述，哪一项最准确？",
        options: ["节点、边与全局特征构成非欧数据，无法用常规网格卷积直接处理。", "图数据 只是术语，没有独立建模意义。", "图数据 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。节点、边与全局特征构成非欧数据，无法用常规网格卷积直接处理。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“消息传递”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。消息传递 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“置换等变性”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。置换等变性 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 13",
      pages: "Ch 13",
      textbookSubsections: ["图数据", "消息传递", "置换等变性"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}

    />
  );
}
