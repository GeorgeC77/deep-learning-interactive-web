import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';

type Vec = [number, number];

const APPLE: Vec = [0.5, 0.5];
const START: Vec = [0.88, 0.12];
const NEAR: Vec = [0.6, 0.56]; // where a similar word ends up
const FAR: Vec = [0.08, 0.9]; // where a dissimilar word ends up

function lerp(a: Vec, b: Vec, t: number): Vec {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
function sub(a: Vec, b: Vec): Vec {
  return [a[0] - b[0], a[1] - b[1]];
}
function norm(v: Vec): number {
  return Math.hypot(v[0], v[1]);
}
function dot(a: Vec, b: Vec): number {
  return a[0] * b[0] + a[1] * b[1];
}
function cosine(a: Vec, b: Vec): number {
  const na = norm(a);
  const nb = norm(b);
  return na === 0 || nb === 0 ? 0 : dot(a, b) / (na * nb);
}
function dist(a: Vec, b: Vec): number {
  return norm(sub(a, b));
}

const PAIRS = {
  similar: { other: 'Orange', end: NEAR, blurb: '语义相近：训练中距离越来越近，余弦相似度上升。' },
  dissimilar: { other: 'Car', end: FAR, blurb: '语义无关：训练中距离越来越远，余弦相似度下降。' },
} as const;

type PairKey = keyof typeof PAIRS;

export default function EmbeddingGeometryLab() {
  const [pair, setPair] = useState<PairKey>('similar');
  const [step, setStep] = useState(60); // 0..100 training progress
  const t = step / 100;

  const cfg = PAIRS[pair];
  const otherPos = lerp(START, cfg.end, t);

  const metrics = useMemo(() => {
    return {
      cosine: cosine(APPLE, otherPos),
      euclidean: dist(APPLE, otherPos),
      dot: dot(APPLE, otherPos),
    };
  }, [otherPos]);

  // Cosine-similarity trajectory across training for both pairs.
  const trajectory = useMemo(() => {
    const steps = Array.from({ length: 21 }, (_, i) => i / 20);
    const sim = steps.map((p) => cosine(APPLE, lerp(START, NEAR, p)));
    const dis = steps.map((p) => cosine(APPLE, lerp(START, FAR, p)));
    return { steps, sim, dis };
  }, []);

  const W = 300;
  const H = 240;
  const pad = 24;
  const xOf = (v: number) => pad + v * (W - 2 * pad);
  const yOf = (v: number) => H - pad - v * (H - 2 * pad);

  const TW = 560;
  const TH = 160;
  const tx = (i: number) => 30 + (i / 20) * (TW - 60);
  const ty = (v: number) => TH - 24 - ((v + 0.2) / 1.2) * (TH - 48);
  const trajPath = (vals: number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');

  return (
    <InteractiveDemo title="Embedding 是几何空间，不是编号">
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          词嵌入把每个词放进一个几何空间。训练让“语义相近的词靠得更近，无关的词离得更远”。
          拖动训练步数，观察 Apple 与另一个词的距离如何演化。
        </p>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(PAIRS) as PairKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setPair(k)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${pair === k ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Apple ↔ {PAIRS[k].other}
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">训练步数</label>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{step}%</span>
          </div>
          <Slider value={[step]} min={0} max={100} step={5} onValueChange={(v) => setStep(v[0])} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">Embedding 空间</div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-slate-50 rounded-md">
              {/* apple */}
              <circle cx={xOf(APPLE[0])} cy={yOf(APPLE[1])} r="8" fill="#ef4444" />
              <text x={xOf(APPLE[0])} y={yOf(APPLE[1]) - 12} fontSize="11" fill="#b91c1c" textAnchor="middle" fontWeight="bold">Apple</text>
              {/* other word */}
              <circle cx={xOf(otherPos[0])} cy={yOf(otherPos[1])} r="8" fill="#3b82f6" />
              <text x={xOf(otherPos[0])} y={yOf(otherPos[1]) - 12} fontSize="11" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">{cfg.other}</text>
              {/* distance line */}
              <line x1={xOf(APPLE[0])} y1={yOf(APPLE[1])} x2={xOf(otherPos[0])} y2={yOf(otherPos[1])} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
            <p className="text-xs text-gray-500 mt-2">{cfg.blurb}</p>
          </div>

          <div className="space-y-2">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500">Cosine Similarity</div>
              <div className="font-mono text-xl font-bold text-indigo-700">{metrics.cosine.toFixed(3)}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500">Euclidean Distance</div>
              <div className="font-mono text-xl font-bold text-emerald-700">{metrics.euclidean.toFixed(3)}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500">Dot Product</div>
              <div className="font-mono text-xl font-bold text-amber-700">{metrics.dot.toFixed(3)}</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-500 mb-2">训练中余弦相似度的变化</div>
          <svg viewBox={`0 0 ${TW} ${TH}`} className="w-full">
            <line x1="30" y1={TH - 24} x2={TW - 30} y2={TH - 24} stroke="#cbd5e1" />
            <path d={trajPath(trajectory.sim)} fill="none" stroke="#10b981" strokeWidth="2.5" />
            <path d={trajPath(trajectory.dis)} fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <text x={TW - 150} y={ty(trajectory.sim[20]) - 6} fontSize="10" fill="#10b981">Apple ↔ Orange</text>
            <text x={TW - 150} y={ty(trajectory.dis[20]) + 14} fontSize="10" fill="#ef4444">Apple ↔ Car</text>
            <text x={TW / 2} y={TH - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">训练步数 →</text>
          </svg>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <strong>直觉：</strong>Embedding 是<strong>几何空间</strong>，而不是编号——距离近表示在当前任务中
          <strong>相似</strong>，而不是字典顺序相邻。
        </div>
      </div>
    </InteractiveDemo>
  );
}
