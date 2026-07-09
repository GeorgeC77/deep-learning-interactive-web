import BishopSectionPage from '@/components/BishopSectionPage';
import { Wind } from 'lucide-react';

export default function Ch11LangevinSamplingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/langevin-sampling"
      heroIcon={<Wind className="w-9 h-9 text-blue-600" />}
      summary={"Langevin 动力学结合梯度信息与随机噪声，从能量模型中采样；是分数匹配与扩散模型的理论基础。"}
      concepts={[
    {
      title: "基于能量的模型",
      description: "概率密度由能量函数通过 Boltzmann 分布定义。",
      formula: String.raw`p(x) = \frac{1}{Z} \exp(-E(x))`,
    },
    {
      title: "Langevin 更新",
      description: "沿能量下降方向移动并注入高斯噪声，平衡探索与利用。",
      formula: String.raw`x^{(\tau+1)} = x^{(\tau)} - \frac{\eta}{2} \nabla E(x^{(\tau)}) + \sqrt{\eta} \, \epsilon`,
    },
    {
      title: "与分数匹配的联系",
      description: "能量梯度对应分数函数，Langevin 采样可视为沿分数场移动。",
    }
      ]}
      learningObjectives={[
      "理解 基于能量的模型 的含义与作用。",
      "理解 Langevin 更新 的含义与作用。",
      "理解 与分数匹配的联系 的含义与作用。"
    ]}
      coreIntuition={"Langevin 动力学结合梯度信息与随机噪声，从能量模型中采样；是分数匹配与扩散模型的理论基础。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“基于能量的模型”的叙述，哪一项最准确？",
        options: ["概率密度由能量函数通过 Boltzmann 分布定义。", "基于能量的模型 只是术语，没有独立建模意义。", "基于能量的模型 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。概率密度由能量函数通过 Boltzmann 分布定义。 这体现了本节的核心思想。",
      },
      {
        question: "在“Langevin 更新”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。Langevin 更新 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“与分数匹配的联系”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。与分数匹配的联系 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 14",
      section: "14.3",
      pages: "Ch 14",
      textbookSubsections: [
          "14.3 Langevin Sampling"
        ],
      formulas: ["基于能量的模型公式", "Langevin 更新公式"],
      algorithms: ["Langevin 更新", "与分数匹配的联系"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}

    />
  );
}
