import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import {
  regressionBiasVarianceExercises,
  regressionDecisionExercises,
  regressionLinearExercises,
} from '@/course/regressionChapterExercises';

type RegressionSectionKey = 'linear' | 'decision' | 'biasVariance';

const completionConfigs = {
  linear: {
    title: '分步推导：从高斯似然到正则化正规方程',
    steps: [
      {
        label: '写出噪声模型',
        formula: String.raw`t_n=\mathbf w^T\boldsymbol\phi(\mathbf x_n)+\epsilon_n,\quad \epsilon_n\sim\mathcal N(0,\beta^{-1})`,
        explanation: '独立同方差高斯噪声把每个目标值表示为模型输出附近的随机扰动。',
      },
      {
        label: '取负对数似然',
        formula: String.raw`-\log p(\mathbf t\mid\mathbf X,\mathbf w,\beta)=\frac\beta2\|\mathbf t-\boldsymbol\Phi\mathbf w\|_2^2+C`,
        explanation: '与权重有关的部分就是残差平方和，因此最大似然等价于最小二乘。',
      },
      {
        label: '令梯度为零',
        formula: String.raw`\nabla_{\mathbf w}E=\boldsymbol\Phi^T(\boldsymbol\Phi\mathbf w-\mathbf t)=0\Rightarrow\boldsymbol\Phi^T\boldsymbol\Phi\mathbf w=\boldsymbol\Phi^T\mathbf t`,
        explanation: '最优残差与设计矩阵的每一列正交，这也是最小二乘的投影几何。',
      },
      {
        label: '加入 L2 正则',
        formula: String.raw`\mathbf w_{\lambda}=(\boldsymbol\Phi^T\boldsymbol\Phi+\lambda\mathbf I)^{-1}\boldsymbol\Phi^T\mathbf t`,
        explanation: 'λI 抬高小特征值并压缩权重；它对应零均值各向同性高斯先验下的 MAP 解。',
      },
    ],
    exerciseSetId: 'regression-linear',
    description: '检查“对参数线性”、高斯最大似然与 L2 正则化之间的联系。',
    exercises: regressionLinearExercises,
  },
  decision: {
    title: '分步推导：平方损失为何选择后验均值',
    steps: [
      {
        label: '定义条件风险',
        formula: String.raw`R(y\mid\mathbf x)=\mathbb E_{t\mid\mathbf x}[(t-y)^2]`,
        explanation: '推断给出目标的完整后验，决策则选择一个使后验平均代价最小的输出 y。',
      },
      {
        label: '展开平方项',
        formula: String.raw`R(y\mid\mathbf x)=\mathbb E[t^2\mid\mathbf x]-2y\,\mathbb E[t\mid\mathbf x]+y^2`,
        explanation: '前两阶后验矩决定风险曲线；其中 E[t²|x] 与决策 y 无关。',
      },
      {
        label: '求一阶条件',
        formula: String.raw`\frac{\partial R}{\partial y}=2y-2\mathbb E[t\mid\mathbf x]=0`,
        explanation: '平方损失使风险关于 y 成为严格凸二次函数，所以驻点就是唯一最小点。',
      },
      {
        label: '得到贝叶斯决策',
        formula: String.raw`y^*(\mathbf x)=\mathbb E[t\mid\mathbf x]`,
        explanation: '换成绝对或非对称损失时后验并未改变，但最优点预测会分别变为中位数或相应分位数。',
      },
    ],
    exerciseSetId: 'regression-decision',
    description: '根据损失函数，把同一个后验分布转换成不同的最优点预测。',
    exercises: regressionDecisionExercises,
  },
  biasVariance: {
    title: '分步推导：平方误差的偏差—方差分解',
    steps: [
      {
        label: '分离真实函数与噪声',
        formula: String.raw`t=f(\mathbf x)+\epsilon,\quad\mathbb E[\epsilon]=0,\quad\operatorname{Var}(\epsilon)=\sigma^2`,
        explanation: '训练集和观测噪声都会变化；不可约噪声来自数据生成过程本身。',
      },
      {
        label: '加减平均预测',
        formula: String.raw`t-\hat f_{\mathcal D}=(f-\bar f)+(\bar f-\hat f_{\mathcal D})+\epsilon`,
        explanation: '平均预测是对所有可能训练集所得模型输出取均值；加减它可以把系统偏离与训练集波动分开。',
      },
      {
        label: '交叉项消失',
        formula: String.raw`\mathbb E_{\mathcal D,\epsilon}[(f-\bar f)(\bar f-\hat f_{\mathcal D})]=0,\quad\mathbb E[\epsilon]=0`,
        explanation: '平均预测的定义保证模型波动项均值为零，独立零均值噪声也不会贡献交叉项。',
      },
      {
        label: '得到三项分解',
        formula: String.raw`\mathbb E[(t-\hat f_{\mathcal D})^2]=(f-\bar f)^2+\mathbb E[(\hat f_{\mathcal D}-\bar f)^2]+\sigma^2`,
        explanation: '期望测试误差由偏差平方、方差和不可约噪声组成，复杂度与正则化主要在前两项间权衡。',
      },
    ],
    exerciseSetId: 'regression-bias-variance',
    description: '用重复采样的视角诊断欠拟合、过拟合、数据量和正则化的影响。',
    exercises: regressionBiasVarianceExercises,
  },
} satisfies Record<RegressionSectionKey, {
  title: string;
  steps: { label: string; formula: string; explanation: string }[];
  exerciseSetId: string;
  description: string;
  exercises: typeof regressionLinearExercises;
}>;

export default function RegressionSectionCompletion({ sectionKey }: { sectionKey: RegressionSectionKey }) {
  const config = completionConfigs[sectionKey];
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
