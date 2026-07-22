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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Appendix C",
      pages: "Appendix C",
      textbookSubsections: [],
      formulas: ["拉格朗日函数公式"],
      algorithms: ["约束优化示例"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
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
