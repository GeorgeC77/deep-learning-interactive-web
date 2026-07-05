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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“一元变量替换”，下列说法是否正确？",
        options: ["对单调可逆变换 y = g(x)，新密度等于原密度乘以导数绝对值的倒数。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对单调可逆变换 y = g(x)，新密度等于原密度乘以导数绝对值的倒数。",
      },
      {
        question: "关于“多元密度变换”，下列说法是否正确？",
        options: ["多维情形下用 Jacobian 行列式刻画体积元的伸缩，保证总概率仍为 1。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。多维情形下用 Jacobian 行列式刻画体积元的伸缩，保证总概率仍为 1。",
      },
      {
        question: "关于“标准化技巧”，下列说法是否正确？",
        options: ["通过可逆变换将复杂分布转化为简单分布（如标准高斯），便于采样与推断。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过可逆变换将复杂分布转化为简单分布（如标准高斯），便于采样与推断。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 2",
      section: "transformation",
      pages: "",
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
