import BishopSectionPage from '@/components/BishopSectionPage';
import { Hexagon } from 'lucide-react';

export default function Ch10GeneralGraphNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/general-graph-networks"
      heroIcon={<Hexagon className="w-9 h-9 text-blue-600" />}
      summary={"通用图网络同时处理节点、边与全局特征；图注意力、几何深度学习等扩展提升了表达能力与物理一致性。"}
      concepts={[
    {
      title: "边与全局更新",
      description: "消息传递可同时更新边嵌入和全局表示，适应更丰富的预测任务。",
    },
    {
      title: "图注意力网络",
      description: "为不同邻居学习自适应权重，避免 GCN 的固定归一化假设。",
    },
    {
      title: "过平滑问题",
      description: "深层 GNN 中节点表示趋于一致，限制了对远距离结构的区分能力。",
    }
      ]}
      learningObjectives={[
      "理解 边与全局更新 的含义与作用。",
      "理解 图注意力网络 的含义与作用。",
      "理解 过平滑问题 的含义与作用。"
    ]}
      coreIntuition={"通用图网络同时处理节点、边与全局特征；图注意力、几何深度学习等扩展提升了表达能力与物理一致性。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“边与全局更新”，下列说法是否正确？",
        options: ["消息传递可同时更新边嵌入和全局表示，适应更丰富的预测任务。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。消息传递可同时更新边嵌入和全局表示，适应更丰富的预测任务。",
      },
      {
        question: "关于“图注意力网络”，下列说法是否正确？",
        options: ["为不同邻居学习自适应权重，避免 GCN 的固定归一化假设。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。为不同邻居学习自适应权重，避免 GCN 的固定归一化假设。",
      },
      {
        question: "关于“过平滑问题”，下列说法是否正确？",
        options: ["深层 GNN 中节点表示趋于一致，限制了对远距离结构的区分能力。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。深层 GNN 中节点表示趋于一致，限制了对远距离结构的区分能力。",
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
