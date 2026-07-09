import BishopSectionPage from '@/components/BishopSectionPage';
import { Layers } from 'lucide-react';

export default function Ch07OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/overview"
      heroIcon={<Layers className="w-9 h-9 text-blue-600" />}
      summary={"卷积神经网络通过局部连接、权重共享与层次化特征提取，成为图像等网格数据的主流模型。"}
      concepts={[
    {
      title: "卷积操作",
      description: "用滑动滤波器在输入上计算局部响应，捕获边缘、纹理等低层特征。",
    },
    {
      title: "平移等变性",
      description: "输入平移导致特征图相应平移，保持空间关系不变。",
    },
    {
      title: "池化与层次化",
      description: "下采样增大感受野并降低计算量，深层网络组合得到语义更强的特征。",
    }
      ]}
      learningObjectives={[
      "理解 卷积操作 的含义与作用。",
      "理解 平移等变性 的含义与作用。",
      "理解 池化与层次化 的含义与作用。"
    ]}
      coreIntuition={"卷积神经网络通过局部连接、权重共享与层次化特征提取，成为图像等网格数据的主流模型。"}
      commonMistakes={[
      "混淆本节核心概念与相邻小节的前提假设，导致错误套用。",
      "只记忆公式形式，而不验证其成立条件与具体数值。"
    ]}
      quiz={[
      {
        question: "下列关于“卷积操作”的叙述，哪一项最准确？",
        options: ["用滑动滤波器在输入上计算局部响应，捕获边缘、纹理等低层特征。", "卷积操作 只是术语，没有独立建模意义。", "卷积操作 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。用滑动滤波器在输入上计算局部响应，捕获边缘、纹理等低层特征。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“平移等变性”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。平移等变性 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“池化与层次化”的结果违背直觉，应优先排查哪些前提假设？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。池化与层次化 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 10",
      pages: "Ch 10",
      textbookSubsections: [],
      exercises: ["推导本节核心公式的展开形式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "对比本节结论与先前章节结论的适用条件差异。"]
    }}
          demo={{
      title: "卷积感受野随层数增长",
      label: "网络层数 L",
      param: 3,
      min: 1,
      max: 10,
      step: 1,
      compute: (L) => ({
        label: '3×3 核感受野边长',
        value: 1 + 2 * L,
        display: String.raw`R=1+2\cdot${L.toFixed(0)}=${(1 + 2 * L).toFixed(0)}`,
      }),
      formula: String.raw`R = 1 + 2L`,
    }}
    />
  );
}
