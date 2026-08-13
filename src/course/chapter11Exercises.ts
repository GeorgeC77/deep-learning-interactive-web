import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter11BasicSamplingExercises: LearningExercise[] = [
  {
    id: 'monte-carlo-variance', difficulty: 1,
    prompt: '用 L 个独立同分布样本的均值估计 E[f(z)]，估计量方差如何随 L 变化？',
    options: [{ id: 'correct', label: '按 1/L 下降，与 z 的维数没有显式关系' }, { id: 'sqrt', label: '按 1/√L 下降' }, { id: 'dimension', label: '必然随 z 的维数指数增长' }],
    correctOptionId: 'correct', hint: '独立样本均值的方差是单样本方差除以样本数。',
    explanation: '教材式 (14.4) 给出 var[估计量]=var[f]/L。标准误按 1/√L 下降；若样本相关，实际有效样本量会小于 L。',
  },
  {
    id: 'rejection-envelope', difficulty: 2,
    prompt: '目标密度 p 与提议 q 都已归一化，且 kq(z)≥p(z)。拒绝采样的平均接受率是多少？',
    options: [{ id: 'correct', label: '1/k' }, { id: 'k', label: 'k' }, { id: 'ratio', label: 'q(z)/p(z)，随当前样本而定' }],
    correctOptionId: 'correct', hint: '把逐点接受概率 p(z)/(kq(z)) 对 q 求期望。',
    explanation: '积分得到 ∫[p/(kq)]q dz=(1/k)∫p dz=1/k。因此应在保持包络成立时尽量减小 k。',
  },
  {
    id: 'importance-support', difficulty: 3,
    prompt: '重要性采样要可靠估计 E_p[f]，提议分布 q 至少必须满足什么支持条件？',
    options: [{ id: 'correct', label: '凡是 p(z)f(z) 非零的区域，q(z) 都必须为正' }, { id: 'narrow', label: 'q 的方差必须严格小于 p' }, { id: 'equal', label: 'q 必须与 p 完全相同' }],
    correctOptionId: 'correct', hint: '若 q 从不访问某区域，再大的权重也补不回缺失样本。',
    explanation: '权重 p/q 要在有贡献的区域可定义。q 不必等于 p，但应覆盖 p(z)|f(z)| 的重要区域，否则权重退化、ESS 很低甚至估计失效。',
  },
];

export const chapter11McmcExercises: LearningExercise[] = [
  {
    id: 'metropolis-symmetric', difficulty: 1,
    prompt: '对称提议 q(z*|z)=q(z|z*) 下，Metropolis 接受概率是什么？',
    options: [{ id: 'correct', label: 'min(1, p̃(z*)/p̃(z))' }, { id: 'proposal', label: 'min(1, q(z*|z)/q(z|z*))' }, { id: 'always', label: '恒为 1' }],
    correctOptionId: 'correct', hint: 'MH 中的两个提议概率在对称条件下相消。',
    explanation: '归一化常数也在目标密度比中相消，所以只需能计算未归一化密度 p̃；若候选点密度更高则必然接受。',
  },
  {
    id: 'mcmc-rejection', difficulty: 2,
    prompt: 'MCMC 候选状态被拒绝后，当前状态应怎样处理？',
    options: [{ id: 'correct', label: '保留当前状态，并把它再次计入样本序列' }, { id: 'discard', label: '删除这一时刻，不记录任何样本' }, { id: 'restart', label: '从初始分布重新启动整条链' }],
    correctOptionId: 'correct', hint: '拒绝本身也是转移核的一部分。',
    explanation: '与拒绝采样不同，Metropolis 拒绝候选后令 z^(τ+1)=z^(τ)。重复状态对于保持正确平稳分布不可缺少。',
  },
  {
    id: 'gibbs-vs-ancestral', difficulty: 3,
    prompt: '关于 Gibbs 与祖先采样，下列哪项正确？',
    options: [{ id: 'correct', label: 'Gibbs 反复采全条件分布；祖先采样按 DAG 拓扑序一次前向采联合分布' }, { id: 'same', label: '二者都必须使用接受/拒绝步骤' }, { id: 'reverse', label: '祖先采样只适用于无向图，Gibbs 只适用于 DAG' }],
    correctOptionId: 'correct', hint: '一个构造马尔可夫链，一个利用有向图分解直接生成。',
    explanation: 'Gibbs 是接受率为 1 的特殊 MH 更新，但连续样本相关；祖先采样从每个 p(zi|pa(i)) 按拓扑序抽样，可直接得到联合分布样本。',
  },
];

export const chapter11LangevinExercises: LearningExercise[] = [
  {
    id: 'score-variable', difficulty: 1,
    prompt: '能量模型的 score s(x,w)=∇x log p(x|w) 是对哪个量求梯度？',
    options: [{ id: 'correct', label: '数据变量 x，因此等于 −∇xE(x,w)' }, { id: 'parameter', label: '模型参数 w，因此等于 −∇wE(x,w)' }, { id: 'partition', label: '归一化常数 Z 本身' }],
    correctOptionId: 'correct', hint: 'score 描述在数据空间中往哪个方向概率上升。',
    explanation: 'log p=−E−log Z(w)，Z 不依赖 x，所以对 x 求导后归一化常数消失，得到 s=−∇xE。',
  },
  {
    id: 'ebm-gradient-signs', difficulty: 2,
    prompt: '最大化 EBM 数据对数似然时，能量梯度的两项符号是什么？',
    options: [{ id: 'correct', label: '−E_data[∇wE] + E_model[∇wE]' }, { id: 'both-minus', label: '−E_data[∇wE] − E_model[∇wE]' }, { id: 'reverse', label: '+E_data[∇wE] − E_model[∇wE]' }],
    correctOptionId: 'correct', hint: '数据处应降能量，模型过密处应升能量。',
    explanation: '第一项提高数据区域概率，第二项压低当前模型自产样本区域的过高概率；模型匹配数据时二者抵消。',
  },
  {
    id: 'langevin-noise', difficulty: 3,
    prompt: '步长为 η 的教材 Langevin 更新中，高斯噪声项的尺度是什么？',
    options: [{ id: 'correct', label: '√(2η)' }, { id: 'eta', label: 'η' }, { id: 'inverse', label: '1/η' }],
    correctOptionId: 'correct', hint: '漂移项随 η 缩放，扩散项随时间步的平方根缩放。',
    explanation: '更新为 x′=x+η∇x log p(x)+√(2η)ε。有限 η 有离散偏差；教材的精确极限还要求 η→0、T→∞。',
  },
];
