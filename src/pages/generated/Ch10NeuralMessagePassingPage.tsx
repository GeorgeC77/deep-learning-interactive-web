import BishopSectionPage from '@/components/BishopSectionPage';
import { MessageSquare } from 'lucide-react';

export default function Ch10NeuralMessagePassingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch10/neural-message-passing"
      heroIcon={<MessageSquare className="w-9 h-9 text-blue-600" />}
      summary={"神经消息传递框架统一了 GCN、GAT 等变体：聚合邻居消息、更新节点状态、迭代传播至全图。"}
      concepts={[
    {
      title: "消息函数",
      description: "根据目标节点与源节点特征计算要传递的消息。",
    },
    {
      title: "聚合函数",
      description: "对邻居消息做求和、平均或最大值聚合，保证置换不变性。",
    },
    {
      title: "GCN 更新",
      description: "归一化邻接矩阵与特征矩阵相乘实现谱域卷积的一阶近似。",
      formula: String.raw`H^{(l+1)} = \sigma\left(\tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2} H^{(l)} W^{(l)}\right)`,
    }
      ]}
      learningObjectives={[
      "理解 消息函数 的含义与作用。",
      "理解 聚合函数 的含义与作用。",
      "理解 GCN 更新 的含义与作用。"
    ]}
      coreIntuition={"神经消息传递框架统一了 GCN、GAT 等变体：聚合邻居消息、更新节点状态、迭代传播至全图。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“消息函数”，下列说法是否正确？",
        options: ["根据目标节点与源节点特征计算要传递的消息。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。根据目标节点与源节点特征计算要传递的消息。",
      },
      {
        question: "关于“聚合函数”，下列说法是否正确？",
        options: ["对邻居消息做求和、平均或最大值聚合，保证置换不变性。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对邻居消息做求和、平均或最大值聚合，保证置换不变性。",
      },
      {
        question: "关于“GCN 更新”，下列说法是否正确？",
        options: ["归一化邻接矩阵与特征矩阵相乘实现谱域卷积的一阶近似。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。归一化邻接矩阵与特征矩阵相乘实现谱域卷积的一阶近似。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 13",
      section: "",
      pages: "",
    }}
          demo={{
      title: "邻居聚合均值",
      label: "邻居数量 |N(v)|",
      param: 5,
      min: 1,
      max: 20,
      step: 1,
      compute: (N) => ({
        label: '聚合后缩放因子',
        value: 1 / N,
        display: String.raw`\\frac{1}{${N.toFixed(0)}}=${(1 / N).toFixed(3)}`,
      }),
      formula: String.raw`h_v^{(l+1)} = \frac{1}{|\mathcal{N}(v)|} \sum_{u \in \mathcal{N}(v)} m_{uv}`,
    }}
    />
  );
}
