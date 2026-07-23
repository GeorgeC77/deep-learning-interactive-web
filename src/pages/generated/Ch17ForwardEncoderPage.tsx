import BishopSectionPage from '@/components/BishopSectionPage';
import DiffusionTimelineLab from '@/components/demos/DiffusionTimelineLab';
import { Wind } from 'lucide-react';

export default function Ch17ForwardEncoderPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/forward-encoder"
      heroIcon={<Wind className="w-9 h-9 text-blue-600" />}
      summary={"前向编码器按马尔可夫链逐步向数据加入高斯噪声。由于转移核是高斯，任意时刻的边际分布都有闭式表达。Bishop 教材用 z_t 表示带噪状态，DDPM 文献常用 x_t，两者指同一概念。"}
      concepts={[
        {
          title: "扩散核（Bishop 记号 z_t）",
          description: "每步将当前样本与高斯噪声按 variance schedule β_t 混合。",
          formula: String.raw`q(\mathbf{z}_t \mid \mathbf{z}_{t-1}) = \mathcal{N}\bigl(\mathbf{z}_t \mid \sqrt{1-\beta_t}\, \mathbf{z}_{t-1}, \beta_t I\bigr)`,
        },
        {
          title: "闭式重参数化（DDPM 记号 x_t）",
          description: "可直接从 x₀ 采样任意 t 时刻的加噪样本，无需迭代。",
          formula: String.raw`\mathbf{x}_t = \sqrt{\bar{\alpha}_t}\, \mathbf{x}_0 + \sqrt{1-\bar{\alpha}_t}\, \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon}\sim\mathcal{N}(0,I)`,
        },
        {
          title: "记号对应关系",
          description: "本页与多数实现使用 x_t；Bishop 教材使用 z_t。两者均表示第 t 步的带噪数据。",
          formula: String.raw`\mathbf{x}_t \;\Longleftrightarrow\; \mathbf{z}_t`,
        },
        {
          title: "条件分布",
          description: "给定 x₀ 时，x_t 的分布是高斯，其均值和方差由 cumulative product ᾱ_t 决定。",
          formula: String.raw`q(\mathbf{x}_t \mid \mathbf{x}_0) = \mathcal{N}(\mathbf{x}_t \mid \sqrt{\bar{\alpha}_t}\, \mathbf{x}_0, (1-\bar{\alpha}_t)I)`,
        },
      ]}
      learningObjectives={[
        "理解高斯扩散核的形式与作用。",
        "会使用闭式重参数化从 x₀ 直接采样 x_t / z_t。",
        "能在 Bishop 记号与 DDPM 记号之间自由切换。",
      ]}
      coreIntuition={"前向过程像往清水中滴墨水：每一步只加一点点，但累积很多步后图像就变得几乎纯噪声；幸运的是，高斯噪声的叠加有闭式公式。"}
      commonMistakes={[
        "把密度写成 p(x_t)=p(x_{t-1})-噪声 之类的非概率形式；正确做法是正态分布的乘积或闭式高斯。",
        "混淆 x_t 与 z_t 的符号差异，导致阅读教材时对应错误。",
        "认为必须迭代 T 步才能采样 x_t；实际上闭式重参数化可一步得到。",
        "把 β_t 递增说成扩散模型的数学必要条件；它只是常用工程选择。",
      ]}
      whyCards={[
        {
          question: "为什么前向过程可以用闭式重参数化？",
          answer: "高斯噪声的叠加仍然是高斯，任意时刻的边际分布都有解析形式，无需逐步迭代。",
        },
        {
          question: "为什么需要区分 x_t 和 z_t 记号？",
          answer: "Bishop 教材用 z_t 表示带噪状态，DDPM 文献常用 x_t，两者指同一概念。混淆记号会导致公式理解错误。",
        },
      ]}
      counterexamples={[
        "认为必须迭代 T 步才能采样 x_t——实际上闭式重参数化可一步得到，大大简化训练。",
        "把 β_t 递增说成扩散模型的数学必要条件——它只是常用工程选择，不是数学必需。",
      ]}
            bishopMapping={{
        chapter: "Ch 20",
        section: "20.1",
        pages: "Ch 20",
        textbookSubsections: [
          "20.1.1 Diffusion kernel",
          "20.1.2 Conditional distribution"
        ],
        supplementalTopics: [
          "noise schedule"
        ],
        formulas: ["q(z_t|z_{t-1})", "q(x_t|x_0) = N(√ᾱ_t x_0, (1-ᾱ_t)I)"],
        algorithms: ["前向加噪过程"],
        exercises: ["给定 β_t schedule 计算 ᾱ_t 并绘制信号比例曲线。", "证明条件分布 q(x_t|x_0) 的均值与方差。"],
      }}
      demo={{
        title: "加噪样本中信号与噪声比例",
        label: "累积系数 ᾱ_t",
        param: 0.5,
        min: 0.01,
        max: 0.99,
        step: 0.01,
        compute: (alphaBar) => ({
          label: '信号比例',
          value: Math.sqrt(alphaBar),
          display: String.raw`\\sqrt{\\bar{\\alpha}_t}=${Math.sqrt(alphaBar).toFixed(3)}`,
        }),
        formula: String.raw`\mathbf{x}_t = \sqrt{\bar{\alpha}_t}\, \mathbf{x}_0 + \sqrt{1-\bar{\alpha}_t}\, \boldsymbol{\epsilon}`,
      }}
      extraContent={<DiffusionTimelineLab />}
    />
  );
}
