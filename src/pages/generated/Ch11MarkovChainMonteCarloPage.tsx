import BishopSectionPage from '@/components/BishopSectionPage';
import MetropolisHastingsDemo from '@/components/demos/MetropolisHastingsDemo';
import { Route } from 'lucide-react';

export default function Ch11MarkovChainMonteCarloPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/markov-chain-monte-carlo"
      heroIcon={<Route className="w-9 h-9 text-blue-600" />}
      summary={"MCMC 通过构造马尔可夫链从复杂分布中采样。理解状态转移、平稳分布、burn-in、自相关，以及 Metropolis、Metropolis-Hastings、Gibbs 与祖先采样之间的关系，是掌握蒙特卡洛推断的基础。"}
      concepts={[
        {
          title: "Markov chains",
          description: "状态序列依转移核演化；若链不可约、非周期且满足细致平衡，则存在唯一平稳分布。采样初期需要 burn-in 以接近平稳分布，样本之间存在自相关。",
        },
        {
          title: "The Metropolis algorithm",
          description: "对称提议 q(x'|x)=q(x|x') 下，接受率只依赖目标分布比值；目标写成能量形式 p(x)∝exp(-E(x)) 时退化为 A=min(1,exp(-ΔE))。",
          formula: String.raw`A(x \to x') = \min\!\left(1, \frac{p(x')}{p(x)}\right)`,
        },
        {
          title: "The Metropolis–Hastings algorithm",
          description: "非对称提议下引入提议比例修正，保证细致平衡，使平稳分布仍为目标分布。",
          formula: String.raw`A(x \to x') = \min\!\left(1, \frac{p(x')\, q(x \mid x')}{p(x)\, q(x' \mid x)}\right)`,
        },
        {
          title: "Detailed balance",
          description: "转移核满足细致平衡时，链的平稳分布即为目标分布。",
          formula: String.raw`p^*(x)\, T(x \to x') = p^*(x')\, T(x' \to x)`,
        },
        {
          title: "Gibbs sampling",
          description: "逐个变量依条件分布采样，可看作 Metropolis-Hastings 接受率恒为 1 的特例。",
        },
        {
          title: "Ancestral sampling",
          description: "在有向图模型中按拓扑顺序从每个变量的条件分布依次采样，直接得到联合分布样本。",
        },
      ]}
      learningObjectives={[
        "能写出 Metropolis-Hastings 的一般接受率，并解释对称提议下的简化。",
        "理解马尔可夫链的平稳分布、brown-in 与样本自相关。",
        "知道 Gibbs 采样与 MH 的关系，以及祖先采样在图模型中的应用。",
      ]}
      coreIntuition={"Metropolis 像一位挑剔的探险者：随机迈步，如果新位置‘更有可能’就接受，否则按概率接受；非对称迈步时还要修正‘迈步容易程度’的差异。"}
      commonMistakes={[
        "把 A=min(1, exp(-ΔE)) 当成通用 MH 接受率；它只适用于对称提议+能量形式+T=1。",
        "在非对称提议下仍使用 Metropolis 公式，导致平稳分布不正确。",
        "忽略 MCMC 样本自相关，直接用独立样本的标准误公式估计方差。",
      ]}
      whyCards={[
        {
          question: "为什么需要 Metropolis-Hastings 修正？",
          answer: "当提议分布不对称时，从 x 到 x' 和从 x' 到 x 的“容易程度”不同，需要用提议比例来修正，保证链最终收敛到目标分布。",
        },
        {
          question: "为什么 MCMC 样本不能直接当作独立样本？",
          answer: "相邻样本通过转移核相关联，自相关系数高。用独立样本公式会低估方差，导致过于自信的结论。",
        },
      ]}
      counterexamples={[
        "用对称提议公式处理非对称提议，链的平稳分布不再是目标分布——说明修正项不是可有可无的。",
        "把 burn-in 阶段的样本也计入平均，估计结果会严重偏离真实值——说明预热阶段必须丢弃。",
      ]}
            bishopMapping={{
        chapter: "Ch 14",
        section: "14.2",
        pages: "Ch 14",
        textbookSubsections: [
          "14.2.1 The Metropolis algorithm",
          "14.2.2 Markov chains",
          "14.2.3 The Metropolis–Hastings algorithm",
          "14.2.4 Gibbs sampling",
          "14.2.5 Ancestral sampling"
        ],
        formulas: ["Metropolis A=min(1,exp(-ΔE))", "MH 一般接受率", "细致平衡"],
        algorithms: ["Metropolis", "Metropolis-Hastings", "Gibbs sampling", "ancestral sampling"],
        exercises: [
          "证明对称提议下 MH 退化为 Metropolis。",
          "在 demo 中对比对称与非对称提议的采样结果。",
          "说明祖先采样与 Gibbs 采样在图模型中的异同。",
        ],
      }}
      extraContent={<MetropolisHastingsDemo />}
    />
  );
}
