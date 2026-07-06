import BishopSectionPage from '@/components/BishopSectionPage';
import { Swords } from 'lucide-react';

export default function Ch14OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/overview"
      heroIcon={<Swords className="w-9 h-9 text-blue-600" />}
      summary={"生成对抗网络通过生成器与判别器的对抗博弈学习数据分布，开创了隐式生成模型的新范式。"}
      concepts={[
    {
      title: "对抗博弈",
      description: "生成器试图欺骗判别器，判别器试图区分真伪，形成零和博弈。",
    },
    {
      title: "纳什均衡",
      description: "理想情况下生成器复现真实分布，判别器无法区分真假。",
    },
    {
      title: "训练挑战",
      description: "模式崩溃、训练不稳定与评估困难是 GAN 研究的核心问题。",
    }
      ]}
      learningObjectives={[
      "理解 对抗博弈 的含义与作用。",
      "理解 纳什均衡 的含义与作用。",
      "理解 训练挑战 的含义与作用。"
    ]}
      coreIntuition={"生成对抗网络通过生成器与判别器的对抗博弈学习数据分布，开创了隐式生成模型的新范式。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“对抗博弈”的叙述，哪一项最准确？",
        options: ["生成器试图欺骗判别器，判别器试图区分真伪，形成零和博弈。", "对抗博弈 与本节讨论的问题完全无关。", "对抗博弈 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。生成器试图欺骗判别器，判别器试图区分真伪，形成零和博弈。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“纳什均衡”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。纳什均衡 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“训练挑战”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。训练挑战 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 17",
      pages: "Ch 17",
      textbookSubsections: ["对抗博弈", "纳什均衡", "训练挑战"],
      algorithms: ["训练挑战"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
