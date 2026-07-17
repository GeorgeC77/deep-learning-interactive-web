import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';

const DIMS = [8, 16, 32, 64, 128, 256, 512, 1024];
const SAMPLES = 2000;

function makeLcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function makeNormal(rand: () => number) {
  return () => {
    let u = 0;
    while (u === 0) u = rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

type Stat = { mean: number; variance: number; std: number };

function summarize(arr: number[]): Stat {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return { mean, variance, std: Math.sqrt(variance) };
}

function StatRow({ label, stat, highlight }: { label: string; stat: Stat; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-emerald-50' : ''}>
      <td className="px-2 py-1.5 text-left font-medium text-gray-700 border border-gray-200">{label}</td>
      <td className="px-2 py-1.5 font-mono text-right border border-gray-200">{stat.mean.toFixed(3)}</td>
      <td className="px-2 py-1.5 font-mono text-right border border-gray-200">{stat.variance.toFixed(3)}</td>
      <td className="px-2 py-1.5 font-mono text-right border border-gray-200">{stat.std.toFixed(3)}</td>
    </tr>
  );
}

export default function AttentionScalingLab() {
  const [dimIdx, setDimIdx] = useState(4); // default d = 128
  const d = DIMS[dimIdx];

  const stats = useMemo(() => {
    const rand = makeLcg(20240601);
    const normal = makeNormal(rand);
    const dots: number[] = [];
    const scaled: number[] = [];
    const invD: number[] = [];
    for (let s = 0; s < SAMPLES; s++) {
      let dot = 0;
      for (let i = 0; i < d; i++) {
        dot += normal() * normal();
      }
      dots.push(dot);
      scaled.push(dot / Math.sqrt(d));
      invD.push(dot / d);
    }
    return {
      dot: summarize(dots),
      scaled: summarize(scaled),
      invD: summarize(invD),
    };
  }, [d]);

  return (
    <InteractiveDemo title="为什么要除以 √d？">
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          随机生成 <span className="font-mono">q, k ~ N(0, 1)</span>，统计点积
          <span className="font-mono"> q·k </span>的分布。拖动维度，观察方差如何随 d 增长。
        </p>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Embedding Dimension</label>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">d = {d}</span>
          </div>
          <Slider value={[dimIdx]} min={0} max={DIMS.length - 1} step={1} onValueChange={(v) => setDimIdx(v[0])} />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            {DIMS.map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-1.5 text-left border border-gray-200">统计量</th>
              <th className="px-2 py-1.5 text-right border border-gray-200">Mean</th>
              <th className="px-2 py-1.5 text-right border border-gray-200">Variance</th>
              <th className="px-2 py-1.5 text-right border border-gray-200">Std</th>
            </tr>
          </thead>
          <tbody>
            <StatRow label="q·k（未缩放）" stat={stats.dot} />
            <StatRow label="q·k / √d（缩放）" stat={stats.scaled} highlight />
            <StatRow label="q·k / d（除太多）" stat={stats.invD} />
          </tbody>
        </table>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
          缩放到 <span className="font-mono">q·k / √d</span> 后，方差稳定在 ≈ 1（Std ≈ 1），softmax 温度保持稳定。
          若改成 <span className="font-mono">q·k / d</span>，方差变成 ≈ 1/d，softmax 会过于平缓。
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <strong>解释：</strong>由于 <span className="font-mono">Var(q·k) = d</span>，所以
          <span className="font-mono"> Std ≈ √d</span>。因此除以 √d，保持 softmax 温度稳定。
        </div>
      </div>
    </InteractiveDemo>
  );
}
