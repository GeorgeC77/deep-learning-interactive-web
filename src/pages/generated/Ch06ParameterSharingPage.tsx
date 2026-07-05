import BishopSectionPage from '@/components/BishopSectionPage';
import { Share2 } from 'lucide-react';

export default function Ch06ParameterSharingPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch06/parameter-sharing"
      heroIcon={<Share2 className="w-9 h-9 text-blue-600" />}
      summary={"参数共享让同一组权重在多个位置复用，显著减少参数量并强制定义不变性或局部性先验。"}
      concepts={[
    {
      title: "软权重共享",
      description: "通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。",
    },
    {
      title: "卷积中的共享",
      description: "卷积核在整张特征图上滑动，天然实现平移等变性与局部连接。",
    },
    {
      title: "参数量与统计效率",
      description: "共享使模型需要的训练数据更少，同时降低过拟合风险。",
    }
      ]}
      learningObjectives={[
      "理解 软权重共享 的含义与作用。",
      "理解 卷积中的共享 的含义与作用。",
      "理解 参数量与统计效率 的含义与作用。"
    ]}
      coreIntuition={"参数共享让同一组权重在多个位置复用，显著减少参数量并强制定义不变性或局部性先验。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“软权重共享”，下列说法是否正确？",
        options: ["通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过正则化鼓励参数彼此接近，而非强制相等，保留一定柔性。",
      },
      {
        question: "关于“卷积中的共享”，下列说法是否正确？",
        options: ["卷积核在整张特征图上滑动，天然实现平移等变性与局部连接。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。卷积核在整张特征图上滑动，天然实现平移等变性与局部连接。",
      },
      {
        question: "关于“参数量与统计效率”，下列说法是否正确？",
        options: ["共享使模型需要的训练数据更少，同时降低过拟合风险。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。共享使模型需要的训练数据更少，同时降低过拟合风险。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 9",
      section: "",
      pages: "",
    }}
          demo={{
      title: "共享参数数量对比",
      label: "特征图边长 H",
      param: 16,
      min: 4,
      max: 64,
      step: 4,
      compute: (h) => ({
        label: '全连接 / 卷积 参数量比',
        value: h * h,
        display: String.raw`\frac{K^2H^2}{K^2}=${(h * h).toFixed(0)}`,
      }),
      formula: String.raw`\frac{\text{全连接}}{\text{卷积}} = H^2`,
    }}
    />
  );
}
