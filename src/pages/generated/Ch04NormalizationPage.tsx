import BishopSectionPage from '@/components/BishopSectionPage';
import NormalizationLab from '@/components/demos/NormalizationLab';
import { Scale } from 'lucide-react';

export default function Ch04NormalizationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/normalization"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"归一化在许多实践中可以帮助稳定训练、允许使用更大学习率，但其效果依赖网络结构、批量大小与任务。BatchNorm 在推理时使用移动统计量，小批量时估计可能不准；LayerNorm 的稳定性也依赖特征维度假设。"}
      concepts={[
        {
          title: "数据归一化",
          description: "将输入特征缩放为零均值、单位方差，使各维度对损失的贡献均衡。常用于预处理，但不改变特征间的相关性。",
          formula: "\\hat{x} = \\frac{x - \\mu}{\\sigma}",
        },
        {
          title: "批归一化",
          description: "对每个 mini-batch 的激活按特征维度做归一化，并通过可学习的缩放平移恢复表达能力。推理时通常使用训练阶段累积的移动统计量。",
          formula: "\\hat{x}_{n,c} = \\frac{x_{n,c} - \\mu_B}{\\sigma_B + \\epsilon}, \\quad y_{n,c} = \\gamma_c \\hat{x}_{n,c} + \\beta_c",
        },
        {
          title: "层归一化",
          description: "沿特征维度对每个样本单独归一化，不依赖 batch 大小，广泛用于 RNN 与 Transformer。",
          formula: "\\hat{x}_{n,d} = \\frac{x_{n,d} - \\mu_n}{\\sigma_n + \\epsilon}, \\quad y_{n,d} = \\gamma_d \\hat{x}_{n,d} + \\beta_d",
        },
      ]}
      learningObjectives={[
        "理解数据归一化、BatchNorm 与 LayerNorm 的计算方式。",
        "能区分 BatchNorm（跨 batch 的特征维度）与 LayerNorm（跨特征维度的单样本）。",
        "认识归一化的效果依赖任务与超参数，并非无条件保证更快收敛。",
      ]}
      coreIntuition={"归一化通过重新调整数值尺度来稳定前向激活分布，但它不是万能药：BatchNorm 受批量统计量质量影响，LayerNorm 受特征维度假设限制，且不同网络结构受益程度不同。"}
      commonMistakes={[
        "把归一化当成无条件提升性能的工具，忽略批量大小、网络深度与任务的影响。",
        "混淆 BatchNorm 与 LayerNorm 的归一化维度。",
        "在推理时使用 batch 统计量而不是训练好的移动统计量。",
        "认为归一化后就不需要仔细初始化或学习率调参。",
      ]}
      whyCards={[
        {
          question: "为什么 BatchNorm 在推理时要用移动统计量？",
          answer: "推理时通常没有 batch 数据，只能用训练阶段累积的均值和方差。用 batch 统计量会导致结果不一致。",
        },
        {
          question: "为什么 LayerNorm 适合 Transformer？",
          answer: "LayerNorm 沿特征维度对每个样本单独归一化，不依赖 batch 大小，适合变长序列和注意力机制。",
        },
      ]}
      counterexamples={[
        "在 batch size 为 2 时使用 BatchNorm，统计量估计极不稳定，性能可能反而下降——说明归一化并非无条件有效。",
        "在推理时使用 batch 统计量而不是移动统计量，同一输入在不同 batch 下输出不同——说明移动统计量是推理稳定性的关键。",
      ]}
            bishopMapping={{
        chapter: "Ch 7",
        section: "7.4",
        pages: "Ch 7",
        textbookSubsections: [
          "7.4 Normalization",
          "7.4.1 Data normalization",
          "7.4.2 Batch normalization",
          "7.4.3 Layer normalization",
        ],
        formulas: [
          "\\hat{x} = (x - \\mu)/\\sigma",
          "BatchNorm",
          "LayerNorm",
        ],
        exercises: [
          "给定一个 mini-batch，手工计算 BatchNorm 输出。",
          "比较 BatchNorm 与 LayerNorm 的归一化维度差异。",
          "讨论小批量对 BatchNorm 统计量估计的影响。",
        ],
      }}
      interactiveDemo={<NormalizationLab />}
    />
  );
}
