import BishopSectionPage from '@/components/BishopSectionPage';
import { Focus } from 'lucide-react';

export default function Ch09OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/overview"
      heroIcon={<Focus className="w-9 h-9 text-blue-600" />}
      summary={"Transformer 架构用自注意力取代循环结构，使序列中任意位置都能直接交互，并成为现代大语言模型的基础。"}
      concepts={[
    {
      title: "自注意力",
      description: "查询、键、值来自同一序列，每个位置都能关注其他位置并分配注意力权重。",
    },
    {
      title: "多头注意力",
      description: "多组独立注意力并行，捕捉不同子空间的关系模式。",
    },
    {
      title: "位置编码",
      description: "为 token 注入位置信息；没有位置编码时，Transformer 层对 token 顺序是置换等变的。",
    },
    {
      title: "Encoder/Decoder",
      description: "编码器使用双向自注意力，解码器使用掩码自注意力与交叉注意力。",
    }
      ]}
      learningObjectives={[
      "理解 自注意力 的含义与作用。",
      "理解 多头注意力 的含义与作用。",
      "理解 位置编码 的含义与作用。"
    ]}
      coreIntuition={"Transformer 架构用自注意力取代循环结构，使序列中任意位置都能直接交互，并成为现代大语言模型的基础。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“自注意力”，下列说法是否正确？",
        options: ["查询、键、值来自同一序列，每个位置都能关注其他位置并分配注意力权重。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。查询、键、值来自同一序列，每个位置都能关注其他位置并分配注意力权重。",
      },
      {
        question: "关于“多头注意力”，下列说法是否正确？",
        options: ["多组独立注意力并行，捕捉不同子空间的关系模式。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。多组独立注意力并行，捕捉不同子空间的关系模式。",
      },
      {
        question: "关于“位置编码”，下列说法是否正确？",
        options: ["为 token 注入位置信息；没有位置编码时，Transformer 层对 token 顺序是置换等变的。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。为 token 注入位置信息；没有位置编码时，Transformer 层对 token 顺序是置换等变的。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 12",
      section: "",
      pages: "",
    }}
          demo={{
      title: "自注意力计算量随序列长度增长",
      label: "序列长度 N",
      param: 8,
      min: 2,
      max: 64,
      step: 1,
      compute: (N) => ({
        label: 'O(N²D) 相对计算量',
        value: N * N,
        display: String.raw`N^2=${(N * N).toFixed(0)}`,
      }),
      formula: String.raw`\text{FLOPs} \propto N^2 D`,
    }}
    />
  );
}
