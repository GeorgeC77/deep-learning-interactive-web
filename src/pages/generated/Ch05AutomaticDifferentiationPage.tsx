import BishopSectionPage from '@/components/BishopSectionPage';
import { Calculator } from 'lucide-react';

export default function Ch05AutomaticDifferentiationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch05/automatic-differentiation"
      heroIcon={<Calculator className="w-9 h-9 text-blue-600" />}
      summary={"自动微分将复杂函数拆分为基本运算，通过反向模式在计算图上机械地传播梯度，是现代框架的核心。"}
      concepts={[
    {
      title: "反向模式自动微分",
      description: "先执行前向计算记录图，再从输出节点反向传播伴随向量。",
    },
    {
      title: "前向模式",
      description: "对每个输入方向单独传播导数，适合输入维度低的场景。",
    },
    {
      title: "计算图与拓扑序",
      description: "节点按依赖顺序求值，反向传播按逆拓扑序更新梯度。",
    }
      ]}
      learningObjectives={[
      "理解 反向模式自动微分 的含义与作用。",
      "理解 前向模式 的含义与作用。",
      "理解 计算图与拓扑序 的含义与作用。"
    ]}
      coreIntuition={"自动微分将复杂函数拆分为基本运算，通过反向模式在计算图上机械地传播梯度，是现代框架的核心。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“反向模式自动微分”的叙述，哪一项最准确？",
        options: ["先执行前向计算记录图，再从输出节点反向传播伴随向量。", "反向模式自动微分 与本节讨论的问题完全无关。", "反向模式自动微分 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。先执行前向计算记录图，再从输出节点反向传播伴随向量。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“前向模式”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。前向模式 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“计算图与拓扑序”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。计算图与拓扑序 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 8",
      section: "8.2",
      pages: "Ch 8",
      textbookSubsections: ["8.2.1 反向模式自动微分", "8.2.2 前向模式", "8.2.3 计算图与拓扑序"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "自动微分示例 f(x)=x²",
      label: "输入 x",
      param: 2,
      min: -3,
      max: 3,
      step: 0.1,
      compute: (x) => ({
        label: 'f(x)=x²',
        value: x * x,
        display: String.raw`\frac{df}{dx}=2\cdot${x.toFixed(1)}=${(2 * x).toFixed(1)}`,
      }),
      formula: String.raw`f(x)=x^2 \Rightarrow \frac{df}{dx}=2x`,
    }}
    />
  );
}
