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
          formula: String.raw`p(\mathbf{x}) = \prod_{i=1}^{D} p(x_i \mid \mathbf{x}_{<i})`,
        },
        {
          title: "三角 Jacobian",
          description: "由于 x_i 只依赖于 z_{\le i}，Jacobian 矩阵 ∂x/∂z 是下三角，行列式为对角元的乘积。",
          formula: String.raw`\ln \left|\det \frac{\partial \mathbf{x}}{\partial \mathbf{z}}\right| = \sum_{i=1}^{D} \ln \left|\frac{\partial x_i}{\partial z_i}\right|`,
        },
        {
          title: "MAF 与 IAF",
          description: "MAF 按数据维度顺序建模，密度估计只需一次前向传播；IAF 反序从基变量生成数据，采样并行高效。",
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
      quiz={[
        {
          question: "自回归流中 Jacobian 矩阵为什么是三角矩阵？",
          options: [
            "因为每个 x_i 只依赖于 z_{≤i}，不依赖后面的 z_j。",
            "因为网络参数被强制共享。",
            "因为所有维度使用相同的变换。",
            "因为基分布 p(z) 是标准高斯。",
          ],
          correctIndex: 0,
          explanation: "三角结构来自因果顺序：输出 x_i 的偏导对后续 z_j 为零，因此 Jacobian 下三角。",
        },
        {
          question: "若二维自回归变换为 x₁=z₁, x₂=2z₂+z₁，则 ln|det J| 是多少？",
          options: ["ln 2", "2", "ln 3", "0"],
          correctIndex: 0,
          explanation: "Jacobian 为 [[1,0],[1,2]]，行列式为 2，取对数得 ln 2。",
        },
        {
          question: "MAF 相比 IAF 的主要优势是什么？",
          options: [
            "对给定数据 x 计算密度 p(x) 只需一次前向传播。",
            "采样新数据的速度明显更快。",
            "不需要计算 Jacobian。",
            "可以使用任意非可逆神经网络。",
          ],
          correctIndex: 0,
          explanation: "MAF 的变换方向与数据维度顺序一致，因此估计密度高效；IAF 则在采样方向上高效。",
        },
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
