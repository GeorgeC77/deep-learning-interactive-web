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
      "混淆本节核心概念与相邻小节的前提假设，导致错误套用。",
      "只记忆公式形式，而不验证其成立条件与具体数值。"
    ]}
      quiz={[
      {
        question: "下列关于“二分类判别函数”的叙述，哪一项最准确？",
        options: ["用单个实值函数 y(x) 的符号决定类别，决策面 y(x)=0 划分输入空间。", "二分类判别函数 只是术语，没有独立建模意义。", "二分类判别函数 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。用单个实值函数 y(x) 的符号决定类别，决策面 y(x)=0 划分输入空间。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“多类判别函数”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。多类判别函数 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“最小二乘分类”的结果违背直觉，应优先排查哪些前提假设？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。最小二乘分类 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 5",
      section: "5.1",
      pages: "Ch 5",
      textbookSubsections: [
          "5.1 Discriminant Functions"
        ],
      formulas: ["二分类判别函数公式"],
      exercises: ["推导本节核心公式的展开形式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "对比本节结论与先前章节结论的适用条件差异。"]
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
