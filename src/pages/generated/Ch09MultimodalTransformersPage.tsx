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
      quiz={[
      {
        question: "下列关于“视觉 Transformer”的叙述，哪一项最准确？",
        options: ["将图像切分为 patch 序列，直接用 Transformer 建模空间关系。", "视觉 Transformer 只是术语，没有独立建模意义。", "视觉 Transformer 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。将图像切分为 patch 序列，直接用 Transformer 建模空间关系。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“图像生成 Transformer”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。图像生成 Transformer 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“音频与语音”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。音频与语音 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
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
