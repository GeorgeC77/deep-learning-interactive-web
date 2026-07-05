import BishopSectionPage from '@/components/BishopSectionPage';
import { SeparatorVertical } from 'lucide-react';

export default function Ch02DiscriminantFunctionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/discriminant-functions"
      heroIcon={<SeparatorVertical className="w-9 h-9 text-blue-600" />}
      summary={"判别函数直接为输入 x 分配类别标签；二分类与多分类的决策边界是理解分类器的几何起点。"}
      concepts={[
    {
      title: "二分类判别函数",
      description: "用单个实值函数 y(x) 的符号决定类别，决策面 y(x)=0 划分输入空间。",
      formula: String.raw`y(\mathbf{x}) = \mathbf{w}^{\!T}\mathbf{x} + w_0`,
    },
    {
      title: "多类判别函数",
      description: "为每个类别定义一个判别函数，选择最大值对应的类别。",
    },
    {
      title: "最小二乘分类",
      description: "用回归思路拟合 1-of-K 编码目标，但对异常值敏感。",
    }
      ]}
      learningObjectives={[
      "理解 二分类判别函数 的含义与作用。",
      "理解 多类判别函数 的含义与作用。",
      "理解 最小二乘分类 的含义与作用。"
    ]}
      coreIntuition={"判别函数直接为输入 x 分配类别标签；二分类与多分类的决策边界是理解分类器的几何起点。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“二分类判别函数”，下列说法是否正确？",
        options: ["用单个实值函数 y(x) 的符号决定类别，决策面 y(x)=0 划分输入空间。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用单个实值函数 y(x) 的符号决定类别，决策面 y(x)=0 划分输入空间。",
      },
      {
        question: "关于“多类判别函数”，下列说法是否正确？",
        options: ["为每个类别定义一个判别函数，选择最大值对应的类别。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。为每个类别定义一个判别函数，选择最大值对应的类别。",
      },
      {
        question: "关于“最小二乘分类”，下列说法是否正确？",
        options: ["用回归思路拟合 1-of-K 编码目标，但对异常值敏感。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。用回归思路拟合 1-of-K 编码目标，但对异常值敏感。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 5",
      section: "",
      pages: "",
    }}
          demo={{
      title: "决策边界随权重变化",
      label: "偏置 w₀",
      param: 0,
      min: -3,
      max: 3,
      step: 0.1,
      compute: (w0) => ({
        label: '边界 x 截距',
        value: -w0,
        display: String.raw`x=-${w0.toFixed(1)}`,
      }),
      formula: String.raw`x = -w_0 / w_1`,
    }}
    />
  );
}
