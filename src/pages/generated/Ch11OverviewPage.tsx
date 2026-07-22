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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 14",
      pages: "Ch 14",
      textbookSubsections: [],
      formulas: ["蒙特卡洛估计公式"],
      algorithms: ["拒绝采样"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
