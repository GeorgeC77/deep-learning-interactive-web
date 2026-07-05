import BishopSectionPage from '@/components/BishopSectionPage';
import { Shuffle } from 'lucide-react';

export default function Ch11BasicSamplingAlgorithmsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/basic-sampling-algorithms"
      heroIcon={<Shuffle className="w-9 h-9 text-blue-600" />}
      summary={"基本采样算法从简单分布生成样本：逆变换、拒绝采样、重要性采样与采样-重要性重采样构成了蒙特卡洛基础。"}
      concepts={[
    {
      title: "逆变换采样",
      description: "对均匀随机变量应用 CDF 的逆函数，得到目标分布样本。",
    },
    {
      title: "拒绝采样",
      description: "需要提议分布 q 满足 kq(x) ≥ p(x)，接受率随维度急剧下降。",
    },
    {
      title: "重要性采样",
      description: "用提议分布加权样本估计期望，权重校正分布差异。",
      formula: String.raw`\mathbb{E}_p[f] = \mathbb{E}_q\left[ f(x) \frac{p(x)}{q(x)} \right]`,
    }
      ]}
      learningObjectives={[
      "理解 逆变换采样 的含义与作用。",
      "理解 拒绝采样 的含义与作用。",
      "理解 重要性采样 的含义与作用。"
    ]}
      coreIntuition={"基本采样算法从简单分布生成样本：逆变换、拒绝采样、重要性采样与采样-重要性重采样构成了蒙特卡洛基础。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“逆变换采样”，下列说法是否正确？",
        options: ["对均匀随机变量应用 CDF 的逆函数，得到目标分布样本。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对均匀随机变量应用 CDF 的逆函数，得到目标分布样本。",
      },
      {
        question: "关于“拒绝采样”，下列说法是否正确？",
        options: ["需要提议分布 q 满足 kq(x) ≥ p(x)，接受率随维度急剧下降。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。需要提议分布 q 满足 kq(x) ≥ p(x)，接受率随维度急剧下降。",
      },
      {
        question: "关于“重要性采样”，下列说法是否正确？",
        options: ["用提议分布加权样本估计期望，权重校正分布差异。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用提议分布加权样本估计期望，权重校正分布差异。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 14",
      section: "",
      pages: "",
    }}
          demo={{
      title: "重要性采样权重",
      label: "提议与目标均值差 μ",
      param: 0,
      min: -2,
      max: 2,
      step: 0.1,
      compute: (mu) => ({
        label: 'x=0 处权重',
        value: Math.exp(-mu * mu / 2),
        display: String.raw`w(0)=e^{-${(mu * mu / 2).toFixed(2)}}`,
      }),
      formula: String.raw`w(x) = \frac{p(x)}{q(x)}`,
    }}
    />
  );
}
