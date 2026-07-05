import BishopSectionPage from '@/components/BishopSectionPage';
import { Eye } from 'lucide-react';

export default function Ch07ComputerVisionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/computer-vision"
      heroIcon={<Eye className="w-9 h-9 text-blue-600" />}
      summary={"计算机视觉任务涵盖分类、检测、分割与图像生成；CNN 利用图像的局部相关性与层次结构取得突破性进展。"}
      concepts={[
    {
      title: "图像表示",
      description: "图像由像素网格构成，局部区域往往具有强相关性。",
    },
    {
      title: "任务层次",
      description: "从全局标签（分类）到像素标签（分割），任务对空间精度的要求递增。",
    },
    {
      title: "数据增强",
      description: "随机裁剪、翻转、色彩抖动等增强可显著提升视觉模型泛化能力。",
    }
      ]}
      learningObjectives={[
      "理解 图像表示 的含义与作用。",
      "理解 任务层次 的含义与作用。",
      "理解 数据增强 的含义与作用。"
    ]}
      coreIntuition={"计算机视觉任务涵盖分类、检测、分割与图像生成；CNN 利用图像的局部相关性与层次结构取得突破性进展。"}
      commonMistakes={[
      "混淆相关概念的定义与适用场景。",
      "只记忆公式而忽略其背后的概率或优化假设。"
    ]}
      quiz={[
      {
        question: "关于“图像表示”，下列说法是否正确？",
        options: ["图像由像素网格构成，局部区域往往具有强相关性。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。图像由像素网格构成，局部区域往往具有强相关性。",
      },
      {
        question: "关于“任务层次”，下列说法是否正确？",
        options: ["从全局标签（分类）到像素标签（分割），任务对空间精度的要求递增。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。从全局标签（分类）到像素标签（分割），任务对空间精度的要求递增。",
      },
      {
        question: "关于“数据增强”，下列说法是否正确？",
        options: ["随机裁剪、翻转、色彩抖动等增强可显著提升视觉模型泛化能力。", "该概念与当前章节无关。", "该概念只适用于无限数据。"],
        correctIndex: 0,
        explanation: "正确。随机裁剪、翻转、色彩抖动等增强可显著提升视觉模型泛化能力。",
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
