import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter02DiscriminantExercises: LearningExercise[] = [
  {
    id: 'discriminant-normal',
    difficulty: 1,
    prompt: '二分类线性判别函数 y(x)=wᵀx+w₀ 的向量 w 在几何上表示什么？',
    options: [
      { id: 'normal', label: '决策超平面的法向量' },
      { id: 'point', label: '决策超平面上的固定样本点' },
      { id: 'probability', label: '类别先验概率向量' },
    ],
    correctOptionId: 'normal',
    hint: '在边界上移动时，wᵀx+w₀ 保持为 0。',
    explanation: '边界内任意切向位移都与 w 正交，因此 w 是决策超平面的法向量。',
  },
  {
    id: 'discriminant-argmax',
    difficulty: 2,
    prompt: 'K 个联合训练的判别分数采用 argmax 决策，最直接保证了什么？',
    options: [
      { id: 'one-label', label: '除并列外，每个输入都会得到一个类别标签' },
      { id: 'probability', label: '所有分数天然位于 [0,1] 且总和为 1' },
      { id: 'nonlinear', label: '决策边界必然是非线性的' },
    ],
    correctOptionId: 'one-label',
    hint: 'argmax 只比较分数大小，并不负责概率归一化。',
    explanation: '最大分数规则会选出一个类别；分数本身不必是概率，线性分数的两两边界仍是超平面。',
  },
  {
    id: 'discriminant-outlier',
    difficulty: 3,
    prompt: '为什么一个远离边界但标签异常的样本可能显著拉动最小二乘分类边界？',
    options: [
      { id: 'quadratic', label: '残差被平方，极大残差会在目标函数中占据很大权重' },
      { id: 'ignored', label: '最小二乘会自动忽略所有远离边界的样本' },
      { id: 'normalized', label: '1-of-K 编码会把异常点的影响归一化为零' },
    ],
    correctOptionId: 'quadratic',
    hint: '比较残差 1 和残差 10 对平方损失的贡献。',
    explanation: '平方损失分别贡献 1 和 100，因此大残差样本可能主导拟合并移动决策边界。',
  },
];

export const chapter02DecisionExercises: LearningExercise[] = [
  {
    id: 'decision-zero-one',
    difficulty: 1,
    prompt: '在 0-1 损失下，贝叶斯最优分类规则是什么？',
    options: [
      { id: 'map', label: '选择后验概率最大的类别' },
      { id: 'prior', label: '始终选择先验概率最小的类别' },
      { id: 'reject', label: '拒绝所有最大后验低于 1 的样本' },
    ],
    correctOptionId: 'map',
    hint: '此时所有误分类的代价相同。',
    explanation: '预测 j 的风险是 1-p(C_j|x)，所以选择最大后验类别可使风险最小。',
  },
  {
    id: 'decision-cost-threshold',
    difficulty: 2,
    prompt: '若漏诊代价 C_FN 增大，而误诊代价 C_FP 不变，阳性决策阈值如何变化？',
    options: [
      { id: 'down', label: '降低，更倾向于判为阳性' },
      { id: 'up', label: '升高，更倾向于判为阴性' },
      { id: 'same', label: '保持 0.5 不变' },
    ],
    correctOptionId: 'down',
    hint: '阈值为 C_FP/(C_FP+C_FN)。',
    explanation: 'C_FN 增大使分母增大、阈值下降；模型会用更多误诊换取更少漏诊。',
  },
  {
    id: 'decision-roc',
    difficulty: 3,
    prompt: '同一评分模型改变分类阈值时，ROC 图上的点通常怎样移动？',
    options: [
      { id: 'tradeoff', label: 'TPR 与 FPR 一起变化，形成一条阈值轨迹' },
      { id: 'auc-change', label: '每换一个阈值都会训练出新的 AUC' },
      { id: 'fixed', label: 'TPR 和 FPR 都不会变化' },
    ],
    correctOptionId: 'tradeoff',
    hint: '降低阈值会让更多正例和负例都被判为阳性。',
    explanation: '阈值扫描产生 ROC 曲线；AUC 汇总的是评分排序能力，而不是某个单一阈值的准确率。',
  },
];

export const chapter02GenerativeExercises: LearningExercise[] = [
  {
    id: 'generative-bayes',
    difficulty: 1,
    prompt: '生成分类器从类条件密度得到后验概率还需要哪一项？',
    options: [
      { id: 'prior', label: '类别先验 p(Cₖ)' },
      { id: 'loss-only', label: '只需要一个平方损失' },
      { id: 'boundary-only', label: '只需要预先画好的决策边界' },
    ],
    correctOptionId: 'prior',
    hint: '回忆贝叶斯公式的“似然 × 先验”。',
    explanation: '后验与 p(x|Cₖ)p(Cₖ) 成正比，并由所有类别的证据项归一化。',
  },
  {
    id: 'generative-covariance',
    difficulty: 2,
    prompt: '高斯类条件分布共享协方差时，为什么两类 log-odds 对 x 是线性的？',
    options: [
      { id: 'cancel', label: '两个高斯对数密度中的二次项相互抵消' },
      { id: 'zero-variance', label: '共享协方差意味着所有方差都为零' },
      { id: 'equal-means', label: '共享协方差强制两类均值相同' },
    ],
    correctOptionId: 'cancel',
    hint: '展开两个马氏距离的差。',
    explanation: '相同的二次型 xᵀΣ⁻¹x 在相减时消失，只留下关于 x 的一次项和常数项。',
  },
  {
    id: 'generative-naive-bayes',
    difficulty: 3,
    prompt: '朴素贝叶斯的条件独立假设主要带来什么计算优势？',
    options: [
      { id: 'factorize', label: '把高维联合类条件概率分解为单特征概率的乘积' },
      { id: 'perfect', label: '保证任何数据上的分类准确率为 100%' },
      { id: 'no-prior', label: '使类别先验不再参与贝叶斯公式' },
    ],
    correctOptionId: 'factorize',
    hint: '比较估计完整联合表与分别估计 D 个一维条件分布。',
    explanation: '分解显著减少参数和数据需求，但特征相关时概率估计可能失真。',
  },
];

export const chapter02DiscriminativeExercises: LearningExercise[] = [
  {
    id: 'discriminative-sigmoid',
    difficulty: 1,
    prompt: '逻辑回归中的 sigmoid 主要完成什么转换？',
    options: [
      { id: 'probability', label: '把任意实数 logit 映射为 (0,1) 内的概率' },
      { id: 'label', label: '把类别标签转换为连续输入特征' },
      { id: 'density', label: '估计完整的输入密度 p(x)' },
    ],
    correctOptionId: 'probability',
    hint: '观察 σ(a)=1/(1+e⁻ᵃ) 的值域。',
    explanation: 'sigmoid 是 logit 链接的逆函数，使线性预测值可解释为二分类后验概率。',
  },
  {
    id: 'discriminative-gradient',
    difficulty: 2,
    prompt: '单样本二分类交叉熵对 logit a 的导数是什么？',
    options: [
      { id: 'residual', label: 'σ(a)-t' },
      { id: 'square', label: '(a-t)²' },
      { id: 'constant', label: '恒为 1' },
    ],
    correctOptionId: 'residual',
    hint: '将交叉熵对概率求导，再乘 sigmoid 的导数。',
    explanation: '链式法则中的分式与 σ(a)(1-σ(a)) 约掉，得到简洁的概率残差 σ(a)-t。',
  },
  {
    id: 'discriminative-separation',
    difficulty: 3,
    prompt: '线性可分数据上，无正则化逻辑回归的最大似然权重为何可能不断增大？',
    options: [
      { id: 'confidence', label: '放大权重可保持分类边界不变，同时把正确样本概率推近 0 或 1' },
      { id: 'boundary', label: '放大权重必然不断旋转决策边界' },
      { id: 'softmax', label: '因为 sigmoid 输出不受权重影响' },
    ],
    correctOptionId: 'confidence',
    hint: '正比例缩放所有权重时，wᵀx=0 是否改变？',
    explanation: '正比例缩放不改变边界或类别，却能继续降低可分样本的交叉熵，因此有限的最大似然解可能不存在。',
  },
];
