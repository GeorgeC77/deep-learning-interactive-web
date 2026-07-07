import BishopSectionPage from '@/components/BishopSectionPage';
import { Search } from 'lucide-react';

export default function Ch07VisualizingTrainedCnnsPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/visualizing-trained-cnns"
      heroIcon={<Search className="w-9 h-9 text-blue-600" />}
      summary={"可视化帮助理解 CNN 学到了什么：从低层滤波器到类激活图、显著性图与对抗样本。"}
      concepts={[
    {
      title: "滤波器可视化",
      description: "第一层滤波器常呈现 Gabor 边缘检测器，与视觉皮层简单细胞类似。",
    },
    {
      title: "显著性图",
      description: "通过反向传播输入梯度，定位对分类决策最重要的图像区域。",
    },
    {
      title: "对抗样本",
      description: "对人眼不可察觉的扰动可导致网络高置信度错误分类。",
    }
      ]}
      learningObjectives={[
      "理解 滤波器可视化 的含义与作用。",
      "理解 显著性图 的含义与作用。",
      "理解 对抗样本 的含义与作用。"
    ]}
      coreIntuition={"可视化帮助理解 CNN 学到了什么：从低层滤波器到类激活图、显著性图与对抗样本。"}
      commonMistakes={[
      "把不同小节的概念混为一谈，忽视它们的假设与适用范围。",
      "只看公式形式而不验证推导条件或数值实例。"
    ]}
      quiz={[
      {
        question: "下列关于“滤波器可视化”的叙述，哪一项最准确？",
        options: ["第一层滤波器常呈现 Gabor 边缘检测器，与视觉皮层简单细胞类似。", "滤波器可视化 只是术语，没有独立建模意义。", "滤波器可视化 不需要任何分布假设即可直接使用。"],
        correctIndex: 0,
        explanation: "正确。第一层滤波器常呈现 Gabor 边缘检测器，与视觉皮层简单细胞类似。 这体现了本节的核心思想。",
      },
      {
        question: "在应用“显著性图”时，下列哪种做法最危险？",
        options: ["忽视其前提假设，直接套用到不适用的数据分布上。", "只要模型足够复杂，数据分布的形状就不重要。", "该方法只适用于连续变量，离散变量完全无法使用。"],
        correctIndex: 0,
        explanation: "正确。显著性图 的有效性依赖于特定假设，忽略前提会导致错误结论。",
      },
      {
        question: "在一个具体情境中，你发现“对抗样本”的结果与直觉相反，首先应该检查什么？",
        options: ["是否违反了该方法成立的前提条件或数据假设。", "直觉一定是错的，直接接受计算结果。", "一定是代码实现出错，与理论无关。"],
        correctIndex: 0,
        explanation: "正确。对抗样本 的可靠性取决于前提假设是否满足；违反假设时结果可能反直觉但合理。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 10",
      section: "10.3",
      pages: "Ch 10",
      textbookSubsections: ["10.3.1 滤波器可视化", "10.3.2 显著性图", "10.3.3 对抗样本"],
      exercises: ["写出本节一个核心公式的具体形式并解释每个符号。", "用一个小例子验证本节概念或数值结论。", "比较本节结论与前面一节结论的适用场景差异。"]
    }}

    />
  );
}
