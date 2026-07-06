import BishopSectionPage from '@/components/BishopSectionPage';
import { Wind } from 'lucide-react';

export default function Ch17ForwardEncoderPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/forward-encoder"
      heroIcon={<Wind className="w-9 h-9 text-blue-600" />}
      summary={"前向编码器按马尔可夫链逐步加噪；由于高斯转移核，任意时刻的边际分布都有闭式表达。本页采用 DDPM 常见记号 x_t；Bishop 教材中对应状态常记为 z_t。"}
      concepts={[
        {
          title: "扩散核",
          description: "每步将当前样本与高斯噪声按预设 schedule 混合。",
          formula: String.raw`q(x_t \mid x_{t-1}) = \mathcal{N}(x_t \mid \sqrt{1-\beta_t}\, x_{t-1}, \beta_t I)`,
        },
        {
          title: "闭式重参数化",
          description: "可直接从 x₀ 采样任意 t 时刻的加噪样本，无需迭代。",
          formula: String.raw`x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1-\bar{\alpha}_t}\, \epsilon`,
        },
        {
          title: "噪声 schedule",
          description: "β_t 通常随时间递增以逐步增强噪声，但这不是扩散模型收敛的数学必要条件。",
        },
        {
          title: "记号说明",
          description: "本页采用 x_t；Bishop 教材中对应状态常记为 z_t，含义相同。",
        },
      ]}
      learningObjectives={[
        "理解高斯扩散核的形式与作用。",
        "会使用闭式重参数化从 x₀ 直接采样 x_t。",
        "认识到 β_t 递增是常见设计而非数学必要条件。",
      ]}
      coreIntuition={"前向过程像往清水中滴墨水：每一步只加一点点，但累积很多步后图像就变得几乎纯噪声；幸运的是，高斯噪声的叠加有闭式公式。"}
      commonMistakes={[
        "把“β_t 随时间递增”说成扩散模型的数学必要条件；它只是常用工程选择。",
        "混淆 x_t 与 z_t 的符号差异，导致阅读教材时对应错误。",
        "认为必须迭代 T 步才能采样 x_t；实际上闭式重参数化可一步得到。",
      ]}
      quiz={[
        {
          question: "若 β_t 随时间递增，前向过程中 x_t 的噪声比例通常会？",
          options: [
            "逐渐增大",
            "逐渐减小",
            "保持不变",
            "先减小后增大",
          ],
          correctIndex: 0,
          explanation: "递增的 β_t 意味着每一步加入更多噪声，因此后期样本中噪声比例更高。",
        },
        {
          question: "下列关于 β_t schedule 的说法，哪项最准确？",
          options: [
            "递增 schedule 常见且实用，但扩散模型理论并不要求它必须递增。",
            "β_t 必须线性递增，否则 ELBO 不成立。",
            "β_t 必须在最后一步等于 1。",
            "β_t 不能随时间变化。",
          ],
          correctIndex: 0,
          explanation: "扩散模型推导对满足基本条件的 schedule 都成立；递增只是为了让加噪过程更平滑。",
        },
        {
          question: "闭式重参数化 x_t = √(ᾱ_t)x₀ + √(1-ᾱ_t)ε 中，ε 服从什么分布？",
          options: ["N(0,I)", "N(x₀,I)", "Uniform(0,1)", "δ(0)"],
          correctIndex: 0,
          explanation: "ε 是标准高斯噪声；通过调整 ᾱ_t 控制信号与噪声的比例。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 20",
        section: "20.1",
        pages: "Ch 20",
        textbookSubsections: ["20.1.1 Diffusion kernel", "20.1.2 Reparameterized marginal", "20.1.3 Noise schedule"],
        formulas: ["扩散核 q(x_t|x_{t-1})", "闭式重参数化 x_t"],
        algorithms: ["前向加噪过程"],
        exercises: ["给定 β_t schedule 计算 ᾱ_t 并绘制信号比例曲线。", "说明 x_t 与 z_t 的对应关系。"],
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
          display: String.raw`\sqrt{\bar{\alpha}_t}=${Math.sqrt(alphaBar).toFixed(3)}`,
        }),
        formula: String.raw`x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1-\bar{\alpha}_t}\, \epsilon`,
      }}
    />
  );
}
