import BishopSectionPage from '@/components/BishopSectionPage';
import { Shrink } from 'lucide-react';

export default function Ch16OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch16/overview"
      heroIcon={<Shrink className="w-9 h-9 text-blue-600" />}
      summary={"自编码器通过编码器-解码器结构学习压缩表示，可用于降维、去噪与生成建模。"}
      concepts={[
    {
      title: "编码器与解码器",
      description: "编码器将输入映射到低维隐空间，解码器重构原始输入。",
    },
    {
      title: "重构损失",
      description: "通常用均方误差或交叉熵衡量输入与重构之间的差距。",
    },
    {
      title: "生成视角",
      description: "变分自编码器在隐空间施加先验，使解码器成为生成模型。",
    }
      ]}
      learningObjectives={[
      "理解 编码器与解码器 的含义与作用。",
      "理解 重构损失 的含义与作用。",
      "理解 生成视角 的含义与作用。"
    ]}
      coreIntuition={"自编码器通过编码器-解码器结构学习压缩表示，可用于降维、去噪与生成建模。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“编码器与解码器”，下列说法是否正确？",
        options: ["编码器将输入映射到低维隐空间，解码器重构原始输入。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。编码器将输入映射到低维隐空间，解码器重构原始输入。",
      },
      {
        question: "关于“重构损失”，下列说法是否正确？",
        options: ["通常用均方误差或交叉熵衡量输入与重构之间的差距。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通常用均方误差或交叉熵衡量输入与重构之间的差距。",
      },
      {
        question: "关于“生成视角”，下列说法是否正确？",
        options: ["变分自编码器在隐空间施加先验，使解码器成为生成模型。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。变分自编码器在隐空间施加先验，使解码器成为生成模型。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 19",
      section: "",
      pages: "",
    }}

    />
  );
}
