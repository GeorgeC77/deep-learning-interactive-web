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
    },
      
    {
      title: "Misclassification rate",
      description: "介绍 Misclassification rate 的定义、关键公式与典型应用场景。",
    },
    {
      title: "Expected loss",
      description: "介绍 Expected loss 的定义、关键公式与典型应用场景。",
    },
    {
      title: "The reject option",
      description: "介绍 The reject option 的定义、关键公式与典型应用场景。",
    },
  ]}
      learningObjectives={[
      "理解 误分类率 的含义与作用。",
      "理解 期望损失 的含义与作用。",
      "理解 拒绝选项 的含义与作用。"
    ]}
      coreIntuition={"分类中的决策理论将推断与决策分开：先估计后验概率，再根据损失函数选择最优类别。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“误分类率”的叙述，哪一项最准确？",
        options: ["选择后验概率最大的类别可最小化误分类率。", "误分类率 只是术语，没有独立建模意义。", "误分类率 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。选择后验概率最大的类别可最小化误分类率。 这体现了本节的核心思想。",
      },
      {
        question: "在“期望损失”的公式中，若省略其中某一项，会对结果产生什么影响？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。期望损失 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“拒绝选项”的结果与预期不符，应优先排查哪些前提？",
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
          "5.2 Decision Theory",
          "5.2.1 Misclassification rate",
          "5.2.2 Expected loss",
          "5.2.3 The reject option",
          "5.2.4 Inference and decision",
          "5.2.5 Classifier accuracy",
          "5.2.6 ROC curve"
        ],
      formulas: ["期望损失公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
