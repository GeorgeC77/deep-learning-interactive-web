import BishopSectionPage from '@/components/BishopSectionPage';
import ChapterProgressCard from '@/components/ChapterProgressCard';
import FlowArchitectureLab from '@/components/demos/FlowArchitectureLab';
import { ArrowLeftRight } from 'lucide-react';

const progressSections = [
  { exerciseSetId: 'chapter15-coupling', label: '18.1 耦合流', path: '/ch15/coupling-flows', exerciseCount: 3 },
  { exerciseSetId: 'chapter15-autoregressive', label: '18.2 自回归流', path: '/ch15/autoregressive-flows', exerciseCount: 3 },
  { exerciseSetId: 'chapter15-continuous', label: '18.3 连续流', path: '/ch15/continuous-flows', exerciseCount: 3 },
];

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
          description: "教材用逆映射 z=g(x) 时乘 |det J_g|；若改用正向映射 x=f(z)，则除以 |det K_f|。两种写法等价，但 Jacobian 方向与符号必须配套。",
          formula: String.raw`p_x(\mathbf{x})=p_z(g(\mathbf{x}))\left|\det\frac{\partial g}{\partial\mathbf{x}}\right|=p_z(\mathbf z)\left|\det\frac{\partial f}{\partial\mathbf z}\right|^{-1}`,
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
        pages: "pp. 547–561",
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
        formulas: ["逆映射：p_x(x)=p_z(g(x))|det J_g(x)|", "正向映射：p_x(f(z))=p_z(z)|det K_f(z)|^{-1}"],
        algorithms: ["RealNVP", "MAF/IAF", "Neural ODE flows"],
        exercises: ["从 f(z)=2z 推导一维变量替换公式。", "比较三种流架构的采样与密度评估复杂度。"],
      }}
      interactiveDemo={<FlowArchitectureLab />}
      extraContent={(
        <>
          <ChapterProgressCard title="归一化流掌握进度" sections={progressSections} />
          <p className="text-center text-sm text-emerald-800">
            完成三节共 9 道原创练习，即可串联变量替换、三角 Jacobian、MAF/IAF 方向与连续时间密度演化。
          </p>
        </>
      )}
    />
  );
}
