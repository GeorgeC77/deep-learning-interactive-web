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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“对抗博弈”，下列说法是否正确？",
        options: ["生成器试图欺骗判别器，判别器试图区分真伪，形成零和博弈。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。生成器试图欺骗判别器，判别器试图区分真伪，形成零和博弈。",
      },
      {
        question: "关于“纳什均衡”，下列说法是否正确？",
        options: ["理想情况下生成器复现真实分布，判别器无法区分真假。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。理想情况下生成器复现真实分布，判别器无法区分真假。",
      },
      {
        question: "关于“训练挑战”，下列说法是否正确？",
        options: ["模式崩溃、训练不稳定与评估困难是 GAN 研究的核心问题。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。模式崩溃、训练不稳定与评估困难是 GAN 研究的核心问题。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 17",
      section: "",
      pages: "",
    }}

    />
  );
}
