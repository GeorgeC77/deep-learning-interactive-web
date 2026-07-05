import BishopSectionPage from '@/components/BishopSectionPage';
import { Route } from 'lucide-react';

export default function Ch11MarkovChainMonteCarloPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/markov-chain-monte-carlo"
      heroIcon={<Route className="w-9 h-9 text-blue-600" />}
      summary={"MCMC 通过构建马尔可夫链产生相关样本，Metropolis-Hastings 与 Gibbs 采样是最常用的两类算法。"}
      concepts={[
    {
      title: "Metropolis 算法",
      description: "按提议分布扰动当前样本，以接受概率决定是否转移到新状态。",
    },
    {
      title: "细致平衡",
      description: "转移核满足细致平衡条件时，链的平稳分布即为目标分布。",
      formula: String.raw`p^*(x) T(x \to x') = p^*(x') T(x' \to x)`,
    },
    {
      title: "Gibbs 采样",
      description: "逐个变量依条件分布采样，特别适用于条件分布易采样的模型。",
    }
      ]}
      learningObjectives={[
      "理解 Metropolis 算法 的含义与作用。",
      "理解 细致平衡 的含义与作用。",
      "理解 Gibbs 采样 的含义与作用。"
    ]}
      coreIntuition={"MCMC 通过构建马尔可夫链产生相关样本，Metropolis-Hastings 与 Gibbs 采样是最常用的两类算法。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“Metropolis 算法”，下列说法是否正确？",
        options: ["按提议分布扰动当前样本，以接受概率决定是否转移到新状态。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。按提议分布扰动当前样本，以接受概率决定是否转移到新状态。",
      },
      {
        question: "关于“细致平衡”，下列说法是否正确？",
        options: ["转移核满足细致平衡条件时，链的平稳分布即为目标分布。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。转移核满足细致平衡条件时，链的平稳分布即为目标分布。",
      },
      {
        question: "关于“Gibbs 采样”，下列说法是否正确？",
        options: ["逐个变量依条件分布采样，特别适用于条件分布易采样的模型。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。逐个变量依条件分布采样，特别适用于条件分布易采样的模型。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 14",
      section: "",
      pages: "",
    }}
          demo={{
      title: "Metropolis 接受概率",
      label: "能量差 ΔE",
      param: 0,
      min: -3,
      max: 3,
      step: 0.1,
      compute: (dE) => ({
        label: '接受概率',
        value: Math.min(1, Math.exp(-dE)),
        display: String.raw`A=\\min(1,e^{-${dE.toFixed(1)}})`,
      }),
      formula: String.raw`A = \min\left(1, \exp\left(-\frac{\Delta E}{T}\right)\right)`,
    }}
    />
  );
}
