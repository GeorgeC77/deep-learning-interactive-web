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
      quiz={[
        {
          question: "GAN 属于哪类生成模型？",
          options: [
            "隐式生成模型：通过采样定义分布，不显式给出密度。",
            "显式密度模型：可直接计算 p(x)。",
            "自回归模型：逐维分解联合分布。",
            "基于能量的模型：通过配分函数归一化。",
          ],
          correctIndex: 0,
          explanation: "GAN 的生成器定义了从隐变量到数据的映射，可直接采样但通常不给出显式密度。",
        },
        {
          question: "在 GAN 的纳什均衡处，最优判别器对生成样本的输出应接近？",
          options: ["0.5", "0", "1", "无穷大"],
          correctIndex: 0,
          explanation: "当 p_G=p_data 时，最优判别器无法区分真假，对所有样本输出 1/2。",
        },
        {
          question: "以下哪项是 GAN 训练中常见的挑战？",
          options: [
            "模式崩溃：生成器只产生少数几类样本。",
            "KL 散度解析解难求。",
            "必须对输入进行自回归排序。",
            "隐变量维度不能超过输入维度。",
          ],
          correctIndex: 0,
          explanation: "模式崩溃是 GAN 的知名问题，生成器可能只覆盖真实分布的部分模式。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 17",
        pages: "Ch 17",
        textbookSubsections: ["17.1 Adversarial Training", "17.2 Image GANs"],
        algorithms: ["GAN"],
        exercises: ["说明 GAN 为何是隐式生成模型。", "列举 GAN 训练中的三种常见困难。"],
      }}
    />
  );
}
