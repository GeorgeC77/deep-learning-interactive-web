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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“隐变量动机”，下列说法是否正确？",
        options: ["高维数据常分布于低维流形，隐变量提供紧凑表示并揭示数据结构。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。高维数据常分布于低维流形，隐变量提供紧凑表示并揭示数据结构。",
      },
      {
        question: "关于“线性模型”，下列说法是否正确？",
        options: ["PCA 与因子分析假设观测是隐变量的线性函数加噪声。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。PCA 与因子分析假设观测是隐变量的线性函数加噪声。",
      },
      {
        question: "关于“非线性扩展”，下列说法是否正确？",
        options: ["神经网络可参数化非线性编码器与解码器，形成 VAE 等深度生成模型。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。神经网络可参数化非线性编码器与解码器，形成 VAE 等深度生成模型。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 16",
      section: "",
      pages: "",
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
