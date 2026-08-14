import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import {
  chapter13ElboExercises,
  chapter13NonlinearExercises,
  chapter13PcaExercises,
  chapter13ProbabilisticExercises,
} from '@/course/chapter13Exercises';

type Chapter13SectionKey = 'pca' | 'probabilistic' | 'elbo' | 'nonlinear';

const configs = {
  pca: {
    title: '分步推导：最大方差为何给出最小重构误差',
    steps: [
      { label: '中心化与协方差', formula: String.raw`\bar{\mathbf x}=\frac1N\sum_n\mathbf x_n,\qquad\mathbf S=\frac1N\sum_n(\mathbf x_n-\bar{\mathbf x})(\mathbf x_n-\bar{\mathbf x})^T`, explanation: '中心化把均值平移与数据内部变化分开，S 编码每个方向上的样本方差。' },
      { label: '写出投影方差', formula: String.raw`\operatorname{Var}(\mathbf u^T\mathbf x)=\mathbf u^T\mathbf S\mathbf u,\qquad\mathbf u^T\mathbf u=1`, explanation: '单位向量约束排除了仅靠放大 u 来增大投影方差的无意义解。' },
      { label: '拉格朗日驻点', formula: String.raw`\nabla_{\mathbf u}(\mathbf u^T\mathbf S\mathbf u-\lambda(\mathbf u^T\mathbf u-1))=0\Rightarrow\mathbf S\mathbf u=\lambda\mathbf u`, explanation: '候选主方向必须是协方差矩阵特征向量，最大特征值对应第一主成分。' },
      { label: '扩展到 M 维', formula: String.raw`J_M^{\min}=\sum_{i=M+1}^{D}\lambda_i,\qquad \lambda_1\ge\cdots\ge\lambda_D`, explanation: '保留最大的 M 个特征值既最大化保留方差，也让被丢弃方差之和最小。' },
    ],
    exerciseSetId: 'chapter13-pca', description: '连接中心化、特征方向、重构误差与白化的数值含义。', exercises: chapter13PcaExercises,
  },
  probabilistic: {
    title: '分步推导：线性高斯隐变量的边缘分布',
    steps: [
      { label: '定义生成过程', formula: String.raw`\mathbf z\sim\mathcal N(\mathbf0,\mathbf I),\qquad\mathbf x=\mathbf W\mathbf z+\boldsymbol\mu+\boldsymbol\epsilon`, explanation: '低维 z 表示共享生成因素，ε 表示无法由共享因素解释的观测噪声。' },
      { label: '求边缘均值', formula: String.raw`\mathbb E[\mathbf x]=\mathbf W\mathbb E[\mathbf z]+\boldsymbol\mu+\mathbb E[\boldsymbol\epsilon]=\boldsymbol\mu`, explanation: '潜变量和噪声均为零均值，因此观测中心由 μ 决定。' },
      { label: '求边缘协方差', formula: String.raw`\operatorname{cov}(\mathbf x)=\mathbf W\mathbf W^T+\boldsymbol\Psi`, explanation: 'WWᵀ 产生跨维度共享相关，Ψ 描述各观测维自身的剩余噪声。' },
      { label: '识别 PPCA 特例', formula: String.raw`\boldsymbol\Psi=\sigma^2\mathbf I\Rightarrow p(\mathbf x)=\mathcal N(\boldsymbol\mu,\mathbf W\mathbf W^T+\sigma^2\mathbf I)`, explanation: '各向同性噪声给出概率 PCA；一般对角 Ψ 则是因子分析。' },
    ],
    exerciseSetId: 'chapter13-probabilistic', description: '从生成过程推到边缘协方差，并区分 PPCA、因子分析与 ICA。', exercises: chapter13ProbabilisticExercises,
  },
  elbo: {
    title: '分步推导：ELBO 如何导出连续隐变量 EM',
    steps: [
      { label: '插入任意 q', formula: String.raw`\log p(\mathbf x)=\int q(\mathbf z)\log\frac{p(\mathbf x,\mathbf z)}{q(\mathbf z)}\,d\mathbf z+\mathrm{KL}(q\|p(\mathbf z\mid\mathbf x))`, explanation: '加减 log q 后取期望，把证据分成可优化项和非负差距。' },
      { label: '定义下界', formula: String.raw`\mathcal L(q,\boldsymbol\theta)=\mathbb E_q[\log p(\mathbf x,\mathbf z\mid\boldsymbol\theta)]-\mathbb E_q[\log q(\mathbf z)]`, explanation: 'KL 非负，所以 L 不超过 log p(x)；连续隐变量只把离散求和换成积分。' },
      { label: 'E 步收紧', formula: String.raw`q^{\mathrm{new}}(\mathbf z)=p(\mathbf z\mid\mathbf x,\boldsymbol\theta^{\mathrm{old}})\Rightarrow\mathrm{KL}=0`, explanation: '线性高斯模型的真实后验仍是高斯，因此可闭式求出均值和协方差。' },
      { label: 'M 步抬高', formula: String.raw`\boldsymbol\theta^{\mathrm{new}}=\arg\max_{\boldsymbol\theta}\mathbb E_{q^{\mathrm{new}}}[\log p(\mathbf x,\mathbf z\mid\boldsymbol\theta)]`, explanation: '固定 q 更新 W 和噪声参数会抬高下界，从而保证观测数据似然不下降。' },
    ],
    exerciseSetId: 'chapter13-elbo', description: '掌握下界差距、E/M 两步与 PPCA 后验收缩。', exercises: chapter13ElboExercises,
  },
  nonlinear: {
    title: '分步推导：难解似然如何分化出四类生成方法',
    steps: [
      { label: '写出边缘似然', formula: String.raw`p(\mathbf x)=\int p(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z`, explanation: '深度非线性解码器通常让这个积分无法解析求值，也难以直接最大化。' },
      { label: '保留精确密度', formula: String.raw`\mathbf x=g(\mathbf z),\ g\ \text{可逆}\Rightarrow p_x(\mathbf x)=p_z(g^{-1}(\mathbf x))\left|\det\frac{\partial g^{-1}}{\partial\mathbf x}\right|`, explanation: 'Normalizing Flow 用同维可逆结构换取精确似然与直接采样。' },
      { label: '改用近似或对抗', formula: String.raw`\text{VAE: }\log p(\mathbf x)\ge\mathcal L(q),\qquad\text{GAN: discriminator training signal}`, explanation: 'VAE 用编码器构造下界；GAN 放弃显式似然，由判别器指导生成器。' },
      { label: '学习多步去噪', formula: String.raw`\mathbf x_T\sim\mathcal N(\mathbf0,\mathbf I)\xrightarrow{\text{iterative denoising}}\mathbf x_0`, explanation: 'Diffusion 以多步逆向去噪获得强表达能力，但采样成本通常高于一次前向生成。' },
    ],
    exerciseSetId: 'chapter13-nonlinear', description: '比较 GAN、VAE、Flow 与 Diffusion 的似然、采样和结构约束。', exercises: chapter13NonlinearExercises,
  },
} satisfies Record<Chapter13SectionKey, {
  title: string;
  steps: { label: string; formula: string; explanation: string }[];
  exerciseSetId: string;
  description: string;
  exercises: typeof chapter13PcaExercises;
}>;

export default function Chapter13SectionCompletion({ sectionKey }: { sectionKey: Chapter13SectionKey }) {
  const config = configs[sectionKey];
  return (
    <>
      <DerivationStepper title={config.title} steps={config.steps} />
      <ExercisePanel exerciseSetId={config.exerciseSetId} title="主动练习" description={config.description} exercises={config.exercises} />
    </>
  );
}
