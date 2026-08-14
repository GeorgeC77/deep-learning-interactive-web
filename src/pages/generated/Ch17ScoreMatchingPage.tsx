import BishopSectionPage from '@/components/BishopSectionPage';
import Chapter17SectionCompletion from '@/components/Chapter17SectionCompletion';
import ScoreMatchingLab from '@/components/demos/ScoreMatchingLab';
import { Activity } from 'lucide-react';

export default function Ch17ScoreMatchingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/score-matching"
      heroIcon={<Activity className="w-9 h-9 text-blue-600" />}
      summary={"分数匹配通过估计数据对数密度的梯度（分数函数）来建模分布。去噪分数匹配利用已知前向噪声核的 conditional score，构造与噪声预测网络等价的训练目标，是 Bishop §20.3 的核心内容。"}
      concepts={[
        {
          title: "20.3.1 分数损失函数",
          description: "分数是对数密度关于输入的梯度，指向密度增加最快的方向；用模型分数与真实数据分数之间的期望平方误差作为目标。",
          formula: String.raw`s(\mathbf{x}) = \nabla_{\mathbf{x}} \ln p(\mathbf{x})`,
        },
        {
          title: "20.3.2 修正后的分数损失",
          description: "用 Parzen 噪声核平滑不可微的经验分布，再把未知边缘分数目标等价改写为已知条件核分数；单次 ε 是随机标签。",
          formula: String.raw`\nabla_{\mathbf{z}_t} \ln q(\mathbf{z}_t \mid \mathbf{x}) = -\frac{\boldsymbol{\epsilon}}{\sqrt{1-\bar{\alpha}_t}}`,
        },
        {
          title: "20.3.3 噪声方差",
          description: "大方差能平滑低维流形、低密度区和不连通模式，却会扭曲细节；噪声阶梯与退火 Langevin 采样在二者之间搭桥。",
          formula: String.raw`\nabla_{\mathbf{z}_t} \ln q_t(\mathbf{z}_t) = -\frac{\mathbb{E}\!\left(\boldsymbol{\epsilon}\mid\mathbf{z}_t\right)}{\sqrt{1-\bar{\alpha}_t}}`,
        },
        {
          title: "20.3.4 随机微分方程",
          description: "将离散前向过程推广到连续时间 SDE；反向 SDE 的漂移由学得的边缘分数修正，对应 ODE 则保持相同边缘密度。",
          formula: String.raw`d\mathbf z=\{f(\mathbf z,t)-g^2(t)\nabla_{\mathbf z}\ln p_t(\mathbf z)\}\,dt+g(t)\,d\bar{\mathbf v}`,
        },
      ]}
      learningObjectives={[
        "理解分数函数的含义及其与概率密度的区别。",
        "能区分条件腐蚀分数与边缘噪声分数。",
        "理解去噪分数匹配如何利用已知噪声核构造训练目标。",
        "知道最优噪声预测网络输出的是 E[ε|z_t]，而非单次 ε 本身。",
      ]}
      coreIntuition={"分数函数告诉我们“朝哪个方向走能到达数据密度更高的地方”。去噪分数匹配把对未知数据分布的分数估计，转化为对已知加噪核的条件分数预测；网络学的是“给定当前带噪样本，平均噪声是什么”。"}
      commonMistakes={[
        "把分数函数等同于概率密度；分数是密度的梯度，不是密度本身。",
        "忽略低数据密度区域分数估计不准的问题，导致 Langevin 采样失败。",
        "认为单尺度分数网络足以覆盖所有噪声水平；实际需多尺度训练。",
        "把单次噪声 ε 当成真实边缘分数；实际上边缘分数需要 E[ε|z_t]，单次 ε 只是随机训练目标。",
        "笼统地说“闭式得到 unbiased pointwise score”；去噪分数匹配是用 conditional score 对经验分布做平滑，再构造等价目标。",
      ]}
      whyCards={[
        {
          question: "为什么分数匹配能绕过归一化常数？",
          answer: "分数是对数密度的梯度，归一化常数在梯度中消失，因此无需计算难以处理的 partition function。",
        },
        {
          question: "为什么需要去噪分数匹配？",
          answer: "直接估计数据分布的分数需要知道密度，而去噪分数匹配利用已知的前向噪声核，把分数估计转化为条件噪声预测。",
        },
      ]}
      counterexamples={[
        "把单次噪声 ε 当成真实边缘分数，采样结果充满噪声——说明边缘分数需要条件期望 E[ε|z_t]。",
        "用单尺度分数网络在所有噪声水平采样，低噪声区域分数估计不准——说明多尺度训练是必要的。",
      ]}
            bishopMapping={{
        chapter: "Ch 20",
        section: "20.3",
        pages: "§20.3, pp. 594–599",
        textbookSubsections: [
          "20.3.1 Score loss function",
          "20.3.2 Modified score loss",
          "20.3.3 Noise variance",
          "20.3.4 Stochastic differential equations"
        ],
        supplementalTopics: [
          "Connection to diffusion noise prediction",
          "conditional vs marginal score",
          "annealed Langevin dynamics"
        ],
        formulas: ["s(x)=∇ln p(x)", "∇_{z_t} ln q(z_t|x) = -ε/√(1-ᾱ_t)", "∇_{z_t} ln q_t(z_t) = -E[ε|z_t]/√(1-ᾱ_t)"],
        algorithms: ["去噪分数匹配"],
        exercises: ["推导高斯分布的分数函数。", "说明扩散噪声预测损失为何等价于去噪分数匹配，并区分 conditional 与 marginal score。"]
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
      interactiveDemo={<ScoreMatchingLab />}
      extraContent={<Chapter17SectionCompletion sectionKey="score" />}
    />
  );
}
