import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter04ErrorSurfaceExercises: LearningExercise[] = [
  {
    id: 'error-surface-eigenvalues',
    difficulty: 1,
    prompt: '驻点处 Hessian 的特征值为 2 和 -0.5，该驻点是什么类型？',
    options: [
      { id: 'saddle', label: '鞍点' },
      { id: 'minimum', label: '严格局部极小值' },
      { id: 'maximum', label: '严格局部极大值' },
    ],
    correctOptionId: 'saddle',
    hint: '沿两个特征向量方向分别观察二次项的符号。',
    explanation: '一正一负的特征值表示沿一个方向损失上升、另一个方向下降，因此是鞍点。',
  },
  {
    id: 'error-surface-stability',
    difficulty: 2,
    prompt: '正定二次损失的最大 Hessian 特征值为 8，固定步长梯度下降的稳定区间是什么？',
    options: [
      { id: 'correct', label: '0 < η < 0.25' },
      { id: 'half', label: '0 < η < 0.5' },
      { id: 'all-positive', label: '任意 η > 0 都稳定' },
    ],
    correctOptionId: 'correct',
    hint: '每个特征方向的乘子是 1-ηλ，需要其绝对值小于 1。',
    explanation: '最陡方向要求 |1-8η|<1，因此 0<η<2/8=0.25；等号处只会临界振荡。',
  },
  {
    id: 'error-surface-conditioning',
    difficulty: 3,
    prompt: '正定 Hessian 的特征值从 0.1 到 10。为什么单一学习率会导致窄谷中的慢收敛？',
    options: [
      { id: 'condition', label: '稳定性由大曲率限制，而小曲率方向每步进展很小' },
      { id: 'zero-gradient', label: '所有位置的梯度都严格为零' },
      { id: 'no-minimum', label: '正定 Hessian 表示不存在极小值' },
    ],
    correctOptionId: 'condition',
    hint: '这里的条件数是 10/0.1=100。',
    explanation: '学习率必须照顾 λ=10 的陡峭方向；同一小步长作用在 λ=0.1 的平缓方向时收缩很慢。',
  },
];

export const chapter04GradientDescentExercises: LearningExercise[] = [
  {
    id: 'gradient-batch-error',
    difficulty: 1,
    prompt: '若独立样本梯度的标准差固定，把 mini-batch 大小扩大 100 倍，均值估计的标准误约变为多少？',
    options: [
      { id: 'tenth', label: '原来的 1/10' },
      { id: 'hundredth', label: '原来的 1/100' },
      { id: 'same', label: '完全不变' },
    ],
    correctOptionId: 'tenth',
    hint: '均值的标准误按 1/√B 缩放。',
    explanation: 'B 扩大 100 倍只让标准误缩小 √100=10 倍，说明增大 batch 存在统计收益递减。',
  },
  {
    id: 'gradient-zero-init',
    difficulty: 2,
    prompt: '同一隐藏层所有单元的权重都初始化为相同值，会发生什么？',
    options: [
      { id: 'symmetry', label: '单元收到相同梯度并保持冗余，无法分化学习' },
      { id: 'perfect', label: '网络会自动获得最优特征' },
      { id: 'no-forward', label: '前向传播在数学上无法计算' },
    ],
    correctOptionId: 'symmetry',
    hint: '相同输入、参数和更新会保持置换对称。',
    explanation: '随机初始化的重要作用之一是打破隐藏单元对称性，而不仅是让参数非零。',
  },
  {
    id: 'gradient-he-init',
    difficulty: 3,
    prompt: '一个 ReLU 单元有 M 个独立、同尺度输入。He 初始化的权重标准差通常取多少？',
    options: [
      { id: 'he', label: '√(2/M)' },
      { id: 'inverse', label: '1/M²' },
      { id: 'constant', label: '与 M 无关的常数' },
    ],
    correctOptionId: 'he',
    hint: 'ReLU 约保留一半二阶矩，需要补偿这个 1/2 因子。',
    explanation: '令前后层激活尺度大致稳定可得权重方差 2/M，因此标准差为 √(2/M)。',
  },
];

export const chapter04ConvergenceExercises: LearningExercise[] = [
  {
    id: 'convergence-direction-factor',
    difficulty: 1,
    prompt: '二次损失某特征方向的曲率 λ=4、学习率 η=0.2。一次更新后该方向误差乘以多少？',
    options: [
      { id: 'point-two', label: '0.2' },
      { id: 'point-eight', label: '0.8' },
      { id: 'one-two', label: '1.2' },
    ],
    correctOptionId: 'point-two',
    hint: '使用 α_new=(1-ηλ)α_old。',
    explanation: '1-0.2×4=0.2，幅度收缩且不改变符号；若该因子为负则会跨谷振荡。',
  },
  {
    id: 'convergence-momentum',
    difficulty: 2,
    prompt: '经典动量 vₜ=μvₜ₋₁+g 在恒定梯度下，稳态梯度累积因子是多少？',
    options: [
      { id: 'classical', label: '1/(1-μ)' },
      { id: 'ema', label: '始终为 1' },
      { id: 'mu', label: 'μ' },
    ],
    correctOptionId: 'classical',
    hint: '求几何级数 1+μ+μ²+⋯。',
    explanation: '经典约定的稳态是 g/(1-μ)；若更新写成 μv+(1-μ)g，稳态尺度才是 g。',
  },
  {
    id: 'convergence-adam-bias',
    difficulty: 3,
    prompt: 'Adam 为什么在训练早期对一阶、二阶矩使用偏差修正？',
    options: [
      { id: 'zero-init', label: '移动平均从零初始化，早期会系统性偏向零' },
      { id: 'labels', label: '用于修正类别标签噪声' },
      { id: 'batch', label: '用于把 batch 大小强制改成 1' },
    ],
    correctOptionId: 'zero-init',
    hint: '考察 m₀=v₀=0 对前几步移动平均的影响。',
    explanation: '除以 1-β₁ᵗ 和 1-β₂ᵗ 可补偿零初始化造成的早期缩小偏差。',
  },
];

export const chapter04NormalizationExercises: LearningExercise[] = [
  {
    id: 'normalization-axis',
    difficulty: 1,
    prompt: '对形状为“batch × features”的激活，BatchNorm 与 LayerNorm 分别沿哪个方向统计？',
    options: [
      { id: 'correct', label: 'BatchNorm 对每个特征跨样本；LayerNorm 对每个样本跨特征' },
      { id: 'reverse', label: 'BatchNorm 跨特征；LayerNorm 跨样本' },
      { id: 'same', label: '两者始终使用完全相同的统计轴' },
    ],
    correctOptionId: 'correct',
    hint: '教材图 7.8 对比了横跨 mini-batch 与横跨 hidden units。',
    explanation: 'BatchNorm 的统计依赖 mini-batch；LayerNorm 的统计在单个样本内部完成。',
  },
  {
    id: 'normalization-inference',
    difficulty: 2,
    prompt: '标准 BatchNorm 在推理时通常使用什么均值和方差？',
    options: [
      { id: 'running', label: '训练期间累计的移动统计量' },
      { id: 'single', label: '只由当前单个样本估计' },
      { id: 'test-set', label: '先用整个测试集重新拟合' },
    ],
    correctOptionId: 'running',
    hint: '推理时可能一次只处理一个样本。',
    explanation: '训练移动统计量让单个样本的预测不依赖它与哪些其他样本被放在同一批中。',
  },
  {
    id: 'normalization-leakage',
    difficulty: 3,
    prompt: '输入标准化时，验证集和测试集应该使用哪组统计量？',
    options: [
      { id: 'train', label: '只用训练集估计的均值与标准差' },
      { id: 'own', label: '分别用验证集和测试集自身统计量' },
      { id: 'all', label: '先合并所有数据再计算统计量' },
    ],
    correctOptionId: 'train',
    hint: '预处理参数也是从数据中学习出的信息。',
    explanation: '用验证或测试数据估计预处理统计量会造成信息泄漏；应拟合于训练集并原样应用。',
  },
];
