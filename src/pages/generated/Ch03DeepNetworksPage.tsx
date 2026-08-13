import BishopSectionPage from '@/components/BishopSectionPage';
import DepthVsWidthLab from '@/components/demos/DepthVsWidthLab';
import { Brain } from 'lucide-react';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter03DeepExercises } from '@/course/chapter03Exercises';

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
          description: "层次化表示通过逐层组合可复用的中间特征来表达复杂函数。视觉网络中常能观察到从局部模式到更大感受野的结构，但具体语义并非每层都天然可读。对具有组合结构的任务，深度可能比一次性展开所有组合更紧凑。",
        },
        {
          title: "分布式表示（Distributed representations）",
          description: "每个概念可由多个表示单元的联合激活模式编码，而同一单元也可参与多个概念。n 个二值单元有 2^n 种可能模式，但模型实际可稳定利用多少模式受训练数据、约束和解码方式限制；鲁棒性也不是仅由‘分布式’三个字自动保证的。",
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
          description: "自监督表示学习的一类方法：提高相关视图在表示空间中的一致性，并通过负样本、预测目标或去冗余约束避免无信息解。不同方法不一定显式使用负样本，效果也取决于数据增强和下游任务。",
          formula: String.raw`\mathcal L_i=-\log\frac{\exp(\operatorname{sim}(z_i,z_i^+)/\tau)}{\sum_j\exp(\operatorname{sim}(z_i,z_j)/\tau)}`,
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
        "One-hot 像一次只能亮一盏灯；分布式表示则用多盏灯的联合模式编码属性与概念。n 个二值单元在组合上允许 2^n 种模式，但网络能否可靠利用这些模式，要由数据、目标和容量共同决定。深度进一步让中间模式可以逐层复用和组合。"
      }
      commonMistakes={[
        "认为深度网络的中间层特征是'可解释的'——大部分中间表示对人类不可读，只是对下游任务有用",
        "迁移学习中选择冻结所有预训练参数——对于差异大的目标域，应适当解冻更多层",
        "把所有对比学习都等同于‘大 batch + 大量负样本’——部分方法使用队列、无负样本目标或去冗余约束，关键是避免坍塌并定义有意义的不变性",
      ]}
      whyCards={[
        {
          question: "为什么深度在组合结构任务中可能比宽度更高效？",
          answer: "深层网络可以复用前层计算出的中间函数。对某些递归或组合函数，这能以随深度增长的紧凑参数产生指数增多的线性区域；这不是所有数据集上都成立的普遍性能保证。",
        },
        {
          question: "为什么迁移学习在小数据集上有效？",
          answer: "预训练可能提供可复用的统计结构并降低从零学习的样本需求。可迁移程度取决于源域与目标域差异，因此需要用目标域验证冻结范围和微调策略。",
        },
      ]}
      counterexamples={[
        "把 ImageNet 预训练网络的底层全部冻结，用于医学图像分析，性能不如微调底层——说明预训练特征并非万能。",
        "把随机裁剪设得过强，以致正对丢失共同语义，表示质量反而下降——说明数据增强定义了模型被要求学习的不变性。",
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
        formulas: ["hierarchical composition", "InfoNCE contrastive objective"],
      }}
      interactiveDemo={<DepthVsWidthLab />}
      extraContent={
        <ExercisePanel exerciseSetId="chapter03-deep" exercises={chapter03DeepExercises} />
      }
    />
  );
}
