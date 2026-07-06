import BishopSectionPage from '@/components/BishopSectionPage';
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
      quiz={[
        {
          question: "在 GMM 的 EM 中，E 步计算的是？",
          options: [
            "每个样本属于每个高斯分量的后验责任 γ(z_nk)",
            "高斯参数的极大似然估计",
            "混合系数的梯度",
            "数据的对数似然精确值",
          ],
          correctIndex: 0,
          explanation: "E 步固定当前参数，计算隐变量后验（责任），为 M 步提供权重。",
        },
        {
          question: "广义 EM 与标准 EM 的主要区别是？",
          options: [
            "广义 EM 的 M 步只需提升目标函数，不必完全最大化。",
            "广义 EM 不需要 E 步。",
            "广义 EM 只能用于连续隐变量。",
            "广义 EM 不保证似然单调上升。",
          ],
          correctIndex: 0,
          explanation: "广义 EM 放宽了 M 步要求，允许使用梯度步等部分优化方法。",
        },
        {
          question: "顺序 EM 适用于？",
          options: [
            "数据流或在线学习场景",
            "只有单个样本的数据集",
            "隐变量维数无限的情形",
            "不需要 E 步的模型",
          ],
          correctIndex: 0,
          explanation: "顺序 EM 逐样本更新统计量，适合无法一次性加载全部数据的在线场景。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 15",
        section: "15.4",
        pages: "Ch 15",
        textbookSubsections: ["15.4 Evidence Lower Bound", "15.4.1 EM revisited", "15.4.2 Independent and identically distributed data", "15.4.3 Parameter priors", "15.4.4 Generalized EM", "15.4.5 Sequential EM"],
        formulas: ["ELBO 定义", "EM 的 E-step 与 M-step"],
        algorithms: ["标准 EM", "广义 EM", "顺序 EM"],
        exercises: ["推导 GMM 的 ELBO 并写出 E/M 步。", "比较标准 EM 与广义 EM 的收敛保证。"],
      }}
      demo={{
        title: "KL 项对 ELBO 的影响",
        label: "变分后验标准差 σ",
        param: 1,
        min: 0.1,
        max: 3,
        step: 0.1,
        compute: (sigma) => ({
          label: '-KL(q||N(0,1))',
          value: -0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1),
          display: String.raw`-D_{KL}=${(-0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1)).toFixed(3)}`,
        }),
        formula: String.raw`-D_{KL}\bigl(\mathcal{N}(0,\sigma^2) \| \mathcal{N}(0,1)\bigr) = -\frac{1}{2}(\sigma^2 - \ln \sigma^2 - 1)`,
      }}
    />
  );
}
