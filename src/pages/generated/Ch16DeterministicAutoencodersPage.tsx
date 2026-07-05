import BishopSectionPage from '@/components/BishopSectionPage';
import { Box } from 'lucide-react';

export default function Ch16DeterministicAutoencodersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch16/deterministic-autoencoders"
      heroIcon={<Box className="w-9 h-9 text-blue-600" />}
      summary={"确定性自编码器直接学习点到点的映射；通过欠完备、稀疏、去噪等约束获得有意义的隐表示。"}
      concepts={[
    {
      title: "线性自编码器",
      description: "单隐层线性自编码器等价于主成分分析，学习数据的主子空间。",
    },
    {
      title: "稀疏自编码器",
      description: "在隐单元上施加稀疏惩罚，使每个输入仅激活少量特征。",
    },
    {
      title: "去噪自编码器",
      description: "从损坏输入重构干净输入，学习对输入扰动鲁棒的特征。",
    }
      ]}
      learningObjectives={[
      "理解 线性自编码器 的含义与作用。",
      "理解 稀疏自编码器 的含义与作用。",
      "理解 去噪自编码器 的含义与作用。"
    ]}
      coreIntuition={"确定性自编码器直接学习点到点的映射；通过欠完备、稀疏、去噪等约束获得有意义的隐表示。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“线性自编码器”，下列说法是否正确？",
        options: ["单隐层线性自编码器等价于主成分分析，学习数据的主子空间。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。单隐层线性自编码器等价于主成分分析，学习数据的主子空间。",
      },
      {
        question: "关于“稀疏自编码器”，下列说法是否正确？",
        options: ["在隐单元上施加稀疏惩罚，使每个输入仅激活少量特征。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。在隐单元上施加稀疏惩罚，使每个输入仅激活少量特征。",
      },
      {
        question: "关于“去噪自编码器”，下列说法是否正确？",
        options: ["从损坏输入重构干净输入，学习对输入扰动鲁棒的特征。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。从损坏输入重构干净输入，学习对输入扰动鲁棒的特征。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 19",
      section: "",
      pages: "",
    }}
          demo={{
      title: "去噪重构误差",
      label: "噪声标准差 σ",
      param: 0.2,
      min: 0,
      max: 1,
      step: 0.05,
      compute: (sigma) => ({
        label: '期望噪声能量',
        value: sigma * sigma,
        display: String.raw`\\mathbb{E}[\\epsilon^2]=${(sigma * sigma).toFixed(3)}`,
      }),
      formula: String.raw`\mathbb{E}[\|\epsilon\|^2] = \sigma^2`,
    }}
    />
  );
}
