import BishopSectionPage from '@/components/BishopSectionPage';
import { Sparkles } from 'lucide-react';

export default function Ch16VariationalAutoencodersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch16/variational-autoencoders"
      heroIcon={<Sparkles className="w-9 h-9 text-blue-600" />}
      summary={"变分自编码器将编码器输出解释为后验分布参数，通过重参数化技巧优化证据下界，实现连续隐空间的生成。"}
      concepts={[
    {
      title: "摊销推断",
      description: "编码器同时输出每个数据点的变分后验参数，避免逐点优化。",
      formula: String.raw`q_\phi(z \mid x) = \mathcal{N}(z \mid \mu_\phi(x), \sigma_\phi^2(x)I)`,
    },
    {
      title: "重参数化技巧",
      description: "将随机性从网络参数中分离，使梯度能反向传播到 μ 与 σ。",
      formula: String.raw`z = \mu + \sigma \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0,I)`,
    },
    {
      title: "ELBO",
      description: "最大化重构似然与后验接近先验之间的平衡。",
      formula: String.raw`\mathcal{L} = \mathbb{E}_{q(z|x)}[\ln p(x|z)] - D_{KL}(q(z|x) \| p(z))`,
    }
      ]}
      learningObjectives={[
      "理解 摊销推断 的含义与作用。",
      "理解 重参数化技巧 的含义与作用。",
      "理解 ELBO 的含义与作用。"
    ]}
      coreIntuition={"变分自编码器将编码器输出解释为后验分布参数，通过重参数化技巧优化证据下界，实现连续隐空间的生成。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“摊销推断”，下列说法是否正确？",
        options: ["编码器同时输出每个数据点的变分后验参数，避免逐点优化。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。编码器同时输出每个数据点的变分后验参数，避免逐点优化。",
      },
      {
        question: "关于“重参数化技巧”，下列说法是否正确？",
        options: ["将随机性从网络参数中分离，使梯度能反向传播到 μ 与 σ。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将随机性从网络参数中分离，使梯度能反向传播到 μ 与 σ。",
      },
      {
        question: "关于“ELBO”，下列说法是否正确？",
        options: ["最大化重构似然与后验接近先验之间的平衡。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。最大化重构似然与后验接近先验之间的平衡。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 19",
      section: "",
      pages: "",
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
