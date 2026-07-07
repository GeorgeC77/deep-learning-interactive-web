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
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
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
        question: "在一个具体情境中，你发现“深层网络训练”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。深层网络训练 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "9.5",
      pages: "Ch 9",
      textbookSubsections: ["9.5.1 残差块", "9.5.2 缓解梯度消失", "9.5.3 深层网络训练"],
      formulas: ["残差块公式"],
      algorithms: ["深层网络训练"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
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
