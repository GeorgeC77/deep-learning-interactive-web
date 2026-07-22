import BishopSectionPage from '@/components/BishopSectionPage';
import { FunctionSquare } from 'lucide-react';

export default function AppendixBOverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/appendix/b/overview"
      heroIcon={<FunctionSquare className="w-9 h-9 text-blue-600" />}
      summary={"变分法研究泛函的极值问题，欧拉-拉格朗日方程是推导连续优化问题最优解的核心工具。"}
      concepts={[
    {
      title: "泛函导数",
      description: "泛函对函数的导数定义了使泛函变化最快的方向。",
    },
    {
      title: "欧拉-拉格朗日方程",
      description: "最优函数必须满足该微分方程。",
      formula: String.raw`\frac{\partial L}{\partial y} - \frac{d}{dx}\frac{\partial L}{\partial y'} = 0`,
    },
    {
      title: "在机器学习中的应用",
      description: "高斯过程、核方法中的极值问题常通过变分法求解。",
    }
      ]}
      learningObjectives={[
      "理解 泛函导数 的含义与作用。",
      "理解 欧拉-拉格朗日方程 的含义与作用。",
      "理解 在机器学习中的应用 的含义与作用。"
    ]}
      coreIntuition={"变分法研究泛函的极值问题，欧拉-拉格朗日方程是推导连续优化问题最优解的核心工具。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Appendix B",
      pages: "Appendix B",
      textbookSubsections: [],
      formulas: ["欧拉-拉格朗日方程公式"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
