import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  generateImage,
  generateMask,
  globalMeanBaseline,
  localNeighborBaseline,
  toyEncoderDecoder,
  maskedMSE,
  allPatchMSE,
  type ImageType,
} from '@/lib/math/mae';

const GRID = 6;
const IMAGE_TYPES: { value: ImageType; label: string }[] = [
  { value: 'stripes', label: '条纹 (stripes)' },
  { value: 'circle', label: '圆形 (circle)' },
  { value: 'digit', label: '十字 (digit)' },
  { value: 'gradient', label: '渐变 (gradient)' },
];

export default function MaskedAutoencoderDemo() {
  const [imageType, setImageType] = useState<ImageType>('stripes');
  const [maskRatio, setMaskRatio] = useState(0.75);
  const [imageSeed, setImageSeed] = useState(0);
  const [maskSeed, setMaskSeed] = useState(0);

  const original = useMemo(
    () => generateImage(GRID, imageType, imageSeed),
    [imageType, imageSeed],
  );

  const mask = useMemo(
    () => generateMask(original.length, maskRatio, maskSeed),
    [original.length, maskRatio, maskSeed],
  );

  const globalMean = useMemo(
    () => globalMeanBaseline(original, mask),
    [original, mask],
  );
  const localNeighbor = useMemo(
    () => localNeighborBaseline(original, mask, GRID),
    [original, mask],
  );
  const toy = useMemo(
    () => toyEncoderDecoder(original, mask, GRID),
    [original, mask],
  );

  const methods = [
    { name: 'Global mean baseline', recon: globalMean },
    { name: 'Local neighbor baseline', recon: localNeighbor },
    { name: 'Toy encoder-decoder', recon: toy },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">图像类型</label>
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value as ImageType)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {IMAGE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-[2]">
          <label className="text-sm font-medium text-gray-700">
            遮罩比例：{Math.round(maskRatio * 100)}%
          </label>
          <Slider
            value={[maskRatio]}
            min={0}
            max={0.9}
            step={0.05}
            onValueChange={([v]) => setMaskRatio(v)}
            className="mt-2"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImageSeed((s) => s + 1)}>
            换图
          </Button>
          <Button variant="outline" onClick={() => setMaskSeed((s) => s + 1)}>
            重新采样遮罩
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <PatchCard title="原图">
          <PatchGrid values={original} mask={Array(original.length).fill(false)} />
        </PatchCard>
        <PatchCard title="MAE 输入">
          <PatchGrid values={original} mask={mask} showMasked />
        </PatchCard>
        {methods.map((m) => (
          <PatchCard key={m.name} title={m.name}>
            <PatchGrid values={m.recon} mask={Array(original.length).fill(false)} />
          </PatchCard>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">方法</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700">
                Masked-patch MSE
              </th>
              <th className="px-4 py-2 text-right font-medium text-gray-700">
                All-patch MSE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {methods.map((m) => (
              <tr key={m.name}>
                <td className="px-4 py-2 text-gray-700">{m.name}</td>
                <td className="px-4 py-2 text-right font-mono text-gray-900">
                  {maskedMSE(original, m.recon, mask).toFixed(4)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-gray-900">
                  {allPatchMSE(original, m.recon).toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900 space-y-2">
        <p className="font-medium">Masked Autoencoder 目标</p>
        <p>
          MAE 把输入图像切分成 patch，按一定比例随机遮住大部分 patch。Encoder 只处理
          <strong>可见 patch</strong>
          ，Decoder 接收这些隐表示并重建<strong>全部 patch</strong>。损失函数只在被遮住的 patch 上计算 MSE：
        </p>
        <p className="font-mono text-xs bg-white/60 rounded p-2">
          {'L = (1 / |M|) Σ_{i ∈ M} (x_i - x_hat_i)^2'}
        </p>
        <p>
          因此 masked-patch MSE 才是训练真正优化的指标；all-patch MSE 同时惩罚可见 patch 的失真，反映整体视觉质量。玩具重建器（toy）仅做平滑插值，不代表真实 MAE 的学习能力。
        </p>
      </div>
    </div>
  );
}

function PatchCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-700">{title}</p>
      {children}
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
      style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
    >
      {values.map((v, i) => {
        const color = showMasked && mask[i] ? 'rgb(209,213,219)' : valueToColor(v);
        return (
          <div
            key={i}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-sm"
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
