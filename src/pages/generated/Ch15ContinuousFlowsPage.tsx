import BishopSectionPage from '@/components/BishopSectionPage';
import ContinuousFlowLab from '@/components/demos/ContinuousFlowLab';
import { Waves } from 'lucide-react';

export default function Ch15ContinuousFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/continuous-flows"
      heroIcon={<Waves className="w-9 h-9 text-blue-600" />}
      summary={"连续流将离散层之间的变换推广到连续时间，用神经网络参数化的常微分方程描述状态演化。通过瞬时变量替换公式，可以在 ODE 求解器精度范围内计算 log 密度。"}
      concepts={[
        {
          title: "神经 ODE 与向量场",
          description: "隐藏状态 h(t) 随连续时间 t 演化，其导数由神经网络 f 决定。向量场 f 本身不必是双射；它只需要满足正则条件（如 Lipschitz），使得 ODE 的解存在且唯一。",
          formula: String.raw`\frac{d\mathbf{h}(t)}{dt} = f(\mathbf{h}(t), t, \theta)`,
        },
        {
          title: "流映射（Flow map）",
          description: "从 t=0 到 t=1 的 ODE 解定义了流映射 φ。正向积分得到 φ，反向积分得到其逆 φ⁻¹，因此流映射是可逆变换。可逆性来自 ODE 解的唯一性，而非 f 自身的双射性。",
          formula: String.raw`\mathbf{h}(1) = \phi(\mathbf{h}(0)), \quad \mathbf{h}(0) = \phi^{-1}(\mathbf{h}(1))`,
        },
        {
          title: "瞬时变量替换",
          description: "log 密度的变化率由向量场散度的负值给出，因此可用 ODE 求解器同时积分状态和密度。",
          formula: String.raw`\frac{d}{dt} \ln p(\mathbf{h}(t)) = -\operatorname{tr}\!\left(\frac{\partial f}{\partial \mathbf{h}(t)}\right)`,
        },
        {
          title: "伴随敏感性方法",
          description: "通过求解增广 ODE 反向传播梯度，避免存储前向传播所有中间状态，节省显存。",
        },
        {
          title: "FFJORD",
          description: "用 Hutchinson 迹估计替代精确 Jacobian 迹，将连续流扩展到高维数据。FFJORD 的核心优势在于 f 可以是自由形式神经网络，不必设计可逆层。",
        },
      ]}
      learningObjectives={[
        "理解连续流与离散归一化流的联系与区别。",
        "掌握瞬时变量替换公式及其与 Jacobian 的关系。",
        "了解伴随敏感性和 FFJORD 如何解决高维连续流的计算问题。",
        "区分向量场 f 与流映射 φ，明确可逆性的来源。",
      ]}
      coreIntuition={"把离散层的拉伸压缩想象成电影的一帧帧画面；连续流让画面变成平滑的动画，并用‘每秒体积收缩率’追踪概率密度的变化。向量场 f 只是‘瞬时速度场’，真正可逆的是它积分出来的流映射。"}
      commonMistakes={[
        "把神经 ODE 的 f 直接当作 x 对 z 的导数而忽略时间维度。",
        "认为 f 本身必须可逆；实际上 f 不必是双射，可逆的是由 ODE 积分产生的流映射。",
        "忘记 log 密度的 ODE 右端有负号：密度随体积膨胀而下降。",
        "在维度较高时仍试图精确计算 Jacobian 迹，而忽略了 FFJORD 的随机迹估计。",
        "误以为连续流需要三角或对角 Jacobian；FFJORD 允许自由形式架构。",
      ]}
            bishopMapping={{
        chapter: "Ch 18",
        section: "18.3",
        pages: "Ch 18",
        textbookSubsections: [
          "18.3.1 Neural differential equations",
          "18.3.2 Neural ODE backpropagation",
          "18.3.3 Neural ODE flows"
        ],
        supplementalTopics: [
          "FFJORD",
          "Hutchinson trace estimator"
        ],
        formulas: ["dh/dt=f(h,t,θ)", "d/dt ln p(h)=-tr(∂f/∂h)", "flow map φ and inverse by reverse integration"],
        algorithms: ["Neural ODE", "Adjoint sensitivity", "FFJORD"],
        exercises: ["解释为什么 d/dt ln p 等于负散度。", "比较 FFJORD 与离散流在计算 Jacobian 上的复杂度差异。", "说明向量场 f 不必可逆为什么仍能得到可逆流映射。"]
      }}
      interactiveDemo={<ContinuousFlowLab />}
    />
  );
}
