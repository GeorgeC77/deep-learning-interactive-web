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
      "将本节结论直接套用到前提条件不同的场景，忽略假设差异。",
      "只关注公式写法，却不检验推导前提或代入具体数值验证。"
    ]}
            bishopMapping={{
      chapter: "Ch 10",
      section: "10.1",
      pages: "Ch 10",
      textbookSubsections: [
          "10.1 Computer Vision",
          "10.1.1 Image data"
        ],
      exercises: ["展开本节一个核心公式并说明每个符号的数学含义。", "用一个简单数值实例检验本节结论。", "对照前文结论，分析本节结论的适用边界与差异。"]
    }}

    />
  );
}
