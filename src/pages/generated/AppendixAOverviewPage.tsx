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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“矩阵求导”，下列说法是否正确？",
        options: ["掌握向量/矩阵值函数对向量/矩阵的导数规则，可快速推导梯度。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。掌握向量/矩阵值函数对向量/矩阵的导数规则，可快速推导梯度。",
      },
      {
        question: "关于“特征分解”，下列说法是否正确？",
        options: ["对称矩阵可正交对角化，特征值与特征向量刻画线性变换的主轴。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对称矩阵可正交对角化，特征值与特征向量刻画线性变换的主轴。",
      },
      {
        question: "关于“迹与行列式”，下列说法是否正确？",
        options: ["迹对循环置换不变，行列式表示线性变换对体积的缩放。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。迹对循环置换不变，行列式表示线性变换对体积的缩放。",
      }
    ]}
      bishopMapping={{
      chapter: "Appendix A",
      section: "",
      pages: "",
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
