import BishopSectionPage from '@/components/BishopSectionPage';
import PCALab from '@/components/demos/PCALab';
import PCAReconstructionLab from '@/components/demos/PCAReconstructionLab';
import { Shrink } from 'lucide-react';

export default function Ch13PrincipalComponentAnalysisPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/principal-component-analysis"
      heroIcon={<Shrink className="w-9 h-9 text-blue-600" />}
      summary={"主成分分析（PCA）是一种经典线性降维方法。它寻找数据方差最大的正交方向，将高维数据投影到低维子空间，同时最小化重构误差。"}
      concepts={[
        {
          title: "最大方差方向",
          description: "第一主成分是数据投影后方差最大的方向，后续主成分依次与前面正交且方差最大。",
        },
        {
          title: "特征分解",
          description: "PCA 等价于对数据协方差矩阵做特征分解，特征向量即主方向，特征值即方差。",
          formula: "S \\mathbf{u}_i = \\lambda_i \\mathbf{u}_i",
        },
        {
          title: "最小重构误差",
          description: "保留前 M 个主成分时，重构误差最小，等于被丢弃特征值之和。",
          formula: "J_M = \\sum_{i=M+1}^{D} \\lambda_i",
        },
        {
          title: "数据白化",
          description: "将数据变换到主成分坐标并按标准差缩放，可得到零均值、单位协方差的白化数据。",
        },
        {
          title: "High-dimensional data",
          description: "当维度 D 很大而样本数 N 较小时，直接求 D×D 协方差矩阵低效，可借助数据矩阵的低秩结构或 SVD/Gram matrix 视角计算主成分。",
        },
      ]}
      learningObjectives={[
        "理解 PCA 的最大方差与最小重构误差两种视角。",
        "能通过对协方差矩阵特征分解得到主成分。",
        "了解 PCA 在降维、去噪与白化中的应用。",
      ]}
      coreIntuition={"PCA 把数据‘压扁’到方差最大的方向上；方向越重要，数据在该方向上展开得越开。它并不保证保留对下游任务最有判别性的信息。"}
      commonMistakes={[
        "在使用 PCA 前忘记对数据中心化，导致主方向偏移。",
        "把 PCA 当作有监督特征选择方法；它是无监督的。",
        "认为 PCA 一定保留对下游任务最有判别性的信息。",
      ]}
      whyCards={[
        {
          question: "为什么最大方差意味着最小重构误差？",
          answer: "总方差是固定的。留下的方向方差越大，丢掉的就越小，而丢掉的方差正是重构误差。",
        },
        {
          question: "为什么降维只是结果？",
          answer: "PCA 真正想做的是用最少信息把数据重建得最像；能重建好，自然就能用更少维度表示。",
        },
      ]}
      counterexamples={[
        "最大方差方向不一定是最佳分类方向：若两类数据沿同一方向拉开，保留它反而可能把类别混在一起。",
        "若数据结构是非线性的（如弯曲流形），线性 PCA 即使保留高方差也无法低误差重构。",
      ]}
            bishopMapping={{
        chapter: "Ch 16",
        section: "16.1",
        pages: "Ch 16",
        textbookSubsections: [
          "16.1 Principal Component Analysis",
          "16.1.1 Maximum variance formulation",
          "16.1.2 Minimum-error formulation",
          "16.1.3 Data compression",
          "16.1.4 Data whitening",
          "16.1.5 High-dimensional data",
        ],
        formulas: ["S u_i = λ_i u_i", "J_M = Σ_{i>M} λ_i"],
        exercises: ["证明最大方差方向与最小重构误差方向一致。", "对二维相关高斯数据计算主成分。"],
      }}
      interactiveDemo={<PCALab />}
      extraContent={<PCAReconstructionLab />}
    />
  );
}
