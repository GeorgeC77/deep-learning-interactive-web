import BishopSectionPage from '@/components/BishopSectionPage';
import { SeparatorVertical } from 'lucide-react';

export default function Ch02DiscriminantFunctionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch02/discriminant-functions"
      heroIcon={<SeparatorVertical className="w-9 h-9 text-blue-600" />}
      summary={
        "判别函数是分类的最直接方式：为每个输入计算一个实数值，根据函数值决定类别归属。二分类用一个函数的符号判决，多分类用 K 个函数取最大值。1-of-K 编码将分类目标转化为向量，从而可用最小二乘框架求解——虽然简洁，但对异常值和类别不平衡敏感。本节覆盖 §5.1.1–5.1.4。"
      }
      concepts={[
        {
          title: "Two classes（二分类判别）",
          description: "单个线性判别函数 y(x) = wᵀx + w₀ 将输入空间分为两半：y(x) ≥ 0 判为 C₁，否则 C₂。决策面 y(x) = 0 是 (D−1) 维超平面，w 是法向量，w₀ 控制到原点的偏移。",
          formula: String.raw`y(\mathbf{x}) = \mathbf{w}^{\!T}\mathbf{x} + w_0,\quad \text{decision: } \begin{cases} \mathcal{C}_1 & y(\mathbf{x}) \ge 0 \\ \mathcal{C}_2 & y(\mathbf{x}) < 0 \end{cases}`,
        },
        {
          title: "Multiple classes（多分类判别）",
          description: "K 类问题需要 K 个判别函数 y_k(x) = w_kᵀx + w_{k0}，预测为 argmax_k y_k(x)。这种'一对多'形式保证每个输入恰好被分配给一个类别，且决策区域是单连通凸区域。",
          formula: String.raw`\mathcal{C}(\mathbf{x}) = \arg\max_k y_k(\mathbf{x}),\quad y_k(\mathbf{x}) = \mathbf{w}_k^{\!T}\mathbf{x} + w_{k0}`,
        },
        {
          title: "1-of-K 编码",
          description: "将类别标签编码为标准基向量 t_n ∈ {0,1}^K，恰好一个分量为 1。这使得 K 个判别函数可通过一个权值矩阵 W 统一表示，输出向量 ŷ = Wᵀx 的每个分量对应一个类别的判别值。",
        },
        {
          title: "Least squares for classification（最小二乘分类）",
          description: "用最小二乘拟合 1-of-K 编码：最小化 Σ_n ‖Wᵀx_n − t_n‖²。有闭式解 W = (XᵀX)⁻¹XᵀT，训练快。但平方损失对'过于正确'的预测也会惩罚，且对异常值敏感，因此分类中通常不如交叉熵。",
          formula: String.raw`\mathbf{W}_{\text{ML}} = (\boldsymbol{\Phi}^{\!T}\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^{\!T}\mathbf{T}`,
        },
      ]}
      learningObjectives={[
        "写出二分类线性判别函数及其决策面方程",
        "解释为什么多分类应使用 K 个函数而不是 K 个二分类器组合",
        "理解 1-of-K 编码并写出对应的最小二乘目标函数",
        "能说出最小二乘分类相比逻辑回归的主要缺点",
      ]}
      coreIntuition={
        "判别函数就像一个国家的地图——每个类别有自己的'区域'，边界由判别函数值为 0 的线（超平面）定义。最小二乘分类相当于用尺子直接测量该画在哪里，但异常点会像磁铁一样把边界拉偏。"
      }
      commonMistakes={[
        "用多个 one-vs-rest 二分类器组合处理多分类——会产生重叠或不可分类区域（四面体问题）",
        "把最小二乘分类输出的实数值直接当作概率——这些输出没有归一化，可能不在 [0,1] 范围内",
        "使用恒等基函数 ϕ(x)=x 导致无法学习非线性决策边界——需要像回归一样使用非线性基函数",
        "忽视最小二乘对异常值的敏感性：远离边界的'已正确分类'样本也会被平方损失拉向决策面",
      ]}
      quiz={[
        {
          question: "二分类线性判别 y(x) = wᵀx + w₀。当 w = [1,0], w₀ = −3 时，决策边界是什么？",
          options: ["x₁ = 3（垂直于 x₁ 轴的直线）", "x₁ = 0", "x₁ + x₂ = 3", "x₁ − x₂ = 3"],
          correctIndex: 0,
          explanation: "wᵀx + w₀ = 0 ⇒ 1·x₁ + 0·x₂ − 3 = 0 ⇒ x₁ = 3。",
        },
        {
          question: "one-vs-rest 方式处理 3 类问题的根本问题是什么？",
          options: [
            "某些区域可能不属于任何类别或同时属于多个类别",
            "它比 K 函数方法计算更快",
            "它只能处理 2 类问题",
            "它需要更多的训练数据",
          ],
          correctIndex: 0,
          explanation: "三个二分类器各自划分空间，交集可能产生既不属于任何类也不被多个类同时判定的区域。",
        },
        {
          question: "最小二乘分类对哪些样本的惩罚最重？",
          options: ["距离决策边界很远的样本（即使分类正确）", "刚好在决策边界附近的样本", "被错误分类的样本", "噪声样本"],
          correctIndex: 0,
          explanation: "平方损失对大残差敏感。一个'非常确定正确'的样本残差为 1 − 0.95 = 0.05，其平方很小；但一个极端 outlier 可能导致残差为几十，平方极大。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 5",
        section: "5.1",
        pages: "§5.1, pp. 132–137",
        textbookSubsections: [
          "5.1 Discriminant Functions",
          "5.1.1 Two classes",
          "5.1.2 Multiple classes",
          "5.1.3 1-of-K coding",
          "5.1.4 Least squares for classification",
        ],
        formulas: ["linear discriminant y(x)=wᵀx+w₀", "multiclass argmax", "least-squares classifier W"],
        algorithms: ["one-vs-rest", "one-vs-one", "least-squares classification"],
        exercises: [
          "画出二分类线性判别函数的决策边界，并标注 w 的方向",
          "推导为什么 one-vs-rest 会产生不可分类区域",
          "实现最小二乘分类并在含异常值的数据上观察决策边界的偏移",
        ],
      }}
      demo={{
        title: "决策边界随偏置变化",
        label: "偏置 w₀",
        param: 0,
        min: -3,
        max: 3,
        step: 0.1,
        compute: (w0) => ({
          label: "边界截距",
          value: -w0,
          display: String.raw`x=-` + w0.toFixed(1),
        }),
        formula: String.raw`x = -w_0 / w_1 \quad (\text{设 } w_1 = 1)`,
      }}
    />
  );
}
