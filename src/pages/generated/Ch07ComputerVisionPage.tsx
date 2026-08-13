import BishopSectionPage from '@/components/BishopSectionPage';
import VisionTaskLab from '@/components/demos/VisionTaskLab';
import DerivationStepper from '@/components/DerivationStepper';
import ExercisePanel from '@/components/ExercisePanel';
import { chapter07ComputerVisionExercises } from '@/course/chapter07Exercises';
import { Eye } from 'lucide-react';

export default function Ch07ComputerVisionPage() {
  return (
    <BishopSectionPage
      sectionPath="/ch07/computer-vision"
      heroIcon={<Eye className="w-9 h-9 text-blue-600" />}
      summary={"Bishop §10.1 将图像表示为具有通道的规则像素网格，并区分分类、检测、分割、生成、修复、超分辨率与深度预测等任务。CNN 的优势来自让结构偏置匹配图像，而不是假设所有增强都天然保持标签。"}
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
          description: "随机裁剪、翻转、色彩抖动只有在保持目标语义时才是有效归纳偏置；医学左右侧或文字方向等任务需要单独审查。",
        }
      ]}
      learningObjectives={[
        "理解图像数据的局部相关性与层次结构。",
        "区分分类、检测、分割等视觉任务的输出粒度。",
        "认识数据增强对视觉模型泛化的作用。",
      ]}
      coreIntuition={"先问输出需要多细的空间坐标：分类把整图聚合成类别，检测输出对象集合和位置，分割为每个像素预测。需要保留的空间粒度决定网络头能否使用全局聚合。"}
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
        pages: "§10.1, pp. 288–290",
        textbookSubsections: [
          "10.1 Computer Vision",
          "10.1.1 Image data"
        ],
        exercises: ["说明图像的局部相关性与层次结构如何启发 CNN 设计。", "举例说明数据增强在不同视觉任务中的适用性。"]
      }}
      interactiveDemo={<VisionTaskLab />}
      extraContent={<div className="space-y-10"><DerivationStepper title="分步推导：为什么全连接首层参数会爆炸" steps={[
        { label: '图像张量', formula: String.raw`N_{\mathrm{in}}=HWC`, explanation: 'RGB 图像的每个像素有三个通道，展平后输入维数随面积增长。' },
        { label: '全连接层', formula: String.raw`N_{\mathrm{dense}}=(HWC+1)D`, explanation: 'D 个隐藏单元各自连接全部像素，并各有一个偏置。' },
        { label: '局部共享', formula: String.raw`N_{\mathrm{conv}}=(K^2C+1)D`, explanation: '卷积只学习 K×K 局部核，并在所有空间位置共享。' },
        { label: '教材例子', formula: String.raw`H=W=10^3,\ C=3,\ D=10^3\Rightarrow 3\times10^9\ \mathrm{weights}`, explanation: '百万像素图接千个隐藏单元，仅首层就有约三十亿权重；结构偏置显著降低数据和存储需求。' },
      ]} /><ExercisePanel exerciseSetId="chapter07-computer-vision" exercises={chapter07ComputerVisionExercises} /></div>}
    />
  );
}
