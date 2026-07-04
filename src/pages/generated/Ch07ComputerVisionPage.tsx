import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Eye, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

type TaskMode = 'classification' | 'detection' | 'segmentation';

export default function Ch07ComputerVisionPage() {
  const sectionPath = '/ch07/computer-vision';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [mode, setMode] = useState<TaskMode>('classification');

  if (!section) return null;

  const modeLabels: Record<TaskMode, string> = {
    classification: '图像分类：输出整张图像的类别标签',
    detection: '目标检测：预测边界框与类别',
    segmentation: '图像分割：为每个像素分配语义标签',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Eye className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          计算机视觉研究如何让机器从图像或视频中提取语义信息。CNN 利用图像的局部相关性与层次结构，在分类、检测、分割等任务上取得突破性进展。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="图像作为像素网格"
            description="数字图像是规则的二维像素阵列，每个像素记录亮度或颜色信息。网格结构是 CNN 设计的自然先验。"
          />
          <ConceptCard
            title="局部相关性"
            description="相邻像素在语义上高度相关，远处像素则相对独立。局部连接能有效捕捉这种统计结构。"
          />
          <ConceptCard
            title="任务层次"
            description="从整图标签（分类）到矩形框（检测）再到逐像素标签（分割），任务对空间定位精度的要求递增。"
          />
          <ConceptCard
            title="数据增强"
            description="随机裁剪、翻转、缩放、色彩抖动可在不增加采集成本的前提下扩充训练数据，提高泛化能力。"
          />
          <ConceptCard
            title="迁移学习"
            description="在大型数据集（如 ImageNet）上预训练的 CNN 特征可迁移到下游任务，显著降低标注需求。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <FormulaCard
          title="彩色图像的张量表示"
          formula={String.raw`\mathbf{X} \in \mathbb{R}^{H \times W \times C}`}
          description="H 为高，W 为宽，C 为通道数；RGB 图像通常 C=3。"
        />
        <FormulaCard
          title="图像分辨率"
          formula={String.raw`\text{像素总数} = H \cdot W \cdot C`}
          description="高分辨率图像带来丰富细节，但也意味着更高的计算与内存开销。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="视觉任务层级演示">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['classification', 'detection', 'segmentation'] as TaskMode[]).map((m) => (
              <Button
                key={m}
                variant={mode === m ? 'default' : 'outline'}
                onClick={() => setMode(m)}
              >
                {m === 'classification' && '图像分类'}
                {m === 'detection' && '目标检测'}
                {m === 'segmentation' && '图像分割'}
              </Button>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-700">{modeLabels[mode]}</p>
          <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border border-gray-200">
            {/* Abstract scene */}
            <div className="absolute left-1/4 top-1/3 w-24 h-24 bg-orange-300 rounded-full opacity-80" />
            <div className="absolute left-1/2 top-1/2 w-32 h-20 bg-blue-400 rounded-lg opacity-80" />
            <div className="absolute right-1/4 bottom-1/4 w-20 h-28 bg-green-400 rounded-full opacity-80" />

            {mode === 'classification' && (
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <div className="bg-white/90 px-4 py-2 rounded-lg shadow text-lg font-semibold text-gray-800">
                  预测：风景 / 置信度 0.94
                </div>
              </div>
            )}

            {mode === 'detection' && (
              <>
                <div className="absolute left-[calc(25%-12px)] top-[calc(33%-12px)] w-28 h-28 border-2 border-red-500 rounded-full bg-red-500/10" />
                <div className="absolute left-[calc(50%-16px)] top-[calc(50%-16px)] w-36 h-24 border-2 border-blue-500 rounded-lg bg-blue-500/10" />
                <div className="absolute right-[calc(25%-16px)] bottom-[calc(25%-16px)] w-24 h-32 border-2 border-green-500 rounded-full bg-green-500/10" />
                <div className="absolute top-2 left-2 space-y-1">
                  <span className="block text-xs bg-red-500 text-white px-2 py-0.5 rounded">太阳 0.91</span>
                  <span className="block text-xs bg-blue-500 text-white px-2 py-0.5 rounded">房屋 0.88</span>
                  <span className="block text-xs bg-green-500 text-white px-2 py-0.5 rounded">树木 0.85</span>
                </div>
              </>
            )}

            {mode === 'segmentation' && (
              <>
                <div className="absolute left-1/4 top-1/3 w-24 h-24 bg-orange-500/40 rounded-full" />
                <div className="absolute left-1/2 top-1/2 w-32 h-20 bg-blue-600/40 rounded-lg" />
                <div className="absolute right-1/4 bottom-1/4 w-20 h-28 bg-green-600/40 rounded-full" />
                <div className="absolute top-2 right-2 space-y-1 text-right">
                  <span className="block text-xs bg-orange-500 text-white px-2 py-0.5 rounded">天空</span>
                  <span className="block text-xs bg-blue-600 text-white px-2 py-0.5 rounded">建筑</span>
                  <span className="block text-xs bg-green-600 text-white px-2 py-0.5 rounded">植被</span>
                </div>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            同一幅图像在不同任务中需要不同粒度的输出。分类关注全局语义，检测需要定位，分割则要求像素级精度。
          </p>
        </div>
      </InteractiveDemo>

      {/* Navigation */}
      <nav className="flex flex-wrap justify-between gap-4">
        {prevSection ? (
          <Link
            to={prevSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevSection.title}
          </Link>
        ) : (
          <div />
        )}
        {nextSection && (
          <Link
            to={nextSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {nextSection.title}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
