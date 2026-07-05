import BishopSectionPage from '@/components/BishopSectionPage';
import { Scale } from 'lucide-react';

export default function Ch04NormalizationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/normalization"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"归一化稳定输入分布与内部激活，使网络可以使用更大学习率、更快收敛，并降低对初始化的敏感度。"}
      concepts={[
    {
      title: "数据归一化",
      description: "将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。",
      formula: String.raw`\hat{x} = \frac{x - \mu}{\sigma}`,
    },
    {
      title: "批归一化",
      description: "对每个 mini-batch 的激活做归一化，并通过可学习的缩放平移恢复表达能力。",
    },
    {
      title: "层归一化",
      description: "沿特征维度归一化，不依赖 batch 大小，广泛用于 RNN 与 Transformer。",
    }
      ]}
      learningObjectives={[
      "理解 数据归一化 的含义与作用。",
      "理解 批归一化 的含义与作用。",
      "理解 层归一化 的含义与作用。"
    ]}
      coreIntuition={"归一化稳定输入分布与内部激活，使网络可以使用更大学习率、更快收敛，并降低对初始化的敏感度。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“数据归一化”，下列说法是否正确？",
        options: ["将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。",
      },
      {
        question: "关于“批归一化”，下列说法是否正确？",
        options: ["对每个 mini-batch 的激活做归一化，并通过可学习的缩放平移恢复表达能力。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对每个 mini-batch 的激活做归一化，并通过可学习的缩放平移恢复表达能力。",
      },
      {
        question: "关于“层归一化”，下列说法是否正确？",
        options: ["沿特征维度归一化，不依赖 batch 大小，广泛用于 RNN 与 Transformer。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。沿特征维度归一化，不依赖 batch 大小，广泛用于 RNN 与 Transformer。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "",
      pages: "",
    }}
          demo={{
      title: "标准化后的取值",
      label: "原始标准差 σ",
      param: 2,
      min: 0.2,
      max: 5,
      step: 0.1,
      compute: (sigma) => ({
        label: 'x=3 标准化后',
        value: 3 / sigma,
        display: String.raw`\hat{x}=\frac{3}{${sigma.toFixed(1)}}=${(3 / sigma).toFixed(2)}`,
      }),
      formula: String.raw`\hat{x} = \frac{x - \mu}{\sigma}`,
    }}
    />
  );
}
