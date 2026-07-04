import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Filter, ShieldAlert } from 'lucide-react';
import ConceptCard from '@/components/ConceptCard';
import FormulaCard from '@/components/FormulaCard';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getAllSections, getSectionByPath } from '@/course/manifest';

type KernelKey = 'identity' | 'vertical' | 'horizontal' | 'blur' | 'sharpen';

const kernelMap: Record<KernelKey, number[][]> = {
  identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  vertical: [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ],
  horizontal: [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ],
  blur: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
};

const kernelLabels: Record<KernelKey, string> = {
  identity: '恒等',
  vertical: '垂直边缘',
  horizontal: '水平边缘',
  blur: '均值模糊',
  sharpen: '锐化',
};

function makeInput7x7(): number[][] {
  return Array.from({ length: 7 }, (_, i) =>
    Array.from({ length: 7 }, (_, j) => {
      // Cross/plus pattern
      if (i === 3 || j === 3) return 8;
      return 1;
    })
  );
}

function makeInput8x8(): number[][] {
  return Array.from({ length: 8 }, (_, i) =>
    Array.from({ length: 8 }, (_, j) => {
      if ((i + j) % 4 === 0) return 9;
      if ((i + j) % 4 === 1) return 5;
      return 2;
    })
  );
}

function clampColor(v: number): string {
  const t = Math.max(-1, Math.min(1, v / 8));
  if (t >= 0) return `rgba(59, 130, 246, ${0.1 + 0.85 * t})`;
  return `rgba(239, 68, 68, ${0.1 + 0.85 * -t})`;
}

export default function Ch07ConvolutionalFiltersPage() {
  const sectionPath = '/ch07/convolutional-filters';
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];

  const [kernelKey, setKernelKey] = useState<KernelKey>('vertical');
  const [highlight, setHighlight] = useState(12); // 0..24 maps to output 5x5
  const [poolSize, setPoolSize] = useState(2);
  const [stride, setStride] = useState(2);
  const [padding, setPadding] = useState(0);

  const input7 = useMemo(() => makeInput7x7(), []);
  const input8 = useMemo(() => makeInput8x8(), []);
  const kernel = kernelMap[kernelKey];

  const output5 = useMemo(() => {
    const out: number[][] = [];
    for (let i = 0; i < 5; i++) {
      const row: number[] = [];
      for (let j = 0; j < 5; j++) {
        let sum = 0;
        for (let m = 0; m < 3; m++) {
          for (let n = 0; n < 3; n++) {
            sum += input7[i + m][j + n] * kernel[m][n];
          }
        }
        row.push(sum);
      }
      out.push(row);
    }
    return out;
  }, [input7, kernel]);

  const padded8 = useMemo(() => {
    const size = 8 + 2 * padding;
    const arr: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        arr[i + padding][j + padding] = input8[i][j];
      }
    }
    return arr;
  }, [input8, padding]);

  const poolOutput = useMemo(() => {
    const size = Math.floor((8 + 2 * padding - poolSize) / stride) + 1;
    const out: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        let maxVal = -Infinity;
        for (let m = 0; m < poolSize; m++) {
          for (let n = 0; n < poolSize; n++) {
            const val = padded8[i * stride + m][j * stride + n];
            if (val > maxVal) maxVal = val;
          }
        }
        row.push(maxVal);
      }
      out.push(row);
    }
    return out;
  }, [padded8, poolSize, stride, padding]);

  const outputSize = poolOutput.length;
  const hi = Math.floor(highlight / 5);
  const hj = highlight % 5;

  if (!section) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Filter className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          卷积滤波器是 CNN 的特征检测器。通过选择不同的核、填充与步幅，可以控制特征图尺寸；池化则降低分辨率并引入平移不变性。
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
            title="离散卷积"
            description="在二维图像上，卷积核滑动到每个位置，与对应局部窗口做点积，生成一个响应值。"
          />
          <ConceptCard
            title="核作为特征检测器"
            description="不同核响应不同模式：边缘核突出灰度变化，模糊核平滑细节，锐化核增强对比度。"
          />
          <ConceptCard
            title="填充与步幅"
            description="填充（padding）可保持边界信息，步幅（stride）决定滑动间隔，从而控制输出尺寸。"
          />
          <ConceptCard
            title="池化"
            description="最大池化取局部窗口最大值，平均池化取均值，二者均降低分辨率并提供局部不变性。"
          />
          <ConceptCard
            title="多通道卷积"
            description="彩色图像有多个通道，卷积核也对应多通道；多个输出通道可检测多种特征。"
          />
        </div>
      </section>

      {/* Formulas */}
      <section className="space-y-4">
        <FormulaCard
          title="二维离散卷积"
          formula={String.raw`(I * K)(i,j) = \sum_{m}\sum_{n} I(i+m, j+n) \, K(m,n)`}
          description="I 为输入，K 为卷积核；求和遍历核的所有空间位置。"
        />
        <FormulaCard
          title="输出尺寸公式"
          formula={String.raw`O = \left\lfloor \frac{I + 2P - K}{S} \right\rfloor + 1`}
          description="I 为输入尺寸，P 为单边填充，K 为核尺寸，S 为步幅。"
        />
      </section>

      {/* Demo 1: convolution */}
      <InteractiveDemo title="交互式 2D 卷积">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(kernelMap) as KernelKey[]).map((k) => (
              <Button
                key={k}
                variant={kernelKey === k ? 'default' : 'outline'}
                onClick={() => setKernelKey(k)}
              >
                {kernelLabels[k]}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">输入 7×7</p>
              <div className="grid grid-cols-7 gap-0.5">
                {input7.map((row, i) =>
                  row.map((v, j) => {
                    const inHighlight = i >= hi && i < hi + 3 && j >= hj && j < hj + 3;
                    return (
                      <div
                        key={`in-${i}-${j}`}
                        className={`aspect-square flex items-center justify-center text-[10px] rounded-sm ${
                          inHighlight ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{ backgroundColor: clampColor(v) }}
                      >
                        {v}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                核 3×3（{kernelLabels[kernelKey]}）
              </p>
              <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto">
                {kernel.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`k-${i}-${j}`}
                      className="aspect-square flex items-center justify-center text-[10px] rounded-sm bg-gray-100 border border-gray-200"
                    >
                      {v.toFixed(2).replace(/\.00$/, '')}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">输出 5×5</p>
              <div className="grid grid-cols-5 gap-0.5">
                {output5.map((row, i) =>
                  row.map((v, j) => {
                    const isSelected = i === hi && j === hj;
                    return (
                      <div
                        key={`out-${i}-${j}`}
                        className={`aspect-square flex items-center justify-center text-[10px] rounded-sm ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{ backgroundColor: clampColor(v) }}
                      >
                        {v.toFixed(1)}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">选择输出单元以高亮感受野</label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                ({hi},{hj}) → {output5[hi][hj].toFixed(2)}
              </span>
            </div>
            <Slider
              value={[highlight]}
              min={0}
              max={24}
              step={1}
              onValueChange={(v) => setHighlight(v[0])}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <KaTeX
              math={String.raw`(I*K)_{${hi},${hj}} = \sum_{m=0}^{2}\sum_{n=0}^{2} I(${hi}+m, ${hj}+n)\,K(m,n) = ${output5[hi][hj].toFixed(2)}`}
            />
          </div>
        </div>
      </InteractiveDemo>

      {/* Demo 2: pooling/stride/padding */}
      <InteractiveDemo title="池化、步幅与填充">
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">池化尺寸 K</label>
              <div className="flex gap-2">
                {[2, 3].map((s) => (
                  <Button
                    key={s}
                    variant={poolSize === s ? 'default' : 'outline'}
                    onClick={() => setPoolSize(s)}
                    className="flex-1"
                  >
                    {s}×{s}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">步幅 S</label>
              <div className="flex gap-2">
                {[1, 2].map((s) => (
                  <Button
                    key={s}
                    variant={stride === s ? 'default' : 'outline'}
                    onClick={() => setStride(s)}
                    className="flex-1"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">填充 P</label>
              <div className="flex gap-2">
                {[0, 1].map((p) => (
                  <Button
                    key={p}
                    variant={padding === p ? 'default' : 'outline'}
                    onClick={() => setPadding(p)}
                    className="flex-1"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">填充后输入 {8 + 2 * padding}×{8 + 2 * padding}</p>
              <div
                className="grid gap-0.5 mx-auto"
                style={{ gridTemplateColumns: `repeat(${8 + 2 * padding}, minmax(0, 1fr))` }}
              >
                {padded8.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`pad-${i}-${j}`}
                      className="aspect-square flex items-center justify-center text-[8px] rounded-sm"
                      style={{ backgroundColor: clampColor(v) }}
                    >
                      {v.toFixed(0)}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                最大池化输出 {outputSize}×{outputSize}
              </p>
              <div
                className="grid gap-0.5 mx-auto max-w-[260px]"
                style={{ gridTemplateColumns: `repeat(${outputSize}, minmax(0, 1fr))` }}
              >
                {poolOutput.map((row, i) =>
                  row.map((v, j) => (
                    <div
                      key={`pool-${i}-${j}`}
                      className="aspect-square flex items-center justify-center text-xs rounded-sm"
                      style={{ backgroundColor: clampColor(v) }}
                    >
                      {v.toFixed(0)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <FormulaCard
            title="当前输出尺寸"
            formula={String.raw`O = \left\lfloor \frac{${8} + 2\cdot${padding} - ${poolSize}}{${stride}} \right\rfloor + 1 = ${outputSize}`}
          />
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
