import BishopSectionPage from '@/components/BishopSectionPage';
import { Shrink } from 'lucide-react';

export default function Ch13OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch13/overview"
      heroIcon={<Shrink className="w-9 h-9 text-blue-600" />}
      summary={"连续隐变量模型假设观测数据由低维连续隐变量经线性或非线性变换生成；PCA、因子分析、VAE 都属此框架。"}
      concepts={[
    {
      title: "隐变量动机",
      description: "高维数据常分布于低维流形，隐变量提供紧凑表示并揭示数据结构。",
    },
    {
      title: "线性模型",
      description: "PCA 与因子分析假设观测是隐变量的线性函数加噪声。",
    },
    {
      title: "非线性扩展",
      description: "神经网络可参数化非线性编码器与解码器，形成 VAE 等深度生成模型。",
    }
      ]}
      learningObjectives={[
      "理解 隐变量动机 的含义与作用。",
      "理解 线性模型 的含义与作用。",
      "理解 非线性扩展 的含义与作用。"
    ]}
      coreIntuition={"连续隐变量模型假设观测数据由低维连续隐变量经线性或非线性变换生成；PCA、因子分析、VAE 都属此框架。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“隐变量动机”的叙述，哪一项最准确？",
        options: ["高维数据常分布于低维流形，隐变量提供紧凑表示并揭示数据结构。", "隐变量动机 与本节讨论的问题完全无关。", "隐变量动机 在任何情况下都不需要额外假设即可使用。"],
        correctIndex: 0,
        explanation: "正确。高维数据常分布于低维流形，隐变量提供紧凑表示并揭示数据结构。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“线性模型”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要样本量足够大，前提假设就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。线性模型 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“非线性扩展”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。非线性扩展 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 16",
      pages: "Ch 16",
      textbookSubsections: ["隐变量动机", "线性模型", "非线性扩展"],
      exercises: ["复述本节核心公式并说明每个符号含义。", "用一个小例子验证本节概念或数值结论。", "找出本节结论与相邻小节结论的异同。"]
    }}
          demo={{
      title: "隐变量维度对数据压缩的影响",
      label: "隐维度 d",
      param: 2,
      min: 1,
      max: 10,
      step: 1,
      compute: (d) => ({
        label: '相对压缩比（假设观测维 D=100）',
        value: d / 100,
        display: String.raw`\frac{d}{D}=${(d / 100).toFixed(2)}`,
      }),
      formula: String.raw`\text{压缩比} = \frac{d}{D}`,
    }}
    />
  );
}
