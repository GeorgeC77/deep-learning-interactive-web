import BishopSectionPage from '@/components/BishopSectionPage';
import { Image } from 'lucide-react';

export default function Ch14ImageGansPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/image-gans"
      heroIcon={<Image className="w-9 h-9 text-blue-600" />}
      summary={"图像 GAN 从早期全连接架构发展到卷积与条件生成；CycleGAN 等模型实现了无配对数据的图像域转换。"}
      concepts={[
    {
      title: "DCGAN",
      description: "将卷积与转置卷积引入 GAN，使生成高质量图像成为可能。",
    },
    {
      title: "条件 GAN",
      description: "向生成器和判别器输入类别或图像条件，实现可控生成。",
    },
    {
      title: "CycleGAN",
      description: "通过循环一致性损失，在两个无配对图像域之间学习双向映射。",
    }
      ]}
      learningObjectives={[
      "理解 DCGAN 的含义与作用。",
      "理解 条件 GAN 的含义与作用。",
      "理解 CycleGAN 的含义与作用。"
    ]}
      coreIntuition={"图像 GAN 从早期全连接架构发展到卷积与条件生成；CycleGAN 等模型实现了无配对数据的图像域转换。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“DCGAN”的叙述，哪一项最准确？",
        options: ["将卷积与转置卷积引入 GAN，使生成高质量图像成为可能。", "DCGAN 与本节讨论的问题完全无关。", "DCGAN 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。将卷积与转置卷积引入 GAN，使生成高质量图像成为可能。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“条件 GAN”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。条件 GAN 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“CycleGAN”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。CycleGAN 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 17",
      section: "17.2",
      pages: "Ch 17",
      textbookSubsections: ["17.2.1 DCGAN", "17.2.2 条件 GAN", "17.2.3 CycleGAN"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
