import BishopSectionPage from '@/components/BishopSectionPage';
import DerivationStepper from '@/components/DerivationStepper';
import MiniBatchGradientLab from '@/components/demos/MiniBatchGradientLab';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter04GradientDescentExercises } from '@/course/chapter04Exercises';
import { ArrowDownCircle } from 'lucide-react';

export default function Ch04GradientDescentOptimizationPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/gradient-descent-optimization"
      heroIcon={<ArrowDownCircle className="w-9 h-9 text-blue-600" />}
      summary={"Bishop §7.2 从梯度信息的计算价值出发，比较全数据 Batch GD、单样本 SGD 与 mini-batch 更新，并说明随机打乱、epoch 和参数初始化为何是可训练深层网络的组成部分。"}
      concepts={[
        {
          title: "使用梯度信息",
          description: "损失值只给出一个标量，而梯度一次给出所有 W 个参数方向的一阶信息。配合反向传播，梯度法通常比只比较函数值的搜索更高效，但仍是局部信息。",
          formula: String.raw`\nabla E(\mathbf w)=\left(\frac{\partial E}{\partial w_1},\ldots,\frac{\partial E}{\partial w_W}\right)^{\!T}`,
        },
        {
          title: "批量梯度下降",
          description: "Batch GD 每次处理整个训练集，方向对当前训练目标是确定的，但数据越大，单步代价越高。训练结果仍取决于初始化、学习率和误差面结构。",
          formula: String.raw`w^{(\tau+1)} = w^{(\tau)} - \eta \nabla E(w^{(\tau)})`,
        },
        {
          title: "随机梯度下降",
          description: "每次仅用一个样本的梯度项更新参数，单步便宜但方差大。随机性有时有助于离开某些驻点，但并不保证逃离所有局部极小值，也不保证更好的泛化。",
          formula: String.raw`\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\eta\nabla E_n(\mathbf w^{(\tau-1)})`,
        },
        {
          title: "小批量梯度下降",
          description: "用 B 个随机样本估计全数据梯度，可利用硬件并降低方差。独立样本均值的标准误约为 σ/√B，所以继续增大 B 的统计收益递减；数据还应在 epoch 间打乱。",
          formula: String.raw`\operatorname{SE}(\bar g_B)=\frac{\sigma_g}{\sqrt B}`,
        },
        {
          title: "参数初始化",
          description: "随机初始化打破同层单元的对称性，并应控制跨层激活尺度。对具有 M 个输入的 ReLU 单元，教材给出 He 标准差 ε=√(2/M)；这依赖独立性和尺度假设。",
          formula: String.raw`w_{ij}\sim\mathcal N\!\left(0,\frac{2}{M}\right),\quad \varepsilon=\sqrt{\frac{2}{M}}`,
        },
      ]}
      learningObjectives={[
        "写出 Batch GD、SGD 与 mini-batch 梯度估计并比较单步成本和方差。",
        "用 σ/√B 解释扩大 mini-batch 的统计收益递减。",
        "解释随机打乱、epoch 与独立验证集在训练流程中的作用。",
        "从对称性和激活尺度两方面解释 He 初始化。",
      ]}
      coreIntuition={"Batch、SGD 和 mini-batch 使用的是同一训练目标的不同梯度估计：前者每步看全体，后者用更便宜但更嘈杂的样本估计。batch size 是统计误差、更新频率、内存和硬件吞吐之间的共同选择。"}
      commonMistakes={[
        "认为全数据梯度会因此更容易陷入局部极小值——确定性与陷入哪类驻点不是同一个结论，关键还取决于误差面和初始化。",
        "认为 SGD 的噪声一定有益——它可能帮助探索，也可能使训练抖动，需要学习率调度和验证。",
        "忽视参数初始化对深度网络的影响——不当初始化会导致梯度消失或爆炸。",
        "按原始顺序切 mini-batch 而不打乱具有时间或类别相关性的数据，导致梯度估计产生系统偏差。",
      ]}
      whyCards={[
        {
          question: "为什么小批量梯度下降最常用？",
          answer: "它比单样本梯度下降更稳定，比批量梯度下降更快，还能利用 GPU 的矩阵运算效率。",
        },
        {
          question: "为什么参数初始化不能全为零？",
          answer: "所有权重相同时，所有隐藏单元输出完全相同，反向传播梯度也相同，网络无法学习不同的特征。",
        },
      ]}
      counterexamples={[
        "将 batch size 从 32 增至 3200，标准误理论上只缩小 10 倍而非 100 倍——说明更大 batch 的统计收益递减。",
        "把深度网络所有权重初始化为零，所有隐藏单元永远输出相同值——说明初始化是训练的前提。",
      ]}
      bishopMapping={{
        chapter: "Ch 7",
        section: "7.2",
        pages: "§7.2, pp. 213–218",
        textbookSubsections: [
          "7.2 Gradient Descent Optimization",
          "7.2.1 Use of gradient information",
          "7.2.2 Batch gradient descent",
          "7.2.3 Stochastic gradient descent",
          "7.2.4 Mini-batches",
          "7.2.5 Parameter initialization"
        ],
        formulas: ["batch and stochastic gradient updates", "SE(ḡ_B)=σ_g/√B", "He initialization ε=√(2/M)"],
        algorithms: ["Algorithm 7.1 stochastic gradient descent", "Algorithm 7.2 mini-batch stochastic gradient descent"],
        exercises: ["计算 batch size 扩大后的梯度标准误。", "解释为何 mini-batch 之间需要打乱数据。", "从 ReLU 二阶矩推导 He 初始化尺度。"]
      }}
      interactiveDemo={<MiniBatchGradientLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步推导：为什么 mini-batch 收益按平方根递减"
            steps={[
              { label: '单样本梯度', formula: String.raw`\mathbb E[g_n]=g,\quad \operatorname{Var}(g_n)=\sigma_g^2`, explanation: '假设随机样本梯度对全数据平均梯度无偏，且方差有限。' },
              { label: '取 batch 均值', formula: String.raw`\bar g_B=\frac1B\sum_{n=1}^{B}g_n`, explanation: 'mini-batch 更新使用 B 个样本贡献的平均。' },
              { label: '独立方差相加', formula: String.raw`\operatorname{Var}(\bar g_B)=\frac{1}{B^2}\sum_n\sigma_g^2=\frac{\sigma_g^2}{B}`, explanation: '该式依赖样本近似独立；相关 batch 会有额外协方差项。' },
              { label: '得到标准误', formula: String.raw`\operatorname{SE}(\bar g_B)=\frac{\sigma_g}{\sqrt B}`, explanation: 'B 扩大 100 倍，典型误差只缩小 10 倍。' },
            ]}
          />
          <ExercisePanel exerciseSetId="chapter04-gradient-descent" exercises={chapter04GradientDescentExercises} />
        </div>
      }
    />
  );
}
