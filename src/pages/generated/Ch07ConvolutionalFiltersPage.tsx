import BishopSectionPage from '@/components/BishopSectionPage';
import { Filter } from 'lucide-react';

export default function Ch07ConvolutionalFiltersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/convolutional-filters"
      heroIcon={<Filter className="w-9 h-9 text-blue-600" />}
      summary={"卷积滤波器是特征检测器；通过填充、步幅与池化控制输出尺寸，多层卷积逐步扩大感受野。"}
      concepts={[
    {
      title: "特征检测器",
      description: "不同滤波器响应不同局部模式，如水平边缘、垂直边缘或特定纹理。",
    },
    {
      title: "输出尺寸公式",
      description: "填充与步幅共同决定特征图的空间大小。",
      formula: String.raw`O = \left\lfloor \frac{I + 2P - K}{S} \right\rfloor + 1`,
    },
    {
      title: "池化",
      description: "最大池化或平均池化降低分辨率，提供局部平移不变性。",
    }
      ]}
      learningObjectives={[
      "理解 特征检测器 的含义与作用。",
      "理解 输出尺寸公式 的含义与作用。",
      "理解 池化 的含义与作用。"
    ]}
      coreIntuition={"卷积滤波器是特征检测器；通过填充、步幅与池化控制输出尺寸，多层卷积逐步扩大感受野。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“特征检测器”，下列说法是否正确？",
        options: ["不同滤波器响应不同局部模式，如水平边缘、垂直边缘或特定纹理。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。不同滤波器响应不同局部模式，如水平边缘、垂直边缘或特定纹理。",
      },
      {
        question: "关于“输出尺寸公式”，下列说法是否正确？",
        options: ["填充与步幅共同决定特征图的空间大小。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。填充与步幅共同决定特征图的空间大小。",
      },
      {
        question: "关于“池化”，下列说法是否正确？",
        options: ["最大池化或平均池化降低分辨率，提供局部平移不变性。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。最大池化或平均池化降低分辨率，提供局部平移不变性。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 10",
      section: "",
      pages: "",
    }}
          demo={{
      title: "卷积输出尺寸",
      label: "输入尺寸 I",
      param: 32,
      min: 8,
      max: 128,
      step: 1,
      compute: (I) => ({
        label: '3×3 核、步幅 2 输出尺寸',
        value: Math.floor((I - 3) / 2) + 1,
        display: String.raw`O=\\left\\lfloor\\frac{${I.toFixed(0)}-3}{2}\\right\\rfloor+1`,
      }),
      formula: String.raw`O = \left\lfloor \frac{I - K}{S} \right\rfloor + 1`,
    }}
    />
  );
}
