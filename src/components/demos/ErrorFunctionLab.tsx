import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

const PLOT_W = 560;
const PLOT_H = 280;
const MARGIN = { t: 20, r: 20, b: 40, l: 50 };
const INNER_W = PLOT_W - MARGIN.l - MARGIN.r;
const INNER_H = PLOT_H - MARGIN.t - MARGIN.b;

// 误差函数定义
const ERROR_FUNCTIONS = {
  mse: {
    name: '平方误差 (MSE)',
    fn: (y: number, t: number) => 0.5 * (y - t) ** 2,
    grad: (y: number, t: number) => y - t,
    color: '#3b82f6',
  },
  crossEntropy: {
    name: '交叉熵',
    fn: (y: number, t: number) => {
      const p = Math.max(1e-10, Math.min(1 - 1e-10, y));
      return t === 1 ? -Math.log(p) : -Math.log(1 - p);
    },
    grad: (y: number, t: number) => {
      const p = Math.max(1e-10, Math.min(1 - 1e-10, y));
      return t === 1 ? -1 / p : 1 / (1 - p);
    },
    color: '#10b981',
  },
  huber: {
    name: 'Huber 损失',
    fn: (y: number, t: number) => {
      const delta = 1;
      const diff = Math.abs(y - t);
      return diff <= delta ? 0.5 * diff ** 2 : delta * (diff - 0.5 * delta);
    },
    grad: (y: number, t: number) => {
      const delta = 1;
      const diff = y - t;
      return Math.abs(diff) <= delta ? diff : delta * Math.sign(diff);
    },
    color: '#8b5cf6',
  },
};

type ErrorFunctionKey = keyof typeof ERROR_FUNCTIONS;

export default function ErrorFunctionLab() {
  const [selected, setSelected] = useState<ErrorFunctionKey>('crossEntropy');
  const [yValue, setYValue] = useState(0.5);
  const [target, setTarget] = useState(1);

  const errorFn = ERROR_FUNCTIONS[selected];

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const y = i / 100;
      const loss = errorFn.fn(y, target);
      const px = MARGIN.l + y * INNER_W;
      const py = MARGIN.t + INNER_H - (loss / 5) * INNER_H;
      points.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    return points.join(' ');
  }, [errorFn, target]);

  const gradientPath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const y = i / 100;
      const grad = errorFn.grad(y, target);
      const px = MARGIN.l + y * INNER_W;
      const py = MARGIN.t + INNER_H - ((grad + 5) / 10) * INNER_H;
      points.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    return points.join(' ');
  }, [errorFn, target]);

  const currentLoss = errorFn.fn(yValue, target);
  const currentGrad = errorFn.grad(yValue, target);

  return (
    <InteractiveDemo title="误差函数对训练的影响">
      <div className="space-y-6">
        <p className="text-gray-700">
          选择不同的误差函数，观察损失值和梯度随预测概率变化的关系。
          注意交叉熵在预测接近 0 或 1 时梯度很大，而平方误差在饱和区梯度很小。
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">误差函数</label>
              <div className="flex gap-2 mt-2">
                {(Object.keys(ERROR_FUNCTIONS) as ErrorFunctionKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      selected === key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {ERROR_FUNCTIONS[key].name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">预测概率 y</label>
              <Slider value={[yValue]} min={0.01} max={0.99} step={0.01} onValueChange={(v) => setYValue(v[0])} />
              <div className="text-sm text-gray-500 mt-1">y = {yValue.toFixed(2)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">真实标签</label>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setTarget(1)}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${
                    target === 1
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  t = 1
                </button>
                <button
                  onClick={() => setTarget(0)}
                  className={`px-3 py-1.5 text-sm rounded-lg border ${
                    target === 0
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  t = 0
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-gray-600">损失值</div>
                <div className="text-lg font-bold text-blue-700">{currentLoss.toFixed(3)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-gray-600">梯度</div>
                <div className="text-lg font-bold text-emerald-700">{currentGrad.toFixed(3)}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-700">
                <strong>分析：</strong>
                {selected === 'mse' && ' 平方误差在预测接近 0 或 1 时梯度很小，导致 sigmoid 饱和区训练缓慢。'}
                {selected === 'crossEntropy' && ' 交叉熵在预测偏离真实标签时梯度很大，训练更快。'}
                {selected === 'huber' && ' Huber 损失在误差小时用平方，误差大时用线性，对异常值更鲁棒。'}
              </div>
            </div>
          </div>

          <div>
            <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="w-full border border-gray-200 rounded-lg">
              <rect x={MARGIN.l} y={MARGIN.t} width={INNER_W} height={INNER_H} fill="#f9fafb" />
              {/* 网格线 */}
              {[0, 1, 2, 3, 4, 5].map((y) => (
                <line
                  key={`gy-${y}`}
                  x1={MARGIN.l}
                  y1={MARGIN.t + INNER_H - (y / 5) * INNER_H}
                  x2={MARGIN.l + INNER_W}
                  y2={MARGIN.t + INNER_H - (y / 5) * INNER_H}
                  stroke="#e5e7eb"
                  strokeDasharray="3,3"
                />
              ))}
              {[0, 0.25, 0.5, 0.75, 1].map((x) => (
                <line
                  key={`gx-${x}`}
                  x1={MARGIN.l + x * INNER_W}
                  y1={MARGIN.t}
                  x2={MARGIN.l + x * INNER_W}
                  y2={MARGIN.t + INNER_H}
                  stroke="#e5e7eb"
                  strokeDasharray="3,3"
                />
              ))}

              {/* 损失曲线 */}
              <path d={curvePath} fill="none" stroke={errorFn.color} strokeWidth={2.5} />
              {/* 梯度曲线 */}
              <path d={gradientPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="5,5" />

              {/* 当前点 */}
              <circle
                cx={MARGIN.l + yValue * INNER_W}
                cy={MARGIN.t + INNER_H - (currentLoss / 5) * INNER_H}
                r={6}
                fill={errorFn.color}
                stroke="white"
                strokeWidth={2}
              />
              <circle
                cx={MARGIN.l + yValue * INNER_W}
                cy={MARGIN.t + INNER_H - ((currentGrad + 5) / 10) * INNER_H}
                r={5}
                fill="#ef4444"
                stroke="white"
                strokeWidth={2}
              />
            </svg>
            <div className="flex gap-4 justify-center mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5" style={{ backgroundColor: errorFn.color }} /> 损失
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-red-500" style={{ borderTop: '2px dashed #ef4444' }} /> 梯度
              </span>
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
