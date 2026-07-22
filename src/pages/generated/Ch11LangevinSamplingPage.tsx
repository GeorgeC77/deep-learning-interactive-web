import BishopSectionPage from '@/components/BishopSectionPage';
import LangevinSamplingLab from '@/components/demos/LangevinSamplingLab';
import { Wind } from 'lucide-react';

export default function Ch11LangevinSamplingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/langevin-sampling"
      heroIcon={<Wind className="w-9 h-9 text-blue-600" />}
      summary={"Langevin 采样为基于能量的模型提供了一种利用 score function 的近似采样方式。由于 partition function 难以计算，最大似然训练需要区分数据期望与模型期望；Langevin 动力学在步长足够小且满足正则条件时，可近似地从模型分布生成样本。"}
      concepts={[
        {
          title: "Energy-based models",
          description: "概率密度由能量函数通过 Boltzmann 分布定义，partition function Z(w) 通常难以显式计算。",
          formula: "p(x \\mid w) = \\frac{1}{Z(w)} \\exp\\{-E(x, w)\\}",
        },
        {
          title: "Maximum likelihood for EBMs",
          description: "对数似然梯度包含数据期望与模型期望两项，后者需要从当前模型分布中采样估计。",
        },
        {
          title: "Score function",
          description: "score 是对数据 x 的对数概率梯度，等于负的能量梯度；它绕过了归一化常数 Z(w)。",
          formula: "s(x, w) = \\nabla_x \\ln p(x \\mid w) = -\\nabla_x E(x, w)",
        },
        {
          title: "Langevin dynamics",
          description: "这是 Euler–Maruyama 离散化形式：沿 score 方向移动并注入高斯噪声，可迭代生成近似来自模型分布的样本。精确收敛通常需要足够小或衰减的步长以及能量函数的正则性假设。",
          formula: "x^{\\tau+1} = x^{\\tau} + \\eta \\nabla_x \\ln p(x^{\\tau}, w) + \\sqrt{2\\eta}\\, \\epsilon^{\\tau}",
        },
      ]}
      learningObjectives={[
        "理解能量模型 p(x|w) 的形式与 partition function 的困难。",
        "能推导 score function s(x,w)=-∇_x E(x,w)。",
        "理解 Langevin dynamics 的离散化本质以及步长 η 对稳定性的影响。",
      ]}
      coreIntuition={"Langevin 采样像在水面上随波逐流：score 告诉样本该往哪个‘概率更高’的方向移动，噪声帮助探索；但离散化会引入偏差，精确收敛到目标分布通常需要足够小或衰减的步长以及能量函数的正则性假设。"}
      commonMistakes={[
        "把 score function 误当成对参数 w 的梯度；它实际是对数据 x 的梯度。",
        "忽略 EBM 中 partition function 对最大似然训练的影响。",
        "使用过大步长 η，导致 Langevin 链不稳定或偏离目标分布。",
        "把有限步长的离散更新当成目标分布的精确样本。",
      ]}
            bishopMapping={{
        chapter: "Ch 14",
        section: "14.3",
        pages: "Ch 14",
        textbookSubsections: [
          "14.3.1 Energy-based models",
          "14.3.2 Maximizing the likelihood",
          "14.3.3 Langevin dynamics",
        ],
        formulas: [
          "p(x|w)=Z^{-1}exp{-E(x,w)}",
          "s(x,w)=-∇_x E(x,w)",
          "Langevin update",
        ],
        algorithms: ["Langevin dynamics"],
        exercises: [
          "从 p(x)=Z^{-1}exp{-E(x)} 推导 s(x)=-∇E(x)。",
          "对一维高斯目标写出 Langevin 更新式。",
          "比较 Langevin sampling 与普通随机游走 MH 的差异。",
        ],
      }}
      interactiveDemo={<LangevinSamplingLab />}
    />
  );
}
