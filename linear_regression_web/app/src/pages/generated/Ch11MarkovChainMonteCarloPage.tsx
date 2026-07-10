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
        {
          question: "Markov chain 的平稳分布是什么意思？",
          options: [
            "一旦链达到该分布，后续转移不再改变其边际分布。",
            "链在有限步内必然收敛到的初始分布。",
            "所有状态概率都相等的均匀分布。",
            "提议分布的对称形式。",
          ],
          correctIndex: 0,
          explanation: "平稳分布满足 π(x')=∑_x π(x)T(x→x')，是链的长期边际分布。",
        },
        {
          question: "什么时候 MH 接受率可以退化为 Metropolis 接受率 A=min(1,p(x')/p(x))？",
          options: [
            "当提议分布对称，即 q(x'|x)=q(x|x') 时。",
            "当目标分布是对称高斯时。",
            "当使用 Gibbs 提议时。",
            "当链已经收敛到平稳分布时。",
          ],
          correctIndex: 0,
          explanation: "对称提议下 q(x'|x)/q(x|x')=1，Hastings 修正项消失，MH 退化为 Metropolis。",
        },
        {
          question: "为什么 MCMC 样本不能当成完全独立样本？",
          options: [
            "因为相邻样本由马尔可夫转移核生成，存在自相关。",
            "因为 MH 接受率总是小于 1。",
            "因为 burn-in 会删除样本。",
            "因为平稳分布不存在。",
          ],
          correctIndex: 0,
          explanation: "MCMC 样本按转移核顺序生成，相邻样本高度相关；估计方差时需考虑有效样本量。",
        },
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
