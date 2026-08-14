import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter15CouplingExercises: LearningExercise[] = [
  {
    id: 'coupling-forward-density-sign', difficulty: 1,
    prompt: '一维被变换分量满足 x_B=2z_B，正向 log|det K|=ln 2。若基分布 log 密度为 −1，数据 log 密度是多少？',
    options: [
      { id: 'subtract', label: '−1−ln 2' },
      { id: 'add', label: '−1+ln 2' },
      { id: 'same', label: '仍为 −1' },
    ],
    correctOptionId: 'subtract',
    hint: '用正向 Jacobian K=∂f/∂z 时，log p_x=log p_z−log|det K|。',
    explanation: '空间被放大 2 倍后，同一概率质量分摊到更大体积，密度应下降，因此 log p_x=−1−ln 2。',
  },
  {
    id: 'coupling-inverse', difficulty: 2,
    prompt: '若 x_B=exp(s)z_B+b，且 x_B=5、s=ln 2、b=1，逆映射恢复的 z_B 是多少？',
    options: [
      { id: 'two', label: '2' },
      { id: 'three', label: '3' },
      { id: 'eight', label: '8' },
    ],
    correctOptionId: 'two',
    hint: '使用 z_B=exp(−s)(x_B−b)。',
    explanation: 'z_B=(5−1)/2=2。可逆性来自复制的 z_A 让我们能够重新计算 s 与 b。',
  },
  {
    id: 'coupling-conditioner-invertibility', difficulty: 3,
    prompt: '为什么产生 s(z_A) 与 b(z_A) 的 conditioner 神经网络本身不必可逆？',
    options: [
      { id: 'copied', label: 'z_A 被原样复制，逆向时可直接用 x_A=z_A 重新计算 s 与 b' },
      { id: 'det-zero', label: '因为耦合层允许 Jacobian 行列式恒为零' },
      { id: 'discard', label: '因为逆向时会丢弃 x_A' },
    ],
    correctOptionId: 'copied',
    hint: '逆向开始时，哪一部分变量已经知道？',
    explanation: 'x_A=z_A 提供了同一个 conditioner 输入；只需仿射 coupling function 对 z_B 可逆，不要求 s、b 网络可逆。',
  },
];

export const chapter15AutoregressiveExercises: LearningExercise[] = [
  {
    id: 'autoregressive-factorization', difficulty: 1,
    prompt: '自回归分解 p(x)=∏ᵢp(xᵢ|x₁:ᵢ₋₁) 对第 i 个条件分布施加了什么依赖限制？',
    options: [
      { id: 'previous', label: '只能依赖排序中位于它之前的变量' },
      { id: 'future', label: '只能依赖位于它之后的变量' },
      { id: 'independent', label: '必须与所有其他变量独立' },
    ],
    correctOptionId: 'previous',
    hint: '观察条件集合 x₁:ᵢ₋₁。',
    explanation: '有序条件依赖使 Jacobian 呈三角结构，同时仍能通过链式法则表示任意联合密度。',
  },
  {
    id: 'maf-direction', difficulty: 2,
    prompt: '对给定数据 x，MAF 的哪项操作可把所有 zᵢ 并行算出？',
    options: [
      { id: 'density', label: '逆变换与密度评估' },
      { id: 'sampling', label: '从 z 开始逐维生成 x 的采样' },
      { id: 'neither', label: '二者都必须完全串行' },
    ],
    correctOptionId: 'density',
    hint: '给定 x 后，每个 conditioner 所需的 x₁:ᵢ₋₁ 是否都已知？',
    explanation: 'MAF 对给定 x 的逆变换可并行，但采样时 xᵢ 依赖此前生成的 x，因此需要 D 级顺序链。',
  },
  {
    id: 'iaf-direction', difficulty: 3,
    prompt: '若主要需求是从基分布高速生成大量样本，应优先考虑 MAF 还是 IAF？',
    options: [
      { id: 'iaf', label: 'IAF，因为给定全部 z 后各 xᵢ 可并行生成' },
      { id: 'maf', label: 'MAF，因为其采样不含任何顺序依赖' },
      { id: 'same', label: '两者的采样依赖深度始终完全相同' },
    ],
    correctOptionId: 'iaf',
    hint: 'Bishop 图 18.4(b) 中所有 z 是否能同时输入各 x 节点？',
    explanation: 'IAF 把 conditioner 依赖放在已知的 z 前缀上，所以采样可并行；代价是对任意 x 求逆与密度需要顺序计算。',
  },
];

export const chapter15ContinuousExercises: LearningExercise[] = [
  {
    id: 'continuous-residual-limit', difficulty: 1,
    prompt: '残差更新 z(t+ε)=z(t)+εf(z(t),w) 在 ε→0 时对应什么连续方程？',
    options: [
      { id: 'ode', label: 'dz(t)/dt=f(z(t),w)' },
      { id: 'algebraic', label: 'z(t)=0 对所有 t 恒成立' },
      { id: 'density', label: 'd ln p/dt=+tr(∂f/∂z)' },
    ],
    correctOptionId: 'ode',
    hint: '把两边减去 z(t)，再除以 ε 并取极限。',
    explanation: '差商极限给出神经 ODE；离散网络深度由连续时间与求解器函数评估次数取代。',
  },
  {
    id: 'continuous-density-sign', difficulty: 2,
    prompt: '若某点向量场散度 tr(∂f/∂z)>0，沿流运动时该点附近的 log 密度瞬时如何变化？',
    options: [
      { id: 'decrease', label: '下降，因为空间正在局部膨胀' },
      { id: 'increase', label: '上升，因为正散度会压缩体积' },
      { id: 'constant', label: '恒定，与散度无关' },
    ],
    correctOptionId: 'decrease',
    hint: '公式右端是负散度。',
    explanation: 'd ln p/dt=−tr(∂f/∂z)。正散度代表流线分开，单位体积内概率质量下降。',
  },
  {
    id: 'continuous-global-existence', difficulty: 3,
    prompt: '向量场局部 Lipschitz 是否足以保证任意长时间区间上的可逆流映射？',
    options: [
      { id: 'no', label: '否；还要保证解在目标区间内不发生有限时间爆破' },
      { id: 'yes', label: '是；局部唯一性自动推出全局存在性' },
      { id: 'bijection', label: '是；只要向量场函数本身是双射' },
    ],
    correctOptionId: 'no',
    hint: '考虑 dx/dt=x² 的解在 t=1/x₀ 处发生什么。',
    explanation: '局部 Lipschitz 保证局部存在唯一解，但全局可逆还要求正反向解覆盖整个目标区间；有限时间爆破会破坏这一点。',
  },
];
