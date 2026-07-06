import BishopSectionPage from '@/components/BishopSectionPage';
import AutoregressiveSamplingDemo from '@/components/demos/AutoregressiveSamplingDemo';
import { Bot } from 'lucide-react';

export default function Ch09TransformerLanguageModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/transformer-language-models"
      heroIcon={<Bot className="w-9 h-9 text-blue-600" />}
      summary={"Bishop Ch 12.3 按教材结构介绍：解码器 Transformer、采样策略、编码器 Transformer、序列到序列 Transformer、大语言模型。BERT/T5/GPT 仅作为补充示例，不替代教材主线。"}
      concepts={[
        {
          title: "解码器 Transformer",
          description: "使用掩码自注意力，适合自回归生成；训练时每个位置只能看到前文。",
        },
        {
          title: "采样策略",
          description: "贪心、top-k 与 nucleus（top-p）采样在确定性与多样性之间权衡。",
        },
        {
          title: "编码器 Transformer",
          description: "使用双向自注意力，适合理解任务；BERT 是其著名实例（补充）。",
        },
        {
          title: "序列到序列 Transformer",
          description: "编码器读取源序列，解码器自回归生成目标序列；T5 是其著名实例（补充）。",
        },
        {
          title: "大语言模型 LLM",
          description: "通过扩大参数与数据规模涌现上下文学习、指令遵循等能力，也带来对齐挑战。",
        },
      ]}
      learningObjectives={[
        "区分解码器、编码器与编码器-解码器 Transformer 的注意力掩码差异。",
        "能解释 greedy、top-k、nucleus 采样的区别。",
        "理解 LLM 的 Scaling Law 与对齐挑战。",
      ]}
      coreIntuition={"Transformer 语言模型把“读全文”还是“只读前文”的选择固化在注意力掩码里：解码器是自回归的，编码器是双向的，seq2seq 则两者结合。"}
      commonMistakes={[
        "用 BERT/T5/GPT 的命名替代教材结构，把补充示例当成教材主线。",
        "认为贪心采样一定能得到最优序列；实际上它只保证每步局部最优。",
        "把编码器-解码器 Transformer 的 cross-attention 与自注意力混为一谈。",
      ]}
      quiz={[
        {
          question: "解码器-only 与编码器-only Transformer 的关键差异是？",
          options: [
            "解码器使用因果掩码（只能看到前文），编码器使用双向自注意力。",
            "解码器不能处理文本，只能生成图像。",
            "编码器只能用于分类，解码器只能用于生成。",
            "两者在注意力机制上没有区别。",
          ],
          correctIndex: 0,
          explanation: "解码器为自回归生成使用因果掩码；编码器为理解任务使用双向注意力。",
        },
        {
          question: "Nucleus (top-p) 采样与 top-k 采样相比的主要优势是？",
          options: [
            "根据分布形状动态调整候选集合大小，避免固定 k 带来的过宽或过窄。",
            "总是比 top-k 更快。",
            "保证生成结果完全相同。",
            "只考虑概率最高的一个 token。",
          ],
          correctIndex: 0,
          explanation: "nucleus 采样选择累积概率达到 p 的最小集合，候选数量随分布尖锐程度自适应变化。",
        },
        {
          question: "在 seq2seq Transformer 中，解码器对编码器输出使用的注意力机制称为？",
          options: ["Cross-attention", "Self-attention", "Masked self-attention", "Hierarchical attention"],
          correctIndex: 0,
          explanation: "解码器通过 cross-attention 查询编码器输出，而自注意力用于处理已生成的目标序列。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 12",
        section: "12.3",
        pages: "Ch 12",
        textbookSubsections: ["12.3.1 Decoder transformers", "12.3.2 Sampling strategies", "12.3.3 Encoder transformers", "12.3.4 Sequence-to-sequence transformers", "12.3.5 Large language models"],
        formulas: ["softmax 采样分布", "因果注意力掩码"],
        algorithms: ["Greedy decoding", "Top-k sampling", "Nucleus (top-p) sampling"],
        exercises: ["比较同一 prompt 下 greedy 与 nucleus 采样结果。", "说明 BERT 与 GPT 分别对应哪种 Transformer 结构。"],
      }}
      extraContent={<AutoregressiveSamplingDemo />}
    />
  );
}
