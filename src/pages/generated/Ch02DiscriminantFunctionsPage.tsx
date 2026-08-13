import BishopSectionPage from '@/components/BishopSectionPage';
import { SeparatorVertical } from 'lucide-react';
import LogisticDecisionBoundaryDemo from '@/components/demos/LogisticDecisionBoundaryDemo';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter02DiscriminantExercises } from '@/course/chapter02Exercises';

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
          description: "K 类问题可联合定义 K 个判别函数 y_k(x) = w_kᵀx + w_{k0}，预测为 argmax_k y_k(x)。它避免了分别阈值化 K 个二分类器造成的重叠或空白；在线性分数下，每类区域是若干半空间的交，因此是凸区域（也可能为空）。",
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
        "解释联合 argmax 与分别阈值化 K 个二分类器的差异",
        "理解 1-of-K 编码并写出对应的最小二乘目标函数",
        "能说出最小二乘分类相比逻辑回归的主要缺点",
      ]}
      coreIntuition={
        "判别函数就像一个国家的地图——每个类别有自己的'区域'，边界由判别函数值为 0 的线（超平面）定义。最小二乘分类相当于用尺子直接测量该画在哪里，但异常点会像磁铁一样把边界拉偏。"
      }
      commonMistakes={[
        "把 K 个 one-vs-rest 输出分别按固定阈值判决——可能产生重叠或无人负责的区域；若采用统一分数 argmax，则需进一步考虑分数可比性与校准",
        "把最小二乘分类输出的实数值直接当作概率——这些输出没有归一化，可能不在 [0,1] 范围内",
        "使用恒等基函数 ϕ(x)=x 导致无法学习非线性决策边界——需要像回归一样使用非线性基函数",
        "忽视最小二乘对异常值的敏感性：远离边界的'已正确分类'样本也会被平方损失拉向决策面",
      ]}
      whyCards={[
        {
          question: "为什么多分类要用 K 个判别函数？",
          answer: "每个函数负责给一个可比较的类别分数，取最大值会给出唯一归属。若把多个二分类器各自独立阈值化，才会出现多类同时为正或全部为负的歧义。",
        },
        {
          question: "为什么最小二乘分类对异常值敏感？",
          answer: "平方损失会让远离决策面的正确分类样本也产生惩罚，异常点像磁铁一样把决策面拉向自己。",
        },
      ]}
      counterexamples={[
        "把三个 one-vs-rest 分类器分别按 0.5 阈值化时，某些区域可能同时被多个分类器接受或全部拒绝——说明独立阈值化需要额外的冲突处理规则。",
        "在远离决策面的位置加入一个异常点，最小二乘分类的决策面会明显偏移——说明平方损失并不稳健。",
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
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步推导：1-of-K 最小二乘分类器"
            steps={[
              {
                label: '写成矩阵目标',
                formula: String.raw`E(\mathbf W)=\frac12\lVert\boldsymbol\Phi\mathbf W-\mathbf T\rVert_F^2`,
                explanation: 'Φ 的每一行是一个样本的基函数，T 的每一行是对应的 1-of-K 目标。',
              },
              {
                label: '对权重求导',
                formula: String.raw`\nabla_{\mathbf W}E=\boldsymbol\Phi^{T}(\boldsymbol\Phi\mathbf W-\mathbf T)`,
                explanation: 'Frobenius 范数等价于对 K 个输出的平方误差求和。',
              },
              {
                label: '令梯度为零',
                formula: String.raw`\boldsymbol\Phi^{T}\boldsymbol\Phi\mathbf W=\boldsymbol\Phi^{T}\mathbf T`,
                explanation: '这就是多输出线性回归的正规方程；它没有引入概率约束。',
              },
              {
                label: '得到闭式解',
                formula: String.raw`\mathbf W=(\boldsymbol\Phi^{T}\boldsymbol\Phi)^{-1}\boldsymbol\Phi^{T}\mathbf T`,
                explanation: '矩阵可逆时得到闭式解；实际计算常用 QR、SVD 或正则化，避免直接求逆。',
              },
            ]}
          />
          <LogisticDecisionBoundaryDemo />
          <ExercisePanel
            exerciseSetId="chapter02-discriminant-functions"
            exercises={chapter02DiscriminantExercises}
          />
        </div>
      }
    />
  );
}
