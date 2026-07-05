import BishopSectionPage from '@/components/BishopSectionPage';
import { Languages } from 'lucide-react';

export default function Ch09NaturalLanguagePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/natural-language"
      heroIcon={<Languages className="w-9 h-9 text-blue-600" />}
      summary={"自然语言处理将文本表示为 token 序列；从词嵌入到 Transformer，模型逐步学会捕捉语义、语法与上下文。"}
      concepts={[
    {
      title: "词嵌入",
      description: "将离散词映射到连续向量空间，语义相近的词在向量空间中彼此靠近。",
    },
    {
      title: "分词",
      description: "将文本切分为模型可处理的子词单元，平衡词表大小与表达力。",
    },
    {
      title: "自回归语言模型",
      description: "按从左到右顺序预测下一个 token，训练与生成都基于前文上下文。",
    },
    {
      title: "RNN 与 BPTT",
      description: "循环神经网络按时间步展开，通过随时间反向传播训练，但长程依赖较弱。",
    }
      ]}
      learningObjectives={[
      "理解 词嵌入 的含义与作用。",
      "理解 分词 的含义与作用。",
      "理解 自回归语言模型 的含义与作用。"
    ]}
      coreIntuition={"自然语言处理将文本表示为 token 序列；从词嵌入到 Transformer，模型逐步学会捕捉语义、语法与上下文。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“词嵌入”，下列说法是否正确？",
        options: ["将离散词映射到连续向量空间，语义相近的词在向量空间中彼此靠近。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将离散词映射到连续向量空间，语义相近的词在向量空间中彼此靠近。",
      },
      {
        question: "关于“分词”，下列说法是否正确？",
        options: ["将文本切分为模型可处理的子词单元，平衡词表大小与表达力。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将文本切分为模型可处理的子词单元，平衡词表大小与表达力。",
      },
      {
        question: "关于“自回归语言模型”，下列说法是否正确？",
        options: ["按从左到右顺序预测下一个 token，训练与生成都基于前文上下文。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。按从左到右顺序预测下一个 token，训练与生成都基于前文上下文。",
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
