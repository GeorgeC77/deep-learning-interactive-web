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
        "理解图像数据的局部相关性与层次结构。",
        "区分分类、检测、分割等视觉任务的输出粒度。",
        "认识数据增强对视觉模型泛化的作用。",
      ]}
      coreIntuition={"计算机视觉任务涵盖分类、检测、分割与图像生成；CNN 利用图像的局部相关性与层次结构取得突破性进展。"}
      commonMistakes={[
        "认为图像只是像素集合，忽视局部相关性与层次结构。",
        "对所有视觉任务使用相同的网络结构，忽视输出粒度差异。",
        "忽视数据增强对视觉模型泛化的关键作用。",
      ]}
      whyCards={[
        {
          question: "为什么 CNN 适合图像任务？",
          answer: "图像具有局部相关性和平移不变性。CNN 的局部连接和权重共享正好匹配这些先验，比全连接更高效。",
        },
        {
          question: "为什么数据增强对视觉模型特别重要？",
          answer: "图像的语义对裁剪、翻转、色彩变化不敏感。数据增强利用这些不变性，让模型看到更多“合理变化”的样本。",
        },
      ]}
      counterexamples={[
        "用全连接网络直接处理 224×224 图像，参数量爆炸且无法利用局部相关性——说明结构先验必须与数据匹配。",
        "在医学图像任务中使用随机翻转数据增强，可能破坏病灶的左右语义——说明数据增强需要符合任务约束。",
      ]}
      bishopMapping={{
        chapter: "Ch 10",
        section: "10.1",
        pages: "Ch 10",
        textbookSubsections: [
          "10.1 Computer Vision",
          "10.1.1 Image data"
        ],
        exercises: ["说明图像的局部相关性与层次结构如何启发 CNN 设计。", "举例说明数据增强在不同视觉任务中的适用性。"]
      }}
      demo={{
        title: "图像局部相关性演示",
        label: "卷积核大小 K",
        param: 3,
        min: 1,
        max: 7,
        step: 2,
        compute: (K) => {
          const connections = K * K;
          return {
            label: '局部连接数',
            value: connections,
            display: String.raw`K \times K = ${K} \times ${K} = ${connections}`,
          };
        },
        formula: String.raw`\text{局部连接数} = K \times K`,
      }}
    />
  );
}
