import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';

/* -------------------------------------------------------------------------- */
/* ROC 数据生成                                                                */
/* -------------------------------------------------------------------------- */
function genScores(N: number, seed: number, overlap: number) {
  const rng = mulberry32(seed);
  const negScores: number[] = [];
  const posScores: number[] = [];
  // Negatives: N(0.2 * overlap, 1), Positives: N(1.5 + 0.2 * overlap, 1)
  // Overlap controls how much the distributions overlap
  const negMean = 1.5 - overlap * 0.6;
  const posMean = 3.0;
  const std = 1.0 + overlap * 0.2;
  for (let i = 0; i < N; i++) {
    // Box-Muller transform
    let u1 = rng(), u2 = rng();
    if (u1 < 1e-10) u1 = 1e-10;
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    negScores.push(negMean + z1 * std);
    posScores.push(posMean + z2 * std);
  }
  return { negScores, posScores };
}

/* -------------------------------------------------------------------------- */
/* ROC 计算                                                                    */
/* -------------------------------------------------------------------------- */
function computeROC(negScores: number[], posScores: number[], numPoints: number) {
  const allScores = [...negScores, ...posScores];
  const min = Math.min(...allScores) - 0.5;
  const max = Math.max(...allScores) + 0.5;
  const points: { tpr: number; fpr: number; threshold: number }[] = [];
  const Nneg = negScores.length;
  const Npos = posScores.length;
  for (let i = 0; i <= numPoints; i++) {
    const thresh = max - (max - min) * (i / numPoints);
    let tp = 0, fp = 0;
    for (const s of posScores) if (s >= thresh) tp++;
    for (const s of negScores) if (s >= thresh) fp++;
    points.push({ tpr: tp / Npos, fpr: fp / Nneg, threshold: thresh });
  }
  // Add (0,0) and (1,1)
  return points;
}

function computeAUC(roc: { tpr: number; fpr: number }[]) {
  let auc = 0;
  for (let i = 1; i < roc.length; i++) {
    auc += (roc[i].fpr - roc[i - 1].fpr) * (roc[i].tpr + roc[i - 1].tpr) / 2;
  }
  return auc;
}

/* -------------------------------------------------------------------------- */
/* 组件                                                                       */
/* -------------------------------------------------------------------------- */
const W = 420, H = 360, M = { t: 15, r: 15, b: 45, l: 55 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;

export default function ROCInteractiveDemo() {
  const [overlap, setOverlap] = useState(0.6);
  const [thresholdIdx, setThresholdIdx] = useState(30); // 0-60
  const [seed, setSeed] = useState(42);
  const numPoints = 60;

  const data = useMemo(() => genScores(200, seed, overlap), [seed, overlap]);
  const roc = useMemo(() => computeROC(data.negScores, data.posScores, numPoints), [data]);
  const auc = useMemo(() => computeAUC(roc), [roc]);
  const current = roc[Math.min(thresholdIdx, roc.length - 1)];

  const tp = data.posScores.filter((s) => s >= current.threshold).length;
  const fp = data.negScores.filter((s) => s >= current.threshold).length;
  const tn = data.negScores.length - fp;
  const fn = data.posScores.length - tp;

  const toX = (v: number) => M.l + v * PW;
  const toY = (v: number) => M.t + PH - v * PH;

  // Histogram data
  const histBins = useMemo(() => {
    const all = [...data.negScores, ...data.posScores];
    const min = Math.min(...all) - 0.5;
    const max = Math.max(...all) + 0.5;
    const bins = 40;
    const binW = (max - min) / bins;
    const negHist = Array(bins).fill(0);
    const posHist = Array(bins).fill(0);
    for (const s of data.negScores) { const i = Math.min(bins - 1, Math.floor((s - min) / binW)); negHist[i]++; }
    for (const s of data.posScores) { const i = Math.min(bins - 1, Math.floor((s - min) / binW)); posHist[i]++; }
    const maxH = Math.max(...negHist, ...posHist);
    return { bins, min, max, negHist, posHist, maxH };
  }, [data]);

  return (
    <InteractiveDemo title="交互式 ROC 曲线：理解阈值如何影响分类">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          调节下方滑块观察：<strong>分类器输出分布重叠程度</strong>（左图）
          和 <strong>决策阈值</strong> 如何影响真正例率 TPR 和假正例率 FPR（右图 ROC 曲线）。
          ROC 曲线下面积 AUC 衡量分类器的整体排序能力。
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>分布重叠度</span>
              <span>{overlap.toFixed(1)}</span>
            </div>
            <Slider value={[overlap]} min={0} max={1} step={0.05} onValueChange={(v) => setOverlap(v[0])} />
            <p className="text-xs text-gray-500 mt-0.5">
              {overlap < 0.3 ? '分布几乎完全分离 → AUC ≈ 1.0' : overlap > 0.7 ? '分布高度重叠 → AUC 接近 0.5' : '中等重叠 → AUC 在 0.7-0.9 之间'}
            </p>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>决策阈值</span>
              <span className="font-mono">{current.threshold.toFixed(2)}</span>
            </div>
            <Slider value={[thresholdIdx]} min={0} max={numPoints} step={1} onValueChange={(v) => setThresholdIdx(v[0])} />
            <p className="text-xs text-gray-500 mt-0.5">
              阈值↑ → 更保守（低 FPR，低 TPR）；阈值↓ → 更激进（高 TPR，高 FPR）
            </p>
          </div>
        </div>

        <button onClick={() => setSeed(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
          🔄 重新采样
        </button>

        {/* Plots */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Distribution histogram */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 360 }}>
              {/* Threshold line */}
              <line x1={toX((current.threshold - histBins.min) / (histBins.max - histBins.min))} y1={M.t}
                x2={toX((current.threshold - histBins.min) / (histBins.max - histBins.min))} y2={H - M.b}
                stroke="#1f2937" strokeWidth={2} strokeDasharray="4,2" />
              <text x={toX((current.threshold - histBins.min) / (histBins.max - histBins.min))} y={M.t + 12} textAnchor="middle" className="text-[9px]" fill="#1f2937">阈值</text>
              {/* Negative bars */}
              {histBins.negHist.map((v, i) => {
                const x0 = toX(i / histBins.bins);
                const barW = PW / histBins.bins;
                const barH = (v / histBins.maxH) * PH;
                return <rect key={`neg-${i}`} x={x0} y={toY(barH / PH)} width={barW} height={barH} fill="#3b82f6" opacity={0.5} />;
              })}
              {/* Positive bars */}
              {histBins.posHist.map((v, i) => {
                const x0 = toX(i / histBins.bins);
                const barW = PW / histBins.bins;
                const barH = (v / histBins.maxH) * PH;
                return <rect key={`pos-${i}`} x={x0} y={toY(barH / PH)} width={barW} height={barH} fill="#ef4444" opacity={0.5} />;
              })}
              <rect x={M.l} y={M.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
            <div className="flex justify-center gap-3 pb-1 text-xs text-gray-500">
              <span><span className="inline-block w-2 h-2 rounded-sm bg-blue-400 mr-1" />负类分数</span>
              <span><span className="inline-block w-2 h-2 rounded-sm bg-red-400 mr-1" />正类分数</span>
            </div>
          </div>

          {/* ROC curve */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 360 }}>
              {/* Diagonal (random classifier) */}
              <line x1={M.l} y1={H - M.b} x2={W - M.r} y2={M.t} stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4,3" />
              <text x={W / 2} y={H / 2 + 4} textAnchor="middle" className="text-[9px]" fill="#9ca3af">随机分类器 AUC=0.5</text>
              {/* ROC curve */}
              <polyline
                points={roc.map((p) => `${toX(p.fpr)},${toY(p.tpr)}`).join(' ')}
                fill="none" stroke="#8b5cf6" strokeWidth={2.5}
              />
              {/* Current point */}
              <circle cx={toX(current.fpr)} cy={toY(current.tpr)} r={5} fill="#1f2937" />
              {/* Fill AUC */}
              <polygon
                points={`${toX(0)},${toY(0)} ${roc.map((p) => `${toX(p.fpr)},${toY(p.tpr)}`).join(' ')} ${toX(1)},${toY(0)}`}
                fill="rgba(139,92,246,0.1)"
              />
              {/* Axes labels */}
              <text x={M.l + PW / 2} y={H - 8} textAnchor="middle" className="text-[10px]" fill="#6b7280">FPR（假正例率）</text>
              <text x={10} y={M.t + PH / 2} textAnchor="middle" className="text-[10px]" fill="#6b7280" transform={`rotate(-90,10,${M.t + PH / 2})`}>TPR（真正例率）</text>
              {/* Grid */}
              {[0.2, 0.4, 0.6, 0.8].map((v) => (
                <g key={`grid-${v}`}>
                  <line x1={toX(v)} y1={M.t} x2={toX(v)} y2={H - M.b} stroke="#f3f4f6" strokeWidth={0.5} />
                  <line x1={M.l} y1={toY(v)} x2={W - M.r} y2={toY(v)} stroke="#f3f4f6" strokeWidth={0.5} />
                </g>
              ))}
              <rect x={M.l} y={M.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
            <div className="text-center pb-1 text-sm font-bold text-purple-700">AUC = {auc.toFixed(3)}</div>
          </div>
        </div>

        {/* Confusion matrix + metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          {[
            { label: 'TP（命中）', value: tp, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'FP（误报）', value: fp, color: 'text-red-700', bg: 'bg-red-50' },
            { label: 'FN（漏报）', value: fn, color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'TN（正确拒）', value: tn, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: '当前阈值', value: current.threshold.toFixed(2), color: 'text-gray-700', bg: 'bg-gray-50' },
          ].map((m) => (
            <div key={m.label} className={`rounded-lg p-2 ${m.bg}`}>
              <div className="text-xs text-gray-600">{m.label}</div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="text-sm text-gray-700 space-y-2 bg-slate-50 p-4 rounded-lg border">
          <p><strong>🎯 核心洞察：</strong></p>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong>降低阈值</strong>（左移竖线）：更多样本被判为正 → TPR↑ 同时 FPR↑ → ROC 点沿曲线向右上方移动</li>
            <li><strong>升高阈值</strong>（右移竖线）：更保守 → TPR↓ FPR↓ → ROC 点沿曲线向左下方移动</li>
            <li><strong>分布式重叠度越小</strong>，ROC 曲线越贴近左上角，AUC 越大</li>
            <li><strong>AUC = 1.0</strong>：存在某个阈值完美分离两类；<strong>AUC = 0.5</strong>：分类器等同于随机猜测</li>
            <li>AUC 衡量的不是某一个阈值的好坏，而是分类器在所有可能阈值下的<strong>平均排序能力</strong></li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
