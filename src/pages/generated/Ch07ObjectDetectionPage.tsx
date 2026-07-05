import BishopSectionPage from '@/components/BishopSectionPage';
import { Target } from 'lucide-react';

export default function Ch07ObjectDetectionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/object-detection"
      heroIcon={<Target className="w-9 h-9 text-blue-600" />}
      summary={"目标检测需要同时预测物体的类别与边界框位置；多尺度、锚框与非极大抑制是核心组件。"}
      concepts={[
    {
      title: "边界框与 IoU",
      description: "交并比衡量两个框的重叠程度，是评估与匹配的标准。",
      formula: String.raw`\text{IoU} = \frac{|A \cap B|}{|A \cup B|}`,
    },
    {
      title: "多尺度检测",
      description: "在不同分辨率特征图上并行预测，兼顾大目标与小目标。",
    },
    {
      title: "非极大抑制",
      description: "去除高度重叠的冗余预测框，只保留置信度最高的结果。",
    }
      ]}
      learningObjectives={[
      "理解 边界框与 IoU 的含义与作用。",
      "理解 多尺度检测 的含义与作用。",
      "理解 非极大抑制 的含义与作用。"
    ]}
      coreIntuition={"目标检测需要同时预测物体的类别与边界框位置；多尺度、锚框与非极大抑制是核心组件。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“边界框与 IoU”，下列说法是否正确？",
        options: ["交并比衡量两个框的重叠程度，是评估与匹配的标准。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。交并比衡量两个框的重叠程度，是评估与匹配的标准。",
      },
      {
        question: "关于“多尺度检测”，下列说法是否正确？",
        options: ["在不同分辨率特征图上并行预测，兼顾大目标与小目标。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。在不同分辨率特征图上并行预测，兼顾大目标与小目标。",
      },
      {
        question: "关于“非极大抑制”，下列说法是否正确？",
        options: ["去除高度重叠的冗余预测框，只保留置信度最高的结果。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。去除高度重叠的冗余预测框，只保留置信度最高的结果。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 10",
      section: "",
      pages: "",
    }}
          demo={{
      title: "IoU 随框偏移变化",
      label: "两框中心距离 d",
      param: 0,
      min: 0,
      max: 2,
      step: 0.05,
      compute: (d) => {
        const iou = d >= 1 ? 0 : Math.max(0, (1 - d) / (1 + d));
        return {
          label: 'IoU（单位框）',
          value: iou,
          display: String.raw`\\text{IoU}=${iou.toFixed(3)}`,
        };
      },
      formula: String.raw`\text{IoU} = \frac{|A \cap B|}{|A \cup B|}`,
    }}
    />
  );
}
