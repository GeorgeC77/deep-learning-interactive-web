import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import type { LearningExercise } from '@/components/ExercisePanel';
import AppendixFoundationsLab from '@/components/demos/AppendixFoundationsLab';
import {
  appendixAExercises,
  appendixBExercises,
  appendixCExercises,
} from '@/course/appendixExercises';

type AppendixKey = 'a' | 'b' | 'c';

const configs = {
  a: {
    title: '分步推导：从矩阵恒等式到谱分解',
    steps: [
      {
        label: '保持乘法次序',
        formula: String.raw`(AB)^T=B^TA^T,\qquad(AB)^{-1}=B^{-1}A^{-1}`,
        explanation: '转置和求逆都会反转乘法顺序。验证恒等式最可靠的方法是乘回原矩阵，检查结果是否为单位矩阵。',
      },
      {
        label: '用迹与行列式压缩结构',
        formula: String.raw`\operatorname{Tr}(ABC)=\operatorname{Tr}(BCA),\qquad|AB|=|A||B|`,
        explanation: '迹保持循环置换而非任意排列；行列式把矩阵乘法转成标量乘法，是 log-determinant 与变量变换公式的基础。',
      },
      {
        label: '从乘积法则导出矩阵导数',
        formula: String.raw`\frac{\partial A^{-1}}{\partial x}=-A^{-1}\frac{\partial A}{\partial x}A^{-1},\qquad\frac{\partial\ln|A|}{\partial x}=\operatorname{Tr}\!\left(A^{-1}\frac{\partial A}{\partial x}\right)`,
        explanation: '对 A⁻¹A=I 求导并整理得到逆矩阵导数；log-determinant 导数则把体积变化转成可计算的迹。',
      },
      {
        label: '对称矩阵进入特征基',
        formula: String.raw`A=U\Lambda U^T,\quad A^{-1}=U\Lambda^{-1}U^T,\quad |A|=\prod_i\lambda_i,\quad\operatorname{Tr}(A)=\sum_i\lambda_i`,
        explanation: '实对称矩阵可选取正交特征向量；正定性等价于全部特征值为正，但矩阵元素全为正并不能推出正定。',
      },
    ],
    exerciseSetId: 'appendix-a',
    description: '检查乘法次序、迹的循环边界、log-determinant 梯度与对称矩阵谱性质。',
    exercises: appendixAExercises,
  },
  b: {
    title: '分步推导：从函数扰动到 Euler–Lagrange 方程',
    steps: [
      {
        label: '把函数作为优化变量',
        formula: String.raw`F[y+\epsilon\eta]=F[y]+\epsilon\int\frac{\delta F}{\delta y(x)}\eta(x)\,dx+O(\!\epsilon^2)`,
        explanation: '泛函接收整条函数 y(x) 并返回标量；η(x) 是任意允许扰动，泛函导数是普通梯度在连续指标上的对应物。',
      },
      {
        label: '利用扰动的任意性',
        formula: String.raw`\int\frac{\delta F}{\delta y(x)}\eta(x)\,dx=0\ \ \forall\eta\quad\Longrightarrow\quad\frac{\delta F}{\delta y(x)}=0`,
        explanation: '如果某处的泛函导数非零，就可选择只在该邻域非零且同号的 η 使积分不为零，因此驻点要求它处处消失。',
      },
      {
        label: '对导数扰动做分部积分',
        formula: String.raw`F[y]=\int G(y,y',x)\,dx,\quad\int\frac{\partial G}{\partial y'}\eta'\,dx=-\int\frac{d}{dx}\!\left(\frac{\partial G}{\partial y'}\right)\eta\,dx`,
        explanation: '固定端点意味着 η 在边界为零，所以分部积分的边界项消失；若端点不固定，还需加入相应自然边界条件。',
      },
      {
        label: '读出驻函数方程',
        formula: String.raw`\frac{\partial G}{\partial y}-\frac{d}{dx}\!\left(\frac{\partial G}{\partial y'}\right)=0`,
        explanation: '这就是 Euler–Lagrange 方程。它给出必要驻点条件，具体函数解仍由微分方程与边界条件共同确定。',
      },
    ],
    exerciseSetId: 'appendix-b',
    description: '区分函数与泛函，掌握任意扰动、分部积分和边界条件在变分推导中的作用。',
    exercises: appendixBExercises,
  },
  c: {
    title: '分步推导：从约束曲面法向到 KKT 条件',
    steps: [
      {
        label: '识别约束曲面的法向',
        formula: String.raw`g(\mathbf x+\boldsymbol\epsilon)\simeq g(\mathbf x)+\boldsymbol\epsilon^T\nabla g(\mathbf x),\quad g(\mathbf x+\boldsymbol\epsilon)=g(\mathbf x)=0`,
        explanation: '沿约束曲面的任意切向位移 ε 都与 ∇g 正交，所以 ∇g 是约束曲面的法向量。',
      },
      {
        label: '令目标梯度与约束法向平行',
        formula: String.raw`\mathcal L(\mathbf x,\lambda)=f(\mathbf x)+\lambda g(\mathbf x),\qquad\nabla_{\mathbf x}\mathcal L=0,\quad\frac{\partial\mathcal L}{\partial\lambda}=g(\mathbf x)=0`,
        explanation: '等式约束驻点处，沿任何可行切向都不能继续改善目标，因此 ∇f 必须与 ∇g 平行或反平行；λ 没有固定符号。',
      },
      {
        label: '联立求解教材示例',
        formula: String.raw`f=1-x_1^2-x_2^2,\ g=x_1+x_2-1\Rightarrow -2x_1+\lambda=0,\ -2x_2+\lambda=0,\ g=0`,
        explanation: '前两个方程给出 x₁=x₂，约束再给出 x₁=x₂=1/2，并可求得 λ=1。',
      },
      {
        label: '扩展到不等式约束',
        formula: String.raw`g(\mathbf x)\ge0,\qquad\lambda\ge0,\qquad\lambda g(\mathbf x)=0`,
        explanation: '按教材的最大化与 g≥0 约定：内部解约束不活跃且 λ=0；边界解 g=0 且 λ 可为正。若改写目标方向或不等式方向，Lagrangian 的符号约定也要同步改变。',
      },
    ],
    exerciseSetId: 'appendix-c',
    description: '连接几何法向、等式乘子、教材数值例题与不等式约束的互补松弛。',
    exercises: appendixCExercises,
  },
} satisfies Record<AppendixKey, {
  title: string;
  steps: { label: string; formula: string; explanation: string }[];
  exerciseSetId: string;
  description: string;
  exercises: LearningExercise[];
}>;

export default function AppendixSectionCompletion({ appendix }: { appendix: AppendixKey }) {
  const config = configs[appendix];
  return (
    <>
      <AppendixFoundationsLab appendix={appendix} />
      <DerivationStepper title={config.title} steps={config.steps} />
      <ExercisePanel exerciseSetId={config.exerciseSetId} title="主动练习" description={config.description} exercises={config.exercises} />
    </>
  );
}
