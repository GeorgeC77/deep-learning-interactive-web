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
          description: "Fast R-CNN 使用候选区域，在共享卷积特征图上提取 RoI 特征，然后进行类别预测和边界框回归；RPN 是 Faster R-CNN 的后续扩展，不是 Fast R-CNN 本身的必要组成。",
        },
        {
          title: "Detection across scales",
          description: "通过多尺度输入、特征金字塔或不同大小的滑动窗口，检测图像中尺寸差异较大的目标。",
        },
        {
          title: "Fast region CNNs",
          description: "两阶段检测范式：先生成候选区域，再对区域特征做分类与边框精修，兼顾精度与效率。",
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
      whyCards={[
        {
          question: "为什么需要 IoU 而不是简单的中心点距离？",
          answer: "两个中心点很近的框，一个可能很大一个可能很小，重叠程度完全不同。IoU 同时考虑位置和尺寸，是更公平的重叠度量。",
        },
        {
          question: "为什么需要非极大抑制？",
          answer: "检测器会对同一目标输出多个重叠框。NMS 保留最自信的一个，抑制其余冗余框，避免同一辆车被报告十次。",
        },
      ]}
      counterexamples={[
        "两个中心点完全重合但尺寸差异巨大的框，用中心点距离会误判为完全重叠，IoU 却能正确反映重叠比例。",
        "把 NMS 阈值设为 0.9，同一目标仍会输出多个框；设为 0.1，相邻的不同目标可能被误抑制——说明阈值选择需要权衡。",
      ]}
            bishopMapping={{
        chapter: "Ch 10",
        section: "10.4",
        pages: "Ch 10",
        textbookSubsections: [
          "10.4.1 Bounding boxes",
          "10.4.2 Intersection-over-union",
          "10.4.3 Sliding windows",
          "10.4.4 Detection across scales",
          "10.4.5 Non-max suppression",
          "10.4.6 Fast region CNNs"
        ],
        formulas: ["IoU = |A∩B| / |A∪B|"],
        algorithms: ["滑动窗口检测", "非极大抑制"],
        exercises: ["给定两个边界框坐标，手算 IoU。", "调整 NMS 阈值观察重复检测与漏检的权衡。"],
      }}
      extraContent={<IoUNMSDemo />}
    />
  );
}
