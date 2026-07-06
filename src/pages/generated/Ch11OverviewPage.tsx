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
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“蒙特卡洛估计”的叙述，哪一项最准确？",
        options: ["用样本均值近似期望，随样本量增加方差以 1/N 下降。", "蒙特卡洛估计 与本节讨论的问题完全无关。", "蒙特卡洛估计 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。用样本均值近似期望，随样本量增加方差以 1/N 下降。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“拒绝采样”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。拒绝采样 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“MCMC”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。MCMC 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 14",
      pages: "Ch 14",
      textbookSubsections: ["蒙特卡洛估计", "拒绝采样", "MCMC"],
      formulas: ["蒙特卡洛估计公式"],
      algorithms: ["拒绝采样"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
