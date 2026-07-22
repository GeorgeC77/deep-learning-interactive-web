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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Appendix A",
      pages: "Appendix A",
      textbookSubsections: [],
      formulas: ["矩阵求导公式", "特征分解公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
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
