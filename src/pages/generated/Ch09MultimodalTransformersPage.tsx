import BishopSectionPage from '@/components/BishopSectionPage';
import { ImagePlus } from 'lucide-react';

export default function Ch09MultimodalTransformersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch09/multimodal-transformers"
      heroIcon={<ImagePlus className="w-9 h-9 text-blue-600" />}
      summary={"Transformer 已扩展到图像、音频、视频等多模态数据；视觉 Transformer 与视觉-语言模型展示了统一架构的潜力。"}
      concepts={[
        {
          title: "视觉 Transformer (ViT)",
          description: "将图像切分为固定大小的 patch 序列，用 Transformer 建模空间关系。位置编码同样必要，因为 patch 顺序决定了图像的空间结构。",
        },
        {
          title: "图像生成 Transformer",
          description: "将图像 token 化后按自回归或掩码方式生成，可以看作图像版的语言模型。",
        },
        {
          title: "音频与语音",
          description: "将频谱或波形切分为 token，Transformer 学习长程声学结构，用于语音识别与合成。",
        },
        {
          title: "视觉-语言模型",
          description: "联合编码文本与图像，实现跨模态理解、问答与生成，如 CLIP、Flamingo 等。",
        },
      ]}
      learningObjectives={[
        "理解视觉 Transformer 如何将图像转化为序列建模。",
        "了解图像生成 Transformer 的自回归与掩码生成方式。",
        "认识音频数据如何 token 化并接入 Transformer。",
        "理解视觉-语言模型的跨模态对齐思想。",
      ]}
      coreIntuition={"Transformer 的核心是序列到序列的注意力计算，只要能把任意模态的数据转化为 token 序列，就能用同一套架构处理。"}
      commonMistakes={[
        "认为视觉 Transformer 不需要位置编码；图像 patch 的顺序同样重要。",
        "把图像生成 Transformer 与扩散模型混为一谈；前者是 token 自回归/掩码生成，后者是逐步去噪。",
        "忽视音频数据 token 化的方式差异（波形、频谱、离散声学单元）。",
      ]}
      whyCards={[
        {
          question: "为什么视觉 Transformer 要把图像切成 patch？",
          answer: "Transformer 的输入是序列；把图像切成 patch 相当于把二维空间展开成一维序列，同时保留局部结构。",
        },
        {
          question: "为什么视觉-语言模型能统一处理图像和文本？",
          answer: "图像和文本都被转化为 token 序列，通过共享或交互的注意力层学习跨模态对齐。",
        },
      ]}
      counterexamples={[
        "把图像 patch 随机打乱后，视觉 Transformer 性能显著下降——说明位置编码对空间结构至关重要。",
        "同样的文本提示，用图像生成 Transformer 和扩散模型生成的图像风格差异很大，说明生成机制不同。",
      ]}
      bishopMapping={{
        chapter: "Ch 12",
        section: "12.4",
        pages: "Ch 12",
        textbookSubsections: [
          "12.4 Multimodal Transformers",
          "12.4.1 Vision transformers",
          "12.4.2 Generative image transformers",
          "12.4.3 Audio data",
          "12.4.4 Text-to-speech",
          "12.4.5 Vision and language transformers",
        ],
        exercises: [
          "说明视觉 Transformer 中 patch embedding 与位置编码的作用。",
          "比较图像生成 Transformer 与扩散模型的生成过程。",
          "举例说明视觉-语言模型在零样本分类中的工作原理。",
        ],
      }}
    />
  );
}
