import BishopSectionPage from '@/components/BishopSectionPage';
import { Bot } from 'lucide-react';

export default function Ch09TransformerLanguageModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/transformer-language-models"
      heroIcon={<Bot className="w-9 h-9 text-blue-600" />}
      summary={"Transformer 语言模型通过堆叠自注意力与前馈层，在大规模文本上预训练，展现出强大的生成与迁移能力。"}
      concepts={[
    {
      title: "解码器-only 架构",
      description: "GPT 系列使用掩码自注意力，适合自回归生成。",
    },
    {
      title: "编码器-解码器架构",
      description: "BERT 风格编码器做理解，T5 等编码器-解码器模型做序列到序列任务。",
    },
    {
      title: "采样策略",
      description: "贪心、束搜索、top-k 与 nucleus 采样控制生成多样性与质量。",
    },
    {
      title: "大语言模型",
      description: "参数量与数据量扩大带来涌现能力，也带来对齐与评估挑战。",
    }
      ]}
      learningObjectives={[
      "理解 解码器-only 架构 的含义与作用。",
      "理解 编码器-解码器架构 的含义与作用。",
      "理解 采样策略 的含义与作用。"
    ]}
      coreIntuition={"Transformer 语言模型通过堆叠自注意力与前馈层，在大规模文本上预训练，展现出强大的生成与迁移能力。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“解码器-only 架构”，下列说法是否正确？",
        options: ["GPT 系列使用掩码自注意力，适合自回归生成。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。GPT 系列使用掩码自注意力，适合自回归生成。",
      },
      {
        question: "关于“编码器-解码器架构”，下列说法是否正确？",
        options: ["BERT 风格编码器做理解，T5 等编码器-解码器模型做序列到序列任务。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。BERT 风格编码器做理解，T5 等编码器-解码器模型做序列到序列任务。",
      },
      {
        question: "关于“采样策略”，下列说法是否正确？",
        options: ["贪心、束搜索、top-k 与 nucleus 采样控制生成多样性与质量。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。贪心、束搜索、top-k 与 nucleus 采样控制生成多样性与质量。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 12",
      section: "",
      pages: "",
    }}

    />
  );
}
