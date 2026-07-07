import BishopSectionPage from '@/components/BishopSectionPage';
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
          formula: String.raw`S \mathbf{u}_i = \lambda_i \mathbf{u}_i`,
        },
        {
          title: "最小重构误差",
          description: "保留前 M 个主成分时，重构误差最小，等于被丢弃特征值之和。",
          formula: String.raw`J_M = \sum_{i=M+1}^{D} \lambda_i`,
        },
        {
          title: "数据白化",
          description: "将数据变换到主成分坐标并按标准差缩放，可得到零均值、单位协方差的白化数据。",
        },
      ]}
      learningObjectives={[
        "理解 PCA 的最大方差与最小重构误差两种视角。",
        "能通过对协方差矩阵特征分解得到主成分。",
        "了解 PCA 在降维、去噪与白化中的应用。",
      ]}
      coreIntuition={"PCA 把数据‘压扁’到最能区分样本的方向上；方向越重要，数据在该方向上展开得越开。"}
      commonMistakes={[
        "在使用 PCA 前忘记对数据中心化，导致主方向偏移。",
        "把 PCA 当作有监督特征选择方法；它是无监督的。",
        "认为 PCA 一定保留对下游任务最有判别性的信息。",
      ]}
      quiz={[
        {
          question: "PCA 的第一主成分是什么？",
          options: [
            "数据投影后方差最大的方向",
            "数据均值方向",
            "任意一个正交方向",
            "标签区分度最大的方向",
          ],
          correctIndex: 0,
          explanation: "PCA 按方差排序主成分，第一主成分使投影方差最大。",
        },
        {
          question: "若协方差矩阵的特征值为 λ₁=5, λ₂=2, λ₃=0.5，保留 2 维主成分的重构误差是多少？",
          options: ["0.5", "5", "2", "7.5"],
          correctIndex: 0,
          explanation: "重构误差等于被丢弃特征值之和，即 λ₃=0.5。",
        },
        {
          question: "在将数据投影到前 M 个主成分之前，必须先做什么？",
          options: [
            "中心化（减去均值）",
            "归一化到 [0,1]",
            "添加标签",
            "做 one-hot 编码",
          ],
          correctIndex: 0,
          explanation: "PCA 基于协方差矩阵，需要先中心化数据，否则主方向会受均值影响。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 16",
        section: "16.1",
        pages: "Ch 16",
        textbookSubsections: ["16.1 Principal Component Analysis", "16.1.1 Maximum variance formulation", "16.1.2 Minimum-error formulation", "16.1.3 Data compression", "16.1.4 Data whitening", "16.1.5 High-dimensional data"],
        formulas: ["S u_i = λ_i u_i", "J_M = Σ_{i>M} λ_i"],
        exercises: ["证明最大方差方向与最小重构误差方向一致。", "对二维相关高斯数据计算主成分。"],
      }}
    />
  );
}
