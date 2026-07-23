import BishopSectionPage from '@/components/BishopSectionPage';
import VAELatentCloudLab from '@/components/demos/VAELatentCloudLab';
import { Sparkles } from 'lucide-react';

export default function Ch16VariationalAutoencodersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch16/variational-autoencoders"
      heroIcon={<Sparkles className="w-9 h-9 text-blue-600" />}
      summary={"变分自编码器把编码器输出解释为近似后验分布的参数，通过重参数化技巧端到端优化证据下界（ELBO），实现连续隐空间的概率生成模型。"}
      concepts={[
        {
          title: "摊销推断",
          description: "编码器网络同时输出所有数据点的变分后验参数，避免逐点变分优化。",
          formula: String.raw`q_\phi(\mathbf{z} \mid \mathbf{x}) = \mathcal{N}(\mathbf{z} \mid \boldsymbol{\mu}_\phi(\mathbf{x}), \sigma_\phi^2(\mathbf{x}) I)`,
        },
        {
          title: "重参数化技巧",
          description: "将随机采样移出梯度路径，使反向传播能到达 μ 与 σ。",
          formula: String.raw`\mathbf{z} = \boldsymbol{\mu} + \boldsymbol{\sigma} \odot \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \mathcal{N}(0, I)`,
        },
        {
          title: "ELBO",
          description: "重构项鼓励解码器恢复数据，KL 项使近似后验接近先验。",
          formula: String.raw`\mathcal{L}(\theta, \phi) = \mathbb{E}_{q_\phi(\mathbf{z} \mid \mathbf{x})}[\ln p_\theta(\mathbf{x} \mid \mathbf{z})] - D_{KL}(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p(\mathbf{z}))`,
        },
        {
          title: "β-VAE 目标",
          description: "β-VAE 在 KL 项前引入可调权重 β，有意修改优化目标以获得更可解释的隐空间。β=1 退化为标准 ELBO；β>1 仍是似然的下界，但不再是标准 ELBO；0<β<1 时整体目标不再保证是下界。",
          formula: String.raw`\mathcal{L}_\beta = \mathbb{E}_{q_\phi}[\ln p_\theta(\mathbf{x} \mid \mathbf{z})] - \beta D_{KL}(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p(\mathbf{z}))`,
        },
        {
          title: "隐空间先验",
          description: "通常取标准高斯，使解码器能从采样得到的 z 生成新数据。",
        },
      ]}
      learningObjectives={[
        "理解变分后验 q(z|x) 与生成模型 p(x|z) 的角色。",
        "掌握重参数化技巧为什么能估计梯度。",
        "能写出 VAE 的 ELBO 并解释两项的权衡。",
        "理解 β-VAE 与标准 ELBO 的区别：β 改变目标函数，不再保证标准下界。",
      ]}
      coreIntuition={"VAE 把每个数据点编码成隐空间上的一朵‘云’而不是一个点；KL 项约束这朵云既不能太散，也不能离标准高斯太远。β-VAE 则通过调节 KL 权重，让这朵云在可解释性与重构能力之间重新取舍。"}
      commonMistakes={[
        "把 VAE 的编码器输出当成确定性隐变量，忽视其分布含义。",
        "混淆 β-VAE 与标准 ELBO：β=1 时两者相同；β>1 仍是似然的下界，但不再是标准 ELBO 目标；0<β<1 时不再保证是下界。β-VAE 是故意修改目标函数以获得可解释性，而不是在保持原 ELBO 的前提下做微调。",
        "用重参数化时直接对 z 采样后试图对 σ 求导，而不通过 μ+σε 的显式路径。",
        "忽视 posterior collapse：解码器过强时 q(z|x) 可能退化为先验，隐变量不再携带信息。",
      ]}
      whyCards={[
        {
          question: "为什么需要重参数化技巧？",
          answer: "直接对随机变量 z 采样会阻断梯度路径。重参数化把随机性移到外部噪声 ε，让梯度可以通过 μ 和 σ 反向传播。",
        },
        {
          question: "为什么 VAE 的隐空间是“云”而不是“点”？",
          answer: "编码器输出的是分布参数（均值和方差），不是确定值。这朵“云”表示了模型对隐变量的不确定性。",
        },
      ]}
      counterexamples={[
        "把 VAE 的编码器输出当成确定性隐变量，直接用于下游任务——忽视了后验分布的不确定性。",
        "认为 β-VAE 只是微调 ELBO——实际上 β-VAE 改变了目标函数，不再保证是似然的下界。",
      ]}
            bishopMapping={{
        chapter: "Ch 19",
        section: "19.2",
        pages: "Ch 19",
        textbookSubsections: [
          "19.2.1 Amortized inference",
          "19.2.2 The reparameterization trick"
        ],
        supplementalTopics: [
          "ELBO derivation",
          "β-VAE"
        ],
        formulas: ["q_φ(z|x)", "z=μ+σε", "ELBO", "L_β = E[log p(x|z)] − β KL"],
        algorithms: ["VAE", "重参数化技巧"],
        exercises: ["推导对角高斯后验与标准高斯先验的 KL 散度。", "说明为什么重参数化技巧能得到无偏梯度估计。", "比较 β=1、β>1 与 0<β<1 时目标函数的下界性质。"]
      }}
      demo={{
        title: "KL 散度随 (μ, σ) 变化",
        label: "后验标准差 σ（μ 固定为 0）",
        param: 1,
        min: 0.1,
        max: 3,
        step: 0.1,
        compute: (sigma) => ({
          label: 'KL(q||N(0,1))',
          value: 0.5 * (sigma * sigma - Math.log(sigma * sigma) - 1),
          display: String.raw`D_{KL}=\\frac{1}{2}(${sigma.toFixed(1)}^2-\\ln ${sigma.toFixed(1)}^2-1)`,
        }),
        formula: String.raw`D_{KL}\bigl(\mathcal{N}(\mu,\sigma^2) \| \mathcal{N}(0,1)\bigr) = \frac{1}{2}\left(\sigma^2 - \ln \sigma^2 - 1 + \mu^2\right)`,
      }}
      interactiveDemo={<VAELatentCloudLab />}
    />
  );
}
