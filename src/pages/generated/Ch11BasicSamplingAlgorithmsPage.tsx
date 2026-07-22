import BishopSectionPage from '@/components/BishopSectionPage';
import ImportanceSamplingDemo from '@/components/demos/ImportanceSamplingDemo';
import { Shuffle } from 'lucide-react';

export default function Ch11BasicSamplingAlgorithmsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/basic-sampling-algorithms"
      heroIcon={<Shuffle className="w-9 h-9 text-blue-600" />}
      summary={"基本采样算法从简单分布生成样本：逆变换、拒绝采样、重要性采样与采样-重要性重采样构成蒙特卡洛基础。重要性采样的权重必须正确定义为 p(x)/q(x)。"}
      concepts={[
        {
          title: "逆变换采样",
          description: "若 U~Uniform(0,1)，则 X=F^{-1}(U) 服从分布 F。",
          formula: String.raw`X = F^{-1}(U), \quad U \sim \text{Uniform}(0,1)`,
        },
        {
          title: "拒绝采样",
          description: "需要提议分布 q 满足 k q(x) ≥ p(x)，按 p/(kq) 接受样本；高维接受率极低。",
        },
        {
          title: "重要性采样",
          description: "用提议分布 q 的加权样本估计关于 p 的期望，权重 w(x)=p(x)/q(x)。",
          formula: String.raw`\mathbb{E}_p[f(X)] = \mathbb{E}_q\left[ f(X) \frac{p(X)}{q(X)} \right]`,
        },
        {
          title: "自归一化重要性采样",
          description: "当 p 只能计算到归一化常数时，用权重归一化代替真实分布。",
          formula: String.raw`\hat{\mu} = \frac{\sum_i w_i f(x_i)}{\sum_i w_i}, \quad w_i = \frac{\tilde{p}(x_i)}{q(x_i)}`,
        },
        {
          title: "Standard distributions",
          description: "均匀、高斯等基础分布及 Box-Muller、Cholesky 等生成方法，是复杂采样算法的基本构件。",
        },
        {
          title: "Adaptive rejection sampling",
          description: "针对 log-concave 目标分布，自动构造并收紧自适应 envelope，提高拒绝采样效率。",
        },
        {
          title: "Sampling-importance-resampling",
          description: "先从提议分布 q 采样，再按重要性权重归一化后重采样，得到近似来自目标分布 p 的样本。",
        },
      ]}
      learningObjectives={[
        "掌握逆变换采样与拒绝采样的原理与局限。",
        "能正确推导并计算重要性采样权重。",
        "理解有效样本量 ESS 的意义。",
      ]}
      coreIntuition={"如果不会直接从 p 采样，就从一个简单的 q 采样，再用权重把样本“拉回到”p；q 与 p 差别越大，需要的权重越不平衡，有效样本越少。"}
      commonMistakes={[
        "把重要性权重写成 q/p 而不是 p/q，导致估计有偏。",
        "在 p=N(0,1), q=N(μ,1) 时错误认为 w(0)=exp(-μ²/2)；正确应为 exp(μ²/2)。",
        "忽视拒绝采样在高维空间的指数级低效，强行用于高维问题。",
      ]}
            bishopMapping={{
        chapter: "Ch 14",
        section: "14.1",
        pages: "Ch 14",
        textbookSubsections: [
          "14.1.1 Expectations",
          "14.1.2 Standard distributions",
          "14.1.3 Rejection sampling",
          "14.1.4 Adaptive rejection sampling",
          "14.1.5 Importance sampling",
          "14.1.6 Sampling-importance-resampling"
        ],
        formulas: ["逆变换 X=F⁻¹(U)", "重要性采样 E_p[f]=E_q[f·p/q]", "自归一化权重"],
        algorithms: ["逆变换采样", "拒绝采样", "重要性采样", "SIR"],
        exercises: ["推导 p=N(0,1), q=N(μ,1) 时 w(0) 的表达式。", "用 demo 观察 ESS 随 μ 远离 0 的变化。"],
      }}
      extraContent={<ImportanceSamplingDemo />}
    />
  );
}
