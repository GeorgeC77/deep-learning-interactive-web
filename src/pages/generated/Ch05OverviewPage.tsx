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
