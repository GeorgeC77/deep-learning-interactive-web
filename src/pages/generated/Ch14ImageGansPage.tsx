import BishopSectionPage from '@/components/BishopSectionPage';
import { Image } from 'lucide-react';

export default function Ch14ImageGansPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/image-gans"
      heroIcon={<Image className="w-9 h-9 text-blue-600" />}
      summary={"图像 GAN 从全连接架构发展到深度卷积网络；条件 GAN 通过类别或图像输入实现可控生成；CycleGAN 利用循环一致性在无配对数据上完成域转换。"}
      concepts={[
        {
          title: "DCGAN",
          description: "将卷积、批归一化与转置卷积引入 GAN，稳定训练并生成高质量图像。",
        },
        {
          title: "条件 GAN",
          description: "向生成器和判别器提供类别、文本或图像条件，使生成结果可控。",
          formula: String.raw`\min_G \max_D V(D,G) = \mathbb{E}_{x,c}\ln D(x,c) + \mathbb{E}_{z,c}\ln(1-D(G(z,c),c))`,
        },
        {
          title: "CycleGAN",
          description: "通过循环一致性损失学习两个域之间的双向映射，无需成对训练数据。",
          formula: String.raw`L_{\text{cyc}} = \mathbb{E}_x[\|F(G(x))-x\|_1] + \mathbb{E}_y[\|G(F(y))-y\|_1]`,
        },
        {
          title: "域转换 vs 条件生成",
          description: "条件 GAN 从噪声生成带标签样本；CycleGAN 将已有样本从一个域转换到另一个域。",
        },
      ]}
      learningObjectives={[
        "理解 DCGAN 在图像生成中的关键设计。",
        "能写出条件 GAN 的损失形式。",
        "理解 CycleGAN 循环一致性的作用。",
      ]}
      coreIntuition={"DCGAN 让 GAN 长出了‘眼睛’（卷积）；条件 GAN 给了它‘指令’；CycleGAN 则让它学会‘翻译’图像而不需要逐句对照。"}
      commonMistakes={[
        "把条件 GAN 与 CycleGAN 混为一谈；前者从噪声生成，后者做图像到图像转换。",
        "认为 CycleGAN 的循环一致性损失足以保证语义一致；它只能约束像素层面的可逆性。",
        "忽视 DCGAN 中批归一化与卷积结构对训练稳定性的贡献。",
      ]}
      quiz={[
        {
          question: "DCGAN 对 GAN 的主要贡献是？",
          options: [
            "引入深度卷积与转置卷积结构，使图像 GAN 训练更稳定。",
            "首次提出条件生成。",
            "提出循环一致性损失。",
            "用 VAE 替代判别器。",
          ],
          correctIndex: 0,
          explanation: "DCGAN 用卷积层替代全连接层，结合批归一化，显著提升了图像生成质量。",
        },
        {
          question: "条件 GAN 与 CycleGAN 的主要区别是？",
          options: [
            "条件 GAN 从噪声生成带条件样本，CycleGAN 把已有样本转换到另一域。",
            "条件 GAN 只能用于离散类别，CycleGAN 只能用于连续图像。",
            "条件 GAN 不需要判别器。",
            "CycleGAN 需要成对训练数据，条件 GAN 不需要。",
          ],
          correctIndex: 0,
          explanation: "条件 GAN 生成新样本并控制类别/属性；CycleGAN 是图像到图像的域转换，利用循环一致性避免配对数据。",
        },
        {
          question: "CycleGAN 中循环一致性损失的作用是什么？",
          options: [
            "保证转换后再转换回来能接近原始输入，提供无配对数据下的监督信号。",
            "让生成器输出更清晰的图像。",
            "替代判别器进行真伪判断。",
            "强制两个域的分布完全相同。",
          ],
          correctIndex: 0,
          explanation: "循环一致性约束 F(G(x))≈x 和 G(F(y))≈y，使无配对样本也能学习有意义的映射。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 17",
        section: "17.2",
        pages: "Ch 17",
        textbookSubsections: ["17.2 Image GANs", "17.2.1 CycleGAN"],
        supplementalTopics: ["DCGAN", "conditional GAN"],
        formulas: ["条件 GAN 损失", "CycleGAN 循环一致性损失"],
        algorithms: ["DCGAN", "cGAN", "CycleGAN"],
        exercises: ["比较 DCGAN 与原始全连接 GAN 的网络结构差异。", "说明 CycleGAN 为什么不需要成对数据。"],
      }}
    />
  );
}
