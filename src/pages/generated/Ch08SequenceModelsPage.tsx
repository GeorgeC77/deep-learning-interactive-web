import BishopSectionPage from '@/components/BishopSectionPage';
import { Clock } from 'lucide-react';

export default function Ch08SequenceModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch08/sequence-models"
      heroIcon={<Clock className="w-9 h-9 text-blue-600" />}
      summary={"序列模型捕捉时间或顺序上的依赖；隐马尔可夫模型与线性动态系统是经典代表，现代则由 RNN 与 Transformer 扩展。"}
      concepts={[
        {
          title: "马尔可夫假设",
          description: "当前状态仅依赖有限历史，使建模与推断大大简化。",
        },
        {
          title: "隐变量",
          description: "隐状态 summarises 过去信息，用于预测未来观测。",
        },
        {
          title: "前向-后向算法",
          description: "利用动态规划高效计算隐状态后验与模型似然。",
        }
      ]}
      learningObjectives={[
        "理解马尔可夫假设如何简化序列建模。",
        "掌握隐状态在序列模型中的作用。",
        "了解前向-后向算法的基本思想。",
      ]}
      coreIntuition={"序列模型捕捉时间或顺序上的依赖；隐马尔可夫模型与线性动态系统是经典代表，现代则由 RNN 与 Transformer 扩展。"}
      commonMistakes={[
        "认为马尔可夫假设意味着完全遗忘历史——它只是条件依赖的简化。",
        "混淆隐状态与观测状态——隐状态不直接可见，需要通过观测推断。",
      ]}
      whyCards={[
        {
          question: "为什么需要马尔可夫假设？",
          answer: "完整建模所有历史会导致参数爆炸。马尔可夫假设限制依赖范围，让模型可以用有限参数捕捉序列结构。",
        },
        {
          question: "为什么需要隐状态？",
          answer: "观测本身可能不包含足够的历史信息。隐状态作为“记忆” summarises 过去，帮助模型更好地预测未来。",
        },
      ]}
      counterexamples={[
        "用一阶马尔可夫模型预测长距离依赖的文本，效果很差——说明马尔可夫阶数限制了模型能力。",
        "把隐状态直接当成观测值，忽略了后验推断的必要性——说明隐变量模型需要概率推断。",
      ]}
      bishopMapping={{
        chapter: "Ch 11",
        section: "11.3",
        pages: "Ch 11",
        textbookSubsections: [
          "11.3 Sequence Models",
          "11.3.1 Hidden variables"
        ],
        algorithms: ["前向-后向算法"],
        exercises: ["说明马尔可夫假设在文本与语音任务中的适用性。", "解释隐状态如何帮助模型捕捉长距离依赖。"]
      }}
    />
  );
}
