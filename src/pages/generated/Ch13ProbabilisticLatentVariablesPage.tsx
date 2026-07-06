import BishopSectionPage from '@/components/BishopSectionPage';
import { GitBranch } from 'lucide-react';

export default function Ch13ProbabilisticLatentVariablesPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/probabilistic-latent-variables"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={"概率隐变量模型显式定义隐变量先验与条件似然；最大似然与 EM 算法是推断与学习的核心工具。"}
      concepts={[
    {
      title: "生成模型",
      description: "先验 p(z) 与条件分布 p(x|z) 共同决定观测数据的边缘分布。",
      formula: String.raw`p(x) = \int p(x \mid z) \, p(z) \, dz`,
    },
    {
      title: "因子分析",
      description: "线性高斯隐变量模型，用因子载荷矩阵刻画观测之间的相关性。",
    },
    {
      title: "独立成分分析",
      description: "寻找统计独立的隐变量源，常用于盲源分离。",
    }
      ]}
      learningObjectives={[
      "理解 生成模型 的含义与作用。",
      "理解 因子分析 的含义与作用。",
      "理解 独立成分分析 的含义与作用。"
    ]}
      coreIntuition={"概率隐变量模型显式定义隐变量先验与条件似然；最大似然与 EM 算法是推断与学习的核心工具。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“生成模型”的叙述，哪一项最准确？",
        options: ["先验 p(z) 与条件分布 p(x|z) 共同决定观测数据的边缘分布。", "生成模型 与本节讨论的问题完全无关。", "生成模型 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。先验 p(z) 与条件分布 p(x|z) 共同决定观测数据的边缘分布。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“因子分析”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。因子分析 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“独立成分分析”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。独立成分分析 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 16",
      section: "16.2",
      pages: "Ch 16",
      textbookSubsections: ["16.2.1 生成模型", "16.2.2 因子分析", "16.2.3 独立成分分析"],
      formulas: ["生成模型公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "隐变量先验对边缘方差的贡献",
      label: "隐变量方差 σ_z²",
      param: 1,
      min: 0.1,
      max: 4,
      step: 0.1,
      compute: (sz2) => ({
        label: '观测方差（单位载荷）',
        value: sz2 + 0.2,
        display: String.raw`\sigma_x^2=${(sz2 + 0.2).toFixed(2)}`,
      }),
      formula: String.raw`\sigma_x^2 = W^2 \sigma_z^2 + \sigma_\epsilon^2`,
    }}
    />
  );
}
