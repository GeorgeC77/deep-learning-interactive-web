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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“图数据”，下列说法是否正确？",
        options: ["节点、边与全局特征构成非欧数据，无法用常规网格卷积直接处理。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。节点、边与全局特征构成非欧数据，无法用常规网格卷积直接处理。",
      },
      {
        question: "关于“消息传递”，下列说法是否正确？",
        options: ["每个节点收集并变换邻居信息，再更新自身表示。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。每个节点收集并变换邻居信息，再更新自身表示。",
      },
      {
        question: "关于“置换等变性”，下列说法是否正确？",
        options: ["节点编号改变时，GNN 输出仅相应置换，保持图结构语义不变。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。节点编号改变时，GNN 输出仅相应置换，保持图结构语义不变。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 13",
      section: "",
      pages: "",
    }}

    />
  );
}
