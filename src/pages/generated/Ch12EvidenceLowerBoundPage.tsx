import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch12EvidenceLowerBoundPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch12/evidence-lower-bound"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"证据下界为观测数据的对数似然提供了可优化的下界；EM 算法可视为交替优化 ELBO 的过程。"}
      concepts={[
    {
      title: "ELBO",
      description: "通过引入变分后验，将难解的边缘似然转化为可计算的期望加 KL 惩罚。",
      formula: String.raw`\ln p(\mathbf{X}) \ge \mathcal{L}(q) = \mathbb{E}_q[\ln p(\mathbf{X},\mathbf{Z})] - \mathbb{E}_q[\ln q(\mathbf{Z})]`,
    },
    {
      title: "EM 算法",
      description: "E 步固定参数优化 q，M 步固定 q 优化模型参数，保证似然单调不减。",
    },
    {
      title: "广义 EM",
      description: "M 步不必完全最大化 ELBO，只要有所提升即可。",
    }
      ]}
      learningObjectives={[
      "理解 ELBO 的含义与作用。",
      "理解 EM 算法 的含义与作用。",
      "理解 广义 EM 的含义与作用。"
    ]}
      coreIntuition={"证据下界为观测数据的对数似然提供了可优化的下界；EM 算法可视为交替优化 ELBO 的过程。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“ELBO”的叙述，哪一项最准确？",
        options: ["通过引入变分后验，将难解的边缘似然转化为可计算的期望加 KL 惩罚。", "ELBO 与本节讨论的问题完全无关。", "ELBO 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。通过引入变分后验，将难解的边缘似然转化为可计算的期望加 KL 惩罚。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“EM 算法”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。EM 算法 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“广义 EM”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。广义 EM 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 15",
      section: "15.4",
      pages: "Ch 15",
      textbookSubsections: ["15.4.1 ELBO", "15.4.2 EM 算法", "15.4.3 广义 EM"],
      formulas: ["ELBO公式"],
      algorithms: ["EM 算法"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "KL 项对 ELBO 的影响",
      label: "变分后验标准差 σ",
      param: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      compute: (sigma) => ({
        label: '-KL(q||N(0,1))',
        value: -0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1),
        display: String.raw`-D_{KL}=${(-0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1)).toFixed(3)}`,
      }),
      formula: String.raw`-D_{KL}\bigl(\mathcal{N}(0,\sigma^2) \| \mathcal{N}(0,1)\bigr) = -\frac{1}{2}(\sigma^2 - \ln \sigma^2 - 1)`,
    }}
    />
  );
}
