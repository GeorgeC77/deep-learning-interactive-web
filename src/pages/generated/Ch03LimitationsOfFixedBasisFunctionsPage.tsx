import BishopSectionPage from '@/components/BishopSectionPage';
import { AlertTriangle } from 'lucide-react';

export default function Ch03LimitationsOfFixedBasisFunctionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch03/limitations-of-fixed-basis-functions"
      heroIcon={<AlertTriangle className="w-9 h-9 text-blue-600" />}
      summary={
        "前两章使用人工选择的固定基函数（多项式、高斯等），但 Bishop §6.1 揭示了其致命缺陷。维度灾难使基函数数量随维度指数增长，高维空间有大量反直觉的几何性质，而数据流形假设和可学习基函数为深度学习提供了出路。"
      }
      concepts={[
        {
          title: "维度灾难（Curse of dimensionality）",
          description: "基函数数量的增长随维度呈指数级。若每个维度 K 个基函数，D 维需 K^D 个基函数——随着 D 增加，数据迅速变稀疏，所需样本量爆炸增长。这是固定基函数在高维空间必然失败的根本原因。",
        },
        {
          title: "高维空间的反直觉性质",
          description: "在 D 维空间中：(1) 单位球的大多数体积集中在薄壳上（r≈1）；(2) 随机两点距离趋于常数；(3) 高斯分布概率质量集中在球面上而非原点。这些性质使基于距离的核方法（如 RBF）在高维时退化为几乎全局函数。",
        },
        {
          title: "数据流形（Data manifolds）",
          description: "尽管数据处于高维空间，实际有意义的数据通常分布在远低于环境维度的低维流形上。例如 64×64 像素的图像是 4096 维向量，但自然图像只占据其中极小部分。深度学习的核心洞察：利用流形结构避免维度灾难。",
        },
        {
          title: "从固定基函数到数据相关基函数",
          description: "与其人工选择基函数，不如让网络从数据中自主学习特征表示。这正是多层网络的核心动机——每一层都是可学习的非线性变换，整个网络自动发现适合当前任务的特征层次。",
        },
      ]}
      learningObjectives={[
        "解释维度灾难如何使固定基函数方法在高维空间中失效",
        "描述高维空间至少三个反直觉的几何性质",
        "理解数据流形假设及其对深度学习的重要意义",
        "论证从固定基函数过渡到可学习基函数的必要性",
      ]}
      coreIntuition={
        "想象在一个大球体中均匀撒豆子。在 3 维空间中豆子还算集中，到了 100 维，几乎每个豆子都跑到球壳表面去了——'近邻'这个概念失去了意义。幸好真实的豆子（数据）不会均匀散布，而是沿着一根'隐藏的面条'（低维流形）排列。深度网络的工作就是发现这根面条的形状。"
      }
      commonMistakes={[
        "认为增加数据量就能解决高维问题——维度灾难是几何性质的，再多数据也无法改变空间的稀疏性",
        "混淆数据流形假设与数据降维——流形假设是关于数据分布的，不是数据处理方法",
        "认为固定基函数完全没有用途——在低维问题或作为深度网络的组成部分时仍然有用",
      ]}
      quiz={[
        {
          question: "如果每个维度使用 10 个基函数，10 维输入需多少固定基函数？",
          options: ["10^10 个（指数爆炸）", "100 个", "10 个", "20 个"],
          correctIndex: 0,
          explanation: "每个维度 10 个，D=10 维需要 10^10 个基函数的笛卡尔积——这就是维度灾难。",
        },
        {
          question: "高维空间中单位球的体积主要集中在什么地方？",
          options: ["靠近球面的薄壳中", "球心附近", "均匀分布", "球心与球面之间"],
          correctIndex: 0,
          explanation: "在 D 维中，半径 r 处体积密度 ∝ r^{D-1}，D 很大时体积几乎全部集中在 r≈1 处。",
        },
        {
          question: "数据流形假设对深度学习意味着什么？",
          options: [
            "真实数据分布集中在低维流形上，网络可学习此流形而避免维度灾难",
            "所有数据都可降维到 2D 可视化",
            "维度灾难不适用于图像",
            "深度网络需要固定基函数",
          ],
          correctIndex: 0,
          explanation: "流形假设让深度学习可行：虽然输入维数高，但有效维数远低于环境维数。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 6",
        section: "6.1",
        pages: "§6.1, pp. 172–179",
        textbookSubsections: [
          "6.1 Limitations of Fixed Basis Functions",
          "6.1.1 The curse of dimensionality",
          "6.1.2 High-dimensional spaces",
          "6.1.3 Data manifolds",
          "6.1.4 Data-dependent basis functions",
        ],
      }}
    />
  );
}
