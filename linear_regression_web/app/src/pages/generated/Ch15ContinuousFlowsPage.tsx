import BishopSectionPage from '@/components/BishopSectionPage';
import { Waves } from 'lucide-react';

export default function Ch15ContinuousFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/continuous-flows"
      heroIcon={<Waves className="w-9 h-9 text-blue-600" />}
      summary={"连续流将离散层之间的变换推广到连续时间，用神经网络参数化的常微分方程描述状态演化。通过瞬时变量替换公式，可以在 ODE 求解器精度范围内计算 log 密度。"}
      concepts={[
        {
          title: "神经 ODE",
          description: "隐藏状态 h(t) 随连续时间 t 演化，导数由神经网络 f 决定。从 t=0 到 t=1 的解定义了一个可逆变换。",
          formula: String.raw`\frac{d\mathbf{h}(t)}{dt} = f(\mathbf{h}(t), t, \theta)`,
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
          description: "用 Hutchinson 迹估计替代精确 Jacobian 迹，将连续流扩展到高维数据。",
        },
      ]}
      learningObjectives={[
        "理解连续流与离散归一化流的联系与区别。",
        "掌握瞬时变量替换公式及其与 Jacobian 的关系。",
        "了解伴随敏感性和 FFJORD 如何解决高维连续流的计算问题。",
      ]}
      coreIntuition={"把离散层的拉伸压缩想象成电影的一帧帧画面；连续流让画面变成平滑的动画，并用‘每秒体积收缩率’追踪概率密度的变化。"}
      commonMistakes={[
        "把神经 ODE 的 f 直接当作 x 对 z 的导数而忽略时间维度。",
        "忘记 log 密度的 ODE 右端有负号：密度随体积膨胀而下降。",
        "在维度较高时仍试图精确计算 Jacobian 迹，而忽略了 FFJORD 的随机迹估计。",
      ]}
      quiz={[
        {
          question: "瞬时变量替换公式中，log 密度随时间的变化率等于什么？",
          options: [
            "负的向量场散度（Jacobian 迹）。",
            "向量场的 L2 范数。",
            "基分布与目标分布的 KL 散度。",
            "神经网络参数梯度的和。",
          ],
          correctIndex: 0,
          explanation: "d/dt ln p(h(t)) = -tr(∂f/∂h)，即负散度。体积膨胀时密度减小。",
        },
        {
          question: "神经 ODE 相比离散归一化流，主要优势不包括以下哪项？",
          options: [
            "可以用任意非可逆神经网络作为 f。",
            "ODE 求解器可以自适应精度。",
            "前向和反向都可以通过伴随方程完成。",
            "模型复杂度由网络容量决定，而非固定层数。",
          ],
          correctIndex: 0,
          explanation: "f 仍需要保证 ODE 可解且可逆，通常选择 Lipschitz 连续的网络；非可逆会破坏流的定义。",
        },
        {
          question: "FFJORD 中 Hutchinson 迹估计的作用是？",
          options: [
            "用随机投影近似 Jacobian 迹，避免高维显式计算。",
            "直接求解逆映射 z=g(x)。",
            "替代 ODE 求解器进行积分。",
            "计算两个分布之间的 Wasserstein 距离。",
          ],
          correctIndex: 0,
          explanation: "Hutchinson 估计用 v^T (∂f/∂h) v 近似 tr(∂f/∂h)，将 O(D²) 迹计算降到 O(D)。",
        },
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
        formulas: ["dh/dt=f(h,t,θ)", "d/dt ln p(h)=-tr(∂f/∂h)"],
        algorithms: ["Neural ODE", "Adjoint sensitivity", "FFJORD"],
        exercises: ["解释为什么 d/dt ln p 等于负散度。", "比较 FFJORD 与离散流在计算 Jacobian 上的复杂度差异。"],
      }}
    />
  );
}
