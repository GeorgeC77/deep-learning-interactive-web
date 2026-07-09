import BishopSectionPage from '@/components/BishopSectionPage';
import { GitBranch } from 'lucide-react';

export default function Ch05EvaluationOfGradientsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch05/evaluation-of-gradients"
      heroIcon={<GitBranch className="w-9 h-9 text-blue-600" />}
      summary={"反向传播利用链式法则高效计算复合函数（如神经网络损失）对每层参数的梯度。它是大规模神经网络训练的核心算法。"}
      concepts={[
        {
          title: "链式法则",
          description: "多重复合函数的梯度可分解为各层局部雅可比矩阵的乘积。",
          formula: String.raw`\frac{\partial L}{\partial \mathbf{w}} = \frac{\partial L}{\partial \mathbf{a}} \frac{\partial \mathbf{a}}{\partial \mathbf{z}} \frac{\partial \mathbf{z}}{\partial \mathbf{w}}`,
        },
        {
          title: "前向-反向模式",
          description: "前向传播保存中间激活，反向传播从输出层开始逐层回传梯度。",
        },
        {
          title: "计算图",
          description: "将运算表示为节点与边，自动微分系统通过遍历计算图完成梯度计算。",
        },
        {
          title: "计算复杂度",
          description: "反向传播的计算量与前向传播同阶，避免了逐参数数值差分的高昂代价。",
        },
      ]}
      learningObjectives={[
        "理解链式法则在多层网络中的应用。",
        "能说明前向传播与反向传播各自保存/计算什么。",
        "了解反向传播为何比数值差分高效。",
      ]}
      coreIntuition={"反向传播像从山顶把错误信号一路传回每个路口：每到一个节点，只问‘我对后面的影响有多大’，再把信号分摊给前面的节点。"}
      commonMistakes={[
        "把反向传播当成一种独立的优化器；它只是计算梯度的方法。",
        "忘记保存前向传播的中间结果，导致反向传播需要重新计算。",
        "混淆 ∂L/∂w 与 ∂L/∂x 的符号含义。",
      ]}
      quiz={[
        {
          question: "反向传播主要解决什么问题？",
          options: [
            "高效计算神经网络中所有参数的梯度",
            "初始化网络权重",
            "直接找到全局最优解",
            "降低模型的偏差",
          ],
          correctIndex: 0,
          explanation: "反向传播利用链式法则和前向缓存，高效得到损失对各层参数的梯度。",
        },
        {
          question: "对于 z=wx+b, a=σ(z), L=(a-y)²，∂L/∂w 等于？",
          options: [
            "2(a-y) · σ'(z) · x",
            "2(a-y) · x",
            "2(a-y) · σ'(z)",
            "2(a-y) · w",
          ],
          correctIndex: 0,
          explanation: "由链式法则：∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w = 2(a-y) · σ'(z) · x。",
        },
        {
          question: "反向传播相比数值差分的主要优势是？",
          options: [
            "计算量与网络规模近似线性，而非随参数数平方增长",
            "不需要前向传播",
            "可以自动选择学习率",
            "避免局部极小值",
          ],
          correctIndex: 0,
          explanation: "数值差分需要对每个参数单独前向计算；反向传播一次前向加一次反向即可得到所有梯度。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 8",
        section: "8.1",
        pages: "Ch 8",
        textbookSubsections: [
          "8.1 Evaluation of Gradients"
        ],
        formulas: ["链式法则", "反向传播递推"],
        exercises: ["手推两层网络的反向传播梯度。", "比较反向传播与数值差分的计算复杂度。"],
      }}
    />
  );
}
