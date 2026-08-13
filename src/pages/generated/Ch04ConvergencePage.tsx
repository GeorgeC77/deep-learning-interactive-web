import BishopSectionPage from '@/components/BishopSectionPage';
import MomentumTrajectoryLab from '@/components/demos/MomentumTrajectoryLab';
import { Zap } from 'lucide-react';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter04ConvergenceExercises } from '@/course/chapter04Exercises';

export default function Ch04ConvergencePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/convergence"
      heroIcon={<Zap className="w-9 h-9 text-blue-600" />}
      summary={
        "加速收敛需要利用梯度历史：动量累积速度、自适应方法按维度缩放步长，学习率调度控制长期精细搜索。动量的稳态放大因子依赖于具体约定与梯度是否恒定。"
      }
      concepts={[
        {
          title: "动量法",
          description: "引入速度变量，使更新方向平滑并加速穿越一致梯度方向。在 classical momentum 约定下，恒定梯度的稳态速度为 −ηg/(1−μ)。",
          formula: String.raw`v^{(\tau+1)} = \mu v^{(\tau)} + g^{(\tau)}, \quad w^{(\tau+1)} = w^{(\tau)} - \eta v^{(\tau+1)}`,
        },
        {
          title: "有限时间动量累积",
          description: "第 t 步的位置更新 Δw_t 是历史梯度的几何加权和，权重按 μ 的幂次衰减。这里明确区分内部速度 v_t 与实际参数步长 Δw_t=-ηv_t。",
          formula: String.raw`v_t=\sum_{j=0}^{t-1}\mu^jg_{t-1-j},\quad \Delta w_t=-\eta v_t`,
        },
        {
          title: "Classical vs EMA momentum",
          description: "Classical momentum 使用 v = μv + g，恒定梯度稳态放大因子为 1/(1−μ)。EMA momentum 使用 v = μv + (1−μ)g，稳态放大因子为 1。两种约定下同一 μ 的等效步长不同。",
          formula: String.raw`\text{classical: } \frac{1}{1-\mu},\quad \text{EMA: } 1`,
        },
        {
          title: "RMSProp / Adam",
          description: "RMSProp 用梯度平方的指数移动平均缩放每个坐标；Adam 再加入一阶矩，并对从零初始化的矩估计做偏差修正。坐标缩放并不等同于掌握完整 Hessian 的主曲率方向。",
          formula: String.raw`\hat s_t=\frac{s_t}{1-\beta_1^t},\quad \hat r_t=\frac{r_t}{1-\beta_2^t},\quad \Delta w_t=-\eta\frac{\hat s_t}{\sqrt{\hat r_t}+\delta}`,
        },
        {
          title: "学习率衰减",
          description: "线性、幂律和指数调度通常先用较大学习率快速移动，再降低步长以减小后期噪声。在特定光滑性和随机性假设下可分析收敛；对一般非凸网络没有无条件保证。",
          formula: String.raw`\eta_t=\eta_0(1+t/s)^c\quad\text{or}\quad \eta_t=\eta_0c^{t/s}`,
        },
      ]}
      learningObjectives={[
        "能写出动量法的速度与位置更新公式",
        "推导恒定梯度下 classical momentum 的稳态放大因子",
        "区分 classical momentum 与 EMA momentum 的稳态尺度",
        "理解 RMSProp/Adam 按维度缩放学习率的思想",
        "认识到学习率收敛结论需要前提假设，而非无条件成立",
      ]}
      coreIntuition={
        "动量就像一个滚下斜坡的球：同一方向持续受力时速度越来越快（有效步长被 1/(1−μ) 放大），但遇到方向相反的梯度时不会立即掉头，而是靠惯性平滑过渡。不同的 momentum 约定就像给球不同的质量定义，稳态速度自然不同。"
      }
      commonMistakes={[
        "把 1/(1−μ) 当作普适的'有效学习率倍数'——它只在 classical momentum 与恒定梯度假设下成立",
        "混淆 classical momentum（v=μv+g）与 EMA momentum（v=μv+(1−μ)g）的尺度",
        "认为动量越大越好——μ 接近 1 时会导致振荡加剧",
        "把学习率衰减视为非凸网络无条件收敛的保证——实际收敛需要光滑性、步长、随机性等假设",
      ]}
      whyCards={[
        {
          question: "为什么动量能加速收敛？",
          answer: "动量累积历史梯度，让参数在一致方向上持续加速，减少在峡谷两侧的来回振荡。",
        },
        {
          question: "为什么 RMSProp/Adam 能自适应调整学习率？",
          answer: "它们维护梯度平方的移动平均，为每个参数单独缩放步长，陡峭方向自动减小步长，平缓方向自动增大步长。",
        },
      ]}
      counterexamples={[
        "把 classical momentum 的 1/(1−μ) 当作普适放大因子，在梯度方向频繁变化时，动量不仅不加速反而加剧振荡——说明放大因子依赖恒定梯度假设。",
        "认为学习率衰减能保证非凸网络收敛，实际上没有光滑性和有界梯度假设，衰减可能反而让训练停滞——说明收敛结论需要前提。",
      ]}
            bishopMapping={{
        chapter: "Ch 7",
        section: "7.3",
        pages: "§7.3, pp. 218–224",
        textbookSubsections: [
          "7.3 Convergence",
          "7.3.1 Momentum",
          "7.3.2 Learning rate schedule",
          "7.3.3 RMSProp and Adam",
        ],
        formulas: [
          "momentum update",
          "Δw_t = -η Σ μ^j g_{t-1-j}",
          "linear, power-law, and exponential schedules",
          "RMSProp and bias-corrected Adam",
          "classical steady-state factor 1/(1−μ)",
          "EMA steady-state factor 1",
        ],
        exercises: [
          "推导 classical momentum 在恒定梯度下的稳态速度",
          "比较 classical 与 EMA momentum 的有效步长",
          "讨论学习率衰减收敛结论所需的前提假设",
        ],
      }}
      interactiveDemo={<MomentumTrajectoryLab />}
      extraContent={
        <div className="space-y-10">
          <DerivationStepper
            title="分步推导：二次方向为何收敛、振荡或发散"
            steps={[
              { label: '方向梯度', formula: String.raw`\nabla_iE=\lambda_i\alpha_i`, explanation: '在 Hessian 特征方向 uᵢ 上，局部二次损失退化为一维问题。' },
              { label: '更新递推', formula: String.raw`\alpha_i^{(t+1)}=(1-\eta\lambda_i)\alpha_i^{(t)}`, explanation: '学习率和曲率共同决定每一步的乘子。' },
              { label: '重复 T 步', formula: String.raw`\alpha_i^{(T)}=(1-\eta\lambda_i)^T\alpha_i^{(0)}`, explanation: '收敛速度由乘子绝对值按几何级数决定。' },
              { label: '分类行为', formula: String.raw`0<\eta\lambda_i<1:\ \text{单调};\quad 1<\eta\lambda_i<2:\ \text{振荡收敛};\quad \eta\lambda_i>2:\ \text{发散}`, explanation: '这解释了窄谷中既要控制陡峭方向，又会拖慢平缓方向。' },
            ]}
          />
          <ExercisePanel exerciseSetId="chapter04-convergence" exercises={chapter04ConvergenceExercises} />
        </div>
      }
    />
  );
}
