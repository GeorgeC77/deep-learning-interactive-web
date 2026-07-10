import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch01DecisionTheoryPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/decision-theory"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={
        "决策理论提供了一个概率框架，用于在不确定性下选择最优行动。它将对世界的推断（后验概率 p(t|x,D)）与决策（选择预测值 y）分开——先计算预测分布，再按损失函数选择使期望损失最小的 y。"
      }
      concepts={[
        {
          title: "损失函数（Loss function）",
          description: "L(t, y(x)) 量化真实值 t 与预测 y(x) 之间差距的代价。回归中常用平方损失 L = (t − y)² 或绝对损失 L = |t − y|。不同损失函数对应不同的最优预测。",
          formula: String.raw`L(t, y(\mathbf{x}))`,
        },
        {
          title: "期望损失（Expected loss）",
          description: "对 t 的不确定性取期望——加权所有可能的 t 值，权重为后验概率。这个框架使我们可以比较不同预测策略的长期平均表现。",
          formula: String.raw`\mathbb{E}[L] = \int L(t, y(\mathbf{x})) \, p(t \mid \mathbf{x}) \, dt`,
        },
        {
          title: "贝叶斯最优决策",
          description: "选择使期望损失最小的预测值 y*(x)。对于平方损失，最优预测是条件均值 E[t|x]；对于绝对损失，最优预测是条件中位数。",
          formula: String.raw`y^{*}(\mathbf{x}) = \arg\min_{y} \mathbb{E}[L(t, y)]`,
        },
        {
          title: "平方损失的最优解",
          description: "将期望损失对 y 求导置零，得到 y* = E[t|x]，即后验均值。这表明最小二乘目标的最优预测是条件期望。",
          formula: String.raw`\frac{\partial \mathbb{E}[(t-y)^2]}{\partial y} = 0 \;\Longrightarrow\; y = \mathbb{E}[t \mid \mathbf{x}]`,
        },
        {
          title: "推断与决策的分离",
          description: "Bishop 强调两个独立阶段：(1) 推断——用数据估计后验 p(t|x,D)；(2) 决策——基于损失函数和推断结果选择最优行动。分离使模型可与不同损失函数配合使用。",
        },
      ]}
      learningObjectives={[
        "能写出回归问题中期望损失的积分表达式",
        "理解平方损失下贝叶斯最优预测是条件均值 E[t|x]",
        "理解绝对损失下最优预测是条件中位数",
        "掌握推断与决策分离的核心思想及其实际意义",
        "能解释为什么不同损失函数会导致不同的最优预测",
      ]}
      coreIntuition={
        "决策理论像一个气象预报系统：先根据数据推断明天降水量的概率分布（推断阶段），然后根据你的需求（出去玩 vs. 种庄稼）做决策。如果下雨损失大，你会更保守地做决定——这就是损失函数的作用。"
      }
      commonMistakes={[
        "默认使用平方损失而不考虑其假设（对称惩罚、对异常值敏感）",
        "混淆推断（估计概率）与决策（选择行动）两个不同阶段",
        "认为后验均值在所有场景中都是最优预测——如果损失是 L1（绝对损失），中位数才是最优",
        "在估计 y 时不传递预测不确定性——真正的贝叶斯决策保留完整分布 p(t|x)",
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
          explanation: "绝对损失的最小化器是中位数，因为导数为 −∫_{-∞}^y p(t|x)dt + ∫_y^∞ p(t|x)dt = 0 时两侧概率相等。",
        },
        {
          question: "将推断与决策分开的主要优势是什么？",
          options: [
            "同一个模型（后验分布）可配合不同损失函数反复使用，无需重新训练",
            "提高训练速度",
            "简化模型结构",
            "减小正则化参数",
          ],
          correctIndex: 0,
          explanation: "模型只需估计一次后验分布（推断），然后可根据不同业务需求换用不同损失函数。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 4",
        section: "4.2",
        pages: "§4.2, pp. 120–122",
        textbookSubsections: ["4.2 Decision theory"],
        formulas: ["expected loss", "Bayes optimal decision", "conditional distribution"],
        exercises: [
          "推导平方损失下最优预测是条件均值",
          "推导绝对损失下最优预测是条件中位数",
          "举例说明为何推断与决策的分离在医疗诊断中有实用价值",
        ],
      }}
      demo={{
        title: "不同损失函数的决策权衡",
        label: "损失不对称性",
        param: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        compute: (lfp) => ({
          label: '最优决策偏移量',
          value: Math.log(lfp) / 2,
          display: String.raw`\Delta=` + (Math.log(lfp) / 2).toFixed(2),
        }),
        formula: String.raw`\text{偏移} \propto \ln(\text{假阳性损失}/\text{假阴性损失})`,
      }}
    />
  );
}
