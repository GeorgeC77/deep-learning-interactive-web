import BishopSectionPage from '@/components/BishopSectionPage';
import { TrendingDown } from 'lucide-react';

export default function Ch04OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch04/overview"
      heroIcon={<TrendingDown className="w-9 h-9 text-blue-600" />}
      summary={"本章介绍训练深度网络的核心优化方法：从误差曲面的局部结构到批量、随机、动量、自适应学习率等实用算法。"}
      concepts={[
    {
      title: "误差曲面",
      description: "损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度。",
    },
    {
      title: "梯度下降族",
      description: "批量 GD、SGD 与小批量 SGD 在计算效率与梯度方差之间权衡。",
    },
    {
      title: "自适应方法",
      description: "动量、RMSProp 与 Adam 通过累积历史梯度信息加速收敛并减少震荡。",
    },
    {
      title: "学习率调度",
      description: "随训练进程降低学习率，兼顾快速收敛与精细逼近局部极小值。",
    }
      ]}
      learningObjectives={[
      "理解 误差曲面 的含义与作用。",
      "理解 梯度下降族 的含义与作用。",
      "理解 自适应方法 的含义与作用。"
    ]}
      coreIntuition={"本章介绍训练深度网络的核心优化方法：从误差曲面的局部结构到批量、随机、动量、自适应学习率等实用算法。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“误差曲面”的叙述，哪一项最准确？",
        options: ["损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度。", "误差曲面 只是术语，没有独立建模意义。", "误差曲面 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。损失函数在高维参数空间形成复杂曲面，局部曲率决定优化难度。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“梯度下降族”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。梯度下降族 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“自适应方法”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。自适应方法 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 7",
      pages: "Ch 7",
      textbookSubsections: ["误差曲面", "梯度下降族", "自适应方法", "学习率调度"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}
          demo={{
      title: "学习率对收敛步数的影响",
      label: "学习率 η",
      param: 0.3,
      min: 0.01,
      max: 1,
      step: 0.01,
      compute: (eta) => ({
        label: '单步相对进展',
        value: eta * Math.exp(-eta),
        display: String.raw`\Delta = ${(eta * Math.exp(-eta)).toFixed(3)}`,
      }),
      formula: String.raw`\Delta(\eta) = \eta e^{-\eta}`,
    }}
    />
  );
}
