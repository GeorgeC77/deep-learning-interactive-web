import BishopSectionPage from '@/components/BishopSectionPage';
import MDNLab from '@/components/demos/MDNLab';
import { GitBranch } from 'lucide-react';

export default function Ch03MixtureDensityNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/mixture-density-networks"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={
        "混合密度网络用神经网络输出条件混合分布的参数，从而建模多峰、非单值的逆问题映射。与最小二乘回归只给出单一预测不同，MDN 输出完整的条件概率密度。"
      }
      concepts={[
        {
          title: "条件混合分布",
          description: "网络同时预测混合系数 π_k(x)、均值 μ_k(x) 与方差 σ_k²(x)，输出完整的条件概率密度。",
          formula: String.raw`p(t \mid x) = \sum_{k=1}^{K} \pi_k(x) \, \mathcal{N}\bigl(t \mid \mu_k(x), \sigma_k^2(x)\bigr)`,
        },
        {
          title: "机器人运动学示例",
          description: "同一末端位置可能对应多个关节角，单值回归会取平均导致错误解；混合分布可表示多个可行解。",
        },
        {
          title: "似然训练",
          description: "直接最大化条件对数似然，网络自动学习何时需要多峰输出。",
          formula: String.raw`\mathcal{L} = \sum_n \ln p(t_n \mid x_n)`,
        },
        {
          title: "条件均值、条件模态与采样",
          description: "条件均值给出最小二乘预测；条件模态对应多个可能解；从混合模型采样可得到服从目标分布的新样本。",
          formula: String.raw`\mathbb{E}[t \mid x] = \sum_k \pi_k \mu_k,\quad \text{modes} = \arg\max_t p(t \mid x)`,
        },
      ]}
      learningObjectives={[
        "理解条件混合分布如何表示多峰条件密度",
        "能解释为什么逆问题需要多峰输出而非单一均值",
        "掌握 MDN 参数 π_k、μ_k、σ_k 的含义与约束",
        "能计算条件均值、条件模态并从中采样",
      ]}
      coreIntuition={
        "普通回归像强行把一把散开的点拟合成一条线；混合密度网络则说'对于同一个 x，t 可能有几个不同的取值'。它不只给出一个答案，而是给出答案的概率分布。"
      }
      commonMistakes={[
        "把 MDN 的混合系数 π_k 当作独立的类别概率——它们必须非负且和为 1",
        "对逆问题仍使用 MSE 回归——单值预测会落在多个可行解之间的错误位置",
        "忽略高斯分量的归一化常数 1/√(2πσ²)，把未归一化的核密度当作概率密度",
        "忘记 σ_k 必须为正，通常通过 exp(·) 输出保证",
      ]}
            bishopMapping={{
        chapter: "Ch 6",
        section: "6.5",
        pages: "Ch 6",
        textbookSubsections: [
          "6.5 Mixture Density Networks",
          "6.5.1 Robot kinematics example",
          "6.5.2 Conditional mixture distributions",
          "6.5.3 Gradient optimization",
          "6.5.4 Predictive distribution",
        ],
        formulas: [
          "p(t|x) = Σ_k π_k(x) N(t|μ_k(x),σ_k²(x))",
          "conditional mean = Σ_k π_k μ_k",
          "Gaussian normalization 1/√(2πσ²)",
        ],
        algorithms: ["似然训练", "混合密度采样"],
        exercises: [
          "说明混合密度网络为何适合逆问题",
          "给定 π_k、μ_k、σ_k 手算 p(t=0)",
          "比较条件均值与条件模态在逆问题中的差异",
        ],
      }}
      demo={{
        title: "两个高斯分量的混合密度",
        label: "混合系数 π₁",
        param: 0.5,
        min: 0,
        max: 1,
        step: 0.05,
        compute: (pi) => {
          const norm = 1 / Math.sqrt(2 * Math.PI);
          const val = norm * (pi + (1 - pi) * Math.exp(-2));
          return {
            label: 'p(t=0)',
            value: val,
            display: String.raw`p(0)=\frac{${pi.toFixed(2)}+${(1 - pi).toFixed(2)}e^{-2}}{\sqrt{2\pi}}=${val.toFixed(4)}`,
          };
        },
        formula: String.raw`p(0) = \frac{\pi_1 + \pi_2 e^{-2}}{\sqrt{2\pi}}`,
      }}
      interactiveDemo={<MDNLab />}
    />
  );
}
