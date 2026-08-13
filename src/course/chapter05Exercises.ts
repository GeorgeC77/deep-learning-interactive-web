import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter05GradientExercises: LearningExercise[] = [
  {
    id: 'backprop-local-gradient',
    difficulty: 1,
    prompt: '连接 wji 的输入端激活为 zi，输出端误差信号为 δj。该权重的梯度是什么？',
    options: [
      { id: 'product', label: 'δj zi' },
      { id: 'sum', label: 'δj + zi' },
      { id: 'weight-only', label: '始终等于 wji' },
    ],
    correctOptionId: 'product',
    hint: '把 ∂E/∂wji 拆成 ∂E/∂aj 与 ∂aj/∂wji。',
    explanation: '链式法则给出 ∂E/∂wji=(∂E/∂aj)(∂aj/∂wji)=δj zi，这是反传的局部乘积结构。',
  },
  {
    id: 'backprop-branch-accumulation',
    difficulty: 2,
    prompt: '变量 x 同时沿两条路径影响标量损失 L，反向传播到 x 时应如何组合两条贡献？',
    options: [
      { id: 'sum', label: '把每条路径的梯度贡献相加' },
      { id: 'largest', label: '只保留绝对值最大的贡献' },
      { id: 'multiply', label: '把两条完整路径贡献彼此相乘' },
    ],
    correctOptionId: 'sum',
    hint: '对 L=L₁(x)+L₂(x) 应用求导线性性。',
    explanation: '同一变量经多个子节点影响输出时，其 adjoint 是各下游路径贡献之和；遗漏累加是计算图反传的常见错误。',
  },
  {
    id: 'backprop-finite-difference',
    difficulty: 3,
    prompt: '中心差分做梯度校验时，为什么不能把步长 ε 无限减小？',
    options: [
      { id: 'roundoff', label: '截断误差会下降，但浮点相消与舍入误差最终上升' },
      { id: 'derivative-zero', label: '所有函数在足够小 ε 下导数都会变成零' },
      { id: 'backprop-change', label: '减小 ε 会改变反向传播的解析公式' },
    ],
    correctOptionId: 'roundoff',
    hint: '教材图 8.2 的误差曲线先下降后上升。',
    explanation: '中心差分的截断误差是 O(ε²)，但两个极接近的函数值相减会放大舍入误差，因此存在合适的中间步长。',
  },
];

export const chapter05AutodiffExercises: LearningExercise[] = [
  {
    id: 'autodiff-mode-choice',
    difficulty: 1,
    prompt: '函数有 D=1,000,000 个输入和 K=1 个标量输出，只需要完整梯度时应优先用哪种自动微分模式？',
    options: [
      { id: 'reverse', label: '反向模式：约 K 次反向传播' },
      { id: 'forward', label: '前向模式：约 D 次前向传播' },
      { id: 'finite', label: '逐参数中心差分' },
    ],
    correctOptionId: 'reverse',
    hint: '完整 Jacobian 的前向模式成本按输入维度计，反向模式按输出维度计。',
    explanation: '标量损失只有一个输出，反向模式一次反传即可得到对所有输入（网络参数）的梯度。',
  },
  {
    id: 'autodiff-not-symbolic',
    difficulty: 2,
    prompt: '自动微分与符号微分最关键的区别是什么？',
    options: [
      { id: 'trace', label: '自动微分对执行轨迹传播数值导数，不必生成闭式导数表达式' },
      { id: 'finite', label: '自动微分通过给每个输入加一个有限扰动估计斜率' },
      { id: 'no-roundoff', label: '自动微分使用浮点数时完全不存在舍入误差' },
    ],
    correctOptionId: 'trace',
    hint: '区分“生成代数表达式”和“生成计算导数的代码”。',
    explanation: '自动微分复用中间变量并在实际执行轨迹上应用链式法则；它没有有限差分的截断误差，但仍受机器精度限制。',
  },
  {
    id: 'autodiff-memory',
    difficulty: 3,
    prompt: '为什么反向模式通常比前向模式占用更多内存？',
    options: [
      { id: 'primal-tape', label: '反向阶段需要读取前向中间 primal 值，因此通常要保存 tape' },
      { id: 'full-hessian', label: '反向模式总会显式保存完整 Hessian' },
      { id: 'all-data', label: '反向模式必须一次把整个训练集复制进显存' },
    ],
    correctOptionId: 'primal-tape',
    hint: '局部导数常依赖节点在前向阶段的输入或输出。',
    explanation: '反向遍历发生在前向结束后，中间值需保留或重新计算；检查点技术正是在内存和重算成本之间折中。',
  },
];
