import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch04NormalizationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/normalization"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"归一化稳定输入分布与内部激活，使网络可以使用更大学习率、更快收敛，并降低对初始化的敏感度。"}
      concepts={[
    {
      title: "数据归一化",
      description: "将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。",
      formula: String.raw`\hat{x} = \frac{x - \mu}{\sigma}`,
    },
    {
      title: "批归一化",
      description: "对每个 mini-batch 的激活做归一化，并通过可学习的缩放平移恢复表达能力。",
    },
    {
      title: "层归一化",
      description: "沿特征维度归一化，不依赖 batch 大小，广泛用于 RNN 与 Transformer。",
    }
      ]}
      learningObjectives={[
      "理解 数据归一化 的含义与作用。",
      "理解 批归一化 的含义与作用。",
      "理解 层归一化 的含义与作用。"
    ]}
      coreIntuition={"归一化稳定输入分布与内部激活，使网络可以使用更大学习率、更快收敛，并降低对初始化的敏感度。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“数据归一化”的叙述，哪一项最准确？",
        options: ["将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。", "数据归一化 只是术语，没有独立建模意义。", "数据归一化 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“批归一化”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。批归一化 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“层归一化”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。层归一化 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "7.4",
      pages: "Ch 7",
      textbookSubsections: [
          "7.4 Normalization"
        ],
      formulas: ["数据归一化公式"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}
          demo={{
      title: "标准化后的取值",
      label: "原始标准差 σ",
      param: 2,
      min: 0.2,
      max: 5,
      step: 0.1,
      compute: (sigma) => ({
        label: 'x=3 标准化后',
        value: 3 / sigma,
        display: String.raw`\hat{x}=\frac{3}{${sigma.toFixed(1)}}=${(3 / sigma).toFixed(2)}`,
      }),
      formula: String.raw`\hat{x} = \frac{x - \mu}{\sigma}`,
    }}
    />
  );
}
