import BishopSectionPage from '@/components/BishopSectionPage';
import IoUNMSDemo from '@/components/demos/IoUNMSDemo';
import { Target } from 'lucide-react';

export default function Ch07ObjectDetectionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/object-detection"
      heroIcon={<Target className="w-9 h-9 text-blue-600" />}
      summary={"Bishop Ch 10.4 从边界框与 IoU 出发，介绍滑动窗口、多尺度检测、非极大抑制以及 Fast R-CNN 等两阶段检测思路。锚框是部分工程实现中的补充设计，不是教材主线。"}
      concepts={[
        {
          title: "边界框",
          description: "用矩形参数 (x, y, w, h) 或两角坐标描述目标位置。",
        },
        {
          title: "交并比 IoU",
          description: "衡量两个边界框重叠程度，是评估与匹配的核心指标。",
          formula: String.raw`\text{IoU}(A,B) = \frac{|A \cap B|}{|A \cup B|}`,
        },
        {
          title: "滑动窗口与多尺度检测",
          description: "在图像不同位置与分辨率上运行分类器，以检测不同大小目标。",
        },
        {
          title: "非极大抑制 NMS",
          description: "按置信度排序，抑制与已保留框 IoU 超过阈值的冗余框。",
        },
        {
          title: "Fast R-CNN",
          description: "先用区域提议网络生成候选框，再统一提取特征进行分类与回归。",
        },
      ]}
      learningObjectives={[
        "会用坐标计算两个边界框的 IoU。",
        "理解滑动窗口与多尺度检测的必要性。",
        "能说明 NMS 的作用与阈值选择的影响。",
      ]}
      coreIntuition={"目标检测=“在哪里”+“是什么”。边界框回答位置，IoU 给出框的质量度量；NMS 则避免同一目标被重复报告。"}
      commonMistakes={[
        "把锚框（anchor box）当成目标检测的唯一或教材核心方法；Bishop Ch 10.4 的主线并不依赖锚框。",
        "用中心点距离代替 IoU，导致对框尺寸差异不敏感。",
        "NMS 阈值设置过严，漏检小目标；或设置过松，重复检测增多。",
      ]}
      quiz={[
        {
          question: "框 A=(0,0,4,4)，框 B=(2,2,4,4)，它们的 IoU 是多少？",
          options: ["4/28 = 1/7 ≈ 0.143", "4/16 = 0.25", "16/28 ≈ 0.571", "0"],
          correctIndex: 0,
          explanation: "交集面积 2×2=4，并集面积 16+16-4=28，IoU=4/28≈0.143。",
        },
        {
          question: "根据 Bishop Ch 10.4 的主线，下列哪项不是核心内容而是工程补充？",
          options: ["锚框设计", "边界框", "IoU", "非极大抑制"],
          correctIndex: 0,
          explanation: "锚框在某些实现（如 Faster R-CNN、YOLO）中作为先验框，但 Bishop 教材主线围绕边界框、IoU、滑动窗口、多尺度、NMS、Fast R-CNN。",
        },
        {
          question: "NMS 中若 IoU 阈值从 0.5 提高到 0.8，最可能出现什么情况？",
          options: [
            "更多重叠框被保留，重复检测增加。",
            "所有框都被删除，导致漏检。",
            "对单个大目标无影响，只影响小目标。",
            "IoU 阈值与结果无关。",
          ],
          correctIndex: 0,
          explanation: "阈值越高，抑制条件越宽松，更多高重叠框会被保留，从而增加重复检测。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 10",
        section: "10.4",
        pages: "Ch 10",
        textbookSubsections: ["10.4.1 Bounding boxes", "10.4.2 Intersection-over-union", "10.4.3 Sliding windows", "10.4.4 Detection across scales", "10.4.5 Non-max suppression", "10.4.6 Fast region CNNs"],
        formulas: ["IoU = |A∩B| / |A∪B|"],
        algorithms: ["滑动窗口检测", "非极大抑制"],
        exercises: ["给定两个边界框坐标，手算 IoU。", "调整 NMS 阈值观察重复检测与漏检的权衡。"],
      }}
      extraContent={<IoUNMSDemo />}
    />
  );
}
