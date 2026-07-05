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
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“滤波器可视化”，下列说法是否正确？",
        options: ["第一层滤波器常呈现 Gabor 边缘检测器，与视觉皮层简单细胞类似。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。第一层滤波器常呈现 Gabor 边缘检测器，与视觉皮层简单细胞类似。",
      },
      {
        question: "关于“显著性图”，下列说法是否正确？",
        options: ["通过反向传播输入梯度，定位对分类决策最重要的图像区域。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。通过反向传播输入梯度，定位对分类决策最重要的图像区域。",
      },
      {
        question: "关于“对抗样本”，下列说法是否正确？",
        options: ["对人眼不可察觉的扰动可导致网络高置信度错误分类。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。对人眼不可察觉的扰动可导致网络高置信度错误分类。",
      }
    ]}
      bishopMapping={{
      chapter: "Ch 10",
      section: "",
      pages: "",
    }}

    />
  );
}
