import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter03LimitationsExercises: LearningExercise[] = [
  {
    id: 'limitations-basis-count',
    difficulty: 1,
    prompt: '每个输入维度放置 K 个网格基函数，D 维直积网格需要多少个基函数？',
    options: [
      { id: 'exponential', label: 'Kᴰ 个' },
      { id: 'linear', label: 'K×D 个' },
      { id: 'constant', label: '始终只需 K 个' },
    ],
    correctOptionId: 'exponential',
    hint: '每增加一个维度，都要把已有组合与该维度的 K 个位置配对。',
    explanation: '直积网格的组合数相乘，因此是 Kᴰ，这正是维度灾难的基本计数来源。',
  },
  {
    id: 'limitations-distance',
    difficulty: 2,
    prompt: '高维独立高斯点云中，点间距离最典型的变化是什么？',
    options: [
      { id: 'relative-concentration', label: '平均距离增大，但距离相对平均值的波动缩小' },
      { id: 'all-zero', label: '所有距离都趋近于 0' },
      { id: 'exact-equality', label: '有限维时所有距离严格相等' },
    ],
    correctOptionId: 'relative-concentration',
    hint: '区分绝对尺度与标准差/均值。',
    explanation: '许多坐标差的平方相加使距离尺度增大，同时集中现象使相对离散度下降。',
  },
  {
    id: 'limitations-manifold',
    difficulty: 3,
    prompt: '流形假设为何可能缓解环境维度很高带来的样本需求？',
    options: [
      { id: 'intrinsic', label: '数据变化可能主要由少量内在自由度控制' },
      { id: 'all-data', label: '它断言所有高维向量都同样可能出现' },
      { id: 'no-learning', label: '它使模型不再需要从数据学习表示' },
    ],
    correctOptionId: 'intrinsic',
    hint: '自然图像的像素维度很高，但有效变化因素可能少得多。',
    explanation: '若数据靠近低维结构，模型可围绕内在自由度学习，而不必均匀覆盖整个环境空间。',
  },
];

export const chapter03MultilayerExercises: LearningExercise[] = [
  {
    id: 'multilayer-shape',
    difficulty: 1,
    prompt: '若上一层有 Mₗ₋₁ 个单元、当前层有 Mₗ 个单元，W⁽ˡ⁾ 的形状是什么？',
    options: [
      { id: 'correct', label: 'Mₗ × Mₗ₋₁' },
      { id: 'reverse', label: 'Mₗ₋₁ × Mₗ' },
      { id: 'square', label: '一定是 Mₗ × Mₗ' },
    ],
    correctOptionId: 'correct',
    hint: 'W⁽ˡ⁾a⁽ˡ⁻¹⁾ 的输出长度应为 Mₗ。',
    explanation: '矩阵的列数匹配输入长度 Mₗ₋₁，行数决定输出长度 Mₗ。',
  },
  {
    id: 'multilayer-nonlinearity',
    difficulty: 2,
    prompt: '为什么多层网络不能只堆叠线性层而不加非线性激活？',
    options: [
      { id: 'collapse', label: '多个仿射变换仍可合并成一个仿射变换' },
      { id: 'gradient', label: '线性层完全无法计算梯度' },
      { id: 'parameters', label: '线性层不含任何参数' },
    ],
    correctOptionId: 'collapse',
    hint: '展开 W₂(W₁x+b₁)+b₂。',
    explanation: '不加非线性时，矩阵乘积和合并后的偏置仍只定义一个仿射映射，深度不增加函数类型。',
  },
  {
    id: 'multilayer-symmetry',
    difficulty: 3,
    prompt: '把同一隐藏层的两个单元对调，要保持网络函数不变还必须做什么？',
    options: [
      { id: 'connections', label: '同步对调它们的输入权重、偏置及下一层对应的输出连接' },
      { id: 'labels', label: '交换训练集中的类别标签' },
      { id: 'loss', label: '把损失函数改成平方误差' },
    ],
    correctOptionId: 'connections',
    hint: '隐藏单元没有固定身份，关键是保持连接关系。',
    explanation: '完整置换隐藏单元及其相邻连接只改变参数坐标，不改变网络计算的函数。',
  },
];

export const chapter03DeepExercises: LearningExercise[] = [
  {
    id: 'deep-hierarchy',
    difficulty: 1,
    prompt: '层次化表示的核心机制是什么？',
    options: [
      { id: 'composition', label: '后层复用并组合前层形成的中间特征' },
      { id: 'raw-only', label: '每一层都只读取原始输入且互不联系' },
      { id: 'one-hot', label: '每个概念必须由唯一单元独占表示' },
    ],
    correctOptionId: 'composition',
    hint: '思考“边缘→部件→物体”的组合链。',
    explanation: '层次化表示通过组合可复用的中间结构表达复杂函数，这是深度可能带来效率优势的来源。',
  },
  {
    id: 'deep-distributed',
    difficulty: 2,
    prompt: '分布式表示与局部 one-hot 表示的关键区别是什么？',
    options: [
      { id: 'pattern', label: '一个概念由多个表示单元的联合激活模式编码' },
      { id: 'single', label: '每个概念只能激活一个固定单元' },
      { id: 'labels', label: '它必须依赖人工类别标签才能存在' },
    ],
    correctOptionId: 'pattern',
    hint: '同一个单元可以参与多个概念的编码。',
    explanation: '联合模式允许共享属性和组合编码，但其容量与鲁棒性仍取决于学到的结构，不是自动保证。',
  },
  {
    id: 'deep-transfer',
    difficulty: 3,
    prompt: '目标域与预训练域差异很大时，更合理的迁移策略是什么？',
    options: [
      { id: 'validate', label: '比较冻结、分层解冻和全量微调，并用目标域验证集选择' },
      { id: 'freeze', label: '无条件冻结所有预训练层' },
      { id: 'discard-data', label: '不使用任何目标域数据，直接部署' },
    ],
    correctOptionId: 'validate',
    hint: '可迁移程度不是预先恒定的，需要目标域证据。',
    explanation: '域差异会改变哪些特征可复用；分层实验与验证能在过拟合风险和适应能力之间做选择。',
  },
];

export const chapter03ErrorExercises: LearningExercise[] = [
  {
    id: 'error-regression',
    difficulty: 1,
    prompt: '固定方差的高斯观测模型，其负对数似然对应哪类回归损失？',
    options: [
      { id: 'squared', label: '平方误差' },
      { id: 'zero-one', label: '0-1 损失' },
      { id: 'hinge', label: '合页损失' },
    ],
    correctOptionId: 'squared',
    hint: '高斯指数项包含残差的平方。',
    explanation: '去掉与参数无关的常数后，高斯负对数似然与残差平方和成正比。',
  },
  {
    id: 'error-logit-gradient',
    difficulty: 2,
    prompt: '二分类交叉熵对 sigmoid logit a 的导数是什么？',
    options: [
      { id: 'residual', label: 'σ(a)-t' },
      { id: 'probability-gradient', label: '-t/σ(a)' },
      { id: 'zero', label: '恒为 0' },
    ],
    correctOptionId: 'residual',
    hint: '对概率的导数还要乘 sigmoid 的导数。',
    explanation: '链式法则约掉分母后得到概率残差 σ(a)-t，这才是反传到 logit 的训练信号。',
  },
  {
    id: 'error-softmax',
    difficulty: 3,
    prompt: 'softmax 交叉熵为何适合互斥多分类？',
    options: [
      { id: 'categorical', label: '它产生和为 1 的类别分布，并对应类别分布的负对数似然' },
      { id: 'independent', label: '它把每个类别当成彼此独立且可同时为真的事件' },
      { id: 'unbounded', label: '它允许类别概率为任意负数' },
    ],
    correctOptionId: 'categorical',
    hint: '互斥类别只会有一个目标分量为 1。',
    explanation: 'softmax 将 logits 归一化为类别分布，one-hot 交叉熵就是正确类别概率的负对数。',
  },
];

export const chapter03MdnExercises: LearningExercise[] = [
  {
    id: 'mdn-constraints',
    difficulty: 1,
    prompt: 'MDN 的混合权重和标准差通常分别用什么输出变换保证合法？',
    options: [
      { id: 'softmax-positive', label: '权重用 softmax；标准差用 exp 或 softplus' },
      { id: 'identity', label: '两者都直接使用无约束线性输出' },
      { id: 'argmax', label: '权重与标准差都用 argmax' },
    ],
    correctOptionId: 'softmax-positive',
    hint: '权重需非负且和为 1，尺度需严格为正。',
    explanation: 'softmax满足单纯形约束，exp/softplus 保证正尺度，从而得到合法混合密度。',
  },
  {
    id: 'mdn-mean',
    difficulty: 2,
    prompt: '两个等权、窄高斯分量的均值分别为 -2 和 2，条件均值是多少？',
    options: [
      { id: 'zero', label: '0' },
      { id: 'minus-two', label: '-2' },
      { id: 'two', label: '2' },
    ],
    correctOptionId: 'zero',
    hint: '计算 Σₖπₖμₖ。',
    explanation: '条件均值是 0，但密度峰值在 ±2 附近；这说明均值可能不是多峰分布中的典型解。',
  },
  {
    id: 'mdn-objective',
    difficulty: 3,
    prompt: '训练 MDN 时为什么要使用 log-sum-exp 等稳定计算？',
    options: [
      { id: 'underflow', label: '多个很小的加权密度直接求和再取对数可能下溢' },
      { id: 'normalize-data', label: '它会自动保证训练数据每列均值为零' },
      { id: 'remove-modes', label: '它的目的是强制混合只剩一个分量' },
    ],
    correctOptionId: 'underflow',
    hint: '高维或远离均值时，高斯密度可能极小。',
    explanation: '在对数域聚合各分量能避免数值下溢，并保持负对数似然与梯度可计算。',
  },
];
