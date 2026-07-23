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
      whyCards={[
        {
          question: "为什么连续隐变量的后验也是高斯？",
          answer: "线性高斯模型的共轭性质保证：先验高斯、似然高斯，后验必然还是高斯。这让 E 步可以闭式计算均值和协方差。",
        },
        {
          question: "为什么概率 PCA 的 EM 与标准 PCA 等价？",
          answer: "当噪声方差 σ² 趋于 0 时，概率 PCA 的隐空间后验会收敛到标准 PCA 的主子空间投影，因此极限情况下两者一致。",
        },
      ]}
      counterexamples={[
        "把连续隐变量的后验当成离散责任处理，会得到完全错误的 E 步——说明连续与离散隐变量的数学工具不同。",
        "忽略因子分析中对角噪声矩阵 Ψ 与概率 PCA 各向同性 σ² 的区别，会错误估计每个观测维度的噪声水平——说明细节决定模型适用性。",
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
