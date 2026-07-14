import { useEffect, useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  convParams,
  convConnectionCount,
  convWeightParams,
  convBiasParams,
  locallyConnectedParams,
  locallyConnectedConnectionCount,
  locallyConnectedWeightParams,
  locallyConnectedBiasParams,
  denseParams,
  denseConnectionCount,
  denseWeightParams,
  denseBiasParams,
} from '@/lib/math/parameterSharing';

const MAX_SPATIAL = 16;
const MAX_CHANNELS = 8;
const MAX_KERNEL = 7;

function applyConv1D(input: number[], kernel: number[]): number[] {
  const output: number[] = [];
  const K = kernel.length;
  const O = input.length - K + 1;
  for (let i = 0; i < O; i++) {
    let sum = 0;
    for (let k = 0; k < K; k++) {
      sum += input[i + k] * kernel[k];
    }
    output.push(sum);
  }
  return output;
}

function applyLocal1D(input: number[], weights: number[][]): number[] {
  const output: number[] = [];
  const K = weights[0]?.length ?? 0;
  for (let i = 0; i < weights.length; i++) {
    let sum = 0;
    for (let k = 0; k < K; k++) {
      sum += input[i + k] * weights[i][k];
    }
    output.push(sum);
  }
  return output;
}

function seededRandom(seed: number): number {
  const s = (seed * 9301 + 49297) % 233280;
  return s / 233280;
}

function valueFill(value: number): string {
  if (value > 0) return '#3b82f6';
  if (value < 0) return '#ef4444';
  return '#e5e7eb';
}

interface SliceSvgProps {
  title: string;
  inputBase: number[];
  outputBase: number[];
  inputShifted: number[];
  outputShifted: number[];
}

function SliceSvg({
  title,
  inputBase,
  outputBase,
  inputShifted,
  outputShifted,
}: SliceSvgProps) {
  const cellSize = 24;
  const gap = 2;
  const labelWidth = 56;
  const groupGap = 16;
  const rowHeight = cellSize + 6;
  const maxLen = Math.max(
    inputBase.length,
    outputBase.length,
    inputShifted.length,
    outputShifted.length,
  );
  const svgWidth = labelWidth + maxLen * (cellSize + gap) + 16;
  const svgHeight = 4 * rowHeight + groupGap + 8;

  const baseMax = Math.max(
    1e-6,
    ...inputBase.map(Math.abs),
    ...outputBase.map(Math.abs),
  );
  const shiftedMax = Math.max(
    1e-6,
    ...inputShifted.map(Math.abs),
    ...outputShifted.map(Math.abs),
  );

  function renderRow(
    data: number[],
    y: number,
    label: string,
    scale: number,
  ) {
    return (
      <g key={label}>
        <text
          x={0}
          y={y + cellSize / 2 + 4}
          className="text-[10px] fill-gray-600"
        >
          {label}
        </text>
        {data.map((v, i) => {
          const x = labelWidth + i * (cellSize + gap);
          const opacity = Math.min(1, Math.abs(v) / scale);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={4}
              fill={valueFill(v)}
              fillOpacity={opacity}
              stroke="#d1d5db"
              strokeWidth={1}
            />
          );
        })}
      </g>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full bg-white border border-gray-200 rounded-lg"
        style={{ maxHeight: 160 }}
      >
        {renderRow(inputBase, 4, '原始输入', baseMax)}
        {renderRow(outputBase, 4 + rowHeight, '原始输出', baseMax)}
        {renderRow(
          inputShifted,
          4 + 2 * rowHeight + groupGap,
          '平移输入',
          shiftedMax,
        )}
        {renderRow(
          outputShifted,
          4 + 3 * rowHeight + groupGap,
          '平移输出',
          shiftedMax,
        )}
      </svg>
    </div>
  );
}

export default function ParameterSharingLab() {
  const [Hin, setHin] = useState(10);
  const [Win, setWin] = useState(10);
  const [Hout, setHout] = useState(8);
  const [Wout, setWout] = useState(8);
  const [Cin, setCin] = useState(1);
  const [Cout, setCout] = useState(1);
  const [Kh, setKh] = useState(3);
  const [Kw, setKw] = useState(3);
  const [shift, setShift] = useState(2);

  useEffect(() => {
    setShift((s) => Math.min(s, Math.max(1, Hin - 1)));
  }, [Hin]);

  const convConnections = useMemo(
    () => convConnectionCount(Hout, Wout, Cout, Kh, Kw, Cin),
    [Hout, Wout, Cout, Kh, Kw, Cin],
  );
  const localConnections = useMemo(
    () => locallyConnectedConnectionCount(Hout, Wout, Cout, Kh, Kw, Cin),
    [Hout, Wout, Cout, Kh, Kw, Cin],
  );
  const denseConnections = useMemo(
    () => denseConnectionCount(Hin, Win, Cin, Hout, Wout, Cout),
    [Hin, Win, Cin, Hout, Wout, Cout],
  );
  const convP = useMemo(
    () => convParams(Kh, Kw, Cin, Cout),
    [Kh, Kw, Cin, Cout],
  );
  const localP = useMemo(
    () => locallyConnectedParams(Hout, Wout, Kh, Kw, Cin, Cout),
    [Hout, Wout, Kh, Kw, Cin, Cout],
  );
  const denseP = useMemo(
    () => denseParams(Hin, Win, Cin, Hout, Wout, Cout),
    [Hin, Win, Cin, Hout, Wout, Cout],
  );
  const localConvRatio = convP > 0 ? localP / convP : 0;

  // 1D slice for the translation-equivariance experiment.
  const inputLen = Hin;
  const kernelLen = Kh;
  const outputLen = inputLen - kernelLen + 1;
  const experimentValid = outputLen > 0;

  const spotBase = Math.floor(inputLen / 3);
  const spotShifted = Math.min(inputLen - 1, spotBase + shift);

  const inputBase = useMemo(
    () => Array.from({ length: inputLen }, (_, i) => (i === spotBase ? 1 : 0)),
    [inputLen, spotBase],
  );
  const inputShifted = useMemo(
    () =>
      Array.from({ length: inputLen }, (_, i) => (i === spotShifted ? 1 : 0)),
    [inputLen, spotShifted],
  );

  const kernel = useMemo(
    () =>
      Array.from({ length: kernelLen }, (_, i) =>
        i === 0 ? 1 : i === kernelLen - 1 ? -1 : 0,
      ),
    [kernelLen],
  );

  const convBase = useMemo(
    () => applyConv1D(inputBase, kernel),
    [inputBase, kernel],
  );
  const convShifted = useMemo(
    () => applyConv1D(inputShifted, kernel),
    [inputShifted, kernel],
  );

  const localWeights = useMemo(
    () =>
      Array.from({ length: Math.max(0, outputLen) }, (_, j) =>
        kernel.map((v, k) => v * (0.6 + 0.4 * seededRandom(j * 100 + k))),
      ),
    [outputLen, kernel],
  );
  const localBase = useMemo(
    () => applyLocal1D(inputBase, localWeights),
    [inputBase, localWeights],
  );
  const localShifted = useMemo(
    () => applyLocal1D(inputShifted, localWeights),
    [inputShifted, localWeights],
  );

  return (
    <InteractiveDemo title="参数共享：连接数、参数量与平移等变性">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>输入高 Hin</span>
                <span>{Hin}</span>
              </div>
              <Slider
                value={[Hin]}
                min={1}
                max={MAX_SPATIAL}
                step={1}
                onValueChange={(v) => setHin(v[0])}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>输入宽 Win</span>
                <span>{Win}</span>
              </div>
              <Slider
                value={[Win]}
                min={1}
                max={MAX_SPATIAL}
                step={1}
                onValueChange={(v) => setWin(v[0])}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>输出高 Hout</span>
                <span>{Hout}</span>
              </div>
              <Slider
                value={[Hout]}
                min={1}
                max={MAX_SPATIAL}
                step={1}
                onValueChange={(v) => setHout(v[0])}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>输出宽 Wout</span>
                <span>{Wout}</span>
              </div>
              <Slider
                value={[Wout]}
                min={1}
                max={MAX_SPATIAL}
                step={1}
                onValueChange={(v) => setWout(v[0])}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>输入通道 Cin</span>
                <span>{Cin}</span>
              </div>
              <Slider
                value={[Cin]}
                min={1}
                max={MAX_CHANNELS}
                step={1}
                onValueChange={(v) => setCin(v[0])}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>输出通道 Cout</span>
                <span>{Cout}</span>
              </div>
              <Slider
                value={[Cout]}
                min={1}
                max={MAX_CHANNELS}
                step={1}
                onValueChange={(v) => setCout(v[0])}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>核高 Kh</span>
                <span>{Kh}</span>
              </div>
              <Slider
                value={[Kh]}
                min={1}
                max={MAX_KERNEL}
                step={1}
                onValueChange={(v) => setKh(v[0])}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>核宽 Kw</span>
                <span>{Kw}</span>
              </div>
              <Slider
                value={[Kw]}
                min={1}
                max={MAX_KERNEL}
                step={1}
                onValueChange={(v) => setKw(v[0])}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>输入亮点平移量</span>
              <span>{shift}</span>
            </div>
            <Slider
              value={[shift]}
              min={0}
              max={Math.max(0, Hin - 1)}
              step={1}
              onValueChange={(v) => setShift(v[0])}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">当前连接数（卷积 / 局部）</div>
            <div className="text-3xl font-bold text-blue-700">
              {convConnections.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Dense 连接数使用完整输入维度：{denseConnections.toLocaleString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">层类型</th>
                  <th className="p-2 border text-right">Connections</th>
                  <th className="p-2 border text-right">Weight params</th>
                  <th className="p-2 border text-right">Bias params</th>
                  <th className="p-2 border text-right">Total params</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2 border font-medium">卷积 Conv</td>
                  <td className="p-2 border text-right font-mono">
                    {convConnections.toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {convWeightParams(Kh, Kw, Cin, Cout).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {convBiasParams(Cout).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {convP.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2 border font-medium">局部连接</td>
                  <td className="p-2 border text-right font-mono">
                    {localConnections.toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {locallyConnectedWeightParams(Hout, Wout, Kh, Kw, Cin, Cout).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {locallyConnectedBiasParams(Hout, Wout, Cout).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {localP.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2 border font-medium">全连接 Dense</td>
                  <td className="p-2 border text-right font-mono">
                    {denseConnections.toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {denseWeightParams(Hin, Win, Cin, Hout, Wout, Cout).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {denseBiasParams(Hout, Wout, Cout).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right font-mono">
                    {denseP.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-sm text-amber-800">
              局部连接 / 卷积 参数比
            </div>
            <div className="text-2xl font-bold text-amber-700">
              {localConvRatio.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              这里出现 H<sup>2</sup>：
              <KaTeX
                math={String.raw`\frac{P_{\mathrm{local}}}{P_{\mathrm{conv}}} = H_{\mathrm{out}} W_{\mathrm{out}} = ${Hout * Wout}`}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="text-xs text-gray-600 mb-2">
              连接数（ wiring ）与参数量（ learnable scalars ）不同：Conv 与 Local 有相同的局部连接图，
              但 Conv 跨空间共享权重，因此 Weight params 远小于 Local；Dense 使用全连接图，连接数更多。
            </div>
            <KaTeX
              math={String.raw`P_{\mathrm{conv}} = K_h K_w C_{\mathrm{in}} C_{\mathrm{out}} + C_{\mathrm{out}}`}
            />
            <KaTeX
              math={String.raw`P_{\mathrm{local}} = H_{\mathrm{out}} W_{\mathrm{out}} K_h K_w C_{\mathrm{in}} C_{\mathrm{out}} + H_{\mathrm{out}} W_{\mathrm{out}} C_{\mathrm{out}}`}
            />
            <KaTeX
              math={String.raw`P_{\mathrm{dense}} = H_{\mathrm{in}} W_{\mathrm{in}} C_{\mathrm{in}} H_{\mathrm{out}} W_{\mathrm{out}} C_{\mathrm{out}} + H_{\mathrm{out}} W_{\mathrm{out}} C_{\mathrm{out}}`}
            />
            <KaTeX
              math={String.raw`\# \mathrm{connections}_{\mathrm{conv/local}} = H_{\mathrm{out}} W_{\mathrm{out}} C_{\mathrm{out}} K_h K_w C_{\mathrm{in}}`}
            />
            <KaTeX
              math={String.raw`\# \mathrm{connections}_{\mathrm{dense}} = H_{\mathrm{in}} W_{\mathrm{in}} C_{\mathrm{in}} H_{\mathrm{out}} W_{\mathrm{out}} C_{\mathrm{out}}`}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="text-sm font-medium text-gray-700 mb-2">
          平移等变性实验（1D 切片）
        </div>
        <p className="text-xs text-gray-500 mb-4">
          实验取输入长度 = Hin，输出长度 = Hin − Kh + 1。移动输入亮点后，卷积输出同步平移；局部连接因每个输出位置权重不同，输出图案改变。
        </p>

        {!experimentValid && (
          <p className="text-sm text-red-600">
            当前 Hin &lt; Kh，无法生成有效的 1D 卷积输出，请增大 Hin 或减小 Kh。
          </p>
        )}

        {experimentValid && (
          <div className="grid md:grid-cols-2 gap-6">
            <SliceSvg
              title="卷积（参数共享）"
              inputBase={inputBase}
              outputBase={convBase}
              inputShifted={inputShifted}
              outputShifted={convShifted}
            />
            <SliceSvg
              title="局部连接（无共享）"
              inputBase={inputBase}
              outputBase={localBase}
              inputShifted={inputShifted}
              outputShifted={localShifted}
            />
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
