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
          description: "查询、键、值来自同一序列，每个位置都能关注其他位置并分配注意力权重。没有位置编码时，自注意力对 token 顺序是置换等变的。",
        },
        {
          title: "多头注意力",
          description: "多组独立注意力并行，各自关注不同子空间的关系模式，最后拼接并线性投影。",
        },
        {
          title: "位置编码",
          description: "为 token 注入位置信息；没有位置编码时，Transformer 无法区分 “猫追狗” 与 “狗追猫”。",
        },
        {
          title: "Encoder/Decoder",
          description: "编码器使用双向自注意力，解码器使用掩码自注意力与交叉注意力。",
        },
      ]}
      learningObjectives={[
        "理解自注意力如何使序列中任意位置直接交互。",
        "掌握多头注意力扩展单头注意力的方式。",
        "认识位置编码的必要性。",
        "了解 Transformer 编码器与解码器的结构差异。",
      ]}
      coreIntuition={"Transformer 架构用自注意力取代循环结构，使序列中任意位置都能直接交互，并成为现代大语言模型的基础。"}
      commonMistakes={[
        "把“置换等变”说成“置换不变”。等变意味着输出会随输入顺序一起置换；不变才意味着输出完全不变。",
        "忽略位置编码的必要性。没有位置编码时，Transformer 无法区分 “猫追狗” 与 “狗追猫”。",
        "认为注意力权重是模型直接“理解”语义的结果。权重由可学习投影决定，其可解释性需额外验证。",
        "低估长序列开销。当 N 从 1k 增加到 4k 时，注意力计算量增长约 16 倍。",
      ]}
      whyCards={[
        {
          question: "为什么需要位置编码？",
          answer: "自注意力本身对 token 顺序是置换等变的，打乱输入顺序输出也会同样打乱。位置编码把顺序信息注入表示，让模型知道谁在谁前面。",
        },
        {
          question: "为什么用多头而不是单头？",
          answer: "单头注意力只能在一个子空间里做相似度计算；多头让模型同时从多个角度观察关系，比如语法、语义、指代等。",
        },
      ]}
      counterexamples={[
        "固定 Q、K 时，Attention Heatmap 不变；但只要改 V，Output 就会全部改变——说明 Attention Matrix ≠ 输出。",
        "没有位置编码时，输入 “猫 追 狗” 和 “狗 追 猫” 会得到完全相同的注意力权重，只是输出 token 顺序不同。",
      ]}
      bishopMapping={{
        chapter: "Ch 12",
        pages: "Ch 12",
        textbookSubsections: [
          "12.1 Attention",
          "12.2 Natural Language",
          "12.3 Transformer Language Models",
          "12.4 Multimodal Transformers",
        ],
        algorithms: ["位置编码"],
        exercises: [
          "展开自注意力公式并说明每个符号的数学含义。",
          "用一个简单数值实例检验多头注意力的输出维度。",
          "对照循环网络，分析 Transformer 在长序列上的优势与代价。",
        ],
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
