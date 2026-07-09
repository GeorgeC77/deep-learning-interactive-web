import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch02DecisionTheoryPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/decision-theory"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"分类中的决策理论将推断与决策分开：先估计后验概率，再根据损失函数选择最优类别。"}
      concepts={[
    {
      title: "误分类率",
      description: "选择后验概率最大的类别可最小化误分类率。",
    },
    {
      title: "期望损失",
      description: "当不同错误代价不同时，需要按损失矩阵加权后验概率。",
      formula: String.raw`\mathbb{E}[L] = \sum_k L_{kj} \, p(\mathcal{C}_k \mid \mathbf{x})`,
    },
    {
      title: "拒绝选项",
      description: "当最大后验概率不足够高时，拒绝决策以避免高风险错误。",
    }
      ]}
      learningObjectives={[
      "理解 误分类率 的含义与作用。",
      "理解 期望损失 的含义与作用。",
      "理解 拒绝选项 的含义与作用。"
    ]}
      coreIntuition={"分类中的决策理论将推断与决策分开：先估计后验概率，再根据损失函数选择最优类别。"}
      commonMistakes={[
      "混淆本节核心概念与相邻小节的前提假设，导致错误套用。",
      "只记忆公式形式，而不验证其成立条件与具体数值。"
    ]}
      quiz={[
      {
        question: "下列关于“误分类率”的叙述，哪一项最准确？",
        options: ["选择后验概率最大的类别可最小化误分类率。", "误分类率 只是术语，没有独立建模意义。", "误分类率 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。选择后验概率最大的类别可最小化误分类率。 这体现了本节的核心思想。",
      },
      {
        question: "在“期望损失”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。期望损失 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“拒绝选项”的结果违背直觉，应优先排查哪些前提假设？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。拒绝选项 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 5",
      section: "5.2",
      pages: "Ch 5",
      textbookSubsections: [
          "5.2 Decision Theory"
        ],
      formulas: ["期望损失公式"],
      exercises: ["推导本节核心公式的展开形式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "对比本节结论与先前章节结论的适用条件差异。"]
    }}

    />
  );
}
