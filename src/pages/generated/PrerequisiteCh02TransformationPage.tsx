import BishopSectionPage from '@/components/BishopSectionPage';
import { Shuffle } from 'lucide-react';

export default function PrerequisiteCh02TransformationPage() {
  return (
    <BishopSectionPage
      sectionPath="/prerequisite/ch02/transformation"
      heroIcon={<Shuffle className="w-9 h-9 text-blue-600" />}
      summary={"密度变换描述随机变量经过可逆函数映射后，新变量的概率密度如何由原密度与 Jacobian 行列式共同决定。"}
      concepts={[
    {
      title: "一元变量替换",
      description: "对单调可逆变换 y = g(x)，新密度等于原密度乘以导数绝对值的倒数。",
      formula: String.raw`p_y(y) = p_x(g^{-1}(y)) \left| \frac{dx}{dy} \right|`,
    },
    {
      title: "多元密度变换",
      description: "多维情形下用 Jacobian 行列式刻画体积元的伸缩，保证总概率仍为 1。",
      formula: String.raw`p_y(\mathbf{y}) = p_x(\mathbf{x}) \left| \det \frac{\partial \mathbf{x}}{\partial \mathbf{y}} \right|`,
    },
    {
      title: "标准化技巧",
      description: "通过可逆变换将复杂分布转化为简单分布（如标准高斯），便于采样与推断。",
    }
      ]}
      learningObjectives={[
      "理解 一元变量替换 的含义与作用。",
      "理解 多元密度变换 的含义与作用。",
      "理解 标准化技巧 的含义与作用。"
    ]}
      coreIntuition={"密度变换描述随机变量经过可逆函数映射后，新变量的概率密度如何由原密度与 Jacobian 行列式共同决定。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“一元变量替换”的叙述，哪一项最准确？",
        options: ["对单调可逆变换 y = g(x)，新密度等于原密度乘以导数绝对值的倒数。", "一元变量替换 与本节讨论的问题完全无关。", "一元变量替换 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。对单调可逆变换 y = g(x)，新密度等于原密度乘以导数绝对值的倒数。 这体现了本节的核心思想。",
      },
      {
        question: "在“多元密度变换”的公式中，若忽略其中某一项，最可能导致什么后果？",
        options: ["得到形式上“简洁”但数值或概率意义错误的结论。", "结果只是略有不精确，不会影响最终决策。", "公式会自动退化为另一种更简单的正确形式。"],
        correctIndex: 0,
        explanation: "正确。多元密度变换 的每一项都有明确的数学或物理意义，随意省略会破坏等式成立的条件。",
      },
      {
        question: "在一个具体情境中，你发现“标准化技巧”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。标准化技巧 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 2",
      section: "2.4",
      pages: "Ch 2",
      textbookSubsections: ["2.4.1 一元变量替换", "2.4.2 多元密度变换", "2.4.3 标准化技巧"],
      formulas: ["一元变量替换公式", "多元密度变换公式"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "线性缩放对密度的影响",
      label: "缩放系数 a",
      param: 1,
      min: 0.2,
      max: 3,
      step: 0.1,
      compute: (a) => ({
        label: 'p_y(1)',
        value: (Math.exp(-a * a / 2) / Math.sqrt(2 * Math.PI)) * a,
        display: String.raw`p_y(1)=\frac{1}{\sqrt{2\pi}}e^{-${a.toFixed(1)}^2/2}\cdot ${a.toFixed(1)}`,
      }),
      formula: String.raw`p_y(y) = p_x(ay) \cdot a`,
    }}
    />
  );
}
