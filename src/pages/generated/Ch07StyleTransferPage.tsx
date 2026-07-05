import BishopSectionPage from '@/components/BishopSectionPage';
import { Palette } from 'lucide-react';

export default function Ch07StyleTransferPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/style-transfer"
      heroIcon={<Palette className="w-9 h-9 text-blue-600" />}
      summary={"神经风格迁移将内容图像的结构与风格图像的纹理分离并重组，通过优化或训练网络实现艺术化生成。"}
      concepts={[
    {
      title: "内容表示",
      description: "使用高层特征图捕捉图像的语义结构，忽略具体像素值。",
    },
    {
      title: "风格表示",
      description: "用 Gram 矩阵统计特征图通道间的相关性，捕捉纹理与色彩分布。",
      formula: String.raw`G_{ij} = \sum_{k} F_{ik} F_{jk}`,
    },
    {
      title: "优化目标",
      description: "合成图像同时最小化与内容图像的特征距离和与风格图像的 Gram 距离。",
    }
      ]}
      learningObjectives={[
      "理解 内容表示 的含义与作用。",
      "理解 风格表示 的含义与作用。",
      "理解 优化目标 的含义与作用。"
    ]}
      coreIntuition={"神经风格迁移将内容图像的结构与风格图像的纹理分离并重组，通过优化或训练网络实现艺术化生成。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“内容表示”，下列说法是否正确？",
        options: ["使用高层特征图捕捉图像的语义结构，忽略具体像素值。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。使用高层特征图捕捉图像的语义结构，忽略具体像素值。",
      },
      {
        question: "关于“风格表示”，下列说法是否正确？",
        options: ["用 Gram 矩阵统计特征图通道间的相关性，捕捉纹理与色彩分布。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用 Gram 矩阵统计特征图通道间的相关性，捕捉纹理与色彩分布。",
      },
      {
        question: "关于“优化目标”，下列说法是否正确？",
        options: ["合成图像同时最小化与内容图像的特征距离和与风格图像的 Gram 距离。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。合成图像同时最小化与内容图像的特征距离和与风格图像的 Gram 距离。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 10",
      section: "",
      pages: "",
    }}

    />
  );
}
