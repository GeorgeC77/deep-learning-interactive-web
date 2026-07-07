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
      quiz={[
        {
          question: "L2 权重衰减对损失函数的主要影响是什么？",
          options: [
            "增加一个与参数平方和成正比的惩罚项。",
            "随机丢弃部分神经元。",
            "在训练达到一定步数后停止。",
            "对输入特征进行归一化。",
          ],
          correctIndex: 0,
          explanation: "L2 正则化在损失中加入 λ/2 ||w||²，使参数趋向于小值。",
        },
        {
          question: "若原始损失为 E(w)，L2 正则化后的梯度更新会额外包含什么项？",
          options: [
            "λw",
            "-λw",
            "λ/w",
            "0",
          ],
          correctIndex: 0,
          explanation: "对 λ/2 ||w||² 求导得到 λw，因此梯度更新会额外加上 λw。",
        },
        {
          question: "使用 Adam 优化器时，L2 正则化与权重衰减是否完全等价？",
          options: [
            "不完全等价，因为 Adam 的自适应学习率会改变权重衰减的有效强度。",
            "完全等价，没有任何区别。",
            "只有在批量梯度下降中等价。",
            "只有在 L1 正则化中等价。",
          ],
          correctIndex: 0,
          explanation: "AdamW 的出现正是为了在自适应优化器中正确解耦权重衰减与梯度更新。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 9",
        section: "9.2",
        pages: "Ch 9",
        textbookSubsections: ["9.2 Weight Decay", "9.2.1 Consistent regularizers", "9.2.2 Generalized weight decay"],
        supplementalTopics: ["L2 regularization", "AdamW"],
        formulas: ["L2 penalty", "weight decay update"],
        algorithms: ["权重衰减", "AdamW"],
        exercises: ["推导 L2 正则化最小二乘的闭式解。", "比较 SGD 下 L2 正则化与权重衰减的更新公式。"],
      }}
      extraContent={<Chapter09RegularizationPage />}
    />
  );
}
