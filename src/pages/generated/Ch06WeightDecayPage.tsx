import BishopSectionPage from '@/components/BishopSectionPage';
import Chapter09RegularizationPage from '@/pages/chapters/chapter09/RegularizationPage';
import { Scale } from 'lucide-react';

export default function Ch06WeightDecayPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/weight-decay"
      heroIcon={<Scale className="w-9 h-9 text-blue-600" />}
      summary={"权重衰减通过在目标函数中加入参数惩罚来控制模型复杂度，是最常用的正则化技术之一。Bishop 教材中将其作为 9.2 节的核心内容，并讨论了一致正则化器与广义权重衰减。"}
      concepts={[
        {
          title: "权重衰减",
          description: "在损失函数中加入参数的二次惩罚，使权重向零收缩，从而降低模型复杂度。",
          formula: String.raw`\tilde{E}(\mathbf{w}) = E(\mathbf{w}) + \frac{\lambda}{2} \|\mathbf{w}\|^2`,
        },
        {
          title: "一致正则化器",
          description: "在重新参数化下保持不变的惩罚项，避免惩罚项与网络缩放方式耦合。",
        },
        {
          title: "广义权重衰减",
          description: "将权重衰减推广到不同层、不同参数类型或使用其他范数形式，如 L1 稀疏化。",
        },
      ]}
      learningObjectives={[
        "理解权重衰减如何控制模型复杂度并防止过拟合。",
        "掌握 L2 正则化与权重衰减在 SGD 中的等价性。",
        "了解一致正则化器与广义权重衰减的区别。",
      ]}
      coreIntuition={"权重衰减像给每个参数施加一个朝向原点的弹簧力：参数越大，拉力越强，从而抑制过度复杂的拟合。"}
      commonMistakes={[
        "混淆 L2 正则化与权重衰减：在连续梯度下降下二者等价，但在 Adam 等自适应优化器中行为不同。",
        "把偏置项也同等惩罚，导致结果依赖目标变量的原点选择。",
        "忽视正则化系数 λ 需要通过验证集或交叉验证来选择。",
      ]}
      whyCards={[
        {
          question: "为什么权重衰减能防止过拟合？",
          answer: "权重衰减给每个参数施加朝向零的弹簧力，抑制过大的权重，迫使模型选择更平滑的解。",
        },
        {
          question: "为什么 Adam 中 L2 正则化和权重衰减不等价？",
          answer: "Adam 会自适应缩放梯度，L2 正则化的梯度也被缩放，而权重衰减直接作用于参数，两者在自适应优化器中行为不同。",
        },
      ]}
      counterexamples={[
        "在 Adam 优化器中使用 L2 正则化而不是权重衰减，正则化效果被自适应缩放削弱——说明优化器改变正则化行为。",
        "把偏置项也加入权重衰减，导致预测结果依赖于目标变量的原点选择——说明偏置项应该区别对待。",
      ]}
            bishopMapping={{
        chapter: "Ch 9",
        section: "9.2",
        pages: "Ch 9",
        textbookSubsections: [
          "9.2 Weight Decay",
          "9.2.1 Consistent regularizers",
          "9.2.2 Generalized weight decay"
        ],
        supplementalTopics: [
          "L2 regularization",
          "AdamW"
        ],
        formulas: ["L2 penalty", "weight decay update"],
        algorithms: ["权重衰减", "AdamW"],
        exercises: ["推导 L2 正则化最小二乘的闭式解。", "比较 SGD 下 L2 正则化与权重衰减的更新公式。"],
      }}
      extraContent={<Chapter09RegularizationPage />}
    />
  );
}
