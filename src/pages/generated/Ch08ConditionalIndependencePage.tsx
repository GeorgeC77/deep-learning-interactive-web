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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“三种基本结构”，下列说法是否正确？",
        options: ["链式、分岔与汇聚会以不同方式决定条件独立关系。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。链式、分岔与汇聚会以不同方式决定条件独立关系。",
      },
      {
        question: "关于“解释消除”，下列说法是否正确？",
        options: ["观测到共同结果时，两个原本独立的父节点可能变得相关。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。观测到共同结果时，两个原本独立的父节点可能变得相关。",
      },
      {
        question: "关于“d-分离”，下列说法是否正确？",
        options: ["若所有路径都被某个观测节点阻断，则称两变量在给定条件下 d-分离。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。若所有路径都被某个观测节点阻断，则称两变量在给定条件下 d-分离。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "",
      pages: "",
    }}

    />
  );
}
