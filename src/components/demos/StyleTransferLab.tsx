import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import {
  gramMatrix,
  interpolateFeatures,
  permuteSpatialPositions,
  squaredFeatureLoss,
  styleMatrixLoss,
} from '@/lib/math/styleTransfer';

const content = [[1, 0, 1, 0], [0, 1, 0, 1]];
const style = [[1, 0, 1, 0], [1, 0, 1, 0]];
const spatialPermutation = [2, 0, 3, 1];

function Matrix({ title, values }: { title: string; values: number[][] }) {
  return <div><h4 className="mb-2 text-sm font-semibold text-gray-700">{title}</h4><div className="inline-grid gap-1 rounded-lg border bg-gray-50 p-2" style={{ gridTemplateColumns: `repeat(${values[0].length}, minmax(2.5rem, 1fr))` }}>{values.flatMap((row, y) => row.map((value, x) => <span className="rounded bg-white px-2 py-1 text-center font-mono text-sm" key={`${x}-${y}`}>{value.toFixed(2)}</span>))}</div></div>;
}

export default function StyleTransferLab() {
  const [styleAmount, setStyleAmount] = useState(0.5);
  const [permuted, setPermuted] = useState(false);
  const targetStyle = useMemo(() => permuted ? permuteSpatialPositions(style, spatialPermutation) : style, [permuted]);
  const generated = useMemo(() => interpolateFeatures(content, targetStyle, styleAmount), [targetStyle, styleAmount]);
  const contentLoss = squaredFeatureLoss(generated, content);
  const styleLoss = styleMatrixLoss(generated, targetStyle);

  return (
    <InteractiveDemo title="风格迁移实验：Gram 矩阵看见什么？">
      <div className="space-y-6">
        <p className="text-sm text-gray-700">每行是一条特征通道，每列是一个空间位置。打乱所有通道的列顺序会改变内容布局，却不会改变 Gram 矩阵。</p>
        <div aria-label="风格迁移 Gram 矩阵实验控制区" className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-gray-700">风格混合量：{styleAmount.toFixed(2)}<Slider value={[styleAmount]} min={0} max={1} step={0.05} onValueChange={([value]) => setStyleAmount(value)} /></label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input checked={permuted} onChange={(event) => setPermuted(event.target.checked)} type="checkbox" />打乱风格特征的空间位置</label>
        </div>
        <div className="grid gap-5 lg:grid-cols-3"><Matrix title="生成特征 A(G)" values={generated} /><Matrix title="风格特征 A(S)" values={targetStyle} /><Matrix title="风格 Gram F(S)" values={gramMatrix(targetStyle)} /></div>
        <div className="grid gap-3 sm:grid-cols-2 text-center"><div className="rounded-xl bg-blue-50 p-4"><span className="block text-sm text-gray-600">内容特征平方差</span><strong>{contentLoss.toFixed(3)}</strong></div><div className="rounded-xl bg-amber-50 p-4"><span className="block text-sm text-gray-600">归一化风格矩阵损失</span><strong>{styleLoss.toFixed(4)}</strong></div></div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950"><strong>反例：</strong>勾选空间置换后，风格图案的位置已改变，但 Gram 矩阵保持相同。因此它适合表示与位置弱相关的纹理统计，不足以单独保存内容布局。</div>
      </div>
    </InteractiveDemo>
  );
}
