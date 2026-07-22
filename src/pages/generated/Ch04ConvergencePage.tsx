import BishopSectionPage from '@/components/BishopSectionPage';
import MomentumTrajectoryLab from '@/components/demos/MomentumTrajectoryLab';
import { Zap } from 'lucide-react';

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
          description: "第 t 步的速度是历史梯度的加权和，权重按 μ 的幂次衰减。",
          formula: String.raw`v_t = -\eta \sum_{j=0}^{t-1} \mu^j g_{t-1-j}`,
        },
        {
          title: "Classical vs EMA momentum",
          description: "Classical momentum 使用 v = μv + g，恒定梯度稳态放大因子为 1/(1−μ)。EMA momentum 使用 v = μv + (1−μ)g，稳态放大因子为 1。两种约定下同一 μ 的等效步长不同。",
          formula: String.raw`\text{classical: } \frac{1}{1-\mu},\quad \text{EMA: } 1`,
        },
        {
          title: "RMSProp / Adam",
          description: "维护梯度平方的指数移动平均，为每个参数自适应调整学习率。",
        },
        {
          title: "学习率衰减",
          description: "在特定光滑性、有界梯度与适当步长假设下，学习率衰减有助于随机优化收敛；对一般非凸深度网络，它不无条件保证收敛到局部极小值附近。",
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
            bishopMapping={{
        chapter: "Ch 7",
        section: "7.3",
        pages: "Ch 7",
        textbookSubsections: [
          "7.3 Convergence",
          "7.3.1 Momentum",
          "7.3.2 Learning rate schedule",
          "7.3.3 RMSProp and Adam",
        ],
        formulas: [
          "momentum update",
          "v_t = -η Σ μ^j g_{t-1-j}",
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
    />
  );
}
