import BishopSectionPage from '@/components/BishopSectionPage';
import { Network } from 'lucide-react';

export default function Ch13NonlinearLatentVariableModelsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/nonlinear-latent-variable-models"
      heroIcon={<Network className="w-9 h-9 text-blue-600" />}
      summary={"非线性隐变量模型用神经网络参数化编码器与解码器，能够捕捉复杂流形结构并作为强大生成模型。"}
      concepts={[
    {
      title: "非线性流形",
      description: "真实数据常分布于低维非线性流形，线性方法难以充分刻画。",
    },
    {
      title: "似然函数",
      description: "由于非线性映射的 Jacobian 复杂，精确似然通常难以计算。",
      formula: String.raw`p(x) = \int p(x|z) p(z) \, dz`,
    },
    {
      title: "四类生成方法",
      description: "包括自回归模型、流模型、GAN 与 VAE，它们在表示、训练与采样上各有优劣。",
    }
      ]}
      learningObjectives={[
      "理解 非线性流形 的含义与作用。",
      "理解 似然函数 的含义与作用。",
      "理解 四类生成方法 的含义与作用。"
    ]}
      coreIntuition={"非线性隐变量模型用神经网络参数化编码器与解码器，能够捕捉复杂流形结构并作为强大生成模型。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“非线性流形”的叙述，哪一项最准确？",
        options: ["真实数据常分布于低维非线性流形，线性方法难以充分刻画。", "非线性流形 与本节讨论的问题完全无关。", "非线性流形 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。真实数据常分布于低维非线性流形，线性方法难以充分刻画。 这体现了本节的核心思想。",
      },
      {
        question: "在“似然函数”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。似然函数 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“四类生成方法”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。四类生成方法 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 16",
      section: "16.4",
      pages: "Ch 16",
      textbookSubsections: ["16.4.1 非线性流形", "16.4.2 似然函数", "16.4.3 四类生成方法"],
      formulas: ["似然函数公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}

    />
  );
}
