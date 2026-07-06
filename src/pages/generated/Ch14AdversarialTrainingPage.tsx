import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch14AdversarialTrainingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/adversarial-training"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"GAN 的损失函数定义了生成器与判别器的优化目标；实践中需要平衡两者更新频率与梯度稳定性。"}
      concepts={[
    {
      title: "极小极大损失",
      description: "判别器最大化对数似然，生成器最小化被判别为假的概率。",
      formula: String.raw`\min_G \max_D V(D,G) = \mathbb{E}_{x\sim p_{\text{data}}}\ln D(x) + \mathbb{E}_{z\sim p_z}\ln(1-D(G(z)))`,
    },
    {
      title: "非饱和损失",
      description: "用 -ln D(G(z)) 替代 ln(1-D(G(z))))，缓解生成器早期梯度不足。",
    },
    {
      title: "训练技巧",
      description: "标签平滑、噪声输入、梯度惩罚等方法可提升稳定性。",
    }
      ]}
      learningObjectives={[
      "理解 极小极大损失 的含义与作用。",
      "理解 非饱和损失 的含义与作用。",
      "理解 训练技巧 的含义与作用。"
    ]}
      coreIntuition={"GAN 的损失函数定义了生成器与判别器的优化目标；实践中需要平衡两者更新频率与梯度稳定性。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“极小极大损失”的叙述，哪一项最准确？",
        options: ["判别器最大化对数似然，生成器最小化被判别为假的概率。", "极小极大损失 与本节讨论的问题完全无关。", "极小极大损失 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。判别器最大化对数似然，生成器最小化被判别为假的概率。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“非饱和损失”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。非饱和损失 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“训练技巧”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。训练技巧 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 17",
      section: "17.1",
      pages: "Ch 17",
      textbookSubsections: ["17.1.1 极小极大损失", "17.1.2 非饱和损失", "17.1.3 训练技巧"],
      formulas: ["极小极大损失公式"],
      algorithms: ["训练技巧"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "判别器对生成样本的输出",
      label: "判别器输出 D(G(z))",
      param: 0.3,
      min: 0.01,
      max: 0.99,
      step: 0.01,
      compute: (d) => ({
        label: '生成器损失',
        value: -Math.log(d),
        display: String.raw`L_G=-\\ln ${d.toFixed(2)}=${(-Math.log(d)).toFixed(3)}`,
      }),
      formula: String.raw`L_G = -\ln D(G(z))`,
    }}
    />
  );
}
