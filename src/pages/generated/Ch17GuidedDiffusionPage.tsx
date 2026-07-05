import BishopSectionPage from '@/components/BishopSectionPage';
import { Crosshair } from 'lucide-react';

export default function Ch17GuidedDiffusionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch17/guided-diffusion"
      heroIcon={<Crosshair className="w-9 h-9 text-blue-600" />}
      summary={"引导扩散在采样时引入类别、文本或其他条件信号，使生成结果向目标语义移动。"}
      concepts={[
    {
      title: "分类器引导",
      description: "利用预训练分类器的梯度调整分数，增强条件对齐但可能牺牲多样性。",
    },
    {
      title: "无分类器引导",
      description: "在训练时随机丢弃条件，采样时用条件与无条件预测的差值控制引导强度。",
      formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
    },
    {
      title: "引导强度权衡",
      description: "权重 w 越大，样本与条件越对齐，但多样性越低。",
    }
      ]}
      learningObjectives={[
      "理解 分类器引导 的含义与作用。",
      "理解 无分类器引导 的含义与作用。",
      "理解 引导强度权衡 的含义与作用。"
    ]}
      coreIntuition={"引导扩散在采样时引入类别、文本或其他条件信号，使生成结果向目标语义移动。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“分类器引导”，下列说法是否正确？",
        options: ["利用预训练分类器的梯度调整分数，增强条件对齐但可能牺牲多样性。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。利用预训练分类器的梯度调整分数，增强条件对齐但可能牺牲多样性。",
      },
      {
        question: "关于“无分类器引导”，下列说法是否正确？",
        options: ["在训练时随机丢弃条件，采样时用条件与无条件预测的差值控制引导强度。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。在训练时随机丢弃条件，采样时用条件与无条件预测的差值控制引导强度。",
      },
      {
        question: "关于“引导强度权衡”，下列说法是否正确？",
        options: ["权重 w 越大，样本与条件越对齐，但多样性越低。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。权重 w 越大，样本与条件越对齐，但多样性越低。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 20",
      section: "",
      pages: "",
    }}
          demo={{
      title: "无分类器引导强度",
      label: "引导权重 w",
      param: 1,
      min: 0,
      max: 5,
      step: 0.1,
      compute: (w) => ({
        label: '条件偏移倍数',
        value: w,
        display: String.raw`\\hat{\\epsilon}=\\epsilon_{\\text{unc}}+${w.toFixed(1)}(\\epsilon_{\\text{cond}}-\\epsilon_{\\text{unc}})`,
      }),
      formula: String.raw`\hat{\epsilon} = \epsilon_{\text{unc}} + w \, (\epsilon_{\text{cond}} - \epsilon_{\text{unc}})`,
    }}
    />
  );
}
