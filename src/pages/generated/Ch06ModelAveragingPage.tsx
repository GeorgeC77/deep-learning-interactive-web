import BishopSectionPage from '@/components/BishopSectionPage';
import ModelAveragingLab from '@/components/demos/ModelAveragingLab';
import { Users } from 'lucide-react';

export default function Ch06ModelAveragingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/model-averaging"
      heroIcon={<Users className="w-9 h-9 text-blue-600" />}
      summary={
        "模型平均通过组合多个模型的预测降低误差方差；其效果取决于模型误差的方差 σ² 与模型间相关性 ρ。Dropout 可视为对大量子网络做指数级隐式模型平均的一种近似。"
      }
      concepts={[
        {
          title: "委员会机器",
          description: "独立训练多个模型并平均输出。若各模型误差方差相同且两两相关，平均后的方差为 σ²·[ρ + (1−ρ)/M]。",
          formula: String.raw`\operatorname{Var}\bigl(\bar y\bigr) = \sigma^2 \left( \rho + \frac{1-\rho}{M} \right)`,
        },
        {
          title: "模型相关性的影响",
          description: "ρ=0 时独立模型的误差随 M 以 1/M 下降；ρ=1 时所有模型等价，集成不再降低方差；ρ 接近 1 时边际增益迅速消失。",
          formula: String.raw`\rho=0 \Rightarrow \operatorname{Var}(\bar y)=\frac{\sigma^2}{M},\quad \rho=1 \Rightarrow \operatorname{Var}(\bar y)=\sigma^2`,
        },
        {
          title: "Dropout 作为模型平均的近似",
          description: "训练时随机失活神经元等价于采样子网络；测试时缩放或 MC 平均近似所有子网络平均。它是一种近似，而非与精确模型平均无条件等价。",
        },
        {
          title: "贝叶斯模型平均",
          description: "按模型后验概率加权组合，理论上最优但计算昂贵。",
        },
      ]}
      learningObjectives={[
        "理解委员会机器降低方差的前提：模型误差方差与共方差",
        "能写出含相关性 ρ 的集成方差公式",
        "解释 ρ=0 与 ρ=1 时集成效果的差异",
        "理解 Dropout 与模型平均之间的近似关系",
      ]}
      coreIntuition={
        "模型平均就像让多位专家投票：如果专家意见独立（ρ=0），人数越多误差越小；如果他们总是说一样的话（ρ=1），再多人也帮不上忙。Dropout 则是通过随机'缺席'制造大量略有不同的专家，然后近似他们的平均意见。"
      }
      commonMistakes={[
        "把 σ/√M 当作无条件成立的公式——它只在模型误差独立（ρ=0）且等方差时成立",
        "忽视模型相关性：高度相关的模型集成几乎没有方差缩减收益",
        "认为 Dropout 测试时的缩放就是精确模型平均——它只是一种实用的近似",
        "把委员会机器的成功推广到任意相关误差结构而不检验协方差假设",
      ]}
      quiz={[
        {
          question: "在等方差、两两相关为 ρ 的 M 个模型中，平均预测的方差是？",
          options: [
            "σ²·[ρ + (1−ρ)/M]",
            "σ²/M",
            "σ²·ρ",
            "σ²·(1−ρ)",
          ],
          correctIndex: 0,
          explanation: "平均预测的方差为 σ²·[ρ + (1−ρ)/M]；ρ=0 时退化为 σ²/M，ρ=1 时为 σ²。",
        },
        {
          question: "当模型间相关性 ρ=1 时，增加更多模型会怎样？",
          options: [
            "集成方差保持 σ² 不变，无法降低",
            "集成方差以 1/M 继续下降",
            "集成方差降到 0",
            "集成方差反而增大",
          ],
          correctIndex: 0,
          explanation: "ρ=1 表示所有模型给出完全相关的误差，平均后方差仍为 σ²，没有收益。",
        },
        {
          question: "Dropout 在测试时的权重缩放与精确模型平均的关系是？",
          options: [
            "它是一种近似，而非无条件等价",
            "它在数学上与枚举所有子网络平均完全等价",
            "它只在单隐层网络中等价",
            "它比精确平均更优",
          ],
          correctIndex: 0,
          explanation: "Dropout 的测试时缩放是对指数级子网络平均的一种实用近似，通常效果良好但不保证严格等价。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 9",
        section: "9.6",
        pages: "Ch 9",
        textbookSubsections: ["9.6 Model Averaging", "9.6.1 Dropout"],
        formulas: [
          "Var(y_avg) = σ²[ρ + (1−ρ)/M]",
          "ρ=0 ⇒ σ²/M",
          "ρ=1 ⇒ σ²",
        ],
        exercises: [
          "推导等方差相关模型平均的方差公式",
          "比较独立模型与完全相同模型的集成收益",
          "讨论 Dropout 为何只能近似模型平均",
        ],
      }}
      interactiveDemo={<ModelAveragingLab />}
    />
  );
}
