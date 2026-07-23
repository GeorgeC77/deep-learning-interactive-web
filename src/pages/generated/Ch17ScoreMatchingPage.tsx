import BishopSectionPage from '@/components/BishopSectionPage';
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
          title: "分数函数（Score function）",
          description: "分数是对数密度关于输入的梯度，指向数据密度增加最快的方向。",
          formula: String.raw`s(\mathbf{x}) = \nabla_{\mathbf{x}} \ln p(\mathbf{x})`,
        },
        {
          title: "条件腐蚀分数",
          description: "给定干净样本 x，前向加噪过程 q(z_t|x) 是高斯的。其分数可由采样噪声 ε 闭式写出，单次 ε 是随机训练目标。",
          formula: String.raw`\nabla_{\mathbf{z}_t} \ln q(\mathbf{z}_t \mid \mathbf{x}) = -\frac{\boldsymbol{\epsilon}}{\sqrt{1-\bar{\alpha}_t}}`,
        },
        {
          title: "边缘噪声分数",
          description: "扰动数据分布 q_t(z_t) 的分数是对所有可能干净样本的条件分数取期望。因此最优网络输出的是给定 z_t 下 ε 的条件期望。",
          formula: String.raw`\nabla_{\mathbf{z}_t} \ln q_t(\mathbf{z}_t) = -\frac{\mathbb{E}[\boldsymbol{\epsilon}\mid\mathbf{z}_t]}{\sqrt{1-\bar{\alpha}_t}} \approx -\frac{\boldsymbol{\epsilon}_w(\mathbf{z}_t, t)}{\sqrt{1-\bar{\alpha}_t}}`,
        },
        {
          title: "分数匹配损失",
          description: "用模型分数与真实分数之间的 Fisher 散度作为目标。",
        },
        {
          title: "修正后的分数损失",
          description: "通过引入噪声数据分布，避免直接估计海森迹。",
        },
        {
          title: "噪声方差与多尺度训练",
          description: "在不同噪声水平下训练分数网络，使其覆盖从纯噪声到干净数据的整个路径。",
        },
        {
          title: "随机微分方程",
          description: "将离散前向过程推广到连续时间 SDE，建立更一般的分数生成框架。",
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
        pages: "Ch 20",
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
    />
  );
}
