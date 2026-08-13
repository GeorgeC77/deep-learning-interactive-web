import BishopSectionPage from '@/components/BishopSectionPage';
import AutoregressiveSamplingDemo from '@/components/demos/AutoregressiveSamplingDemo';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter09LanguageModelExercises } from '@/course/chapter09Exercises';
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
          description: "greedy 逐步选最大概率但不保证整条序列最优；beam search 保留 B 个前缀，top-k 与 nucleus（top-p）采样则在质量与多样性之间权衡。",
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
      whyCards={[
        {
          question: "为什么语言模型要逐个词生成？",
          answer: "因为我们不知道未来。自回归模型只看左边的词预测下一个，就像人说话一个字一个字往外蹦，这样才能真正生成新文本。",
        },
        {
          question: "为什么解码器要用掩码注意力？",
          answer: "如果允许看后面的词，模型就等于提前偷看答案，训练时就学不到真正的预测能力。掩码强制它只用历史信息。",
        },
      ]}
      counterexamples={[
        "若训练解码器时不加因果掩码，让每个位置都能看到未来 token，模型会“作弊”直接抄答案，看似损失很低，实际无法用于生成。",
        "温度采样调得过高会让输出看似多样却语无伦次；调得过低则总生成重复的高频词——采样策略直接影响生成质量。",
      ]}
            bishopMapping={{
        chapter: "Ch 12",
        section: "12.3",
        pages: "§12.3, pp. 382–394",
        textbookSubsections: [
          "12.3 Transformer Language Models",
          "12.3.1 Decoder transformers",
          "12.3.2 Sampling strategies",
          "12.3.3 Encoder transformers",
          "12.3.4 Sequence-to-sequence transformers",
          "12.3.5 Large language models"
        ],
        formulas: ["softmax 采样分布", "因果注意力掩码"],
        algorithms: ["Greedy decoding", "Top-k sampling", "Nucleus (top-p) sampling"],
        exercises: ["比较同一 prompt 下 greedy 与 nucleus 采样结果。", "说明 greedy 为什么不保证全局最优序列。", "区分 self-attention 与 cross-attention 的 Q/K/V 来源。"],
      }}
      extraContent={(
        <div className="space-y-10">
          <AutoregressiveSamplingDemo />
          <DerivationStepper title="分步推导：为什么 greedy 局部最优不等于序列全局最优" steps={[
            { label: '序列概率', formula: String.raw`p(y_{1:N})=\prod_{n=1}^{N}p(y_n\mid y_{<n})`, explanation: '完整输出的得分取决于整条路径上全部条件概率的乘积。' },
            { label: 'Greedy 规则', formula: String.raw`\hat y_n=\arg\max_y p(y\mid \hat y_{<n})`, explanation: '每一步只比较当前前缀下的下一个 token，不会回看另一条前缀的后续潜力。' },
            { label: '两步反例', formula: String.raw`0.6\times0.1=0.06\;<\;0.4\times0.9=0.36`, explanation: '第一步选 0.6 的分支看似更好，但若它的最佳后续只有 0.1，完整序列反而输给第一步概率 0.4 的分支。' },
            { label: 'Beam 近似', formula: String.raw`\mathcal B_n=\operatorname{TopB}\{\log p(y_{1:n-1})+\log p(y_n\mid y_{<n})\}`, explanation: 'beam search 同时保留 B 个高分前缀，降低过早剪掉好路径的风险，但仍不是穷举全局最优。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter09-language-models" exercises={chapter09LanguageModelExercises} />
        </div>
      )}
    />
  );
}
