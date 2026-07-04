import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Palette, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath } from '@/course/manifest';

function makeFeatureMap(size: number, seed: number): number[][] {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => {
      const x = (i + seed * 3) % size;
      const y = (j + seed * 5) % size;
      return Math.sin((x * x + y * y + seed) * 0.8) * 0.5 + 0.5;
    })
  );
}

function blendMaps(a: number[][], b: number[][], alpha: number): number[][] {
  return a.map((row, i) => row.map((v, j) => (1 - alpha) * v + alpha * b[i][j]));
}

function computeGramStyleLoss(content: number[][], style: number[][]): number {
  let loss = 0;
  for (let i = 0; i < content.length; i++) {
    for (let j = 0; j < content[0].length; j++) {
      loss += Math.abs(content[i][j] - style[i][j]);
    }
  }
  return loss / (content.length * content[0].length);
}

export default function Ch07StyleTransferPage() {
  const sectionPath = '/ch07/style-transfer';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [alpha, setAlpha] = useState(0.5);
  const [beta, setBeta] = useState(0.5);

  const contentMap = useMemo(() => makeFeatureMap(8, 1), []);
  const styleMap = useMemo(() => makeFeatureMap(8, 7), []);
  const blended = useMemo(() => blendMaps(contentMap, styleMap, alpha), [contentMap, styleMap, alpha]);
  const styleLoss = useMemo(() => computeGramStyleLoss(contentMap, styleMap), [contentMap, styleMap]);
  const totalLoss = alpha * (1 - alpha) + beta * styleLoss;

  if (!section) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Palette className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          神经风格迁移将内容图像的结构与风格图像的纹理分离并重组。通过优化合成图像，使其同时匹配内容特征与风格 Gram 矩阵。
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
            title="内容表示"
            description="使用 CNN 高层特征图捕捉图像的语义结构，例如物体形状与空间布局，忽略具体像素值。"
          />
          <ConceptCard
            title="风格表示"
            description="用 Gram 矩阵统计特征图通道间的相关性，捕捉纹理、色彩和笔触等风格信息。"
          />
          <ConceptCard
            title="优化目标"
            description="合成图像同时最小化与内容图像的特征距离和与风格图像的 Gram 距离，二者由权重 α、β 平衡。"
          />
          <ConceptCard
            title="特征重组"
            description="风格迁移可视为在保持内容结构的同时，用风格图像的统计特性重新渲染纹理。"
          />
          <ConceptCard
            title="快速风格迁移"
            description="训练一个前馈网络直接生成风格化图像，实现实时迁移，牺牲了部分风格灵活性。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <FormulaCard
          title="Gram 矩阵"
          formula={String.raw`G_{ij} = \sum_{k} F_{ik} F_{jk}`}
          description="F 为特征图，G_ij 表示第 i 与第 j 通道特征的相关性，用于编码纹理风格。"
        />
        <FormulaCard
          title="风格迁移总损失"
          formula={String.raw`\mathcal{L}_{\text{total}} = \alpha \mathcal{L}_{\text{content}} + \beta \mathcal{L}_{\text{style}}`}
          description="α 与 β 分别控制内容保留程度与风格迁移强度，调节二者可获得不同视觉效果。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="内容/风格权重调节">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">内容权重 α</label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{alpha.toFixed(2)}</span>
              </div>
              <Slider
                value={[alpha]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => setAlpha(v[0])}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">风格权重 β</label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{beta.toFixed(2)}</span>
              </div>
              <Slider
                value={[beta]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => setBeta(v[0])}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">内容特征</p>
              <div className="grid grid-cols-8 gap-0.5">
                {contentMap.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`c-${i}-${j}`}
                      className="aspect-square rounded-sm"
                      style={{ backgroundColor: `rgba(59,130,246,${0.2 + 0.8 * v})` }}
                    />
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">风格特征</p>
              <div className="grid grid-cols-8 gap-0.5">
                {styleMap.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`s-${i}-${j}`}
                      className="aspect-square rounded-sm"
                      style={{ backgroundColor: `rgba(168,85,247,${0.2 + 0.8 * v})` }}
                    />
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">合成结果</p>
              <div className="grid grid-cols-8 gap-0.5">
                {blended.map((row, i) =>
                  row.map((v, j) => {
                    const r = Math.round((1 - alpha) * 59 + alpha * 168);
                    const g = Math.round((1 - alpha) * 130 + alpha * 85);
                    const b = Math.round((1 - alpha) * 246 + alpha * 247);
                    return (
                      <div
                        key={`b-${i}-${j}`}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor: `rgba(${r},${g},${b},${0.2 + 0.8 * v})`,
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">总损失估计</p>
              <p className="text-2xl font-bold text-blue-700">{totalLoss.toFixed(3)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`\mathcal{L}_{\text{total}} = ${alpha.toFixed(2)}\mathcal{L}_{\text{content}} + ${beta.toFixed(2)}\mathcal{L}_{\text{style}}`} />
            </div>
          </div>

          <p className="text-sm text-gray-600">
            增大 α 更忠实于内容结构，增大 β 更强调风格纹理。实际优化中通常需要数百次迭代才能生成高质量图像。
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
