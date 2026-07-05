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
      "理解 马尔可夫假设 的含义与作用。",
      "理解 隐变量 的含义与作用。",
      "理解 前向-后向算法 的含义与作用。"
    ]}
      coreIntuition={"序列模型捕捉时间或顺序上的依赖；隐马尔可夫模型与线性动态系统是经典代表，现代则由 RNN 与 Transformer 扩展。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“马尔可夫假设”，下列说法是否正确？",
        options: ["当前状态仅依赖有限历史，使建模与推断大大简化。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。当前状态仅依赖有限历史，使建模与推断大大简化。",
      },
      {
        question: "关于“隐变量”，下列说法是否正确？",
        options: ["隐状态 summarises 过去信息，用于预测未来观测。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。隐状态 summarises 过去信息，用于预测未来观测。",
      },
      {
        question: "关于“前向-后向算法”，下列说法是否正确？",
        options: ["利用动态规划高效计算隐状态后验与模型似然。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。利用动态规划高效计算隐状态后验与模型似然。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 11",
      section: "",
      pages: "",
    }}

    />
  );
}
