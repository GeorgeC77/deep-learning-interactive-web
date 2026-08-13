import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import KaTeX from '@/components/KaTeX';
import { visionTokenization } from '@/lib/math/multimodalTokens';

const IMAGE_SIZES = [128, 256, 384];
const PATCH_SIZES = [8, 16, 32];

export default function MultimodalTokenLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [imageSize, setImageSize] = useState(256);
  const [patchSize, setPatchSize] = useState(16);
  const result = useMemo(
    () => visionTokenization(imageSize, imageSize, 3, patchSize),
    [imageSize, patchSize],
  );

  return (
    <InteractiveDemo title="多模态实验：token 化如何决定注意力成本">
      <div className="space-y-6">
        <PredictionGate
          resetKey="chapter09-multimodal-tokenization"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="图像边长不变时，把 patch 边长从 16 加倍到 32，标准注意力矩阵的元素数变为原来的多少？"
          hint="token 数在高、宽两个轴都减半；注意力矩阵又对 token 数平方。"
          options={[
            { value: 'sixteenth', label: '1/16' },
            { value: 'quarter', label: '1/4' },
            { value: 'half', label: '1/2' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'sixteenth',
            category: '视觉 token 复杂度',
            feedback: answer === 'sixteenth'
              ? '正确。每轴 patch 数减半，总 token 数变为 1/4，N² 注意力矩阵因此变为 1/16。'
              : '先算二维 patch 数 N=HW/P²，再对 N 平方；patch 边长加倍会带来四次方级的配对数变化。',
          })}
          revealContent={<KaTeX math={String.raw`N=\frac{HW}{P^2},\qquad N^2=\frac{H^2W^2}{P^4}`} display />}
        />

        {submitted && (
          <div aria-label="多模态 token 化实验控制区" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-white p-4">
                <p className="text-sm font-bold text-gray-800">图像边长</p>
                <div className="mt-3 flex flex-wrap gap-2">{IMAGE_SIZES.map((size) => <button key={size} type="button" onClick={() => setImageSize(size)} className={`rounded-lg border px-3 py-2 text-sm ${imageSize === size ? 'border-blue-600 bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{size}×{size}</button>)}</div>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <p className="text-sm font-bold text-gray-800">patch 边长 P</p>
                <div className="mt-3 flex flex-wrap gap-2">{PATCH_SIZES.filter((size) => imageSize % size === 0).map((size) => <button key={size} type="button" onClick={() => setPatchSize(size)} className={`rounded-lg border px-3 py-2 text-sm ${patchSize === size ? 'border-violet-600 bg-violet-600 text-white' : 'bg-white text-gray-700'}`}>{size}</button>)}</div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3 text-center">
              <div className="rounded-xl bg-blue-50 p-4"><span className="block text-sm text-gray-600">patch token 数</span><strong className="text-2xl text-blue-800">{result.tokens.toLocaleString()}</strong></div>
              <div className="rounded-xl bg-violet-50 p-4"><span className="block text-sm text-gray-600">每个 patch 展平维度</span><strong className="text-2xl text-violet-800">{result.patchDimension.toLocaleString()}</strong></div>
              <div className="rounded-xl bg-amber-50 p-4"><span className="block text-sm text-gray-600">注意力配对 N²</span><strong className="text-2xl text-amber-800">{result.attentionPairs.toLocaleString()}</strong></div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              若逐像素作为 token，需要 {result.pixelAttentionPairs.toLocaleString()} 个注意力配对；当前 patch 化减少为其约 1/{Math.round(result.reduction).toLocaleString()}。统一 Transformer 核心层的前提，是先为每种模态设计可承受且保留关键信息的表示。
            </div>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
