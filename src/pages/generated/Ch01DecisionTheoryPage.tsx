import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch01DecisionTheoryPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/decision-theory"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"决策理论研究如何在不确定性下做出最优选择；损失函数、期望损失与贝叶斯最优决策是核心工具。"}
      concepts={[
    {
      title: "损失函数",
      description: "量化决策与真实状态之间的差距，不同任务对应不同损失。",
    },
    {
      title: "期望损失",
      description: "对未知状态按后验概率加权，选择使期望损失最小的决策。",
      formula: String.raw`\mathbb{E}[L] = \sum_{k} L_{kj} \, p(\mathcal{C}_k \mid \mathbf{x})`,
    },
    {
      title: "贝叶斯最优决策",
      description: "最小化总体期望损失的决策规则，是分类与回归的理论基准。",
    }
      ]}
      learningObjectives={[
      "理解 损失函数 的含义与作用。",
      "理解 期望损失 的含义与作用。",
      "理解 贝叶斯最优决策 的含义与作用。"
    ]}
      coreIntuition={"决策理论研究如何在不确定性下做出最优选择；损失函数、期望损失与贝叶斯最优决策是核心工具。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“损失函数”，下列说法是否正确？",
        options: ["量化决策与真实状态之间的差距，不同任务对应不同损失。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。量化决策与真实状态之间的差距，不同任务对应不同损失。",
      },
      {
        question: "关于“期望损失”，下列说法是否正确？",
        options: ["对未知状态按后验概率加权，选择使期望损失最小的决策。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对未知状态按后验概率加权，选择使期望损失最小的决策。",
      },
      {
        question: "关于“贝叶斯最优决策”，下列说法是否正确？",
        options: ["最小化总体期望损失的决策规则，是分类与回归的理论基准。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。最小化总体期望损失的决策规则，是分类与回归的理论基准。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 4",
      section: "",
      pages: "",
    }}
          demo={{
      title: "不同损失的权衡",
      label: "假阳性损失 L_fp",
      param: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      compute: (lfp) => ({
        label: '最优决策阈值相对偏移',
        value: Math.log(lfp) / 2,
        display: String.raw`\\Delta=${(Math.log(lfp) / 2).toFixed(2)}`,
      }),
      formula: String.raw`\text{阈值偏移} \propto \ln L_{fp}`,
    }}
    />
  );
}
