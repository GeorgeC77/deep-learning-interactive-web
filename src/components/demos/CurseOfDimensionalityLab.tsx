import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import {
  gaussianPoints,
  summarizePairwiseDistances,
} from '@/lib/math/highDimensional';

const PLOT_W = 560;
const PLOT_H = 280;
const MARGIN = { t: 20, r: 20, b: 40, l: 50 };
const INNER_W = PLOT_W - MARGIN.l - MARGIN.r;
const INNER_H = PLOT_H - MARGIN.t - MARGIN.b;

export default function CurseOfDimensionalityLab() {
  const [D, setD] = useState(2);
  const [numSamples, setNumSamples] = useState(50);
  const [seed, setSeed] = useState(42);
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const samples = useMemo(
    () => gaussianPoints(D, numSamples, seed),
    [D, numSamples, seed],
  );
  const summary = useMemo(() => summarizePairwiseDistances(samples), [samples]);

  // 2D 可视化（只显示前两个维度）
  const scatterPoints = useMemo(() => {
    return samples.map((p) => ({
      x: p[0] ?? 0,
      y: p[1] ?? 0,
    }));
  }, [samples]);

  return (
    <InteractiveDemo title="维度灾难：高维空间的反直觉性质">
      <div className="space-y-6">
        <p className="text-gray-700">
          调整空间维度 D，观察高维空间中随机点的距离分布。随着维度增加，
          独立高斯点间距离的相对波动通常缩小，原始欧氏距离的近邻对比度也随之下降。
        </p>

        <PredictionGate
          resetKey="chapter03-distance-concentration"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="从 D=2 增加到 D=50 时，点间距离的相对离散程度（标准差/均值）通常如何变化？"
          hint="平均距离会增大；问题问的是相对于平均距离的波动。"
          options={[
            { value: 'decrease', label: '下降，距离相对更集中' },
            { value: 'increase', label: '上升，距离相对更分散' },
            { value: 'same', label: '完全不变' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'decrease',
            category: '距离集中',
            feedback: answer === 'decrease' ? '正确。高维中绝对距离变大，但相对波动通常缩小。' : '区分绝对距离与相对离散度；应比较标准差/均值。',
          })}
          revealContent={<p className="text-sm text-gray-700">对独立高斯坐标，平方距离是许多独立项之和；维度增大时，相对波动因集中现象而减小。</p>}
        />

        {submitted && (
          <div className="grid md:grid-cols-2 gap-6" aria-label="高维距离实验控制区">
            <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">空间维度 D</label>
              <Slider value={[D]} min={1} max={50} step={1} onValueChange={(v) => setD(v[0])} />
              <div className="text-sm text-gray-500 mt-1">D = {D}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">样本数量</label>
              <Slider value={[numSamples]} min={10} max={200} step={10} onValueChange={(v) => setNumSamples(v[0])} />
              <div className="text-sm text-gray-500 mt-1">{numSamples} 个样本</div>
            </div>

            <button type="button" onClick={() => setSeed((value) => value + 1)} className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              更换固定随机种子（当前 {seed}）
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-gray-600">平均距离</div>
                <div className="text-lg font-bold text-blue-700">{summary.mean.toFixed(3)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-gray-600">相对离散度 σ/μ</div>
                <div className="text-lg font-bold text-emerald-700">{summary.coefficientOfVariation.toFixed(3)}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-gray-600">最小距离</div>
                <div className="text-lg font-bold text-amber-700">{summary.minimum.toFixed(3)}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-gray-600">最大距离</div>
                <div className="text-lg font-bold text-violet-700">{summary.maximum.toFixed(3)}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-700">
                <strong>解释：</strong>
                {D <= 3 && ' 低维下距离的相对波动通常较明显。'}
                {D > 3 && D <= 10 && ' 随维度增加，距离的相对波动开始缩小。'}
                {D > 10 && ' 高维下距离更集中；这会削弱仅依赖原始欧氏距离的近邻对比度，但不代表所有近邻方法在任何数据上都必然失效。'}
              </div>
            </div>
            </div>

            <div>
            <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="w-full border border-gray-200 rounded-lg">
              <rect x={MARGIN.l} y={MARGIN.t} width={INNER_W} height={INNER_H} fill="#f9fafb" />
              {/* 网格线 */}
              {[-2, 0, 2].map((y) => (
                <line
                  key={`gy-${y}`}
                  x1={MARGIN.l}
                  y1={MARGIN.t + INNER_H - ((y + 3) / 6) * INNER_H}
                  x2={MARGIN.l + INNER_W}
                  y2={MARGIN.t + INNER_H - ((y + 3) / 6) * INNER_H}
                  stroke="#e5e7eb"
                  strokeDasharray="3,3"
                />
              ))}
              {[-2, 0, 2].map((x) => (
                <line
                  key={`gx-${x}`}
                  x1={MARGIN.l + ((x + 3) / 6) * INNER_W}
                  y1={MARGIN.t}
                  x2={MARGIN.l + ((x + 3) / 6) * INNER_W}
                  y2={MARGIN.t + INNER_H}
                  stroke="#e5e7eb"
                  strokeDasharray="3,3"
                />
              ))}

              {/* 原点 */}
              <circle cx={MARGIN.l + INNER_W / 2} cy={MARGIN.t + INNER_H / 2} r={4} fill="#ef4444" />
              <text x={MARGIN.l + INNER_W / 2 + 8} y={MARGIN.t + INNER_H / 2 + 4} fontSize={12} fill="#ef4444">
                原点
              </text>

              {/* 样本点 */}
              {scatterPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={MARGIN.l + ((p.x + 3) / 6) * INNER_W}
                  cy={MARGIN.t + INNER_H - ((p.y + 3) / 6) * INNER_H}
                  r={4}
                  fill="#3b82f6"
                  opacity={0.7}
                />
              ))}
            </svg>
            <div className="text-center mt-2 text-xs text-gray-500">
              2D 投影（只显示前两个维度）
            </div>
            </div>
          </div>
        )}

        {submitted && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="text-sm text-amber-800">
              <strong>关键观察：</strong>
              当前相对离散度为 {summary.coefficientOfVariation.toFixed(3)}。比较不同 D 时应关注这个无量纲量，
              而不是只看平均距离或一次采样的最大/最小比。真实数据若位于低维流形，学习到的表示仍可能恢复有意义的邻域结构。
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
