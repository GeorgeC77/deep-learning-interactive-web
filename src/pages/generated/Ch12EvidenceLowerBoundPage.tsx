import BishopSectionPage from '@/components/BishopSectionPage';
import DiscreteLatentELBODemo from '@/components/demos/DiscreteLatentELBODemo';
import { Scale } from 'lucide-react';

export default function Ch12EvidenceLowerBoundPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch12/evidence-lower-bound"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"Bishop Ch 15.4 从离散隐变量（如 GMM）出发，介绍证据下界 ELBO、EM 再审视、i.i.d. 数据、参数先验、广义 EM 与顺序 EM。"}
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
      coreIntuition={"对数似然像一座冰山，隐变量在水下；ELBO 用一座更容易攀爬的‘山’去逼近它，EM 则交替调整山的形状和位置。"}
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
          answer: "E 步让 ELBO 在当前参数处与对数似然相切，M 步提升这个下界，因此对数似然单调不减，必然收敛到局部极值。",
        },
      ]}
      counterexamples={[
        "在 GMM 中把 E 步的后验换成均匀分布，ELBO 不再紧致，M 步的提升不再保证对数似然增加——说明后验选择至关重要。",
        "认为 M 步必须全局最优，实际上广义 EM 只要提升 ELBO 就能收敛——说明“最优”不是必要条件。",
      ]}
            bishopMapping={{
        chapter: "Ch 15",
        section: "15.4",
        pages: "Ch 15",
        textbookSubsections: [
          "15.4 Evidence Lower Bound",
          "15.4.1 EM revisited",
          "15.4.2 Independent and identically distributed data",
          "15.4.3 Parameter priors",
          "15.4.4 Generalized EM",
          "15.4.5 Sequential EM"
        ],
        formulas: ["ELBO 定义", "EM 的 E-step 与 M-step"],
        algorithms: ["标准 EM", "广义 EM", "顺序 EM"],
        exercises: ["推导 GMM 的 ELBO 并写出 E/M 步。", "比较标准 EM 与广义 EM 的收敛保证。"],
      }}
      extraContent={<DiscreteLatentELBODemo />}
    />
  );
}
