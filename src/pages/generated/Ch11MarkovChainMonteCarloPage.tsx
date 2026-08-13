import BishopSectionPage from '@/components/BishopSectionPage';
import MetropolisHastingsDemo from '@/components/demos/MetropolisHastingsDemo';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter11McmcExercises } from '@/course/chapter11Exercises';
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
          description: "状态序列依转移核演化；细致平衡可保证目标分布不变，遍历性条件则保证链从初始状态收敛到目标。采样初期需要 burn-in，样本之间存在自相关。",
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
        "理解马尔可夫链的平稳分布、burn-in 与样本自相关。",
        "知道 Gibbs 采样与 MH 的关系，以及祖先采样在图模型中的应用。",
      ]}
      coreIntuition={"Metropolis 像一位挑剔的探险者：随机迈步，如果新位置‘更有可能’就接受，否则按概率接受；非对称迈步时还要修正‘迈步容易程度’的差异。"}
      commonMistakes={[
        "把 A=min(1, exp(-ΔE)) 当成通用 MH 接受率；它只适用于对称提议与 p(z)∝exp{-E(z)} 的能量形式。",
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
        pages: "§14.2, pp. 440–451",
        textbookSubsections: [
          "14.2 Markov Chain Monte Carlo",
          "14.2.1 The Metropolis algorithm",
          "14.2.2 Markov chains",
          "14.2.3 The Metropolis–Hastings algorithm",
          "14.2.4 Gibbs sampling",
          "14.2.5 Ancestral sampling"
        ],
        formulas: ["Metropolis A=min(1,exp(-ΔE))", "MH 一般接受率", "细致平衡"],
        algorithms: ["Metropolis", "Metropolis-Hastings", "Gibbs sampling", "ancestral sampling"],
        exercises: [
          "写出对称提议下的 Metropolis 接受率。",
          "解释候选状态被拒绝后为何必须重复当前状态。",
          "区分 Gibbs 条件更新与 DAG 祖先采样。",
        ],
      }}
      extraContent={<div className="space-y-10"><MetropolisHastingsDemo /><DerivationStepper title="分步推导：MH 接受率如何保证目标分布不变" steps={[
        { label: '正向已接受流量', formula: String.raw`p(z)q(z'\mid z)A(z\to z')`, explanation: '处在 z、提议 z′ 且接受的联合概率质量，就是链从 z 流向 z′ 的概率流。' },
        { label: '要求细致平衡', formula: String.raw`p(z)q(z'\mid z)A(z\to z')=p(z')q(z\mid z')A(z'\to z)`, explanation: '让每对状态之间的正反流量相等，是保证 p 为平稳分布的充分条件。' },
        { label: '构造比率', formula: String.raw`r=\frac{p(z')q(z\mid z')}{p(z)q(z'\mid z)}`, explanation: '未知的目标归一化常数在比值中相消，因此只需计算未归一化密度。' },
        { label: '截断为概率', formula: String.raw`A(z\to z')=\min(1,r)`, explanation: '若 r≥1 则正向必接收、反向以 1/r 接收；若 r<1 则角色互换，两种情况都满足细致平衡。' },
      ]} /><ExercisePanel exerciseSetId="chapter11-mcmc" exercises={chapter11McmcExercises} /></div>}
    />
  );
}
