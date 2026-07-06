import BishopSectionPage from '@/components/BishopSectionPage';
import { Activity } from 'lucide-react';

export default function Ch17ScoreMatchingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/score-matching"
      heroIcon={<Activity className="w-9 h-9 text-blue-600" />}
      summary={"分数匹配通过估计数据对数密度的梯度（分数函数）来建模分布；去噪分数匹配与扩散训练目标等价。本页采用 DDPM 记号 x_t；Bishop 教材中对应状态常记为 z_t。"}
      concepts={[
        {
          title: "分数函数",
          description: "分数是对数密度关于输入的梯度，指向数据密度增加最快的方向。",
          formula: String.raw`s(x) = \nabla_x \ln p(x)`,
        },
        {
          title: "分数匹配损失",
          description: "用模型分数与真实分数之间的 Fisher 散度作为目标；去噪分数匹配通过加噪样本避免直接求迹。",
        },
        {
          title: "噪声水平与多尺度",
          description: "对不同噪声尺度的扰动数据训练分数网络，形成退火 Langevin 动力学。",
        },
        {
          title: "与扩散模型的联系",
          description: "扩散模型中的噪声预测网络 ε_θ(x_t,t) 与扰动数据分布的分数成比例。",
          formula: String.raw`\nabla_{x_t} \ln q(x_t) \approx -\frac{\epsilon_\theta(x_t, t)}{\sqrt{1-\bar{\alpha}_t}}`,
        },
      ]}
      learningObjectives={[
        "理解分数函数的含义。",
        "能说明分数匹配与扩散噪声预测目标的等价性。",
        "了解多尺度分数匹配的必要性。",
      ]}
      coreIntuition={"分数函数告诉我们“朝哪个方向走能到达数据密度更高的地方”；在生成模型中，沿着分数方向走就能从噪声回到数据流形。"}
      commonMistakes={[
        "把分数函数等同于概率密度；分数是密度的梯度，不是密度本身。",
        "忽略低数据密度区域分数估计不准的问题，导致 Langevin 采样失败。",
        "认为单尺度分数网络足以覆盖所有噪声水平；实际需多尺度训练。",
      ]}
      quiz={[
        {
          question: "对于标准高斯 N(0,1)，分数函数 s(x) 等于？",
          options: ["-x", "x", "1/√(2π) exp(-x²/2)", "0"],
          correctIndex: 0,
          explanation: "s(x)=∇_x ln p(x)=∇_x(-x²/2 - const)=-x。",
        },
        {
          question: "去噪分数匹配的主要优势是？",
          options: [
            "避免直接计算分数函数的海森迹，通过加噪样本得到 unbiased 估计。",
            "完全不需要神经网络。",
            "可以直接得到归一化密度。",
            "只适用于离散数据。",
          ],
          correctIndex: 0,
          explanation: "原始分数匹配需要估计海森迹；去噪分数匹配通过前向加噪闭式避免这一点。",
        },
        {
          question: "扩散模型中噪声预测网络 ε_θ(x_t,t) 与分数函数的关系是？",
          options: [
            "分数与噪声预测成比例，比例系数取决于噪声 schedule。",
            "两者完全无关。",
            "分数等于噪声预测的平方。",
            "噪声预测是分数的积分。",
          ],
          correctIndex: 0,
          explanation: "在扰动数据分布下，分数指向减去噪声的方向，与 ε_θ 成正比。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 20",
        section: "20.3",
        pages: "Ch 20",
        textbookSubsections: ["20.3.1 Score function", "20.3.2 Score matching loss", "20.3.3 Noise levels", "20.3.4 Connection to diffusion"],
        formulas: ["分数函数 s(x)=∇ln p(x)", "分数与噪声预测关系"],
        algorithms: ["去噪分数匹配", "退火 Langevin 动力学"],
        exercises: ["推导高斯混合分布的分数函数。", "说明扩散噪声预测损失为何等价于去噪分数匹配。"],
      }}
      demo={{
        title: "高斯分布的分数",
        label: "位置 x",
        param: 1,
        min: -3,
        max: 3,
        step: 0.1,
        compute: (x) => ({
          label: 'N(0,1) 的分数',
          value: -x,
          display: String.raw`s(${x.toFixed(1)})=-${x.toFixed(1)}`,
        }),
        formula: String.raw`s(x) = \nabla_x \ln \mathcal{N}(x\mid 0,1) = -x`,
      }}
    />
  );
}
