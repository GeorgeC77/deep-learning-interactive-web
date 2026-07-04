import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Layers, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

export default function Ch07OverviewPage() {
  const sectionPath = '/ch07/overview';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [depth, setDepth] = useState(3);
  const receptiveField = 1 + 2 * depth;

  if (!section) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Layers className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          卷积神经网络（CNN）通过局部连接、权重共享与层次化特征提取，将网格数据（如图像）转化为高效、平移等变的表示，成为现代计算机视觉的基石。
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
            title="卷积操作"
            description="用滑动滤波器在输入上计算局部加权和，检测边缘、纹理等低层模式。相比全连接层，卷积只关注局部邻域，参数量大幅减少。"
          />
          <ConceptCard
            title="平移等变性"
            description="输入图像平移时，特征图会相应平移，响应值保持不变。这一归纳偏置使 CNN 对物体位置变化具有天然鲁棒性。"
          />
          <ConceptCard
            title="权重共享"
            description="同一个卷积核在整张图上滑动使用，显著降低参数量并促使网络学习位置无关的通用特征检测器。"
          />
          <ConceptCard
            title="池化与下采样"
            description="最大池化或平均池化降低特征图分辨率，扩大后续层的感受野，并提供对微小平移的不变性。"
          />
          <ConceptCard
            title="层次化表示"
            description="浅层学习边缘和纹理，深层组合成部件与物体。网络越深，语义越丰富、抽象程度越高。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <FormulaCard
          title="3×3 卷积核的感受野"
          formula={String.raw`R = 1 + 2L`}
          description="堆叠 L 层 3×3 卷积后，每个输出单元能看到的输入区域边长 R 随层数线性增长。"
        />
        <FormulaCard
          title="卷积层参数量"
          formula={String.raw`P = K_h \cdot K_w \cdot C_{\text{in}} \cdot C_{\text{out}} + C_{\text{out}}`}
          description="其中 Kh、Kw 为核尺寸，C_in 与 C_out 为输入/输出通道数，最后一项为偏置。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="感受野随网络深度增长">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">网络层数 L</label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{depth}</span>
            </div>
            <Slider
              value={[depth]}
              min={1}
              max={10}
              step={1}
              onValueChange={(v) => setDepth(v[0])}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">感受野边长 R</div>
              <div className="text-3xl font-bold text-blue-700">{receptiveField}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`R = 1 + 2 \cdot ${depth} = ${receptiveField}`} />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            仅使用 3×3 小卷积核堆叠，即可在不增加单核参数的前提下获得大感受野，这是 VGG、ResNet 等网络的核心设计思想。
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
