import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { applyConvolution, computeSamePadding } from '@/lib/math/conv';

type TransformMode = 'shift1' | 'shiftStride' | 'permute' | 'boundary';

const MODE_LABELS: Record<TransformMode, string> = {
  shift1: '平移 1 像素',
  shiftStride: '平移一个步幅',
  permute: '随机像素置换',
  boundary: '边界平移',
};

function shift1D(signal: number[], shift: number): number[] {
  const n = signal.length;
  if (shift === 0) return signal;
  return signal.map((_, i) => signal[(i - shift + n * 10) % n]);
}

function randomPermutation(n: number, seed = 42): number[] {
  const perm = Array.from({ length: n }, (_, i) => i);
  let rng = seed;
  function rand() {
    rng = (rng * 1664525 + 1013904223) | 0;
    return (rng >>> 0) / 4294967296;
  }
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

function applyPermute(signal: number[], perm: number[]): number[] {
  return perm.map((idx) => signal[idx]);
}

export default function TranslationEquivarianceLab() {
  const [mode, setMode] = useState<TransformMode>('shift1');
  const [stride, setStride] = useState(2);
  const [kernelSize, setKernelSize] = useState(3);

  const input = useMemo(() => [0, 0, 1, 2, 3, 2, 1, 0, 0, 0], []);
  const kernel = useMemo(
    () => Array.from({ length: kernelSize }, (_, i) => (i === Math.floor(kernelSize / 2) ? 1 : 0)),
    [kernelSize],
  );

  const samePad = useMemo(() => computeSamePadding(input.length, kernelSize, stride), [input.length, kernelSize, stride]);

  const f = (x: number[]) => applyConvolution(x, kernel, 'same', undefined, stride);

  const transformInput = (x: number[]): number[] => {
    switch (mode) {
      case 'shift1':
        return shift1D(x, 1);
      case 'shiftStride':
        return shift1D(x, stride);
      case 'boundary':
        return shift1D(x, -samePad.left);
      case 'permute': {
        const perm = randomPermutation(x.length);
        return applyPermute(x, perm);
      }
    }
  };

  const transformOutput = (y: number[]): number[] => {
    switch (mode) {
      case 'shift1':
        return shift1D(y, 1);
      case 'shiftStride':
        return shift1D(y, 1);
      case 'boundary':
        // Boundary shift: attempt to align by the same pixel displacement used on the input.
        return shift1D(y, -samePad.left);
      case 'permute': {
        // Convolution is not permutation equivariant; the output has no natural corresponding permutation.
        return y;
      }
    }
  };

  const tx = transformInput(input);
  const fTx = f(tx);
  const fx = f(input);
  const Tfx = transformOutput(fx);

  const length = Math.min(fTx.length, Tfx.length);
  const equivarianceError = useMemo(() => {
    let max = 0;
    for (let i = 0; i < length; i++) {
      max = Math.max(max, Math.abs(fTx[i] - Tfx[i]));
    }
    return max;
  }, [fTx, Tfx, length]);

  return (
    <InteractiveDemo title="平移等变性实验">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          对 1D 输入做四种变换，分别计算 <strong>f(Tx)</strong> 与 <strong>T(f(x))</strong>，并比较二者的逐点差异。
          严格平移在 compatible padding 下应保持等变；随机像素置换不是卷积的对称性。
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">步幅 S</label>
            <Slider value={[stride]} min={1} max={4} step={1} onValueChange={(v) => setStride(v[0])} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">核尺寸 K</label>
            <Slider value={[kernelSize]} min={1} max={7} step={2} onValueChange={(v) => setKernelSize(v[0])} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(MODE_LABELS) as TransformMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs rounded-lg border ${
                mode === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-700 bg-gray-50 border rounded-lg p-3">
          <p>
            <strong>当前变换：</strong>
            {mode === 'shift1' && '将输入整体右移 1 像素（循环）。'}
            {mode === 'shiftStride' && `将输入整体右移 ${stride} 像素（循环），观察输出是否同步右移。`}
            {mode === 'boundary' && '将输入边界平移以暴露填充不对称性。'}
            {mode === 'permute' && '随机打乱像素顺序；卷积对任意像素置换不是等变的。'}
          </p>
          <p className="mt-1">
            <strong>等变误差 max|f(Tx) − T(f(x))|：</strong>
            <span className={`font-mono font-medium ${equivarianceError > 1e-6 ? 'text-red-600' : 'text-emerald-600'}`}>
              {equivarianceError.toFixed(4)}
            </span>
          </p>
        </div>

        <SignalPlot title="输入 x" signal={input} />
        <SignalPlot title={`变换后输入 T(x) — ${MODE_LABELS[mode]}`} signal={tx} />
        <SignalPlot title="先变换再卷积 f(Tx)" signal={fTx} highlightDiff={Tfx} />
        <SignalPlot title="先卷积再变换 T(fx)" signal={Tfx} highlightDiff={fTx} />
      </div>
    </InteractiveDemo>
  );
}

function SignalPlot({ title, signal, highlightDiff }: { title: string; signal: number[]; highlightDiff?: number[] }) {
  const max = Math.max(...signal.map(Math.abs), 1e-6);
  return (
    <div>
      <div className="text-xs font-medium text-gray-600 mb-1">{title}</div>
      <div className="flex items-end gap-1 h-16 overflow-x-auto pb-1">
        {signal.map((v, i) => {
          const diff = highlightDiff && i < highlightDiff.length ? Math.abs(v - highlightDiff[i]) : 0;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5 min-w-[1.25rem]">
              <div
                className={`w-3 rounded-t ${diff > 1e-6 ? 'bg-red-500' : 'bg-indigo-500'}`}
                style={{ height: `${(Math.abs(v) / max) * 40 + 4}px` }}
              />
              <div className="text-[9px] text-gray-500 font-mono">{v.toFixed(1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
