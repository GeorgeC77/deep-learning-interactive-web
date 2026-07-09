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
      quiz={[
        {
          question: "CycleGAN 为什么能在没有成对数据的情况下学习域转换？",
          options: [
            "它通过循环一致性损失把无配对样本组织成可学习的约束。",
            "它完全不需要判别器。",
            "它假设两个域的图像完全相同。",
            "它使用预训练分类器生成配对数据。",
          ],
          correctIndex: 0,
          explanation: "CycleGAN 同时学习双向映射并要求 F(G(x))≈x，无需输入与输出的一一对应。",
        },
        {
          question: "循环一致性损失的目标是什么？",
          options: [
            "让 x 经 G 到 Y 域再经 F 回到 X 域后尽量接近原始 x。",
            "让判别器无法区分真实图像与生成图像。",
            "让生成器输出与输入完全相同。",
            "让两个域的边缘分布完全相等。",
          ],
          correctIndex: 0,
          explanation: "循环一致性约束 F(G(x))≈x 与 G(F(y))≈y，是无配对数据的直接监督来源。",
        },
        {
          question: "如果去掉 cycle consistency loss，只保留对抗损失，最可能出现什么问题？",
          options: [
            "生成器可能把输入映射到目标域的任意图像，失去与输入的对应关系。",
            "训练完全无法开始。",
            "判别器会立即收敛到最优。",
            "生成图像质量一定更高。",
          ],
          correctIndex: 0,
          explanation: "没有循环一致性，生成器只需生成目标域中像真实图像的样本，而不必保留输入的语义内容。",
        },
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
