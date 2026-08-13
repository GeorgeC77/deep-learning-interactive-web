import BishopSectionPage from '@/components/BishopSectionPage';
import ImportanceSamplingDemo from '@/components/demos/ImportanceSamplingDemo';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter11BasicSamplingExercises } from '@/course/chapter11Exercises';
import { Shuffle } from 'lucide-react';

export default function Ch11BasicSamplingAlgorithmsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/basic-sampling-algorithms"
      heroIcon={<Shuffle className="w-9 h-9 text-blue-600" />}
      summary={"基本采样算法从简单分布生成样本：逆变换、拒绝采样、重要性采样与采样-重要性重采样构成蒙特卡洛基础。重要性采样的权重必须正确定义为 p(x)/q(x)。"}
      concepts={[
        {
          title: "期望的蒙特卡洛估计",
          description: "用 L 个独立样本的函数值均值估计期望；估计量无偏，方差为 var[f]/L，但相关样本的有效样本量会更小。",
          formula: String.raw`\mathbb E[f]\simeq\frac1L\sum_{l=1}^{L}f(z^{(l)}),\qquad \operatorname{var}(\hat f)=\frac{\operatorname{var}(f)}{L}`,
        },
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
      whyCards={[
        {
          question: "为什么重要性采样能估计目标分布的期望？",
          answer: "我们不能直接从 p 采样，但可以从简单的 q 采样，再用权重 p/q 把每个样本“校正”回 p 的贡献。",
        },
        {
          question: "为什么拒绝采样在高维失效？",
          answer: "高维空间中，目标分布和提议分布的重叠区域指数级缩小，接受率会低到几乎无法使用。",
        },
      ]}
      counterexamples={[
        "用 N(5,1) 作为提议分布估计 N(0,1) 的期望，虽然数学上可行，但有效样本量会极低——说明提议分布必须接近目标。",
        "把重要性权重写成 q/p 而不是 p/q，估计结果会系统性偏离真实值——说明权重方向至关重要。",
      ]}
            bishopMapping={{
        chapter: "Ch 14",
        section: "14.1",
        pages: "§14.1, pp. 430–440",
        textbookSubsections: [
          "14.1 Basic Sampling Algorithms",
          "14.1.1 Expectations",
          "14.1.2 Standard distributions",
          "14.1.3 Rejection sampling",
          "14.1.4 Adaptive rejection sampling",
          "14.1.5 Importance sampling",
          "14.1.6 Sampling-importance-resampling"
        ],
        formulas: ["逆变换 X=F⁻¹(U)", "重要性采样 E_p[f]=E_q[f·p/q]", "自归一化权重"],
        algorithms: ["逆变换采样", "拒绝采样", "重要性采样", "SIR"],
        exercises: ["判断蒙特卡洛方差随样本量的变化。", "从包络条件推出拒绝采样接受率。", "判断重要性提议的支持条件。"],
      }}
      extraContent={<div className="space-y-10"><ImportanceSamplingDemo /><DerivationStepper title="分步推导：未知归一化常数时如何做重要性采样" steps={[
        { label: '换分布积分', formula: String.raw`\mathbb E_p[f]=\int f(z)p(z)\,dz=\int f(z)\frac{p(z)}{q(z)}q(z)\,dz`, explanation: '只要 q 在 p(z)f(z) 有贡献的区域为正，就可把对 p 的积分改写成对易采样分布 q 的期望。' },
        { label: '已归一化权重', formula: String.raw`\mathbb E_p[f]\simeq\frac1L\sum_{l=1}^{L}f(z^{(l)})\frac{p(z^{(l)})}{q(z^{(l)})}`, explanation: '若 p、q 的归一化密度都可计算，样本贡献乘似然比 p/q；权重方向不能颠倒。' },
        { label: '未归一化目标', formula: String.raw`\widetilde r_l=\frac{\widetilde p(z^{(l)})}{q(z^{(l)})},\qquad w_l=\frac{\widetilde r_l}{\sum_m\widetilde r_m}`, explanation: '把未知 Zp 同时写入分子和权重总和，归一化常数相消，得到非负且和为 1 的权重。' },
        { label: '自归一化估计', formula: String.raw`\mathbb E_p[f]\simeq\sum_{l=1}^{L}w_lf(z^{(l)}),\qquad \mathrm{ESS}=\frac{(\sum_l\widetilde r_l)^2}{\sum_l\widetilde r_l^2}`, explanation: '权重集中时 ESS 远小于 L；增加大量来自错误区域的 q 样本也未必能提供等量信息。' },
      ]} /><ExercisePanel exerciseSetId="chapter11-basic-sampling" exercises={chapter11BasicSamplingExercises} /></div>}
    />
  );
}
