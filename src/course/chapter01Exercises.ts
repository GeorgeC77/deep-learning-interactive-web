import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter01ImpactExercises: LearningExercise[] = [
  {
    id: 'impact-supervision',
    difficulty: 1,
    prompt: '皮肤病变图像带有医生给出的诊断标签，这最符合哪种学习范式？',
    options: [
      { id: 'supervised', label: '监督学习：输入和目标标签成对出现' },
      { id: 'unsupervised', label: '无监督学习：训练数据完全没有目标信号' },
      { id: 'reinforcement', label: '强化学习：模型只接收延迟奖励' },
    ],
    correctOptionId: 'supervised',
    hint: '判断训练样本中是否存在外部提供的目标标签。',
    explanation: '医生标注提供了明确目标，模型学习图像到诊断标签的映射，因此是监督学习。',
  },
  {
    id: 'impact-self-supervision',
    difficulty: 2,
    prompt: '语言模型用文本中的前文预测下一个词，为什么称为自监督学习？',
    options: [
      { id: 'automatic-target', label: '目标词直接来自原始文本，不需要逐条人工标注' },
      { id: 'no-objective', label: '训练过程不需要目标函数' },
      { id: 'human-feedback', label: '每一步预测都由人类实时评分' },
    ],
    correctOptionId: 'automatic-target',
    hint: '“自”指监督信号由数据自身构造，而不是没有监督信号。',
    explanation: '下一个词就是从原始序列自动构造出的训练目标；模型仍然优化明确的预测损失。',
  },
  {
    id: 'impact-limits',
    difficulty: 3,
    prompt: '某医院模型在内部测试集准确率很高。部署到另一地区前，最关键的下一步是什么？',
    options: [
      { id: 'external-validation', label: '在目标地区的代表性数据上做外部验证并评估错误代价' },
      { id: 'more-parameters', label: '直接扩大参数量，准确率自然会继续提高' },
      { id: 'remove-humans', label: '立即替代医生，避免人为判断影响结果' },
    ],
    correctOptionId: 'external-validation',
    hint: '训练分布和真实部署分布可能不同，医疗错误的代价也不对称。',
    explanation: '高内部准确率不能保证跨地区泛化。必须检查分布偏移、校准、敏感度及不同错误的实际代价。',
  },
];

export const chapter01TutorialExercises: LearningExercise[] = [
  {
    id: 'tutorial-complexity',
    difficulty: 1,
    prompt: '在多项式模型中，提高最高阶数 M 直接改变了什么？',
    options: [
      { id: 'capacity', label: '模型容量和可表示函数的复杂度' },
      { id: 'sample-count', label: '训练样本的数量' },
      { id: 'noise-source', label: '观测噪声的真实来源' },
    ],
    correctOptionId: 'capacity',
    hint: '比较常数、直线、三次和九次多项式能画出的曲线。',
    explanation: 'M 决定基函数和参数数量，因此改变模型容量，但不会自动增加数据或消除噪声。',
  },
  {
    id: 'tutorial-generalization',
    difficulty: 2,
    prompt: '九次多项式的训练 RMS 很低、测试 RMS 很高，这说明什么？',
    options: [
      { id: 'overfit', label: '模型把训练噪声也拟合了，发生过拟合' },
      { id: 'underfit', label: '模型容量不足，发生欠拟合' },
      { id: 'perfect', label: '训练误差低，所以模型已经达到最佳泛化' },
    ],
    correctOptionId: 'overfit',
    hint: '泛化能力要看未参与拟合的数据，而不是只看训练集。',
    explanation: '训练与测试表现出现明显间隙，是模型记住训练样本细节却没有学好总体规律的典型信号。',
  },
  {
    id: 'tutorial-selection',
    difficulty: 3,
    prompt: '若要在多个 M 和正则化强度 λ 中选择最终配置，哪种流程最可靠？',
    options: [
      { id: 'validation', label: '用训练集拟合、验证集选择配置，最后只在测试集评估一次' },
      { id: 'train-only', label: '选择训练误差最低的配置' },
      { id: 'test-tuning', label: '反复查看测试误差并据此调整配置' },
    ],
    correctOptionId: 'validation',
    hint: '测试集应模拟真正未知的数据，不能参与反复决策。',
    explanation: '验证集负责模型选择，测试集只用于最终无偏评估；反复用测试集调参会把信息泄漏进决策过程。',
  },
];

export const chapter01HistoryExercises: LearningExercise[] = [
  {
    id: 'history-perceptron',
    difficulty: 1,
    prompt: '单层感知机最核心的表达限制是什么？',
    options: [
      { id: 'linear', label: '只能形成线性决策边界' },
      { id: 'no-learning', label: '权重不能通过数据学习' },
      { id: 'continuous-only', label: '只能处理连续目标，不能分类' },
    ],
    correctOptionId: 'linear',
    hint: '思考 XOR 为什么不能被一条直线分开。',
    explanation: '单层感知机只能解决线性可分问题；隐藏层和非线性激活扩展了可表示的决策边界。',
  },
  {
    id: 'history-backprop',
    difficulty: 2,
    prompt: '反向传播为何成为多层网络发展的关键？',
    options: [
      { id: 'efficient-gradients', label: '它复用链式法则，高效计算所有参数的梯度' },
      { id: 'no-data', label: '它让神经网络不再需要训练数据' },
      { id: 'global-proof', label: '它保证任何网络都找到全局最优解' },
    ],
    correctOptionId: 'efficient-gradients',
    hint: '关键是“如何训练”，而不是保证优化一定完美。',
    explanation: '反向传播使误差信号能逐层传回并复用中间结果，但它并不保证非凸优化一定到达全局最优。',
  },
  {
    id: 'history-2012',
    difficulty: 3,
    prompt: '2012 年深度学习在视觉任务上突破，更合理的历史解释是什么？',
    options: [
      { id: 'convergence', label: '数据、GPU 算力和算法/架构改进共同成熟' },
      { id: 'single-invention', label: '只因为神经网络在那一年才首次被发明' },
      { id: 'depth-alone', label: '只要层数足够深，其他条件都不重要' },
    ],
    correctOptionId: 'convergence',
    hint: '深度网络和反向传播在 2012 年之前已经存在。',
    explanation: 'ImageNet 等大数据、GPU 计算和卷积网络训练技巧共同推动了突破，体现的是长期积累后的条件汇合。',
  },
];
