import BishopSectionPage from '@/components/BishopSectionPage';
import { Mountain } from 'lucide-react';

export default function Ch04ErrorSurfacesPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/error-surfaces"
      heroIcon={<Mountain className="w-9 h-9 text-blue-600" />}
      summary={"误差函数在高维参数空间中定义了一张复杂曲面。在极小值附近，损失可用 Hessian 矩阵描述的二次型近似；其特征值揭示了各方向的曲率，决定了梯度下降的收敛行为与最优学习率。"}
      concepts={[
        {
          title: "局部二次近似",
          description: "在驻点 w* 附近对误差函数做泰勒展开，一阶项为零，二阶项由 Hessian 矩阵 H 决定。这给出了损失曲面的局部几何。",
          formula: String.raw`E(\mathbf{w}) \simeq E(\mathbf{w}^*) + \frac{1}{2}(\mathbf{w}-\mathbf{w}^*)^{\!T}\mathbf{H}(\mathbf{w}-\mathbf{w}^*)`,
        },
        {
          title: "Hessian 矩阵",
          description: "H 是误差函数对参数的二阶偏导矩阵 H_{ij}=∂²E/∂w_i∂w_j，其特征值 λ_i 沿特征向量方向给出曲率。",
          formula: String.raw`\mathbf{H}_{ij} = \frac{\partial^2 E}{\partial w_i \,\partial w_j}`,
        },
        {
          title: "曲率与学习率",
          description: "沿特征值 λ 大的方向曲率大，梯度下降在该方向上最易振荡发散；最大稳定学习率受最大特征值约束。",
          formula: String.raw`\eta_{\max} = \frac{2}{\lambda_{\max}}`,
        },
        {
          title: "条件数",
          description: "条件数 κ=λ_max/λ_min 衡量曲面各向异性程度。κ 越大，梯度下降越容易出现锯齿形路径，收敛越慢。",
          formula: String.raw`\kappa = \frac{\lambda_{\max}}{\lambda_{\min}}`,
        },
        {
          title: "鞍点与高原",
          description: "在高维空间中，Hessian 同时有正负特征值的鞍点比局部极小值更常见。优化算法需要具备逃离鞍点的能力，否则会停滞在高原区域。",
        },
        {
          title: "梯度下降的轨迹",
          description: "在条件数大的曲面上，梯度方向并不指向极小值，而是呈现之字形振荡，这正是自适应优化方法被提出的动机之一。",
        },
      ]}
      learningObjectives={[
        "能写出误差函数在极小值附近的局部二次近似，并解释 Hessian 的作用。",
        "理解 Hessian 特征值与曲率方向的关系，以及它如何约束最大学习率。",
        "能用条件数解释为何各向异性曲面会导致梯度下降收敛缓慢。",
        "了解高维空间中鞍点比局部极小值更常见及其对优化的影响。",
      ]}
      coreIntuition={"误差曲面像一片起伏的地形：Hessian 的特征值告诉你每个方向有多陡。如果某个方向极陡（大 λ），走快一点就会跨过谷底来回反弹；如果某方向极缓（小 λ），走得再慢也几乎不动。条件数大的曲面就像一条狭长峡谷，梯度下降会在两壁间反复横跳却沿谷底方向缓慢前进。"}
      commonMistakes={[
        "认为梯度方向总是指向极小值；在各向异性曲面上，梯度几乎垂直于通向极小值的方向。",
        "对所有方向使用相同学习率而不考虑曲率差异，导致陡峭方向发散或平缓方向停滞。",
        "把训练停滞误判为到达局部极小值；在高维中更可能是鞍点或高原。",
        "忽略条件数对收敛速度的影响，仅靠学习率调参无法解决病态曲面的根本问题。",
      ]}
      quiz={[
        {
          question: "在极小值 w* 附近，误差函数的局部行为主要由什么决定？",
          options: [
            "Hessian 矩阵 H 的二次型",
            "梯度 ∇E 的方向",
            "误差函数的全局形状",
            "训练数据的大小",
          ],
          correctIndex: 0,
          explanation: "在驻点处一阶导数为零，泰勒展开的主项是 (1/2)(w-w*)ᵀH(w-w*)，局部几何完全由 Hessian 决定。",
        },
        {
          question: "梯度下降的最大稳定学习率与 Hessian 最大特征值 λ_max 的关系是？",
          options: [
            "η_max = 2/λ_max",
            "η_max = λ_max/2",
            "η_max = 1/λ_max²",
            "η_max = λ_max",
          ],
          correctIndex: 0,
          explanation: "沿最大特征值方向，更新公式 w←w-η∇E 的稳定条件要求 η<2/λ_max，否则迭代发散。",
        },
        {
          question: "为什么高维参数空间中鞍点比局部极小值更常见？",
          options: [
            "因为鞍点要求 Hessian 既有正又有负特征值，在高维中概率更高。",
            "因为局部极小值在高维中不存在。",
            "因为梯度下降会主动寻找鞍点。",
            "因为高维空间中所有点都是鞍点。",
          ],
          correctIndex: 0,
          explanation: "局部极小值要求 Hessian 所有特征值为正，随维度增加其概率指数衰减；而鞍点只需部分为正、部分为负，概率远高于严格局部极小。",
        },
        {
          question: "条件数 κ=λ_max/λ_min 很大时，梯度下降的典型行为是？",
          options: [
            "在陡峭方向来回振荡，沿平缓方向缓慢前进。",
            "均匀快速收敛到极小值。",
            "完全不收敛。",
            "直接跳过极小值。",
          ],
          correctIndex: 0,
          explanation: "大条件数意味着曲面各向异性严重，梯度方向偏离极小值方向，形成之字形锯齿路径。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 7",
        section: "7.1",
        pages: "Ch 7",
        textbookSubsections: [
          "7.1 Error Surfaces",
          "7.1.1 Local quadratic approximation"
        ],
        formulas: ["local quadratic approximation", "Hessian matrix", "maximum stable learning rate", "condition number"],
        algorithms: ["gradient descent stability analysis"],
        exercises: [
          "对二次函数 E(w)=½wᵀHw 推导梯度下降的收敛条件。",
          "给定 Hessian 的特征值，计算最优学习率与条件数。",
          "讨论鞍点对深度网络训练的影响及常用逃离策略。",
        ],
      }}
      demo={{
        title: "二次近似下的最稳学习率",
        label: "Hessian 最大特征值 λ_max",
        param: 2,
        min: 0.1,
        max: 10,
        step: 0.1,
        compute: (lambda) => ({
          label: '最大稳定学习率 η_max',
          value: 2 / lambda,
          display: String.raw`\eta_{\max}=\frac{2}{${lambda.toFixed(1)}}=${(2 / lambda).toFixed(3)}`,
        }),
        formula: String.raw`\eta_{\max} = \frac{2}{\lambda_{\max}}`,
      }}
    />
  );
}