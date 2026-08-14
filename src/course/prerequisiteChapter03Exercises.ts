import type { LearningExercise } from '@/components/ExercisePanel';

export const prerequisiteChapter03DiscreteExercises: LearningExercise[] = [
  {
    id: 'pre03-discrete-bernoulli', difficulty: 1,
    prompt: 'Bernoulli(μ) 随机变量的期望是多少？',
    options: [{ id: 'mu', label: 'μ' }, { id: 'one-minus', label: '1−μ' }, { id: 'square', label: 'μ²' }],
    correctOptionId: 'mu', hint: '随机变量只取 0 和 1。',
    explanation: 'E[X]=1·μ+0·(1−μ)=μ，方差则为 μ(1−μ)。',
  },
  {
    id: 'pre03-discrete-binomial', difficulty: 2,
    prompt: 'Binomial(N,μ) 中组合数 C(N,m) 的作用是什么？',
    options: [
      { id: 'orders', label: '统计 N 次试验中恰有 m 次成功的不同排列数' },
      { id: 'normalize-mu', label: '把 μ 限制在 [0,1]' },
      { id: 'expectation', label: '直接给出期望 Nμ' },
    ],
    correctOptionId: 'orders', hint: '同样的成功次数可以出现在许多不同位置。',
    explanation: '每个具体序列的概率相同，组合数把所有含 m 次成功的序列概率加在一起。',
  },
  {
    id: 'pre03-discrete-multinomial', difficulty: 3,
    prompt: 'K 类 Multinomial 参数 μₖ 必须满足什么约束？',
    options: [
      { id: 'simplex', label: '每项非负且 Σₖμₖ=1' },
      { id: 'independent', label: '每项可任意取实数' },
      { id: 'equal', label: '所有 μₖ 必须相等' },
    ],
    correctOptionId: 'simplex', hint: '它们是一组类别概率。',
    explanation: '类别概率位于概率单纯形上；相等只是均匀分布的特殊情况。',
  },
];

export const prerequisiteChapter03MvGaussianExercises: LearningExercise[] = [
  {
    id: 'pre03-mvg-contour', difficulty: 1,
    prompt: '二维高斯等密度椭圆的主轴方向由什么决定？',
    options: [
      { id: 'eigenvectors', label: '协方差矩阵的特征向量' },
      { id: 'mean-only', label: '均值向量的方向' },
      { id: 'det-only', label: '协方差行列式的符号' },
    ],
    correctOptionId: 'eigenvectors', hint: '对协方差矩阵做特征分解。',
    explanation: '特征向量给出椭圆方向，特征值控制各主轴上的尺度。',
  },
  {
    id: 'pre03-mvg-marginal', difficulty: 2,
    prompt: '多元高斯的任意子向量边缘分布是什么类型？',
    options: [{ id: 'gaussian', label: '仍是高斯分布' }, { id: 'uniform', label: '必为均匀分布' }, { id: 'discrete', label: '变成离散分布' }],
    correctOptionId: 'gaussian', hint: '高斯族对线性投影与边缘化封闭。',
    explanation: '选取均值的对应分量和协方差的对应子块，就得到边缘高斯。',
  },
  {
    id: 'pre03-mvg-conditional', difficulty: 3,
    prompt: '条件高斯协方差 Σₐₐ−ΣₐᵦΣᵦᵦ⁻¹Σᵦₐ 与原边缘协方差 Σₐₐ 相比如何？',
    options: [
      { id: 'reduced', label: '不会更大；观测 b 提供信息，扣除了可解释部分' },
      { id: 'always-larger', label: '总是逐元素更大' },
      { id: 'unrelated', label: '与交叉协方差完全无关' },
    ],
    correctOptionId: 'reduced', hint: '被减去的项是半正定矩阵。',
    explanation: 'Schur 补表示观测 b 后剩余的不确定性；交叉协方差越强，可减少的部分通常越多。',
  },
];

export const prerequisiteChapter03PeriodicExercises: LearningExercise[] = [
  {
    id: 'pre03-periodic-boundary', difficulty: 1,
    prompt: '角度 1° 与 359° 的实际圆周距离是多少？',
    options: [{ id: '2', label: '2°' }, { id: '358', label: '358°' }, { id: '360', label: '360°' }],
    correctOptionId: '2', hint: '角度在 360° 处首尾相接。',
    explanation: '沿跨越 0° 的短弧只相差 2°，这正是普通实数高斯容易处理错误的边界。',
  },
  {
    id: 'pre03-periodic-kappa', difficulty: 2,
    prompt: 'Von Mises 分布的集中参数 κ 增大时会怎样？',
    options: [
      { id: 'concentrate', label: '概率质量更集中在平均方向附近' },
      { id: 'uniform', label: '趋向圆周均匀分布' },
      { id: 'shift', label: '平均方向必然改变' },
    ],
    correctOptionId: 'concentrate', hint: '指数项是 exp{κ cos(θ−μ)}。',
    explanation: 'κ=0 时均匀；κ 越大，对偏离平均方向的角度惩罚越强。',
  },
  {
    id: 'pre03-periodic-mean', difficulty: 3,
    prompt: '计算一组角度的圆周均值，可靠的方法是什么？',
    options: [
      { id: 'vectors', label: '先平均 (cos θ, sin θ)，再取 atan2' },
      { id: 'ordinary', label: '直接做角度的算术平均，任何情况都正确' },
      { id: 'maximum', label: '总是选最大角度' },
    ],
    correctOptionId: 'vectors', hint: '先把每个方向表示为单位圆上的向量。',
    explanation: '向量平均尊重首尾相接的几何结构，例如 1° 与 359° 的均值会落在 0° 附近。',
  },
];

export const prerequisiteChapter03ExponentialExercises: LearningExercise[] = [
  {
    id: 'pre03-exp-statistic', difficulty: 1,
    prompt: '指数族中的充分统计量 u(x) 有什么作用？',
    options: [
      { id: 'compress', label: '汇总数据中与参数后验或似然相关的信息' },
      { id: 'discard', label: '删除所有与参数有关的信息' },
      { id: 'normalize', label: '保证每个观测都等于 1' },
    ],
    correctOptionId: 'compress', hint: '样本对参数的影响通过 Σₙu(xₙ) 进入似然。',
    explanation: '给定充分统计量后，原始数据不再为参数提供额外信息；这带来紧凑的更新形式。',
  },
  {
    id: 'pre03-exp-logpartition', difficulty: 2,
    prompt: '规范指数族中，log-partition A(η) 的一阶导数给出什么？',
    options: [
      { id: 'mean', label: '充分统计量的期望 E[u(X)]' },
      { id: 'zero', label: '恒等于 0' },
      { id: 'sample', label: '单个随机样本 X' },
    ],
    correctOptionId: 'mean', hint: '对归一化积分关于自然参数求导。',
    explanation: '∇A(η)=E[u(X)]，二阶导数则是充分统计量的协方差。',
  },
  {
    id: 'pre03-exp-bernoulli', difficulty: 3,
    prompt: 'Bernoulli 分布写成指数族时，自然参数 η 是什么？',
    options: [
      { id: 'logit', label: 'log(μ/(1−μ))' },
      { id: 'mu', label: '总是直接等于 μ' },
      { id: 'variance', label: 'μ(1−μ)' },
    ],
    correctOptionId: 'logit', hint: '把 μˣ(1−μ)¹⁻ˣ 的对数中 x 的系数整理出来。',
    explanation: 'log p(x)=x log(μ/(1−μ))+log(1−μ)，所以 x 的自然参数是 logit(μ)。',
  },
];

export const prerequisiteChapter03NonparametricExercises: LearningExercise[] = [
  {
    id: 'pre03-nonparam-histogram', difficulty: 1,
    prompt: '直方图箱宽取得太小时，密度估计通常会怎样？',
    options: [
      { id: 'noisy', label: '方差增大，曲线对样本扰动很敏感' },
      { id: 'smooth', label: '必然过度平滑' },
      { id: 'parametric', label: '自动变成高斯参数模型' },
    ],
    correctOptionId: 'noisy', hint: '每个小箱中能落入多少样本？',
    explanation: '箱宽太小意味着每箱样本少，局部计数波动大；箱宽太大则会抹平真实结构。',
  },
  {
    id: 'pre03-nonparam-kde', difficulty: 2,
    prompt: 'KDE 带宽 h 增大时，最典型的偏差—方差变化是什么？',
    options: [
      { id: 'bias-up', label: '偏差上升、方差下降，估计更平滑' },
      { id: 'variance-up', label: '偏差下降、方差上升，估计更尖锐' },
      { id: 'unchanged', label: '形状完全不变' },
    ],
    correctOptionId: 'bias-up', hint: '每个核覆盖的邻域变大。',
    explanation: '大带宽平均更多邻域样本，减少局部波动，却可能合并真实峰值并产生欠拟合。',
  },
  {
    id: 'pre03-nonparam-knn', difficulty: 3,
    prompt: 'kNN 密度估计或分类中增大 k，通常产生什么影响？',
    options: [
      { id: 'smooth', label: '使用更大邻域，方差降低但局部偏差可能增大' },
      { id: 'memorize', label: '更接近只记住一个最近样本' },
      { id: 'dimension-free', label: '彻底消除维度灾难' },
    ],
    correctOptionId: 'smooth', hint: 'k 越大，为包含 k 个点所需的邻域通常越大。',
    explanation: '更大的 k 带来更稳定但更平滑的估计；高维下样本稀疏问题仍然存在。',
  },
];
