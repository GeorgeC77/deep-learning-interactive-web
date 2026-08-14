import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter17ForwardExercises: LearningExercise[] = [
  {
    id: 'diffusion-one-step-moments', difficulty: 1,
    prompt: '一维 z_{t-1} 的均值为 2、方差为 4，且 β_t=0.1。经过 z_t=√(1−β_t)z_{t-1}+√β_t ε 后，z_t 的方差是多少？',
    options: [
      { id: 'three-seven', label: '3.7' },
      { id: 'four-one', label: '4.1' },
      { id: 'zero-four', label: '0.4' },
    ],
    correctOptionId: 'three-seven',
    hint: '两个噪声源独立，方差分别乘各自系数的平方后相加。',
    explanation: 'Var[z_t]=(1−0.1)×4+0.1×1=3.7。这个系数设计会把协方差逐步拉向单位阵，而不是无界放大。',
  },
  {
    id: 'diffusion-kernel-alpha-bar', difficulty: 2,
    prompt: '若 β₁=0.1、β₂=0.2，则 ᾱ₂=∏ᵢ₌₁²(1−βᵢ) 与闭式采样中的信号系数分别是多少？',
    options: [
      { id: 'point-seven-two', label: 'ᾱ₂=0.72，信号系数 √0.72' },
      { id: 'point-zero-two', label: 'ᾱ₂=0.02，信号系数 √0.02' },
      { id: 'point-seven', label: 'ᾱ₂=0.70，信号系数 0.70' },
    ],
    correctOptionId: 'point-seven-two',
    hint: '先分别计算 1−β₁ 与 1−β₂，再相乘；z_t 中 x 的系数还要开平方。',
    explanation: 'ᾱ₂=0.9×0.8=0.72，因此 z₂=√0.72x+√0.28ε。闭式核让训练时无需真的走完前两步。',
  },
  {
    id: 'diffusion-reverse-conditional', difficulty: 3,
    prompt: '为什么 q(z_{t−1}|z_t,x) 可写成闭式高斯，而 q(z_{t−1}|z_t) 通常不可解？',
    options: [
      { id: 'condition-x', label: '给定 x 后两个前向高斯因子都已知；不含 x 时需对未知数据密度积分' },
      { id: 'markov-independent', label: '马尔可夫性意味着 z_{t−1} 与 z_t 无条件独立' },
      { id: 'beta-zero', label: '因为推导默认所有 β_t 都等于 0' },
    ],
    correctOptionId: 'condition-x',
    hint: '对照教材式 (20.12) 与 (20.13)：哪一个式子包含未知的 p(x)？',
    explanation: 'q(z_{t−1}|z_t) 要把未知 p(x) 积分掉；加入训练样本 x 后，分子是两个关于 z_{t−1} 的高斯因子，配方即可得到式 (20.15)–(20.17)。',
  },
];

export const chapter17ReverseExercises: LearningExercise[] = [
  {
    id: 'diffusion-elbo-gap', difficulty: 1,
    prompt: '若 ln p(x|w)=−8，且 KL(q(z)||p(z|x,w))=1.2，则扩散模型的 ELBO 𝓛(w) 是多少？',
    options: [
      { id: 'minus-nine-two', label: '−9.2' },
      { id: 'minus-six-eight', label: '−6.8' },
      { id: 'minus-eight', label: '−8' },
    ],
    correctOptionId: 'minus-nine-two',
    hint: '由 ln p=𝓛+KL，把非负 KL 从 log likelihood 中减去。',
    explanation: '𝓛=−8−1.2=−9.2。固定前向链 q 后，训练只需调整反向网络参数来抬高这个下界。',
  },
  {
    id: 'diffusion-simplified-loss-boundary', difficulty: 2,
    prompt: '把教材式 (20.37) 的时间相关系数删除、令各时间步等权后，最准确的说法是什么？',
    options: [
      { id: 'surrogate', label: '得到经验上有效的简化噪声 MSE，但不再逐项等于原始加权 ELBO' },
      { id: 'same-elbo', label: '得到数值完全相同的 ELBO，只是换了记号' },
      { id: 'no-learning', label: '目标与网络参数无关，因此无法训练' },
    ],
    correctOptionId: 'surrogate',
    hint: '删除一个依赖 t 的正权重，会不会保持每个训练样本的目标值不变？',
    explanation: 'Ho 等人的简化目标改变了各噪声层级的相对权重，通常更好优化，但不能把它逐项等同于原始 ELBO。',
  },
  {
    id: 'diffusion-final-sampling-step', difficulty: 3,
    prompt: '按教材 Algorithm 20.2，从 z_T 逐步采样时，最后生成无噪声 x 的一步应怎样处理随机项？',
    options: [
      { id: 'omit-final-noise', label: '中间步可加随机项，最后一步不再额外加噪声' },
      { id: 'double-final-noise', label: '最后一步把随机项方差加倍' },
      { id: 'omit-all-noise', label: '所有反向步骤都必须是确定性的' },
    ],
    correctOptionId: 'omit-final-noise',
    hint: '最终目标是数据空间中的无噪声样本，而不是 z₁ 的另一份带噪版本。',
    explanation: 'Algorithm 20.2 的 t=T,…,2 步按反向高斯采样；由 z₁ 得到 x 的最终去噪步不再加入新的随机噪声。',
  },
];

export const chapter17ScoreExercises: LearningExercise[] = [
  {
    id: 'score-gaussian-value', difficulty: 1,
    prompt: '对 p(x)=N(0,4)，分数函数 s(x)=∂ ln p(x)/∂x。在 x=2 处 s(2) 等于多少？',
    options: [
      { id: 'minus-half', label: '−0.5' },
      { id: 'minus-two', label: '−2' },
      { id: 'plus-half', label: '0.5' },
    ],
    correctOptionId: 'minus-half',
    hint: '一维高斯 N(μ,σ²) 的分数是 −(x−μ)/σ²。',
    explanation: 's(2)=−(2−0)/4=−0.5。负号表示从 x=2 朝密度更高的均值 0 移动。',
  },
  {
    id: 'score-noise-scaling', difficulty: 2,
    prompt: '若 ᾱ_t=0.75，某次采样噪声 ε=1，则条件腐蚀分数 ∇_{z_t}ln q(z_t|x) 是多少？',
    options: [
      { id: 'minus-two', label: '−2' },
      { id: 'minus-half', label: '−0.5' },
      { id: 'plus-two', label: '2' },
    ],
    correctOptionId: 'minus-two',
    hint: '代入 −ε/√(1−ᾱ_t)。',
    explanation: '√(1−0.75)=0.5，所以条件分数为 −1/0.5=−2。边缘分数还需对所有可能 ε 取条件期望。',
  },
  {
    id: 'score-noise-ladder', difficulty: 3,
    prompt: '为什么退火 Langevin 动力学要从大噪声逐级走向小噪声？',
    options: [
      { id: 'bridge', label: '大噪声先连通并平滑分布，小噪声再恢复数据细节' },
      { id: 'same-score', label: '因为所有噪声尺度的分数函数完全相同' },
      { id: 'normalize', label: '只是为了计算归一化常数，与采样轨迹无关' },
    ],
    correctOptionId: 'bridge',
    hint: '想想低维流形、低密度区域与互不连通的多个模式。',
    explanation: '大方差核缓解流形外分数未定义、低密度估计不准和模式不连通；随后降低噪声，才逐步回到精细的数据分布。',
  },
];

export const chapter17GuidedExercises: LearningExercise[] = [
  {
    id: 'guidance-scale-endpoints', difficulty: 1,
    prompt: '在分类器引导 score(x,c;λ)=∇ln p(x)+λ∇ln p(c|x) 中，λ=0 与 λ=1 分别对应什么？',
    options: [
      { id: 'unconditional-conditional', label: '无条件分数；条件分布 p(x|c) 的分数' },
      { id: 'conditional-unconditional', label: '条件分数；无条件分数' },
      { id: 'both-zero', label: '两者都使总分数恒为 0' },
    ],
    correctOptionId: 'unconditional-conditional',
    hint: 'λ=1 时直接使用 Bayes 分解式 (20.58)。',
    explanation: 'λ=0 移除分类器梯度；λ=1 恰好恢复 ∇ln p(x|c)。λ>1 则强化条件，但通常牺牲多样性。',
  },
  {
    id: 'classifier-free-extrapolation', difficulty: 2,
    prompt: '无分类器引导 ε̂=ε_unc+w(ε_cond−ε_unc)。若 ε_unc=2、ε_cond=1、w=3，则 ε̂ 为多少？',
    options: [
      { id: 'minus-one', label: '−1' },
      { id: 'one', label: '1' },
      { id: 'five', label: '5' },
    ],
    correctOptionId: 'minus-one',
    hint: '先算条件方向差值 1−2，再乘 3。',
    explanation: 'ε̂=2+3×(−1)=−1，已经越过 ε_cond=1，因此 w>1 是外推而不是条件/无条件之间的插值。',
  },
  {
    id: 'classifier-free-training', difficulty: 3,
    prompt: '一个网络怎样同时提供无条件与有条件预测，从而实现 classifier-free guidance？',
    options: [
      { id: 'drop-condition', label: '训练时随机把条件设为空值，采样时分别前向计算空条件和真实条件' },
      { id: 'freeze-classifier', label: '冻结一个只在干净图像上训练的外部分层分类器' },
      { id: 'remove-noise', label: '训练时删除前向噪声过程，只拟合文本嵌入' },
    ],
    correctOptionId: 'drop-condition',
    hint: '教材把随机空条件类比成对整个条件输入做 dropout。',
    explanation: '训练时约 10%–20% 的样本使用空条件，使同一网络学到两种预测；采样时二者的差给出强化条件的方向。',
  },
];
