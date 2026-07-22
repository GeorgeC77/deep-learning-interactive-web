import BishopSectionPage from '@/components/BishopSectionPage';
import UnetDemo from '@/components/demos/UnetDemo';
import TranslationEquivarianceLab from '@/components/demos/TranslationEquivarianceLab';
import { outputSizeFormulaLatex, frameworkSameFormulaLatex } from '@/lib/math/conv';
import { Scissors } from 'lucide-react';

export default function Ch07ImageSegmentationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/image-segmentation"
      heroIcon={<Scissors className="w-9 h-9 text-blue-600" />}
      summary={"图像分割为每个像素分配类别标签。全卷积网络用卷积、池化与上采样替代全连接层，可接受可变空间尺寸输入；U-Net 通过编码器-解码器结构与跳跃连接恢复精细边界。"}
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
          title: "平移等变与可变空间尺寸",
          description: "卷积在兼容边界条件下具有平移等变性；池化、步幅、填充与裁剪会破坏精确等变性。FCN 包含卷积、池化与上采样，可处理可变空间尺寸，但任意像素置换不是其对称性。",
          formula: outputSizeFormulaLatex,
        },
      ]}
      learningObjectives={[
        "理解全卷积网络为何能处理可变空间尺寸输入。",
        "能描述 U-Net 的编码器-解码器-跳跃连接结构。",
        "区分语义分割与实例分割的评价指标。",
      ]}
      coreIntuition={"分割不是给整张图一个标签，而是给每个像素一个标签；全卷积网络把分类器变成“空间分类器”，U-Net 再把丢失的细节通过跳跃连接找回来。"}
      commonMistakes={[
        "在分割网络末尾保留全连接层，导致只能接受固定尺寸输入。",
        "认为上采样只是简单插值，忽略转置卷积可学习参数的作用。",
        "跳跃连接把编码器与解码器特征直接相加而不考虑通道对齐。",
        "把 CNN 的平移等变性错误地推广为任意像素置换等变性。",
      ]}
      whyCards={[
        {
          question: "为什么分割要去掉全连接层？",
          answer: "全连接层把空间信息压成一个固定向量，就无法再给每个像素一个标签。只用卷积和上采样，才能保留空间结构、处理任意尺寸。",
        },
        {
          question: "为什么 U-Net 要加跳跃连接？",
          answer: "下采样会丢掉边缘等细节。跳跃连接把浅层的高分辨率特征直接送到解码器，帮助恢复精细边界。",
        },
      ]}
      counterexamples={[
        "若只保留卷积却在结尾加全连接层，网络就只能接受固定尺寸输入，无法处理可变尺寸图像——FCN 的优势就消失了。",
        "把 CNN 的平移等变错误推广成“任意像素重排也等变”是不对的：卷积只对平移（在兼容边界下）等变，对随机打乱像素并不对称。",
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
        formulas: [outputSizeFormulaLatex, frameworkSameFormulaLatex, "上采样分辨率关系"],
        algorithms: ["全卷积网络 FCN", "U-Net 编码器-解码器"],
        exercises: ["画出 U-Net 的结构框图并标注 skip connection。", "用不同输入尺寸测试 FCN 输出尺寸。"],
      }}
      interactiveDemo={<TranslationEquivarianceLab />}
      extraContent={<UnetDemo />}
    />
  );
}
