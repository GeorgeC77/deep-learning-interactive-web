import BishopSectionPage from '@/components/BishopSectionPage';
import { GitCommitHorizontal } from 'lucide-react';

export default function Ch15CouplingFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/coupling-flows"
      heroIcon={<GitCommitHorizontal className="w-9 h-9 text-blue-600" />}
      summary={"耦合流将输入分成两部分，用其中一部分作为条件对另一部分做可逆变换，使 Jacobian 行列式易于计算。"}
      concepts={[
    {
      title: "仿射耦合层",
      description: "一部分变量保持不变，另一部分做缩放与平移，缩放平移参数由不变部分经神经网络产生。",
      formula: String.raw`x_{1:d} = z_{1:d}, \quad x_{d+1:D} = z_{d+1:D} \odot \exp(s) + t`,
    },
    {
      title: "RealNVP",
      description: "堆叠多个耦合层并交替划分维度，实现全变量的非线性变换。",
    },
    {
      title: "行列式计算",
      description: "耦合变换的 Jacobian 是三角矩阵，行列式等于缩放因子的乘积。",
    }
      ]}
      learningObjectives={[
      "理解 仿射耦合层 的含义与作用。",
      "理解 RealNVP 的含义与作用。",
      "理解 行列式计算 的含义与作用。"
    ]}
      coreIntuition={"耦合流将输入分成两部分，用其中一部分作为条件对另一部分做可逆变换，使 Jacobian 行列式易于计算。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“仿射耦合层”，下列说法是否正确？",
        options: ["一部分变量保持不变，另一部分做缩放与平移，缩放平移参数由不变部分经神经网络产生。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。一部分变量保持不变，另一部分做缩放与平移，缩放平移参数由不变部分经神经网络产生。",
      },
      {
        question: "关于“RealNVP”，下列说法是否正确？",
        options: ["堆叠多个耦合层并交替划分维度，实现全变量的非线性变换。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。堆叠多个耦合层并交替划分维度，实现全变量的非线性变换。",
      },
      {
        question: "关于“行列式计算”，下列说法是否正确？",
        options: ["耦合变换的 Jacobian 是三角矩阵，行列式等于缩放因子的乘积。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。耦合变换的 Jacobian 是三角矩阵，行列式等于缩放因子的乘积。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 18",
      section: "",
      pages: "",
    }}
          demo={{
      title: "耦合层缩放对对数密度的影响",
      label: "缩放因子 s",
      param: 0,
      min: -2,
      max: 2,
      step: 0.1,
      compute: (s) => ({
        label: 'log-det-Jacobian',
        value: s,
        display: String.raw`\\ln|J|=${s.toFixed(1)}`,
      }),
      formula: String.raw`\ln |\det J| = \sum_i s_i`,
    }}
    />
  );
}
