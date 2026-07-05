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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“条件混合分布”，下列说法是否正确？",
        options: ["网络同时预测混合系数、均值与方差，输出完整的条件概率密度。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。网络同时预测混合系数、均值与方差，输出完整的条件概率密度。",
      },
      {
        question: "关于“机器人运动学示例”，下列说法是否正确？",
        options: ["同一末端位置可能对应多个关节角，单值回归会取平均导致错误解；混合分布可表示多个可行解。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。同一末端位置可能对应多个关节角，单值回归会取平均导致错误解；混合分布可表示多个可行解。",
      },
      {
        question: "关于“似然训练”，下列说法是否正确？",
        options: ["直接最大化条件对数似然，网络自动学习何时需要多峰输出。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。直接最大化条件对数似然，网络自动学习何时需要多峰输出。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 6",
      section: "",
      pages: "",
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
