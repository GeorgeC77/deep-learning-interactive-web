import BishopSectionPage from '@/components/BishopSectionPage';
import FlowArchitectureLab from '@/components/demos/FlowArchitectureLab';
import { ArrowLeftRight } from 'lucide-react';

export default function Ch15OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch15/overview"
      heroIcon={<ArrowLeftRight className="w-9 h-9 text-blue-600" />}
      summary={"归一化流（Normalizing Flows）通过可逆神经网络将简单基分布变换为复杂分布，同时保持精确的似然计算。本章介绍耦合流、自回归流与连续流三种主流架构。"}
      concepts={[
        {
          title: "可逆变换",
          description: "每一层都是双射，既能从基变量采样得到数据，也能从数据反解回基变量。",
        },
        {
          title: "变量替换公式",
          description: "x 空间的密度等于 z 空间密度在逆映射处的值乘以 Jacobian 行列式的倒数。",
          formula: String.raw`\ln p_x(\mathbf{x}) = \ln p_z(g(\mathbf{x})) - \ln \left| \det \frac{\partial f}{\partial \mathbf{z}} \right|`,
        },
        {
          title: "流架构权衡",
          description: "耦合流计算高效但需交替划分；自回归流密度估计方便但采样串行；连续流精度由 ODE 求解器控制。",
        },
      ]}
      learningObjectives={[
        "理解归一化流的可逆性与精确似然计算优势。",
        "掌握变量替换公式中 Jacobian 的作用。",
        "了解三种流架构的核心思想与取舍。",
      ]}
      coreIntuition={"归一化流像把一团橡皮泥从一个简单形状拉伸、折叠成复杂形状；只要每一步都可逆且能算出体积变化，我们就知道最终形状的密度。"}
      commonMistakes={[
        "把变量替换公式中的 Jacobian 项符号弄反。",
        "为了可逆性牺牲过多表达能力，导致模型无法拟合复杂数据。",
        "忽视不同流架构在训练、采样与密度评估上的计算差异。",
      ]}
            bishopMapping={{
        chapter: "Ch 18",
        pages: "Ch 18",
        textbookSubsections: [
          "18.1 Coupling Flows",
          "18.2 Autoregressive Flows",
          "18.3 Continuous Flows"
        ],
        supplementalTopics: [
          "RealNVP",
          "MAF",
          "IAF",
          "FFJORD"
        ],
        formulas: ["变量替换公式", "p_x(x)=p_z(g(x))|det J|^{-1}"],
        algorithms: ["RealNVP", "MAF/IAF", "Neural ODE flows"],
        exercises: ["从 f(z)=2z 推导一维变量替换公式。", "比较三种流架构的采样与密度评估复杂度。"],
      }}
      interactiveDemo={<FlowArchitectureLab />}
    />
  );
}
