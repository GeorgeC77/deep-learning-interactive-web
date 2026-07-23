import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

const PLOT_W = 560;
const PLOT_H = 280;
const MARGIN = { t: 20, r: 20, b: 40, l: 50 };
const INNER_W = PLOT_W - MARGIN.l - MARGIN.r;
const INNER_H = PLOT_H - MARGIN.t - MARGIN.b;

// 生成 D 维空间中的随机点
function randomPoint(D: number): number[] {
  const point: number[] = [];
  for (let i = 0; i < D; i++) {
    // 使用 Box-Muller 生成高斯分布
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const g = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    point.push(g);
  }
  return point;
}

// 计算两点欧氏距离
function distance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

export default function CurseOfDimensionalityLab() {
  const [D, setD] = useState(2);
  const [numSamples, setNumSamples] = useState(50);

  const samples = useMemo(() => {
    const points: number[][] = [];
    for (let i = 0; i < numSamples; i++) {
      points.push(randomPoint(D));
    }
    return points;
  }, [D, numSamples]);

  const distances = useMemo(() => {
    const dists: number[] = [];
    for (let i = 0; i < samples.length; i++) {
      for (let j = i + 1; j < samples.length; j++) {
        dists.push(distance(samples[i], samples[j]));
      }
    }
    return dists;
  }, [samples]);

  const avgDistance = useMemo(() => {
    if (distances.length === 0) return 0;
    return distances.reduce((a, b) => a + b, 0) / distances.length;
  }, [distances]);

  const minDistance = useMemo(() => {
    if (distances.length === 0) return 0;
    return Math.min(...distances);
  }, [distances]);

  const maxDistance = useMemo(() => {
    if (distances.length === 0) return 0;
    return Math.max(...distances);
  }, [distances]);

  const distanceRatio = useMemo(() => {
    if (minDistance === 0) return 0;
    return maxDistance / minDistance;
  }, [maxDistance, minDistance]);

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
          点与点之间的距离趋于相同，"近邻"概念失去意义。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-gray-600">平均距离</div>
                <div className="text-lg font-bold text-blue-700">{avgDistance.toFixed(3)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-gray-600">距离比率</div>
                <div className="text-lg font-bold text-emerald-700">{distanceRatio.toFixed(2)}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-gray-600">最小距离</div>
                <div className="text-lg font-bold text-amber-700">{minDistance.toFixed(3)}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-gray-600">最大距离</div>
                <div className="text-lg font-bold text-violet-700">{maxDistance.toFixed(3)}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-700">
                <strong>解释：</strong>
                {D <= 3 && ' 低维空间中，点之间的距离差异明显，近邻关系有意义。'}
                {D > 3 && D <= 10 && ' 随着维度增加，点之间的距离开始趋于一致。'}
                {D > 10 && ' 高维空间中，几乎所有点都彼此等距，"近邻"概念失效。'}
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

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="text-sm text-amber-800">
            <strong>关键观察：</strong>
            当 D=2 时，点之间的最大距离与最小距离之比约为 {distanceRatio.toFixed(1)}；
            当 D=50 时，这个比率接近 1，意味着所有点都几乎等距。
            这就是为什么基于距离的核方法（如 RBF）在高维空间会失效。
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
