import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch02DecisionTheoryPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/decision-theory"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"分类中的决策理论将推断与决策分开：先估计后验概率，再按损失函数选择使期望损失最小的类别；必要时引入拒绝选项以避免高风险决策。"}
      concepts={[
        {
          title: "Misclassification rate",
          description: "0-1 损失下的期望错误率；最小化误分类率等价于选择后验概率最大的类别。",
        },
        {
          title: "Expected loss",
          description: "当不同错误具有不同代价时，需要按损失矩阵对后验概率加权后选择决策。",
          formula: String.raw`\mathbb{E}[L] = \sum_k \sum_j L_{kj} \, p(\mathcal{C}_k \mid \mathbf{x}) \, \mathbb{I}(\text{decision}=j)`,
        },
        {
          title: "The reject option",
          description: "当最大后验概率不足够高时拒绝决策，避免在不确定区域做出高代价判断。",
        },
        {
          title: "Inference and decision",
          description: "生成模型先推断联合分布再决策；判别模型直接学习决策边界；决策理论为二者提供统一框架。",
        },
        {
          title: "Classifier accuracy",
          description: "正确分类样本所占比例，是最常用的 0-1 损失经验估计。",
        },
        {
          title: "ROC curve",
          description: "通过变化决策阈值绘制真正例率与假正例率的关系，用于评估分类器在不同代价下的表现。",
        },
      ]}
      learningObjectives={[
        "能写出分类问题中的期望损失表达式。",
        "理解 0-1 损失下贝叶斯最优决策是最大后验类别。",
        "能解释拒绝选项的用途与阈值选择。",
        "会绘制并解读 ROC 曲线。",
      ]}
      coreIntuition={"分类决策就像在雾中辨认路标：后验概率告诉你‘它有多像某个路标’，损失矩阵告诉你‘认错路标的代价’，最优决策把两者相乘后选最小。"}
      commonMistakes={[
        "假设所有错误代价相同，忽视损失矩阵对决策边界的影响。",
        "把高准确率等同于低风险；在类别不平衡或代价不对称时可能误导。",
        "拒绝选项阈值设置不当：过严导致大量漏判，过松则失去拒绝意义。",
      ]}
      quiz={[
        {
          question: "在 0-1 损失下，贝叶斯最优分类决策是什么？",
          options: [
            "选择后验概率最大的类别。",
            "选择先验概率最大的类别。",
            "随机选择一个类别。",
            "总是选择训练样本最多的类别。",
          ],
          correctIndex: 0,
          explanation: "0-1 损失下，每类错误代价相同，因此最小化期望损失等价于最大化后验概率。",
        },
        {
          question: "拒绝选项通常在什么情况下使用？",
          options: [
            "当最大后验概率低于阈值、模型不确定时。",
            "当训练准确率已经达到 100% 时。",
            "当类别完全平衡时。",
            "当损失矩阵所有元素相等时。",
          ],
          correctIndex: 0,
          explanation: "拒绝选项把困难样本交给人工或其他系统，以降低错误决策的期望代价。",
        },
        {
          question: "ROC 曲线的横轴和纵轴分别是什么？",
          options: [
            "假正例率、真正例率",
            "准确率、召回率",
            "精确率、召回率",
            "真正例率、假正例率",
          ],
          correctIndex: 0,
          explanation: "ROC 曲线以 FPR 为横轴、TPR 为纵轴，反映不同阈值下的灵敏度与特异性权衡。",
        },
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
        formulas: ["expected loss", "Bayes classifier", "ROC"],
        exercises: [
          "给定损失矩阵，手算最优决策。",
          "绘制不同阈值下的 ROC 曲线并计算 AUC。",
        ],
      }}
    />
  );
}
