import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  sigmoid,
  crossEntropyLoss,
  accuracy,
  predictClasses,
  meanConfidence,
  computeDecisionBoundary,
  scaleWeights,
} from '@/lib/math/logistic';

/* -------------------------------------------------------------------------- */
/* 数据生成：两类二维数据                                                      */
/* -------------------------------------------------------------------------- */
function genData(N: number, seed: number) {
  const rng = mulberry32(seed);
  const class0: { x: number; y: number }[] = [];
  const class1: { x: number; y: number }[] = [];
  // Class 0: centered at (-1.5, -1), Class 1: centered at (1.5, 1)
  for (let i = 0; i < N / 2; i++) {
    class0.push({
      x: -1.5 + (rng() - 0.5) * 3,
      y: -1 + (rng() - 0.5) * 3,
    });
    class1.push({
      x: 1.5 + (rng() - 0.5) * 3,
      y: 1 + (rng() - 0.5) * 3,
    });
  }
  return { class0, class1 };
}

/* -------------------------------------------------------------------------- */
/* SVG 与几何辅助                                                              */
/* -------------------------------------------------------------------------- */
const W = 480,
  H = 360,
  M = { t: 10, r: 10, b: 40, l: 50 };
const PW = W - M.l - M.r,
  PH = H - M.t - M.b;
const XRANGE: [number, number] = [-4, 4];
const YRANGE: [number, number] = [-3.5, 3.5];
const EPS = 1e-9;

function toX(x: number) {
  return M.l + ((x - XRANGE[0]) / (XRANGE[1] - XRANGE[0])) * PW;
}
function toY(y: number) {
  return M.t + PH - ((y - YRANGE[0]) / (YRANGE[1] - YRANGE[0])) * PH;
}

/**
 * Build a large polygon that shades the positive side of the decision boundary.
 * The polygon is clipped to the plot area by the SVG viewBox.
 */
function positiveShadingPoints(
  boundary: { x1: number; y1: number; x2: number; y2: number },
  w: number[],
): string {
  const p1x = boundary.x1;
  const p1y = boundary.y1;
  const p2x = boundary.x2;
  const p2y = boundary.y2;

  const nx = w[1];
  const ny = w[2];
  const len = Math.sqrt(nx * nx + ny * ny) || 1;
  const L = 1e6;
  const fx = (nx / len) * L;
  const fy = (ny / len) * L;

  return `${toX(p1x)},${toY(p1y)} ${toX(p2x)},${toY(p2y)} ${
    toX(p2x + fx)
  },${toY(p2y + fy)} ${toX(p1x + fx)},${toY(p1y + fy)}`;
}

/* -------------------------------------------------------------------------- */
/* 组件                                                                       */
/* -------------------------------------------------------------------------- */
export default function LogisticDecisionBoundaryDemo() {
  const [w0, setW0] = useState(0);
  const [w1, setW1] = useState(1.0);
  const [w2, setW2] = useState(1.0);
  const [seed, setSeed] = useState(99);
  const [scale, setScale] = useState(1);

  const data = useMemo(() => genData(80, seed), [seed]);
  const w = useMemo(() => [w0, w1, w2], [w0, w1, w2]);

  const { X, y } = useMemo(() => {
    const X = [
      ...data.class0.map((p) => [p.x, p.y]),
      ...data.class1.map((p) => [p.x, p.y]),
    ];
    const y = [
      ...Array(data.class0.length).fill(0),
      ...Array(data.class1.length).fill(1),
    ];
    return { X, y };
  }, [data]);

  const boundary = computeDecisionBoundary(w, XRANGE, YRANGE);
  const loss = crossEntropyLoss(X, y, w);
  const acc = accuracy(X, y, w);
  const preds = predictClasses(X, w);
  const conf = meanConfidence(X, w);

  const scaledW = useMemo(() => scaleWeights(w, scale), [w, scale]);
  const scaledBoundary = computeDecisionBoundary(scaledW, XRANGE, YRANGE);
  const scaledLoss = crossEntropyLoss(X, y, scaledW);
  const scaledPreds = predictClasses(X, scaledW);
  const scaledConf = meanConfidence(X, scaledW);

  const boundaryEqual = useMemo(() => {
    if (!boundary && !scaledBoundary) return true;
    if (!boundary || !scaledBoundary) return false;
    return (
      Math.abs(boundary.x1 - scaledBoundary.x1) < 1e-6 &&
      Math.abs(boundary.y1 - scaledBoundary.y1) < 1e-6 &&
      Math.abs(boundary.x2 - scaledBoundary.x2) < 1e-6 &&
      Math.abs(boundary.y2 - scaledBoundary.y2) < 1e-6
    );
  }, [boundary, scaledBoundary]);

  const classesEqual = useMemo(() => {
    if (preds.length !== scaledPreds.length) return false;
    return preds.every((v, i) => v === scaledPreds[i]);
  }, [preds, scaledPreds]);

  const confusion = useMemo(() => {
    let tp = 0,
      fp = 0,
      tn = 0,
      fn = 0;
    for (let i = 0; i < X.length; i++) {
      const pred = preds[i];
      if (y[i] === 1 && pred === 1) tp++;
      else if (y[i] === 0 && pred === 1) fp++;
      else if (y[i] === 0 && pred === 0) tn++;
      else fn++;
    }
    return { tp, fp, tn, fn };
  }, [preds, X.length, y]);

  // Sigmoid curve points for visualization
  const sigmoidPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const z = -6 + (12 * i) / 100;
      pts.push({ x: z, y: sigmoid(z) });
    }
    return pts;
  }, []);

  const isUniform = Math.abs(w1) < EPS && Math.abs(w2) < EPS;

  return (
    <InteractiveDemo title="交互式逻辑回归：了解决策边界的形成">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          下方散点是两类数据。滑动权重 <KaTeX math="w_0,w_1,w_2" /> 观察决策边界
          <KaTeX math="w_0 + w_1 x + w_2 y = 0" /> 如何移动，
          以及交叉熵损失如何变化。红线 = 决策边界，红色半透明区域 = 模型预测为正类的区域。
        </p>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'w₀ (偏置)',
              val: w0,
              set: setW0,
              min: -5,
              max: 5,
              step: 0.1,
              desc: '控制边界到原点的距离',
            },
            {
              label: 'w₁ (x 权重)',
              val: w1,
              set: setW1,
              min: -3,
              max: 3,
              step: 0.1,
              desc: 'x 轴方向的敏感度',
            },
            {
              label: 'w₂ (y 权重)',
              val: w2,
              set: setW2,
              min: -3,
              max: 3,
              step: 0.1,
              desc: 'y 轴方向的敏感度',
            },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-xs font-medium text-gray-700 mb-0.5">
                <span>{c.label}</span>
                <span className="font-mono">{c.val.toFixed(1)}</span>
              </div>
              <Slider
                value={[c.val]}
                min={c.min}
                max={c.max}
                step={c.step}
                onValueChange={(v) => c.set(v[0])}
              />
              <p className="text-[10px] text-gray-400 mt-0.5">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setW0(0);
              setW1(1);
              setW2(1);
              setScale(1);
            }}
            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
          >
            ↺ 重置权重
          </button>
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 10000))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            🔄 换一批数据
          </button>
          <button
            onClick={() => setW0(w0 - 0.3)}
            className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-mono"
          >
            w₀ -= 0.3
          </button>
          <button
            onClick={() => setW0(w0 + 0.3)}
            className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-mono"
          >
            w₀ += 0.3
          </button>
        </div>

        {/* Scaling experiment */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              缩放实验：正数缩放 c
            </span>
            <span className="text-sm font-mono text-gray-600">c = {scale.toFixed(1)}</span>
          </div>
          <Slider
            value={[scale]}
            min={0.5}
            max={5}
            step={0.5}
            onValueChange={(v) => setScale(v[0])}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="rounded p-2 bg-white border">
              <div className="text-gray-500">决策边界</div>
              <div className="font-semibold text-gray-800">
                {boundaryEqual ? '不变 ✓' : '—'}
              </div>
            </div>
            <div className="rounded p-2 bg-white border">
              <div className="text-gray-500">预测类别</div>
              <div className="font-semibold text-gray-800">
                {classesEqual ? '不变 ✓' : '—'}
              </div>
            </div>
            <div className="rounded p-2 bg-white border">
              <div className="text-gray-500">交叉熵</div>
              <div className="font-semibold text-gray-800">
                {loss.toFixed(4)} → {scaledLoss.toFixed(4)}
              </div>
            </div>
            <div className="rounded p-2 bg-white border">
              <div className="text-gray-500">平均置信度</div>
              <div className="font-semibold text-gray-800">
                {conf.toFixed(3)} → {scaledConf.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {/* Main plot + sigmoid side by side */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Decision boundary plot */}
          <div className="md:col-span-2 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            {isUniform && (
              <div className="px-3 py-1 text-xs text-center text-amber-700 bg-amber-50 border-b border-amber-100">
                {w0 > 0
                  ? 'w₁ = w₂ = 0：所有样本被判为正类'
                  : w0 < 0
                    ? 'w₁ = w₂ = 0：所有样本被判为负类'
                    : 'w₁ = w₂ = 0：所有样本预测概率为 0.5'}
              </div>
            )}
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 360 }}>
              {/* Decision region */}
              {isUniform ? (
                w0 !== 0 && (
                  <rect
                    x={M.l}
                    y={M.t}
                    width={PW}
                    height={PH}
                    fill={w0 > 0 ? 'rgba(239,68,68,0.05)' : 'rgba(59,130,246,0.05)'}
                  />
                )
              ) : boundary ? (
                <polygon points={positiveShadingPoints(boundary, w)} fill="rgba(239,68,68,0.05)" />
              ) : null}

              {/* Grid */}
              {[-3, -1.5, 0, 1.5, 3].map((v) => (
                <line
                  key={`gx-${v}`}
                  x1={toX(v)}
                  y1={M.t}
                  x2={toX(v)}
                  y2={H - M.b}
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                />
              ))}
              {[-3, -1.5, 0, 1.5, 3].map((v) => (
                <line
                  key={`gy-${v}`}
                  x1={M.l}
                  y1={toY(v)}
                  x2={W - M.r}
                  y2={toY(v)}
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                />
              ))}
              {/* Points */}
              {data.class0.map((p, i) => (
                <circle
                  key={`c0-${i}`}
                  cx={toX(p.x)}
                  cy={toY(p.y)}
                  r={3}
                  fill="#3b82f6"
                  opacity={0.6}
                />
              ))}
              {data.class1.map((p, i) => (
                <circle
                  key={`c1-${i}`}
                  cx={toX(p.x)}
                  cy={toY(p.y)}
                  r={3}
                  fill="#ef4444"
                  opacity={0.6}
                />
              ))}
              {/* Decision boundary */}
              {boundary && (
                <line
                  x1={toX(boundary.x1)}
                  y1={toY(boundary.y1)}
                  x2={toX(boundary.x2)}
                  y2={toY(boundary.y2)}
                  stroke="#1f2937"
                  strokeWidth={2.5}
                />
              )}
              {/* Axes */}
              <line
                x1={M.l}
                y1={toY(0)}
                x2={W - M.r}
                y2={toY(0)}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <line
                x1={toX(0)}
                y1={M.t}
                x2={toX(0)}
                y2={H - M.b}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <rect
                x={M.l}
                y={M.t}
                width={PW}
                height={PH}
                fill="none"
                stroke="#d1d5db"
                strokeWidth={1}
              />
            </svg>
            <div className="flex justify-center gap-3 pb-1 text-xs text-gray-500">
              <span>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />
                类别 0
              </span>
              <span>
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />
                类别 1
              </span>
              <span>
                <span className="inline-block w-2 h-[2px] bg-gray-800 mr-1 align-middle" />
                决策边界 wᵀx=0
              </span>
            </div>
          </div>

          {/* Sigmoid panel */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col items-center justify-center space-y-3">
            <div className="text-xs font-medium text-gray-600">sigmoid 函数</div>
            <svg viewBox="0 0 200 140" className="w-full max-w-[180px]">
              <polyline
                points={sigmoidPoints
                  .map((p) => `${20 + (p.x + 6) * 13.3},${130 - p.y * 110}`)
                  .join(' ')}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
              <line
                x1={20}
                y1={130 - 55}
                x2={180}
                y2={130 - 55}
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="4,2"
                opacity={0.6}
              />
              <text
                x={160}
                y={128}
                textAnchor="end"
                className="text-[8px]"
                fill="#ef4444"
              >
                p=0.5
              </text>
              <line
                x1={20}
                y1={130}
                x2={20}
                y2={10}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <line
                x1={20}
                y1={130}
                x2={180}
                y2={130}
                stroke="#9ca3af"
                strokeWidth={1}
              />
            </svg>
            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              sigmoid 把任意实数 <KaTeX math="z=\mathbf{w}^T\mathbf{x}" /> 映射到 (0,1) 概率。
              通过调整权重，模型在不同位置得到不同的概率输出。
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            {
              label: '交叉熵损失',
              value: loss.toFixed(4),
              color: 'text-red-700',
              bg: 'bg-red-50',
            },
            {
              label: '准确率',
              value: (acc * 100).toFixed(1) + '%',
              color: 'text-emerald-700',
              bg: 'bg-emerald-50',
            },
            {
              label: 'TP/FP',
              value: `${confusion.tp}/${confusion.fp}`,
              color: 'text-blue-700',
              bg: 'bg-blue-50',
            },
            {
              label: 'FN/TN',
              value: `${confusion.fn}/${confusion.tn}`,
              color: 'text-gray-700',
              bg: 'bg-gray-50',
            },
          ].map((m) => (
            <div key={m.label} className={`rounded-lg p-2 ${m.bg}`}>
              <div className="text-xs text-gray-600">{m.label}</div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="text-sm text-gray-700 space-y-2 bg-slate-50 p-4 rounded-lg border">
          <p>
            <strong>🎯 试试看：</strong>
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>调大 <strong>w₁</strong>：边界更倾斜，x 方向的区分力增强</li>
            <li>
              调大 <strong>w₀</strong>（偏置）：会提高所有样本的 logit
              并扩大正类区域；边界移动方向取决于 w₂ 的符号
            </li>
            <li>减小 <strong>w₂</strong> 到接近 0：边界接近垂直，因为 y 几乎不再影响分类</li>
            <li>
              <strong>点击「换一批数据」</strong>：看到同一组权重在不同数据上表现不同 → 方差
            </li>
            <li>目标：<strong>最小化交叉熵损失</strong>——这等价于最大化似然</li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
