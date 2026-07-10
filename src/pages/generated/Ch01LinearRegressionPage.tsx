import BishopSectionPage from '@/components/BishopSectionPage';
import { FunctionSquare } from 'lucide-react';

export default function Ch01LinearRegressionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch01/linear-regression"
      heroIcon={<FunctionSquare className="w-9 h-9 text-blue-600" />}
      summary={"线性回归通过对参数的线性组合拟合目标。基函数将输入映射到特征空间，高斯噪声假设下最大似然等价于最小二乘；正则化则控制模型复杂度。"}
      concepts={[
        {
          title: "Basis functions",
          description: "把原始输入 x 通过固定非线性函数 φ_j(x) 变换到特征空间，使模型仍对参数 w 保持线性。",
          formula: String.raw`y(\mathbf{x}, \mathbf{w}) = \sum_{j=0}^{M-1} w_j \phi_j(\mathbf{x}) = \mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x})`,
        },
        {
          title: "Likelihood function",
          description: "假设目标值由确定性函数加高斯噪声产生，似然函数度量参数解释观测数据的概率。",
          formula: String.raw`p(\mathbf{t} \mid \mathbf{X}, \mathbf{w}, \beta) = \prod_{n=1}^{N} \mathcal{N}(t_n \mid \mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x}_n), \beta^{-1})`,
        },
        {
          title: "Maximum likelihood",
          description: "最大化似然等价于最小化平方误差，其解析解由正规方程给出。",
          formula: String.raw`\mathbf{w}_{\text{ML}} = (\boldsymbol{\Phi}^{\!T}\boldsymbol{\Phi})^{-1}\boldsymbol{\Phi}^{\!T}\mathbf{t}`,
        },
        {
          title: "Geometry of least squares",
          description: "最小二乘解对应目标向量在由设计矩阵列张成的空间上的正交投影。",
        },
        {
          title: "Sequential learning",
          description: "数据逐个到达时，可用随机梯度下降在线更新权重，无需一次性存储全部数据。",
          formula: String.raw`\mathbf{w}^{(\tau+1)} = \mathbf{w}^{(\tau)} - \eta (\mathbf{w}^{(\tau)\!T}\boldsymbol{\phi}_n - t_n)\boldsymbol{\phi}_n`,
        },
        {
          title: "Regularized least squares",
          description: "在误差函数中加入权重二次惩罚，等价于高斯先验下的 MAP 估计，可防止过拟合。",
          formula: String.raw`\tilde{E}(\mathbf{w}) = \frac{1}{2}\sum_{n=1}^{N}\{t_n - \mathbf{w}^{\!T}\boldsymbol{\phi}(\mathbf{x}_n)\}^2 + \frac{\lambda}{2}\|\mathbf{w}\|^2`,
        },
        {
          title: "Multiple outputs",
          description: "多目标回归时，若各目标共享相同基函数且噪声独立，可并行求解每一列权重。",
        },
      ]}
      learningObjectives={[
        "能写出带基函数的线性模型形式，并解释‘线性’指的是对参数线性。",
        "理解高斯噪声假设下最大似然与最小二乘的等价关系。",
        "能推导并求解正规方程，理解最小二乘的几何意义。",
        "了解正则化在控制模型复杂度中的作用。",
      ]}
      coreIntuition={"线性回归像用一把可弯折的尺子去量数据：基函数决定尺子能弯成什么形状，最小二乘决定把尺子放在哪里，正则化则防止尺子弯得太复杂而只拟合噪声。"}
      commonMistakes={[
        "把‘线性回归’误解为对输入 x 线性；实际上关键是对参数 w 线性，基函数可以是非线性的。",
        "忽略噪声精度 β 在似然函数中的作用，导致对预测不确定性的估计缺失。",
        "在特征数接近或超过样本数时直接使用正规方程而不加正则化，导致矩阵奇异或过拟合。",
      ]}
      quiz={[
        {
          question: "为什么 y(x,w)=wᵀφ(x) 仍被称为线性回归，即使 φ(x) 是非线性的？",
          options: [
            "因为它对参数 w 是线性的。",
            "因为它对输入 x 必须是线性的。",
            "因为 φ(x) 不能包含多项式。",
            "因为正则化只适用于线性输入。",
          ],
          correctIndex: 0,
          explanation: "线性回归的‘线性’指对模型参数线性，基函数 φ(x) 可以任意非线性，从而使模型对输入具有非线性拟合能力。",
        },
        {
          question: "在高斯噪声假设下，最大化似然函数等价于最小化什么？",
          options: [
            "平方误差和",
            "交叉熵损失",
            " hinge 损失",
            "KL 散度",
          ],
          correctIndex: 0,
          explanation: "对数似然中的负二次项对应平方误差，因此最大似然解与最小二乘解一致。",
        },
        {
          question: "正则化项 λ/2 ||w||² 的主要作用是什么？",
          options: [
            "收缩权重，降低模型复杂度，减少过拟合。",
            "增加训练误差以获得更低测试误差。",
            "使模型对输入 x 完全线性。",
            "消除基函数的影响。",
          ],
          correctIndex: 0,
          explanation: "L2 正则化惩罚大权重，使解偏向更简单的模型，从而提高泛化能力。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 4",
        section: "4.1",
        pages: "Ch 4",
        textbookSubsections: [
          "4.1 Linear Regression",
          "4.1.1 Basis functions",
          "4.1.2 Likelihood function",
          "4.1.3 Maximum likelihood",
          "4.1.4 Geometry of least squares",
          "4.1.5 Sequential learning",
          "4.1.6 Regularized least squares",
          "4.1.7 Multiple outputs"
        ],
        formulas: ["linear model", "Gaussian likelihood", "normal equations", "regularized error"],
        algorithms: ["least squares", "sequential gradient descent"],
        exercises: [
          "推导正规方程并讨论其计算复杂度。",
          "用多项式基函数拟合数据，观察次数与过拟合的关系。",
          "比较不同 λ 下正则化权重的变化。",
        ],
      }}
    />
  );
}
