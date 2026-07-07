import BishopSectionPage from '@/components/BishopSectionPage';
import { Grid3X3 } from 'lucide-react';

export default function AppendixAOverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/appendix/a/overview"
      heroIcon={<Grid3X3 className="w-9 h-9 text-blue-600" />}
      summary={"线性代数附录回顾矩阵运算、迹、行列式、导数与特征分解，是理解神经网络公式的基础工具。"}
      concepts={[
    {
      title: "矩阵求导",
      description: "掌握向量/矩阵值函数对向量/矩阵的导数规则，可快速推导梯度。",
      formula: String.raw`\frac{\partial}{\partial \mathbf{x}} (\mathbf{x}^{\!T} A \mathbf{x}) = (A + A^{\!T})\mathbf{x}`,
    },
    {
      title: "特征分解",
      description: "对称矩阵可正交对角化，特征值与特征向量刻画线性变换的主轴。",
      formula: String.raw`A = Q \Lambda Q^{\!T}`,
    },
    {
      title: "迹与行列式",
      description: "迹对循环置换不变，行列式表示线性变换对体积的缩放。",
    }
      ]}
      learningObjectives={[
      "理解 矩阵求导 的含义与作用。",
      "理解 特征分解 的含义与作用。",
      "理解 迹与行列式 的含义与作用。"
    ]}
      coreIntuition={"线性代数附录回顾矩阵运算、迹、行列式、导数与特征分解，是理解神经网络公式的基础工具。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“矩阵求导”的叙述，哪一项最准确？",
        options: ["掌握向量/矩阵值函数对向量/矩阵的导数规则，可快速推导梯度。", "矩阵求导 只是术语，没有独立建模意义。", "矩阵求导 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。掌握向量/矩阵值函数对向量/矩阵的导数规则，可快速推导梯度。 这体现了本节的核心思想。",
      },
      {
        question: "在“特征分解”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。特征分解 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“迹与行列式”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。迹与行列式 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Appendix A",
      pages: "Appendix A",
      textbookSubsections: ["矩阵求导", "特征分解", "迹与行列式"],
      formulas: ["矩阵求导公式", "特征分解公式"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}
          demo={{
      title: "二次型取值",
      label: "向量 x",
      param: 2,
      min: -3,
      max: 3,
      step: 0.1,
      compute: (x) => ({
        label: 'x²',
        value: x * x,
        display: String.raw`${x.toFixed(1)}^2=${(x * x).toFixed(2)}`,
      }),
      formula: String.raw`f(x) = x^2`,
    }}
    />
  );
}
