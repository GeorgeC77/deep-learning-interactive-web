import { useEffect, useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  computeOutputSize,
  computeSamePadding,
  applyConvolution,
  type CustomPadding,
} from '@/lib/math/conv';

type Mode = 'valid' | 'custom' | 'same';

export default function ConvolutionSizeDemo() {
  const [I, setI] = useState(32);
  const [K, setK] = useState(3);
  const [P, setP] = useState(1);
  const [S, setS] = useState(2);
  const [mode, setMode] = useState<Mode>('same');
  const [frame, setFrame] = useState(0);

  const isPEditable = mode === 'custom';

  const { left, right, outputSize: O } = useMemo(() => {
    if (mode === 'valid') {
      return { left: 0, right: 0, outputSize: computeOutputSize(I, K, 0, S) };
    }
    if (mode === 'custom') {
      return {
        left: P,
        right: P,
        outputSize: computeOutputSize(I, K, P, S),
      };
    }
    const same = computeSamePadding(I, K, S);
    return {
      left: same.left,
      right: same.right,
      outputSize: same.outputSize,
    };
  }, [I, K, P, S, mode]);

  // Valid mode forces P = 0.
  useEffect(() => {
    if (mode === 'valid') setP(0);
  }, [mode]);

  // Animate the convolution window across output positions.
  useEffect(() => {
    if (O < 1) return;
    setFrame(0);
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % O);
    }, 800);
    return () => clearInterval(id);
  }, [O]);

  // Sample data for the 1D visualization.
  const sampleInput = useMemo(
    () => Array.from({ length: I }, (_, i) => Math.sin((i / Math.max(I - 1, 1)) * Math.PI)),
    [I],
  );
  const sampleKernel = useMemo(() => Array.from({ length: K }, () => 1 / K), [K]);

  // The animation uses the same padding logic but follows the chosen stride S,
  // so the number of animated steps matches the displayed output size O.
  const animPad: CustomPadding = useMemo(() => {
    if (mode === 'valid') return { left: 0, right: 0 };
    if (mode === 'custom') return { left: P, right: P };
    const same = computeSamePadding(I, K, S);
    return { left: same.left, right: same.right };
  }, [I, K, P, S, mode]);

  const animOutput = useMemo(
    () =>
      applyConvolution(
        sampleInput,
        sampleKernel,
        mode,
        mode === 'custom' ? animPad : undefined,
        S,
      ),
    [sampleInput, sampleKernel, mode, animPad, S],
  );
  const paddedInput = useMemo(
    () => Array<number>(animPad.left).fill(0).concat(sampleInput, Array<number>(animPad.right).fill(0)),
    [sampleInput, animPad],
  );

  const windowStart = frame * S - animPad.left;
  const maxInput = Math.max(...paddedInput.map(Math.abs), 1e-6);
  const maxOutput = Math.max(...animOutput.map(Math.abs), 1e-6);

  const isAsymmetric = mode === 'same' && left !== right;
  const isSameStrideGt1 = mode === 'same' && S > 1;

  return (
    <InteractiveDemo title="卷积输出尺寸与 padding 选择">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>输入尺寸 I</span>
              <span>{I}</span>
            </div>
            <Slider value={[I]} min={4} max={64} step={1} onValueChange={(v) => setI(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>核尺寸 K</span>
              <span>{K}</span>
            </div>
            <Slider value={[K]} min={1} max={15} step={1} onValueChange={(v) => setK(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>步幅 S</span>
              <span>{S}</span>
            </div>
            <Slider value={[S]} min={1} max={8} step={1} onValueChange={(v) => setS(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>填充 P</span>
              <span>{mode === 'same' ? `${left} / ${right}` : P}</span>
            </div>
            <Slider
              value={[P]}
              min={0}
              max={16}
              step={1}
              disabled={!isPEditable}
              onValueChange={(v) => setP(v[0])}
            />
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Padding 模式</div>
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valid">Valid（无填充）</SelectItem>
                <SelectItem value="custom">Custom（对称填充）</SelectItem>
                <SelectItem value="same">SAME（自动填充）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">输出尺寸 O</div>
            <div className="text-3xl font-bold text-blue-700">{O >= 1 ? O : '无效'}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">左侧填充</div>
              <div className="text-xl font-semibold text-gray-800">{left}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500">右侧填充</div>
              <div className="text-xl font-semibold text-gray-800">{right}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <KaTeX
              math={String.raw`O = \left\lfloor \frac{${I} + ${left} + ${right} - ${K}}{${S}} \right\rfloor + 1 = ${O >= 1 ? O : "\\text{无效}"}`}
            />
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Valid convolution：</strong>P=0，输出尺寸自然缩小。当前 O={O >= 1 ? O : '无效'}。
            </p>
            <p>
              <strong>Custom padding：</strong>用户指定对称填充 P，输出按标准公式计算。
            </p>
            <p>
              <strong>SAME padding：</strong>按 TensorFlow/PyTorch 规则令 O=⌈I/S⌉，并自动计算左右填充。
              {isSameStrideGt1 && (
                <span className="text-amber-700 block mt-1">
                  注意：S&gt;1 时 SAME 的输出为 ⌈I/S⌉={Math.ceil(I / S)}，而非保持 I。
                </span>
              )}
              {isAsymmetric && (
                <span className="text-amber-700 block mt-1">
                  注意：核尺寸 K 为偶数时 SAME 的左右填充不对称（左 {left}，右 {right}）。
                </span>
              )}
            </p>
            {O < 1 && (
              <p className="text-red-600 font-medium">
                当前参数导致输出尺寸非正，请增大 I、P 或减小 K、S。
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="text-sm font-medium text-gray-700 mb-4">1D 卷积窗口动画（示例输入与平均核）</div>

        <div className="space-y-4">
          <div className="flex items-end gap-1 h-24 overflow-x-auto pb-2">
            {paddedInput.map((value, idx) => {
              const inWindow = idx >= windowStart && idx < windowStart + K;
              const isPadding = idx < animPad.left || idx >= animPad.left + I;
              return (
                <div key={idx} className="flex flex-col items-center gap-1 min-w-[1.25rem]">
                  <div
                    className={[
                      'w-4 rounded-t transition-all duration-300',
                      inWindow ? 'bg-indigo-500' : isPadding ? 'bg-gray-300' : 'bg-blue-400',
                    ].join(' ')}
                    style={{ height: `${(Math.abs(value) / maxInput) * 80 + 4}px` }}
                  />
                  <div
                    className={[
                      'w-5 h-5 text-[10px] flex items-center justify-center rounded border',
                      inWindow
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-transparent text-gray-500',
                    ].join(' ')}
                  >
                    {isPadding ? '0' : idx - animPad.left + 1}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {sampleKernel.map((value, idx) => (
              <div
                key={idx}
                className="min-w-[1.25rem] text-center text-xs font-medium text-indigo-700 bg-indigo-50 rounded px-1 py-0.5"
              >
                {value.toFixed(2)}
              </div>
            ))}
            <span className="text-xs text-gray-500 ml-2">kernel</span>
          </div>

          <div className="flex items-end gap-1 h-20 overflow-x-auto pb-2">
            {animOutput.map((value, idx) => {
              const active = idx === frame;
              return (
                <div key={idx} className="flex flex-col items-center gap-1 min-w-[1.25rem]">
                  <div
                    className={[
                      'w-4 rounded-t transition-all duration-300',
                      active ? 'bg-emerald-500' : 'bg-emerald-300',
                    ].join(' ')}
                    style={{ height: `${(Math.abs(value) / maxOutput) * 60 + 4}px` }}
                  />
                  <div
                    className={[
                      'text-[10px] rounded px-1',
                      active ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-gray-500',
                    ].join(' ')}
                  >
                    {value.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
