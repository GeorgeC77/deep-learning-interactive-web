import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter13PcaExercises: LearningExercise[] = [
  {
    id: 'pca-centering', difficulty: 1,
    prompt: '在对协方差矩阵做 PCA 前，为什么通常必须先减去样本均值？',
    options: [
      { id: 'origin', label: '让主方向描述围绕数据中心的变化，而不是均值相对原点的偏移' },
      { id: 'labels', label: '让 PCA 自动获得类别标签' },
      { id: 'noise', label: '保证所有观测噪声严格为零' },
    ],
    correctOptionId: 'origin',
    hint: '协方差衡量的是相对均值的共同变化。',
    explanation: '不中心化时，二阶矩会混入均值方向，第一“主成分”可能只是在解释数据云离原点有多远。',
  },
  {
    id: 'pca-discarded-variance', difficulty: 2,
    prompt: '保留协方差矩阵最大的前 M 个特征值对应方向后，平均平方重构误差等于什么？',
    options: [
      { id: 'discarded', label: '被丢弃特征值之和' },
      { id: 'kept', label: '被保留特征值之和' },
      { id: 'largest', label: '最大特征值的平方' },
    ],
    correctOptionId: 'discarded',
    hint: '总方差被正交分解到所有特征方向，重构只能保留子空间内的部分。',
    explanation: '每个被舍弃的正交方向贡献其特征值大小的均方误差，因此最优 M 维子空间舍弃的是最小的 D−M 个特征值。',
  },
  {
    id: 'pca-whitening', difficulty: 3,
    prompt: 'PCA 白化把每个主成分除以其标准差。哪项是需要警惕的后果？',
    options: [
      { id: 'amplify', label: '很小特征值方向上的噪声可能被显著放大' },
      { id: 'labels', label: '白化会凭空生成监督标签' },
      { id: 'dimension', label: '白化必然把维度降为 1' },
    ],
    correctOptionId: 'amplify',
    hint: '考虑除以接近零的标准差会发生什么。',
    explanation: '白化统一各方向尺度，但对低方差方向的除法可能放大噪声，实践中常先截断小特征值或加入稳定项。',
  },
];

export const chapter13ProbabilisticExercises: LearningExercise[] = [
  {
    id: 'latent-marginal-covariance', difficulty: 1,
    prompt: '若 z~N(0,I)，x=Wz+μ+ε，ε~N(0,Ψ)，边缘分布 p(x) 的协方差是什么？',
    options: [
      { id: 'sum', label: 'WWᵀ+Ψ' },
      { id: 'loading', label: '只有 WWᵀ' },
      { id: 'noise', label: '只有 Ψ' },
    ],
    correctOptionId: 'sum',
    hint: '独立随机变量线性相加时，协方差也相加。',
    explanation: '潜变量经 W 映射贡献共享协方差 WWᵀ，独立观测噪声再贡献 Ψ。',
  },
  {
    id: 'fa-vs-ppca', difficulty: 2,
    prompt: '因子分析与概率 PCA 的关键噪声假设区别是什么？',
    options: [
      { id: 'diagonal', label: '因子分析允许对角 Ψ；概率 PCA 使用各向同性 σ²I' },
      { id: 'discrete', label: '因子分析只允许离散隐变量' },
      { id: 'nonlinear', label: '概率 PCA 必须使用非线性神经网络' },
    ],
    correctOptionId: 'diagonal',
    hint: '比较不同观测维度能否拥有各自的噪声方差。',
    explanation: '因子分析可以为每个观测维设置不同的独立噪声；PPCA 的 σ²I 更受约束，因此主子空间与经典 PCA 紧密对应。',
  },
  {
    id: 'ica-independence', difficulty: 3,
    prompt: '为什么仅让潜在分量互不相关，通常不足以完成 ICA 的盲源分离？',
    options: [
      { id: 'higher-order', label: '独立性比零相关更强，需要利用非高斯高阶统计信息' },
      { id: 'same', label: '零相关在所有分布下都严格等价于独立' },
      { id: 'labels', label: 'ICA 必须依赖人工类别标签' },
    ],
    correctOptionId: 'higher-order',
    hint: '只有联合高斯情形下，零相关才足以推出独立。',
    explanation: 'PCA 只去除二阶相关；ICA 借助非高斯性和高阶统计量识别统计独立的源。',
  },
];

export const chapter13ElboExercises: LearningExercise[] = [
  {
    id: 'elbo-gap', difficulty: 1,
    prompt: '恒等式 log p(x)=L(q)+KL(q(z)||p(z|x)) 说明 ELBO 与证据的差距是什么？',
    options: [
      { id: 'kl', label: 'q 与真实后验之间的 KL 散度' },
      { id: 'noise', label: '观测噪声方差本身' },
      { id: 'dimension', label: '观测维度与隐维度之差' },
    ],
    correctOptionId: 'kl',
    hint: 'KL 非负，因此 L(q) 才是下界。',
    explanation: '下界差距恰为 KL(q||p(z|x))；q 等于真实后验时 KL 为零，下界与 log p(x) 相切。',
  },
  {
    id: 'em-e-step', difficulty: 2,
    prompt: '在线性高斯模型的精确 E 步中，把 q(z) 设为什么会使当前参数下的 ELBO 最紧？',
    options: [
      { id: 'posterior', label: '当前参数下的真实后验 p(z|x)' },
      { id: 'prior', label: '无论数据为何都固定为先验 p(z)' },
      { id: 'point', label: '任意一个与数据无关的点质量' },
    ],
    correctOptionId: 'posterior',
    hint: '要让 ELBO 差距为零，应让 KL 的两个分布一致。',
    explanation: 'E 步令 q 等于当前后验，使 KL 归零；M 步再固定 q 提升完整数据对数似然的期望。',
  },
  {
    id: 'ppca-shrinkage', difficulty: 3,
    prompt: '固定载荷 W，增大 PPCA 的各向同性噪声 σ²，隐变量后验均值通常如何变化？',
    options: [
      { id: 'shrink', label: '向先验均值 0 收缩，后验不确定性增大' },
      { id: 'expand', label: '绝对值无限增大，后验方差趋于 0' },
      { id: 'unchanged', label: '均值和方差都完全不变' },
    ],
    correctOptionId: 'shrink',
    hint: '噪声越大，单个观测对隐变量提供的信息越少。',
    explanation: '更大的 σ² 降低似然精度，后验更多回到 N(0,I) 先验：均值收缩、方差回升。',
  },
];

export const chapter13NonlinearExercises: LearningExercise[] = [
  {
    id: 'flow-invertibility', difficulty: 1,
    prompt: 'Normalizing Flow 为什么通常要求隐空间与数据空间维度相同且映射可逆？',
    options: [
      { id: 'jacobian', label: '为了用变量替换公式和 Jacobian 行列式精确计算密度' },
      { id: 'labels', label: '为了获得监督标签' },
      { id: 'noise', label: '为了让数据不含任何随机性' },
    ],
    correctOptionId: 'jacobian',
    hint: '精确似然需要从 x 唯一回到 z，并校正体积变化。',
    explanation: '可逆同维映射让 z=f⁻¹(x) 唯一存在，密度可通过 p(z)|det J| 精确求值。',
  },
  {
    id: 'vae-likelihood', difficulty: 2,
    prompt: 'VAE 面对难解的 p(x)=∫p(x|z)p(z)dz 时采用什么策略？',
    options: [
      { id: 'elbo', label: '用编码器 q(z|x) 构造并优化 ELBO' },
      { id: 'exact', label: '声称该积分对任意神经网络都有闭式解' },
      { id: 'discriminator', label: '只训练判别器且完全不定义解码似然' },
    ],
    correctOptionId: 'elbo',
    hint: 'VAE 中编码器承担摊销近似推断。',
    explanation: 'VAE 通过 q(z|x) 近似后验，把难解证据替换为可优化的下界；它并不声称直接得到精确 log p(x)。',
  },
  {
    id: 'four-approaches', difficulty: 3,
    prompt: '若任务同时强调精确归一化似然和非迭代采样，四类方法中最符合的是哪一个？',
    options: [
      { id: 'flow', label: 'Normalizing Flow' },
      { id: 'gan', label: 'GAN' },
      { id: 'diffusion', label: 'Diffusion' },
    ],
    correctOptionId: 'flow',
    hint: 'GAN 不提供显式似然；Diffusion 通常需要多步去噪采样。',
    explanation: 'Flow 以可逆网络换取精确似然和直接变换采样；代价是同维可逆结构限制。',
  },
];
