import BishopSectionPage from '@/components/BishopSectionPage';
import { Wind } from 'lucide-react';

export default function Ch11LangevinSamplingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch11/langevin-sampling"
      heroIcon={<Wind className="w-9 h-9 text-blue-600" />}
      summary={"Langevin 采样为基于能量的模型提供了一种利用 score function 的采样方式。由于 partition function 难以计算，最大似然训练需要区分数据期望与模型期望；Langevin 动力学则沿着 score 方向并加入噪声，从模型分布中生成样本。"}
      concepts={[
        {
          title: "Energy-based models",
          description: "概率密度由能量函数通过 Boltzmann 分布定义，partition function Z(w) 通常难以显式计算。",
          formula: String.raw`p(x \mid w) = \frac{1}{Z(w)} \exp\{-E(x, w)\}`,
        },
        {
          title: "Maximum likelihood for EBMs",
          description: "对数似然梯度包含数据期望与模型期望两项，后者需要从当前模型分布中采样估计。",
        },
        {
          title: "Score function",
          description: "score 是对数据 x 的对数概率梯度，等于负的能量梯度；它绕过了归一化常数 Z(w)。",
          formula: String.raw`s(x, w) = \nabla_x \ln p(x \mid w) = -\nabla_x E(x, w)`,
        },
        {
          title: "Langevin dynamics",
          description: "沿 score 方向移动并注入高斯噪声，迭代生成近似来自模型分布的样本。",
          formula: String.raw`x^{\tau+1} = x^{\tau} + \eta \nabla_x \ln p(x^{\tau}, w) + \sqrt{2\eta}\, \epsilon^{\tau}`,
        },
      ]}
      learningObjectives={[
        "理解能量模型 p(x|w) 的形式与 partition function 的困难。",
        "能推导 score function s(x,w)=-∇_x E(x,w)。",
        "理解 Langevin dynamics 的更新式以及步长 η 对稳定性的影响。",
      ]}
      coreIntuition={"Langevin 采样像在水面上随波逐流：score 告诉样本该往哪个‘概率更高’的方向移动，噪声则保证不会被困在局部高点，最终覆盖整个目标分布。"}
      commonMistakes={[
        "把 score function 误当成对参数 w 的梯度；它实际是对数据 x 的梯度。",
        "忽略 EBM 中 partition function 对最大似然训练的影响。",
        "使用过大步长 η，导致 Langevin 链不稳定或偏离目标分布。",
      ]}
      quiz={[
        {
          question: "为什么 EBM 的 partition function 会导致训练困难？",
          options: [
            "Z(w) 通常需要在整个数据空间上积分，难以解析或精确计算。",
            "它使能量函数 E(x,w) 不再可微。",
            "它导致 score function 无法定义。",
            "它让模型只能描述离散分布。",
          ],
          correctIndex: 0,
          explanation: "Z(w)=∫exp{-E(x,w)}dx 通常没有闭式解，最大似然梯度中的模型期望需要通过采样近似。",
        },
        {
          question: "若 E(x)=x²/2，则 score s(x)=∇_x ln p(x) 等于多少？",
          options: ["-x", "x", "-x²/2", "1"],
          correctIndex: 0,
          explanation: "s(x)=-∇_x E(x)=-x；这正是标准高斯分布的 score。",
        },
        {
          question: "Langevin step size η 过大时最可能发生什么？",
          options: [
            "采样链变得不稳定，可能偏离目标分布。",
            "样本自动收敛到全局最大概率点。",
            "噪声项的作用消失。",
            "接受率下降为零。",
          ],
          correctIndex: 0,
          explanation: "η 过大相当于离散化步长过大，会放大噪声并破坏 Langevin 动力学的稳定性。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 14",
        section: "14.3",
        pages: "Ch 14",
        textbookSubsections: [
          "14.3.1 Energy-based models",
          "14.3.2 Maximizing the likelihood",
          "14.3.3 Langevin dynamics"
        ],
        formulas: [
          "p(x|w)=Z^{-1}exp{-E(x,w)}",
          "s(x,w)=-∇_x E(x,w)",
          "Langevin update"
        ],
        algorithms: ["Langevin dynamics"],
        exercises: [
          "从 p(x)=Z^{-1}exp{-E(x)} 推导 s(x)=-∇E(x)。",
          "对一维高斯目标写出 Langevin 更新式。",
          "比较 Langevin sampling 与普通随机游走 MH 的差异。",
        ],
      }}
    />
  );
}
