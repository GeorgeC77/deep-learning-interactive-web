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
      title: "视觉 Transformer",
      description: "将图像切分为 patch 序列，直接用 Transformer 建模空间关系。",
    },
    {
      title: "图像生成 Transformer",
      description: "将图像 token 化后按自回归或掩码方式生成。",
    },
    {
      title: "音频与语音",
      description: "将频谱或波形切分为 token，Transformer 学习长程声学结构。",
    },
    {
      title: "视觉-语言模型",
      description: "联合编码文本与图像，实现跨模态理解、问答与生成。",
    },
      
    {
      title: "Vision transformers",
      description: "介绍 Vision transformers 的定义、关键公式与典型应用场景。",
    },
  ]}
      learningObjectives={[
      "理解 视觉 Transformer 的含义与作用。",
      "理解 图像生成 Transformer 的含义与作用。",
      "理解 音频与语音 的含义与作用。"
    ]}
      coreIntuition={"Transformer 已扩展到图像、音频、视频等多模态数据；视觉 Transformer 与视觉-语言模型展示了统一架构的潜力。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
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
          "12.4.5 Vision and language transformers"
        ],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
