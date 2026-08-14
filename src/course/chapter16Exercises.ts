import type { LearningExercise } from '@/components/ExercisePanel';

export const chapter16DeterministicExercises: LearningExercise[] = [
  {
    id: 'autoencoder-reconstruction-loss', difficulty: 1,
    prompt: '一个样本的两维重构误差 y−x 为 (0.2, −0.1)。按教材式 (19.1) 的 1/2 平方误差，它对目标的贡献是多少？',
    options: [
      { id: 'point-zero-two-five', label: '0.025' },
      { id: 'point-zero-five', label: '0.05' },
      { id: 'point-three', label: '0.3' },
    ],
    correctOptionId: 'point-zero-two-five',
    hint: '先算 0.2²+(−0.1)²，再乘 1/2。',
    explanation: 'E=1/2×(0.04+0.01)=0.025。平方误差同时惩罚两个输出维度的重构偏差。',
  },
  {
    id: 'autoencoder-sparse-penalty', difficulty: 2,
    prompt: '稀疏自编码器的 λ∑ₖ|zₖ| 与普通权重衰减最关键的区别是什么？',
    options: [
      { id: 'activations', label: '它惩罚隐藏单元激活，而不是网络参数本身' },
      { id: 'outputs', label: '它只惩罚输出层偏置' },
      { id: 'dimension', label: '它强制隐藏层维数必须小于输入维数' },
    ],
    correctOptionId: 'activations',
    hint: '教材式 (19.2) 的 zₖ 表示什么？',
    explanation: '求和对象是隐藏层单元的激活值。即使隐层过完备，激活稀疏也能阻止每个样本简单复制全部输入。',
  },
  {
    id: 'mae-masked-objective', difficulty: 3,
    prompt: '图像 MAE 预训练时，哪项描述同时正确刻画了 encoder 输入与训练损失？',
    options: [
      { id: 'visible-masked', label: 'Encoder 只处理可见 patch，损失只在被遮罩 patch 上计算' },
      { id: 'all-all', label: 'Encoder 处理所有 patch，损失只在可见 patch 上计算' },
      { id: 'masked-visible', label: 'Encoder 只处理被遮罩 patch，损失只在可见 patch 上计算' },
    ],
    correctOptionId: 'visible-masked',
    hint: '被遮罩的 patch 是模型要预测的目标，不是 encoder 已经看到的答案。',
    explanation: '可见 patch 进入 encoder；轻量 decoder 接收表示与 mask token，训练信号只来自缺失 patch。预训练后通常丢弃 decoder。',
  },
];

export const chapter16VariationalExercises: LearningExercise[] = [
  {
    id: 'vae-elbo-gap', difficulty: 1,
    prompt: '若 ln p(x|w)=−10，且 KL(q(z)||p(z|x,w))=1.5，由 ln p=𝓛+KL 可知 ELBO 𝓛 等于多少？',
    options: [
      { id: 'minus-eleven-five', label: '−11.5' },
      { id: 'minus-eight-five', label: '−8.5' },
      { id: 'minus-ten', label: '−10' },
    ],
    correctOptionId: 'minus-eleven-five',
    hint: '把非负 KL 从对数似然中减去。',
    explanation: '𝓛=−10−1.5=−11.5。近似后验越接近真实后验，KL 缝隙越小，下界越紧。',
  },
  {
    id: 'vae-reparameterization-moments', difficulty: 2,
    prompt: '若 ε∼N(0,1)，并令 z=2+0.5ε，则 z 的均值和方差分别是多少？',
    options: [
      { id: 'two-quarter', label: '均值 2，方差 0.25' },
      { id: 'two-half', label: '均值 2，方差 0.5' },
      { id: 'zero-quarter', label: '均值 0，方差 0.25' },
    ],
    correctOptionId: 'two-quarter',
    hint: '常数平移改变均值；乘 0.5 会让方差乘 0.5²。',
    explanation: 'E[z]=2，Var[z]=0.5²Var[ε]=0.25。随机性留在 ε 中，μ 与 σ 仍处于可微计算图上。',
  },
  {
    id: 'vae-beta-bound', difficulty: 3,
    prompt: '同一 q 下，重构项为 −8、KL=2。β=0.5 时 Lβ=−9，而标准 ELBO 为 −10。应该怎样解释？',
    options: [
      { id: 'not-guaranteed', label: 'β<1 的目标高于标准 ELBO，因此不再保证是 ln p(x) 的下界' },
      { id: 'tighter', label: '−9 必然是更紧且始终有效的似然下界' },
      { id: 'same', label: 'β 不会改变目标值或下界性质' },
    ],
    correctOptionId: 'not-guaranteed',
    hint: '只有由变分恒等式推导出的 β=1 目标必然满足下界。',
    explanation: '减小 KL 权重会把目标抬高到标准 ELBO 之上；它可能超过真实对数似然，所以不能继续宣称为必然下界。',
  },
];
