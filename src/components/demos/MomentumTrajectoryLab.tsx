import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  momentumTrajectory,
  finiteTimeVelocity,
  steadyStateFactor,
  constantGradient,
  alternatingGradient,
  noisyGradient,
  narrowValleyGradients,
  type MomentumConvention,
} from '@/lib/math/momentum';

type PresetKey = 'constant' | 'alternating' | 'noisy' | 'narrow';

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'constant', label: '恒定梯度' },
  { key: 'alternating', label: '交替梯度' },
  { key: 'noisy', label: '带噪梯度' },
  { key: 'narrow', label: '窄谷梯度' },
];

const W = 480;
const H = 160;
const MG = { t: 10, r: 12, b: 30, l: 48 };
const PW = W - MG.l - MG.r;
const PH = H - MG.t - MG.b;

function buildPath(data: number[]): string {
  const n = data.length;
  if (n === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(max - min, 1e-6);
  return data
    .map((y, i) => {
      const x = MG.l + (i / (n - 1)) * PW;
      const yy = MG.t + PH - ((y - min) / range) * PH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${yy}`;
    })
    .join(' ');
}

function axisTicks(min: number, max: number): number[] {
  const range = max - min;
  if (range === 0) return [min];
  const step = Math.pow(10, Math.round(Math.log10(range)) - 1);
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step; v += step) {
    ticks.push(v);
  }
  return ticks;
}

export default function MomentumTrajectoryLab() {
  const [preset, setPreset] = useState<PresetKey>('constant');
  const [mu, setMu] = useState(0.9);
  const [eta, setEta] = useState(0.1);
  const [steps, setSteps] = useState(60);
  const [convention, setConvention] = useState<MomentumConvention>('classical');
  const [seed, setSeed] = useState(1);

  const gradients = useMemo<number[]>(() => {
    switch (preset) {
      case 'constant':
        return constantGradient(1, steps);
      case 'alternating':
        return alternatingGradient(1, steps);
      case 'noisy':
        return noisyGradient(1, steps, seed);
      case 'narrow':
        return narrowValleyGradients(steps);
      default:
        return constantGradient(1, steps);
    }
  }, [preset, steps, seed]);

  const { w, v } = useMemo(
    () => momentumTrajectory(gradients, mu, eta, convention),
    [gradients, mu, eta, convention],
  );

  const effectiveV = useMemo(
    () =>
      Array.from({ length: gradients.length + 1 }, (_, t) =>
        t === 0 ? 0 : finiteTimeVelocity(gradients, mu, eta, t, convention),
      ),
    [gradients, mu, eta, convention],
  );

  const factor = steadyStateFactor(mu, convention);
  const steadyVelocity = -eta * 1 * factor;

  const wPath = buildPath(w);
  const vPath = buildPath(v);
  const wTicks = axisTicks(Math.min(...w), Math.max(...w));
  const vTicks = axisTicks(Math.min(...v), Math.max(...v));

  const tableRows = Math.min(steps, 8);

  return (
    <InteractiveDemo title="动量轨迹实验：恒定梯度稳态放大">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          经典动量 v<sub>t+1</sub> = μ v<sub>t</sub> + g<sub>t</sub>{' '}
          在恒定梯度下会把有效步长放大 1/(1−μ) 倍；EMA 动量使用 (1−μ) 加权，稳态放大倍数为 1。
          切换下方预设观察不同梯度序列的轨迹。
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={preset}
            onValueChange={(value) => setPreset(value as PresetKey)}
          >
            <SelectTrigger className="w-36 text-xs">
              <SelectValue placeholder="选择梯度序列" />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((p) => (
                <SelectItem key={p.key} value={p.key} className="text-xs">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {preset === 'noisy' && (
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="px-2 py-1 text-[10px] bg-slate-700 text-white rounded hover:bg-slate-800"
            >
              重新采样噪声
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Switch
              id="convention-switch"
              checked={convention === 'ema'}
              onCheckedChange={(checked) =>
                setConvention(checked ? 'ema' : 'classical')
              }
            />
            <label
              htmlFor="convention-switch"
              className="text-xs text-gray-700 cursor-pointer"
            >
              {convention === 'classical' ? '经典动量' : 'EMA 动量'}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: '动量系数 μ',
              val: mu,
              set: setMu,
              min: 0,
              max: 0.999,
              step: 0.01,
              fmt: (x: number) => x.toFixed(2),
            },
            {
              label: '学习率 η',
              val: eta,
              set: setEta,
              min: 0.001,
              max: 0.5,
              step: 0.001,
              fmt: (x: number) => x.toFixed(3),
            },
            {
              label: '迭代步数 T',
              val: steps,
              set: (v: number) => setSteps(Math.round(v)),
              min: 10,
              max: 200,
              step: 1,
              fmt: (x: number) => Math.round(x).toString(),
            },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                {c.label}
                <span className="font-mono">{c.fmt(c.val)}</span>
              </div>
              <Slider
                value={[c.val]}
                min={c.min}
                max={c.max}
                step={c.step}
                onValueChange={(v) => c.set(v[0])}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">
              位置 w<sub>t</sub>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
              <polyline d={wPath} fill="none" stroke="#3b82f6" strokeWidth={2} />
              {wTicks.map((t) => {
                const y =
                  MG.t +
                  PH -
                  ((t - Math.min(...w)) / Math.max(Math.max(...w) - Math.min(...w), 1e-6)) * PH;
                return (
                  <g key={t}>
                    <line
                      x1={MG.l}
                      y1={y}
                      x2={MG.l + PW}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                    />
                    <text x={MG.l - 6} y={y + 3} textAnchor="end" className="text-[8px]" fill="#6b7280">
                      {t.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              <rect x={MG.l} y={MG.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
          </div>

          <div className="bg-white rounded-lg border p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">
              内部速度 v<sub>t</sub>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
              <polyline d={vPath} fill="none" stroke="#f59e0b" strokeWidth={2} />
              {vTicks.map((t) => {
                const y =
                  MG.t +
                  PH -
                  ((t - Math.min(...v)) / Math.max(Math.max(...v) - Math.min(...v), 1e-6)) * PH;
                return (
                  <g key={t}>
                    <line
                      x1={MG.l}
                      y1={y}
                      x2={MG.l + PW}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                    />
                    <text x={MG.l - 6} y={y + 3} textAnchor="end" className="text-[8px]" fill="#6b7280">
                      {t.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              <rect x={MG.l} y={MG.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs space-y-2">
          <div className="font-medium text-indigo-800">稳态分析（恒定梯度 g = 1）</div>
          <div className="flex flex-wrap gap-4">
            <div>
              放大因子：{' '}
              <span className="font-mono font-bold">{factor.toFixed(3)}</span>
            </div>
            <div>
              预测稳态步长 Δw = −ηg·因子：{' '}
              <span className="font-mono font-bold">{steadyVelocity.toFixed(4)}</span>
            </div>
            <div>
              实际末段平均步长：{' '}
              <span className="font-mono font-bold">
                {(
                  (w[w.length - 1] - w[w.length - 6]) / 5
                ).toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-3">
          <div className="text-xs font-medium text-gray-600 mb-2">
            有限时间求和公式
          </div>
          <p className="text-[10px] text-gray-600 mb-2">
            Δw<sub>t</sub> = −η Σ<sub>j=0</sub>
            <sup>t−1</sup> μ<sup>j</sup>
            {convention === 'ema' ? ' (1−μ) ' : ' '}
            g<sub>t−1−j</sub>
          </p>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-1">t</th>
                <th className="pb-1">g<sub>t−1</sub></th>
                <th className="pb-1">v<sub>t</sub></th>
                <th className="pb-1">Δw<sub>t</sub></th>
                <th className="pb-1">w<sub>t</sub></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: tableRows }, (_, i) => i + 1).map((t) => (
                <tr key={t} className="border-b last:border-0">
                  <td className="py-1 font-mono">{t}</td>
                  <td className="py-1 font-mono">{gradients[t - 1].toFixed(3)}</td>
                  <td className="py-1 font-mono">{v[t].toFixed(4)}</td>
                  <td className="py-1 font-mono">{effectiveV[t].toFixed(4)}</td>
                  <td className="py-1 font-mono">{w[t].toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-[10px] text-gray-400">
          提示：经典动量把历史梯度简单相加，稳态下相当于把梯度放大 1/(1−μ) 倍；EMA 动量通过
          (1−μ) 归一化，稳态下不再额外放大。表格前 {tableRows} 步展示了每一步的有限时间求和结果。
        </div>
      </div>
    </InteractiveDemo>
  );
}
