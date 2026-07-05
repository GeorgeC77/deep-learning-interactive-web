import BishopSectionPage from '@/components/BishopSectionPage';
import { Waves } from 'lucide-react';

export default function Ch17OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/overview"
      heroIcon={<Waves className="w-9 h-9 text-blue-600" />}
      summary={"扩散模型通过渐进加噪与逐步去噪学习数据分布，已成为高质量图像与音频生成的主流方法。"}
      concepts={[
    {
      title: "前向扩散",
      description: "在 T 步内向数据逐步加入高斯噪声，最终趋近简单先验。",
    },
    {
      title: "反向去噪",
      description: "训练神经网络预测噪声或分数，逐步恢复干净数据。",
    },
    {
      title: "引导生成",
      description: "分类器或无分类器引导可在采样时控制生成内容与语义对齐。",
    }
      ]}
      learningObjectives={[
      "理解 前向扩散 的含义与作用。",
      "理解 反向去噪 的含义与作用。",
      "理解 引导生成 的含义与作用。"
    ]}
      coreIntuition={"扩散模型通过渐进加噪与逐步去噪学习数据分布，已成为高质量图像与音频生成的主流方法。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“前向扩散”，下列说法是否正确？",
        options: ["在 T 步内向数据逐步加入高斯噪声，最终趋近简单先验。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。在 T 步内向数据逐步加入高斯噪声，最终趋近简单先验。",
      },
      {
        question: "关于“反向去噪”，下列说法是否正确？",
        options: ["训练神经网络预测噪声或分数，逐步恢复干净数据。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。训练神经网络预测噪声或分数，逐步恢复干净数据。",
      },
      {
        question: "关于“引导生成”，下列说法是否正确？",
        options: ["分类器或无分类器引导可在采样时控制生成内容与语义对齐。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。分类器或无分类器引导可在采样时控制生成内容与语义对齐。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 20",
      section: "",
      pages: "",
    }}

    />
  );
}
