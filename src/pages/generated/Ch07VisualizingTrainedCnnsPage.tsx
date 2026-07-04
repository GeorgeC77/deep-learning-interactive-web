import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Search, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

type Pattern = 'horizontal' | 'vertical' | 'diagonal';

const patterns: Record<Pattern, number[][]> = {
  horizontal: [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  vertical: [
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
  ],
  diagonal: [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ],
};

const filters: Record<Pattern, number[][]> = {
  horizontal: [
    [1, 1, 1],
    [0, 0, 0],
    [-1, -1, -1],
  ],
  vertical: [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ],
  diagonal: [
    [1, 0, -1],
    [0, 1, 0],
    [-1, 0, 1],
  ],
};

function computeResponse(input: number[][], filter: number[][]): number {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      sum += input[i + 1][j + 1] * filter[i][j];
    }
  }
  return sum;
}

export default function Ch07VisualizingTrainedCnnsPage() {
  const sectionPath = '/ch07/visualizing-trained-cnns';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [pattern, setPattern] = useState<Pattern>('horizontal');
  const [epsilon, setEpsilon] = useState(0.0);

  const input = useMemo(() => patterns[pattern], [pattern]);
  const filter = filters[pattern];
  const baseResponse = useMemo(() => computeResponse(input, filter), [input, filter]);

  // Simulate adversarial degradation: confidence drops as perturbation grows
  const confidence = Math.max(0.05, 1 / (1 + Math.exp(3 * (epsilon - 0.4))));

  if (!section) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Search className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          可视化帮助我们理解 CNN 学到了什么：从低层 Gabor 滤波器到类激活图、显著性图与对抗样本，揭示神经网络的内部表示。
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
            title="滤波器可视化"
            description="第一层卷积核常呈现 Gabor 边缘检测器，与视觉皮层简单细胞类似，说明网络自发学到了低级视觉基元。"
          />
          <ConceptCard
            title="特征图"
            description="每个滤波器在输入上滑动产生一张特征图，亮区域表示该滤波器响应强烈的局部模式。"
          />
          <ConceptCard
            title="显著性图"
            description="通过反向传播计算损失对输入像素的梯度，可定位对分类决策最重要的图像区域。"
          />
          <ConceptCard
            title="对抗样本"
            description="对人眼几乎不可察觉的精心构造扰动，可导致网络以高置信度给出错误预测。"
          />
          <ConceptCard
            title="特征反演"
            description="从高层特征出发优化输入图像，可以可视化哪些输入模式能最大程度激活某个神经元。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <FormulaCard
          title="显著性图"
          formula={String.raw`S(i,j) = \left| \frac{\partial \mathcal{L}}{\partial X(i,j)} \right|`}
          description="梯度绝对值越大，对应像素对模型决策越重要。"
        />
        <FormulaCard
          title="快速梯度符号攻击"
          formula={String.raw`X_{\text{adv}} = X + \varepsilon \cdot \text{sign}\left(\nabla_X \mathcal{L}\right)`}
          description="沿损失梯度方向添加小幅扰动 ε，使模型误判。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="滤波器响应与对抗扰动">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['horizontal', 'vertical', 'diagonal'] as Pattern[]).map((p) => (
              <Button
                key={p}
                variant={pattern === p ? 'default' : 'outline'}
                onClick={() => setPattern(p)}
              >
                {p === 'horizontal' && '水平条纹'}
                {p === 'vertical' && '垂直条纹'}
                {p === 'diagonal' && '对角条纹'}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">输入模式</p>
              <div className="grid grid-cols-5 gap-1 max-w-[160px] mx-auto">
                {input.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`in-${i}-${j}`}
                      className="aspect-square rounded-sm"
                      style={{ backgroundColor: v > 0 ? '#3b82f6' : '#f1f5f9' }}
                    />
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">学习到的滤波器</p>
              <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto">
                {filter.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`f-${i}-${j}`}
                      className="aspect-square flex items-center justify-center text-[10px] rounded-sm"
                      style={{
                        backgroundColor: v > 0 ? 'rgba(59,130,246,0.5)' : v < 0 ? 'rgba(239,68,68,0.5)' : '#f1f5f9',
                      }}
                    >
                      {v}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">滤波器响应</p>
              <p className="text-3xl font-bold text-blue-700">{baseResponse.toFixed(1)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">对抗扰动强度 ε</label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{epsilon.toFixed(2)}</span>
            </div>
            <Slider
              value={[epsilon]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={(v) => setEpsilon(v[0])}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">模型置信度</p>
              <p className="text-2xl font-bold text-red-700">{(confidence * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <KaTeX math={String.raw`\mathcal{L}_{\text{adv}} = \mathcal{L}(X + ${epsilon.toFixed(2)}\cdot\text{sign}(\nabla_X \mathcal{L}))`} />
            </div>
          </div>

          <p className="text-sm text-gray-600">
            当扰动 ε 增大时，滤波器响应与模型置信度迅速下降。这演示了对抗样本如何利用模型的线性响应面。
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
