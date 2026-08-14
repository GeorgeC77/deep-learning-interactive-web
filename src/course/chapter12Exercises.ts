import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter12KMeansExercises: LearningExercise[] = [
  {
    id: 'kmeans-distortion', difficulty: 1,
    prompt: '一维样本为 0、1、5，当前质心为 0 和 4。按最近质心分配后，失真 J 是多少？',
    options: [{ id: 'correct', label: '2' }, { id: 'three', label: '3' }, { id: 'six', label: '6' }],
    correctOptionId: 'correct', hint: '分别计算三个样本到最近质心的平方距离。',
    explanation: '三个贡献依次为 (0−0)²=0、(1−0)²=1、(5−4)²=1，所以 J=2。',
  },
  {
    id: 'kmeans-centroid-update', difficulty: 2,
    prompt: '某簇内的一维样本为 1、3、8。固定分配时，使平方距离和最小的质心是多少？',
    options: [{ id: 'correct', label: '4' }, { id: 'median', label: '3' }, { id: 'midrange', label: '4.5' }],
    correctOptionId: 'correct', hint: '对质心 μ 求导，令 2Σ(μ−xₙ)=0。',
    explanation: '平方损失的最优代表是算术均值，因此 μ=(1+3+8)/3=4；中位数对应绝对值损失。',
  },
  {
    id: 'kmeans-limit', difficulty: 3,
    prompt: '关于 K-means 的收敛与结果，下列哪项正确？',
    options: [{ id: 'correct', label: '目标单调不增，但结果依赖初始化且可能只是局部最优' }, { id: 'global', label: '有限步收敛意味着一定得到全局最优' }, { id: 'outlier', label: '平方距离使算法天然抵抗异常值' }],
    correctOptionId: 'correct', hint: '区分“每步不变差”与“找到全局最优”。',
    explanation: '交替最小化保证失真不增；可能的硬分配有限，所以会稳定，但不同初始化可落在不同固定点，异常值还会强烈拉动均值。',
  },
];

export const chapter12GmmExercises: LearningExercise[] = [
  {
    id: 'gmm-responsibility', difficulty: 1,
    prompt: '两个分量在某点的未归一化贡献 πₖNₖ(x) 分别为 0.2 和 0.3。第一个分量的责任度是多少？',
    options: [{ id: 'correct', label: '0.4' }, { id: 'point-two', label: '0.2' }, { id: 'two-thirds', label: '2/3' }],
    correctOptionId: 'correct', hint: '用该分量贡献除以所有分量贡献之和。',
    explanation: 'γ₁=0.2/(0.2+0.3)=0.4；责任度是给定 x 后的后验概率，而不是单独的先验或似然。',
  },
  {
    id: 'gmm-moments', difficulty: 2,
    prompt: '权重均为 0.5、均值分别为 −2 和 2 的两个高斯分量，其混合均值是多少？',
    options: [{ id: 'correct', label: '0' }, { id: 'minus-two', label: '−2' }, { id: 'four', label: '4' }],
    correctOptionId: 'correct', hint: '混合均值是各分量均值按 πₖ 加权的和。',
    explanation: 'E[X]=Σπₖμₖ=0.5×(−2)+0.5×2=0；混合方差还要包含分量均值之间的离散程度。',
  },
  {
    id: 'gmm-singularity', difficulty: 3,
    prompt: '为什么无约束 GMM 的最大似然可能出现奇异点？',
    options: [{ id: 'correct', label: '一个分量可把均值对准样本并令协方差趋零，使密度峰值无界' }, { id: 'labels', label: '只因为交换分量标签会改变数据似然' }, { id: 'weights', label: '因为混合权重不能归一化' }],
    correctOptionId: 'correct', hint: '考察高斯密度在均值处随协方差行列式趋零的行为。',
    explanation: '分量塌缩到单个数据点时，高斯密度可趋于无穷，似然因此无上界。标签交换不改变密度，是另一种不可识别性。',
  },
];

export const chapter12EmExercises: LearningExercise[] = [
  {
    id: 'em-step-order', difficulty: 1,
    prompt: '一次标准 GMM-EM 迭代的正确顺序是什么？',
    options: [{ id: 'correct', label: '用旧参数算责任度，再用这些责任度更新参数' }, { id: 'reverse', label: '先更新参数，再计算旧参数的责任度' }, { id: 'hard', label: '先把每个责任度强制变成 0 或 1' }],
    correctOptionId: 'correct', hint: 'E-step 先形成关于隐变量的后验，M-step 再优化参数。',
    explanation: 'E-step 固定 θ_old 计算 γₙₖ；M-step 固定 γₙₖ 更新 π、μ、Σ。混用新旧量会破坏标准 EM 的下界论证。',
  },
  {
    id: 'em-effective-count', difficulty: 2,
    prompt: '若某分量对四个样本的责任度为 0.8、0.6、0.4、0.2，则有效样本数 Nₖ 是多少？',
    options: [{ id: 'correct', label: '2.0' }, { id: 'four', label: '4' }, { id: 'half', label: '0.5' }],
    correctOptionId: 'correct', hint: 'Nₖ=Σₙγₙₖ。',
    explanation: 'Nₖ=0.8+0.6+0.4+0.2=2。新混合权重为 πₖ=Nₖ/N=0.5。',
  },
  {
    id: 'em-kmeans-bernoulli', difficulty: 3,
    prompt: '下列哪项同时正确描述 K-means 极限与 Bernoulli 混合？',
    options: [{ id: 'correct', label: '等方差球形 GMM 的方差趋零时责任度趋硬；Bernoulli 混合的 M-step 是责任度加权的比特频率' }, { id: 'covariance', label: '任意协方差趋无穷时得到 K-means；Bernoulli 参数更新与责任度无关' }, { id: 'labels', label: 'K-means 极限消除了所有局部最优；Bernoulli 混合不需要隐变量' }],
    correctOptionId: 'correct', hint: '比较 soft assignment 的温度极限，并把高斯充分统计量替换为二元计数。',
    explanation: '共享球形方差 ε 时，责任度含 exp(−距离²/2ε)，ε→0 只保留最近质心；Bernoulli 分量则按责任度统计每一维取 1 的频率。',
  },
];

export const chapter12ElboExercises: LearningExercise[] = [
  {
    id: 'elbo-gap', difficulty: 1,
    prompt: '恒等式 ln p(X|θ)=L(q,θ)+KL(q||p(Z|X,θ)) 中，ELBO 与对数似然的差距是什么？',
    options: [{ id: 'correct', label: 'KL(q||p(Z|X,θ))' }, { id: 'entropy', label: '仅是 q 的熵' }, { id: 'zero', label: '对任意 q 都为 0' }],
    correctOptionId: 'correct', hint: 'KL 非负正是“下界”的来源。',
    explanation: '差距等于 q 到真实后验的 KL 散度；只有 q 等于真实后验（几乎处处）时差距为零。',
  },
  {
    id: 'elbo-e-step', difficulty: 2,
    prompt: '固定 θ_old 时，精确 EM 的 E-step 为什么令 q(Z)=p(Z|X,θ_old)？',
    options: [{ id: 'correct', label: '使 KL 为 0，让 ELBO 在当前参数处等于对数似然' }, { id: 'uniform', label: '保证 q 的熵总是最大' }, { id: 'prior', label: '让 q 恒等于隐变量先验' }],
    correctOptionId: 'correct', hint: 'E-step 优化的是 q，θ 暂时固定。',
    explanation: '后验选择消掉 KL 间隙，使下界紧贴当前对数似然；随后 M-step 提升这一固定 q 下的 ELBO。',
  },
  {
    id: 'elbo-generalized-em', difficulty: 3,
    prompt: '关于广义 EM 与参数先验，下列哪项正确？',
    options: [{ id: 'correct', label: '广义 M-step 只需提高目标；加入参数先验后优化目标增加 log p(θ)' }, { id: 'closed', label: '广义 EM 仍要求每次得到 M-step 全局闭式最大值' }, { id: 'ignore', label: '参数先验只影响 E-step，完全不改变 M-step' }],
    correctOptionId: 'correct', hint: '广义 EM 放宽“最大化”为“增加”，MAP 把先验加入目标。',
    explanation: '只要每次 E/M 更新不降低相应目标，单调性仍可维持；做 MAP 时 M-step 优化 L(q,θ)+log p(θ)。',
  },
];
