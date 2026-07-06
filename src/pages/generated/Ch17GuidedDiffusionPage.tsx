import BishopSectionPage from '@/components/BishopSectionPage';
import { Crosshair } from 'lucide-react';

export default function Ch17GuidedDiffusionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/guided-diffusion"
      heroIcon={<Crosshair className="w-9 h-9 text-blue-600" />}
      summary={"引导扩散在采样时引入类别、文本或其他条件信号，使生成结果向目标语义移动。"}
      concepts={[
    {
      title: "分类器引导",
      description: "利用预训练分类器的梯度调整分数，增强条件对齐但可能牺牲多样性。",
    },
    {
      title: "无分类器引导",
      description: "在训练时随机丢弃条件，采样时用条件与无条件预测的差值控制引导强度。",
      formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
    },
    {
      title: "引导强度权衡",
      description: "权重 w 越大，样本与条件越对齐，但多样性越低。",
    }
      ]}
      learningObjectives={[
      "理解 分类器引导 的含义与作用。",
      "理解 无分类器引导 的含义与作用。",
      "理解 引导强度权衡 的含义与作用。"
    ]}
      coreIntuition={"引导扩散在采样时引入类别、文本或其他条件信号，使生成结果向目标语义移动。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“分类器引导”的叙述，哪一项最准确？",
        options: ["利用预训练分类器的梯度调整分数，增强条件对齐但可能牺牲多样性。", "分类器引导 与本节讨论的问题完全无关。", "分类器引导 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。利用预训练分类器的梯度调整分数，增强条件对齐但可能牺牲多样性。 这体现了本节的核心思想。",
      },
      {
        question: "在“无分类器引导”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。无分类器引导 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“引导强度权衡”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。引导强度权衡 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 20",
      section: "20.4",
      pages: "Ch 20",
      textbookSubsections: ["20.4.1 分类器引导", "20.4.2 无分类器引导", "20.4.3 引导强度权衡"],
      formulas: ["无分类器引导公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "无分类器引导强度",
      label: "引导权重 w",
      param: 1,
      min: 0,
      max: 5,
      step: 0.1,
      compute: (w) => ({
        label: '条件偏移倍数',
        value: w,
        display: String.raw`\\hat{\\epsilon}=\\epsilon_{\\text{unc}}+${w.toFixed(1)}(\\epsilon_{\\text{cond}}-\\epsilon_{\\text{unc}})`,
      }),
      formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
    }}
    />
  );
}
