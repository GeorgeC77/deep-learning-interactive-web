import BishopSectionPage from '@/components/BishopSectionPage';
import { GitCommitHorizontal } from 'lucide-react';

export default function Ch15CouplingFlowsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/coupling-flows"
      heroIcon={<GitCommitHorizontal className="w-9 h-9 text-blue-600" />}
      summary={"耦合流（如归一化流中的 RealNVP）将输入分成两部分：一部分保持不变，另一部分做仿射变换，从而使 Jacobian 行列式成为对角缩放因子的乘积。"}
      concepts={[
        {
          title: "仿射耦合层",
          description: "一部分变量保持不变，另一部分做缩放与平移；缩放/平移参数由不变部分经神经网络产生。逆映射为 z = g(x)。",
          formula: String.raw`\mathbf{x}_{1:d} = \mathbf{z}_{1:d}, \quad \mathbf{x}_{d+1:D} = \mathbf{z}_{d+1:D} \odot \exp(\mathbf{s}) + \mathbf{t}`,
        },
        {
          title: "变量替换公式",
          description: "设可逆映射有两种写法：逆映射 z=g(x) 的 Jacobian 为 J_g=∂g/∂x；正向映射 x=f(z) 的 Jacobian 为 K_f=∂f/∂z。两者都可写出正确的密度变换。",
          formula: String.raw`\begin{aligned}
&\text{若 } \mathbf{z}=g(\mathbf{x}),\ J_g=\frac{\partial g}{\partial \mathbf{x}}:\quad
p_x(\mathbf{x}) = p_z(g(\mathbf{x}))\,|\det J_g(\mathbf{x})| \\
&\text{若 } \mathbf{x}=f(\mathbf{z}),\ K_f=\frac{\partial f}{\partial \mathbf{z}}:\quad
p_x(\mathbf{x}) = p_z(\mathbf{z})\,|\det K_f(\mathbf{z})|^{-1}
\end{aligned}`,
        },
        {
          title: "对数密度形式",
          description: "只有对数密度才能写成加减 log-det。对仿射耦合层，ln|det K_f| 等于被变换维度缩放因子的和。",
          formula: String.raw`\ln p_x(\mathbf{x}) = \ln p_z(\mathbf{z}) - \ln |\det K_f(\mathbf{z})|, \quad \ln |\det K_f| = \sum_i s_i`,
        },
        {
          title: "RealNVP",
          description: "堆叠多个耦合层并交替划分维度，实现全变量的非线性可逆变换。",
        },
        {
          title: "一维玩具 vs 多维现实",
          description: "单变量演示中 ln|det K|=s；多变量中应对所有被变换维度求和，其中 K=∂f/∂z。",
        },
      ]}
      learningObjectives={[
        "理解仿射耦合层为何能保持可逆且易于计算 Jacobian。",
        "能写出多维耦合层的 ln|det K| 表达式，其中 K=∂f/∂z。",
        "了解 RealNVP 中交替划分维度的作用。",
      ]}
      coreIntuition={"耦合流像一把‘分区剪刀’：先剪掉一半维度不动，再用另一半维度做简单的可逆缩放平移；因为动的一半之间没有交叉依赖，Jacobian 行列式就是对角线缩放因子的乘积。"}
      commonMistakes={[
        "把单变量演示 ln|det K|=s 当作一般结论；多维情形必须对所有被变换维度求和。",
        "错误写法是把密度直接写成 p_x=p_z-ln|det J|；正确做法是密度乘 Jacobian 行列式，只有 log density 才写成加减 log-det。",
        "混淆 J_g=∂g/∂x 与 K_f=∂f/∂z 的倒数关系：|det J_g|=|det K_f|^{-1}。",
        "认为耦合层不变的一半永远不变；通过层间交替划分，所有维度最终都会参与变换。",
      ]}
            bishopMapping={{
        chapter: "Ch 18",
        section: "18.1",
        pages: "Ch 18",
        textbookSubsections: [
          "18.1 Coupling Flows"
        ],
        supplementalTopics: [
          "coupling layers",
          "affine coupling",
          "RealNVP"
        ],
        formulas: ["仿射耦合层", "ln|det K|=Σ_i s_i", "变量替换公式"],
        algorithms: ["RealNVP", "耦合流训练"],
        exercises: ["推导二维仿射耦合层的 Jacobian 并计算行列式。", "说明交替划分维度的必要性。"],
      }}
      demo={{
        title: "多维耦合层 log-det-Jacobian（一维玩具推广）",
        label: "每个被变换维度的缩放因子 s",
        param: 0,
        min: -2,
        max: 2,
        step: 0.1,
        compute: (s) => {
          const D = 32;
          const total = D * s;
          return {
            label: 'ln|det K|（32 维求和）',
            value: total,
            display: String.raw`\sum_{i=1}^{32} s_i = 32 \cdot ${s.toFixed(1)} = ${total.toFixed(1)}`,
          };
        },
        formula: String.raw`\ln |\det K| = \sum_i s_i`,
      }}
    />
  );
}
