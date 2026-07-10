import BishopSectionPage from '@/components/BishopSectionPage';
import { FunctionSquare } from 'lucide-react';

export default function Ch01LinearRegressionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/linear-regression"
      heroIcon={<FunctionSquare className="w-9 h-9 text-blue-600" />}
      summary={
        "线性回归是 Bishop 第 4 章的核心。模型对参数保持线性，但通过基函数 ϕ(x) 可拟合非线性关系。高斯噪声假设下，最大似然严格等价于最小二乘；正则化最小二乘等价于高斯先验下的 MAP 估计。本节覆盖 4.1.1–4.1.7 全部七个子节。"
      }
      concepts={[
        {
          title: "Basis functions（基函数）",
          description: "基函数 ϕ_j(x) 将原始输入映射到特征空间。常用类型包括多项式、高斯基、sigmoid 基。模型中 y(x,w) = wᵀϕ(x) 对参数 w 仍保持线性，因此闭式解和凸优化性质都得到保留。",
          formula: String.raw`y(\mathbf{x}, \mathbf{w}) = \sum_{j=0}^{M-1} w_j \phi_j(\mathbf{x}) = \mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x})`,
        },
        {
          title: "Likelihood function（似然函数）",
          description: "假设目标 t 由确定性函数 y(x,w) 加零均值高斯噪声 ϵ ~ N(0, β⁻¹) 生成。给定 N 个独立同分布样本，完整似然是每个样本高斯密度的乘积。",
          formula: String.raw`p(\mathbf{t} \mid \mathbf{X}, \mathbf{w}, \beta) = \prod_{n=1}^{N} \mathcal{N}(t_n \mid \mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x}_n), \beta^{-1})`,
        },
        {
          title: "Maximum likelihood（最大似然）",
          description: "取对数后，ln p ∝ -½β Σ(t_n - wᵀϕ_n)² + const。最大化对数似然等价于最小化平方误差和。对 w 求导置零得正规方程。噪声精度 β 也由残差方差估计。",
          formula: String.raw`\mathbf{w}_{\text{ML}} = (\boldsymbol{\Phi}^{\!T}\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^{\!T}\mathbf{t},\quad \beta_{\text{ML}}^{-1} = \frac{1}{N}\sum_{n=1}^{N}\{t_n - \mathbf{w}_{\text{ML}}^{\!T}\boldsymbol{\phi}(\mathbf{x}_n)\}^2`,
        },
        {
          title: "Geometry of least squares（最小二乘几何）",
          description: "设计矩阵 Φ 的列张成 M 维子空间。最小二乘解 w_ML 使 Φw 成为目标向量 t 在该子空间上的正交投影。残差向量与投影子空间正交。",
        },
        {
          title: "Sequential learning（序列学习）",
          description: "数据逐个（或小批量）到达时，用随机梯度下降（SGD）更新参数。每次只用一个样本计算梯度，无需存储全部数据，适合在线学习和超大 N 场景。",
          formula: String.raw`\mathbf{w}^{(\tau+1)} = \mathbf{w}^{(\tau)} - \eta \nabla E_n = \mathbf{w}^{(\tau)} + \eta (t_n - \mathbf{w}^{(\tau)\!T}\boldsymbol{\phi}_n)\boldsymbol{\phi}_n`,
        },
        {
          title: "Regularized least squares（正则化最小二乘）",
          description: "误差函数增加权重衰减项 λ/2‖w‖²。等价于假设权重服从零均值高斯先验 p(w) = N(0, α⁻¹I) 下的 MAP 估计。λ 控制正则化强度，通过交叉验证选取。",
          formula: String.raw`\tilde{E}(\mathbf{w}) = \frac{1}{2}\sum_{n=1}^{N}\{t_n - \mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x}_n)\}^2 + \frac{\lambda}{2}\|\mathbf{w}\|^2,\quad \mathbf{w} = (\lambda\mathbf{I} + \boldsymbol{\Phi}^{\!T}\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^{\!T}\mathbf{t}`,
        },
        {
          title: "Multiple outputs（多输出）",
          description: "当目标为 K 维向量时，若各输出共享相同基函数且噪声独立，可分别求解每一列的权重，即对每个输出维度独立做最小二乘。",
        },
      ]}
      learningObjectives={[
        "能写出带基函数的线性模型，解释'线性指的是对参数 w 线性'",
        "从高斯噪声假设推导出负对数似然与平方误差的等价关系",
        "推导正规方程 w_ML = (ΦᵀΦ)⁻¹Φᵀt 并理解其几何（正交投影）",
        "写出 SGD 的权重更新式，理解其在大规模/流数据中的优势",
        "理解 L2 正则化等价于高斯先验下的 MAP，能写出正则化后的闭式解",
        "了解多输出回归可解耦为独立的单输出问题",
      ]}
      coreIntuition={
        "线性回归像用一组'尺子'（基函数）去量数据：每把尺子的刻度固定，但通过调整权重来组合它们。最小二乘就是在一组尺子张成的空间里找到离目标最近的投影点。正则化像是加了一个'不要太相信极端刻度'的约束。"
      }
      commonMistakes={[
        "把'线性回归'误解为对输入 x 线性；实际上关键是对参数 w 线性，基函数 ϕ(x) 可以高度非线性",
        "在高维（M ≈ N）时直接用正规方程而不加正则化，导致 ΦᵀΦ 奇异或严重过拟合",
        "忽视噪声精度 β 的作用，把点估计当成确定的预测",
        "认为 SGD 只适用于大批量数据；实际上单样本 SGD 噪声虽大但计算极快，配合递减学习率可收敛",
        "把正则化参数 λ 设得过大导致严重欠拟合（所有 w 趋近于 0）",
      ]}
      quiz={[
        {
          question: "y(x,w) = w₀ + w₁x + w₂x² 是线性模型吗？为什么？",
          options: [
            "是，因为对参数 w 是线性的（虽然对 x 不是）",
            "不是，因为包含 x² 项",
            "只有在 x 的取值范围内才是",
            "取决于训练数据是否线性",
          ],
          correctIndex: 0,
          explanation: "模型是参数的线性函数 wᵀϕ(x)，ϕ(x) = [1, x, x²] 是基函数，可以任意非线性。",
        },
        {
          question: "高斯噪声假设下，最大化似然函数等价于最小化什么？",
          options: [
            "平方误差和",
            "交叉熵",
            "Hinge loss",
            "KL 散度",
          ],
          correctIndex: 0,
          explanation: "对数似然中的 exp(-β(t-y)²/2) 项取 log 后得到 -(t-y)² 项，最大化即最小化平方和。",
        },
        {
          question: "正则化项 (λ/2)‖w‖² 对正规方程的解有什么影响？",
          options: [
            "在 ΦᵀΦ 对角线上加 λI，使矩阵满秩并收缩权重",
            "消除所有基函数的影响",
            "加速 SGD 收敛",
            "增大模型容量",
          ],
          correctIndex: 0,
          explanation: "正则化解 w = (λI + ΦᵀΦ)⁻¹Φᵀt 总是良定的，即使 ΦᵀΦ 奇异。λ > 0 确保矩阵可逆。",
        },
        {
          question: "为什么 ΦᵀΦ 求逆的计算代价可能很高？",
          options: [
            "因为它是 M×M 矩阵，求逆复杂度 O(M³)。当 M（基函数数量）很大时不可行",
            "因为它依赖于样本数 N",
            "因为它不是对称矩阵",
            "因为它只能在高斯噪声下使用",
          ],
          correctIndex: 0,
          explanation: "正规方程的瓶颈是 M³ 的矩阵求逆。当 M 很大时（如深度网络），SGD 等方法避免了矩阵求逆。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 4",
        section: "4.1",
        pages: "§4.1, pp. 112–119",
        textbookSubsections: [
          "4.1 Linear Regression",
          "4.1.1 Basis functions（基函数）",
          "4.1.2 Likelihood function（似然函数）",
          "4.1.3 Maximum likelihood（最大似然）",
          "4.1.4 Geometry of least squares（最小二乘几何）",
          "4.1.5 Sequential learning（序列学习）",
          "4.1.6 Regularized least squares（正则化最小二乘）",
          "4.1.7 Multiple outputs（多输出）",
        ],
        formulas: ["y(x,w) = wᵀϕ(x)", "normal equations", "regularized solution"],
        algorithms: ["least squares", "sequential gradient descent (SGD)", "regularized LS"],
        exercises: [
          "推导正规方程并分析 ΦᵀΦ 的维度与计算复杂度",
          "用多项式基函数 sin/cos 拟合数据，观察基函数数量的影响",
          "比较不同 λ 值下正则化权重的收缩效果",
          "实现一个 epoch 的 SGD 并观察收敛轨迹",
        ],
      }}
    />
  );
}
