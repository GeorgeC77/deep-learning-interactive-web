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
      quiz={[
      {
        question: "下列关于“自注意力”的叙述，哪一项最准确？",
        options: ["查询、键、值来自同一序列，每个位置都能关注其他位置并分配注意力权重。", "自注意力 只是术语，没有独立建模意义。", "自注意力 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。查询、键、值来自同一序列，每个位置都能关注其他位置并分配注意力权重。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“多头注意力”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。多头注意力 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“位置编码”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。位置编码 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
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
