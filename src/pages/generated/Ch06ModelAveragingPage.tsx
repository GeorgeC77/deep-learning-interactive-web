import BishopSectionPage from '@/components/BishopSectionPage';
import { Users } from 'lucide-react';

export default function Ch06ModelAveragingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/model-averaging"
      heroIcon={<Users className="w-9 h-9 text-blue-600" />}
      summary={"模型平均通过组合多个模型的预测降低方差；Dropout 可视为对大量子网络做指数级隐式模型平均。"}
      concepts={[
    {
      title: "委员会机器",
      description: "独立训练多个模型并平均输出，通常能提升泛化性能。",
      formula: String.raw`y_{\text{avg}} = \frac{1}{M} \sum_{m=1}^{M} y_m(x)`,
    },
    {
      title: "Dropout 作为平均",
      description: "训练时随机失活神经元，等价于采样子网络；测试时缩放近似所有子网络平均。",
    },
    {
      title: "贝叶斯模型平均",
      description: "按模型后验概率加权组合，理论上最优但计算昂贵。",
    }
      ]}
      learningObjectives={[
      "理解 委员会机器 的含义与作用。",
      "理解 Dropout 作为平均 的含义与作用。",
      "理解 贝叶斯模型平均 的含义与作用。"
    ]}
      coreIntuition={"模型平均通过组合多个模型的预测降低方差；Dropout 可视为对大量子网络做指数级隐式模型平均。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“委员会机器”的叙述，哪一项最准确？",
        options: ["独立训练多个模型并平均输出，通常能提升泛化性能。", "委员会机器 只是术语，没有独立建模意义。", "委员会机器 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。独立训练多个模型并平均输出，通常能提升泛化性能。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“Dropout 作为平均”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。Dropout 作为平均 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“贝叶斯模型平均”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。贝叶斯模型平均 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "9.6",
      pages: "Ch 9",
      textbookSubsections: ["9.6.1 委员会机器", "9.6.2 Dropout 作为平均", "9.6.3 贝叶斯模型平均"],
      formulas: ["委员会机器公式"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}
          demo={{
      title: "集成数量对误差的影响",
      label: "模型数量 M",
      param: 5,
      min: 1,
      max: 20,
      step: 1,
      compute: (M) => ({
        label: '方差缩减比例',
        value: 1 / Math.sqrt(M),
        display: String.raw`\sigma_{\text{avg}}=\sigma/\sqrt{${M.toFixed(0)}}=${(1 / Math.sqrt(M)).toFixed(3)}`,
      }),
      formula: String.raw`\sigma_{\text{avg}} = \frac{\sigma}{\sqrt{M}}`,
    }}
    />
  );
}
