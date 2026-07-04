import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, ShieldAlert, Target } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function computeOverlap(a: Rect, b: Rect): { iou: number; inter: number; union: number } {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const interW = Math.max(0, x2 - x1);
  const interH = Math.max(0, y2 - y1);
  const inter = interW * interH;
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? { iou: inter / union, inter, union } : { iou: 0, inter: 0, union: 0 };
}

export default function Ch07ObjectDetectionPage() {
  const sectionPath = '/ch07/object-detection';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [offset, setOffset] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [showGt, setShowGt] = useState(true);

  const gt: Rect = useMemo(() => ({ x: 80, y: 70, w: 120, h: 100 }), []);
  const pred: Rect = useMemo(
    () => ({ x: 80 + offset, y: 70 + offset * 0.5, w: 120 * scale, h: 100 * scale }),
    [offset, scale]
  );
  const { iou, inter, union } = useMemo(() => computeOverlap(gt, pred), [gt, pred]);

  if (!section) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Target className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          目标检测需要同时预测物体的类别与位置。边界框、交并比（IoU）、滑动窗口、锚框与非极大抑制是构建检测系统的关键组件。
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
            title="边界框"
            description="通常用 (x, y, w, h) 或左上角/右下角坐标表示物体位置，是检测任务的基本输出。"
          />
          <ConceptCard
            title="交并比 IoU"
            description="两个框的交集面积除以并集面积，是衡量定位精度与匹配预测框的核心指标。"
          />
          <ConceptCard
            title="锚框与滑动窗口"
            description="在图像上密集放置不同尺度与长宽比的候选框，网络只需预测相对偏移与类别。"
          />
          <ConceptCard
            title="多尺度检测"
            description="在不同分辨率的特征图上并行预测，高层语义强、底层定位精，兼顾大目标与小目标。"
          />
          <ConceptCard
            title="非极大抑制"
            description="去除与高分框高度重叠的低分预测，只保留最具代表性的检测结果。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <FormulaCard
          title="交并比"
          formula={String.raw`\text{IoU}(A,B) = \frac{|A \cap B|}{|A \cup B|}`}
          description="取值范围为 [0, 1]，通常以 0.5 作为正负样本匹配阈值。"
        />
        <FormulaCard
          title="边界框回归"
          formula={String.raw`\mathcal{L}_{\text{loc}} = \sum_{i \in \{x,y,w,h\}} \left(t_i - \hat{t}_i\right)^2}`}
          description="预测框相对锚框的偏移量， Smooth L1 或 L2 损失常用于回归分支。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="IoU 交互演示">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">预测框中心偏移</label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{offset.toFixed(0)} px</span>
              </div>
              <Slider
                value={[offset]}
                min={-60}
                max={80}
                step={1}
                onValueChange={(v) => setOffset(v[0])}
              />

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">预测框缩放</label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{scale.toFixed(2)}</span>
              </div>
              <Slider
                value={[scale]}
                min={0.5}
                max={1.5}
                step={0.05}
                onValueChange={(v) => setScale(v[0])}
              />

              <Button variant={showGt ? 'default' : 'outline'} onClick={() => setShowGt((s) => !s)}>
                {showGt ? '隐藏真实框' : '显示真实框'}
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <svg viewBox="0 0 320 240" className="w-full h-auto">
                {/* Background grid */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 40}
                    y1={0}
                    x2={i * 40}
                    y2={240}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={i * 40}
                    x2={320}
                    y2={i * 40}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                ))}

                {/* Ground truth */}
                {showGt && (
                  <rect
                    x={gt.x}
                    y={gt.y}
                    width={gt.w}
                    height={gt.h}
                    fill="rgba(34,197,94,0.15)"
                    stroke="#16a34a"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                )}

                {/* Prediction */}
                <rect
                  x={pred.x}
                  y={pred.y}
                  width={pred.w}
                  height={pred.h}
                  fill="rgba(59,130,246,0.2)"
                  stroke="#2563eb"
                  strokeWidth={2}
                />

                {/* Labels */}
                {showGt && (
                  <text x={gt.x} y={gt.y - 6} fill="#16a34a" fontSize={12} fontWeight={600}>
                    真实框
                  </text>
                )}
                <text x={pred.x} y={pred.y - 6} fill="#2563eb" fontSize={12} fontWeight={600}>
                  预测框
                </text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">当前 IoU</p>
              <p className="text-3xl font-bold text-blue-700">{iou.toFixed(3)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX
                math={String.raw`\text{IoU} = \frac{${inter.toFixed(0)}}{${union.toFixed(0)}} \approx ${iou.toFixed(3)}`}
              />
            </div>
          </div>

          <p className="text-sm text-gray-600">
            调整预测框的位置与大小，观察 IoU 变化。当 IoU 高于阈值（如 0.5）时，预测被视为正确匹配。
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
