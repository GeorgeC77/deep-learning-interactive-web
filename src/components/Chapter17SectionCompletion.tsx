import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import type { LearningExercise } from '@/components/ExercisePanel';
import {
  chapter17ForwardExercises,
  chapter17GuidedExercises,
  chapter17ReverseExercises,
  chapter17ScoreExercises,
} from '@/course/chapter17Exercises';

type Chapter17SectionKey = 'forward' | 'reverse' | 'score' | 'guided';

const configs = {
  forward: {
    title: '分步推导：从逐步加噪到任意时刻的闭式扩散核',
    steps: [
      { label: '定义单步高斯转移', formula: String.raw`q(\mathbf z_t\mid\mathbf z_{t-1})=\mathcal N\!\left(\mathbf z_t\mid\sqrt{1-\beta_t}\,\mathbf z_{t-1},\beta_t I\right)`, explanation: '每步保留 √(1−β_t) 倍信号，并加入方差 β_t 的独立标准高斯噪声；该系数设计把均值拉向 0、协方差拉向 I。' },
      { label: '合并两次独立高斯噪声', formula: String.raw`\alpha_t=\prod_{\tau=1}^{t}(1-\beta_\tau),\qquad \operatorname{Var}(a\epsilon_1+b\epsilon_2)=(a^2+b^2)I`, explanation: '高斯变量的线性组合仍为高斯。对 t 做归纳，所有增量噪声可合并成一个新的标准高斯 ε。' },
      { label: '得到闭式扩散核', formula: String.raw`q(\mathbf z_t\mid\mathbf x)=\mathcal N\!\left(\mathbf z_t\mid\sqrt{\alpha_t}\,\mathbf x,(1-\alpha_t)I\right),\quad \mathbf z_t=\sqrt{\alpha_t}\mathbf x+\sqrt{1-\alpha_t}\boldsymbol\epsilon`, explanation: '训练可以先随机选 t，再一步构造 z_t，不需要依次执行前面的所有转移；这里的 α_t 等同于 DDPM 常写的 ᾱ_t。' },
      { label: '给定原图后反推一步', formula: String.raw`q(\mathbf z_{t-1}\mid\mathbf z_t,\mathbf x)=\mathcal N\!\left(\mathbf z_{t-1}\mid\mathbf m_t(\mathbf x,\mathbf z_t),\sigma_t^2I\right)`, explanation: '加入训练样本 x 后，Bayes 分子中的两个因子都是关于 z_{t−1} 的高斯；配方得到教材式 (20.15)–(20.17)，为训练反向解码器提供可解目标。' },
    ],
    exerciseSetId: 'chapter17-forward',
    description: '计算扩散矩、累积信号系数，并解释为何加入原图条件后反向后验才可解析。',
    exercises: chapter17ForwardExercises,
  },
  reverse: {
    title: '分步推导：从不可解似然到噪声预测与反向采样',
    steps: [
      { label: '用神经网络近似反向转移', formula: String.raw`p(\mathbf z_{t-1}\mid\mathbf z_t;\mathbf w)=\mathcal N\!\left(\mathbf z_{t-1}\mid\boldsymbol\mu(\mathbf z_t;\mathbf w,t),\beta_t I\right)`, explanation: '小 β_t 下真实反向条件可局部近似为高斯；时间索引 t 必须输入同一个网络，以适应不同噪声层级。' },
      { label: '把 ELBO 写成局部一致性', formula: String.raw`\mathcal L=\mathbb E_q[\log p(\mathbf x\mid\mathbf z_1)]-\sum_{t=2}^{T}\mathbb E_{q(\mathbf z_t\mid\mathbf x)}\mathrm{KL}\!\left(q(\mathbf z_{t-1}\mid\mathbf z_t,\mathbf x)\Vert p(\mathbf z_{t-1}\mid\mathbf z_t;\mathbf w)\right)`, explanation: '固定的前向链充当变分分布；重构项处理最后一步，每个 KL 则让学习到的反向高斯贴近可解析后验。' },
      { label: '改写均值为总噪声预测', formula: String.raw`\boldsymbol\mu=\frac1{\sqrt{1-\beta_t}}\!\left(\mathbf z_t-\frac{\beta_t}{\sqrt{1-\alpha_t}}\,g(\mathbf z_t;\mathbf w,t)\right),\quad L_{\mathrm{simple}}=\mathbb E\lVert g-\boldsymbol\epsilon\rVert^2`, explanation: '目标 ε 是从 N(0,I) 采样的总噪声，而输入 z_t 仍依赖数据与 t。删除 ELBO 的时间权重会得到常用简化代理目标，但不再逐项等于原 ELBO。' },
      { label: '区分训练与生成', formula: String.raw`\text{train: }(\mathbf x,t,\epsilon)\mapsto\lVert g(\mathbf z_t,t)-\epsilon\rVert^2;\qquad \text{sample: }\mathbf z_T\sim\mathcal N(0,I),\ t=T\rightarrow1`, explanation: '训练可随机抽一个 t 并行完成；生成必须按时间逆序多次调用网络。中间反向步采样随机项，最终得到无噪声 x 时不再额外加噪。' },
    ],
    exerciseSetId: 'chapter17-reverse',
    description: '连接 ELBO 缝隙、加权与简化噪声目标，并掌握 Algorithm 20.1/20.2 的不同时间方向。',
    exercises: chapter17ReverseExercises,
  },
  score: {
    title: '分步推导：从未知数据分数到可训练的去噪分数匹配',
    steps: [
      { label: '定义数据方向上的梯度', formula: String.raw`\mathbf s(\mathbf x)=\nabla_{\mathbf x}\log p(\mathbf x),\qquad J=\frac12\mathbb E_p\lVert\mathbf s_\mathbf w(\mathbf x)-\nabla_{\mathbf x}\log p(\mathbf x)\rVert^2`, explanation: '分数与输入同维并指向 log 密度上升最快方向；归一化常数被输入梯度消去，但真实数据密度未知。' },
      { label: '用噪声核平滑经验分布', formula: String.raw`q_\sigma(\mathbf z)=\int q(\mathbf z\mid\mathbf x;\sigma)p(\mathbf x)\,d\mathbf x`, explanation: 'Dirac 脉冲组成的经验密度不可微。Parzen 高斯核把样本点扩散成平滑密度，使条件核的分数可以解析计算。' },
      { label: '改为条件核监督', formula: String.raw`\nabla_{\mathbf z_t}\log q(\mathbf z_t\mid\mathbf x)=-\frac{\boldsymbol\epsilon}{\sqrt{1-\alpha_t}},\qquad \mathbf s_\mathbf w\approx-\frac{\mathbb E[\boldsymbol\epsilon\mid\mathbf z_t]}{\sqrt{1-\alpha_t}}`, explanation: '去噪分数匹配目标与平滑边缘分数目标只差与参数无关的常数；单次 ε 是无偏训练标签，不等于给定 z_t 的边缘分数。' },
      { label: '从噪声梯度进入连续时间', formula: String.raw`d\mathbf z=\{\mathbf f(\mathbf z,t)-g^2(t)\nabla_{\mathbf z}\log p_t(\mathbf z)\}\,dt+g(t)\,d\bar{\mathbf v}`, explanation: '多噪声尺度解决流形外、低密度和不连通模式问题；连续极限的反向 SDE 直接用学得分数把噪声输运回数据。' },
    ],
    exerciseSetId: 'chapter17-score',
    description: '计算高斯分数与扩散缩放，并用噪声阶梯解释退火 Langevin 采样的必要性。',
    exercises: chapter17ScoreExercises,
  },
  guided: {
    title: '分步推导：用条件梯度控制对齐与多样性的权衡',
    steps: [
      { label: '对 Bayes 公式取输入梯度', formula: String.raw`\nabla_{\mathbf x}\log p(\mathbf x\mid\mathbf c)=\nabla_{\mathbf x}\log p(\mathbf x)+\nabla_{\mathbf x}\log p(\mathbf c\mid\mathbf x)`, explanation: 'p(c) 与 x 无关，因此其梯度为零；分类器梯度提供朝目标类别增加概率的方向。' },
      { label: '加入可控分类器引导', formula: String.raw`\operatorname{score}(\mathbf x,\mathbf c;\lambda)=\nabla\log p(\mathbf x)+\lambda\nabla\log p(\mathbf c\mid\mathbf x)`, explanation: 'λ=0 是无条件模型，λ=1 对应条件分数；λ>1 更强调条件匹配，但更偏向容易分类的样本并降低多样性。' },
      { label: '消去外部分类型模型', formula: String.raw`\operatorname{score}(\mathbf x,\mathbf c;\lambda)=\lambda\nabla\log p(\mathbf x\mid\mathbf c)+(1-\lambda)\nabla\log p(\mathbf x)`, explanation: '把 Bayes 分解代回引导式。0<λ<1 是凸组合，λ>1 时无条件项系数为负，主动压低忽略条件的样本。' },
      { label: '用一个网络获得两种预测', formula: String.raw`\widehat\epsilon=\epsilon_{\mathrm{unc}}+w(\epsilon_{\mathrm{cond}}-\epsilon_{\mathrm{unc}})`, explanation: '训练时随机把条件置空，让同一网络同时学会有条件和无条件预测。w>1 沿两者之差外推；更强对齐通常以多样性和自然度为代价。' },
    ],
    exerciseSetId: 'chapter17-guided',
    description: '推导两类 guidance，计算外推结果，并解释空条件训练为何能替代独立分类器。',
    exercises: chapter17GuidedExercises,
  },
} satisfies Record<Chapter17SectionKey, {
  title: string;
  steps: { label: string; formula: string; explanation: string }[];
  exerciseSetId: string;
  description: string;
  exercises: LearningExercise[];
}>;

export default function Chapter17SectionCompletion({ sectionKey }: { sectionKey: Chapter17SectionKey }) {
  const config = configs[sectionKey];
  return (
    <>
      <DerivationStepper title={config.title} steps={config.steps} />
      <ExercisePanel exerciseSetId={config.exerciseSetId} title="主动练习" description={config.description} exercises={config.exercises} />
    </>
  );
}
