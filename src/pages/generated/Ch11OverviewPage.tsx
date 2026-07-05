import BishopSectionPage from '@/components/BishopSectionPage';
import { Dices } from 'lucide-react';

export default function Ch11OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/overview"
      heroIcon={<Dices className="w-9 h-9 text-blue-600" />}
      summary={"采样是从复杂分布中获取样本的技术，广泛应用于蒙特卡洛估计、隐变量推断与生成模型训练。"}
      concepts={[
    {
      title: "蒙特卡洛估计",
      description: "用样本均值近似期望，随样本量增加方差以 1/N 下降。",
      formula: String.raw`\mathbb{E}[f] \approx \frac{1}{N} \sum_{n=1}^{N} f(x_n)`,
    },
    {
      title: "拒绝采样",
      description: "用简单提议分布包裹目标分布，按接受概率筛选样本。",
    },
    {
      title: "MCMC",
      description: "构造马尔可夫链使其平稳分布为目标分布，适合高维复杂分布。",
    }
      ]}
      learningObjectives={[
      "理解 蒙特卡洛估计 的含义与作用。",
      "理解 拒绝采样 的含义与作用。",
      "理解 MCMC 的含义与作用。"
    ]}
      coreIntuition={"采样是从复杂分布中获取样本的技术，广泛应用于蒙特卡洛估计、隐变量推断与生成模型训练。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“蒙特卡洛估计”，下列说法是否正确？",
        options: ["用样本均值近似期望，随样本量增加方差以 1/N 下降。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用样本均值近似期望，随样本量增加方差以 1/N 下降。",
      },
      {
        question: "关于“拒绝采样”，下列说法是否正确？",
        options: ["用简单提议分布包裹目标分布，按接受概率筛选样本。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用简单提议分布包裹目标分布，按接受概率筛选样本。",
      },
      {
        question: "关于“MCMC”，下列说法是否正确？",
        options: ["构造马尔可夫链使其平稳分布为目标分布，适合高维复杂分布。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。构造马尔可夫链使其平稳分布为目标分布，适合高维复杂分布。",
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
