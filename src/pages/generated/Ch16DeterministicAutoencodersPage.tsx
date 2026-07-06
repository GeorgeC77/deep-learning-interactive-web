import BishopSectionPage from '@/components/BishopSectionPage';
import { Box } from 'lucide-react';

export default function Ch16DeterministicAutoencodersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch16/deterministic-autoencoders"
      heroIcon={<Box className="w-9 h-9 text-blue-600" />}
      summary={"确定性自编码器直接学习点到点的映射；通过欠完备、稀疏、去噪等约束获得有意义的隐表示。"}
      concepts={[
    {
      title: "线性自编码器",
      description: "单隐层线性自编码器等价于主成分分析，学习数据的主子空间。",
    },
    {
      title: "稀疏自编码器",
      description: "在隐单元上施加稀疏惩罚，使每个输入仅激活少量特征。",
    },
    {
      title: "去噪自编码器",
      description: "从损坏输入重构干净输入，学习对输入扰动鲁棒的特征。",
    }
      ]}
      learningObjectives={[
      "理解 线性自编码器 的含义与作用。",
      "理解 稀疏自编码器 的含义与作用。",
      "理解 去噪自编码器 的含义与作用。"
    ]}
      coreIntuition={"确定性自编码器直接学习点到点的映射；通过欠完备、稀疏、去噪等约束获得有意义的隐表示。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“线性自编码器”的叙述，哪一项最准确？",
        options: ["单隐层线性自编码器等价于主成分分析，学习数据的主子空间。", "线性自编码器 与本节讨论的问题完全无关。", "线性自编码器 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。单隐层线性自编码器等价于主成分分析，学习数据的主子空间。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“稀疏自编码器”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。稀疏自编码器 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“去噪自编码器”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。去噪自编码器 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 19",
      section: "19.1",
      pages: "Ch 19",
      textbookSubsections: ["19.1.1 线性自编码器", "19.1.2 稀疏自编码器", "19.1.3 去噪自编码器"],
      algorithms: ["线性自编码器", "稀疏自编码器", "去噪自编码器"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "去噪重构误差",
      label: "噪声标准差 σ",
      param: 0.2,
      min: 0,
      max: 1,
      step: 0.05,
      compute: (sigma) => ({
        label: '期望噪声能量',
        value: sigma * sigma,
        display: String.raw`\\mathbb{E}[\\epsilon^2]=${(sigma * sigma).toFixed(3)}`,
      }),
      formula: String.raw`\mathbb{E}[\|\epsilon\|^2] = \sigma^2`,
    }}
    />
  );
}
