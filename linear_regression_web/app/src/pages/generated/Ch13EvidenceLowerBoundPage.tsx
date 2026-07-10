import BishopSectionPage from '@/components/BishopSectionPage';
import PPCAELBODemo from '@/components/demos/PPCAELBODemo';
import { Scale } from 'lucide-react';

export default function Ch13EvidenceLowerBoundPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/evidence-lower-bound"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"Bishop Ch 16.3 在连续隐变量框架下讨论 ELBO：从期望最大化到概率 PCA 与因子分析的 EM 算法。"}
      concepts={[
        {
          title: "连续隐变量 ELBO",
          description: "对连续隐变量 z，ELBO 同样分解为完整数据对数似然的期望减 KL 散度。",
          formula: String.raw`\ln p(\mathbf{X} \mid \boldsymbol{\theta}) \ge \mathcal{L}(q,\boldsymbol{\theta}) = \mathbb{E}_q[\ln p(\mathbf{X},\mathbf{Z}\mid\boldsymbol{\theta})] - \mathbb{E}_q[\ln q(\mathbf{Z})]`,
        },
        {
          title: "期望最大化 EM",
          description: "E 步求 p(z|x,θ) 的后验；M 步用该后验期望最大化完整数据似然。",
        },
        {
          title: "概率 PCA 的 E-step",
          description: "给定 W 和 σ²，隐变量后验是高斯，均值与协方差可由观测 x 线性表示。",
          formula: String.raw`\mathbb{E}[\mathbf{z} \mid \mathbf{x}] = \mathbf{M}^{-1}\mathbf{W}^{\top}\mathbf{x}, \quad \mathbf{M}=\mathbf{W}^{\top}\mathbf{W}+\sigma^2\mathbf{I}`,
        },
        {
          title: "概率 PCA 的 M-step",
          description: "用后验统计量更新投影矩阵 W 和噪声方差 σ²。",
        },
        {
          title: "因子分析的 EM",
          description: "与概率 PCA 类似，但每个观测维度允许独立噪声方差 Ψ。",
        },
      ]}
      learningObjectives={[
        "能写出连续隐变量的 ELBO。",
        "理解概率 PCA 的 E-step 与 M-step。",
        "区分概率 PCA 与因子分析在噪声模型上的差异。",
      ]}
      coreIntuition={"连续隐变量下，后验分布不再是离散责任，而是高斯分布；EM 仍然成立，只是 E-step 需要计算均值和协方差。"}
      commonMistakes={[
        "把离散隐变量的责任 γ(z_nk) 直接套用到连续隐变量，混淆求和与积分。",
        "认为概率 PCA 的 EM 与标准 PCA 特征分解结果不同；极限情况下两者等价。",
        "忽略因子分析中对角噪声矩阵 Ψ 与概率 PCA 各向同性 σ² 的区别。",
      ]}
      quiz={[
        {
          question: "概率 PCA 的 E-step 中，隐变量后验是什么分布？",
          options: [
            "高斯分布",
            "类别分布",
            "均匀分布",
            "拉普拉斯分布",
          ],
          correctIndex: 0,
          explanation: "由于模型是线性-高斯，后验 p(z|x) 也是高斯分布。",
        },
        {
          question: "概率 PCA 与因子分析在噪声模型上的主要区别是？",
          options: [
            "概率 PCA 使用各向同性 σ²I，因子分析使用对角 Ψ。",
            "概率 PCA 没有噪声项。",
            "因子分析要求隐变量维度必须小于 2。",
            "两者在数学上完全相同。",
          ],
          correctIndex: 0,
          explanation: "概率 PCA 假设所有观测维度共享同一噪声方差；因子分析允许每个维度独立。",
        },
        {
          question: "连续隐变量 EM 的 E-step 需要计算什么？",
          options: [
            "后验分布的充分统计量（如均值、协方差）",
            "参数的点估计",
            "损失函数的梯度",
            "隐变量的精确采样",
          ],
          correctIndex: 0,
          explanation: "E 步需要得到后验的期望统计量，供 M 步更新参数使用。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 16",
        section: "16.3",
        pages: "Ch 16",
        textbookSubsections: [
          "16.3 Evidence Lower Bound",
          "16.3.1 Expectation maximization",
          "16.3.2 EM for PCA",
          "16.3.3 EM for factor analysis"
        ],
        formulas: ["连续隐变量 ELBO", "概率 PCA E-step"],
        algorithms: ["连续隐变量 EM", "概率 PCA 的 EM", "因子分析的 EM"],
        exercises: ["推导概率 PCA 的 E-step 后验均值与协方差。", "比较概率 PCA 与因子分析的 M-step 差异。"],
      }}
      extraContent={<PPCAELBODemo />}
    />
  );
}
