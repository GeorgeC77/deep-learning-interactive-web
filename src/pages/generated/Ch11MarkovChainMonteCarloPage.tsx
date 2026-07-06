import BishopSectionPage from '@/components/BishopSectionPage';
import MetropolisHastingsDemo from '@/components/demos/MetropolisHastingsDemo';
import { Route } from 'lucide-react';

export default function Ch11MarkovChainMonteCarloPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/markov-chain-monte-carlo"
      heroIcon={<Route className="w-9 h-9 text-blue-600" />}
      summary={"MCMC 通过构建马尔可夫链产生目标分布的样本。Metropolis 是对称提议下的特例；更一般的 Metropolis-Hastings 接受率包含提议分布的比例修正。"}
      concepts={[
        {
          title: "Metropolis 特例",
          description: "对称提议 q(x'|x)=q(x|x') 且目标写成能量形式 p(x)∝exp(-E(x))、T=1 时的接受率。",
          formula: String.raw`A(x \to x') = \min\!\left(1, \exp(-\Delta E)\right)`,
        },
        {
          title: "Metropolis-Hastings 一般形式",
          description: "非对称提议下必须引入提议比例修正，保证细致平衡。",
          formula: String.raw`A(x \to x') = \min\!\left(1, \frac{p(x')\, q(x \mid x')}{p(x)\, q(x' \mid x)}\right)`,
        },
        {
          title: "细致平衡",
          description: "转移核满足细致平衡时，链的平稳分布即为目标分布。",
          formula: String.raw`p^*(x)\, T(x \to x') = p^*(x')\, T(x' \to x)`,
        },
        {
          title: "Gibbs 采样",
          description: "逐个变量依条件分布采样，可看作 Metropolis-Hastings 接受率恒为 1 的特例。",
        },
      ]}
      learningObjectives={[
        "能写出 Metropolis-Hastings 的一般接受率。",
        "理解对称提议下为何简化为 Metropolis 形式。",
        "知道 Gibbs 采样与 MH 的关系。",
      ]}
      coreIntuition={"Metropolis 像一位挑剔的探险者：随机迈步，如果新位置“更有可能”就接受，否则按概率接受；非对称迈步时还要修正“迈步容易程度”的差异。"}
      commonMistakes={[
        "把 A=min(1, exp(-ΔE)) 当成通用 MH 接受率；它只适用于对称提议+能量形式+T=1。",
        "在非对称提议下仍使用 Metropolis 公式，导致平稳分布不正确。",
        "忽略 MCMC 样本自相关，直接用样本均值的标准误公式。",
      ]}
      quiz={[
        {
          question: "若提议分布 q(x'|x) 不对称，Metropolis 接受率 A=min(1,p(x')/p(x)) 会导致？",
          options: [
            "链的平稳分布不再是目标分布 p，需要用 Hastings 修正。",
            "接受率更高，采样更高效。",
            "结果仍然正确，因为 p 本身是对称的。",
            "算法会立即收敛。",
          ],
          correctIndex: 0,
          explanation: "非对称提议破坏细致平衡，必须引入 q(x|x')/q(x'|x) 修正。",
        },
        {
          question: "在能量形式 p(x)∝exp(-E(x))、对称提议且 T=1 时，MH 接受率退化为？",
          options: [
            "A=min(1, exp(-(E(x')-E(x))))",
            "A=min(1, exp(E(x')-E(x)))",
            "A=1 恒接受",
            "A=p(x)/p(x')",
          ],
          correctIndex: 0,
          explanation: "p(x')/p(x)=exp(-E(x'))/exp(-E(x))=exp(-(E(x')-E(x)))=exp(-ΔE)。",
        },
        {
          question: "Gibbs 采样可以看作 MH 的特例，其接受率是多少？",
          options: ["1（恒接受）", "0.5", "min(1, p(x')/p(x))", "取决于提议方差"],
          correctIndex: 0,
          explanation: "Gibbs 按条件分布采样， proposals 总是来自目标条件分布，因此接受率恒为 1。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 14",
        section: "14.2",
        pages: "Ch 14",
        textbookSubsections: ["14.2.1 Markov chains", "14.2.2 Metropolis algorithm", "14.2.3 Metropolis-Hastings", "14.2.4 Gibbs sampling"],
        formulas: ["Metropolis A=min(1,exp(-ΔE))", "MH 一般接受率", "细致平衡"],
        algorithms: ["Metropolis", "Metropolis-Hastings", "Gibbs sampling"],
        exercises: ["证明对称提议下 MH 退化为 Metropolis。", "在 demo 中对比对称与非对称提议的采样结果。"],
      }}
      extraContent={<MetropolisHastingsDemo />}
    />
  );
}
