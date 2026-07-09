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
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“内容表示”的叙述，哪一项最准确？",
        options: ["使用高层特征图捕捉图像的语义结构，忽略具体像素值。", "内容表示 只是术语，没有独立建模意义。", "内容表示 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。使用高层特征图捕捉图像的语义结构，忽略具体像素值。 这体现了本节的核心思想。",
      },
      {
        question: "在“风格表示”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。风格表示 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“优化目标”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。优化目标 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 10",
      section: "10.6",
      pages: "Ch 10",
      textbookSubsections: [
          "10.6 Style Transfer"
        ],
      formulas: ["风格表示公式"],
      algorithms: ["优化目标"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}

    />
  );
}
