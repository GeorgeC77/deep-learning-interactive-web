import BishopSectionPage from '@/components/BishopSectionPage';
import { GitBranch } from 'lucide-react';

export default function Ch03MixtureDensityNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/mixture-density-networks"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={"混合密度网络用神经网络输出条件混合分布的参数，从而建模多峰、非单值的逆问题映射。"}
      concepts={[
    {
      title: "条件混合分布",
      description: "网络同时预测混合系数、均值与方差，输出完整的条件概率密度。",
      formula: String.raw`p(t \mid x) = \sum_{k=1}^{K} \pi_k(x) \, \mathcal{N}\bigl(t \mid \mu_k(x), \sigma_k^2(x)\bigr)`,
    },
    {
      title: "机器人运动学示例",
      description: "同一末端位置可能对应多个关节角，单值回归会取平均导致错误解；混合分布可表示多个可行解。",
    },
    {
      title: "似然训练",
      description: "直接最大化条件对数似然，网络自动学习何时需要多峰输出。",
    },
      
    {
      title: "Robot kinematics example",
      description: "介绍 Robot kinematics example 的定义、关键公式与典型应用场景。",
    },
  ]}
      learningObjectives={[
      "理解 条件混合分布 的含义与作用。",
      "理解 机器人运动学示例 的含义与作用。",
      "理解 似然训练 的含义与作用。"
    ]}
      coreIntuition={"混合密度网络用神经网络输出条件混合分布的参数，从而建模多峰、非单值的逆问题映射。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“条件混合分布”的叙述，哪一项最准确？",
        options: ["网络同时预测混合系数、均值与方差，输出完整的条件概率密度。", "条件混合分布 只是术语，没有独立建模意义。", "条件混合分布 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。网络同时预测混合系数、均值与方差，输出完整的条件概率密度。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“机器人运动学示例”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。机器人运动学示例 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“似然训练”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。似然训练 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 6",
      section: "6.5",
      pages: "Ch 6",
      textbookSubsections: [
          "6.5 Mixture Density Networks",
          "6.5.1 Robot kinematics example",
          "6.5.2 Conditional mixture distributions",
          "6.5.3 Gradient optimization",
          "6.5.4 Predictive distribution"
        ],
      formulas: ["条件混合分布公式"],
      algorithms: ["似然训练"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}
          demo={{
      title: "两个高斯分量的混合密度",
      label: "混合系数 π₁",
      param: 0.5,
      min: 0,
      max: 1,
      step: 0.05,
      compute: (pi) => ({
        label: 'p(t=0)',
        value: pi * 1 + (1 - pi) * Math.exp(-2),
        display: String.raw`p(0)=${pi.toFixed(2)}\cdot 1+${(1 - pi).toFixed(2)}\cdot e^{-2}`,
      }),
      formula: String.raw`p(t) = \pi_1 \mathcal{N}(t \mid 0,1) + \pi_2 \mathcal{N}(t \mid 2,1)`,
    }}
    />
  );
}
