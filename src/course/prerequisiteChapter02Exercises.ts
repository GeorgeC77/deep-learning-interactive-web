import type { LearningExercise } from '@/components/ExercisePanel';

export const prerequisiteChapter02RulesExercises: LearningExercise[] = [
  {
    id: 'pre02-rules-screening', difficulty: 1,
    prompt: '患病率 1%、灵敏度 90%、假阳性率 3% 时，阳性后的患病概率最接近哪一项？',
    options: [
      { id: '23', label: '23%' }, { id: '90', label: '90%' }, { id: '97', label: '97%' },
    ],
    correctOptionId: '23',
    hint: '分别计算真阳性 0.01×0.90 与假阳性 0.99×0.03。',
    explanation: '后验为 0.009/(0.009+0.0297)≈23.3%。低先验使假阳性在全部阳性中占很大比例。',
  },
  {
    id: 'pre02-rules-sum', difficulty: 2,
    prompt: '若 Y 的取值互斥且穷尽，怎样从联合分布得到 p(X)？',
    options: [
      { id: 'sum', label: '对所有 Y 求和：p(X)=Σᵧp(X,Y)' },
      { id: 'divide', label: '用 p(X,Y) 除以 p(Y)' },
      { id: 'max', label: '只取最大的 p(X,Y)' },
    ],
    correctOptionId: 'sum',
    hint: '边缘化要把所有可能但未观测的情形合并。',
    explanation: '互斥情形的概率可以相加；对 Y 的全部取值求和，就消去了 Y。',
  },
  {
    id: 'pre02-rules-independence', difficulty: 3,
    prompt: 'X 与 Y 独立时，下列哪组关系必须同时成立？',
    options: [
      { id: 'factor', label: 'p(X,Y)=p(X)p(Y)，且 p(X|Y)=p(X)' },
      { id: 'equal', label: 'p(X)=p(Y)' },
      { id: 'exclusive', label: 'p(X,Y)=0' },
    ],
    correctOptionId: 'factor',
    hint: '独立表示知道 Y 不会改变对 X 的信念。',
    explanation: '独立性等价于联合分布可因子分解；它不要求两变量同分布，也不表示事件互斥。',
  },
];

export const prerequisiteChapter02DensitiesExercises: LearningExercise[] = [
  {
    id: 'pre02-density-point', difficulty: 1,
    prompt: '对连续随机变量 X，单点事件 X=x 的概率通常是多少？',
    options: [
      { id: 'zero', label: '0；概率要由区间上的密度积分得到' },
      { id: 'density', label: '恰好等于 p(x)' },
      { id: 'one', label: '1，因为 x 已经给定' },
    ],
    correctOptionId: 'zero',
    hint: '密度可以大于 1，但概率不能；两者不是同一个量。',
    explanation: '连续变量的单点没有宽度，因此概率为 0；p(x) 表示单位长度附近的概率浓度。',
  },
  {
    id: 'pre02-density-expectation', difficulty: 2,
    prompt: '无论 X、Y 是否独立，E[aX+bY] 等于什么？',
    options: [
      { id: 'linear', label: 'aE[X]+bE[Y]' },
      { id: 'product', label: 'abE[XY]' },
      { id: 'independent-only', label: '只有独立时才可化简' },
    ],
    correctOptionId: 'linear',
    hint: '期望的线性不需要独立性假设。',
    explanation: '积分或求和本身是线性运算，因此期望的线性对任意联合分布都成立。',
  },
  {
    id: 'pre02-density-covariance', difficulty: 3,
    prompt: 'Cov[X,Y]=0 能否推出 X 与 Y 独立？',
    options: [
      { id: 'not-general', label: '一般不能；零协方差只排除线性相关' },
      { id: 'always', label: '总能，因为没有任何关系' },
      { id: 'never', label: '任何分布下都绝不可能独立' },
    ],
    correctOptionId: 'not-general',
    hint: '考虑 Y=X² 且 X 关于 0 对称。',
    explanation: '零协方差不排除非线性依赖；联合高斯是“零协方差推出独立”的重要特殊情形。',
  },
];

export const prerequisiteChapter02GaussianExercises: LearningExercise[] = [
  {
    id: 'pre02-gaussian-shape', difficulty: 1,
    prompt: '一维高斯的标准差 σ 增大时，密度曲线如何变化？',
    options: [
      { id: 'wide', label: '变宽、峰值降低，但积分仍为 1' },
      { id: 'shift', label: '整体向右平移' },
      { id: 'mass', label: '总概率随 σ 增大' },
    ],
    correctOptionId: 'wide',
    hint: '归一化常数含有 1/σ。',
    explanation: '更大的 σ 把同样的概率质量摊到更宽范围，中心峰值相应降低。',
  },
  {
    id: 'pre02-gaussian-mle', difficulty: 2,
    prompt: '高斯均值的最大似然估计是什么？',
    options: [
      { id: 'mean', label: '样本均值 (1/N)Σxₙ' },
      { id: 'median', label: '样本中位数' },
      { id: 'variance', label: '样本方差' },
    ],
    correctOptionId: 'mean',
    hint: '对数似然关于 μ 求导，并令其为 0。',
    explanation: '高斯负对数似然关于 μ 是平方误差，其驻点就是样本均值。',
  },
  {
    id: 'pre02-gaussian-bias', difficulty: 3,
    prompt: '为什么用 1/N 计算的高斯方差最大似然估计会低估总体方差？',
    options: [
      { id: 'mean-fit', label: '同一批数据还用于估计均值，消耗了一个自由度' },
      { id: 'gaussian-false', label: '因为高斯密度没有归一化' },
      { id: 'variance-negative', label: '因为方差可能为负' },
    ],
    correctOptionId: 'mean-fit',
    hint: '样本到样本均值的离差和必为 0。',
    explanation: '拟合样本均值让残差被系统性压小；用 N−1 作分母可得到常见的无偏样本方差。',
  },
];

export const prerequisiteChapter02TransformationExercises: LearningExercise[] = [
  {
    id: 'pre02-transform-scale', difficulty: 1,
    prompt: '令 Y=2X。若 X 的密度为 pₓ，Y 的密度应写成什么？',
    options: [
      { id: 'half', label: 'pᵧ(y)=pₓ(y/2)/2' },
      { id: 'double', label: 'pᵧ(y)=2pₓ(2y)' },
      { id: 'same', label: 'pᵧ(y)=pₓ(y)' },
    ],
    correctOptionId: 'half',
    hint: '长度拉伸两倍，单位长度内的概率质量就减半。',
    explanation: '逆变换 x=y/2 的导数绝对值为 1/2，这保证变换后密度仍积分为 1。',
  },
  {
    id: 'pre02-transform-absolute', difficulty: 2,
    prompt: '一元密度变换公式为什么要取导数的绝对值？',
    options: [
      { id: 'nonnegative', label: '方向翻转不应产生负密度，局部长度缩放始终非负' },
      { id: 'differentiable', label: '为了让所有函数都可导' },
      { id: 'mean', label: '为了保持均值不变' },
    ],
    correctOptionId: 'nonnegative',
    hint: '考虑 y=−x。',
    explanation: 'Jacobian 的符号只代表方向；概率质量按体积大小变换，所以必须使用绝对值。',
  },
  {
    id: 'pre02-transform-many', difficulty: 3,
    prompt: '若 y=g(x) 不是一一映射，计算 pᵧ(y) 时还要做什么？',
    options: [
      { id: 'branches', label: '对所有满足 g(xᵢ)=y 的逆像分支求和' },
      { id: 'one', label: '任取一个逆像即可' },
      { id: 'discard', label: '直接把密度设为 0' },
    ],
    correctOptionId: 'branches',
    hint: '不同 x 区域可能被折叠到同一个 y。',
    explanation: '每个逆像分支都向 y 附近贡献概率质量，必须逐项乘 Jacobian 再相加。',
  },
];

export const prerequisiteChapter02InformationExercises: LearningExercise[] = [
  {
    id: 'pre02-info-entropy', difficulty: 1,
    prompt: '二元变量在 p=0.5 时为什么熵最大？',
    options: [
      { id: 'uncertain', label: '两个结果同样可能，观测前最不确定' },
      { id: 'certain', label: '结果已经完全确定' },
      { id: 'negative', label: '此时概率为负' },
    ],
    correctOptionId: 'uncertain',
    hint: '比较 p=0、0.5、1 时猜中结果的难度。',
    explanation: '等概率时最难预测；当 p 接近 0 或 1 时结果趋于确定，熵随之下降。',
  },
  {
    id: 'pre02-info-kl', difficulty: 2,
    prompt: '关于 KL(p‖q)，哪项陈述正确？',
    options: [
      { id: 'asymmetric', label: '非负且通常不对称，因此不是距离度量' },
      { id: 'symmetric', label: '总有 KL(p‖q)=KL(q‖p)' },
      { id: 'negative', label: '可以取任意负值' },
    ],
    correctOptionId: 'asymmetric',
    hint: '交换“真实分布”和“近似分布”的角色会改变加权方式。',
    explanation: 'KL 散度非负且相等仅在两分布几乎处处相同，但它一般不满足对称性与三角不等式。',
  },
  {
    id: 'pre02-info-mutual', difficulty: 3,
    prompt: '互信息 I(X;Y)=0 表示什么？',
    options: [
      { id: 'independent', label: '联合分布分解为 p(X)p(Y)，两变量独立' },
      { id: 'equal', label: 'X 与 Y 的数值总相等' },
      { id: 'constant', label: 'X 和 Y 都必须是常数' },
    ],
    correctOptionId: 'independent',
    hint: '互信息是联合分布与边缘乘积之间的 KL 散度。',
    explanation: 'I(X;Y)=KL(p(X,Y)‖p(X)p(Y))，为 0 当且仅当联合分布等于边缘分布的乘积。',
  },
];

export const prerequisiteChapter02BayesianExercises: LearningExercise[] = [
  {
    id: 'pre02-bayes-update', difficulty: 1,
    prompt: '贝叶斯参数学习中，后验分布与哪两项成正比？',
    options: [
      { id: 'likelihood-prior', label: '似然 × 先验' },
      { id: 'loss-data', label: '损失 × 数据量' },
      { id: 'posterior-evidence', label: '后验 × 证据' },
    ],
    correctOptionId: 'likelihood-prior',
    hint: '证据负责归一化，不依赖待推断参数。',
    explanation: 'p(θ|D)=p(D|θ)p(θ)/p(D)；对 θ 而言，后验正比于似然乘先验。',
  },
  {
    id: 'pre02-bayes-map', difficulty: 2,
    prompt: '高斯零均值权重先验的 MAP 估计通常对应哪种正则化？',
    options: [
      { id: 'l2', label: 'L2 权重衰减' }, { id: 'l1', label: 'L1 稀疏惩罚' }, { id: 'none', label: '不产生任何惩罚' },
    ],
    correctOptionId: 'l2',
    hint: '高斯先验的负对数与权重平方成正比。',
    explanation: '最大化后验等价于最小化负对数似然加上 −log p(θ)，高斯先验给出二次惩罚。',
  },
  {
    id: 'pre02-bayes-predictive', difficulty: 3,
    prompt: '贝叶斯预测分布为何要对参数 θ 积分？',
    options: [
      { id: 'uncertainty', label: '把后验中的参数不确定性传播到预测中' },
      { id: 'pick', label: '为了只保留一个最大似然参数' },
      { id: 'normalize-data', label: '为了改变训练样本数量' },
    ],
    correctOptionId: 'uncertainty',
    hint: '比较 p(t*|x*,θ̂) 与 ∫p(t*|x*,θ)p(θ|D)dθ。',
    explanation: '积分相当于按后验可信度平均所有参数设置，避免把单个点估计当成完全确定。',
  },
];
