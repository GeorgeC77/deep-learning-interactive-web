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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“拉格朗日函数”，下列说法是否正确？",
        options: ["引入乘子将约束条件并入目标函数。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。引入乘子将约束条件并入目标函数。",
      },
      {
        question: "关于“KKT 条件”，下列说法是否正确？",
        options: ["最优解处梯度、原始可行性与对偶可行性同时满足。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。最优解处梯度、原始可行性与对偶可行性同时满足。",
      },
      {
        question: "关于“约束优化示例”，下列说法是否正确？",
        options: ["最大熵分布、SVM 的对偶问题都可通过拉格朗日乘子导出。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。最大熵分布、SVM 的对偶问题都可通过拉格朗日乘子导出。",
      }
    ]}
      bishopMapping={{
      chapter: "Appendix C",
      section: "",
      pages: "",
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
