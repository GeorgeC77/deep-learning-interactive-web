import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowLeftRight } from 'lucide-react';

export default function Ch15OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/overview"
      heroIcon={<ArrowLeftRight className="w-9 h-9 text-blue-600" />}
      summary={"标准化流通过可逆神经网络将简单分布变换为复杂分布，同时保持精确的似然计算。"}
      concepts={[
    {
      title: "可逆变换",
      description: "每一层都是双射，使得采样与密度评估都能高效进行。",
    },
    {
      title: "变量替换公式",
      description: "对数密度随 Jacobian 行列式变化，保证归一化。",
      formula: String.raw`\ln p_x(x) = \ln p_z(z) - \ln \left| \det \frac{\partial f}{\partial z} \right|`,
    },
    {
      title: "流架构",
      description: "耦合流、自回归流与连续流在表达能力与计算成本之间各有取舍。",
    }
      ]}
      learningObjectives={[
      "理解 可逆变换 的含义与作用。",
      "理解 变量替换公式 的含义与作用。",
      "理解 流架构 的含义与作用。"
    ]}
      coreIntuition={"标准化流通过可逆神经网络将简单分布变换为复杂分布，同时保持精确的似然计算。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“可逆变换”，下列说法是否正确？",
        options: ["每一层都是双射，使得采样与密度评估都能高效进行。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。每一层都是双射，使得采样与密度评估都能高效进行。",
      },
      {
        question: "关于“变量替换公式”，下列说法是否正确？",
        options: ["对数密度随 Jacobian 行列式变化，保证归一化。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对数密度随 Jacobian 行列式变化，保证归一化。",
      },
      {
        question: "关于“流架构”，下列说法是否正确？",
        options: ["耦合流、自回归流与连续流在表达能力与计算成本之间各有取舍。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。耦合流、自回归流与连续流在表达能力与计算成本之间各有取舍。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 18",
      section: "",
      pages: "",
    }}

    />
  );
}
