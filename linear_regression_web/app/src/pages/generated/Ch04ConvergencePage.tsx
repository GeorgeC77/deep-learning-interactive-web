import BishopSectionPage from '@/components/BishopSectionPage';
import { Zap } from 'lucide-react';

export default function Ch04ConvergencePage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/convergence"
      heroIcon={<Zap className="w-9 h-9 text-blue-600" />}
      summary={"加速收敛需要利用梯度历史：动量累积速度、自适应方法按维度缩放步长，学习率调度控制长期精细搜索。"}
      concepts={[
    {
      title: "动量法",
      description: "引入速度变量，使更新方向平滑并加速穿越一致梯度方向。",
      formula: String.raw`v^{(\tau+1)} = \mu v^{(\tau)} - \eta \nabla E \quad ; \quad w^{(\tau+1)} = w^{(\tau)} + v^{(\tau+1)}`,
    },
    {
      title: "RMSProp / Adam",
      description: "维护梯度平方的指数移动平均，为每个参数自适应调整学习率。",
    },
    {
      title: "学习率衰减",
      description: "步长随 epoch 递减，保证理论上收敛到局部极小值附近。",
    }
      ]}
      learningObjectives={[
      "理解 动量法 的含义与作用。",
      "理解 RMSProp / Adam 的含义与作用。",
      "理解 学习率衰减 的含义与作用。"
    ]}
      coreIntuition={"加速收敛需要利用梯度历史：动量累积速度、自适应方法按维度缩放步长，学习率调度控制长期精细搜索。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“动量法”的叙述，哪一项最准确？",
        options: ["引入速度变量，使更新方向平滑并加速穿越一致梯度方向。", "动量法 只是术语，没有独立建模意义。", "动量法 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。引入速度变量，使更新方向平滑并加速穿越一致梯度方向。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“RMSProp / Adam”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。RMSProp / Adam 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“学习率衰减”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。学习率衰减 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      section: "7.3",
      pages: "Ch 7",
      textbookSubsections: [
          "7.3 Convergence",
          "7.3.1 Momentum",
          "7.3.2 Learning rate schedule",
          "7.3.3 RMSProp and Adam"
        ],
      formulas: ["动量法公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}
          demo={{
      title: "动量系数对有效步长的影响",
      label: "动量系数 μ",
      param: 0.9,
      min: 0,
      max: 0.99,
      step: 0.01,
      compute: (mu) => ({
        label: '有效累积因子',
        value: 1 / (1 - mu),
        display: String.raw`\frac{1}{1-${mu.toFixed(2)}}=${(1 / (1 - mu)).toFixed(1)}`,
      }),
      formula: String.raw`\text{有效累积} = \frac{1}{1-\mu}`,
    }}
    />
  );
}
