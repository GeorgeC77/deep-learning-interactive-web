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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“DCGAN”，下列说法是否正确？",
        options: ["将卷积与转置卷积引入 GAN，使生成高质量图像成为可能。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将卷积与转置卷积引入 GAN，使生成高质量图像成为可能。",
      },
      {
        question: "关于“条件 GAN”，下列说法是否正确？",
        options: ["向生成器和判别器输入类别或图像条件，实现可控生成。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。向生成器和判别器输入类别或图像条件，实现可控生成。",
      },
      {
        question: "关于“CycleGAN”，下列说法是否正确？",
        options: ["通过循环一致性损失，在两个无配对图像域之间学习双向映射。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过循环一致性损失，在两个无配对图像域之间学习双向映射。",
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
