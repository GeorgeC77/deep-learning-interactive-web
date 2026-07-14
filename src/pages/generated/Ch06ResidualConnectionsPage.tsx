import BishopSectionPage from '@/components/BishopSectionPage';
import ResidualJacobianLab from '@/components/demos/ResidualJacobianLab';
import { Layers } from 'lucide-react';

export default function Ch06ResidualConnectionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/residual-connections"
      heroIcon={<Layers className="w-9 h-9 text-blue-600" />}
      summary={"残差连接通过跳跃映射让网络学习残差函数 F(x)=H(x)-x，其 Jacobian 为 I + ∂F/∂x。当 ∂F/∂x 较小时，Jacobian 接近单位阵，有助于缓解深层网络的梯度消失，但这并不是无条件保证。"}
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
          description: "ResNet 等架构借助残差连接成功训练数百甚至上千层网络，但仍需配合合适的初始化、优化器与正则化。",
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
      quiz={[
        {
          question: "残差块 y = x + F(x) 对输入的 Jacobian 是什么？",
          options: [
            "I + ∂F/∂x",
            "∂F/∂x",
            "I - ∂F/∂x",
            "F(x)/x",
          ],
          correctIndex: 0,
          explanation: "对 y = x + F(x) 求导，单位阵来自 x 的梯度，再加上 F 的 Jacobian。",
        },
        {
          question: "为什么残差 Jacobian 有助于缓解梯度消失？",
          options: [
            "它保留了一个单位阵项，使梯度可以沿跳跃连接直接回传",
            "它自动把激活值缩放到 0 附近",
            "它消除了所有非线性",
            "它让网络层数不再重要",
          ],
          correctIndex: 0,
          explanation: "I + ∂F/∂x 的特征值在 1 附近时，连乘后的梯度幅值不易指数衰减。",
        },
        {
          question: "残差连接是否总是有效？",
          options: [
            "不是；若 F≈-x，整体 Jacobian 接近 0，梯度仍可能消失",
            "是，只要使用残差连接就绝不会梯度消失",
            "只对 CNN 有效",
            "只在浅层网络有效",
          ],
          correctIndex: 0,
          explanation: "残差连接提供了梯度稳定的可能性，但不是无条件保证；退化分支就是一个反例。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 9",
        section: "9.5",
        pages: "Ch 9",
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
    />
  );
}
