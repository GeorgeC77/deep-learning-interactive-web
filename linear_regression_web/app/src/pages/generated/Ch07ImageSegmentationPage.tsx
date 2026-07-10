import BishopSectionPage from '@/components/BishopSectionPage';
import UnetDemo from '@/components/demos/UnetDemo';
import { Scissors } from 'lucide-react';

export default function Ch07ImageSegmentationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/image-segmentation"
      heroIcon={<Scissors className="w-9 h-9 text-blue-600" />}
      summary={"图像分割为每个像素分配类别标签。全卷积网络用卷积替代全连接层，可接受任意尺寸输入；U-Net 通过编码器-解码器结构与跳跃连接恢复精细边界。"}
      concepts={[
        {
          title: "全卷积网络 FCN",
          description: "用卷积、池化与上采样替代全连接层，输出与输入尺寸对应的空间标签图。",
        },
        {
          title: "上采样",
          description: "通过转置卷积、双线性插值或像素洗牌提高特征图分辨率。",
        },
        {
          title: "U-Net 结构",
          description: "编码器下采样提取语义，解码器上采样恢复空间，跳跃连接保留高分辨率细节。",
        },
        {
          title: "置换等变与任意尺寸",
          description: "由于只含卷积操作，网络对输入尺寸的依赖是线性的，卷积核数量固定。",
          formula: String.raw`H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} + 2P - K}{S} \right\rfloor + 1`,
        },
      ]}
      learningObjectives={[
        "理解全卷积网络为何能处理任意尺寸输入。",
        "能描述 U-Net 的编码器-解码器-跳跃连接结构。",
        "区分语义分割与实例分割的评价指标。",
      ]}
      coreIntuition={"分割不是给整张图一个标签，而是给每个像素一个标签；全卷积网络把分类器变成“空间分类器”，U-Net 再把丢失的细节通过跳跃连接找回来。"}
      commonMistakes={[
        "在分割网络末尾保留全连接层，导致只能接受固定尺寸输入。",
        "认为上采样只是简单插值，忽略转置卷积可学习参数的作用。",
        "跳跃连接把编码器与解码器特征直接相加而不考虑通道对齐。",
      ]}
      quiz={[
        {
          question: "FCN 能处理任意尺寸输入的根本原因是？",
          options: [
            "网络只包含卷积、池化与上采样，没有全连接层。",
            "输入图像总是先被缩放到固定尺寸。",
            "分割任务对尺寸不敏感。",
            "全连接层也被用于空间位置预测。",
          ],
          correctIndex: 0,
          explanation: "卷积核数量固定，输出特征图尺寸随输入尺寸线性变化；全连接层会破坏这种性质。",
        },
        {
          question: "U-Net 中跳跃连接的主要作用是？",
          options: [
            "把编码器的高分辨率细节传递到解码器，帮助恢复边界。",
            "减少模型参数量。",
            "替代下采样操作。",
            "把输入直接复制到输出。",
          ],
          correctIndex: 0,
          explanation: "下采样会丢失空间细节，跳跃连接将同层编码器特征拼接到解码器，补偿细节损失。",
        },
        {
          question: "若输入 256×256，经过 3 次 2×2 最大池化后，特征图空间尺寸变为多少？",
          options: ["32×32", "64×64", "128×128", "16×16"],
          correctIndex: 0,
          explanation: "每次池化尺寸减半：256→128→64→32，因此 3 次后为 32×32。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 10",
        section: "10.5",
        pages: "Ch 10",
        textbookSubsections: [
          "10.5.1 Convolutional segmentation",
          "10.5.3 Fully convolutional networks",
          "10.5.2 Up-sampling",
          "10.5.4 The U-net architecture"
        ],
        formulas: ["卷积输出尺寸公式", "上采样分辨率关系"],
        algorithms: ["全卷积网络 FCN", "U-Net 编码器-解码器"],
        exercises: ["画出 U-Net 的结构框图并标注 skip connection。", "用不同输入尺寸测试 FCN 输出尺寸。"],
      }}
      extraContent={<UnetDemo />}
    />
  );
}
