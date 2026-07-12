import { useState, useMemo, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { biasVarianceDecomposition } from '@/lib/math/biasVariance';

const W = 560;
const H = 320;
const MARGIN = { top: 20, right: 20, bottom: 40, left: 50 };
const PW = W - MARGIN.left - MARGIN.right;
const PH = H - MARGIN.top - MARGIN.bottom;
const Y_MIN = -2.5;
const Y_MAX = 2.5;

export default function PolynomialRegressionDemo() {
  const [degree, setDegree] = useState(5);
  const [N, setN] = useState(30);
  const [sigma, setSigma] = useState(0.4);
  const [lambda, setLambda] = useState(0);
  const [R, setR] = useState(50);
  const [seed, setSeed] = useState(42);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(
    () => biasVarianceDecomposition(N, degree, sigma, lambda, R, seed),
    [N, degree, sigma, lambda, R, seed],
  );

  const xMin = -1;
  const xMax = 1;

  const toX = useCallback((x: number) => MARGIN.left + ((x - xMin) / (xMax - xMin)) * PW, [xMin, xMax]);
  const toY = (y: number) => MARGIN.top + PH - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * PH;

  const truePath = useMemo(
    () =>
      result.testGrid
        .map((x, i) => `${toX(x)},${toY(result.trueY[i])}`)
        .join(' '),
    [result, toX],
  );

  const meanPath = useMemo(
    () =>
      result.testGrid
        .map((x, i) => `${toX(x)},${toY(result.meanPred[i])}`)
        .join(' '),
    [result, toX],
  );

  const fitPaths = useMemo(
    () =>
      result.allFits.map((fit) =>
        fit.map((y, i) => `${toX(result.testGrid[i])},${toY(y)}`).join(' '),
      ),
    [result, toX],
  );

  const biasBand = useMemo(() => {
    const top = result.testGrid.map((x, i) => `${toX(x)},${toY(result.meanPred[i] + Math.sqrt(result.bias2[i]))}`);
    const bottom = result.testGrid.map((x, i) => `${toX(x)},${toY(result.meanPred[i] - Math.sqrt(result.bias2[i]))}`).reverse();
    return [...top, ...bottom].join(' ');
  }, [result, toX]);

  const varianceBand = useMemo(() => {
    const top = result.testGrid.map((x, i) => `${toX(x)},${toY(result.meanPred[i] + Math.sqrt(result.variance[i]))}`);
    const bottom = result.testGrid.map((x, i) => `${toX(x)},${toY(result.meanPred[i] - Math.sqrt(result.variance[i]))}`).reverse();
    return [...top, ...bottom].join(' ');
  }, [result, toX]);

  return (
    <InteractiveDemo title="偏差-方差分解实验">
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>多项式次数</span>
              <span className={degree > 10 ? 'text-red-600 font-bold' : ''}>{degree}</span>
            </div>
            <Slider value={[degree]} min={0} max={15} step={1} onValueChange={(v) => setDegree(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>训练样本数 N</span>
              <span>{N}</span>
            </div>
            <Slider value={[N]} min={10} max={80} step={5} onValueChange={(v) => setN(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>噪声 σ</span>
              <span>{sigma.toFixed(2)}</span>
            </div>
            <Slider value={[sigma]} min={0} max={1.0} step={0.05} onValueChange={(v) => setSigma(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>正则化 λ</span>
              <span>{lambda.toFixed(3)}</span>
            </div>
            <Slider value={[lambda]} min={0} max={0.5} step={0.005} onValueChange={(v) => setLambda(v[0])} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 10000))}
            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
          >
            🔄 重新采样
          </button>
          <button
            onClick={() => setShowAdvanced((s) => !s)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showAdvanced ? '隐藏高级参数' : '显示高级参数'}
          </button>
          {showAdvanced && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">重复次数 R</span>
              <Slider
                value={[R]}
                min={10}
                max={200}
                step={10}
                onValueChange={(v) => setR(v[0])}
                className="w-40"
              />
              <span className="text-sm font-medium text-gray-700 w-10">{R}</span>
            </div>
          )}
        </div>

        {/* SVG Plot */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 360 }}>
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = Y_MIN + (Y_MAX - Y_MIN) * t;
              return (
                <g key={`grid-${t}`}>
                  <line
                    x1={MARGIN.left}
                    y1={toY(y)}
                    x2={W - MARGIN.right}
                    y2={toY(y)}
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                  />
                  <text
                    x={MARGIN.left - 6}
                    y={toY(y) + 4}
                    textAnchor="end"
                    className="text-[10px]"
                    fill="#9ca3af"
                  >
                    {y.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Variance band */}
            <polygon points={varianceBand} fill="rgba(245, 158, 11, 0.15)" />

            {/* Bias band */}
            <polygon points={biasBand} fill="rgba(239, 68, 68, 0.12)" />

            {/* True function */}
            <polyline
              points={truePath}
              fill="none"
              stroke="#d1d5db"
              strokeWidth={2.5}
              strokeDasharray="6,3"
            />

            {/* Individual fits */}
            {fitPaths.map((pts, i) => (
              <polyline
                key={i}
                points={pts}
                fill="none"
                stroke="#60a5fa"
                strokeWidth={1}
                opacity={0.15}
              />
            ))}

            {/* Mean prediction */}
            <polyline
              points={meanPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Legend inline */}
            <text x={W - MARGIN.right - 4} y={MARGIN.top + 12} textAnchor="end" className="text-[11px]" fill="#6b7280">
              <tspan fill="#d1d5db">—</tspan> 真实 sin(2πx)
            </text>
            <text x={W - MARGIN.right - 4} y={MARGIN.top + 26} textAnchor="end" className="text-[11px]" fill="#6b7280">
              <tspan fill="#ef4444">—</tspan> 平均预测
            </text>
            <text x={W - MARGIN.right - 4} y={MARGIN.top + 40} textAnchor="end" className="text-[11px]" fill="#6b7280">
              <tspan fill="#60a5fa">—</tspan> 单次拟合
            </text>
            <rect x={MARGIN.left} y={MARGIN.top} width={PW} height={PH} fill="none" stroke="#9ca3af" strokeWidth={1} />
          </svg>
          <div className="flex justify-center gap-3 pb-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-red-500/20" />
              偏差带
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-amber-500/20" />
              方差带
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-5 gap-3 text-center">
          {[
            { label: '平均偏差²', value: result.avgBias2.toFixed(4), color: 'text-red-700', bg: 'bg-red-50' },
            { label: '平均方差', value: result.avgVariance.toFixed(4), color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'σ²', value: result.noise.toFixed(4), color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: '期望测试误差', value: result.avgExpectedError.toFixed(4), color: 'text-purple-700', bg: 'bg-purple-50' },
            { label: '平均测试 MSE', value: result.actualTestMse.toFixed(4), color: 'text-emerald-700', bg: 'bg-emerald-50' },
          ].map((m) => (
            <div key={m.label} className={`rounded-lg p-2 ${m.bg}`}>
              <div className="text-xs text-gray-600">{m.label}</div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Decomposition equation */}
        <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <KaTeX
            display
            math={String.raw`\mathbb{E}_{\mathcal{D}}\!\left[ (y - \hat{f}(x))^2 \right] = \underbrace{(\mathbb{E}[\hat{f}(x)] - f(x))^2}_{\text{偏差}^2} + \underbrace{\mathbb{V}[\hat{f}(x)]}_{\text{方差}} + \underbrace{\sigma^2}_{\text{不可约噪声}}`}
          />
          <p>
            <strong>🎯 试试看：</strong>
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>把 <strong>多项式次数调到 0–2</strong>：平均预测偏离真实曲线，偏差² 很大 → <span className="text-red-600 font-medium">欠拟合</span></li>
            <li>把 <strong>次数调到 12–15</strong>：单次拟合曲线分散，方差很大 → <span className="text-red-600 font-medium">过拟合</span></li>
            <li><strong>增大 λ</strong>：压缩高次权重，降低方差但可能增加偏差</li>
            <li><strong>增大 N</strong>：方差下降，偏差基本不变</li>
            <li><strong>增大 σ</strong>：不可约噪声上升，期望测试误差整体抬升</li>
          </ul>
          <p className="mt-2">
            蓝色半透明曲线是 {R} 次独立拟合；红色曲线是它们的平均预测。红色半透明带表示偏差，琥珀色带表示方差。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
