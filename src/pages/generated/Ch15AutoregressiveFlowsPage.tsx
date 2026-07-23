import BishopSectionPage from '@/components/BishopSectionPage';
import { ArrowRight } from 'lucide-react';

export default function Ch15AutoregressiveFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/autoregressive-flows"
      heroIcon={<ArrowRight className="w-9 h-9 text-blue-600" />}
      summary={"自回归流将联合分布分解为有序的条件分布，每一维的变换只依赖前面维度，因此 Jacobian 是三角矩阵，行列式等于各维尺度因子的乘积。MAF 适合密度估计，IAF 适合快速采样。"}
      concepts={[
        {
          title: "自回归分解",
          description: "任意联合密度可写成各维度条件分布的乘积，自回归流据此逐维构造可逆变换。",
          formula: `p(\\mathbf{x}) = \\prod_{i=1}^{D} p(x_i \\mid \\mathbf{x}_{<i})`,
        },
        {
          title: "三角 Jacobian",
          description: "由于 x_i 只依赖于 z_{\\le i}，Jacobian 矩阵 ∂x/∂z 是下三角，行列式为对角元的乘积。",
          formula: String.raw`\ln \left|\det \frac{\partial \mathbf{x}}{\partial \mathbf{z}}\right| = \sum_{i=1}^{D} \ln \left|\frac{\partial x_i}{\partial z_i}\right|`,
        },
        {
          title: "MAF：密度估计方向快",
          description: "Masked Autoregressive Flow 沿数据维度顺序 x_i = μ_i(x_{<i}) + σ_i(x_{<i}) z_i 建模。对给定数据 x，所有条件概率可并行计算，因此密度估计高效；采样需要逐维顺序生成。",
          formula: String.raw`x_i = \mu_i(\mathbf{x}_{<i}) + \sigma_i(\mathbf{x}_{<i})\,z_i`,
        },
        {
          title: "IAF：采样方向快",
          description: "Inverse Autoregressive Flow 反用同一依赖结构从基变量 z 并行生成数据 x；但对任意 x 求密度需要按生成顺序逐个求逆，因此密度评估是串行的。",
          formula: String.raw`x_i = \mu_i(\mathbf{z}_{<i}) + \sigma_i(\mathbf{z}_{<i})\,z_i`,
        },
        {
          title: "Masked 自回归网络",
          description: "通过掩码或因果卷积保证每个输出 x_i 不依赖后续输入维度，维持三角结构。",
        },
      ]}
      learningObjectives={[
        "能将联合密度写成有序条件分布的乘积。",
        "理解为什么三角 Jacobian 的行列式容易计算。",
        "区分 MAF 与 IAF 在密度估计和采样上的优劣。",
      ]}
      coreIntuition={"自回归流像逐层拧魔方：每拧一格只受前面格子的约束，所以整体变换的‘体积变化’就是每格局部伸缩的乘积。"}
      commonMistakes={[
        "忽视顺序依赖，导致 Jacobian 不再是三角矩阵。",
        "把 MAF 和 IAF 的适用场景混为一谈：MAF 训练时密度计算快，但采样慢；IAF 采样快，但估计训练数据密度需要按生成顺序逐个计算。",
        "忘记行列式是对角元乘积，而不是所有偏导数之和。",
      ]}
      whyCards={[
        {
          question: "为什么自回归流的 Jacobian 是三角矩阵？",
          answer: "每一维的变换只依赖前面维度，后面维度不影响前面维度，因此 Jacobian 矩阵的非对角块为零，形成三角结构。",
        },
        {
          question: "为什么 MAF 和 IAF 的密度估计与采样速度相反？",
          answer: "MAF 沿数据维度顺序建模，密度可并行计算但采样需逐维生成；IAF 反用依赖结构，采样可并行但密度需串行求逆。",
        },
      ]}
      counterexamples={[
        "把 MAF 的并行密度估计特性套用到 IAF 上，导致密度计算极慢——说明 MAF 和 IAF 的适用场景完全不同。",
        "认为自回归流的 Jacobian 行列式是所有偏导数之和——实际上它是三角矩阵对角元的乘积。",
      ]}
            bishopMapping={{
        chapter: "Ch 18",
        section: "18.2",
        pages: "Ch 18",
        textbookSubsections: [
          "18.2 Autoregressive Flows"
        ],
        supplementalTopics: [
          "autoregressive factorization",
          "MAF",
          "IAF"
        ],
        formulas: ["p(x)=∏ᵢ p(xᵢ|x_{<i})", "三角 Jacobian 行列式", "xᵢ=μᵢ(x_{<i})+σᵢ(x_{<i})zᵢ"],
        algorithms: ["MAF", "IAF"],
        exercises: ["推导二维自回归变换的 Jacobian 行列式。", "比较 MAF 与 IAF 在训练与采样时的计算复杂度。"],
      }}
    />
  );
}
