import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import type { LearningExercise } from '@/components/ExercisePanel';
import {
  chapter14AdversarialExercises,
  chapter14ImageExercises,
} from '@/course/chapter14Exercises';

type Chapter14SectionKey = 'adversarial' | 'image';

const configs = {
  adversarial: {
    title: '分步推导：从二元交叉熵到 GAN 均衡',
    steps: [
      {
        label: '写出对抗误差',
        formula: String.raw`E_{\mathrm{GAN}}=-\mathbb E_{p_{\mathrm{data}}}\ln d(\mathbf x)-\mathbb E_{p_z}\ln\!\left(1-d(g(\mathbf z))\right)`,
        explanation: '真实样本标签为 1，生成样本标签为 0；判别器把二者当作一个二元分类问题。',
      },
      {
        label: '反转生成器方向',
        formula: String.raw`\Delta\boldsymbol\phi=-\eta\nabla_{\boldsymbol\phi}E_{\mathrm{GAN}},\qquad \Delta\mathbf w=+\eta\nabla_{\mathbf w}E_{\mathrm{GAN}}`,
        explanation: '判别器降低分类误差，生成器提高同一误差，因此两组参数的更新符号相反。',
      },
      {
        label: '固定 G 优化 D',
        formula: String.raw`d^*(\mathbf x)=\frac{p_{\mathrm{data}}(\mathbf x)}{p_{\mathrm{data}}(\mathbf x)+p_G(\mathbf x)}`,
        explanation: '逐点优化判别器后，输出不再是绝对的“真假”，而是两个密度在该位置的相对占比。',
      },
      {
        label: '得到分布目标',
        formula: String.raw`C(p_G)=-\ln 4+2\,\mathrm{JS}\!\left(p_{\mathrm{data}}\Vert p_G\right)\ge -\ln 4`,
        explanation: '把最优判别器代回目标，教材练习 17.1 给出 Jensen-Shannon 散度；仅当 p_G=p_data 时达到全局最小值。',
      },
    ],
    exerciseSetId: 'chapter14-adversarial',
    description: '连接最优判别器、相反更新方向与非饱和梯度，避免只背极小极大公式。',
    exercises: chapter14AdversarialExercises,
  },
  image: {
    title: '分步推导：CycleGAN 如何用往返约束替代成对监督',
    steps: [
      {
        label: '建立双向映射',
        formula: String.raw`G:X\to Y,\qquad F:Y\to X`,
        explanation: 'G 把 X 域样本翻译到 Y 域，F 执行反向翻译；两个方向各自配有一个判别器。',
      },
      {
        label: '匹配两个目标域',
        formula: String.raw`L_{\mathrm{adv}}=L_{\mathrm{GAN}}(G,D_Y)+L_{\mathrm{GAN}}(F,D_X)`,
        explanation: '对抗项只要求翻译结果在总体分布上像目标域，并不会把某个 x 与某个 y 一一对应。',
      },
      {
        label: '加入往返重建',
        formula: String.raw`L_{\mathrm{cyc}}=\mathbb E_x\lVert F(G(x))-x\rVert_1+\mathbb E_y\lVert G(F(y))-y\rVert_1`,
        explanation: '每个样本都以自身作为往返重建目标，于是即使数据未配对，也能提供输入级监督信号。',
      },
      {
        label: '权衡真实性与可逆性',
        formula: String.raw`L_{\mathrm{total}}=L_{\mathrm{adv}}+\eta L_{\mathrm{cyc}}`,
        explanation: 'η 太小会忽略内容保持，太大又可能偏爱可逆捷径；循环一致性不能单独保证语义正确。',
      },
    ],
    exerciseSetId: 'chapter14-image',
    description: '从双向对抗、循环一致性到权重反例，判断无配对图像翻译的能力边界。',
    exercises: chapter14ImageExercises,
  },
} satisfies Record<Chapter14SectionKey, {
  title: string;
  steps: { label: string; formula: string; explanation: string }[];
  exerciseSetId: string;
  description: string;
  exercises: LearningExercise[];
}>;

export default function Chapter14SectionCompletion({ sectionKey }: { sectionKey: Chapter14SectionKey }) {
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
