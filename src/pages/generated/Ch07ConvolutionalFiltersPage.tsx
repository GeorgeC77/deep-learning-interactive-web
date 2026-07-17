import BishopSectionPage from '@/components/BishopSectionPage';
import ConvolutionSizeDemo from '@/components/demos/ConvolutionSizeDemo';
import FeatureHierarchyLab from '@/components/demos/FeatureHierarchyLab';
import {
  computeOutputSize,
  computeSamePadding,
  outputSizeFormulaLatex,
  classicSameFormulaLatex,
  frameworkSameFormulaLatex,
  frameworkSamePaddingFormulaLatex,
} from '@/lib/math/conv';
import { Filter } from 'lucide-react';

const SAME_DEMO_I = 7;
const SAME_DEMO_K = 3;
const SAME_DEMO_S = 2;

export default function Ch07ConvolutionalFiltersPage() {
  const sameDemo = frameworkSamePaddingFormulaLatex(SAME_DEMO_I, SAME_DEMO_K, SAME_DEMO_S);

  return (
    <BishopSectionPage
      sectionPath="/ch07/convolutional-filters"
      heroIcon={<Filter className="w-9 h-9 text-blue-600" />}
      summary={"卷积滤波器通过局部连接与权重共享检测边缘、纹理等模式；填充（padding）与步幅（stride）共同决定输出特征图尺寸。"}
      concepts={[
        {
          title: "特征检测器",
          description: "卷积核作为可学习的局部特征检测器，通过权重共享在整个空间上检测边缘、纹理等模式。",
        },
        {
          title: "平移等变性",
          description: "对输入图像的平移，卷积输出也相应平移；同一滤波器在整个空间上复用。池化、步幅、填充与裁剪会破坏精确等变性。",
        },
        {
          title: "输出尺寸公式",
          description: "给定输入尺寸 I、核尺寸 K、填充 P、步幅 S，输出尺寸由含 padding 的通用公式给出。",
          formula: outputSizeFormulaLatex,
        },
        {
          title: "Valid convolution",
          description: "不填充（P=0），输出尺寸自然缩小；不存在边界外推。",
        },
        {
          title: "Classic SAME",
          description: "数学特例：S=1 且通过适当填充使输出等于输入。常见实现取 P=(K-1)/2（K 为奇数）。",
          formula: classicSameFormulaLatex,
        },
        {
          title: "Framework SAME",
          description: "TensorFlow / PyTorch 约定：输出尺寸固定为 ceil(I/S)，并自动分配左右填充；S>1 时下采样是定义的预期结果。",
          formula: `${frameworkSameFormulaLatex} \\quad \\Longrightarrow \\quad ${sameDemo}`,
        },
        {
          title: "步幅卷积",
          description: "通过步幅 S>1 跳过部分位置，直接在卷积过程中实现空间下采样，减少后续计算量。",
        },
        {
          title: "多维卷积",
          description: "二维卷积在图像的高和宽两个空间维度上滑动；三维卷积还可跨越通道或时间维度扩展。",
        },
        {
          title: "池化",
          description: "最大池化或平均池化在局部窗口内聚合响应，降低特征图分辨率并提供一定的平移不变性。",
        },
        {
          title: "多层卷积",
          description: "堆叠多层卷积可逐层组合低级特征，形成更大感受野、更抽象的层次化表示。",
        },
        {
          title: "网络架构示例",
          description: "经典架构如 LeNet、AlexNet、VGG、ResNet 通过堆叠卷积、池化与残差连接实现深层可训练网络。",
        },
      ]}
      learningObjectives={[
        "理解卷积的平移等变性与权重共享。",
        "能够根据 I、K、P、S 计算输出尺寸。",
        "区分 valid convolution、classic SAME 与 framework SAME 的适用场景。",
      ]}
      coreIntuition={"卷积像是用一把“滑动尺子”在图像上扫描：尺子大小（K）、每次滑动距离（S）、边界补零（P）共同决定最终得到多少格响应。"}
      commonMistakes={[
        "忘记 padding 项 2P，直接用 O = ⌊(I-K)/S⌋+1 导致边界尺寸错误。",
        "把 classic SAME 当成数学必要条件；它只是工程上常用的设计选择。",
        "混淆 framework SAME：S>1 时输出是 ceil(I/S)，下采样是预期结果，不是“不整除才下采样”。",
        "忽略当 K 为偶数时 framework SAME 的左右填充可能不对称。",
      ]}
      whyCards={[
        {
          question: "为什么深层越来越抽象？",
          answer: "每层都把上一层的简单特征拼成更复杂的模式：边缘拼成纹理，纹理拼成部件，部件拼成物体。",
        },
        {
          question: "为什么卷积要共享权重？",
          answer: "同一个边缘检测器在图片任何位置都有用；共享权重既省参数，又让特征不依赖位置。",
        },
      ]}
      counterexamples={[
        "Pooling 后严格平移等变性会被破坏：输入平移一小步，池化输出可能不再精确对应平移。",
        "加大步幅或裁剪边界时，输出对输入的精确平移对应关系也会被破坏。",
      ]}
      quiz={[
        {
          question: `若 I=${SAME_DEMO_I}, K=${SAME_DEMO_K}, S=${SAME_DEMO_S}，framework SAME 的输出尺寸 O 是多少？`,
          options: [
            String(computeSamePadding(SAME_DEMO_I, SAME_DEMO_K, SAME_DEMO_S).outputSize),
            String(computeOutputSize(SAME_DEMO_I, SAME_DEMO_K, 0, SAME_DEMO_S)),
            String(SAME_DEMO_I),
            String(Math.floor(SAME_DEMO_I / SAME_DEMO_S)),
          ],
          correctIndex: 0,
          explanation: `Framework SAME 固定 O=ceil(I/S)=ceil(${SAME_DEMO_I}/${SAME_DEMO_S})=${computeSamePadding(SAME_DEMO_I, SAME_DEMO_K, SAME_DEMO_S).outputSize}，与核尺寸无关。`,
        },
        {
          question: "valid convolution 与 framework SAME 的根本区别是什么？",
          options: [
            "valid 不填充，framework SAME 按 O=ceil(I/S) 自动填充。",
            "valid 用于训练，framework SAME 用于测试。",
            "valid 一定比 framework SAME 计算量更小。",
            "valid 与 framework SAME 只是命名不同，没有实质区别。",
          ],
          correctIndex: 0,
          explanation: "valid 在边界不补零；framework SAME 通过自动 padding 使输出尺寸为 ceil(I/S)，且 S>1 时允许下采样。",
        },
        {
          question: "步幅 S>1 时，framework SAME 是否仍能保证 O=I？",
          options: [
            "不能；framework SAME 的输出是 ceil(I/S)，S>1 时通常下采样。",
            "一定可以，只要 padding 足够大。",
            "一定不行，因为步幅大于 1 必然缩小尺寸。",
            "只有 K 为偶数时才不行。",
          ],
          correctIndex: 0,
          explanation: "framework SAME 的定义就是 O=ceil(I/S)；S>1 时下采样是该约定的预期结果。",
        },
        {
          question: "framework SAME 在哪种情况下会产生左右不对称的填充？",
          options: [
            "当总填充 Ptotal 为奇数时。",
            "当核尺寸 K 为偶数时。",
            "当步幅 S>1 时。",
            "framework SAME 总是对称填充。",
          ],
          correctIndex: 0,
          explanation: "Ptotal 为奇数时按 floor(Ptotal/2) 与 ceil(Ptotal/2) 分配左右；K 为偶数时常导致 Ptotal 为奇数。",
        },
      ]}
      bishopMapping={{
        chapter: "Ch 10",
        section: "10.2",
        pages: "Ch 10",
        textbookSubsections: [
          "10.2 Convolutional Filters",
          "10.2.1 Feature detectors",
          "10.2.2 Translation equivariance",
          "10.2.3 Padding",
          "10.2.4 Strided convolutions",
          "10.2.5 Multi-dimensional convolutions",
          "10.2.6 Pooling",
          "10.2.7 Multilayer convolutions",
          "10.2.8 Example network architectures"
        ],
        formulas: [outputSizeFormulaLatex, frameworkSameFormulaLatex, "classic SAME padding"],
        algorithms: ["二维离散卷积", "最大/平均池化"],
        exercises: ["给定 VGG 某层 I=224, K=3, P=1, S=1，逐层推导尺寸变化。", "对比 valid 与 framework SAME 在边界像素上的差异。"],
      }}
      extraContent={<><FeatureHierarchyLab /><ConvolutionSizeDemo /></>}
    />
  );
}
