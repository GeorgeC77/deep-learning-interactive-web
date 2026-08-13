import BishopSectionPage from '@/components/BishopSectionPage';
import ResidualJacobianLab from '@/components/demos/ResidualJacobianLab';
import ResidualIdentityPathLab from '@/components/demos/ResidualIdentityPathLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter06ResidualExercises } from '@/course/chapter06Exercises';
import { Layers } from 'lucide-react';

export default function Ch06ResidualConnectionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/residual-connections"
      heroIcon={<Layers className="w-9 h-9 text-blue-600" />}
      summary={"Bishop §9.5 从深层网络的 shattered gradients 与崎岖误差面出发引入残差连接。每个块计算 z_l=F_l(z_{l-1})+z_{l-1}，既提供接近恒等映射的容易路径，也可展开为不同深度子网络的组合；它改善训练几何，但并非无条件保证。"}
      concepts={[
        {
          title: "残差块",
          description: "输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。",
          formula: "y = \\mathcal{F}(x, \\{W_i\\}) + x",
        },
        {
          title: "残差 Jacobian",
          description: "对输入求导得到 I + ∂F/∂x。其特征值在 1 附近时，梯度在反向传播中不易衰减；但若 F≈-x，整体 Jacobian 仍可能退化。",
          formula: "\\frac{\\partial y}{\\partial x} = I + \\frac{\\partial \\mathcal{F}}{\\partial x}",
        },
        {
          title: "深层网络训练",
          description: "连续残差块可展开为浅层与深层路径的组合，有助于平滑误差面。若维度不同，可在跳连支路加入投影矩阵 W；仍需合适初始化、归一化与优化。",
          formula: String.raw`z_l=F_l(z_{l-1})+Wz_{l-1}`,
        },
      ]}
      learningObjectives={[
        "理解残差块的前向形式与 Jacobian 结构。",
        "能解释为什么 I + ∂F/∂x 有助于保持梯度幅值。",
        "认识残差连接并非万能，存在退化分支等反例。",
      ]}
      coreIntuition={"残差连接把学习目标从‘直接逼近 H(x)’变成‘逼近残差 F(x)=H(x)-x’；其 Jacobian 保留一个单位阵项，使梯度多了一条稳定回传路径。"}
      commonMistakes={[
        "把残差连接当成无条件解决梯度消失的方案，忽略 F≈-x 时 Jacobian 退化的可能性。",
        "只记住 y=x+F(x) 的公式，而不理解 I+∂F/∂x 的 Jacobian 含义。",
        "认为加入残差连接后就不需要关注初始化或学习率。",
      ]}
      whyCards={[
        {
          question: "为什么 Identity 能帮助训练？",
          answer: "即使变换学坏了，输入仍能原样传到后面，网络至少有恒等映射保底，梯度也有路可回。",
        },
        {
          question: "为什么残差不是更复杂而是更稳？",
          answer: "它不学全新输出，只学要改多少；多数层只需微调，最坏退化成恒等，训练自然更稳。",
        },
      ]}
      counterexamples={[
        "若残差分支学到 F≈-x，整体 Jacobian 接近 0，深层网络仍会梯度消失——残差不是无条件保险。",
        "残差分支过大且缺少合适初始化/正则时，训练仍可能不稳定，残差不能替代好的训练设置。",
      ]}
            bishopMapping={{
        chapter: "Ch 9",
        section: "9.5",
        pages: "§9.5, pp. 274–277",
        textbookSubsections: ["9.5 Residual Connections"],
        formulas: ["y = F(x) + x", "\\partial y/\\partial x = I + \\partial F/\\partial x"],
        algorithms: ["深层网络训练"],
        exercises: [
          "推导残差块的 Jacobian。",
          "对比堆叠残差块与无残差块的回传梯度范数。",
          "讨论 F≈-x 时残差连接为何失效。",
        ],
      }}
      interactiveDemo={<ResidualJacobianLab />}
      extraContent={<div className="space-y-10"><ResidualIdentityPathLab/><DerivationStepper title="分步推导：残差块的梯度路径" steps={[
        { label: '残差前向', formula: String.raw`\mathbf y=\mathbf x+\mathcal F(\mathbf x)`, explanation: '学习器只需刻画相对于恒等映射的修正。' },
        { label: '局部 Jacobian', formula: String.raw`\frac{\partial\mathbf y}{\partial\mathbf x}=\mathbf I+\mathbf J_{\mathcal F}`, explanation: '恒等支路带来单位阵项。' },
        { label: '多块回传', formula: String.raw`\frac{\partial E}{\partial\mathbf x}=\frac{\partial E}{\partial\mathbf z_L}\prod_{l=1}^{L}(\mathbf I+\mathbf J_l)`, explanation: '每块的单位项提供较短梯度路径，但乘积仍取决于 Jl 的谱。' },
        { label: '反例边界', formula: String.raw`\mathbf J_l\approx-\mathbf I\quad\Rightarrow\quad\mathbf I+\mathbf J_l\approx\mathbf0`, explanation: '残差 Jacobian 仍可能被抵消，所以结构不是梯度稳定性的绝对保证。' },
      ]}/><ExercisePanel exerciseSetId="chapter06-residual" exercises={chapter06ResidualExercises}/></div>}
    />
  );
}
