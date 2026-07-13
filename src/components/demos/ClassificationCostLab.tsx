import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  riskPositive,
  riskNegative,
  optimalThreshold,
  logOddsThreshold,
  optimalAction,
} from '@/lib/math/classificationCost';

/* -------------------------------------------------------------------------- */
/* Plotting constants                                                          */
/* -------------------------------------------------------------------------- */
const W = 480;
const H = 280;
const M = { t: 20, r: 20, b: 50, l: 60 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

const P_MIN = 0;
const P_MAX = 1;

/* -------------------------------------------------------------------------- */
/* SVG helpers                                                                 */
/* -------------------------------------------------------------------------- */
function toX(p: number): number {
  return M.l + ((p - P_MIN) / (P_MAX - P_MIN)) * PW;
}

function toY(risk: number, maxRisk: number): number {
  return M.t + PH - (risk / maxRisk) * PH;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */
export default function ClassificationCostLab() {
  const [p, setP] = useState(0.65);
  const [cFP, setCFP] = useState(2.0);
  const [cFN, setCFN] = useState(1.0);

  const rPos = useMemo(() => riskPositive(p, cFP, cFN), [p, cFP, cFN]);
  const rNeg = useMemo(() => riskNegative(p, cFP, cFN), [p, cFP, cFN]);
  const threshold = useMemo(() => optimalThreshold(cFP, cFN), [cFP, cFN]);
  const logOdds = useMemo(() => logOddsThreshold(cFP, cFN), [cFP, cFN]);
  const action = useMemo(() => optimalAction(p, cFP, cFN), [p, cFP, cFN]);

  const plotData = useMemo(() => {
    const steps = 200;
    const posPts: string[] = [];
    const negPts: string[] = [];
    let maxRisk = 0;

    for (let i = 0; i <= steps; i++) {
      const pi = P_MIN + ((P_MAX - P_MIN) * i) / steps;
      const rp = riskPositive(pi, cFP, cFN);
      const rn = riskNegative(pi, cFP, cFN);
      posPts.push(`${toX(pi)},${toY(rp, 1)}`);
      negPts.push(`${toX(pi)},${toY(rn, 1)}`);
      maxRisk = Math.max(maxRisk, rp, rn);
    }

    return {
      posPts: posPts.join(' '),
      negPts: negPts.join(' '),
      maxRisk,
    };
  }, [cFP, cFN]);

  const currentYPos = toY(rPos, plotData.maxRisk || 1);
  const currentYNeg = toY(rNeg, plotData.maxRisk || 1);

  return (
    <InteractiveDemo title="分类代价敏感决策">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          给定后验概率 <KaTeX math="p = P(y=1|\mathbf{x})" />，选择预测{' '}
          <KaTeX math="\hat y" /> 的期望风险为
          <KaTeX math="R(\text{positive}) = c_{\text{FP}}(1-p)" /> 与
          <KaTeX math="R(\text{negative}) = c_{\text{FN}}p" />。调节代价观察最优决策何时翻转。
        </p>

        {/* Controls */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>
                后验概率 <KaTeX math="p" />
              </span>
              <span className="font-mono">{p.toFixed(2)}</span>
            </div>
            <Slider
              value={[p]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(v) => setP(v[0])}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>
                假正例代价 <KaTeX math="c_{\text{FP}}" />
              </span>
              <span className="font-mono">{cFP.toFixed(2)}</span>
            </div>
            <Slider
              value={[cFP]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={(v) => setCFP(v[0])}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>
                假反例代价 <KaTeX math="c_{\text{FN}}" />
              </span>
              <span className="font-mono">{cFN.toFixed(2)}</span>
            </div>
            <Slider
              value={[cFN]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={(v) => setCFN(v[0])}
            />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          {[
            {
              label: 'R(positive)',
              value: rPos.toFixed(3),
              color: 'text-blue-700',
              bg: 'bg-blue-50',
            },
            {
              label: 'R(negative)',
              value: rNeg.toFixed(3),
              color: 'text-rose-700',
              bg: 'bg-rose-50',
            },
            {
              label: '阈值 p*',
              value: threshold.toFixed(3),
              color: 'text-indigo-700',
              bg: 'bg-indigo-50',
            },
            {
              label: '对数几率阈值',
              value: Number.isFinite(logOdds)
                ? logOdds.toFixed(3)
                : '∞',
              color: 'text-amber-700',
              bg: 'bg-amber-50',
            },
            {
              label: '最优决策',
              value: action === 'positive' ? '正类' : '负类',
              color: action === 'positive' ? 'text-emerald-700' : 'text-gray-700',
              bg: action === 'positive' ? 'bg-emerald-50' : 'bg-gray-50',
            },
          ].map((m) => (
            <div key={m.label} className={`rounded-lg p-2 ${m.bg}`}>
              <div className="text-xs text-gray-600">{m.label}</div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Risk plot */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 280 }}>
            {/* R(positive) line */}
            <polyline
              points={plotData.posPts}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            {/* R(negative) line */}
            <polyline
              points={plotData.negPts}
              fill="none"
              stroke="#f43f5e"
              strokeWidth={2}
            />
            {/* Threshold line */}
            <line
              x1={toX(threshold)}
              y1={M.t}
              x2={toX(threshold)}
              y2={H - M.b}
              stroke="#1f2937"
              strokeWidth={2}
              strokeDasharray="4,2"
            />
            <text
              x={toX(threshold)}
              y={M.t + 14}
              textAnchor="middle"
              className="text-[9px]"
              fill="#1f2937"
            >
              p*
            </text>
            {/* Current p marker */}
            <line
              x1={toX(p)}
              y1={M.t}
              x2={toX(p)}
              y2={H - M.b}
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="3,3"
            />
            <circle cx={toX(p)} cy={currentYPos} r={5} fill="#3b82f6" />
            <circle cx={toX(p)} cy={currentYNeg} r={5} fill="#f43f5e" />
            {/* Axes */}
            <line
              x1={M.l}
              y1={H - M.b}
              x2={W - M.r}
              y2={H - M.b}
              stroke="#9ca3af"
              strokeWidth={1}
            />
            <line
              x1={M.l}
              y1={M.t}
              x2={M.l}
              y2={H - M.b}
              stroke="#9ca3af"
              strokeWidth={1}
            />
            <text
              x={M.l + PW / 2}
              y={H - 10}
              textAnchor="middle"
              className="text-[10px]"
              fill="#6b7280"
            >
              后验概率 p
            </text>
            <text
              x={14}
              y={M.t + PH / 2}
              textAnchor="middle"
              className="text-[10px]"
              fill="#6b7280"
              transform={`rotate(-90,14,${M.t + PH / 2})`}
            >
              期望风险
            </text>
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
          <div className="flex justify-center gap-4 pb-2 text-xs text-gray-500">
            <span>
              <span className="inline-block w-3 h-[2px] bg-blue-500 mr-1 align-middle" />
              R(positive)
            </span>
            <span>
              <span className="inline-block w-3 h-[2px] bg-rose-500 mr-1 align-middle" />
              R(negative)
            </span>
            <span>
              <span className="inline-block w-3 h-[2px] bg-gray-800 mr-1 align-middle" />
              阈值 p*
            </span>
            <span>
              <span className="inline-block w-3 h-[2px] bg-emerald-500 mr-1 align-middle" />
              当前 p
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="text-sm text-gray-700 space-y-2 bg-slate-50 p-4 rounded-lg border">
          <p>
            <strong>🎯 核心洞察：</strong>
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              当 <KaTeX math="p > p^* = c_{\text{FP}} / (c_{\text{FP}} + c_{\text{FN}})" /> 时，
              预测正类风险更小；否则预测负类
            </li>
            <li>
              提高 <KaTeX math="c_{\text{FN}}" />（漏检代价）会降低阈值 p*，模型更倾向于报正类
            </li>
            <li>
              提高 <KaTeX math="c_{\text{FP}}" />（误报代价）会提高阈值 p*，模型更保守
            </li>
            <li>
              对数几率阈值 <KaTeX math="\ln(c_{\text{FP}}/c_{\text{FN}})" /> 对应逻辑回归决策边界
            </li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}
