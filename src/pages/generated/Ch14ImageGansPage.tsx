import { Link } from 'react-router-dom';
import { Image, BookOpen, ChevronLeft, ChevronRight, ShieldAlert, ArrowRightLeft, Palette } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import KaTeX from '@/components/KaTeX';
import { getAllSections, getSectionByPath } from '@/course/manifest';

const SECTION_PATH = '/ch14/image-gans';

export default function Ch14ImageGansPage() {
  const section = getSectionByPath(SECTION_PATH);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === SECTION_PATH);
  const prevSection = allSections[currentIndex - 1] ?? null;
  const nextSection = allSections[currentIndex + 1] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Image className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section?.title ?? '图像 GAN'}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          图像 GAN 将对抗训练应用于视觉生成任务。从全连接架构到深度卷积 GAN，
          再到条件生成与无配对图像转换，GAN 在图像合成、编辑与翻译领域取得了深远影响。
        </p>
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Core concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心架构</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ConceptCard
            icon={<Image className="w-6 h-6 text-blue-600" />}
            title="DCGAN"
            description="使用转置卷积构建生成器、卷积构建判别器，引入批归一化与稳定拓扑，首次实现高质量图像生成。"
          />
          <ConceptCard
            icon={<Palette className="w-6 h-6 text-blue-600" />}
            title="条件 GAN"
            description="向生成器与判别器同时输入类别标签、文本或其他条件，实现对生成内容的显式控制。"
          />
          <ConceptCard
            icon={<ArrowRightLeft className="w-6 h-6 text-blue-600" />}
            title="CycleGAN"
            description="在没有成对训练样本的两个图像域之间学习双向映射，依靠循环一致性保持内容结构。"
          />
        </div>
      </section>

      {/* Image-to-image translation */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">图像到图像翻译</h2>
        <p className="text-gray-700">
          图像到图像翻译旨在学习从一个视觉域 <KaTeX math={String.raw`X`} /> 到另一个视觉域 <KaTeX math={String.raw`Y`} /> 的映射。
          传统方法需要大量成对样本 <KaTeX math={String.raw`(x, y)`} />，而 CycleGAN 通过循环一致性损失突破了这一限制。
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <ConceptCard
            title="成对翻译"
            description="Pix2Pix 等模型在有配对数据时学习条件生成，判别器同时判断图像真实性与翻译正确性。"
          />
          <ConceptCard
            title="无配对翻译"
            description="CycleGAN 假设存在双向映射 G: X→Y 与 F: Y→X，通过 F(G(x))≈x 与 G(F(y))≈y 保持内容一致。"
          />
        </div>
      </section>

      {/* CycleGAN loss */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CycleGAN 损失函数</h2>
        <p className="text-gray-700">
          CycleGAN 的总损失由对抗损失与循环一致性损失组成，有时还会加入恒等映射损失以保护颜色与色调。
        </p>
        <FormulaCard
          title="对抗损失"
          formula={String.raw`\mathcal{L}_{\text{adv}}(G, D_Y, X, Y) = \mathbb{E}_{y\sim p_Y}[\ln D_Y(y)] + \mathbb{E}_{x\sim p_X}[\ln(1 - D_Y(G(x)))]`}
          description="鼓励生成器 G 的输出在域 Y 中看起来真实。"
        />
        <FormulaCard
          title="循环一致性损失"
          formula={String.raw`\mathcal{L}_{\text{cyc}}(G, F) = \mathbb{E}_{x\sim p_X}[\|F(G(x)) - x\|_1] + \mathbb{E}_{y\sim p_Y}[\|G(F(y)) - y\|_1]`}
          description="保证两次映射后能够回到原始输入，避免模式崩溃到单一输出。"
        />
        <FormulaCard
          title="总优化目标"
          formula={String.raw`\mathcal{L}(G, F, D_X, D_Y) = \mathcal{L}_{\text{adv}}(G, D_Y) + \mathcal{L}_{\text{adv}}(F, D_X) + \lambda \, \mathcal{L}_{\text{cyc}}(G, F)`}
          description="λ 控制循环一致性与对抗逼真度之间的权衡。"
        />
      </section>

      {/* Applications */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">典型应用</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ConceptCard title="风格迁移" description="将照片转换为梵高、莫奈等艺术风格。" />
          <ConceptCard title="语义分割→图像" description="从标签图合成真实街景或室内场景。" />
          <ConceptCard title="季节转换" description="同一场景在夏冬、晴雨之间的相互转换。" />
          <ConceptCard title="素描→照片" description="将线条草图渲染为逼真的物体或人脸图像。" />
        </div>
      </section>

      {/* Navigation */}
      <section className="flex flex-wrap justify-between gap-4">
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
      </section>
    </div>
  );
}
