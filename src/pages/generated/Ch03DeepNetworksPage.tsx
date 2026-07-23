import BishopSectionPage from '@/components/BishopSectionPage';
import DepthVsWidthLab from '@/components/demos/DepthVsWidthLab';
import { Brain } from 'lucide-react';

export default function Ch03DeepNetworksPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/deep-networks"
      heroIcon={<Brain className="w-9 h-9 text-blue-600" />}
      summary={
        "深度网络的核心优势在于层次化表示——浅层学习低级特征（边缘、纹理），深层组合为高级语义（物体部件、类别）。本节覆盖 §6.3.1–6.3.7：层次化与分布式表示、表示学习、迁移学习、对比学习、通用网络架构和张量运算。"
      }
      concepts={[
        {
          title: "层次化表示（Hierarchical representations）",
          description: "视觉皮层研究启发了这一思想：V1 区对简单边缘响应、V2 区组合边缘为形状、高层对完整物体响应。深度网络模拟了这一过程——浅层检测局部模式，深层组合为全局语义。这种从简单到复杂的层次构建是深度网络胜过浅层网络的关键。",
        },
        {
          title: "分布式表示（Distributed representations）",
          description: "每个概念由多个神经元的激活模式共同表示，而非单独一个神经元。这比 one-hot 的局部表示更高效——n 个二值神经元理论上可表示 2^n 个不同概念。分布式表示也使网络对噪声和部分破坏具有鲁棒性。",
        },
        {
          title: "表示学习（Representation learning）",
          description: "深度学习 = 表示学习。与手动设计特征不同，网络同时学习特征表示和分类器。好表示应满足：保留输入的关键信息、对任务相关变换不敏感、对无关变换对齐（invariant）。这就是端到端学习的威力。",
        },
        {
          title: "迁移学习（Transfer learning）",
          description: "在大规模数据集（如 ImageNet）上预训练的深层网络，其浅中层特征具有高度可迁移性。只需微调顶层或加入新输出层，即可适应不同任务。Bishop 教材在 §6.3.4 介绍了这一深度学习的杀手级应用。",
        },
        {
          title: "对比学习（Contrastive learning）",
          description: "自监督表示学习方法：拉近相似样本（正对）的表示、推远不相似样本（负对）的表示。SimCLR、MoCo 等方法无需标签即可学习高质量视觉表示，在少量有标签微调后超越监督基线。",
        },
        {
          title: "通用网络架构",
          description: "除标准前馈网络外，还有跳跃连接、残差块（ResNet）、密集连接（DenseNet）等架构创新。这些设计缓解了梯度消失并允许训练极深网络，是深度模型规模化的关键。",
        },
        {
          title: "张量（Tensors）",
          description: "张量是多维数组的推广，是深度学习数据的基本容器。卷积层涉及 4D 张量（批量×通道×高×宽），现代框架通过张量运算在 GPU 上高效实现前向与反向传播。",
        },
      ]}
      learningObjectives={[
        "解释层次化表示如何使深度网络比浅层网络更高效",
        "区分局部表示和分布式表示，说明后者的优势",
        "理解表示学习的核心目标：信息保留+不变性",
        "描述迁移学习的基本流程：预训练→微调",
        "了解对比学习的基本原理：正对拉近、负对推远",
      ]}
      coreIntuition={
        "One-hot 像一个只能亮一盏灯的灯泡——n 盏灯只能表示 n 个概念。分布式表示像所有灯的调光开关——通过亮暗组合，n 个灯泡可以表示 2^n 个概念。深度网络学习的就是找到最经济的'灯泡组合'来表示世界中的概念。"
      }
      commonMistakes={[
        "认为深度网络的中间层特征是'可解释的'——大部分中间表示对人类不可读，只是对下游任务有用",
        "迁移学习中选择冻结所有预训练参数——对于差异大的目标域，应适当解冻更多层",
        "在对比学习中使用过小的 batch size——负样本多样性对学习质量至关重要",
      ]}
      whyCards={[
        {
          question: "为什么深度比宽度更高效？",
          answer: "深度网络通过层次化组合特征，浅层学边缘、深层学部件。这种复用让深度网络用更少参数表达更复杂的函数。",
        },
        {
          question: "为什么迁移学习在小数据集上有效？",
          answer: "预训练网络已经学会了通用的视觉特征（边缘、纹理、形状），这些特征对大多数视觉任务都有用，只需微调顶层适应新任务。",
        },
      ]}
      counterexamples={[
        "把 ImageNet 预训练网络的底层全部冻结，用于医学图像分析，性能不如微调底层——说明预训练特征并非万能。",
        "对比学习中 batch size 设为 2，负样本太少导致表示坍塌——说明负样本多样性对学习质量至关重要。",
      ]}
            bishopMapping={{
        chapter: "Ch 6",
        section: "6.3",
        pages: "§6.3, pp. 186–194",
        textbookSubsections: [
          "6.3 Deep Networks",
          "6.3.1 Hierarchical representations",
          "6.3.2 Distributed representations",
          "6.3.3 Representation learning",
          "6.3.4 Transfer learning",
          "6.3.5 Contrastive learning",
          "6.3.6 General network architectures",
          "6.3.7 Tensors",
        ],
        formulas: ["representation learning", "contrastive loss"],
      }}
      demo={{
        title: "深度 vs 宽度：参数量对比",
        label: "网络深度 L",
        param: 2,
        min: 1,
        max: 10,
        step: 1,
        compute: (L) => {
          const width = 10;
          const deepParams = L * width * width;
          const wideParams = width * width * 10;
          return {
            label: `深度 ${L} 层参数量 vs 宽度 100 单层参数量`,
            value: deepParams,
            display: String.raw`L \times 100 = ${L} \times 100 = ${deepParams} \quad vs \quad 100 \times 100 = ${wideParams}`,
          };
        },
        formula: String.raw`\text{深度参数量} = L \times W^2, \quad \text{宽度参数量} = W^3`,
      }}
      interactiveDemo={<DepthVsWidthLab />}
    />
  );
}
