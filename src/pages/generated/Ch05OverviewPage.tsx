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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“计算图”，下列说法是否正确？",
        options: ["将前向计算分解为基本操作的节点，便于自动应用求导规则。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将前向计算分解为基本操作的节点，便于自动应用求导规则。",
      },
      {
        question: "关于“链式法则”，下列说法是否正确？",
        options: ["通过上游梯度与局部 Jacobian 相乘，逐层向后传递误差信号。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过上游梯度与局部 Jacobian 相乘，逐层向后传递误差信号。",
      },
      {
        question: "关于“前向与反向模式”，下列说法是否正确？",
        options: ["反向模式以一次前向、一次反向即可得到所有输入梯度，适合参数众多的神经网络。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。反向模式以一次前向、一次反向即可得到所有输入梯度，适合参数众多的神经网络。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 8",
      section: "",
      pages: "",
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
