import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowLeft } from 'lucide-react';

export default function Ch17ReverseDecoderPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/reverse-decoder"
      heroIcon={<ArrowLeft className="w-9 h-9 text-blue-600" />}
      summary={"反向解码器学习逐步去噪的条件分布；ELBO 可重写为噪声预测损失，使训练稳定且高效。"}
      concepts={[
    {
      title: "反向条件分布",
      description: "当 β 很小时，反向过程也近似高斯，可用神经网络参数化。",
    },
    {
      title: "变分下界",
      description: "优化 ELBO 等价于训练网络匹配真实的反向转移。",
    },
    {
      title: "简化损失",
      description: "直接预测加入的噪声 ϵ 通常比重构完整转移参数更稳定。",
      formula: String.raw`\mathcal{L} = \mathbb{E}_{t,x_0,\epsilon}\left[ \|\epsilon - \epsilon_\theta(x_t, t)\|^2 \right]`,
    }
      ]}
      learningObjectives={[
      "理解 反向条件分布 的含义与作用。",
      "理解 变分下界 的含义与作用。",
      "理解 简化损失 的含义与作用。"
    ]}
      coreIntuition={"反向解码器学习逐步去噪的条件分布；ELBO 可重写为噪声预测损失，使训练稳定且高效。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“反向条件分布”，下列说法是否正确？",
        options: ["当 β 很小时，反向过程也近似高斯，可用神经网络参数化。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。当 β 很小时，反向过程也近似高斯，可用神经网络参数化。",
      },
      {
        question: "关于“变分下界”，下列说法是否正确？",
        options: ["优化 ELBO 等价于训练网络匹配真实的反向转移。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。优化 ELBO 等价于训练网络匹配真实的反向转移。",
      },
      {
        question: "关于“简化损失”，下列说法是否正确？",
        options: ["直接预测加入的噪声 ϵ 通常比重构完整转移参数更稳定。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。直接预测加入的噪声 ϵ 通常比重构完整转移参数更稳定。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 20",
      section: "",
      pages: "",
    }}
          demo={{
      title: "噪声预测 MSE",
      label: "预测误差",
      param: 0.5,
      min: 0,
      max: 2,
      step: 0.05,
      compute: (err) => ({
        label: '损失',
        value: err * err,
        display: String.raw`\\|\\epsilon-\\epsilon_\\theta\\|^2=${(err * err).toFixed(3)}`,
      }),
      formula: String.raw`\|\epsilon - \epsilon_\theta(x_t, t)\|^2`,
    }}
    />
  );
}
