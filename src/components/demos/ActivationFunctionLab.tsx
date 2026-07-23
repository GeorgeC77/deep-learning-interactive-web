import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

const PLOT_W = 560;
const PLOT_H = 280;
const MARGIN = { t: 20, r: 20, b: 40, l: 50 };
const INNER_W = PLOT_W - MARGIN.l - MARGIN.r;
const INNER_H = PLOT_H - MARGIN.t - MARGIN.b;

// 激活函数定义
const ACTIVATIONS = {
  relu: {
    name: 'ReLU',
    fn: (z: number) => Math.max(0, z),
    grad: (z: number) => (z > 0 ? 1 : 0),
    color: '#3b82f6',
  },
  sigmoid: {
    name: 'Sigmoid',
    fn: (z: number) => 1 / (1 + Math.exp(-z)),
    grad: (z: number) => {
      const s = 1 / (1 + Math.exp(-z));
      return s * (1 - s);
    },
    color: '#10b981',
  },
  tanh: {
    name: 'Tanh',
    fn: (z: number) => Math.tanh(z),
    grad: (z: number) => 1 - Math.tanh(z) ** 2,
    color: '#8b5cf6',
  },
  leakyRelu: {
    name: 'Leaky ReLU',
    fn: (z: number) => (z > 0 ? z : 0.01 * z),
    grad: (z: number) => (z > 0 ? 1 : 0.01),
    color: '#f59e0b',
  },
  elu: {
    name: 'ELU',
    fn: (z: number) => (z > 0 ? z : Math.exp(z) - 1),
    grad: (z: number) => (z > 0 ? 1 : Math.exp(z)),
    color: '#ef4444',
  },
};

type ActivationKey = keyof typeof ACTIVATIONS;

export default function ActivationFunctionLab() {
  const [selected, setSelected] = useState<ActivationKey[]>(['relu', 'sigmoid', 'tanh']);
  const [zValue, setZValue] = useState(0);
  const [showGradient, setShowGradient] = useState(true);

  const activation = ACTIVATIONS[selected[0]];

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const z = (i / 100) * 6 - 3;
      const y = activation.fn(z);
      const px = MARGIN.l + ((z + 3) / 6) * INNER_W;
      const py = MARGIN.t + INNER_H - ((y + 1) / 2) * INNER_H;
      points.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    return points.join(' ');
  }, [activation]);

  const gradientPath = useMemo(() => {
    if (!showGradient) return '';
    const points: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const z = (i / 100) * 6 - 3;
      const y = activation.grad(z);
      const px = MARGIN.l + ((z + 3) / 6) * INNER_W;
      const py = MARGIN.t + INNER_H - ((y + 0.2) / 1.4) * INNER_H;
      points.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    return points.join(' ');
  }, [activation, showGradient]);

  const currentY = activation.fn(zValue);
  const currentGrad = activation.grad(zValue);

  return (
    <InteractiveDemo title="激活函数特性对比">
      <div className="space-y-6">
        <p className="text-gray-700">
          选择不同的激活函数，观察其输出和梯度随输入变化的关系。
          注意 sigmoid 和 tanh 在饱和区的梯度接近零，而 ReLU 在正区间梯度恒为 1。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">激活函数</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(Object.keys(ACTIVATIONS) as ActivationKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelected([key])}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      selected[0] === key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {ACTIVATIONS[key].name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">输入值 z</label>
              <Slider value={[zValue]} min={-3} max={3} step={0.1} onValueChange={(v) => setZValue(v[0])} />
              <div className="text-sm text-gray-500 mt-1">z = {zValue.toFixed(1)}</div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showGradient"
                checked={showGradient}
                onChange={(e) => setShowGradient(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="showGradient" className="text-sm font-medium text-gray-700">
                显示梯度
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-gray-600">输出 f(z)</div>
                <div className="text-lg font-bold text-blue-700">{currentY.toFixed(3)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-gray-600">梯度 f'(z)</div>
                <div className="text-lg font-bold text-emerald-700">{currentGrad.toFixed(3)}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-700">
                <strong>特性分析：</strong>
                {selected[0] === 'relu' && ' ReLU 在 z>0 时梯度恒为 1，有效缓解梯度消失；但 z<0 时梯度为 0，可能导致“死亡 ReLU”。'}
                {selected[0] === 'sigmoid' && ' Sigmoid 在 |z| 很大时梯度接近 0，深层网络中容易梯度消失。'}
                {selected[0] === 'tanh' && ' Tanh 零中心，比 sigmoid 更适合隐藏层，但仍有饱和问题。'}
                {selected[0] === 'leakyRelu' && ' Leaky ReLU 在 z<0 时保留小梯度，避免死亡 ReLU。'}
                {selected[0] === 'elu' && ' ELU 在 z<0 时平滑过渡，负值输出有助于推动均值接近零。'}
              </div>
            </div>
          </div>

          <div>
            <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="w-full border border-gray-200 rounded-lg">
              <rect x={MARGIN.l} y={MARGIN.t} width={INNER_W} height={INNER_H} fill="#f9fafb" />
              {/* 网格线 */}
              {[-1, 0, 1].map((y) => (
                <line
                  key={`gy-${y}`}
                  x1={MARGIN.l}
                  y1={MARGIN.t + INNER_H - ((y + 1) / 2) * INNER_H}
                  x2={MARGIN.l + INNER_W}
                  y2={MARGIN.t + INNER_H - ((y + 1) / 2) * INNER_H}
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

              {/* 激活函数曲线 */}
              <path d={curvePath} fill="none" stroke={activation.color} strokeWidth={2.5} />
              {/* 梯度曲线 */}
              {showGradient && (
                <path d={gradientPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="5,5" />
              )}

              {/* 当前点 */}
              <circle
                cx={MARGIN.l + ((zValue + 3) / 6) * INNER_W}
                cy={MARGIN.t + INNER_H - ((currentY + 1) / 2) * INNER_H}
                r={6}
                fill={activation.color}
                stroke="white"
                strokeWidth={2}
              />
              {showGradient && (
                <circle
                  cx={MARGIN.l + ((zValue + 3) / 6) * INNER_W}
                  cy={MARGIN.t + INNER_H - ((currentGrad + 0.2) / 1.4) * INNER_H}
                  r={5}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            </svg>
            <div className="flex gap-4 justify-center mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5" style={{ backgroundColor: activation.color }} /> {activation.name}
              </span>
              {showGradient && (
                <span className="flex items-center gap-1">
                  <span className="w-4 h-0.5 bg-red-500" style={{ borderTop: '2px dashed #ef4444' }} /> 梯度
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
