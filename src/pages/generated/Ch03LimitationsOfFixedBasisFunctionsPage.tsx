import BishopSectionPage from '@/components/BishopSectionPage';
import CurseOfDimensionalityLab from '@/components/demos/CurseOfDimensionalityLab';
import { AlertTriangle } from 'lucide-react';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter03LimitationsExercises } from '@/course/chapter03Exercises';

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
          description: "采用每维 K 个位置的直积网格时，基函数数量为 K^D——随着 D 增加，数据覆盖迅速变稀疏。这说明朴素的局部固定基展开不可扩展，但不意味着所有固定特征方法在所有高维数据上都必然失败；结构、稀疏性与内在维度同样关键。",
        },
        {
          title: "高维空间的反直觉性质",
          description: "在 D 维空间中：(1) 单位球的相对体积更多靠近边界；(2) 某些独立同分布模型下，随机点间距离的相对波动变小；(3) 高斯分布的典型样本位于离均值约 √D 的壳层。这会削弱原始欧氏距离的对比度，但结论依赖数据分布与度量。",
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
        "想象在一个高维空间中撒豆子：许多常见随机模型会让样本落在典型壳层，点间距离的相对差异随维度缩小。真实数据若靠近低维结构，模型便可能通过学习合适的表示与度量恢复有用的邻域，而不必均匀覆盖整个环境空间。"
      }
      commonMistakes={[
        "认为有限幅度地增加数据量就能抵消直积网格的指数增长——若不利用结构，保持同等覆盖率所需样本会随维度急剧增加",
        "混淆数据流形假设与数据降维——流形假设是关于数据分布的，不是数据处理方法",
        "认为固定基函数完全没有用途——在低维问题或作为深度网络的组成部分时仍然有用",
      ]}
      whyCards={[
        {
          question: "为什么高维空间会让基于距离的方法失效？",
          answer: "在某些高维点云中，距离相对均值的波动会缩小，近邻和远邻的对比度下降。是否失效还取决于数据是否有低维结构，以及所用表示和度量。",
        },
        {
          question: "为什么数据流形假设能拯救深度学习？",
          answer: "若真实数据主要沿少量内在自由度变化，学习器就有机会利用这种结构降低有效样本需求。深度网络可以学习与任务相关的表示，但能否恢复流形仍取决于数据、归纳偏置和优化。",
        },
      ]}
      counterexamples={[
        "在各向同性高维高斯点云中，原始欧氏距离的相对离散度明显缩小——若仍沿用固定带宽，RBF 相似度可能缺少区分度。",
        "增加固定基函数的数量从 10 到 100，在 10 维空间中需要 10^10 个基函数——说明指数增长不可持续。",
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
      demo={{
        title: "维度灾难：基函数数量随维度指数增长",
        label: "输入维度 D",
        param: 2,
        min: 1,
        max: 10,
        step: 1,
        compute: (D) => {
          const K = 5;
          const numBasis = Math.pow(K, D);
          return {
            label: `K=${K} 时基函数数量`,
            value: numBasis,
            display: String.raw`K^D=${K}^{${D}}=${numBasis.toLocaleString()}`,
          };
        },
        formula: String.raw`\text{基函数数量} = K^D`,
      }}
      interactiveDemo={<CurseOfDimensionalityLab />}
      extraContent={
        <ExercisePanel
          exerciseSetId="chapter03-limitations"
          exercises={chapter03LimitationsExercises}
        />
      }
    />
  );
}
