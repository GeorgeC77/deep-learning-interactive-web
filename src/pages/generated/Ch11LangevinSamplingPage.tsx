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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“基于能量的模型”，下列说法是否正确？",
        options: ["概率密度由能量函数通过 Boltzmann 分布定义。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。概率密度由能量函数通过 Boltzmann 分布定义。",
      },
      {
        question: "关于“Langevin 更新”，下列说法是否正确？",
        options: ["沿能量下降方向移动并注入高斯噪声，平衡探索与利用。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。沿能量下降方向移动并注入高斯噪声，平衡探索与利用。",
      },
      {
        question: "关于“与分数匹配的联系”，下列说法是否正确？",
        options: ["能量梯度对应分数函数，Langevin 采样可视为沿分数场移动。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。能量梯度对应分数函数，Langevin 采样可视为沿分数场移动。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 14",
      section: "",
      pages: "",
    }}

    />
  );
}
