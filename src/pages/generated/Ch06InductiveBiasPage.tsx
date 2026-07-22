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
    },
      
    {
      title: "Inverse problems",
      description: "介绍 Inverse problems 的定义、关键公式与典型应用场景。",
    },
  ]}
      learningObjectives={[
      "理解 逆问题与欠定性 的含义与作用。",
      "理解 无免费午餐定理 的含义与作用。",
      "理解 对称性、不变性与等变性 的含义与作用。"
    ]}
      coreIntuition={"归纳偏置是模型对学习问题的先验假设；合理设计偏置能缩小搜索空间，而错误的偏置会导致失败。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 9",
      section: "9.1",
      pages: "Ch 9",
      textbookSubsections: [
          "9.1 Inductive Bias",
          "9.1.1 Inverse problems",
          "9.1.2 No free lunch theorem",
          "9.1.3 Symmetry and invariance",
          "9.1.4 Equivariance"
        ],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
