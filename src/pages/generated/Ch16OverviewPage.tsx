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
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“编码器与解码器”的叙述，哪一项最准确？",
        options: ["编码器将输入映射到低维隐空间，解码器重构原始输入。", "编码器与解码器 与本节讨论的问题完全无关。", "编码器与解码器 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。编码器将输入映射到低维隐空间，解码器重构原始输入。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“重构损失”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。重构损失 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“生成视角”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。生成视角 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 19",
      pages: "Ch 19",
      textbookSubsections: ["编码器与解码器", "重构损失", "生成视角"],
      algorithms: ["编码器与解码器"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
