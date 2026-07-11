import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function MaskedAutoencoderDemo() {
  const GRID = 6;
  const [maskRatio, setMaskRatio] = useState(0.8);
  const [seed, setSeed] = useState(0);

  // Generate a deterministic pseudo-random grid based on seed.
  const original = useMemo(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: GRID * GRID }, () => rng());
  }, [seed]);

  const mask = useMemo(
    () => generateMask(original.length, maskRatio, seed + 100),
    [original.length, maskRatio, seed],
  );

  const visibleValues = original.filter((_, i) => !mask[i]);
  const mean = visibleValues.length > 0
    ? visibleValues.reduce((a, b) => a + b, 0) / visibleValues.length
    : 0.5;

  const reconstruction = original.map((v, i) => (mask[i] ? mean : v));

  const mse = original.reduce((sum, v, i) => sum + (v - reconstruction[i]) ** 2, 0) / original.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">遮罩比例：{Math.round(maskRatio * 100)}%</label>
          <Slider
            value={[maskRatio]}
            min={0}
            max={0.9}
            step={0.05}
            onValueChange={([v]) => setMaskRatio(v)}
            className="mt-2"
          />
        </div>
        <Button variant="outline" onClick={() => setSeed((s) => s + 1)}>
          重新随机遮罩 / 换图
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">原图（patch 值）</p>
          <PatchGrid values={original} mask={mask} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">MAE 输入（灰色为遮罩）</p>
          <PatchGrid values={original} mask={mask} showMasked />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">简单重建（用可见 patch 均值填充遮罩）</p>
        <PatchGrid values={reconstruction} mask={Array(original.length).fill(false)} />
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900 space-y-1">
        <p>
          <span className="font-medium">可见 patch 数：</span>
          {visibleValues.length} / {original.length}
        </p>
        <p>
          <span className="font-medium">重建 MSE：</span>
          {mse.toFixed(4)}
        </p>
        <p className="text-blue-700">
          MAE 的训练流程：encoder 只处理可见 patch（本例中高遮罩比例 80%），decoder 接收隐表示并重建全部 patch。预训练结束后通常丢弃 decoder，保留 encoder 用于下游任务。
        </p>
      </div>
    </div>
  );
}

function PatchGrid({
  values,
  mask,
  showMasked,
}: {
  values: number[];
  mask: boolean[];
  showMasked?: boolean;
}) {
  return (
    <div
      className="grid gap-1 border border-gray-200 p-2 rounded-lg inline-grid"
      style={{ gridTemplateColumns: `repeat(6, 1fr)` }}
    >
      {values.map((v, i) => {
        const color = showMasked && mask[i] ? 'rgb(209,213,219)' : valueToColor(v);
        return (
          <div
            key={i}
            className="w-8 h-8 rounded-sm"
            style={{ backgroundColor: color }}
            title={showMasked && mask[i] ? 'masked' : v.toFixed(2)}
          />
        );
      })}
    </div>
  );
}

function valueToColor(v: number) {
  const t = Math.max(0, Math.min(1, v));
  const r = Math.round(255 * (1 - t));
  const b = Math.round(255 * t);
  return `rgb(${r}, 180, ${b})`;
}

function generateMask(n: number, ratio: number, seed: number) {
  const rng = mulberry32(seed);
  const order = Array.from({ length: n }, (_, i) => i).sort(() => rng() - 0.5);
  const mask = Array(n).fill(false);
  const k = Math.min(n - 1, Math.max(0, Math.floor(n * ratio)));
  for (let i = 0; i < k; i++) mask[order[i]] = true;
  return mask;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
