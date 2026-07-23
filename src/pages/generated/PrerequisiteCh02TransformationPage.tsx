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
          title: "补充直觉：把复杂分布映射到标准高斯",
          description: "通过可逆变换将复杂分布转化为简单分布（如标准高斯），便于采样与推断。这不是 Bishop 的编号小节，而是贯穿本章的应用思路。",
        },
      ]}
      learningObjectives={[
        "掌握一元变量替换公式。",
        "理解多元密度变换中 Jacobian 行列式的意义。",
        "能将复杂分布通过可逆变换映射到标准分布。",
      ]}
      coreIntuition={"变量变换时概率质量守恒；密度的变化由变换的局部伸缩因子（导数或 Jacobian 行列式）补偿。"}
      commonMistakes={[
        "忘记取导数绝对值，导致密度为负。",
        "多元情形下混淆 ∂x/∂y 与 ∂y/∂x，用错 Jacobian 矩阵。",
        "在非单调变换上直接套用一元变量替换公式。",
      ]}
      whyCards={[
        {
          question: "为什么密度变换需要 Jacobian 行列式？",
          answer: "变量变换会拉伸或压缩空间，Jacobian 行列式正是衡量这种局部体积变化的因子，保证概率质量守恒。",
        },
        {
          question: "为什么可逆变换在生成模型中如此重要？",
          answer: "可逆变换让我们既能从简单分布采样生成复杂数据，也能精确计算生成样本的概率密度，这是归一化流的基础。",
        },
      ]}
      counterexamples={[
        "忘记取导数绝对值，导致密度为负——说明概率密度必须非负。",
        "在非单调变换上直接套用一元变量替换公式，导致密度积分不为 1——说明可逆性是变量替换的前提。",
      ]}
            bishopMapping={{
        chapter: "Ch 2",
        section: "2.4",
        pages: "Ch 2",
        textbookSubsections: [
          "2.4 Transformation of Densities",
          "2.4.1 Multivariate distributions"
        ],
        formulas: ["一元变量替换公式", "多元密度变换公式"],
        algorithms: ["可逆变量替换"],
        exercises: ["验证线性变换 y=ax+b 下密度的缩放关系。", "计算二维极坐标变换的 Jacobian 行列式。"],
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
