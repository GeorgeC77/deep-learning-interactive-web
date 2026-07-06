import BishopSectionPage from '@/components/BishopSectionPage';
import ConvolutionSizeDemo from '@/components/demos/ConvolutionSizeDemo';
import { Filter } from 'lucide-react';

export default function Ch07ConvolutionalFiltersPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/convolutional-filters"
      heroIcon={<Filter className="w-9 h-9 text-blue-600" />}
      summary={"卷积滤波器通过局部连接与权重共享检测边缘、纹理等模式；填充（padding）与步幅（stride）共同决定输出特征图尺寸。"}
      concepts={[
        {
          title: "平移等变性",
          description: "对输入图像的平移，卷积输出也相应平移；同一滤波器在整个空间上复用。",
        },
        {
          title: "输出尺寸公式",
          description: "给定输入尺寸 I、核尺寸 K、填充 P、步幅 S，输出尺寸由含 padding 的通用公式给出。",
          formula: String.raw`O = \left\lfloor \frac{I + 2P - K}{S} \right\rfloor + 1`,
        },
        {
          title: "Valid convolution",
          description: "不填充（P=0），输出尺寸自然缩小；不存在边界外推。",
        },
        {
          title: "Same convolution",
          description: "选择 P 使得输出尺寸与输入尺寸相同；常见实现取 P = (K-1)/2（当 S=1 且 K 为奇数）。",
          formula: String.raw`O = I \quad \Longleftrightarrow \quad P = \frac{K-1}{2} \; (K \text{ 奇}, S=1)`,
        },
      ]}
      learningObjectives={[
        "理解卷积的平移等变性与权重共享。",
        "能够根据 I、K、P、S 计算输出尺寸。",
        "区分 valid convolution 与 same convolution 的适用场景。",
      ]}
      coreIntuition={"卷积像是用一把“滑动尺子”在图像上扫描：尺子大小（K）、每次滑动距离（S）、边界补零（P）共同决定最终得到多少格响应。"}
      commonMistakes={[
        "忘记 padding 项 2P，直接用 O = ⌊(I-K)/S⌋+1 导致边界尺寸错误。",
        "把 same convolution 当成数学必要条件；它只是工程上常用的设计选择。",
        "忽略当 I+2P-K 不是 S 的整数倍时，最右侧/底部像素会被丢弃。",
      ]}
      quiz={[
        {
          question: "若 I=32, K=5, P=2, S=1，输出尺寸 O 是多少？",
          options: ["32", "28", "30", "16"],
          correctIndex: 0,
          explanation: "O = ⌊(32 + 4 - 5)/1⌋ + 1 = 32，这是典型的 same convolution。",
        },
        {
          question: "valid convolution 与 same convolution 的根本区别是什么？",
          options: [
            "valid 不填充，same 调整 padding 使输出尺寸等于输入尺寸（在 S=1 时）。",
            "valid 用于训练，same 用于测试。",
            "valid 一定比 same 计算量更小。",
            "valid 与 same 只是命名不同，没有实质区别。",
          ],
          correctIndex: 0,
          explanation: "valid 在边界不补零，same 通过 padding 保持尺寸；选择取决于任务对边界信息的需求。",
        },
        {
          question: "步幅 S>1 时，same convolution 是否仍能保证 O=I？",
          options: [
            "不一定；若 S 不整除 I+2P-K+1，则会出现下采样。",
            "一定可以，只要 P 足够大。",
            "一定不行，因为步幅大于 1 必然缩小尺寸。",
            "只有 K 为偶数时才不行。",
          ],
          correctIndex: 0,
          explanation: "S>1 时通常无法精确保持尺寸；输出尺寸由 ⌊(I+2P-K)/S⌋+1 决定。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 10",
        section: "10.2",
        pages: "Ch 10",
        textbookSubsections: ["10.2.1 Convolutional layers", "10.2.2 Padding and stride", "10.2.3 Pooling"],
        formulas: ["输出尺寸 O = ⌊(I+2P-K)/S⌋+1", "same convolution 条件"],
        algorithms: ["二维离散卷积", "最大/平均池化"],
        exercises: ["给定 VGG 某层 I=224, K=3, P=1, S=1，逐层推导尺寸变化。", "对比 valid 与 same 在边界像素上的差异。"],
      }}
      extraContent={<ConvolutionSizeDemo />}
    />
  );
}
