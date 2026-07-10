import BishopSectionPage from '@/components/BishopSectionPage';
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
          title: "通用网络架构与张量",
          description: "除标准前馈网络外，还有跳跃连接、残差块（ResNet）、密集连接（DenseNet）等架构创新。张量（tensor）是多维数组的推广，卷积层涉及 4D 张量（批量×通道×高×宽），现代框架通过张量运算高效实现。",
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
      quiz={[
        {
          question: "表示学习与传统手工特征工程的核心区别是什么？",
          options: [
            "表示学习同时学习特征和分类器，无需人工设计特征",
            "表示学习一定比手工特征更准确",
            "表示学习只能用于图像数据",
            "表示学习不需要训练",
          ],
          correctIndex: 0,
          explanation: "端到端学习是深度学习的核心范式——网络从原始数据中自动发现有用的特征表示。",
        },
        {
          question: "迁移学习通常如何操作？",
          options: [
            "用大数据的预训练权重初始化网络，然后在目标数据上微调（finetune）部分或全部层",
            "从头在目标数据上训练一个更小的网络",
            "不训练直接在目标数据上预测",
            "使用相同的超参数在目标数据上训练",
          ],
          correctIndex: 0,
          explanation: "预训练+微调是迁移学习标准流程。大规模预训练提供了强泛化的底层特征，微调适配目标域。",
        },
        {
          question: "对比学习的训练目标是什么？",
          options: [
            "使正样本对的表示尽可能相似，负样本对的表示尽可能不相似",
            "最小化分类误差",
            "最大化输入的重建精度",
            "生成与训练数据相同分布的样本",
          ],
          correctIndex: 0,
          explanation: "对比学习通过对比损失（如 InfoNCE）构建自监督信号，无需标签即可学习有意义的表示。",
        },
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
    />
  );
}
