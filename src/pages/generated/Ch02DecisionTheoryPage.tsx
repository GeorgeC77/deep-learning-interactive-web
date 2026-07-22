import BishopSectionPage from '@/components/BishopSectionPage';
import ClassificationCostLab from '@/components/demos/ClassificationCostLab';
import ROCInteractiveDemo from '@/components/demos/ROCInteractiveDemo';
import { Scale } from 'lucide-react';

export default function Ch02DecisionTheoryPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/decision-theory"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={
        "分类中的决策理论比回归更丰富——错误类型不再是连续值，而是 K×K 损失矩阵的离散结构。本节覆盖误分类率、期望损失最小化、代价敏感阈值、拒绝选项、推断与决策的分离，以及 ROC 曲线等实用评估工具（§5.2.1–5.2.6）。"
      }
      concepts={[
        {
          title: "误分类率（Misclassification rate）",
          description: "0-1 损失 L(k,j) = 1 − δ_{kj}（正确得 0，错误得 1）。在 0-1 损失下，最小化期望损失等价于选择后验概率最大的类别——简单直观但忽视了不同错误的代价差异。",
        },
        {
          title: "期望损失（Expected loss）",
          description: "引入 K×K 损失矩阵 L，L_{kj} 表示将真实类别 k 判为 j 的代价。对每个候选决策 j，计算 Σ_k L_{kj}·p(C_k|x)，选择最小期望代价对应的 j。这比 0-1 损失更通用。",
          formula: String.raw`\mathbb{E}[L]_j = \sum_{k=1}^{K} L_{kj} \, p(\mathcal{C}_k \mid \mathbf{x})`,
        },
        {
          title: "代价敏感阈值",
          description: "二分类中，设 p = P(C₁|x)。将样本判为正类的条件是其期望风险更低：c_FP·(1−p) < c_FN·p，即 p > c_FP/(c_FP+c_FN)。用 log-odds 表示即为 log(p/(1−p)) > log(c_FP/c_FN)。",
          formula: String.raw`p > \frac{C_{FP}}{C_{FP}+C_{FN}} \quad \Longleftrightarrow \quad \ln\frac{p}{1-p} > \ln\frac{C_{FP}}{C_{FN}}`,
        },
        {
          title: "拒绝选项（Reject option）",
          description: "当最大后验概率低于阈值 θ 时拒绝对该样本做决策。在医疗诊断等高风险场景中，拒绝困难病例交给专家可显著降低期望损失。阈值 θ 控制拒绝比例。",
        },
        {
          title: "推断与决策分离（Inference vs decision）",
          description: "Bishop 强调分类中的三个功能独立阶段：(1) 推断——估计后验 p(C_k|x)；(2) 决策——基于损失选择类别；(3) 判别——直接学决策边界跳过推断。三者的数学目标和适用场景各不相同。",
        },
        {
          title: "分类器准确率与ROC曲线",
          description: "准确率（accuracy）是 0-1 损失的正确率经验估计，对类别不平衡可能误导。ROC 曲线以假正例率（FPR）为横轴、真正例率（TPR=召回率）为纵轴，AUC 衡量分类器在所有阈值下的平均表现。",
        },
      ]}
      learningObjectives={[
        "能写出分类问题的期望损失表达式并解释损失矩阵的含义",
        "在给定后验概率和损失矩阵时，能计算最优决策与代价敏感阈值",
        "理解 0-1 损失下贝叶斯最优分类就是最大后验类别",
        "解释拒绝选项如何降低高风险应用中的错误代价",
        "绘制并解读 ROC 曲线，理解 AUC 与分类器排序能力的关系",
      ]}
      coreIntuition={
        "医疗诊断最能体现决策理论的精髓：先根据检查结果推断疾病概率（后验），再权衡误诊和漏诊的成本（损失矩阵），最后决定是把病人转诊还是继续观察。代价敏感阈值告诉你：当疾病后验高于误诊漏诊的相对代价时，才应给出阳性判断。"
      }
      commonMistakes={[
        "默认使用 accuracy 作为评估指标，在类别不平衡时（如 99:1）准确率 99% 可能毫无意义",
        "假设所有错误代价相同（0-1 损失），忽视实际业务中漏诊和误诊代价的天壤之别",
        "混淆分类准确率与 ROC-AUC：前者依赖阈值选择，后者评估所有阈值的综合排序能力",
        "在多分类中直接逐类计算 ROC——ROC 本质是二分类工具，多分类需用 micro/macro 平均或一对一",
        "使用 0.5 作为决策阈值时忽略损失矩阵——最优阈值应由 c_FP/(c_FP+c_FN) 决定",
      ]}
            bishopMapping={{
        chapter: "Ch 5",
        section: "5.2",
        pages: "§5.2, pp. 138–149",
        textbookSubsections: [
          "5.2 Decision Theory",
          "5.2.1 Misclassification rate",
          "5.2.2 Expected loss",
          "5.2.3 The reject option",
          "5.2.4 Inference and decision",
          "5.2.5 Classifier accuracy",
          "5.2.6 ROC curve",
        ],
        formulas: [
          "expected loss ΣL_{kj}p(C_k|x)",
          "cost-sensitive threshold p* = C_FP/(C_FP+C_FN)",
          "ROC: TPR vs FPR",
        ],
        exercises: [
          "给定损失矩阵和两个后验概率向量，分别计算期望损失并选最优决策",
          "推导 0-1 损失下最优决策与最大后验的等价性",
          "画出不同分类器在同数据上的 ROC 曲线并比较 AUC",
        ],
      }}
      interactiveDemo={<ClassificationCostLab />}
      extraContent={<ROCInteractiveDemo />}
    />
  );
}
