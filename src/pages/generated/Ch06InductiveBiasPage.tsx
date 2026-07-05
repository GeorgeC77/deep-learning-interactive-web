import BishopSectionPage from '@/components/BishopSectionPage';
import { Compass } from 'lucide-react';

export default function Ch06InductiveBiasPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/inductive-bias"
      heroIcon={<Compass className="w-9 h-9 text-blue-600" />}
      summary={"归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。"}
      concepts={[
    {
      title: "逆问题与欠定性",
      description: "训练数据通常无法唯一确定模型，需要偏置选择可泛化解。",
    },
    {
      title: "无免费午餐定理",
      description: "没有通用学习器能在所有任务上同时最优，偏置必须匹配任务结构。",
    },
    {
      title: "对称性、不变性与等变性",
      description: "卷积的平移等变性、池化的平移不变性都是结构化偏置的成功例子。",
    }
      ]}
      learningObjectives={[
      "理解 逆问题与欠定性 的含义与作用。",
      "理解 无免费午餐定理 的含义与作用。",
      "理解 对称性、不变性与等变性 的含义与作用。"
    ]}
      coreIntuition={"归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“逆问题与欠定性”，下列说法是否正确？",
        options: ["训练数据通常无法唯一确定模型，需要偏置选择可泛化解。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。训练数据通常无法唯一确定模型，需要偏置选择可泛化解。",
      },
      {
        question: "关于“无免费午餐定理”，下列说法是否正确？",
        options: ["没有通用学习器能在所有任务上同时最优，偏置必须匹配任务结构。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。没有通用学习器能在所有任务上同时最优，偏置必须匹配任务结构。",
      },
      {
        question: "关于“对称性、不变性与等变性”，下列说法是否正确？",
        options: ["卷积的平移等变性、池化的平移不变性都是结构化偏置的成功例子。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。卷积的平移等变性、池化的平移不变性都是结构化偏置的成功例子。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "",
      pages: "",
    }}

    />
  );
}
