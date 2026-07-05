import BishopSectionPage from '@/components/BishopSectionPage';
import { Scissors } from 'lucide-react';

export default function Ch07ImageSegmentationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/image-segmentation"
      heroIcon={<Scissors className="w-9 h-9 text-blue-600" />}
      summary={"图像分割为每个像素分配语义标签；编码器-解码器结构与跳跃连接帮助恢复精细空间细节。"}
      concepts={[
    {
      title: "上采样",
      description: "转置卷积或插值将低分辨率特征恢复到输入尺寸，便于逐像素预测。",
    },
    {
      title: "U-Net 结构",
      description: "对称的编码器-解码器加跨层连接，在医学图像等领域广泛应用。",
    },
    {
      title: "全卷积网络",
      description: "用卷积替代全连接层，使任意尺寸输入都能输出对应尺寸的分割图。",
    }
      ]}
      learningObjectives={[
      "理解 上采样 的含义与作用。",
      "理解 U-Net 结构 的含义与作用。",
      "理解 全卷积网络 的含义与作用。"
    ]}
      coreIntuition={"图像分割为每个像素分配语义标签；编码器-解码器结构与跳跃连接帮助恢复精细空间细节。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“上采样”，下列说法是否正确？",
        options: ["转置卷积或插值将低分辨率特征恢复到输入尺寸，便于逐像素预测。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。转置卷积或插值将低分辨率特征恢复到输入尺寸，便于逐像素预测。",
      },
      {
        question: "关于“U-Net 结构”，下列说法是否正确？",
        options: ["对称的编码器-解码器加跨层连接，在医学图像等领域广泛应用。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对称的编码器-解码器加跨层连接，在医学图像等领域广泛应用。",
      },
      {
        question: "关于“全卷积网络”，下列说法是否正确？",
        options: ["用卷积替代全连接层，使任意尺寸输入都能输出对应尺寸的分割图。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用卷积替代全连接层，使任意尺寸输入都能输出对应尺寸的分割图。",
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
