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
      "混淆本节核心概念与相邻小节的前提假设，导致错误套用。",
      "只记忆公式形式，而不验证其成立条件与具体数值。"
    ]}
      quiz={[
      {
        question: "下列关于“反向模式自动微分”的叙述，哪一项最准确？",
        options: ["先执行前向计算记录图，再从输出节点反向传播伴随向量。", "反向模式自动微分 只是术语，没有独立建模意义。", "反向模式自动微分 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。先执行前向计算记录图，再从输出节点反向传播伴随向量。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“前向模式”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。前向模式 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“计算图与拓扑序”的结果违背直觉，应优先排查哪些前提假设？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。计算图与拓扑序 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 8",
      section: "8.2",
      pages: "Ch 8",
      textbookSubsections: [
          "8.2 Automatic Differentiation"
        ],
      exercises: ["推导本节核心公式的展开形式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "对比本节结论与先前章节结论的适用条件差异。"]
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
