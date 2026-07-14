import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y: number) {
  return y * (1 - y);
}

function softmax1D(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export default function SaliencyComparisonLab() {
  const [input, setInput] = useState<number[]>([0.5, 1.0, 0.2, -0.3, 0.8]);
  const [weights, setWeights] = useState<number[]>([1.0, 0.8, -0.5, 0.3, -0.2]);
  const [bias, setBias] = useState(0.1);
  const [randomize, setRandomize] = useState(false);
  const [randomWeights, setRandomWeights] = useState<number[] | null>(null);
  const [classIdx, setClassIdx] = useState(0);

  const effectiveWeights = useMemo(
    () => (randomize && randomWeights ? randomWeights : weights),
    [weights, randomize, randomWeights],
  );

  const toggleRandomize = () => {
    setRandomize((prev) => {
      const next = !prev;
      if (next) {
        setRandomWeights(weights.map(() => Math.random() * 2 - 1));
      }
      return next;
    });
  };

  const score = useMemo(() => {
    const z = input.reduce((sum, x, i) => sum + x * effectiveWeights[i], 0) + bias;
    return sigmoid(z);
  }, [input, effectiveWeights, bias]);

  const vanillaGradient = useMemo(
    () => effectiveWeights.map((w) => w * dsigmoid(score)),
    [effectiveWeights, score],
  );

  const gradTimesInput = useMemo(
    () => input.map((x, i) => x * vanillaGradient[i]),
    [input, vanillaGradient],
  );

  const integratedGradients = useMemo(() => {
    const baseline = Array(input.length).fill(0);
    const steps = 20;
    let acc = Array(input.length).fill(0);
    for (let s = 1; s <= steps; s++) {
      const alpha = s / steps;
      const interpolated = input.map((x, i) => baseline[i] + alpha * (x - baseline[i]));
      const z = interpolated.reduce((sum, x, i) => sum + x * effectiveWeights[i], 0) + bias;
      const y = sigmoid(z);
      const grad = effectiveWeights.map((w) => w * dsigmoid(y));
      acc = acc.map((v, i) => v + grad[i]);
    }
    return acc.map((v, i) => v * (input[i] - baseline[i]) / steps);
  }, [input, effectiveWeights, bias]);

  const occlusion = useMemo(() => {
    const baseScore = score;
    return input.map((_, i) => {
      const occluded = input.map((x, j) => (j === i ? 0 : x));
      const z = occluded.reduce((sum, x, j) => sum + x * effectiveWeights[j], 0) + bias;
      return baseScore - sigmoid(z);
    });
  }, [input, effectiveWeights, bias, score]);

  // Two-class softmax toy extension: use same weights for class 0 and negated for class 1.
  const classScores = useMemo(() => {
    const z = input.reduce((sum, x, i) => sum + x * effectiveWeights[i], 0) + bias;
    return [z, -z];
  }, [input, effectiveWeights, bias]);

  const probs = useMemo(() => softmax1D(classScores), [classScores]);

  const saturationInput = useMemo(() => [5.0, 5.0, 5.0, 5.0, 5.0], []);
  const saturationScore = useMemo(() => {
    const z = saturationInput.reduce((sum, x, i) => sum + x * effectiveWeights[i], 0) + bias;
    return sigmoid(z);
  }, [saturationInput, effectiveWeights, bias]);
  const saturationGradient = useMemo(
    () => effectiveWeights.map((w) => w * dsigmoid(saturationScore)),
    [effectiveWeights, saturationScore],
  );

  return (
    <InteractiveDemo title="显著性方法比较">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          玩具模型：y = σ(∑ᵢ wᵢ xᵢ + b)。下方对比四种归因方法，并展示饱和与非相干权重（randomization）
          作为 sanity check。
        </p>

        <div className="space-y-4">
          {input.map((v, i) => (
            <div key={i} className="grid grid-cols-[2rem_1fr_2rem] gap-3 items-center">
              <span className="text-sm font-mono">x{i}</span>
              <Slider value={[v]} min={-2} max={2} step={0.1} onValueChange={(val) => setInput((prev) => prev.map((p, j) => (j === i ? val[0] : p)))} />
              <span className="text-sm font-mono text-right">{v.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {weights.map((w, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs text-gray-500">w{i}</label>
              <Slider value={[w]} min={-2} max={2} step={0.1} onValueChange={(v) => setWeights((prev) => prev.map((p, j) => (j === i ? v[0] : p)))} />
              <div className="text-right font-mono">{w.toFixed(2)}</div>
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">bias</label>
            <Slider value={[bias]} min={-2} max={2} step={0.1} onValueChange={(v) => setBias(v[0])} />
            <div className="text-right font-mono">{bias.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={randomize} onChange={toggleRandomize} />
            随机化权重（sanity check：显著性应改变）
          </label>
          <label className="text-sm text-gray-700">
            选择类别：
            <select value={classIdx} onChange={(e) => setClassIdx(Number(e.target.value))} className="ml-1 border rounded px-1 py-0.5">
              <option value={0}>class 0</option>
              <option value={1}>class 1</option>
            </select>
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          当前分数（class {classIdx}）: <span className="font-mono font-bold">{probs[classIdx].toFixed(4)}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <AttributionPlot title="Vanilla gradient |∂y/∂xᵢ|" values={vanillaGradient.map(Math.abs)} />
          <AttributionPlot title="Gradient × input" values={gradTimesInput} />
          <AttributionPlot title="Integrated gradients" values={integratedGradients} />
          <AttributionPlot title="Occlusion Δy" values={occlusion} />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm space-y-2">
          <p>
            <strong>饱和反例：</strong>当输入 x = [5,5,5,5,5] 时，σ 饱和， vanilla gradient 几乎为 0，
            但输入显然对输出有决定性影响。
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>score = {saturationScore.toFixed(4)}</div>
            <div>mean |gradient| = {(saturationGradient.reduce((a, b) => a + Math.abs(b), 0) / saturationGradient.length).toFixed(5)}</div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          说明：以上方法给出的是输入附近 class score 的 local sensitivity，而非因果重要性。
          当激活函数饱和或模型权重被随机化时，gradient saliency 可能失效。
        </div>
      </div>
    </InteractiveDemo>
  );
}

function AttributionPlot({
  title,
  values,
}: {
  title: string;
  values: number[];
}) {
  const max = Math.max(...values.map(Math.abs), 1e-6);
  return (
    <div className="border rounded-lg p-3">
      <div className="text-xs font-medium text-gray-700 mb-2">{title}</div>
      <div className="flex items-end gap-1 h-20">
        {values.map((v, i) => {
          const positive = v >= 0;
          const h = (Math.abs(v) / max) * 60 + 4;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t ${positive ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ height: `${h}px` }}
              />
              <div className="text-[9px] text-gray-500 font-mono">x{i}</div>
              <div className="text-[9px] text-gray-500 font-mono">{v.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
