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
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“软权重共享”的叙述，哪一项最准确？",
        options: ["通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。", "软权重共享 与本节讨论的问题完全无关。", "软权重共享 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“卷积中的共享”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。卷积中的共享 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“参数量与统计效率”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。参数量与统计效率 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "9.4",
      pages: "Ch 9",
      textbookSubsections: ["9.4.1 软权重共享", "9.4.2 卷积中的共享", "9.4.3 参数量与统计效率"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
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
