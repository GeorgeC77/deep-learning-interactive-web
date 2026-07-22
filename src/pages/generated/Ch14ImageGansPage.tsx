import BishopSectionPage from '@/components/BishopSectionPage';
import { Image } from 'lucide-react';

export default function Ch14ImageGansPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch14/image-gans"
      heroIcon={<Image className="w-9 h-9 text-blue-600" />}
      summary={"图像 GAN 将生成对抗网络应用于图像生成与转换；CycleGAN 通过循环一致性损失，在没有成对训练数据的情况下学习两个视觉域之间的双向映射。"}
      concepts={[
        {
          title: "Image GANs",
          description: "把 GAN 框架用于图像合成与转换任务，包括深度卷积 GAN、条件 GAN 以及图像到图像翻译模型。",
        },
        {
          title: "CycleGAN",
          description: "学习两个域之间的双向映射 G: X→Y 与 F: Y→X，通过对抗损失与循环一致性损失实现无配对数据的图像翻译。",
        },
        {
          title: "Cycle consistency loss",
          description: "约束转换后再转换回原域的结果接近原始输入，即 F(G(x))≈x 且 G(F(y))≈y，为无配对数据提供监督信号。",
          formula: String.raw`L_{\text{cyc}} = \mathbb{E}_x[\|F(G(x))-x\|_1] + \mathbb{E}_y[\|G(F(y))-y\|_1]`,
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
            bishopMapping={{
        chapter: "Ch 17",
        section: "17.2",
        pages: "Ch 17",
        textbookSubsections: [
          "17.2 Image GANs",
          "17.2.1 CycleGAN"
        ],
        supplementalTopics: [
          "DCGAN",
          "conditional GAN"
        ],
        formulas: ["cycle consistency loss"],
        algorithms: ["CycleGAN"],
        exercises: ["说明 CycleGAN 为什么不需要成对数据。"],
      }}
    />
  );
}
