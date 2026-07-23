import BishopSectionPage from '@/components/BishopSectionPage';
import { GitBranch } from 'lucide-react';
import BackpropagationLab from '@/components/demos/BackpropagationLab';

export default function Ch05EvaluationOfGradientsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch05/evaluation-of-gradients"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={
        "反向传播是训练深度神经网络的核心算法。对于标量损失 L，反向模式自动微分能以一次前向计算的常数倍成本，计算 L 对全部参数的梯度——这是深度学习可行的数学基石。本节用可交互计算图演示前向传播、局部导数与梯度累积。"
      }
      concepts={[
        {
          title: "计算图（Computation graph）",
          description: "神经网络的前向计算表示为有向无环图（DAG）。每个节点是基本操作（+、×、sin、exp 等），边传递数据流。反向传播沿逆向边传播梯度，每个节点的局部导数仅依赖该节点操作和输入值。",
        },
        {
          title: "链式法则（Chain rule）",
          description: "若 L = f(g(x))，则 ∂L/∂x = (∂L/∂y)·(∂y/∂x)。反向传播系统地对每个节点应用链式法则，从输出端向输入端累积 adjoint。每个节点的局部导数独立计算，乘以从输出传来的梯度后分发给输入。",
          formula: String.raw`\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial x}`,
        },
        {
          title: "反向模式的成本 = O(前向)",
          description: "标量输出 + N 个参数：一次前向+一次后向即可计算全部梯度（约 2-3 倍前向成本，与 N 无关）。有限差分需每个参数至少一次额外前向（O(N) 倍）。当参数达百万级，反传优势是指数级的。",
        },
        {
          title: "数值梯度校验",
          description: "用中心差分 (f(w+h)−f(w−h))/(2h) 验证反传正确性。相对误差应在 10⁻⁵ 量级。h 过小→舍入误差；h 过大→截断误差——形成 U 形误差曲线。",
        },
        {
          title: "Jacobian 矩阵",
          description: "Jacobian 矩阵 J 收集向量值函数对所有输入的偏导数，J_{ij} = ∂f_i/∂x_j。在神经网络中，它描述一层输出对输入的局部线性变换，是链式法则的矩阵形式。",
          formula: String.raw`\mathbf{J} = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_m}{\partial x_1} & \cdots & \frac{\partial f_m}{\partial x_n} \end{bmatrix}`,
        },
        {
          title: "Hessian 矩阵",
          description: "Hessian 矩阵 H 是标量函数二阶偏导数矩阵，H_{ij} = ∂²L/∂w_i∂w_j。它描述损失曲面的局部曲率，可用于牛顿法、学习率自适应和鞍点分析，但计算/存储成本随参数平方增长。",
          formula: String.raw`\mathbf{H} = \nabla^2 L(\mathbf{w}) = \begin{bmatrix} \frac{\partial^2 L}{\partial w_1^2} & \cdots & \frac{\partial^2 L}{\partial w_1 \partial w_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial^2 L}{\partial w_n \partial w_1} & \cdots & \frac{\partial^2 L}{\partial w_n^2} \end{bmatrix}`,
        },
      ]}
      learningObjectives={[
        "理解计算图如何将复合函数分解为基本操作 DAG",
        "能逐节点追踪前向值和反向梯度（adjoint）",
        "解释反向模式为何以常数倍成本计算全部参数梯度",
        "进行数值梯度校验并理解 h 选择对误差的影响",
      ]}
      coreIntuition={
        "想象一个分水岭：正向是水流从源头经各支流到终点，反向是跟踪终点的出水量回溯——每个节点只关心'我传了多少水给下游'（局部导数），最终累积得到每个源头的总贡献（参数梯度）。"
      }
      commonMistakes={[
        "反向模式以一次前向+一次后向的常数倍成本计算全部参数梯度。不要说'参数平方增长'——反传成本与参数数量解耦，这正是它使深度学习可行的原因。",
        "忘记保存前向传播的中间激活值——反向传播需要它们来计算局部导数，这是神经网络内存消耗的主要来源。",
        "混淆 adjoint（从输出传来的累积梯度）和 local derivative（仅本节点的 ∂out/∂in）。",
      ]}
      whyCards={[
        {
          question: "为什么反向传播能高效计算所有参数的梯度？",
          answer: "反向模式只需一次前向加一次后向，成本与参数数量无关。相比之下，数值梯度需要为每个参数单独计算，成本随参数线性增长。",
        },
        {
          question: "为什么反向传播需要保存中间激活值？",
          answer: "反向传播计算局部导数时需要用到前向传播的中间结果。保存这些值是神经网络内存消耗的主要来源。",
        },
      ]}
      counterexamples={[
        "用有限差分验证反向传播梯度，h 太大或太小都会导致误差增大——说明数值校验需要选择合适的步长。",
        "忘记保存前向中间激活值，反向传播无法计算局部导数——说明内存与计算效率需要权衡。",
      ]}
            bishopMapping={{
        chapter: "Ch 8",
        section: "8.1",
        pages: "§8.1",
        textbookSubsections: [
          "8.1 Evaluation of Gradients",
          "8.1.1 Single-layer networks",
          "8.1.2 General feed-forward networks",
          "8.1.3 A simple example",
          "8.1.4 Numerical differentiation",
          "8.1.5 The Jacobian matrix",
          "8.1.6 The Hessian matrix",
        ],
        formulas: ["chain rule", "backpropagation recursion", "gradient check"],
        algorithms: ["reverse-mode automatic differentiation"],
      }}
      extraContent={<BackpropagationLab />}
    />
  );
}
