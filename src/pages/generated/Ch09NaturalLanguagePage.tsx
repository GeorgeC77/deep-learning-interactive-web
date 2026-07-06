import BishopSectionPage from '@/components/BishopSectionPage';
import { Languages } from 'lucide-react';

export default function Ch09NaturalLanguagePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/natural-language"
      heroIcon={<Languages className="w-9 h-9 text-blue-600" />}
      summary={"Bishop Ch 12.2 介绍文本表示基础：词嵌入、分词、词袋、自回归模型、循环神经网络以及随时间反向传播。"}
      concepts={[
        {
          title: "词嵌入 Word Embedding",
          description: "将离散词映射为连续向量，语义相近的词在向量空间中彼此靠近。",
          formula: String.raw`\mathbf{e}_w = \mathbf{E}[w], \quad \mathbf{E} \in \mathbb{R}^{|V|\times d}`,
        },
        {
          title: "分词 Tokenization",
          description: "将文本切分为子词或字符单元，平衡词表大小与表达力。",
        },
        {
          title: "词袋 Bag of Words",
          description: "忽略词序，用词频或 TF-IDF 表示文档；简单但丢失序列信息。",
        },
        {
          title: "自回归语言模型",
          description: "按从左到右顺序建模联合概率，每一步预测下一 token。",
          formula: String.raw`p(x_1,\dots,x_T) = \prod_{t=1}^{T} p(x_t \mid x_{<t})`,
        },
        {
          title: "循环神经网络 RNN",
          description: "通过隐状态传递历史信息，适合序列建模，但长程依赖较弱。",
          formula: String.raw`\mathbf{h}_t = \tanh(\mathbf{W}_{hh}\mathbf{h}_{t-1} + \mathbf{W}_{xh}\mathbf{x}_t + \mathbf{b})`,
        },
        {
          title: "随时间反向传播 BPTT",
          description: "将 RNN 按时间展开成计算图，再用反向传播计算梯度。",
        },
      ]}
      learningObjectives={[
        "理解词嵌入、分词与词袋表示的优缺点。",
        "会写出自回归语言模型的联合概率分解。",
        "能说明 RNN 更新方程与 BPTT 的要点。",
      ]}
      coreIntuition={"文本是离散序列；词嵌入把“词”变成“向量”，自回归模型把“序列”变成“条件概率连乘”，RNN 把“历史”压缩进隐状态。"}
      commonMistakes={[
        "把词袋模型用于需要词序的任务，忽略其丢失序列信息的本质。",
        "认为 RNN 能自然记住任意长距离依赖，实际上梯度消失/爆炸会限制记忆长度。",
        "混淆 token embedding 与 positional encoding：前者给词含义，后者给位置信息。",
      ]}
      quiz={[
        {
          question: "自回归语言模型对句子 x₁,x₂,x₃ 的建模方式是？",
          options: [
            "p(x₁)p(x₂|x₁)p(x₃|x₁,x₂)",
            "p(x₁)p(x₂)p(x₃)",
            "p(x₃|x₂)p(x₂|x₁)p(x₁)",
            "p(x₁,x₂,x₃) 用单个高斯分布建模",
          ],
          correctIndex: 0,
          explanation: "自回归模型按前向顺序分解联合概率：p(x₁,x₂,x₃)=p(x₁)p(x₂|x₁)p(x₃|x₁,x₂)。",
        },
        {
          question: "RNN 长程依赖困难的主要原因是？",
          options: [
            "反向传播时梯度经过多个时间步连乘，容易出现消失或爆炸。",
            "RNN 不能处理变长序列。",
            "RNN 没有隐状态。",
            "RNN 不能与非线性激活一起使用。",
          ],
          correctIndex: 0,
          explanation: "BPTT 中梯度随时间反向传播，长时间步连乘导致梯度消失或爆炸，是 RNN 的固有难点。",
        },
        {
          question: "词袋模型在哪个场景下最可能失败？",
          options: [
            "判断“ dogs chase cats ”与“ cats chase dogs ”语义不同的场景。",
            "统计文档中各词出现频率。",
            "对短文本进行主题分类。",
            "构建 TF-IDF 特征。",
          ],
          correctIndex: 0,
          explanation: "词袋忽略词序，因此无法区分“狗追猫”和“猫追狗”的语义差异。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 12",
        section: "12.2",
        pages: "Ch 12",
        textbookSubsections: ["12.2.1 Word embedding", "12.2.2 Tokenization", "12.2.3 Bag of words", "12.2.4 Autoregressive models", "12.2.5 Recurrent neural networks", "12.2.6 Backpropagation through time"],
        formulas: ["自回归分解 p(x)=∏p(x_t|x<t)", "RNN 隐状态更新", "词嵌入查表"],
        algorithms: ["词袋", "RNN 前向与 BPTT"],
        exercises: ["用给定词表写出句子的 one-hot 与 embedding 表示。", "推导 RNN 对短序列的 BPTT 梯度。"],
      }}
    />
  );
}
