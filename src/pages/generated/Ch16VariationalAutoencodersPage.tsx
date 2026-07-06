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
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“摊销推断”的叙述，哪一项最准确？",
        options: ["编码器同时输出每个数据点的变分后验参数，避免逐点优化。", "摊销推断 与本节讨论的问题完全无关。", "摊销推断 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。编码器同时输出每个数据点的变分后验参数，避免逐点优化。 这体现了本节的核心思想。",
      },
      {
        question: "在“重参数化技巧”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。重参数化技巧 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“ELBO”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。ELBO 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 19",
      section: "19.2",
      pages: "Ch 19",
      textbookSubsections: ["19.2.1 摊销推断", "19.2.2 重参数化技巧", "19.2.3 ELBO"],
      formulas: ["摊销推断公式", "重参数化技巧公式", "ELBO公式"],
      algorithms: ["摊销推断"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
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
