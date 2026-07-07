import BishopSectionPage from '@/components/BishopSectionPage';
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
          title: "隐空间先验",
          description: "通常取标准高斯，使解码器能从采样得到的 z 生成新数据。",
        },
      ]}
      learningObjectives={[
        "理解变分后验 q(z|x) 与生成模型 p(x|z) 的角色。",
        "掌握重参数化技巧为什么能估计梯度。",
        "能写出 VAE 的 ELBO 并解释两项的权衡。",
      ]}
      coreIntuition={"VAE 把每个数据点编码成隐空间上的一朵‘云’而不是一个点；KL 项约束这朵云既不能太散，也不能离标准高斯太远。"}
      commonMistakes={[
        "把 VAE 的编码器输出当成确定性隐变量，忽视其分布含义。",
        "在 KL 项前错误地添加可调权重（β-VAE 除外），破坏 ELBO 的下界性质。",
        "用重参数化时直接对 z 采样后试图对 σ 求导，而不通过 μ+σε 的显式路径。",
        "忽视 posterior collapse：解码器过强时 q(z|x) 可能退化为先验，隐变量不再携带信息。",
      ]}
      quiz={[
        {
          question: "重参数化技巧为什么能让梯度传到 encoder 的 μ 与 σ？",
          options: [
            "采样操作被移到不可导的 ε 上，z 对 μ、σ 的依赖变成确定性线性函数，梯度可正常回传。",
            "它用蒙特卡洛估计代替了真实的 KL 项。",
            "它让 encoder 直接输出样本而不是参数。",
            "它取消了先验分布，使隐变量确定。",
          ],
          correctIndex: 0,
          explanation: "z = μ + σ⊙ε 把随机性隔离到 ε，使 z 对 μ、σ 可微，反向传播可以更新 encoder。",
        },
        {
          question: "若 q(z|x)=N(μ,σ²)，先验 p(z)=N(0,1)，则一维 KL(q||p) 等于？",
          options: [
            "0.5(σ² - ln σ² - 1 + μ²)",
            "0.5(σ² + ln σ² - 1 + μ²)",
            "σ² + μ²",
            "ln(σ/μ)",
          ],
          correctIndex: 0,
          explanation: "两个高斯之间的 KL 公式为 0.5(σ² - ln σ² - 1 + μ²)，σ²=1 且 μ=0 时退化为 0。",
        },
        {
          question: "训练时发现 decoder 几乎忽略 z，q(z|x) 接近先验 N(0,I)，这被称为什么现象？",
          options: [
            "Posterior collapse",
            "Mode collapse",
            "Gradient vanishing",
            "Teacher forcing",
          ],
          correctIndex: 0,
          explanation: "Posterior collapse 指近似后验退化为先验，隐变量不再携带关于输入的信息。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 19",
        section: "19.2",
        pages: "Ch 19",
        textbookSubsections: ["19.2.1 Amortized inference", "19.2.2 The reparameterization trick"],
        supplementalTopics: ["ELBO derivation", "β-VAE"],
        formulas: ["q_φ(z|x)", "z=μ+σε", "ELBO"],
        algorithms: ["VAE", "重参数化技巧"],
        exercises: ["推导对角高斯后验与标准高斯先验的 KL 散度。", "说明为什么重参数化技巧能得到无偏梯度估计。"],
      }}
      demo={{
        title: "KL 散度随 σ 变化",
        label: "后验标准差 σ",
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
    />
  );
}
