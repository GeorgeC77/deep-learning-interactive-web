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
    }
      ]}
      learningObjectives={[
      "理解 视觉 Transformer 的含义与作用。",
      "理解 图像生成 Transformer 的含义与作用。",
      "理解 音频与语音 的含义与作用。"
    ]}
      coreIntuition={"Transformer 已扩展到图像、音频、视频等多模态数据；视觉 Transformer 与视觉-语言模型展示了统一架构的潜力。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“视觉 Transformer”，下列说法是否正确？",
        options: ["将图像切分为 patch 序列，直接用 Transformer 建模空间关系。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将图像切分为 patch 序列，直接用 Transformer 建模空间关系。",
      },
      {
        question: "关于“图像生成 Transformer”，下列说法是否正确？",
        options: ["将图像 token 化后按自回归或掩码方式生成。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将图像 token 化后按自回归或掩码方式生成。",
      },
      {
        question: "关于“音频与语音”，下列说法是否正确？",
        options: ["将频谱或波形切分为 token，Transformer 学习长程声学结构。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将频谱或波形切分为 token，Transformer 学习长程声学结构。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 12",
      section: "",
      pages: "",
    }}

    />
  );
}
