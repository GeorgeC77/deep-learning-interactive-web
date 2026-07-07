import BishopSectionPage from '@/components/BishopSectionPage';
import { Maximize } from 'lucide-react';

export default function AppendixCOverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/appendix/c/overview"
      heroIcon={<Maximize className="w-9 h-9 text-blue-600" />}
      summary={"拉格朗日乘子法将带等式约束的优化问题转化为无约束问题，是推导正则化与最大熵等方法的基础。"}
      concepts={[
    {
      title: "拉格朗日函数",
      description: "引入乘子将约束条件并入目标函数。",
      formula: String.raw`\mathcal{L}(x, \lambda) = f(x) + \lambda g(x)`,
    },
    {
      title: "KKT 条件",
      description: "最优解处梯度、原始可行性与对偶可行性同时满足。",
    },
    {
      title: "约束优化示例",
      description: "最大熵分布、SVM 的对偶问题都可通过拉格朗日乘子导出。",
    }
      ]}
      learningObjectives={[
      "理解 拉格朗日函数 的含义与作用。",
      "理解 KKT 条件 的含义与作用。",
      "理解 约束优化示例 的含义与作用。"
    ]}
      coreIntuition={"拉格朗日乘子法将带等式约束的优化问题转化为无约束问题，是推导正则化与最大熵等方法的基础。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“拉格朗日函数”的叙述，哪一项最准确？",
        options: ["引入乘子将约束条件并入目标函数。", "拉格朗日函数 只是术语，没有独立建模意义。", "拉格朗日函数 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。引入乘子将约束条件并入目标函数。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“KKT 条件”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。KKT 条件 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“约束优化示例”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。约束优化示例 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Appendix C",
      pages: "Appendix C",
      textbookSubsections: ["拉格朗日函数", "KKT 条件", "约束优化示例"],
      formulas: ["拉格朗日函数公式"],
      algorithms: ["约束优化示例"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}
          demo={{
      title: "等式约束下的二次目标",
      label: "约束值 c",
      param: 1,
      min: -2,
      max: 2,
      step: 0.1,
      compute: (c) => ({
        label: '最优 x²',
        value: c * c,
        display: String.raw`\\min x^2 \\text{ s.t. }x=c \\Rightarrow ${(c * c).toFixed(2)}`,
      }),
      formula: String.raw`\min_x x^2 \quad \text{s.t.} \quad x = c`,
    }}
    />
  );
}
