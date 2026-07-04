import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Scissors, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

type UpsampleMode = 'nearest' | 'bilinear';

function nearestUpsample(input: number[][], factor: number): number[][] {
  return Array.from({ length: input.length * factor }, (_, i) =>
    Array.from({ length: input[0].length * factor }, (_, j) => {
      return input[Math.floor(i / factor)][Math.floor(j / factor)];
    })
  );
}

function bilinearUpsample(input: number[][], factor: number): number[][] {
  const h = input.length;
  const w = input[0].length;
  const outH = h * factor;
  const outW = w * factor;
  return Array.from({ length: outH }, (_, i) =>
    Array.from({ length: outW }, (_, j) => {
      const y = i / factor;
      const x = j / factor;
      const y0 = Math.floor(y);
      const x0 = Math.floor(x);
      const y1 = Math.min(h - 1, y0 + 1);
      const x1 = Math.min(w - 1, x0 + 1);
      const dy = y - y0;
      const dx = x - x0;
      const v00 = input[y0][x0];
      const v01 = input[y0][x1];
      const v10 = input[y1][x0];
      const v11 = input[y1][x1];
      return v00 * (1 - dx) * (1 - dy) + v01 * dx * (1 - dy) + v10 * (1 - dx) * dy + v11 * dx * dy;
    })
  );
}

export default function Ch07ImageSegmentationPage() {
  const sectionPath = '/ch07/image-segmentation';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [factor, setFactor] = useState(2);
  const [mode, setMode] = useState<UpsampleMode>('nearest');

  const input = useMemo(
    () => [
      [1, 1, 2, 2],
      [1, 8, 8, 2],
      [3, 8, 8, 4],
      [3, 3, 4, 4],
    ],
    []
  );

  const output = useMemo(() => {
    return mode === 'nearest' ? nearestUpsample(input, factor) : bilinearUpsample(input, factor);
  }, [input, factor, mode]);

  if (!section) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Scissors className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          图像分割为每个像素分配语义标签。编码器-解码器结构配合上采样与跳跃连接，能够同时利用高层语义与低层空间细节。
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
            title="语义分割 vs 实例分割"
            description="语义分割只关心像素类别；实例分割进一步区分同类别的不同个体，需要更复杂的表示。"
          />
          <ConceptCard
            title="全卷积网络"
            description="用卷积层替换全连接层，使网络能够接受任意尺寸输入并输出对应尺寸的分割图。"
          />
          <ConceptCard
            title="上采样"
            description="通过插值或转置卷积将低分辨率特征恢复到原图尺寸，是解码器的关键步骤。"
          />
          <ConceptCard
            title="U-Net 结构"
            description="对称的编码器-解码器加跨层跳跃连接，医学图像等小样本场景中表现尤为出色。"
          />
          <ConceptCard
            title="逐像素损失"
            description="对每个像素计算交叉熵，引导网络学习细粒度的类别边界。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <FormulaCard
          title="转置卷积输出尺寸"
          formula={String.raw`O = S(I - 1) + K - 2P`}
          description="S 为步幅，I 为输入尺寸，K 为核尺寸，P 为填充；转置卷积可实现可学习上采样。"
        />
        <FormulaCard
          title="逐像素交叉熵"
          formula={String.raw`\mathcal{L}_{\text{seg}} = -\sum_{i} \sum_{c} Y_{i,c} \log \hat{Y}_{i,c}`}
          description="对图像中每个像素 i 和类别 c 求和，Y 为真实标签，Ŷ 为网络预测概率。"
        />
      </section>

      {/* Interactive demo */}
      <InteractiveDemo title="上采样演示">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">上采样倍数</label>
              <div className="flex gap-2">
                {[2, 3, 4].map((f) => (
                  <Button
                    key={f}
                    variant={factor === f ? 'default' : 'outline'}
                    onClick={() => setFactor(f)}
                  >
                    {f}×
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">插值方式</label>
              <div className="flex gap-2">
                {(['nearest', 'bilinear'] as UpsampleMode[]).map((m) => (
                  <Button
                    key={m}
                    variant={mode === m ? 'default' : 'outline'}
                    onClick={() => setMode(m)}
                  >
                    {m === 'nearest' ? '最近邻' : '双线性'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">低分辨率输入 4×4</p>
              <div className="grid grid-cols-4 gap-1 max-w-[200px] mx-auto">
                {input.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`in-${i}-${j}`}
                      className="aspect-square flex items-center justify-center text-sm rounded-sm"
                      style={{
                        backgroundColor: `rgba(59,130,246,${0.1 + 0.1 * v})`,
                      }}
                    >
                      {v.toFixed(0)}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                {mode === 'nearest' ? '最近邻' : '双线性'}上采样输出 {output.length}×{output[0].length}
              </p>
              <div
                className="grid gap-0.5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${output[0].length}, minmax(0, 1fr))`,
                  maxWidth: `${output[0].length * 36}px`,
                }}
              >
                {output.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`out-${i}-${j}`}
                      className="aspect-square flex items-center justify-center text-[10px] rounded-sm"
                      style={{
                        backgroundColor: `rgba(59,130,246,${0.1 + 0.1 * v})`,
                      }}
                    >
                      {v.toFixed(1)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <KaTeX
              math={
                mode === 'nearest'
                  ? String.raw`\hat{I}(i,j) = I\left(\left\lfloor \frac{i}{${factor}} \right\rfloor, \left\lfloor \frac{j}{${factor}} \right\rfloor\right)`
                  : String.raw`\hat{I}(i,j) = \text{bilinear}\left(I, \frac{i}{${factor}}, \frac{j}{${factor}}\right)`
              }
            />
          </div>

          <p className="text-sm text-gray-600">
            最近邻上采样直接复制像素，速度快但会产生块状伪影；双线性插值更平滑，适合恢复连续变化的分割边界。
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
