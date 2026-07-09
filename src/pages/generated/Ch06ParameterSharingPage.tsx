import BishopSectionPage from '@/components/BishopSectionPage';
import { Share2 } from 'lucide-react';

export default function Ch06ParameterSharingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/parameter-sharing"
      heroIcon={<Share2 className="w-9 h-9 text-blue-600" />}
      summary={"参数共享让同一组权重在多个位置复用，显著减少参数量并强制定义不变性或局部性先验。"}
      concepts={[
    {
      title: "软权重共享",
      description: "通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。",
    },
    {
      title: "卷积中的共享",
      description: "卷积核在整张特征图上滑动，天然实现平移等变性与局部连接。",
    },
    {
      title: "参数量与统计效率",
      description: "共享使模型需要的训练数据更少，同时降低过拟合风险。",
    }
      ]}
      learningObjectives={[
      "理解 软权重共享 的含义与作用。",
      "理解 卷积中的共享 的含义与作用。",
      "理解 参数量与统计效率 的含义与作用。"
    ]}
      coreIntuition={"参数共享让同一组权重在多个位置复用，显著减少参数量并强制定义不变性或局部性先验。"}
      commonMistakes={[
      "混淆本节核心概念与相邻小节的前提假设，导致错误套用。",
      "只记忆公式形式，而不验证其成立条件与具体数值。"
    ]}
      quiz={[
      {
        question: "下列关于“软权重共享”的叙述，哪一项最准确？",
        options: ["通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。", "软权重共享 只是术语，没有独立建模意义。", "软权重共享 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“卷积中的共享”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。卷积中的共享 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“参数量与统计效率”的结果违背直觉，应优先排查哪些前提假设？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。参数量与统计效率 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "9.4",
      pages: "Ch 9",
      textbookSubsections: [
          "9.4 Parameter Sharing"
        ],
      exercises: ["推导本节核心公式的展开形式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "对比本节结论与先前章节结论的适用条件差异。"]
    }}
          demo={{
      title: "共享参数数量对比",
      label: "特征图边长 H",
      param: 16,
      min: 4,
      max: 64,
      step: 4,
      compute: (h) => ({
        label: '全连接 / 卷积 参数量比',
        value: h * h,
        display: String.raw`\frac{K^2H^2}{K^2}=${(h * h).toFixed(0)}`,
      }),
      formula: String.raw`\frac{\text{全连接}}{\text{卷积}} = H^2`,
    }}
    />
  );
}
