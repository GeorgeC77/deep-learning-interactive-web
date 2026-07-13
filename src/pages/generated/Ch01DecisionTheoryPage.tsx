import BishopSectionPage from '@/components/BishopSectionPage';
import RegressionDecisionTheoryLab from '@/components/demos/RegressionDecisionTheoryLab';
import { Scale } from 'lucide-react';

export default function Ch01DecisionTheoryPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/decision-theory"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={
        "决策理论提供了一个概率框架，用于在不确定性下选择最优预测。它将对世界的推断（后验概率 p(t|x)）与决策（选择预测值 y）分开——先计算预测分布，再按损失函数选择使期望损失最小的 y。"
      }
      concepts={[
        {
          title: "损失函数（Loss function）",
          description: "L(t, y) 量化真实值 t 与预测 y 之间差距的代价。回归中常用平方损失 (t−y)²、绝对损失 |t−y|，也可以根据业务需要引入非对称损失或区间损失。不同损失函数对应不同的最优预测。",
          formula: String.raw`L(t, y)`,
        },
        {
          title: "期望损失（Expected loss）",
          description: "对 t 的不确定性取期望，即对后验分布 p(t|x) 加权所有可能的 t。这个框架使我们可以比较不同预测策略的长期平均表现。",
          formula: String.raw`\mathbb{E}[L] = \int L(t, y) \, p(t \mid \mathbf{x}) \, dt`,
        },
        {
          title: "贝叶斯最优决策",
          description: "选择使期望损失最小的预测值 y*(x)。最优解完全由损失函数与后验分布共同决定。",
          formula: String.raw`y^{*}(\mathbf{x}) = \arg\min_{y} \mathbb{E}[L(t, y) \mid \mathbf{x}]`,
        },
        {
          title: "平方损失的最优解：条件均值",
          description: "对 E[(t−y)²] 关于 y 求导并置零，得到 y* = E[t|x]，即后验均值。这表明最小二乘目标天然偏好均值。",
          formula: String.raw`\frac{\partial \mathbb{E}[(t-y)^2]}{\partial y} = 0 \;\Longrightarrow\; y = \mathbb{E}[t \mid \mathbf{x}]`,
        },
        {
          title: "绝对损失的最优解：条件中位数",
          description: "绝对损失的最小化器使后验分布两侧概率质量相等，即条件中位数。当分布偏斜时，中位数与均值通常不同。",
          formula: String.raw`y^{*} = \operatorname{median}(t \mid \mathbf{x})`,
        },
        {
          title: "推断与决策的分离",
          description: "Bishop 强调两个独立阶段：(1) 推断——估计后验 p(t|x)；(2) 决策——基于损失函数选择最优预测。分离使同一个后验可以配合不同损失反复使用。",
        },
      ]}
      learningObjectives={[
        "能写出回归问题中期望损失的积分表达式",
        "理解平方损失下贝叶斯最优预测是条件均值 E[t|x]",
        "理解绝对损失下最优预测是条件中位数",
        "能解释非对称损失或区间损失为何会导致不同于均值/中位数的预测",
        "掌握推断与决策分离的核心思想及其实际意义",
      ]}
      coreIntuition={
        "决策理论像一个气象预报系统：先根据数据推断明天降水量的概率分布（推断阶段），然后根据你的需求（出去玩 vs. 种庄稼）做决策。不同的损失函数就像不同的决策偏好——平方损失 penalize 大误差更严厉，绝对损失更稳健，非对称损失会让预测偏向代价更低的一侧。"
      }
      commonMistakes={[
        "默认使用平方损失而不考虑其假设（对称惩罚、对异常值敏感）",
        "混淆推断（估计概率）与决策（选择行动）两个不同阶段",
        "认为后验均值在所有损失函数下都是最优预测——对于 L1 损失，中位数才是最优",
        "在偏态分布或存在异常值时仍用均值作为唯一参考，忽视中位数与众数的差异",
      ]}
      quiz={[
        {
          question: "对于平方损失 L(t,y) = (t−y)²，贝叶斯最优预测是什么？",
          options: [
            "条件均值 E[t|x]",
            "条件中位数",
            "条件众数（mode）",
            "任意 t 的随机样本",
          ],
          correctIndex: 0,
          explanation: "最小化 E[(t−y)²| x] 对 y 求导得 −2E[t−y|x] = 0 ⇒ y = E[t|x]。",
        },
        {
          question: "对于绝对损失 L(t,y) = |t−y|，贝叶斯最优预测是？",
          options: [
            "条件中位数",
            "条件均值",
            "条件方差",
            "后验概率最大的 t",
          ],
          correctIndex: 0,
          explanation: "绝对损失的最小化器是中位数，因为导数为 −∫_{−∞}^y p(t|x)dt + ∫_y^∞ p(t|x)dt = 0 时两侧概率相等。",
        },
        {
          question: "当后验分布明显偏斜时，下列哪一项通常成立？",
          options: [
            "均值、中位数、众数三者可能互不相同，最优预测取决于具体损失函数",
            "三者永远相等",
            "绝对损失的最优预测总是众数",
            "平方损失会忽略异常值",
          ],
          correctIndex: 0,
          explanation: "偏态分布下三个中心指标通常分离；平方损失偏好均值，绝对损失偏好中位数，区间损失可能偏好众数附近。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 4",
        section: "4.2",
        pages: "§4.2, pp. 120–122",
        textbookSubsections: ["4.2 Decision theory"],
        formulas: [
          "expected loss",
          "Bayes optimal decision",
          "squared loss -> conditional mean",
          "absolute loss -> conditional median",
        ],
        exercises: [
          "推导平方损失下最优预测是条件均值",
          "推导绝对损失下最优预测是条件中位数",
          "举例说明为何推断与决策的分离在医疗诊断中有实用价值",
        ],
      }}
      interactiveDemo={<RegressionDecisionTheoryLab />}
    />
  );
}
