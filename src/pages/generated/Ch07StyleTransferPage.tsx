import BishopSectionPage from '@/components/BishopSectionPage';
import { Palette } from 'lucide-react';

export default function Ch07StyleTransferPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/style-transfer"
      heroIcon={<Palette className="w-9 h-9 text-blue-600" />}
      summary={"神经风格迁移把内容图像的结构与风格图像的纹理分离并重组。通过预训练 CNN 的高层特征表示内容、Gram 矩阵表示风格，再优化生成图像像素或训练前馈网络，实现艺术化图像生成。"}
      concepts={[
        {
          title: "Content representation",
          description: "使用预训练 CNN 的高层 feature map 表示图像的语义结构，忽略具体像素值。",
        },
        {
          title: "Style representation",
          description: "用 Gram 矩阵统计特征图通道之间的相关性，捕捉纹理、色彩和局部图案的分布。",
          formula: String.raw`G_{ij} = \sum_{k} F_{ik} F_{jk}`,
        },
        {
          title: "Content loss",
          description: "合成图像与内容图像在某一高层特征空间中的欧氏距离，约束语义结构保持一致。",
          formula: String.raw`L_{\text{content}} = \frac{1}{2} \sum_{i,j} (F_{ij}^{\hat{x}} - F_{ij}^{x})^2`,
        },
        {
          title: "Style loss",
          description: "合成图像与风格图像在多层上的 Gram 矩阵差异之和，约束纹理统计相似。",
          formula: String.raw`L_{\text{style}} = \sum_l \frac{1}{4 N_l^2 M_l^2} \sum_{i,j} (G_{ij}^{\hat{x},l} - G_{ij}^{s,l})^2`,
        },
        {
          title: "Total objective",
          description: "内容损失与风格损失的加权组合，通过调节权重控制生成结果。",
          formula: String.raw`L = \alpha L_{\text{content}} + \beta L_{\text{style}}`,
        },
        {
          title: "Optimization process",
          description: "固定预训练 CNN 的权重，直接对输入图像像素进行梯度下降；也可以训练前馈网络一次性生成风格化图像。",
        },
      ]}
      learningObjectives={[
        "理解 CNN 高层特征如何表示图像内容。",
        "理解 Gram 矩阵为什么能捕捉风格纹理。",
        "能写出风格迁移的总目标函数并解释 α、β 的作用。",
      ]}
      coreIntuition={"风格迁移像把一张照片的‘骨架’和一幅画的‘笔触’重新合成：内容损失保住骨架，风格损失引入笔触，优化过程则让像素同时满足两个约束。"}
      commonMistakes={[
        "把风格迁移理解成简单滤镜；它实际是在特征空间约束下的优化问题。",
        "认为 Gram 矩阵保留空间布局；它主要捕捉纹理统计，弱化空间位置信息。",
        "忽视内容权重 α 与风格权重 β 的比例，导致结果过像风格或丢失内容。",
      ]}
      quiz={[
        {
          question: "Gram 矩阵为什么能表示风格？",
          options: [
            "它统计同一层特征通道之间的相关性，反映纹理和色彩分布。",
            "它直接记录图像中每个物体的空间位置。",
            "它等于内容特征图本身。",
            "它只与像素亮度有关，与纹理无关。",
          ],
          correctIndex: 0,
          explanation: "Gram 矩阵通过通道间内积去掉空间信息，保留纹理统计特征，因此适合表示风格。",
        },
        {
          question: "设某层风格图像 Gram 矩阵为 G^s，合成图像 Gram 矩阵为 G^\hat{x}，则该层风格损失正比于？",
          options: [
            "G^\hat{x} 与 G^s 对应元素差的平方和。",
            "G^\hat{x} 与 G^s 的逐元素乘积。",
            "合成图像与风格图像的像素差。",
            "内容特征与风格特征的点积。",
          ],
          correctIndex: 0,
          explanation: "风格损失衡量两层 Gram 矩阵之间的 Frobenius 距离，即对应元素差的平方和。",
        },
        {
          question: "在风格迁移中，若 β 相对 α 过大，最可能出现什么结果？",
          options: [
            "风格纹理被过度强调，内容结构可能被破坏。",
            "生成图像完全等同于内容图像。",
            "Gram 矩阵不再影响优化。",
            "内容损失自动降为零。",
          ],
          correctIndex: 0,
          explanation: "β 过大时优化更关注风格匹配，可能牺牲内容结构，使图像更像风格画而内容难以辨认。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 10",
        section: "10.6",
        pages: "Ch 10",
        textbookSubsections: [
          "10.6 Style Transfer"
        ],
        formulas: ["content loss", "style loss", "total objective"],
        algorithms: ["gradient-based style transfer", "feed-forward style transfer"],
        exercises: [
          "用 2×2 feature map 手算 Gram matrix。",
          "调整 α/β 观察内容保持与风格强度的权衡。",
          "比较浅层和深层特征用于风格/内容表示的差异。",
        ],
      }}
    />
  );
}
