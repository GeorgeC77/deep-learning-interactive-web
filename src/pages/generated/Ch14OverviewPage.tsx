import BishopSectionPage from '@/components/BishopSectionPage';
import { Swords } from 'lucide-react';

export default function Ch14OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/overview"
      heroIcon={<Swords className="w-9 h-9 text-blue-600" />}
      summary={"生成对抗网络（GAN）通过生成器与判别器的对抗博弈学习数据分布，是一种隐式生成模型。本章介绍对抗训练目标与图像 GAN 的代表性架构。"}
      concepts={[
        {
          title: "对抗博弈",
          description: "生成器试图生成以假乱真的样本，判别器试图区分真实与生成的样本。",
        },
        {
          title: "纳什均衡",
          description: "理想情况下生成器复现真实分布，判别器对真假样本输出均为 1/2。",
        },
        {
          title: "隐式密度建模",
          description: "GAN 不直接建模 p(x)，而是通过采样过程隐式定义分布。",
        },
        {
          title: "训练挑战",
          description: "模式崩溃、训练不稳定、梯度消失与评估困难是 GAN 研究的核心问题。",
        },
      ]}
      learningObjectives={[
        "理解 GAN 中生成器与判别器的对抗关系。",
        "了解纳什均衡与隐式密度建模的含义。",
        "认识 GAN 的主要训练挑战。",
      ]}
      coreIntuition={"GAN 不直接写出生成分布的公式，而是训练一个‘造假者’和一个‘鉴定师’相互较劲；当鉴定师再也分不出真假时，造假者就学会了数据分布。"}
      commonMistakes={[
        "认为 GAN 能给出可计算的概率密度。",
        "把生成器单独训练而忽视判别器质量对梯度的影响。",
        "期望 GAN 训练稳定；实际常需精心设计网络、损失与超参数。",
      ]}
            bishopMapping={{
        chapter: "Ch 17",
        pages: "Ch 17",
        textbookSubsections: [
          "17.1 Adversarial Training",
          "17.2 Image GANs"
        ],
        algorithms: ["GAN"],
        exercises: ["说明 GAN 为何是隐式生成模型。", "列举 GAN 训练中的三种常见困难。"],
      }}
    />
  );
}
