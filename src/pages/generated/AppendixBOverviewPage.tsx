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
      quiz={[
      {
        question: "下列关于“泛函导数”的叙述，哪一项最准确？",
        options: ["泛函对函数的导数定义了使泛函变化最快的方向。", "泛函导数 只是术语，没有独立建模意义。", "泛函导数 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。泛函对函数的导数定义了使泛函变化最快的方向。 这体现了本节的核心思想。",
      },
      {
        question: "在“欧拉-拉格朗日方程”的公式中，若省略其中某一项，会对结果产生什么影响？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。欧拉-拉格朗日方程 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“在机器学习中的应用”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。在机器学习中的应用 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
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
