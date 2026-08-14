import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import type { LearningExercise } from '@/components/ExercisePanel';
import {
  chapter15AutoregressiveExercises,
  chapter15ContinuousExercises,
  chapter15CouplingExercises,
} from '@/course/chapter15Exercises';

type Chapter15SectionKey = 'coupling' | 'autoregressive' | 'continuous';

const configs = {
  coupling: {
    title: '分步推导：仿射耦合为何既灵活又可逆',
    steps: [
      { label: '从变量替换出发', formula: String.raw`p_x(\mathbf x)=p_z(g(\mathbf x))\left|\det\frac{\partial g}{\partial\mathbf x}\right|`, explanation: '教材式 (18.1) 使用逆映射 z=g(x) 的 Jacobian；若改用正向 K=∂f/∂z，则行列式取倒数。' },
      { label: '划分并仿射变换', formula: String.raw`\mathbf x_A=\mathbf z_A,\qquad\mathbf x_B=e^{\mathbf s(\mathbf z_A)}\odot\mathbf z_B+\mathbf b(\mathbf z_A)`, explanation: '复制 A 块，同时让 B 块的缩放和平移由 A 块的任意神经网络决定。' },
      { label: '直接写出逆映射', formula: String.raw`\mathbf z_A=\mathbf x_A,\qquad\mathbf z_B=e^{-\mathbf s(\mathbf x_A)}\odot(\mathbf x_B-\mathbf b(\mathbf x_A))`, explanation: 'x_A 已知，所以可重新计算 s 与 b；conditioner 本身无需可逆。' },
      { label: '利用块三角结构', formula: String.raw`\log|\det K_f|=\sum_i s_i,\qquad\log p_x=\log p_z-\sum_i s_i`, explanation: '正向 Jacobian 的对角块为 exp(s)，行列式只需 O(D) 求和，而不必计算一般稠密行列式。' },
    ],
    exerciseSetId: 'chapter15-coupling',
    description: '检查正逆 Jacobian 的符号、仿射逆映射和 conditioner 无需可逆的原因。',
    exercises: chapter15CouplingExercises,
  },
  autoregressive: {
    title: '分步推导：同一三角结构为何产生 MAF/IAF 的速度反转',
    steps: [
      { label: '选择有序分解', formula: String.raw`p(x_1,\ldots,x_D)=\prod_{i=1}^{D}p(x_i\mid\mathbf x_{1:i-1})`, explanation: '链式法则把联合密度写为有序条件分布，为三角依赖结构提供概率解释。' },
      { label: '构造 MAF 正向', formula: String.raw`x_i=h\!\left(z_i,g_i(\mathbf x_{1:i-1})\right)`, explanation: '采样 x_i 前必须已有 x 的前缀，因此生成是一条 D 级顺序链。' },
      { label: '并行评估 MAF 密度', formula: String.raw`z_i=h^{-1}\!\left(x_i,g_i(\mathbf x_{1:i-1})\right)`, explanation: '给定完整 x 时所有前缀都已知，可并行求 z_i；Jacobian 为三角阵，行列式是对角元乘积。' },
      { label: '反向得到 IAF', formula: String.raw`x_i=h\!\left(z_i,\widetilde g_i(\mathbf z_{1:i-1})\right)`, explanation: '给定完整 z 后 IAF 可并行采样，但对任意 x 求逆与密度需要逐维恢复 z。' },
    ],
    exerciseSetId: 'chapter15-autoregressive',
    description: '掌握有序因子分解、三角 Jacobian 以及 MAF/IAF 的密度与采样方向。',
    exercises: chapter15AutoregressiveExercises,
  },
  continuous: {
    title: '分步推导：从残差层到连续归一化流',
    steps: [
      { label: '缩小残差步长', formula: String.raw`\mathbf z(t+\epsilon)=\mathbf z(t)+\epsilon f(\mathbf z(t),\mathbf w)\Rightarrow\frac{d\mathbf z}{dt}=f(\mathbf z(t),\mathbf w)`, explanation: '当层间时间步趋于零，残差网络变成由数值求解器积分的神经 ODE。' },
      { label: '积分得到流映射', formula: String.raw`\mathbf z(T)=\mathbf z(0)+\int_0^T f(\mathbf z(t),\mathbf w)\,dt`, explanation: 'ODE 解的存在唯一性让有限时间流映射可逆；向量场 f 本身不必是双射。' },
      { label: '连续时间反向传播', formula: String.raw`\mathbf a(t)=\frac{\partial L}{\partial\mathbf z(t)},\qquad\frac{d\mathbf a}{dt}=-\left(\frac{\partial f}{\partial\mathbf z}\right)^{\!T}\mathbf a`, explanation: '伴随敏感性方法反向积分增广 ODE，避免保存前向求解器的全部中间状态。' },
      { label: '追踪瞬时密度', formula: String.raw`\frac{d\log p(\mathbf z(t))}{dt}=-\operatorname{Tr}\!\left(\frac{\partial f}{\partial\mathbf z(t)}\right),\quad\operatorname{Tr}(A)=\mathbb E_{\epsilon}[\epsilon^TA\epsilon]`, explanation: '连续流用 trace 代替离散流的 determinant；Hutchinson 估计避免显式构造完整 Jacobian。' },
    ],
    exerciseSetId: 'chapter15-continuous',
    description: '连接残差极限、ODE 流映射、负散度密度公式与全局存在性边界。',
    exercises: chapter15ContinuousExercises,
  },
} satisfies Record<Chapter15SectionKey, {
  title: string;
  steps: { label: string; formula: string; explanation: string }[];
  exerciseSetId: string;
  description: string;
  exercises: LearningExercise[];
}>;

export default function Chapter15SectionCompletion({ sectionKey }: { sectionKey: Chapter15SectionKey }) {
  const config = configs[sectionKey];
  return (
    <>
      <DerivationStepper title={config.title} steps={config.steps} />
      <ExercisePanel exerciseSetId={config.exerciseSetId} title="主动练习" description={config.description} exercises={config.exercises} />
    </>
  );
}
