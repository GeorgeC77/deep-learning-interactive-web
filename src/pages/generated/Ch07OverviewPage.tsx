import BishopSectionPage from '@/components/BishopSectionPage';
import { Layers } from 'lucide-react';

export default function Ch07OverviewPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/overview"
      heroIcon={<Layers className="w-9 h-9 text-blue-600" />}
      summary={"卷积神经网络通过局部连接、权重共享与层次化特征提取，成为图像等网格数据的主流模型。"}
      concepts={[
    {
      title: "卷积操作",
      description: "用滑动滤波器在输入上计算局部响应，捕获边缘、纹理等低层特征。",
    },
    {
      title: "平移等变性",
      description: "输入平移导致特征图相应平移，保持空间关系不变。",
    },
    {
      title: "池化与层次化",
      description: "下采样增大感受野并降低计算量，深层网络组合得到语义更强的特征。",
    }
      ]}
      learningObjectives={[
      "理解 卷积操作 的含义与作用。",
      "理解 平移等变性 的含义与作用。",
      "理解 池化与层次化 的含义与作用。"
    ]}
      coreIntuition={"卷积神经网络通过局部连接、权重共享与层次化特征提取，成为图像等网格数据的主流模型。"}
      commonMistakes={[
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 10",
      pages: "Ch 10",
      textbookSubsections: [],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}
          demo={{
      title: "卷积感受野随层数增长",
      label: "网络层数 L",
      param: 3,
      min: 1,
      max: 10,
      step: 1,
      compute: (L) => ({
        label: '3×3 核感受野边长',
        value: 1 + 2 * L,
        display: String.raw`R=1+2\cdot${L.toFixed(0)}=${(1 + 2 * L).toFixed(0)}`,
      }),
      formula: String.raw`R = 1 + 2L`,
    }}
    />
  );
}
