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
      quiz={[
        {
          question: "对 y=g(x)=2x，已知 p_x(x)=N(0,1)，则 p_y(y) 在 y=2 处的值约为 p_x(1) 的多少倍？",
          options: ["1/2", "2", "1", "4"],
          correctIndex: 0,
          explanation: "p_y(y)=p_x(y/2)·|dx/dy|=p_x(1)·1/2，因此为 p_x(1) 的一半。",
        },
        {
          question: "多元密度变换中，为什么需要 Jacobian 行列式的绝对值？",
          options: [
            "它刻画体积元的局部伸缩，保证变换后总概率仍为 1。",
            "为了让公式更复杂。",
            "因为行列式本身就是概率密度。",
            "只在高维情形需要，一维不需要。",
          ],
          correctIndex: 0,
          explanation: "Jacobian 行列式的绝对值反映变换对体积元的缩放，密度必须相应缩放以保持概率守恒。",
        },
        {
          question: "若 g 不是单调可逆函数，一元变量替换公式是否仍然适用？",
          options: [
            "不适用，需要分段处理或改用其他方法。",
            "适用，只要 g 连续即可。",
            "适用，只要 g 可导即可。",
            "适用，但需要取平均导数。",
          ],
          correctIndex: 0,
          explanation: "一元变量替换要求 g 单调可逆；否则一个 y 可能对应多个 x，需要分段求和。",
        },
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
