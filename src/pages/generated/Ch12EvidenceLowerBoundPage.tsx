import BishopSectionPage from '@/components/BishopSectionPage';
import DiscreteLatentELBODemo from '@/components/demos/DiscreteLatentELBODemo';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter12ElboExercises } from '@/course/chapter12Exercises';
import { Scale } from 'lucide-react';

export default function Ch12EvidenceLowerBoundPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch12/evidence-lower-bound"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"证据下界把对数边缘似然精确拆成可优化的 ELBO 与非负 KL 间隙。精确 EM 的 E-step 令间隙为零，M-step 提升下界；同一视角还能容纳 i.i.d. 分解、参数先验、广义 EM 与顺序 EM。"}
      concepts={[
        {
          title: "ELBO",
          description: "对离散隐变量 Z，ELBO 是对数边缘似然的下界，等号在变分后验等于真实后验时成立。",
          formula: String.raw`\ln p(\mathbf{X} \mid \boldsymbol{\theta}) \ge \mathcal{L}(q,\boldsymbol{\theta}) = \mathbb{E}_q[\ln p(\mathbf{X},\mathbf{Z}\mid\boldsymbol{\theta})] - \mathbb{E}_q[\ln q(\mathbf{Z})]`,
        },
        {
          title: "EM 再审视",
          description: "E 步令 q(Z)=p(Z|X,θ_old)，使 ELBO 紧致；M 步关于 θ 最大化该紧致的 ELBO。",
        },
        {
          title: "独立同分布数据",
          description: "N 个独立样本下，ELBO 可写成每个数据点贡献之和，E 步对每个数据单独求后验。",
        },
        {
          title: "参数先验",
          description: "加入参数先验后，M 步最大化的是完整后验（MAP），而非纯似然。",
        },
        {
          title: "广义 EM",
          description: "M 步不必完全最大化，只需提升 ELBO；适用于 M 步解析解难求的情形。",
        },
        {
          title: "顺序 EM",
          description: "在线设置下逐样本更新充分统计量，适用于数据流场景。",
        },
      ]}
      learningObjectives={[
        "能推导离散隐变量下的 ELBO。",
        "理解 EM 两步与 ELBO 的关系。",
        "区分标准 EM、广义 EM 与顺序 EM。",
      ]}
      coreIntuition={"对数似然是固定屋顶，ELBO 是由 q 支撑的可移动地板；E-step 把地板顶到当前屋顶，M-step 在地板不动时抬高另一处，随后再用新的后验把地板贴紧。"}
      commonMistakes={[
        "把 ELBO 当成通用变分推断公式，忽略 Bishop Ch 15.4 是针对离散隐变量推导的。",
        "认为 M 步必须闭式最大化；广义 EM 允许部分优化。",
        "在 i.i.d. 情形下忘记每个样本有独立的隐变量后验。",
      ]}
      whyCards={[
        {
          question: "为什么需要 ELBO？",
          answer: "对数似然里含有隐变量的积分或求和，直接优化很困难。ELBO 用变分后验构造一个可以计算的下界，把难题变成可解的交替优化。",
        },
        {
          question: "为什么 EM 能保证收敛？",
          answer: "E 步让 ELBO 在当前参数处等于对数似然，M 步提升这个固定下界，因此新参数的对数似然不低于旧值；这保证目标值单调不减，但不保证全局最优。",
        },
      ]}
      counterexamples={[
        "在 GMM 中把 E 步的后验换成均匀分布，ELBO 不再紧致，M 步的提升不再保证对数似然增加——说明后验选择至关重要。",
        "认为 M 步必须全局最优，实际上广义 EM 只要提升 ELBO 就能收敛——说明“最优”不是必要条件。",
      ]}
            bishopMapping={{
        chapter: "Ch 15",
        section: "15.4",
        pages: "§15.4, pp. 485–490",
        textbookSubsections: [
          "15.4 Evidence Lower Bound",
          "15.4.1 EM revisited",
          "15.4.2 Independent and identically distributed data",
          "15.4.3 Parameter priors",
          "15.4.4 Generalized EM",
          "15.4.5 Sequential EM"
        ],
        formulas: ["log p=ELBO+KL (15.52)", "ELBO (15.53)", "参数先验下的 MAP 目标", "顺序充分统计量更新"],
        algorithms: ["精确 EM", "广义 EM", "顺序 EM"],
        exercises: ["识别 ELBO 与似然的 KL 间隙。", "解释精确 E-step 的紧致性。", "比较广义 EM 与参数先验目标。"],
      }}
      extraContent={
        <div className="space-y-10">
          <DiscreteLatentELBODemo />
          <DerivationStepper title="分步推导：ELBO 恒等式如何解释 EM" steps={[
            { label: '乘除任意 q', formula: String.raw`\ln p(\mathbf X\mid\boldsymbol\theta)=\ln\frac{p(\mathbf X,\mathbf Z\mid\boldsymbol\theta)}{p(\mathbf Z\mid\mathbf X,\boldsymbol\theta)}`, explanation: '对任意 q(Z) 求期望不会改变左侧常数；在右侧同时乘除 q，为可优化下界腾出位置。' },
            { label: '定义 ELBO', formula: String.raw`\mathcal L(q,\boldsymbol\theta)=\sum_{\mathbf Z}q(\mathbf Z)\ln\frac{p(\mathbf X,\mathbf Z\mid\boldsymbol\theta)}{q(\mathbf Z)}`, explanation: '它等于 q 下的联合对数概率期望加上 q 的熵，可以在许多隐变量模型中直接计算。' },
            { label: '识别非负间隙', formula: String.raw`\ln p(\mathbf X\mid\boldsymbol\theta)-\mathcal L(q,\boldsymbol\theta)=\mathrm{KL}\!\left(q(\mathbf Z)\,\|\,p(\mathbf Z\mid\mathbf X,\boldsymbol\theta)\right)\ge0`, explanation: 'KL 非负证明 L 是下界；q 等于真实后验时且仅时间隙为零。' },
            { label: '得到 E/M 单调链', formula: String.raw`\ell(\theta^{old})=\mathcal L(q^{new},\theta^{old})\le\mathcal L(q^{new},\theta^{new})\le\ell(\theta^{new})`, explanation: '精确 E-step 令第一处相等，M-step 提升中间项，最后 ELBO 始终不超过新参数的似然；广义 EM 只需保持中间不等式。' },
          ]} />
          <ExercisePanel exerciseSetId="chapter12-elbo" exercises={chapter12ElboExercises} />
        </div>
      }
    />
  );
}
