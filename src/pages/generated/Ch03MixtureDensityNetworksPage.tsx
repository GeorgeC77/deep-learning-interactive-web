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
    }
      ]}
      learningObjectives={[
      "理解 条件混合分布 的含义与作用。",
      "理解 机器人运动学示例 的含义与作用。",
      "理解 似然训练 的含义与作用。"
    ]}
      coreIntuition={"混合密度网络用神经网络输出条件混合分布的参数，从而建模多峰、非单值的逆问题映射。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“条件混合分布”的叙述，哪一项最准确？",
        options: ["网络同时预测混合系数、均值与方差，输出完整的条件概率密度。", "条件混合分布 与本节讨论的问题完全无关。", "条件混合分布 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。网络同时预测混合系数、均值与方差，输出完整的条件概率密度。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“机器人运动学示例”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。机器人运动学示例 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“似然训练”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。似然训练 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 6",
      section: "6.5",
      pages: "Ch 6",
      textbookSubsections: ["6.5.1 条件混合分布", "6.5.2 机器人运动学示例", "6.5.3 似然训练"],
      formulas: ["条件混合分布公式"],
      algorithms: ["似然训练"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
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
