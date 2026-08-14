import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import type { LearningExercise } from '@/components/ExercisePanel';
import {
  chapter16DeterministicExercises,
  chapter16VariationalExercises,
} from '@/course/chapter16Exercises';

type Chapter16SectionKey = 'deterministic' | 'variational';

const configs = {
  deterministic: {
    title: '分步推导：自编码器如何从重构走向非平凡表示',
    steps: [
      {
        label: '建立编码与重构目标',
        formula: String.raw`\mathbf z=f_\phi(\mathbf x),\quad \mathbf y=g_\theta(\mathbf z),\quad E=\frac12\sum_{n=1}^{N}\lVert\mathbf y(\mathbf x_n)-\mathbf x_n\rVert^2`,
        explanation: '输入本身就是监督目标；若没有容量或训练约束，足够宽的网络可能只学到恒等映射。',
      },
      {
        label: '用瓶颈连接 PCA',
        formula: String.raw`M<D,\qquad \operatorname{span}(W_{\mathrm{enc}})=\operatorname{span}(\mathbf u_1,\ldots,\mathbf u_M)`,
        explanation: '欠完备线性自编码器在平方误差下恢复 PCA 主子空间，但编码器与解码器的因子分解不唯一，隐坐标不必等于正交 PCA 坐标。',
      },
      {
        label: '对表示或输入施加约束',
        formula: String.raw`\widetilde E=E+\lambda\sum_k|z_k|,\qquad E_{\mathrm{denoise}}=\sum_n\lVert\mathbf y(\widetilde{\mathbf x}_n)-\mathbf x_n\rVert^2`,
        explanation: '稀疏自编码器限制激活；去噪自编码器要求从受损输入恢复干净目标，两者都迫使模型利用数据结构。',
      },
      {
        label: '把损失聚焦到缺失 patch',
        formula: String.raw`L_{\mathrm{MAE}}=\frac1{|\mathcal M|}\sum_{i\in\mathcal M}\lVert x_i-\widehat x_i\rVert^2`,
        explanation: 'MAE encoder 只接收可见 patch，decoder 预测全部 patch，但损失只评价遮罩集合；预训练后保留 encoder 做下游任务。',
      },
    ],
    exerciseSetId: 'chapter16-deterministic',
    description: '计算重构误差，并区分瓶颈、激活稀疏、去噪与遮罩预训练各自阻止恒等复制的机制。',
    exercises: chapter16DeterministicExercises,
  },
  variational: {
    title: '分步推导：从不可解似然到可训练的 VAE',
    steps: [
      {
        label: '写出隐变量似然',
        formula: String.raw`p(\mathbf x\mid\mathbf w)=\int p(\mathbf x\mid\mathbf z,\mathbf w)p(\mathbf z)\,d\mathbf z`,
        explanation: '深度 decoder 让这个积分通常无法解析计算，因此不能直接最大化精确对数似然。',
      },
      {
        label: '引入任意近似后验',
        formula: String.raw`\ln p(\mathbf x\mid\mathbf w)=\mathcal L+\mathrm{KL}\!\left(q(\mathbf z)\Vert p(\mathbf z\mid\mathbf x,\mathbf w)\right)\ge\mathcal L`,
        explanation: 'KL 非负，所以 𝓛 是下界；它与真实对数似然之间的缝隙正是近似后验到真实后验的 KL。',
      },
      {
        label: '用 encoder 摊销推断并重参数化',
        formula: String.raw`q_\phi(\mathbf z\mid\mathbf x)=\prod_j\mathcal N(z_j\mid\mu_j,\sigma_j^2),\qquad \mathbf z=\boldsymbol\mu_\phi(\mathbf x)+\boldsymbol\sigma_\phi(\mathbf x)\odot\boldsymbol\epsilon`,
        explanation: '一个 encoder 为所有样本输出分布参数；ε∼N(0,I) 承担随机性，使梯度能沿 μ、σ 的显式路径传播。',
      },
      {
        label: '得到可估计的训练目标',
        formula: String.raw`\mathcal L\simeq\ln p_\theta(\mathbf x\mid\mathbf z)-\frac12\sum_j\left(\mu_j^2+\sigma_j^2-1-\ln\sigma_j^2\right)`,
        explanation: '重构项用 Monte Carlo 样本估计，标准高斯 KL 可解析计算；若 KL 逼近零且 decoder 忽略 z，就出现 posterior collapse。',
      },
    ],
    exerciseSetId: 'chapter16-variational',
    description: '连接 ELBO 缝隙、重参数化矩与 β 目标的下界边界，避免只记“重构减 KL”。',
    exercises: chapter16VariationalExercises,
  },
} satisfies Record<Chapter16SectionKey, {
  title: string;
  steps: { label: string; formula: string; explanation: string }[];
  exerciseSetId: string;
  description: string;
  exercises: LearningExercise[];
}>;

export default function Chapter16SectionCompletion({ sectionKey }: { sectionKey: Chapter16SectionKey }) {
  const config = configs[sectionKey];
  return (
    <>
      <DerivationStepper title={config.title} steps={config.steps} />
      <ExercisePanel
        exerciseSetId={config.exerciseSetId}
        title="主动练习"
        description={config.description}
        exercises={config.exercises}
      />
    </>
  );
}
