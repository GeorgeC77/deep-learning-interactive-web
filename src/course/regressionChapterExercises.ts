import type { LearningExercise } from '@/components/ExercisePanel';

export const regressionLinearExercises: LearningExercise[] = [
  {
    id: 'linear-in-parameters',
    difficulty: 1,
    prompt: '模型 y(x)=w₀+w₁x+w₂x² 为什么仍属于线性回归？',
    options: [
      { id: 'weights', label: '输出对可学习参数 w₀、w₁、w₂ 是线性的' },
      { id: 'input', label: '输出对输入 x 必须是一条直线' },
      { id: 'noise', label: '因为模型没有观测噪声' },
    ],
    correctOptionId: 'weights',
    hint: '判断“线性”时，要看待估计的参数如何进入模型。',
    explanation: '基函数 1、x、x² 可以是输入的非线性变换；只要它们由权重线性组合，模型就仍是对参数线性的回归模型。',
  },
  {
    id: 'gaussian-least-squares',
    difficulty: 2,
    prompt: '若 tₙ=wᵀφ(xₙ)+εₙ，且 εₙ 独立服从同方差零均值高斯分布，最大化似然等价于什么？',
    options: [
      { id: 'sse', label: '最小化残差平方和' },
      { id: 'absolute', label: '最小化残差绝对值之和' },
      { id: 'rank', label: '最大化设计矩阵的秩' },
    ],
    correctOptionId: 'sse',
    hint: '对高斯密度取负对数，保留依赖 w 的部分。',
    explanation: '高斯负对数似然中与 w 有关的项正比于 Σₙ(tₙ−wᵀφₙ)²，因此最大似然与最小二乘得到同一组权重。',
  },
  {
    id: 'ridge-stability',
    difficulty: 3,
    prompt: '当 ΦᵀΦ 接近奇异时，加入 λ‖w‖²（λ>0）最直接的作用是什么？',
    options: [
      { id: 'stability', label: '抑制过大的权重并改善求解稳定性，但可能增加偏差' },
      { id: 'noise', label: '把真实观测噪声方差强制变为零' },
      { id: 'samples', label: '在不新增数据的情况下增加有效样本数' },
    ],
    correctOptionId: 'stability',
    hint: '比较 ΦᵀΦ 与 ΦᵀΦ+λI 的特征值。',
    explanation: '岭正则把每个特征值向上平移 λ，使逆矩阵更稳定并压缩权重；代价是引入一定偏差，所以 λ 需要用验证数据选择。',
  },
];

export const regressionDecisionExercises: LearningExercise[] = [
  {
    id: 'squared-loss-mean',
    difficulty: 1,
    prompt: '在平方损失 L(t,y)=(t−y)² 下，使后验期望损失最小的点预测是什么？',
    options: [
      { id: 'mean', label: '后验均值 E[t|x]' },
      { id: 'median', label: '后验中位数' },
      { id: 'mode', label: '后验众数' },
    ],
    correctOptionId: 'mean',
    hint: '对 E[(t−y)²|x] 关于 y 求导并令其为零。',
    explanation: '导数为 2(y−E[t|x])，因此平方损失的贝叶斯最优点预测是条件均值。',
  },
  {
    id: 'absolute-loss-median',
    difficulty: 2,
    prompt: '后验分布含有少量极端大值时，为什么绝对损失的最优预测通常比平方损失更稳健？',
    options: [
      { id: 'median', label: '它选择后验中位数，极端值不会像平方损失那样被二次放大' },
      { id: 'ignore', label: '它会自动删除所有极端样本' },
      { id: 'variance', label: '它假设后验方差恒为零' },
    ],
    correctOptionId: 'median',
    hint: '比较均值与中位数对分布尾部少量质量的敏感程度。',
    explanation: '绝对损失由中位数最小化；少量远端概率质量会明显拉动均值，却通常不会越过中位数的 50% 概率分界。',
  },
  {
    id: 'asymmetric-loss',
    difficulty: 3,
    prompt: '若低估需求的代价高于高估，最优预测相对对称损失下应如何调整？',
    options: [
      { id: 'up', label: '向较高分位数移动，降低低估发生率' },
      { id: 'down', label: '向较低分位数移动，增加低估发生率' },
      { id: 'same', label: '损失改变不会影响贝叶斯决策' },
    ],
    correctOptionId: 'up',
    hint: '更昂贵的错误应该更少发生。',
    explanation: '推断阶段给出同一个 p(t|x)，但决策阶段会随损失改变；低估更昂贵时，最优决策向高分位数移动。',
  },
];

export const regressionBiasVarianceExercises: LearningExercise[] = [
  {
    id: 'simple-model',
    difficulty: 1,
    prompt: '用常数模型拟合明显弯曲的真实函数，重复更换训练集后预测都很相似但普遍偏离真值。这主要表现为什么？',
    options: [
      { id: 'bias', label: '高偏差、低方差' },
      { id: 'variance', label: '低偏差、高方差' },
      { id: 'noise', label: '只有不可约噪声，没有模型误差' },
    ],
    correctOptionId: 'bias',
    hint: '“都很相似”描述方差，“普遍偏离”描述偏差。',
    explanation: '模型容量不足使平均预测远离真实函数，形成高偏差；不同训练集得到的模型相近，所以方差较低。',
  },
  {
    id: 'more-data',
    difficulty: 2,
    prompt: '保持模型族和数据生成过程不变，显著增加独立训练样本通常最先改善哪一项？',
    options: [
      { id: 'variance', label: '降低估计方差，使不同训练集得到的拟合更一致' },
      { id: 'noise', label: '消除观测过程本身的不可约噪声' },
      { id: 'bias-zero', label: '保证模型偏差严格变为零' },
    ],
    correctOptionId: 'variance',
    hint: '更多样本让参数估计更稳定，但不会改变模型族，也不会改写真实噪声。',
    explanation: '增加数据通常降低由抽样波动造成的方差；它不能消除不可约噪声，也不能保证一个表达能力不足的模型不再有偏差。',
  },
  {
    id: 'regularization-tradeoff',
    difficulty: 3,
    prompt: '对一个小样本高阶多项式逐步增大 L2 正则化，最典型的偏差—方差变化是什么？',
    options: [
      { id: 'tradeoff', label: '方差下降、偏差上升，测试误差可能先降后升' },
      { id: 'both-down', label: '偏差和方差必然同时降到零' },
      { id: 'noise-up', label: '不可约噪声会随 λ 增大而上升' },
    ],
    correctOptionId: 'tradeoff',
    hint: '正则化限制模型随训练样本剧烈摆动，也限制了它贴近真实函数的自由度。',
    explanation: '适度正则可用少量偏差换取显著方差下降；过强正则会造成欠拟合，因此总测试误差往往呈现先降后升。',
  },
];
