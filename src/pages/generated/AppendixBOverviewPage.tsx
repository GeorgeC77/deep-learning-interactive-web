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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“泛函导数”，下列说法是否正确？",
        options: ["泛函对函数的导数定义了使泛函变化最快的方向。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。泛函对函数的导数定义了使泛函变化最快的方向。",
      },
      {
        question: "关于“欧拉-拉格朗日方程”，下列说法是否正确？",
        options: ["最优函数必须满足该微分方程。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。最优函数必须满足该微分方程。",
      },
      {
        question: "关于“在机器学习中的应用”，下列说法是否正确？",
        options: ["高斯过程、核方法中的极值问题常通过变分法求解。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。高斯过程、核方法中的极值问题常通过变分法求解。",
      }
    ]}
      bishopMapping={{
      chapter: "Appendix B",
      section: "",
      pages: "",
    }}

    />
  );
}
