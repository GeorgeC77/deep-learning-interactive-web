import BishopSectionPage from '@/components/BishopSectionPage';
import { GitMerge } from 'lucide-react';

export default function Ch05OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch05/overview"
      heroIcon={<GitMerge className="w-9 h-9 text-blue-600" />}
      summary={"反向传播是计算图上的链式法则实现，能够高效求出任意可微网络中损失对每一层参数的梯度。"}
      concepts={[
    {
      title: "计算图",
      description: "将前向计算分解为基本操作的节点，便于自动应用求导规则。",
    },
    {
      title: "链式法则",
      description: "通过上游梯度与局部 Jacobian 相乘，逐层向后传递误差信号。",
      formula: String.raw`\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \frac{\partial y}{\partial x}`,
    },
    {
      title: "前向与反向模式",
      description: "反向模式以一次前向、一次反向即可得到所有输入梯度，适合参数众多的神经网络。",
    }
      ]}
      learningObjectives={[
      "理解 计算图 的含义与作用。",
      "理解 链式法则 的含义与作用。",
      "理解 前向与反向模式 的含义与作用。"
    ]}
      coreIntuition={"反向传播是计算图上的链式法则实现，能够高效求出任意可微网络中损失对每一层参数的梯度。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“计算图”的叙述，哪一项最准确？",
        options: ["将前向计算分解为基本操作的节点，便于自动应用求导规则。", "计算图 只是术语，没有独立建模意义。", "计算图 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。将前向计算分解为基本操作的节点，便于自动应用求导规则。 这体现了本节的核心思想。",
      },
      {
        question: "在“链式法则”的公式中，若省略其中某一项，会对结果产生什么影响？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。链式法则 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“前向与反向模式”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。前向与反向模式 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 8",
      pages: "Ch 8",
      textbookSubsections: [],
      formulas: ["链式法则公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}
          demo={{
      title: "链式法则：复合函数梯度",
      label: "输入 x",
      param: 1,
      min: -2,
      max: 2,
      step: 0.1,
      compute: (x) => ({
        label: 'd/dx tanh(x)',
        value: 1 - Math.tanh(x) ** 2,
        display: String.raw`\frac{d}{dx}\tanh ${x.toFixed(1)}=${(1 - Math.tanh(x) ** 2).toFixed(3)}`,
      }),
      formula: String.raw`\frac{d}{dx} \tanh x = 1 - \tanh^2 x`,
    }}
    />
  );
}
