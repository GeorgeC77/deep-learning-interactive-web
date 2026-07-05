import BishopSectionPage from '@/components/BishopSectionPage';
import { Wind } from 'lucide-react';

export default function Ch17ForwardEncoderPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/forward-encoder"
      heroIcon={<Wind className="w-9 h-9 text-blue-600" />}
      summary={"前向编码器按马尔可夫链逐步加噪；由于高斯转移核，任意时刻的边际分布都有闭式表达。"}
      concepts={[
    {
      title: "扩散核",
      description: "每步将当前样本与高斯噪声按预设 schedule 混合。",
      formula: String.raw`q(x_t \mid x_{t-1}) = \mathcal{N}(x_t \mid \sqrt{1-\beta_t}\, x_{t-1}, \beta_t I)`,
    },
    {
      title: "闭式重参数化",
      description: "可直接从 x₀ 采样任意 t 时刻的加噪样本，无需迭代。",
      formula: String.raw`x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1-\bar{\alpha}_t}\, \epsilon`,
    },
    {
      title: "噪声 schedule",
      description: "β_t 随时间递增，控制从数据到噪声的过渡速度。",
    }
      ]}
      learningObjectives={[
      "理解 扩散核 的含义与作用。",
      "理解 闭式重参数化 的含义与作用。",
      "理解 噪声 schedule 的含义与作用。"
    ]}
      coreIntuition={"前向编码器按马尔可夫链逐步加噪；由于高斯转移核，任意时刻的边际分布都有闭式表达。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“扩散核”，下列说法是否正确？",
        options: ["每步将当前样本与高斯噪声按预设 schedule 混合。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。每步将当前样本与高斯噪声按预设 schedule 混合。",
      },
      {
        question: "关于“闭式重参数化”，下列说法是否正确？",
        options: ["可直接从 x₀ 采样任意 t 时刻的加噪样本，无需迭代。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。可直接从 x₀ 采样任意 t 时刻的加噪样本，无需迭代。",
      },
      {
        question: "关于“噪声 schedule”，下列说法是否正确？",
        options: ["β_t 随时间递增，控制从数据到噪声的过渡速度。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。β_t 随时间递增，控制从数据到噪声的过渡速度。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 20",
      section: "",
      pages: "",
    }}
          demo={{
      title: "加噪样本中信号与噪声比例",
      label: "累积系数 ᾱ_t",
      param: 0.5,
      min: 0.01,
      max: 0.99,
      step: 0.01,
      compute: (alphaBar) => ({
        label: '信号比例',
        value: Math.sqrt(alphaBar),
        display: String.raw`\\sqrt{\\bar{\\alpha}_t}=${Math.sqrt(alphaBar).toFixed(3)}`,
      }),
      formula: String.raw`x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1-\bar{\alpha}_t}\, \epsilon`,
    }}
    />
  );
}
