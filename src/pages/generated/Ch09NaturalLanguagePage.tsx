import BishopSectionPage from '@/components/BishopSectionPage';
import EmbeddingGeometryLab from '@/components/demos/EmbeddingGeometryLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter09NaturalLanguageExercises } from '@/course/chapter09Exercises';
import { Languages } from 'lucide-react';

export default function Ch09NaturalLanguagePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/natural-language"
      heroIcon={<Languages className="w-9 h-9 text-blue-600" />}
      summary="Bishop §12.2 从离散词的 one-hot 与连续 embedding 开始，经分词和词袋基线引出词序问题；自回归分解保留顺序，RNN 用共享的隐状态递归处理历史，BPTT 则揭示长序列梯度消失、爆炸与串行计算瓶颈。"
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
      whyCards={[
        {
          question: "为什么距离代表语义？",
          answer: "训练让常一起出现、用法相近的词靠得更近。于是空间里的距离就近似对应语义上的相似程度。",
        },
        {
          question: "为什么用词向量而不是编号？",
          answer: "编号本身没有远近含义；向量能把“相似”变成几何上的“靠近”，让模型利用语义关系。",
        },
      ]}
      counterexamples={[
        "距离近不一定同义：它只表示在当前任务中相似。比如“好”和“坏”常出现在同样语境，距离可能很近但意思相反。",
      ]}
            bishopMapping={{
        chapter: "Ch 12",
        section: "12.2",
        pages: "§12.2, pp. 374–382",
        textbookSubsections: [
          "12.2 Natural Language",
          "12.2.1 Word embedding",
          "12.2.2 Tokenization",
          "12.2.3 Bag of words",
          "12.2.4 Autoregressive models",
          "12.2.5 Recurrent neural networks",
          "12.2.6 Backpropagation through time"
        ],
        formulas: ["自回归分解 p(x)=∏p(x_t|x<t)", "RNN 隐状态更新", "词嵌入查表"],
        algorithms: ["词袋", "RNN 前向与 BPTT"],
        exercises: ["用给定词表写出句子的 one-hot 与 embedding 表示。", "推导 RNN 对短序列的 BPTT 梯度。"],
      }}
      interactiveDemo={<EmbeddingGeometryLab />}
      extraContent={(
        <div className="space-y-10">
          <DerivationStepper title="分步推导：BPTT 为什么产生长程梯度问题" steps={[
            { label: '循环更新', formula: String.raw`h_t=f(a_t),\quad a_t=W_{hh}h_{t-1}+W_{xh}x_t+b`, explanation: '同一组循环参数在所有时间步共享，历史通过隐状态依次传递。' },
            { label: '单步 Jacobian', formula: String.raw`\frac{\partial h_t}{\partial h_{t-1}}=\operatorname{diag}(f'(a_t))W_{hh}`, explanation: '每跨一个时间步，反向信号都要乘一次激活导数和循环权重。' },
            { label: '跨时连乘', formula: String.raw`\frac{\partial h_T}{\partial h_k}=\prod_{t=k+1}^{T}\frac{\partial h_t}{\partial h_{t-1}}`, explanation: '从末端损失传回早期状态需要 T−k 个 Jacobian 的乘积。' },
            { label: '消失或爆炸', formula: String.raw`\left\|\frac{\partial h_T}{\partial h_k}\right\|\lesssim\prod_{t=k+1}^{T}\left\|\operatorname{diag}(f'(a_t))W_{hh}\right\|`, explanation: '典型范数若持续小于 1 会指数衰减，持续大于 1 则可能爆炸；这也是 Transformer 用更短信号路径替代递归的重要动机。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter09-natural-language" exercises={chapter09NaturalLanguageExercises} />
        </div>
      )}
    />
  );
}
