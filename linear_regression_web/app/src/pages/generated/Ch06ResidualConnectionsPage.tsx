import BishopSectionPage from '@/components/BishopSectionPage';
import { Layers } from 'lucide-react';

export default function Ch06ResidualConnectionsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/residual-connections"
      heroIcon={<Layers className="w-9 h-9 text-blue-600" />}
      summary={"残差连接通过跳跃映射让网络学习残差函数 F(x)=H(x)-x，缓解深层网络的梯度消失与退化问题。"}
      concepts={[
    {
      title: "残差块",
      description: "输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。",
      formula: String.raw`y = \mathcal{F}(x, \{W_i\}) + x`,
    },
    {
      title: "缓解梯度消失",
      description: "反向传播时梯度可直接沿跳跃连接回传，避免被多个非线性层连续收缩。",
    },
    {
      title: "深层网络训练",
      description: "ResNet 等架构借助残差连接成功训练数百甚至上千层网络。",
    }
      ]}
      learningObjectives={[
      "理解 残差块 的含义与作用。",
      "理解 缓解梯度消失 的含义与作用。",
      "理解 深层网络训练 的含义与作用。"
    ]}
      coreIntuition={"残差连接通过跳跃映射让网络学习残差函数 F(x)=H(x)-x，缓解深层网络的梯度消失与退化问题。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
      quiz={[
      {
        question: "下列关于“残差块”的叙述，哪一项最准确？",
        options: ["输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。", "残差块 只是术语，没有独立建模意义。", "残差块 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。输出为输入与变换后的特征相加，保留恒等映射的梯度传播路径。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“缓解梯度消失”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。缓解梯度消失 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“深层网络训练”的结果与预期不符，应优先排查哪些前提？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。深层网络训练 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "9.5",
      pages: "Ch 9",
      textbookSubsections: [
          "9.5 Residual Connections"
        ],
      formulas: ["残差块公式"],
      algorithms: ["深层网络训练"],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}
          demo={{
      title: "残差块的恒等梯度",
      label: "层数 L",
      param: 10,
      min: 1,
      max: 50,
      step: 1,
      compute: (L) => ({
        label: '普通梯度衰减',
        value: 0.9 ** L,
        display: String.raw`0.9^{${L.toFixed(0)}}=${(0.9 ** L).toFixed(4)}`,
      }),
      formula: String.raw`\text{普通梯度} \propto \alpha^L`,
    }}
    />
  );
}
