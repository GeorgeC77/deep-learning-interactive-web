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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“损失函数”的叙述，哪一项最准确？",
        options: ["量化决策与真实状态之间的差距，不同任务对应不同损失。", "损失函数 只是术语，没有独立建模意义。", "损失函数 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。量化决策与真实状态之间的差距，不同任务对应不同损失。 这体现了本节的核心思想。",
      },
      {
        question: "在“期望损失”的公式中，若省略其中某一项，会对结果产生什么影响？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。期望损失 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“贝叶斯最优决策”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。贝叶斯最优决策 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 4",
      section: "4.2",
      pages: "Ch 4",
      textbookSubsections: [
          "4.2 Decision theory"
        ],
      formulas: ["期望损失公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
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
