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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 12",
      pages: "Ch 12",
      textbookSubsections: [],
      algorithms: ["位置编码"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
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
