import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import {
  iteratedTentMap,
  linearRegionCount,
  shallowReluUnitsForExactRepresentation,
} from '@/lib/math/depthComposition';

const WIDTH = 620;
const HEIGHT = 260;
const MARGIN = { top: 16, right: 16, bottom: 36, left: 44 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

export default function DepthVsWidthLab() {
  const [depth, setDepth] = useState(2);
  const [x, setX] = useState(0.31);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const points = useMemo(
    () =>
      Array.from({ length: 401 }, (_, index) => {
        const input = index / 400;
        return { input, output: iteratedTentMap(input, depth) };
      }),
    [depth],
  );
  const regions = linearRegionCount(depth);
  const shallowUnits = shallowReluUnitsForExactRepresentation(depth);
  const output = iteratedTentMap(x, depth);
  const toX = (value: number) => MARGIN.left + value * PLOT_WIDTH;
  const toY = (value: number) => MARGIN.top + (1 - value) * PLOT_HEIGHT;

  return (
    <InteractiveDemo title="层次组合实验：深度如何复用一个简单函数">
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-gray-700">
          这里不模拟训练准确率，而是观察一个可精确计算的函数族：把同一个三角形映射 T 重复组合 L 次。
          每增加一次组合，线性区域数翻倍。这个例子说明某些组合结构能被深层表示紧凑复用；它不等于“任何任务越深越好”。
        </p>

        <PredictionGate
          resetKey="chapter03-depth-composition"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="若 T(x) 有 2 个线性区域，把 T 自身组合 4 次后会有多少个线性区域？"
          hint="每一层都会把上一层的每个区域再折叠为两段。"
          options={[
            { value: '8', label: '8 个' },
            { value: '16', label: '16 个' },
            { value: '32', label: '32 个' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === '16',
            category: '层次组合',
            feedback: answer === '16' ? '正确：区域数为 2⁴=16。' : '区域数按 2ᴸ 增长，而不是按 2L 增长。',
          })}
          revealContent={<p className="text-sm text-gray-700">T<sup>L</sup> 的线性区域数为 2<sup>L</sup>；单隐藏层标量 ReLU 网络若要精确表示同一折线，至少需要覆盖 2<sup>L</sup>-1 个折点。</p>}
        />

        {submitted && (
          <div className="space-y-5" aria-label="层次组合实验控制区">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span className="flex justify-between"><span>组合深度 L</span><span className="font-mono">{depth}</span></span>
                <Slider value={[depth]} min={1} max={8} step={1} onValueChange={([value]) => setDepth(value)} />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span className="flex justify-between"><span>输入 x</span><span className="font-mono">{x.toFixed(2)}</span></span>
                <Slider value={[x]} min={0} max={1} step={0.01} onValueChange={([value]) => setX(value)} />
              </label>
            </div>

            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full rounded-lg border bg-gray-50">
              {[0, 0.25, 0.5, 0.75, 1].map((value) => (
                <g key={value}>
                  <line x1={toX(value)} y1={MARGIN.top} x2={toX(value)} y2={HEIGHT - MARGIN.bottom} stroke="#e5e7eb" />
                  <line x1={MARGIN.left} y1={toY(value)} x2={WIDTH - MARGIN.right} y2={toY(value)} stroke="#e5e7eb" />
                </g>
              ))}
              <polyline
                points={points.map((point) => `${toX(point.input)},${toY(point.output)}`).join(' ')}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
              />
              <circle cx={toX(x)} cy={toY(output)} r="5" fill="#dc2626" />
              <rect x={MARGIN.left} y={MARGIN.top} width={PLOT_WIDTH} height={PLOT_HEIGHT} fill="none" stroke="#9ca3af" />
            </svg>

            <div className="grid gap-3 sm:grid-cols-3 text-center">
              <div className="rounded-lg bg-violet-50 p-3"><div className="text-xs text-gray-600">线性区域</div><div className="font-bold text-violet-800">2^{depth} = {regions}</div></div>
              <div className="rounded-lg bg-blue-50 p-3"><div className="text-xs text-gray-600">浅层精确表示至少需</div><div className="font-bold text-blue-800">{shallowUnits} 个折点单元</div></div>
              <div className="rounded-lg bg-emerald-50 p-3"><div className="text-xs text-gray-600">T^{depth}({x.toFixed(2)})</div><div className="font-bold text-emerald-800">{output.toFixed(3)}</div></div>
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
