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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“生成模型”，下列说法是否正确？",
        options: ["先验 p(z) 与条件分布 p(x|z) 共同决定观测数据的边缘分布。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。先验 p(z) 与条件分布 p(x|z) 共同决定观测数据的边缘分布。",
      },
      {
        question: "关于“因子分析”，下列说法是否正确？",
        options: ["线性高斯隐变量模型，用因子载荷矩阵刻画观测之间的相关性。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。线性高斯隐变量模型，用因子载荷矩阵刻画观测之间的相关性。",
      },
      {
        question: "关于“独立成分分析”，下列说法是否正确？",
        options: ["寻找统计独立的隐变量源，常用于盲源分离。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。寻找统计独立的隐变量源，常用于盲源分离。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 16",
      section: "",
      pages: "",
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
