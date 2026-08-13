import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter08GraphicalModelsExercises: LearningExercise[] = [
  {
    id: 'dag-factorization',
    difficulty: 1,
    prompt: '对 DAG A→B、A→C、B→D、C→D，正确的联合分布分解是哪一个？',
    options: [
      { id: 'correct', label: 'p(A)p(B|A)p(C|A)p(D|B,C)' },
      { id: 'chain', label: 'p(A)p(B|A)p(C|B)p(D|C)' },
      { id: 'all', label: 'p(A)p(B|A)p(C|A,B)p(D|A,B,C)' },
    ],
    correctOptionId: 'correct',
    hint: '每个局部因子只需要以该节点在图中的父节点为条件。',
    explanation: 'A 没有父节点；B、C 的父节点都是 A；D 的父节点是 B、C。拓扑序不等于把图强行写成一条链。',
  },
  {
    id: 'linear-gaussian',
    difficulty: 2,
    prompt: '若 DAG 中每个连续节点都是“父节点的线性函数 + 独立高斯噪声”，联合分布属于哪一族？',
    options: [
      { id: 'correct', label: '多元高斯分布' },
      { id: 'mixture', label: '必然是高斯混合分布' },
      { id: 'uniform', label: '均匀分布' },
    ],
    correctOptionId: 'correct',
    hint: '高斯变量的线性组合再加独立高斯噪声仍是高斯变量。',
    explanation: '沿拓扑序递归代入后，每个节点都是独立高斯噪声的仿射组合，因此整组变量构成多元高斯分布。',
  },
  {
    id: 'edge-causality',
    difficulty: 3,
    prompt: '仅看到贝叶斯网络中有一条 A→B，最稳妥的解释是什么？',
    options: [
      { id: 'correct', label: '它编码局部概率依赖与因子分解；因果解释还需额外假设' },
      { id: 'causal', label: '它已经证明干预 A 一定会改变 B' },
      { id: 'independent', label: '它表示 A 与 B 相互独立' },
    ],
    correctOptionId: 'correct',
    hint: '观察分布、图的因子分解与干预语义是三个不同层次。',
    explanation: '有向图可用于表达因果结构，但单凭一条概率图上的有向边不能自动获得干预结论；还需要因果建模假设或实验依据。',
  },
];

export const chapter08ConditionalIndependenceExercises: LearningExercise[] = [
  {
    id: 'three-structures',
    difficulty: 1,
    prompt: '给定中间节点 B 后，哪一种三节点结构会从阻断变为开通？',
    options: [
      { id: 'correct', label: '汇聚结构 A→B←C' },
      { id: 'chain', label: '链式结构 A→B→C' },
      { id: 'fork', label: '分岔结构 A←B→C' },
    ],
    correctOptionId: 'correct',
    hint: '共同结果在未观测时阻断路径，观测后会产生 explaining away。',
    explanation: '链和分岔在给定 B 后被阻断；汇聚点恰好相反，给定 B 或其子孙会开通 A 与 C 之间的路径。',
  },
  {
    id: 'naive-bayes',
    difficulty: 2,
    prompt: '朴素贝叶斯的“朴素”假设准确地说是什么？',
    options: [
      { id: 'correct', label: '给定类别 C 后，各特征 Xi 条件独立' },
      { id: 'marginal', label: '各特征在不考虑类别时也必须边缘独立' },
      { id: 'class', label: '类别 C 与所有特征独立' },
    ],
    correctOptionId: 'correct',
    hint: '把类别节点看成所有特征节点的共同父节点。',
    explanation: '模型分解为 p(C)∏i p(Xi|C)。特征可以因混合了不同类别而在边缘上相关，模型只要求类别条件下独立。',
  },
  {
    id: 'markov-blanket',
    difficulty: 3,
    prompt: '贝叶斯网络中节点 X 的马尔可夫毯包含哪些节点？',
    options: [
      { id: 'correct', label: 'X 的父节点、子节点，以及子节点的其他父节点' },
      { id: 'neighbors', label: '只包含与 X 直接相连的节点' },
      { id: 'ancestors', label: 'X 的全部祖先节点' },
    ],
    correctOptionId: 'correct',
    hint: '还要考虑与 X 共同指向其子节点的“配偶”节点。',
    explanation: '给定父、子及子节点的其他父节点后，所有通往图中其余节点的路径都被阻断，因此 X 与其余节点条件独立。',
  },
];

export const chapter08SequenceModelsExercises: LearningExercise[] = [
  {
    id: 'first-order-factorization',
    difficulty: 1,
    prompt: '一阶马尔可夫序列 x1:N 的联合分布如何分解？',
    options: [
      { id: 'correct', label: 'p(x1)∏n=2:N p(xn|x(n−1))' },
      { id: 'independent', label: '∏n=1:N p(xn)' },
      { id: 'full-history', label: 'p(x1)∏n=2:N p(xn|x1,…,x(n−1))，且不能再简化' },
    ],
    correctOptionId: 'correct',
    hint: '一阶假设让当前变量在给定前一个变量后与更早历史条件独立。',
    explanation: '链式法则原本包含全部历史；一阶马尔可夫性质把每个条件项缩减为只依赖 x(n−1)。',
  },
  {
    id: 'higher-order-cost',
    difficulty: 2,
    prompt: 'K 状态离散序列从一阶提升为 M 阶后，条件概率表的规模主要如何增长？',
    options: [
      { id: 'correct', label: '随 M 指数增长，约需 K^M(K−1) 个自由参数' },
      { id: 'linear', label: '只随 M 线性增长，约需 MK 个参数' },
      { id: 'constant', label: '参数量不变，只增加计算时间' },
    ],
    correctOptionId: 'correct',
    hint: '长度为 M 的历史状态组合共有 K^M 种。',
    explanation: '每种历史组合都需要一个 K 类条件分布，而每个分布有 K−1 个自由参数，所以高阶模型很快遭遇参数爆炸。',
  },
  {
    id: 'hidden-state-markov',
    difficulty: 3,
    prompt: '在一阶隐状态空间模型中，哪项陈述通常正确？',
    options: [
      { id: 'correct', label: '隐状态 zn 是一阶马尔可夫链，观测 xn 通常不是任何有限阶马尔可夫链' },
      { id: 'observed', label: '观测 xn 必然是一阶马尔可夫链' },
      { id: 'both', label: '隐状态与观测都必然是一阶马尔可夫链' },
    ],
    correctOptionId: 'correct',
    hint: '历史观测通过当前隐状态的后验分布影响未来；最后一次观测通常不足以概括这个后验。',
    explanation: '模型对 z 链施加一阶马尔可夫性质，但边缘化隐状态后，预测未来观测需要由全部历史形成的过滤后验，因此 x 序列一般不满足有限阶马尔可夫性质。',
  },
];
