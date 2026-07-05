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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“误分类率”，下列说法是否正确？",
        options: ["选择后验概率最大的类别可最小化误分类率。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。选择后验概率最大的类别可最小化误分类率。",
      },
      {
        question: "关于“期望损失”，下列说法是否正确？",
        options: ["当不同错误代价不同时，需要按损失矩阵加权后验概率。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。当不同错误代价不同时，需要按损失矩阵加权后验概率。",
      },
      {
        question: "关于“拒绝选项”，下列说法是否正确？",
        options: ["当最大后验概率不足够高时，拒绝决策以避免高风险错误。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。当最大后验概率不足够高时，拒绝决策以避免高风险错误。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 5",
      section: "",
      pages: "",
    }}

    />
  );
}
