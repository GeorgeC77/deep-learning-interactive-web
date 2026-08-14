import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter14AdversarialExercises: LearningExercise[] = [
  {
    id: 'gan-optimal-discriminator',
    difficulty: 1,
    prompt: '在某个位置 x，若 p_data(x)=0.6、p_G(x)=0.2，固定生成器时最优判别器 D*(x) 是多少？',
    options: [
      { id: 'three-quarters', label: '0.75' },
      { id: 'one-half', label: '0.50' },
      { id: 'one-quarter', label: '0.25' },
    ],
    correctOptionId: 'three-quarters',
    hint: '把两个密度代入 D*(x)=p_data(x)/(p_data(x)+p_G(x))。',
    explanation: 'D*(x)=0.6/(0.6+0.2)=0.75。最优输出比较的是同一点上真实密度与生成密度的相对大小。',
  },
  {
    id: 'gan-opposite-update-signs',
    difficulty: 2,
    prompt: '为什么同一个 GAN 误差对判别器参数和生成器参数使用相反的更新符号？',
    options: [
      { id: 'zero-sum', label: '判别器要降低分类误差，而生成器要提高判别器对生成样本的分类误差' },
      { id: 'same-model', label: '因为生成器与判别器其实共享全部参数' },
      { id: 'remove-gradient', label: '为了让两个网络的梯度都恒为零' },
    ],
    correctOptionId: 'zero-sum',
    hint: '回忆“鉴定者”和“造假者”的目标是否相同。',
    explanation: '判别器沿误差下降方向更新，生成器却要让判别器犯错，因此沿同一误差关于生成器参数的上升方向更新。',
  },
  {
    id: 'gan-nonsaturating-gradient',
    difficulty: 3,
    prompt: '训练早期 D(G(z))≈0.01 时，哪种生成器目标通常提供更强的 logit 梯度？',
    options: [
      { id: 'non-saturating', label: '非饱和目标 −ln D(G(z))' },
      { id: 'minimax', label: '原始 minimax 目标 ln(1−D(G(z)))' },
      { id: 'identical', label: '二者在所有 D 上梯度完全相同' },
    ],
    correctOptionId: 'non-saturating',
    hint: '比较 −D 与 −(1−D) 在 D 接近 0 时的绝对值。',
    explanation: 'minimax 的 logit 梯度约为 −0.01，而非饱和目标约为 −0.99；后者避免生成器在训练早期几乎得不到信号。',
  },
];

export const chapter14ImageExercises: LearningExercise[] = [
  {
    id: 'cyclegan-unpaired-signal',
    difficulty: 1,
    prompt: 'CycleGAN 没有成对的 (x,y) 样本时，什么约束仍能把单个输入与其往返重建联系起来？',
    options: [
      { id: 'cycle', label: '循环一致性：F(G(x))≈x 且 G(F(y))≈y' },
      { id: 'paired', label: '逐像素的成对监督标签' },
      { id: 'classification', label: '固定类别交叉熵' },
    ],
    correctOptionId: 'cycle',
    hint: '先翻译到目标域，再翻译回原域。',
    explanation: '循环一致性用每张图自身构造往返重建目标，因此不要求同一场景在两个域中成对出现。',
  },
  {
    id: 'cyclegan-weight-tradeoff',
    difficulty: 2,
    prompt: '候选 A 的对抗误差为 0.9、循环误差为 0.35；候选 B 分别为 1.6、0.05。循环权重为 4 时总误差更小的是谁？',
    options: [
      { id: 'shortcut', label: '候选 B：1.6+4×0.05=1.8' },
      { id: 'semantic', label: '候选 A：0.9+4×0.35=2.3' },
      { id: 'tie', label: '两者相同' },
    ],
    correctOptionId: 'shortcut',
    hint: '分别计算 L_adv+ηL_cyc，不要只比较其中一项。',
    explanation: '权重 4 时 B 的总误差 1.8 小于 A 的 2.3；较大的循环权重可能偏爱可逆但语义不正确的捷径。',
  },
  {
    id: 'cyclegan-semantic-limit',
    difficulty: 3,
    prompt: '若两个映射能把颜色通道做可逆置换，使循环误差为零，这是否足以证明翻译语义正确？',
    options: [
      { id: 'no', label: '否；可逆性只保证能还原，不保证目标域语义正确' },
      { id: 'yes', label: '是；循环误差为零必然唯一确定语义映射' },
      { id: 'paired-only', label: '是；而且这等价于拥有成对数据' },
    ],
    correctOptionId: 'no',
    hint: '想象一种可以无损编码输入、却不像目标域真实图像的双向变换。',
    explanation: '循环一致性约束的是往返可恢复性。语义仍依赖对抗分布匹配、架构偏置与数据假设，零循环误差不是语义保证。',
  },
];
